---
blog: true
title: openGemini优化范例之查询计划模板
author: 李寒雪
pubDate: '2023-11-16'
abstract: '数据库性能优化是一个需要耐心和毅力的过程。需要不断地进行分析和优化，找出潜在的性能问题，并采取相应的措施进行优化。只有经过不断的努力和实践，才能真正提高数据库系统的性能，为业务提供更好的支持。

本文介绍了如何基于火焰图分析优化openGemini的一个案例，同时也介绍了如何新增一个查询模板，希望对读者有所帮助。'
cover: /images/cover/query_template.png
category: 技术解读
tag: 查询模板
---

数据库性能优化是一个非常重要而复杂的工作，它可以大大提高数据库的查询效率和响应速度，从而提高整个系统的性能和稳定性。在这个过程中，需要不断地进行优化，不断地寻找和解决数据库性能瓶颈，才能取得最好的效果。这需要我们孜孜不倦地投入精力和时间，不断地学习和探索新的优化方法和技巧，为整个系统的高效运行保驾护航。

本文主要介绍一种 openGemini 采用的查询计划模板优化方法, 通过对比测试，优化后性能可提升 40%。

## 什么是查询计划模板优化？

查询计划模板优化是指通过大量应用场景，找到高频使用的查询语句，提取出抽象的查询模型，将之直接与正确的逻辑计划关联，从而跳过优化器等步骤的一种优化方法。

在 openGemini 内部，查询引擎执行查询时，一般流程是通过查询优化器等一系列步骤生成对应的查询计划，再按查询计划执行，返回结果数据。但在实际应用中我们发现，尤其在运维监控场景，大量查询语句是在重复执行（仅时间范围有变化），并通过抓取火焰图发现，每次查询过程，查询逻辑计划生成的耗时占比偏大，有很大的优化空间。正好适用于查询计划模板优化方法。

![](/images/docs_img/1c7d2bb7281a88f2807f2ecfb2a30f27.png)
![](/images/docs_img/bbb3bca1130dee2263bbb3d26e705f0e.png)

## 优化方法

通过对大量应用场景的深入分析和了解，提取了大量高频查询语句，抽象后分类如下：

| 序号 | 抽象后的查询语句示例                                        |
| ---- | ----------------------------------------------------------- |
| 1    | Select  [AGG] From [MST] Where [CON] Group by [time]        |
| 2    | Select  [AGG] From [MST] Where [CON] Group by [time],[tags] |
| 3    | Select  [AGG] From [MST] Where [CON] Group by [time] Limit  |
| 4    | Select  [Field] From [MST] Where [CON]                      |
| 5    | Select  [AGG] From [MST] Group by [tags]                    |

查询语句的计划模板分类的标准是具有相同的逻辑计划结构，包括算子树的前后连接关系和算子类型，算子内部的一些与返回列名等相关的部分则不需要考虑。各用例参数化后对应的语句格式如下表第二列所示，其中一些语句格式有所不同但是最后生成的查询计划也具有相同的算子结构，它们同属一种计划模板。

|     | 查询语句对应参数化格式                                      | 模板类型 |
| --- | ----------------------------------------------------------- | -------- |
| 1.  | Select  [AGG] From [MST] Where [CON] Group by [time]        | 1        |
| 2.  | Select  [AGG] From [MST] Where [CON] Group by [time],[tags] | 1        |
| 3.  | Select  [AGG] From [MST] Where [CON] Group by [time] Limit  | 2        |
| 4.  | Select  [Field] From [MST] Where [CON]                      | 3        |
| 5.  | Select  [AGG] From [MST] Group by [tags]                    | 4        |

上述语句可以分属的 4 类计划模板在 openGemini 中各自对应的计划结构如下表所示，在系统启动时这四个计划作为模板驻留在内存中，后续计划生成时将直接使用这些计划模板构建不同查询各自的实际计划，从而省去优化器的开销。

