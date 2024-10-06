---
blog: true
title: openGemini：海量监控数据处理如何做？华为云SRE案例分享
pubDate: '2024-09-27'
author: openGemini
abstract: openGemini的设计和优化都是根据时序数据特点而来，在面对海量运维监控数据处理需求时，openGemini显然更加有针对性，华为云SRE的事实证明，在运维监控场景中，openGemini能够提升运维效率，降低运维成本，真正帮助企业实现降本增效。
cover: /images/cover/usercase.png
recommend: 0
category: 用户案例
tag: SRE应用实践
---

IT运维诞生于最早的信息化时代。在信息化时代，企业的信息化系统，主要为了满足企业内部管理的需求。通常是集中、可控和固化的烟囱式架构。传统IT运维，以人力运维为主，在单点式和烟囱式的架构中，的确起到了非常重要的作用。

我们知道，传统运维模式关注的是单台IT设备的故障率或单套应用系统的可用性，系统与系统之间，设备与设备之间，是彼此孤立的，因此产生的数据量也相对有限。

但进入到云计算时代之后，IT的边界被完全打开，更多的联接、更多的设备、更多的服务，使得系统规模开始变得越来越大，随着监控粒度越来越细，监控数据呈现出爆炸式增长的态势，每天将产生上百TB的数据，如何对如此海量的数据进行处理成为华为云SRE面临的一项挑战

## 业务背景

华为云SRE基础设施监控系统是一个先进的平台，用于监控和管理华为云在全球各个region的基础设施。该系统需要实时监测各种资源，包括网络、存储、计算、安全和各个云服务。

### 现状

业务诞生之初，适逢“大数据”时代，Hadoop作为批量离线计算系统已经得到了业界的普遍认可，并经过了工业上的验证，所以HBase具备“站在巨人肩膀之上”的优势，其发展势头非常迅猛。HBase还是一种NoSQL数据库，支持水平扩展和大规模数据的存储能力，故选型HBase。当然内部也基于HBase做过很多优化，比如缩短row key，减少Key-Value数，按照时间维度分表，将单行多列变为单行单列。

## 痛点

随着华为云业务扩展，特别是近些年，华为云在全球布局的速度也突飞猛进，所要监控的设备也越来越多，颗粒度越来越细，指标数据急剧增长，在控制成本的前提下，对性能要求比以往更高，HBase明显已经无法满足当前业务需要，问题主要体现在以下几点：

1. HBase不支持高阶聚合查询，时间范围太大的查询性能比较差，无法渲染图表
2. HBase没有特定的压缩算法，应对每天上百TB数据，存储成本长期居高不下
3. HBase部署需要依赖第三方组件HDFS和Zookeeper，运维成本高
4. 为告警业务，额外引入2000节点规模流计算节点，成本高

## 技术选型

为了解决这些痛点，我们将目光投向时下流行的时序数据库（Time-Series Database）。首先在DBEngines排名前20的开源时序数据库中甄别，排除商业品类、开源协议不友好的，初步拟选了InfluxDB、Druid、Prometheus、OpenTSDB几款，经过技术对比，InfluxDB只有单机版，功能和性能受限大，故排除。OpenTSDB底层存储仍然是HBase，存储成本问题仍然存在，故排除。Prometheus不适合在大规模数据场景下使用。Druid是一个实时分析型的数据库，用于大规模实时数据导入、快速查询分析的场景，基本满足需求，但在时空聚合查询场景时延相对较大。徘徊之际，了解到华为云开源的openGemini，经过测试对比，openGemini在数据压缩效率、读写性能方面优势明显，经过和openGemini社区团队交流后，最后选择了openGemini存储全网华为云SRE基础设施监控数据。

## 性能测试

### 写性能

![图片](/images/docs_img/usercase-1-1.png)

上述测试结果显示了openGemini 从4U扩展到32U的性能表现，可以看出：

- 从4U到32U，openGemini写入性能可以线性扩展（扩展比为0.8）
- 从4U的155万Metrics/s平稳增长到32U的560万Metrics/s

### 查询性能

