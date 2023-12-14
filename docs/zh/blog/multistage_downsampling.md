---
blog: true
title: 多级降采样功能的应用场景及使用条件约束
pubDate: '2023-11-01'
author: 丛广林
abstract: 本文主要介绍了openGemini多级降采样功能，包括应用场景，任务创建、查看和删除，使用条件约束等。多级降采样可以大幅降低数据存储成本和系统成本，但它不会保留原始数据明细，在使用时，请务必了解清楚。
cover: /images/cover/multistage_downsample.png
recommend: 1
category: 技术解读
tag: openGemini, 源码解读
---

## 背景

随着 5G 与 IOT 物联网的快速发展，数据量呈指数型爆发增长。为了更完整体现系统或应用的状态细节，指标采集粒度越来越细致，指标数据量越来越大。业务对于监控数据的使用需求多种多样，如查询最新数据的异常告警，也有查看一整年指标数据的趋势分析展示；数据量越大，查询耗时就越久，如果放在浏览器端处理也要耗费大量的内存。这不但对数据库系统造成了很大的压力，也给用户带来了较差的使用体验。

如 xxx 用户业务场景：

1. 需要对近七天数据提供点查能力，时间窗为 5min 的聚合分析能力
2. 对近一月提供粗粒度，时间窗为 15min 的聚合分析结果
3. 对近一年提供更粗粒度，时间窗为 1h 的聚合分析结果
4. 365 天后该数据可以过期

我们可以发现，在七天之后，并不需要提供详细数据的点查能力。

为了提供更高性能的查询能力，和更低的存储成本，在传统的数据库应用下，大多通过 CQ (Continue Query)、物化视图或者其他操作实现数据降采样，如下为 xxx 用户的之前技术方案：

1. 客户搭建三个 Druid 集群，分别存储 0-7 天原始数据、7-28 天以 15min 窗口降采样后的聚合数据、28 天后以 1h 窗口降采样的聚合数据
2. 原始数据插入到第一个集群，然后到对应时间分别把数据聚合写入到第二个集群和第三个集群
3. 查询时候，通过开发编写三条 SQL 传到对应的集群内进行聚合计算，在客户端进行数据汇总

![img](/images/docs_img/8788753edd2626b6a942f3c3a533a353.png)

我们可以发现有以下几个问题：

1. 集群成本过高，通过三个集群实现该业务；且每新增一级查询业务，需要新增一个查询集群。这样会导致基础的资源开销成本过高，运维难度增加
2. 业务开发需要了解该集群架构、及底层集群状态，才可以新增、维护当前的查询业务，后续业务更新、扩展成本过高

为解决以上问题，openGemini 多级降采样功能应运而生。

## 多级降采样

### 功能介绍

openGemini 多级降采样功能是一个后台任务，相比传统降采样，区别在于“多级”，意味着可以同时支持对 0-T1，T1-T2，T2-T3 等多个时间范围内的数据进行不同时间窗口的降采样，并且会原地替换历史数据明细，节约更多存储空间。

### 创建降采样任务

```java
Create DownSample [on | on .|  ]((dataType(aggregators)...)) With Duration  SampleInterval(time Durations) TimeInterval(time Durations)
```

参数说明：

| dataType                      | Aggregators                                   | Duration     | SampleInterval       | TimeInterval  |
| ----------------------------- | --------------------------------------------- | ------------ | -------------------- | ------------- |
| 具体的数据类型，如 int、float | 聚合方法，当前支持 min、max、sum、count、mean | 数据保留时间 | 执行下一级降采样时间 | 采样 Interval |

