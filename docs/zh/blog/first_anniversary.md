---
blog: true
title: openGemini开源一周年，打造极具影响力的时序数据库技术社区
pubDate: '2023-09-22'
author: openGemini
abstract: 在这篇文章中，我们将回顾openGemini的发展历程，探讨其对相关应用领域的影响，并展望未来的发展方向。（文末有福利放送）
cover: /images/cover/first_anniversary.png
recommend: 0
# category: 技术解读 社区动态 案例实践 社区动态 观点洞察
category: 社区动态
tag: 周年庆
---

![img](/images/docs_img/v2-b4d7ce7b907607fcf7b92e9a34ec1927_720w.png)

时间转眼来到 9 月，openGemini 社区迎来了一个重要的里程碑：openGemini 开源一周年。

> openGemini 是华为云数据库创新 Lab 团队自主设计、研发的一款面向全球开源的云原生分布式时序数据库。

作为一款新兴的时序数据库，openGemini 在短短一年内取得了令人瞩目的成就，为开发者和企业提供了强大的时序数据存储和分析解决方案。

在这篇文章中，我们将回顾 openGemini 的发展历程，探讨其对相关应用领域的影响，并展望未来的发展方向。

## **openGemini 诞生记**

![img](/images/docs_img/v2-39fbab612a7f57221eb5f5e828f76391_720w.png)

openGemini 的诞生源于华为云对海量时序数据处理需求的日益增长。截至 2023 年，华为云已上线 240 多个服务，覆盖了 29 个地理区域的 75 个可用区，用户数量数十倍增长。华为云发展驶入快车道的同时，运维压力也随之增加，实时监控告警、故障排查、根因定位、容量规划和性能优化等业务场景每天采集云服务和基础设施的监控指标数据超过 20TB，每秒入库数据超过 4000 万条，每秒查询次数超过 5 万，时间线规模超过 10 亿，这对时序数据库的性能和数据压缩率都提出了极高的要求。

**openGemini 团队在技术调研中发现：**

1. 现有开源时序数据库解决方案在性能上不足以支撑如此海量时间线规模的数据摄入和分析，基于已有开源方案进行架构改造和优化难度大，效果不明显。

2. 传统关系型数据库在该场景下性能很差，且缺乏良好的数据压缩率，存储空间占用极大。

3. 以 Hadoop 为代表的大数据平台更适合数据的离线分析，对于告警服务来说，数据处理时效性差，而且相关组件多而杂，集群规模庞大，难以维护。

4. NoSQL 数据库，比如 HBase、Cassandra 等，其主打应用场景并非运维监控，缺乏针对时序场景的优化，也存在查询语言表达能力弱，数据压缩效率低等问题，存储成本问题无法得到解决。

为了解决这些问题，团队中一群热衷于云计算和数据库技术的工程师们决心开发一款专门针对时序数据管理的高性能数据库系统。从 2019 年开始技术探索，到 2021 年正式自研，再到 2022 年技术成熟并开源，经过长达 4 年时间的不断打磨，诞生了 openGemini。

> 在华为云 SRE 某业务场景下，处理相同业务负载，相比 Elasticsearch 集群，CPU 资源减少 70%，内存资源减少 68%，磁盘空间占用减少 96%；相比相同规格的 HBase 集群，集群节点规模减少 93%，磁盘存储空间占用减少 90%。

## 选择开源还是闭源？

![img](/images/docs_img/v2-94c935536edf620f37df7e1aafa5e438_720w.png)

选择开源还是闭源，这是个值得讨论的一个问题。出发点在于"自用"和"他用"，当然并非“他用”产品就一定需要开源，开源只是一种选择，但如果"自用"则可以完全不必考虑。对于 openGemini 来说，不仅"自用"，还要"他用"，而且要打造成为一款具有学术和行业影响力的时序数据库。

经过长时间的思考，决定选择开源，我们认为：

**首先，开源符合国家战略需求，符合用户和开发者的需求**

对国家来说，“十四五”规划首次把开源纳入顶层设计，当前开源已经成为重构软件产业生态的国家战略，关系国家安全和产业链安全。

对于用户来说，开源意味着可以按照开源许可自由地使用、修改和分发软件，节约成本。

