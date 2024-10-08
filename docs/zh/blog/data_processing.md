---
blog: true
title: openGemini如何高效处理乱序数据？
pubDate: '2023-10-07'
author: 周益剑
abstract: 如何将CPU开销减少 88.76%，总时延减少83%，一看便知。
cover: /images/cover/data_processing.png
recommend: 0
# category: 技术解读 公司动态 案例实践 社区动态 观点洞察
category: 技术解读
tag: 乱序处理
---

众所周知，在绝大数场景下，时序数据都是按照时间递增顺序入库，但由于网络延迟、设备故障等原因，会造成采集的数据无法保证按序达到，习惯上我们称这些的数据为乱序数据。乱序数据是一种普遍现象，乱序数据处理也是时序数据库必须支持的场景。

本文主要介绍 openGemini 是如何高效地处理乱序数据。

## **高吞吐摄入乱序数据**

![img](/images/docs_img/3a7f0c7ca858ada72da5a521a50240da.png)

openGemini 存储引擎采用 LSM 结构，支持数据高效摄入。数据会在 memtable 聚合到一定大小，再触发刷盘，大幅减少磁盘 IO。

各时间线数据在内存中存在有序和乱序两个区域，有序时间序列数据写入到有序区域，乱序时间区域写入到乱序区域。当 memtable 刷盘时，有序数据刷到磁盘有序区，生成有序文件；乱序数据刷到磁盘乱序区，生成乱序文件。乱序和有序数据处理一致，均可以保持高速摄取。

## **乱序数据高效合并**

![img](/images/docs_img/5b5bff8e4c188593b33c879af0cc9eb3.png)

乱序文件在 openGemini 存储引擎属于 Level0 的文件，优先会尝试乱序文件间进行合并，达到设定的阈值大小后才会和有序文件合并，避免与有序文件高 Level 文件合并产生写放大。

乱序和有序文件合并时，利用乱序文件占比少的特点，有序文件中未包含乱序文件的时间线数据，只需要读取 CunkMeta 元数据，修改偏移量，读取后直接写入新文件即可，减少数据解压、压缩大量操作，大幅降低了 CPU，该优化已经在 v1.1.0-rc1 版本。

## **优化前后实测效果**

测试乱序数据和有序数据只有 5% 的时间线相交。写入有序数据 2.19G，包含 50000 个时间线，同时写入乱序乱序数据 3.5MB，包含 2500 个时间线。

测试结果如下表所示：

![img](/images/docs_img/225ff0a64f1b1dc8ac3c3bbde16721b2.png)

**CPU 开销减少 88.76%，总时延减少 83%，效率提升非常明显。**

## **总结**

openGemini 早期版本支持乱序数据写入，采用方法较为简单粗暴，导致在实际应用场景中，由于乱序数据的持续增加，使得节点计算资源消耗较大。社区在收到问题反馈后，进行了细致的优化，从测试效果来看满足了优化目标。从实际应用效果来看，在华为云内部某业务的生产环境中，乱序文件约为 1 万个，包含的时间线数量在百万到亿之间波动，整体效率提升约百倍+。

极致的使用体验是社区努力的方向，欢迎大家向社区反馈使用中常面临的问题，助力 openGemini 成长。

---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