_关于 RP 和 shard 的介绍可见之前的文章《openGemini：使集群保持良好写线性度的三种最佳实践方法》_，详细用法可以参考[社区文档](https://docs.opengemini.org/zh/guide/features/downsample.html)

以背景介绍上的场景建立一个降采样为例：

```sql
Create DownSample on db0
 (float(sum,last),integer(max,min))
 With Duration 365d
 sampleinterval(7d,28d)
 timeinterval(15m,1h)
```

这是一个典型的三级降采样任务，由 sampleinterval(7d,28d)来设定，表示降采样周期分为 0-7 天，7-28 天，28 天及以后（最大为 365 天，因为 356 天以后的数据过期了，数据过期由`With Duration 365d`设定）。timeinterval(15m,1h)与 sampleinterval(7d,28d)一一对应，表示 0-7 天保留原始数据明细，正常业务查询即可，7-28 天数据按 15min 时间窗口进行降采样，28 天以后的数据按 1h 时间窗口进行降采样。满足降采样的字段和聚合函数由(float(sum,last),integer(max,min))指定。float(sum,last)表示所有 float 类型的数据会执行 sum()和 last()聚合函数，integer (max,min) 表示所有 integer 类型数据会执行 max()和 min()聚合函数。未被例举的其他类型的数据将丢弃。

在现有例子基础上，如果想给 28-70 天的数据新增一级降采样，降采样时间窗口为 1h，70 天以后数据按 1d 时间窗口聚合，只需简单修改一下命令

```sql
Create DownSample on db0
 (float(sum,last),integer(max,min))
 With Duration 365d
 sampleinterval(7d,28d,70d)
 timeinterval(15m,1h,1d)
```

### 查询降采样任务

如果我们想要知道当前创建的降采样任务，可以使用如下命令：

```
SHOW DOWNSAMPLES ON
样例：
> show downsamples
rpName  field_operator                   duration  sampleInterval    timeInterval
------  --------------                   --------  --------------    ------------
autogen float{sum,last},integer{max,min} 168h0m0s  24h0m0s,48h0m0s   1m0s,3m0s
rp1     float{sum,last},integer{max,min} 720h0m0s  24h0m0s,168h0m0s  1m0s,3m0s
rp2     bool{last},int{max,min,first}    2400h0m0s 168h0m0s,360h0m0s 30m0s,1h0m0s
```

### 删除降采样任务

如果我们想要删除当前创建的降采样任务，可以使用如下命令：

```
Drop DownSamples on [|]
```

如果我们想知道当前 shard 的降采样状态可以使用如下命令：

```java
SHOW DOWNSAMPLES ON
样例：
> show downsamples
rpName  field_operator                   duration  sampleInterval    timeInterval
------  --------------                   --------  --------------    ------------
autogen float{sum,last},integer{max,min} 168h0m0s  24h0m0s,48h0m0s   1m0s,3m0s
rp1     float{sum,last},integer{max,min} 720h0m0s  24h0m0s,168h0m0s  1m0s,3m0s
rp2     bool{last},int{max,min,first}    2400h0m0s 168h0m0s,360h0m0s 30m0s,1h0m0s
```

### 其他约束条件说明

1. 修改降采样保留时间时`With Duration 365d`，会同步修改当前的 db 的 rp 保留策略，这里二者是关联的。非必要不修改，与当前 db 保留策略保持一致即可。
2. 创建降采样任务后，用户侧不感知，会自适应目标查询语句。比如在上面的例子中，业务分组查询 Group by time（1h），内核会将 4 组 15min 的聚合结果组成一个 1h 的结果返回，需要注意的是，分组时间和降采样时间窗口是倍数关系。如果降采样时间窗是 15min，业务查询 Group by time（16min），这是不允许的。
3. SampleInterval 需要为当前建表时 shard Duration 的正整数倍，例如 shard Duration 为 7d，SampleInterval 的最小值为 7d 或者 7 的倍数。_相关阅读_ [shard Duration](https://docs.opengemini.org/zh/guide/schema/retention_policy.html#shard-duration)
4. 下一级的 TimeInterval 需要为前一级的正整数倍，比如例子中的 timeinterval(15m,1h)。不可以是 timeinterval(15m,29min)，因为 29 不是 15 的倍数。
5. 对于 select \*查询，如果查询时间范围涉及降采样的 shard 数据，会不查询，只查询原始数据
6. 如果 shard 已经做过降采样，会禁止写入数据

## 总结

本文主要介绍了 openGemini 多级降采样功能，包括应用场景，任务创建、查看和删除，使用条件约束等。多级降采样可以大幅降低数据存储成本和系统成本，但它不会保留原始数据明细，在使用时，请务必了解清楚。

---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