对于开发者来说，可以共享和学习产品开放的代码，从而提高自己的技能和知识水平。同时，开发者可以在社区更好地展示自己的技术和能力，提高自己的竞争力。

将 openGemini 打造成为一款具有学术和行业影响力的时序数据库，这对个人和参与社区的企业和研究团队的价值体现都至关重要。

**其次，只有开源才能构建更好的生态**

数据库系统天生对软件生态具有很强的依赖性，只有开源才会有更好的生态。如今信息技术日新月异，全球同类产品竞争激烈，一款闭源产品其实是很脆弱的，尤其是基础软件，一方面在闭源产品基础之上构建生态难度的确很大。另一方面，从对可信的理解上讲，CNCF 基金会董事任旭东曾讲到，“可信”本质上不是一个纯技术词汇，应该要加上“他信”的意愿度和“互信”的基础。私有软件如果不开放源码，本身就缺乏互信和他信的基础和意愿。

**再次，秉承华为开源理念，加速软件创新**

作为开源的坚定支持者和重要贡献者，华为提倡包容、公平、开放、团结和可持续的理念。

除运维监控场景之外，我们还希望 openGemini 可以扩展更多领域和应用场景，进一步夯实数据库功能、性能、安全性和可靠性，开源可以加速这一进程。

我们深知“独木难成林，百川聚沧海”的道理，openGemini 开源后，将秉承华为开源理念，通过持续贡献，携手社区伙伴和开发者，共同扩展应用场景和功能，解决更多实际问题，持续提升数据库的安全性和可靠性，加速基础软件创新。

**最后，源自开源，回馈开源，弘扬开源精神**

openGemini 部分吸纳了 InfluxDB、VictoriaMetrics、Clickhouse 等全球多款开源数据库的优秀设计和实现技术，并融入到了自己的架构和技术创新实现中。openGemini 是开源的受益者，更应该积极回馈开源，弘扬开源精神，共同推动数据库技术的创新和发展。

## openGemini 最核心的特点

openGemini 的核心特点是其出色的性能和灵活的架构。通过采用 MPP 大规模并行处理架构和向量化查询、时序化 LSM Tree 等多种优化技术，openGemini 能够快速存储和查询大规模的时序数据。同时，openGemini 还支持类 SQL 查询语言和多种编程语言的驱动程序，数据建模灵活，概念简单易懂，对开发者更加友好，使得开发者可以根据自己的需求选择最适合的方式进行数据存储和查询。这种架构和数据建模上的灵活性使得 openGemini 成为了时序数据处理领域的瑞士军刀，能够适应各种不同的应用场景。

