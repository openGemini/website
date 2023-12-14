---
blog: true
title: openGemini v1.1.0带来了哪些改变？
pubDate: '2023-10-13'
author: openGemini
abstract: 本次社区在前2个rc版本基础上，稳定性更好，发布v1.1.0正式版本，汇集了哪些改变和提升？一看便知
cover: /images/cover/opengeminiv1.1.0.png
recommend: 0
# category: 技术解读 公司动态 案例实践 社区动态 观点洞察
category: 社区动态
tag: openGemini,版本
---

openGemini 是一款开源、高性能、分布式时序数据库，专注于海量遥测数据存储与分析，采用 MPP 大规模并行处理架构，兼容 InfluxDB 的 API 接口、支持 InfluxQL 及其周边工具集，具备高扩展性（100+节点的集群规模），支持多平台和多形态部署。

本次社区在前 2 个 rc 版本基础上，稳定性更好，发布 v1.1.0 正式版本，汇集了哪些改变和提升？请耐心读完本文。

本文主要内容包括：

-   性能优化
-   新功能
-   内核优化
-   修复主要 Bug

## 性能优化

性能优化是社区长期坚持的主要工作，在 v1.1.0-rc1 版本上，性能有了非常大的突破，横向对比性能领先优势明显，纵向对比较 v1.0.1 版本提升 200%-300%。详细请参考[性能测试。](https://docs.opengemini.org/zh/guide/introduction/performance.html)

## 新功能

### 高基数存储引擎

![img](/images/docs_img/c11a1a0e66340cae260c0d4ad5c0768d.jpg)

高基数是指数据库中某标签字段的值域非常大，比如 IP 地址，动辄可能千万，再比如交通领域的车牌号，稍微大一点的城市动辄几百万辆车。高基数带来的后果是时序数据库内部时间线急剧增加，可达到数百亿规模，甚至更高，**直接表现为索引膨胀，内存资源占用增多，查询效率下降**。高基数问题是所有时序数据库普遍面临的一个共同难题。

openGemini 自研高基数存储引擎，旨为解决高基数问题，具备明显效果，具体用法参考[官网文档](https://docs.opengemini.org/zh/guide/features/high_series_cardinality.html)

### 数据订阅 (Subscription)

![img](/images/docs_img/abc7f132c1b8f8392893b8b1d6b71aa0.jpg)

openGemini 数据订阅是将写入 openGemini 的数据快速分发到本地或远端支持 HTTP 或 HTTPS 的节点，通常可用于数据异常检测和数据同步等应用场景。数据订阅以 DB 为单位，一个终端可以订阅多个 DB 数据，一个 DB 可以被多个终端订阅数据。

管理数据订阅任务，请参考[官网文档](https://docs.opengemini.org/zh/guide/features/subscription.html)

### 查询管理 (Query Management)

![img](/images/docs_img/caac65527937e89e236ffd153df484b1.jpg)

openGemini 查询管理是一个非常实用的功能，可以通过`show queries`命令查看当前内核中正在运行的所有查询，还包括 database,duration,status,host 等信息。通过查看 duration，了解查询语句的执行时间，可通过命令`kill`终止查询语句的执行。

> 当前版本的查询管理功能暂不受用户权限限制，将在下一个版本提供权限控制

查询管理功能详情，请参考[官网文档](https://docs.opengemini.org/zh/guide/features/query_manage.html)

### 降采样查询 (Continue Query)

![img](/images/docs_img/4802baa4b643c5cef441c1e58426ab96.jpg)

openGemini 降采样功能是将历史明细数据读取出来，通过后台任务完成相应的降采样计算工作，再将结果重写入新的表中存储，上层应用仅需从结果表中查询降采样后的数据即可。该功能会造成一定的数据读写放大，增加磁盘 IO 带宽，如果需要对实时数据进行降采样，推荐使用 Stream 功能。

降采样功能详情，请参考[官网文档](https://docs.opengemini.org/zh/guide/features/continue_query.html)

### 日志存储和检索

![img](/images/docs_img/3ea3db3b4c0d8db0f88a9035880c9dfc.jpg)

openGemini 日志存储是将日志数据转为 openGemini 支持的数据格式写入，日志检索是指通过文本关键字在 openGemini 中检索包含关键字的所有日志数据，支持模糊匹配、正则匹配和精确匹配三种。需要注意的是，日志检索需要在特定的日志消息字段上显示创建文本索引，而创建索引只能通过创表创建。

创建文本索引，请参考[官网文档](https://docs.opengemini.org/zh/guide/schema/measurement.html#create-measurement-创建表)，日志检索请参考[官网文档](https://docs.opengemini.org/zh/guide/features/logs.html)

### 内存过载保护

openGemini 过载保护机制是指当内存使用超过一定水位线时，系统自动杀死所有内核中正在执行的查询语句，以确保系统的可靠性。该功能通过配置项打开，默认关闭。openGemini.conf 配置文件的配置示例如下：

```
## If queries are auto killed for store service
interrupt-query = true
## The default store mem percent threshold of start killing query
interrupt-sql-mem-pct = 90
```

-   **interrupt-query** = true，表示开启
-   **interrupt-sql-mem-pct** = 90，表示内存使用超过 90%便会清理正在执行的查询语句。

## 内核优化

openGemini 在 v1.1.0-rc1，v1.1.0-rc2 和 v1.1.0 三个版本上进行了非常多的内核优化，分别是：

-   节点启动支持 shard 级 lazy 启动
-   扩大 groupcursor limit 下推的优化场景
-   写流程的刷盘代码逻辑优化
-   支持单查询多 SQL 语句并发查询
-   GC 优化
-   优化读 IO 流控，限制后台读带宽
-   精简代码逻辑，删除冗余流程
-   新增 gzipwritepool
-   新增查询文件句柄 cache
-   缓存池处理逻辑优化
-   仅前台业务使用读缓存
-   删除单 shard 查询时的 merge 算子
-   hint 查询使用模板生成查询计划

### 修复 Bugs

1. 修复：懒加载和降采样场景下，当存在乱序文件时，没有开启乱序 merge 功能，导致降采样功能失效
2. 修复：top/bottom 算子返回的查询结果数据中，Tag 与 Field 不匹配
3. 修复：indexscantransform 子 DAG 构建失败后未关闭 cursor
4. 修复：客户端取消查询的异常场景下，DAG 资源未正确释放
5. 修复：按时间分组查询时，由于分组时间太小，使得分组过多，此时数据已在内存，最终导致 OOM
6. 修复：故障场景删除 DB，导致进程退出
7. 修复：乱序数据合并时出现内部错误导致数据文件混入乱序数据，最终导致按时间分组聚合的查询结果不正确
8. 修复：ts-sql 节点离线或者 CQ 任务被删除后依然被调度执行
9. 修复：内核 goroutine 内存逃逸

## 总结

openGemini 作为一款开源的时序数据库系统，社区蓬勃发展是广大开发者共同的心愿。本文主要介绍 v1.1.0 正式版本所涉及的主要性能优化、新功能、内核优化和修复的主要 Bug。是对前两个 rc 版本以及近期优化的汇总。

如何参与社区贡献，参考：

1. https://docs.opengemini.org/zh/dev-guide/get_started/
2. https://docs.opengemini.org/zh/guide/contribution/Document.html

---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
