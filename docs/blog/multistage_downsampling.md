---
blog: true
title: 'The Application Scenarios and Constraints of the Multistage Downsampling Function'
pubDate: '2023-11-01'
author: 'Guanglin Cong'
abstract: 'This article mainly introduces the openGemini multilevel downsampling function, including application scenarios, task creation, view and deletion, and usage constraints. Multilevel downsampling can greatly reduce data storage costs and system costs, but it does not retain the original data details, you must be clear when using.'
cover: /images/cover/multistage_downsample.png
recommend: 1
category: 技术解读
tag: 'openGemini, Source code interpretation'
---

## Background

With the rapid development of 5G and IOT, the amount of data is growing exponentially. In order to more fully reflect the state details of the system or application, the granularity of indicator collection is becoming more and more detailed, and the amount of indicator data is becoming larger and larger. Services have various requirements on monitoring data, such as querying the latest abnormal alarms of the data and viewing the trend analysis of the one-year indicator data. The larger the amount of data, the longer the query will take, and if it is processed on the browser side, it will also consume a lot of memory. This not only causes great pressure on the database system, but also brings poor user experience.

For example, in a user service scenario:

1. It is necessary to provide point-search capability for data in the last seven days and aggregate analysis capability with a time window of 5 minutes
2. Aggregate analysis results with coarse grain size and time window of 15min were provided in the last month
3. Provide coarse-grained aggregate analysis results with a time window of 1h in the last year
4. The data can expire after 365 days

We can see that after seven days, there is no need for the point-and-click ability to provide detailed data.

In order to provide higher Query performance and lower storage cost, in traditional database applications, data downsampling is mostly achieved through CQ (Continue Query), materialized view, or other operations. The following is a user's previous technical solution:

1. The customer builds three Druid clusters to store the raw data from 0 to 7 days, the aggregated data from 7 to 28 days after sampling in a 15 minute window, and the aggregated data from 28 days after sampling in a 1 hour window
2. The original data is inserted into the first cluster, and then the data aggregation is written to the second cluster and the third cluster respectively at the corresponding time
3. During the query, three SQL statements are sent to the corresponding cluster for aggregate calculation and data summary on the client

![img](/images/docs_img/8788753edd2626b6a942f3c3a533a353.png)

We can find the following problems:

1. The cluster cost is too high, and three clusters are used to implement the service. In addition, each new tier 1 query service requires a new query cluster. As a result, the basic resource overhead cost is too high, and the operation and maintenance difficulty increases
2. Service development requires understanding the cluster architecture and the underlying cluster status before adding and maintaining the current query service. The cost of updating and expanding subsequent services is too high

To solve the above problems, openGemini multistage downsampling function came into being.

## Multistage downsampling

### Function introduction

The openGemini multistage downsampling function is a background task. Compared with traditional downsampling, multistage means that data in different time Windows can be downsampled simultaneously in multiple time ranges, such as 0-T1, T1-T2, and T2-T3, and historical data details can be replaced in place to save more storage space.

### Create a downsampling task

```java
Create DownSample [on | on .|  ]((dataType(aggregators)...)) With Duration  SampleInterval(time Durations) TimeInterval(time Durations)
```

Parameter description:

| dataType                                | Aggregators                                                                   | Duration            | SampleInterval                                 | TimeInterval      |
| --------------------------------------- | ----------------------------------------------------------------------------- | ------------------- | ---------------------------------------------- | ----------------- |
| Specific data types, such as int, float | Polymerization method,Currently, min, max, sum, count, and mean are supported | Data retention time | The sampling time of the next step is executed | sampling Interval |

_Introductions of RP and shards can refer to the previous article《openGemini：使集群保持良好写线性度的三种最佳实践方法》_,See detailed usage[Community document](https://docs.opengemini.org/zh/guide/features/downsample.html)

Using the scenario in the background introduction to create a downsampling example:

```sql
Create DownSample on db0
 (float(sum,last),integer(max,min))
 With Duration 365d
 sampleinterval(7d,28d)
 timeinterval(15m,1h)
```

This is a typical three-level downsampling task, which is set by the sampleinterval(7d,28d), indicating that the downsampling period is divided into 0-7 days, 7-28 days,28 days and later (the maximum is 365 days, because the data after 356 days is expired. Data expiration is set by 'With Duration 365d'). timeinterval(15m,1h) corresponds to sampleinterval(7d,28d), indicating that original data details are reserved for 0-7 days and normal service query is required. Data in 7-28 days is downsampled according to a 15min time window. Data after 28 days is downsampled according to the 1h time window. Fields and aggregate functions that satisfy downsampling are specified by (float(sum,last),integer(max,min)). float(sum,last) indicates that the sum() and last() aggregates will be executed for all float data, and integer (max,min) indicates that the max() and min() aggregates will be executed for all integer data. Other types of data that are not represented are discarded.

Based on the existing example, if you want to add first-level downsampling to the data of 28-70 days, the downsampling time window is 1h, and the data is aggregated according to 1d time window after 70 days, you only need to modify the command

```sql
Create DownSample on db0
 (float(sum,last),integer(max,min))
 With Duration 365d
 sampleinterval(7d,28d,70d)
 timeinterval(15m,1h,1d)
```

### Query the downsampling task

If we want to know the downsampling task we are currently creating, we can use the following command:

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

### Delete the downsampling task

If we want to delete the downsampling task that is currently created, we can use the following command:

```
Drop DownSamples on [|]
```

If we want to know the downsampling status of the current shard, we can use the following command:

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

### Description of other constraints

1. When the downsampling retention time is changed **With Duration 365d**, the rp retention policy of the current db is modified simultaneously. The two policies are related. Do not change this parameter if it is not necessary. Ensure that it is consistent with the current db retention policy.
2. After a downsampling task is created, the user does not perceive it and ADAPTS to the target query statement. For example, in the above example, the service Group query Group by time (1h), the kernel will form four groups of 15min aggregated results into a 1h result return, it should be noted that the grouping time and downsampling time window are multiples. If the downsampling time window is 15 minutes, the service query Group by time (16 minutes) is not allowed.
3. The SampleInterval needs to be a positive multiple of the shard Duration at the time of the current table creation，For example, the shard Duration is 7d, and the minimum value of the SampleInterval is 7d or a multiple of 7. _ Related Reading _[shard Duration](https://docs.opengemini.org/zh/guide/schema/retention_policy.html#shard-duration)
4. The next level of TimeInterval must be a positive integer multiple of the previous level, for example, timeinterval(15m,1h) in the example. It cannot be timeinterval(15m,29min), because 29 is not a multiple of 15.
5. For select \* queries, if the query time range involves downsampled shard data, only the original data is queried
6. If the shard has been downsampled, data cannot be written

## Summary

This article mainly introduces the openGemini multilevel downsampling function, including application scenarios, task creation, view and deletion, and usage constraints. Multilevel downsampling can greatly reduce data storage costs and system costs, but it does not retain the original data details, you must be clear when using.