openGemini 的性能测试数据和详细介绍可以参考[官网文档](https://docs.opengemini.org/zh/guide/introduction/introduction.html)。

## 一年耕耘，硕果累累

### 🔷 友好的社区开发氛围，深受开发者喜爱

![img](/images/docs_img/v2-d1616aab8395a969eee7995833aee996_720w.jpg)

在开源社区的支持下，通过开放的代码库和友好的社区氛围，openGemini 迅速吸引了来自浙江大学、上海交通大学、哈尔滨工业大学、山东大学、电子科技大学、华中师范大学、东北大学、美国加州大学、印度 Amity University Noida 等国内外 20 余所著名高校数十位优秀同学在社区学习、贡献代码、提交 Bug 报告和提出改进建议。除此之外，openGemini 也吸引了包括天翼云、沃趣在内的很多企业和开源爱好者的关注并加入社区贡献，共同推动了 openGemini 的快速发展，并荣获 2022 年度开发者最喜爱的十大开源项目之一。

### 🔷 核心团队贡献卓越，未来可期

![img](/images/docs_img/v2-58636b657eceef5b8d2fcd5f9cee4386_720w.png)

一年来，openGemini 的代码库不断增长，已累计新增代码量 21 万行（总共 47 万行）。代码质量不断提升，功能测试用例数量 5000 以上，代码覆盖率长期维持在 70%以上。性能不断优化，从最初版本到最新版本，查询性能累计提升 3 倍以上，尤其是运维监控场景，已经实现在同类开源产品中的技术领先优势，成为该领域技术选型的重要参考。功能不断完善，社区已发布版本 5 个，开发完成包括数据订阅、降采样、查询管理、日志存储与检索、高基数存储引擎、AI 时序分析、多操作系统和多硬件平台支持等功能，还包括命令行工具、数据迁移、可视化管理工具、Grafana 插件、安装部署、运维升级、驱动程序等多款周边工具。

### 🔷 多领域应用落地，体现巨大潜力和价值

![img](/images/docs_img/v2-831e052bbe5d3eedb6978d8a627fdaf9_720w.png)

在过去的一年中，openGemini 已经在多个领域取得了成功的应用案例。

-   在云原生领域，openGemini 被用于大规模日志、指标、调用链等可观测性数据的存储和分析，帮助企业快速定位和解决问题。
-   在道路交通领域，openGemini 被应用于城市车辆通行数据的存储和分析，帮助公安和交管部门快速发现犯罪线索，维护社会治安。
-   在工业物联网领域，openGemini 被应用于客户工厂设备传感器数据的实时监测和分析，为企业提供了实时的数据洞察和数字孪生解决方案，并入选工业互联网产业联盟-2022 年工业互联网开源案例。

这些成功案例证明了 openGemini 在海量时序数据处理领域的巨大潜力和价值。

### 🔷 持续业界发声，社区品牌知名度和影响力不断提高

![img](/images/docs_img/v2-166c549323bdcc40007bd5ce8b12c053_720w.png)

开源以来，openGemini 社区持续在产业界发声，构建社区技术影响力。先后参加了华为云 HDC、KubeCon EU 2023、开放原子全球开源峰会、DTCC、CSDN 1024 程序员节等多个极具影响力的行业大会，通过议题和展台展览等方式让开发者和企业深入全面地了解 openGemini。截至目前已有 50 余家企业主动联系社区技术咨询和讨论社区合作。此外，openGemini 还主办多期 Meetup 和走进高校活动，培养数据库后备人才，活动透彻讲解内核关键技术，受到用户和高校师生的广泛好评。

## 直挂云帆济沧海

![img](/images/docs_img/v2-4d643f09ac5e10a1a32cb8d3b777b13c_720w.jpg)

未来，openGemini 将继续致力于提高社区品牌知名度和技术影响力，提供更好的海量时序数据存储分析解决方案，保持技术竞争力，构建更加活跃的技术生态。具体方向如下：

-   进一步提升 openGemini 的数据存储和查询性能，不断完善新的高基数存储引擎，解决长期困扰时序数据库的高基数、海量时间线数据查询的问题。
-   提升开发者体验。提供清晰的贡献指南、文档、教程和示例代码，提供丰富的开发管理工具（如自有驱动程序、图形管理工具、数据迁移工具和部署运维工具等），定期发布版本更新和改进，积极收集用户反馈和需求。
-   加强与其他开源项目和社区的联系，如 openEuler、KubeEdge、CNCF、开放原子基金会等，携手社区伙伴，共同开发更多内核功能，拓展更多应用场景，持续推动社区的发展，吸引更多的开发者和用户参与其中，加速社区技术创新。

openGemini 通过开放社区合作和不断地创新，在一年的时间里展现出了强大的影响力和发展潜力。相信在未来的发展中，openGemini 将继续发挥优势，为海量时序数据处理技术带来新的突破，推动时序数据库的发展，为开发者和企业提供更好的时序数据解决方案，为开源社区做出更大的贡献！

开源地址：https://github.com/openGemini/openGemini

附录：

2022 中国技术力量年度榜单-开发者最喜爱的十大开源项目：

https://www.infoq.cn/zones/chinatechawards2022/?utm_source=infoq-web&utm_medium=jg

---

## **感谢阅读到最后 下方有福利放送**

为了感谢大家一直以来对 openGemini 的关注与支持，社区特意准备了一个小小的福利抽奖活动送出一些社区周边，欢迎大家参与。

活动规则：具体请查看公众号文章[《openGemini 开源一周年》](https://mp.weixin.qq.com/s?__biz=MzIwNjMzMTQ4Mg==&mid=2247484328&idx=1&sn=def5ef2aa21f081788a0d5302e9cb9ad&chksm=9722089da055818ba99caecd5bab09f22f51aa56552da1433d2eb691dad0e4ba1262bb2d319d&token=1209919757&lang=zh_CN#rd)，查看文末参与。

活动时间：9 月 22 日-9 月 26 日

\(^o^)/~人人都可以是幸运鹅~Go！