| 类型 | 模板名称           | 计划结构                                                                                                                                                                                                                                                                                                       |
| ---- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | AGG_INTERVAL       | LogicalHttpSender->LogicalFill->LogicalProject->LogicalInterval-> LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalExchange->LogicalIndexScan->LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalReader->LogicalExchange-> LogicalAggregate->LogicalAggregate->LogicalSeries              |
| 2    | AGG_INTERVAL_LIMIT | LogicalHttpSender->LogicalLimit->LogicalFill->LogicalProject->LogicalInterval->LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalExchange->LogicalIndexScan->LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalReader->LogicalExchange->LogicalAggregate-> LogicalAggregate->LogicalSeries |
| 3    | NO_AGG_NO_GROUP    | LogicalHttpSender->LogicalProject->LogicalExchange->LogicalExchange->LogicalIndexScan->LogicalExchange->LogicalReader->LogicalExchange->LogicalSeries                                                                                                                                                          |
| 4    | AGG_GROUP          | LogicalHttpSender->LogicalProject->LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalExchange->LogicalIndexScan->LogicalAggregate->LogicalExchange->LogicalReader                                                                                                                                    |

## 优化效果

计划模板的代码集中在 openGemini 的 engine/executor/plan_type.go 和 engine/executor/plan_type_shard.go 文件中，有兴趣的读者可以进行阅读，本文后续基于优化后的版本在相同数据和查询模型下进行对比测试，优化前后 QPS 对比下图所示，可以看到总体提升在 40%左右。

//如下这部分内容排版时作为引用

数据点总量为 1440000，时间线数量为 1000，数据生成的时间点间隔为 60s，查询总数为 10000 一次。

![](/images/docs_img/68567ce8235e548df0aa69d89b83650c.png)

继续抓取优化后的火焰图与优化前做对比，下图左侧是优化后的火焰图，右侧是优化前的，可以看到逻辑计划生成部分占比明显减少。

![](/images/docs_img/5075a785652ccf8e533ae982c652d12a.png)

优化后逻辑计划生成部分的火焰图如下图所示，可以看到优化器部分的开销全部消失。

![](/images/docs_img/f4b4ca66c3c1ef148e5c38bc171b631e.png)

## 如何添加新模板

**如果需要添加新的查询模板可以通过如下的步骤实现：**

1. 向 plan_type_shard.go 中的 TemplateSql 中添加新查询模板的一个范例查询并在 plan_type.go 的 init()中将这个新查询模板的枚举名称加入 PlanTypes 的初始化中，在系统启动时会对 TemplateSql 中所有查询进行遍历生成每个查询对应的逻辑计划并将其作为模板计划放入 plan_type.go 中的 SqlplanTemplate 和 StorePlanTemplate 中，它们通过下标保证对应关系。

2. 向 plan_type.go 中添加新查询模板的匹配函数，如 NO_AGG_NO_GROUP 模板的匹配函数如下图所示，根据匹配函数判断输入的查询 schema 属于哪种模板类型。
   ![](/images/docs_img/b02b6fa2fae82049be40d89c1baca010.png)

3. 将新查询模板对应的匹配函数加入 plan_type.go 的 init()函数中初始化 MatchPlanFunc，在查询模板匹配流程中会对 MatchPlanFunc 中所有匹配函数进行调用，找到查询符合的模板类型，然后根据模板类型找到步骤 1 中 SqlplanTemplate/StorePlanTemplate 对应下标的模板计划，最后使用模板计划通过调用 NewPlanBySchemaAndSrcPlan()来从模板计划生成该查询对应的实际逻辑计划。

## 总结

数据库性能优化是一个需要耐心和毅力的过程。需要不断地进行分析和优化，找出潜在的性能问题，并采取相应的措施进行优化。只有经过不断的努力和实践，才能真正提高数据库系统的性能，为业务提供更好的支持。

本文介绍了如何基于火焰图分析优化 openGemini 的一个案例，同时也介绍了如何新增一个查询模板，希望对读者有所帮助。

---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
