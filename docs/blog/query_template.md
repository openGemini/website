---
blog: true
title: 'openGemini Optimization Example: Query a Plan Template'
author: 'Hanxue Li'
pubDate: '2023-11-16'
abstract: 'Database performance tuning is a process that requires patience and perseverance. It is necessary to continuously analyze and optimize, find out potential performance problems, and take appropriate measures to optimize. Only through continuous efforts and practice can we really improve the performance of the database system and provide better support for the business.

This article presents an example of how to optimize openGemini based on flame graph analysis, and also describes how to add a query template to help readers.'
cover: /images/cover/query_template.png
recommend: 1
category: 技术解读
tag: openGemini, optimization
---

Database performance optimization is a very important and complex work, which can greatly improve the query efficiency and response speed of the database, thus improving the performance and stability of the whole system. In this process, it is necessary to continuously optimize, constantly find and solve the database performance bottleneck, in order to achieve the best results. This requires us to tirelessly invest energy and time, constantly learn and explore new optimization methods and skills, for the efficient operation of the entire system escort.

This paper mainly introduces a query plan template optimization method adopted by openGemini, which can improve the performance by 40% after optimization through comparative testing.

## What is Query plan template Optimization?

Query plan template optimization refers to an optimization method that finds the frequently used query statements through a large number of application scenarios, extracts the abstract query model, and directly relates it to the correct logical plan, thus skipping the steps such as the optimizer.

In openGemini, when the query engine executes a query, the general process is to generate the corresponding query plan through a series of steps such as the query optimizer, then execute according to the query plan, and return the result data. However, in practical applications, we find that, especially in operation and maintenance monitoring scenarios, a large number of query statements are repeatedly executed (only the time range changes), and through the capture of the flame graph, it is found that in each query process, the generation of query logic plans takes a large proportion of time, and there is a large space for optimization. It is suitable for query plan template optimization method.

![](/images/docs_img/1c7d2bb7281a88f2807f2ecfb2a30f27.png)
![](/images/docs_img/bbb3bca1130dee2263bbb3d26e705f0e.png)

## Optimization method

Through in-depth analysis and understanding of a large number of application scenarios, a large number of high-frequency query statements are extracted and classified as follows:

| Index | Example of an abstract query statement                      |
| ----- | ----------------------------------------------------------- |
| 1     | Select  [AGG] From [MST] Where [CON] Group by [time]        |
| 2     | Select  [AGG] From [MST] Where [CON] Group by [time],[tags] |
| 3     | Select  [AGG] From [MST] Where [CON] Group by [time] Limit  |
| 4     | Select  [Field] From [MST] Where [CON]                      |
| 5     | Select  [AGG] From [MST] Group by [tags]                    |

The classification standard of the plan template of a query statement is that it has the same logical plan structure, including the connection relationship of the operator tree and the operator type, and some parts related to the return column name inside the operator need not be considered. The statement formats corresponding to the parameterization of each use case are shown in the second column of the following table. Some of the statement formats are different, but the generated query plan also has the same operator structure. They belong to one kind of plan template.

|     | Query statements correspond to parameterized formats        | Template type |
| --- | ----------------------------------------------------------- | ------------- |
| 1.  | Select  [AGG] From [MST] Where [CON] Group by [time]        | 1             |
| 2.  | Select  [AGG] From [MST] Where [CON] Group by [time],[tags] | 1             |
| 3.  | Select  [AGG] From [MST] Where [CON] Group by [time] Limit  | 2             |
| 4.  | Select  [Field] From [MST] Where [CON]                      | 3             |
| 5.  | Select  [AGG] From [MST] Group by [tags]                    | 4             |

The following table shows the corresponding plan structure of the four types of plan templates to which the above statements can be classified in openGemini. When the system starts, these four plans reside in the memory as templates. When the subsequent plans are generated, these plan templates are directly used to build actual plans for different queries, thus saving the overhead of the optimizer.

