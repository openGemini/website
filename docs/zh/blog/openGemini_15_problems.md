---
blog: true
title: 关于openGemini的15个典型问题整理
pubDate: '2024-02-02'
author: 向宇
abstract: 本文整理了社区反馈比较多的一些问题
cover: /images/cover/20240202-1.jpeg
recommend: 0
category: 技术解读
tag: openGemini
---

随着社区用户不断增长，用户需求和场景越来越多样化，本文整理了反馈比较多的一些问题，后续还会陆续整理并沉淀在文档中，同时非常欢迎大家通过社区、交流群向我们反馈。

<br/>

**Q1： openGemini下个版本什么时候发？**

A： openGemini下个版本为 v1.2.0，整体上性能有较大的提升，改动也比较多，原计划2024年1月份，现延期到2月底前，推迟的原因主要是想经过充分验证，进一步确保系统稳定性。

<br/>

**Q2： openGemini支持麒麟操作系统吗？**

A： 不支持，社区版本未做过相关兼容性测试。如果麒麟支持了GoLang，可以尝试下载源码进行编译。

<br/>

**Q3： 可以在Windows上运行openGemini进行开发调试吗？**

A： openGemini最新的版本已经支持Mac OS 和 Windows，可以用作系统开发调试。但不建议在非linux环境上生成使用。

<br/>

**Q4：集群环境中，为什么有的节点上会没有数据？**

A： 正常现象，openGemini在写入数据时，ts-sql节点会根据时间线（series key）进行Hash打散，当写入少量时间线数据时，可能恰好被写入到了其他节点。不必担心，当时间线数量较多时，总体上会呈现均匀分布。

<br/>

**Q5： openGemini如何避免写入热点？**

A： 一般来讲，大多数场景不会产生写入热点。但如下情况是不可避免的：比如，一共有100条时间线，然而业务系统始终在频繁写其中某条时间线数据，就会导致存储这条时间线数据的节点成为热点。还有一种更为巧合的情况，业务系统频繁在写多条时间线，他们的数据恰好都落在了同一个节点上，同样会造成热点。

<br/>

**Q6： openGemini中Shard和ShardGroup之间的关系？**

A： 写入的业务数据，最终会落在Shard（分片）中。不同节点上的多个Shard会组成一个ShardGroup（内核中仅仅是个逻辑概念）。把时间拉长一点来看，一个Database会产生很多个ShardGroup，每个ShardGroup又包含有很多Shard。一般的，数据保留策略决定了ShardGroup的数据周期，ShardGroup周期决定了每个Shard的数据周期，这是有[映射关系](https://docs.opengemini.org/zh/guide/schema/retention_policy.html#shard-duration)的。比如数据保留时长是3个月，对应的ShardGroup周期为1天，即Shard也为1天，意味着业务数据在第1天写入Shard-1，第2天则是写入Shard-2（一个新的Shard），同时也会产生一个新的ShardGroup。

<br/>

**Q7：指定了TAG和TIME条件进行查询，查找过程是怎样的？**

A： 通过TAG找到tsids，然后通过tsid去磁盘筛选数据。筛选数据时，按TIME可以确定数据在哪些shard里。具体到文件级，有布隆过滤器，快速过滤掉不包含该tsid数据的文件。

<br/>

**Q8： 单表TAG索引（时间线索引）如果多到一定程度会影响单表查询效率吗？**

A： 影响。TAG的维度越大，TAG索引也会变大，达到一定程度就会影响到查询。这时建议升级规格或者使用[高基数引擎](https://docs.opengemini.org/zh/guide/features/high_series_cardinality.html)

<br/>

**Q9： 有计划支持s3存储吗？**

A： 短期内，至少2024年暂无规划，社区有其他更要紧的工作要做，暂时不会考虑这个特性。如有人愿意贡献，可以联系社区，大家一起看看如何推进。

<br/>

**Q10： 集群扩容需要重启吗？**

A： 不需要，新节点拉起后自动加入，前提是配置文件要对。

<br/>

**Q11： 云服务和开源版哪里不一样？除了一个免费，一个付费。**

A： 内核功能是一致的。云服务作为一种商业服务售卖，包含对数据库的运维和长期的技术支持。此外，云服务还有云特有的功能，比如存算分离、数据冷热分级存储、数据备份恢复等。

<br/>

**Q12： 如何在32位系统上安装openGemini？**

A： 社区暂不考虑支持32位系统的版本，可下载源码尝试编译。

<br/>

**Q13： 原来的默认存储策略是autogen，重新创建了一个保留策略作为默认的保留策略，之前的数据无法查到了，正常吗？**

A： 正常的，要查询原来的数据，需指定原来的PR（保留策略）。如 "SELECT * FROM *db0.autogen.mst* WHERE ..."

<br/>

**Q14： openGemini的数据保留策略（RP）是DB级的，如何实现表级的效果？**

A： 通常，DB可以对应多个数据保留策略。借助这个功能，提前规划好数据表。比如表A内的数据只保留30天，表B的数据值保留90天。那么可以创建2个RP。数据写入时指定RP，CLI客户端不支持指定RP，API或者SDK可以支持：

```shell
# 写数据，db名为'db'，RP名为'test'
curl -i -XPOST 'http://localhost:8086/write?db=db&rp=rp-30' --data-binary 'A,host=server02 value=0.67'
curl -i -XPOST 'http://localhost:8086/write?db=db&rp=rp-90' --data-binary 'B,host=server02 value=0.67'
```

<br/>

**Q15：为什么有时候COUNT的数据不准？**

A：写入数据的时间是历史某个时间点，主要是更新历史数据的情况，COUNT的数据可能会不准。因为COUNT查询的值是提前预处理的，每一次写入，计数器便会加 1，但使用SELECT 查询时，不会返回两条具有相同时间的数据，因此会感觉数据少了。这种情况可以有办法查询真实的统计数据：

```sql
# hint查询，加' /*+ Exact_Static_Query */ '
SELECT /*+ Exact_Static_Query */ COUNT(field_key) FROM measurement_name [WHERE clause]
```

<br/>

### **结束**

Star For Me：https://github.com/openGemini/openGemini

官网：https://opengemini.org/

添加公众号：微信搜索 "openGemini"