查询性能是我们重点考虑的方面，测试工具Jmeter，测试场景从业务中挑选了使用频率较高的三种类型查询语句，在此基础上变化查询并发数、查询时间范围、聚合算子等进行测试。

测试语句举例：

| Index | 查询类型     | 查询语句举例                                                 |
| ----- | ------------ | ------------------------------------------------------------ |
| 1     | 精确查询     | **SELECT** value AS "result"**FROM** "cpu_total_user2"**WHERE** time > now()-1h **AND** time < now() **AND**"rgn"='xian-wulan-1' **AND**"cmpt"='Cloud-Agent-Androidte-1' **AND**"az"='cn-north-1' **AND**"agentSN"='awp--6099-1' **AND**"pod"='pod3-1' **AND**"ip"='192.168.253.214' **AND**"quantile"='192.168.253.214-xx-0' **AND** "ns"='test.user_xx-0' |
| 2     | 时间聚合查询 | **SELECT** mean(value) AS "result"**FROM** "cpu_total_user2"**WHERE** time > now()-1h **AND**time < now() **AND**"rgn"='xian-wulan-1' **AND**"cmpt"='Cloud-Agent-Androidte-1' **AND**"az"='cn-north-1' **AND**"agentSN"='awp--6099-1' **AND**"pod"='pod3-1' **AND**"ip"='192.168.253.214' **AND**"quantile"='192.168.253.214-xx-0' **AND** "ns"=' test.user_xx-0'**GROUP BY** time(300s) **FILL**(null) |
| 3     | 时空聚合查询 | **SELECT** mean(value) AS "result"**FROM** "cpu_total_user2"**WHERE** time > now()-1h **AND**time < now() **AND**"rgn"='xian-wulan-1'**GROUP BY** time(60s), agentSN **FILL**(null) |

测试规格与集群部署

| **机器规格：**10个节点，每个节点为64U512G，磁盘为1000G       |
| ------------------------------------------------------------ |
| **集群部署：**3个节点部署3个meta，每个节点合布store与sql     |
| **测试数据模型：**tag数量：8，tag长度：64byte，时间线数量：1800万, 采集频率：60s |

测试结果***（\******20并发6h 表示查询并发为20，时间范围为6小时\******）\***

**精确查询整体性能表现如下：**

![图片](/images/docs_img/usercase-1-2.png)

**时间聚合查询整体性能表现如下：**

![图片](/images/docs_img/usercase-1-5.png)

**时空聚合查询整体性能表现如下：**

![图片](/images/docs_img/usercase-1-3.png)

**测试结论**

整体上，openGemini在上述三种查询场景下，相比Druid性能大幅领先。openGemini写入性能满足目前同样流量大小的HBase集群，而且使用的规模要小不少。此外，openGemini不依赖任何第三方组件或应用，同时还有非常丰富的监控指标，更好的观察系统的运行状况，快速定位和解决问题。

## 迁移方案

### **数据双写**

采用openGemini后，并没有立即拆除已有系统。主要考虑两方面：

1. 如果openGemini出现问题可以迅速把流量切回去，保证现网业务运行平稳
2. HBase的数据不能直接迁移到openGemini，如果开发迁移工具成本又很高，故HBase和openGemini双写，在此过渡期间是个好的办法

### 查询切流

我们给openGemini和HBase配置了不同的DNS，切换DNS就可以非常方便地查询不同数据库的数据，对现网可靠性也不会产生影响。

## 实际效果

截止目前，已实现全网流量切入openGemini，系统平稳运行超过两年。

![图片](/images/docs_img/usercase-1-4.png)

和之前的HBase对比：

1. 单region下，HBase集群规模从数百计算节点降至数十节点，规模缩减60%以上
2. 截止目前，上线集群平均每秒写入达到1.81亿条指标数据，存储空间节约超90%，CPU资源上可以节省68%，内存资源可以节省50%
3. 查询性能大幅提升

## 总结

openGemini的设计和优化都是根据时序数据特点而来，在面对海量运维监控数据处理需求时，openGemini显然更加有针对性，而以上的事实证明，在运维监控场景中，openGemini的应用能够提升运维效率，降低运维成本，真正帮助企业实现降本增效。
