---
blog: true
title: openGemini大解析：预聚合
pubDate: '2023-10-27'
author: 范祥
abstract: ​在openGemini中，在数据持久化到文件时，以时间线为维度，计算好了min，max，sum，count 并记录在文件元数据中，我们称为预聚合。 这些预聚合的数据，可以对部分查询场景起到加速的作用（减少磁盘读取和数据解码的开销）。
cover: /images/cover/prepolymerization.png
recommend: 3
category: 技术解读
tag: openGemini, 源码分析
---

# **数据布局**

在介绍预聚合之前，先简单说一下 openGemini 的数据布局。

数据在文件中是按时间线维度进行了划分的，每个时间线有一个独立的数据块(ChunkData)，使用 ChunkMeta 来描述。

如下图所示，水平方向，每个 ChunkData 包含多列；垂直方向，每列按 1000 行为单位切割为 Segment 。

![img](/images/docs_img/7bbdeedfd1441f29bbdb633b49852632.png)

## ChunkMeta

ChunkMeta 相关数据结构如下，本次我们重点关注`timeRange` 和 `ColumnMeta.preAgg`

```
type ChunkMeta struct {
    sid         uint64
    offset      int64
    size        uint32
    columnCount uint32
    segCount    uint32
    timeRange   []SegmentRange // 存放每个 segment 的时间范围
    colMeta     []ColumnMeta // 每列的元数据信息
}

type SegmentRange [2]int64 // min/max

type ColumnMeta struct {
    name    string
    ty      byte
    preAgg  []byte  // 序列化后的预聚合数据
    entries []Segment  // 存放 segment 的偏移量
}
```

## 预聚合数据

-   openGemini 在数据存储时，按时间线维度，提前计算了每列的 min，max，sum，count 的结果，存放在 ColumnMeta 中
-   boolean 和 string 类型的数据仅记录 count， 本次我们以 float,int 类型数据为例

# **查询加速**

**如果一个查询仅通过预聚合数据就能得到结果，那么可以减少磁盘读取, 数据解压等开销，极大的提升查询性能。**

写入样例数据

-   写入如下样例数据并刷盘，此时数据库中仅 1 个文件，2000 行数据，1 条时间线，1 列，2 个 segment

```
insert foo,host=127.0.0.1 val=1 1694654000000000001
insert foo,host=127.0.0.1 val=2 1694654000000000002
insert foo,host=127.0.0.1 val=3 1694654000000000003
... ...
insert foo,host=127.0.0.1 val=1999 1694654000000001999
insert foo,host=127.0.0.1 val=2000 1694654000000002000
```

## 加速 sum, count, min, max 查询

查询条件中的时间范围包含了数据的时间范围

```
SELECT sum(val) from foo where time>1694654000000000000 and time<1694654300000003000
SELECT count(val) from foo where time>1694654000000000000 and time<1694654300000003000
SELECT min(val),max(val) from foo where time>1694654000000000000 and time<1694654300000003000
```

## 加速 first 和 last 算子 （适用于部分查询场景）

-   有的场景，存储的数据是单调递增的，一段时间范围内满足：`min==first`，`max==last`，则可以使用预聚合数据进行加速查询
-   在 ChunkMeta 中有存放每个 segment 的最小和最大时间
-   由于数据是按时间有序排列的，因此最小值对应的时间为第一行数据的时间，最大对应的时间为最后一行数据的时间
-   在满足下列条件时，可以直接取 chunkmeta 中的时间，不需要读取磁盘上的数据

```
first 查询，数据没有空值，且时间范围满足：
query time range:    --------------
segment time range:      ---------------
此时取 segment 的最小时间即可
例如：SELECT first(val) from foo where time>1694654000000000000

last查询，数据没有空值，且时间范围满足：
 query time range:         ----------------
 segment time range: ---------------
 此时取 segment 的最大时间即可
例如：SELECT last(val) from foo where time<1694654000000002001
```

-   了解更多

> https://github.com/openGemini/openGemini/blob/main/engine/immutable/first_last_reader.go

## **补充：**

除了时间范围限制外，还有以下场景不支持预聚合：

1. field 过滤
2. group by time

# **对比测试**

![img](/images/docs_img/c947c5cfe6f73ef371824a9458b4be47.png)

-   特别说明：本测试仅供参考，数据模型和查询模型的差异，测试结果差别可能非常大
-   使用 DevOps 模型中的 redis 表进行测试，参考：
-   http://opengemini.org/116.html
-   精确查询：

```
SELECT /*+ Exact_Statistic_Query */ count(*) FROM redis GROUP BY hostname
```

-   预聚合查询：

```
SELECT count(*) FROM redis GROUP BY hostname
```

# **总结**

预聚合可以有效提升查询性能效率，但目前来说应用范围有待扩展。欢迎大家到社区一起探讨扩展预聚合数据的应用场景，社区将不断推动技术研发，优化用户体验，在未来提供更加丰富、多元的功能。

---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