| Type | Template name      | Planning structure                                                                                                                                                                                                                                                                                             |
| ---- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | AGG_INTERVAL       | LogicalHttpSender->LogicalFill->LogicalProject->LogicalInterval-> LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalExchange->LogicalIndexScan->LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalReader->LogicalExchange-> LogicalAggregate->LogicalAggregate->LogicalSeries              |
| 2    | AGG_INTERVAL_LIMIT | LogicalHttpSender->LogicalLimit->LogicalFill->LogicalProject->LogicalInterval->LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalExchange->LogicalIndexScan->LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalReader->LogicalExchange->LogicalAggregate-> LogicalAggregate->LogicalSeries |
| 3    | NO_AGG_NO_GROUP    | LogicalHttpSender->LogicalProject->LogicalExchange->LogicalExchange->LogicalIndexScan->LogicalExchange->LogicalReader->LogicalExchange->LogicalSeries                                                                                                                                                          |
| 4    | AGG_GROUP          | LogicalHttpSender->LogicalProject->LogicalAggregate->LogicalExchange->LogicalAggregate->LogicalExchange->LogicalIndexScan->LogicalAggregate->LogicalExchange->LogicalReader                                                                                                                                    |

## Optimization effect

The code for the plan template is concentrated in openGemini's engine/executor/plan_type.go and engine/executor/plan_type_shard.go files, which can be read by interested readers. In this paper, a comparative test is conducted under the same data and query model based on the optimized version. The QPS comparison before and after optimization is shown in the following figure, and it can be seen that the overall improvement is about 40%.

//The following part of the content is typeset as a reference

The total number of data points is 1440000, the number of timelines is 1000, the time interval of data generation is 60s, and the total number of queries is 10000.

![](/images/docs_img/68567ce8235e548df0aa69d89b83650c.png)

Continue to capture the optimized flame diagram and make a comparison with the pre-optimization. In the following figure, the left side is the optimized flame diagram, and the right side is the pre-optimization. It can be seen that the proportion of logical plan generation is significantly reduced.

![](/images/docs_img/5075a785652ccf8e533ae982c652d12a.png)

The flame diagram of the generated part of the optimized logic plan is shown below, and you can see that the overhead of the optimizer part disappears completely.

![](/images/docs_img/f4b4ca66c3c1ef148e5c38bc171b631e.png)

## How to add a new template

**To add a new query template, perform the following steps:**

1. Add a sample query of the new query template to TemplateSql in plan_type_shard.go and add the enumerated name of the new query template to the initialization of PlanTypes in init() of plan_type_shard.go. During system startup, all queries in TemplateSql will be traversed to generate a logical plan corresponding to each query and put into the SqlplanTemplate and StorePlanTemplate in plan_type.go as a template plan. They guarantee correspondence through subscripts.

2. Add the matching function of the new query template to plan_type.go, for example, the matching function of the NO_AGG_NO_GROUP template is shown in the following figure. Determine which template type the entered query schema belongs to according to the matching function.
   ![](/images/docs_img/b02b6fa2fae82049be40d89c1baca010.png)

3. Add the matching function corresponding to the new query template to init() function of plan_type.go to initialize MatchPlanFunc. In the query template matching process, all matching functions in MatchPlanFunc will be called to find the template type matching the query. Then according to the template type found in step 1 SqlplanTemplate/StorePlanTemplate corresponding subscript template plan, Finally use the template program by calling the NewPlanBySchemaAndSrcPlan () come from the template corresponding actual logic program to generate the query plan.

## Summary

Database performance tuning is a process that requires patience and perseverance. It is necessary to continuously analyze and optimize, find out potential performance problems, and take appropriate measures to optimize. Only through continuous efforts and practice can we really improve the performance of the database system and provide better support for the business.

This article presents an example of how to optimize openGemini based on flame graph analysis, and also describes how to add a query template to help readers.
