---
blog: true
title: 'openGemini: Compaction流程解读'
pubDate: '2023-10-23'
author: 杨昌杰
abstract: 本文主要介绍openGemini中LSM存储引擎的工作流程，如何通过定时Compaction来解决大量的冗余和无效数据占用磁盘空间以及减少读放大。
cover: /images/cover/compaction_flow.png
recommend: 1
category: 技术解读
tag: openGemini, 源码解读
---

# openGemini Compaction 流程解读

openGemini 存储引擎采用 LSM 结构，通过将所有的数据修改操作转换为追加写方式，通过这种方式将磁盘的随机写入转换为顺序写从而提高了写入性能，但是带来了以下问题：

1. 大量的冗余和无效数据占用磁盘空间，造成空间放大。
2. 读取数据时如果内存中没有的话，需要从 L0 层开始进行查找 tssp file，造成读放大。

而解决上述问题主要是通过 compaction 操作将数据进行合并来降低空间放大以及读放大的影响。本文主要介绍 OpenGemini 的 Compaction 流程。

## 什么是 Compaction？

Compaction 是 LSM Tree 非常重要的操作，**指的是把数据从 Ln 层，存储到 Ln+1 层这个过程**，在这个过程中会将重复的旧的数据删除和数据重新排序，减少碎片化和提高读写性能。层级越高的文件，其所含数据越多，对应文件就越大。

## Compaction 过程

openGemini 的 Compaction 主要针对有序数据，对于无序数据处理，参考上一篇文章 openGemini 如何高效处理乱序数据？

![img](/images/docs_img/up-19b3d44e238ebc7fbf7943c0d7e410b3d7b.png)

openGemini 的 Compaction 操作整体过程如图所示，主要分为以下三个阶段：

### 第一阶段：数据写入

在数据写入过程中，当 memtable 达到一定数据阈值大小或到一定的定时周期后，将数据刷到 immutable 中。其中，有序数据写入到有序区域，乱序数据写入到乱序区域。

### 第二阶段：Level Compaction（同层级文件合并）

immutalbe 中的数据刷盘后形成若干个 L0 层文件，L0 层包含乱序数据文件，在图上未画出，乱序区域的文件会定时向有序区域文件中 Merge，称为乱序合并。对于有序文件（例如 L0_f1,L1_f1），按照每一层级指定文件数量进行合并（openGemini 默认是 8 个 L0 层文件合并成一个 L1 层文件），此过程称为 Level Compaction，合并原则为：低层级的文件合并频率高于高层级文件，优先合并最近落盘的文件。由于 openGemini 在写入过程中区分了有序乱序区域，且保证了每个文件内数据按 sid（时间线 ID）有序、每个 sid 对应的数据块按时间有序以及文件之间按时间有序。因此对于 Compaction 合并有序数据来说，可以采取高效的追加写，不需要进行额外的计算操作。

### 第三阶段：Full Compact（跨层级文件合并）

当 openGemini 遇到一段时间没有新数据写入时，将做一次 Full Compact 操作。

Full Compact 是指跨所有层级的文件合并为一个最终的文件，如图上的未合并的 L0_fn, L1_f5, L1_f6 以及 L2_f2 和 L2_f3 这几个文件一起合并为 L3_f1 文件。这个过程中，若数据文件（比如 L2_f1）已经达到一定阈值的时候（openGemini 默认为 8G），就不会参与 Full Compaction，因为这样的文件对读性能不会再有大的增益。

在文件合并的过程中，假设 L1 层的 4 个文件 L1_f1—L1_f4 合并为 L2_f1 文件，如果全部文件加起来的大小为 12G，超过 8G 阈值，则需要将文件进行切分为 1 个 8G 文件和一个 4G 的文件，4G 的文件会在下次 Compaction 时被追加写入新合并的数据。openGemini 对每个层级的文件都有设置大小限制，因此不太可能在 L0 层或者 L1 层出现非常大的文件。

## compaction 的两种方式

### 非流式 compaction

![img](/images/docs_img/up-1725366caba8a961e228a6e2130ef714797.png)

非流式 Compaction 指把待合并文件中相同时间线的数据全部读取到内存中，重新排序合并后写入到新文件中。由于这种方式对内存资源有一定的消耗，稍不注意会有进程 OOM 的风险，因此对文件中时间线的数据大小进行约束，只有小数据量的情况采用该方法。

举个例子，如图所示，tssp1 文件 sid1 和 sid2 对应 chunk 的大小都小于系统设定的预置，compaction 会把 tssp1 和 tssp2 文件中 sid1 chunk 的所有 segment 读出来，重新排序（含对旧数据删除操作），再写入到新的 tssp3 文件中，新生成的文件保持与刷盘时的顺序原则保持一致。除 L0 层文件之外，通常 tssp1 和 tssp2 文件中的数据是不存时间交叉的，合并时仅需做追加即可。

> 对 chunk 和 segment 做一下解释。二者都是逻辑概念，openGemini 的数据文件后缀名为 tssp，每个数据文件在逻辑上被划分为若干个 chunk（类似于插槽），每个 chunk 中保存的数据都属于同一个时间线，这些数据是按列进行组织，segment 代表的是某一列固定行数的数据集合。

### 流式 Compaction

![img](/images/docs_img/up-5aa6e00080de62e5e51170ce35f4b9aaabd.png)流式 compact 指待合并文件中相同时间线的数据不是全部读取到内存中，每次仅读取一部分，合并后再读取，直到全部数据都已合并完成。主要针对时间线对应的数据量较大的情况，若全部读取到内存会造成大量内存占用，容易引起进程 OOM。

如图所示，tssp1 文件中 sid1 待合并的 chunk 大小达到设定阈值时，此时将以单个 segement 为粒度读取数据，按列对多个文件相同 sid 的数据进行流式合并以及写入到新文件，直到所有 sid 对应的 chunks 都合并完成后，完成本次 compaction 流程。

## Shard 内数据文件布局

Compaction 后台任务是以 shard 为单位并发进行的，单个 shard 内完成 L0 层 Compaction 后的目录及文件布局如下：

![img](/images/docs_img/up-690b6edd30cf8ca4df03403d1db8899cd6c.png)

## 总结

本文主要介绍 openGemini 中 LSM 存储引擎的工作流程，openGemini 通过定时 Compaction 来解决大量的冗余和无效数据占用磁盘空间以及减少读放大，合并原则为低层级的文件合并频率高于高层级文件，优先合并最近落盘的文件。希望可以帮助大家更好理解 openGemini 的数据存储实现。

---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
