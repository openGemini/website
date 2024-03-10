---
blog: true
title: openGemini SDKs与背后的贡献团队
pubDate: '2024-02-10'
author: 向宇
abstract: 揭秘sdk开发进展和背后团队
cover: /images/cover/sdks_team.png
recommend: 0
category: 社区动态
tag: openGemini,SDK
---

一直以来，我们都希望openGemini拥有自己的SDK，但是很长一段时间，出于竞争力的考虑，社区把主要精力投放在内核性能提升和高基数存储引擎等其他重要工作上，SDK开发任务便延后了。直到2023年10月，我们迎来了openGemini SDK的社区贡献团队——华为云工业物联平台团队。

### **强强联合，合作共赢**

华为云工业物联平台长期致力于为制造型企业提供统一的生产数据底座能力，帮助企业实现从工业现场数据集成，数据存储，建模，分析，数据服务一站式能力，提升生产管控优化效率。平台采用云边端协同架构，深度使用opengemini，实现海量的OT时序数据的高效管理，并提供工业级的可靠性。从自身实践到赋能客户，华为云工业物联平台携手openGemini，已在某水泥、某玻璃、某烟草等企业大规模落地。

华为云工业物联平台团队和openGemini社区长期保持着亲密合作。团队同时熟悉InfluxDB和openGemini，具备丰富的SDK开发经验，先后设计和开发过工业物联平台的接入SDK和Apache Pulsar社区SDK。基于此，团队主动提出为openGemini贡献SDK，将长期学习和实践过程中积累的非常多宝贵的应用开发经验融合进来，同时也会规避InfluxDB SDK在应用中发现的种种已知问题，新开发的SDK将会用于升级工业物联平台业务系统。团队成员介绍如下：

<img src="/images/docs_img/sdk_and_team.jpeg" alt="team" style="zoom:70%;" />

### **openGemini SDK架构设计**

![img](/images/docs_img/sdk_arch.png)

openGemini各语言SDK将采用统一的架构和接口。在架构设计上，openGemini SDK整体分为三层，由底向上分别是网络层，业务层和接口层。

**网络层**：实现数据在应用和数据库之间的高效传输。包含负载均衡、连接管理、传输加密、连接健康监测、数据发送和接收等功能

**业务层**：实现SDK接口的全部功能，包括数据压缩、批量处理、openGemini数据行协议格式转化、数据库鉴权等基本能力

**接口层**：主要为业务提供数据读写接口和相关配置能力

### **openGemini SDK特性**

openGemini SDK除基本读写功能外，还将支持如下特性：

1. **负载均衡**

   针对openGemini集群存在多个ts-sql的情况，SDK可以同时连接多个ts-sql，根据指定负载均衡算法选择合适的ts-sql处理请求。

2. **健康检测**

   SDK在发送业务请求之前，对当前的网络和ts-sql的服务状态进行检测，提前发现问题。

3. **批处理**

   支持数据批量写入和单点写入自动转为批处理，提升数据写入效率。

4. **鉴权和传输加密**

   支持用户密码鉴权和HTTPS传输加密

5. **数据压缩传输**

   支持数据Gzip压缩后发给数据库服务端，节省网络传输带宽，但一定程度会增加服务侧的开销。

6. **DDL操作**

   支持`create database`, `drop database`, `create retention policy`, `show measurements`等独立接口，便于应用自动化集成。

7. **多种数据格式写入**

   支持InfluxDB Line Protocol和Apache Arrow等数据协议格式写入

### **openGemini SDK开发进展**

#### **client-Go**

仓库地址：

[https://github.com/openGemini/opengemini-client-go](https://github.com/openGemini/opengemini-client-go)

除Apache Arrow不支持外，其余功能特性均开发完成，已发布版本0.1.0，欢迎试用和反馈。

开发示例：[https://github.com/openGemini/opengemini-client-go/blob/main/examples/example/example.go](https://github.com/openGemini/opengemini-client-go/blob/main/examples/example/example.go)

接口参考文档：[https://pkg.go.dev/github.com/openGemini/opengemini-client-go@v0.1.0/opengemini](https://pkg.go.dev/github.com/openGemini/opengemini-client-go@v0.1.0/opengemini)

#### **client-Java**

仓库地址：[https://github.com/openGemini/opengemini-client-java](https://github.com/openGemini/opengemini-client-java)

考虑到Java生态的丰富性，开发者可以挑选最合适的sdk组件，集成到不同的开发框架。

- opengemini-client-kotlin/scala组件是对应开发语言的首选；
- opengemini-client-reactor的组件更适合已有的响应式范式框架；
- opengemini-client-asynchttpclient 组件更适合追求性能的异步编程框架；
- opengemini-client-jdk组件更适合追求简洁、最少依赖的场景；
- opengemini-client-okhttp组件是使用了okhttp组件，这是业界最流行的组件，安卓场景的首选。

由于client-Java组件多，工作量相对大一些，计划2024年4月份发布测试版本，6月份发布正式版本，敬请期待！

#### **其他**

client-JavaScript、client-C++、client-Python、client-Rust均在同步开发中，计划5月份左右会有版本供大家试用。

### **结束**

本文主要介绍了openGemini SDK的社区开发团队以及SDK架构设计、主要功能和最新的社区开发进展，我们鼓励有能力的企业加入到社区，共同发展openGemini技术生态，共享社区成果。我们感谢每一位在社区贡献的开发者！

若对SDK有新的功能需求，欢迎您在社区进行反馈：

[https://github.com/openGemini/openGemini/issues/427](https://github.com/openGemini/openGemini/issues/427)



Star For Me：[https://github.com/openGemini/openGemini](https://github.com/openGemini/openGemini)

添加公众号：微信搜索 "openGemini"
