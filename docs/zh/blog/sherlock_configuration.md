---
blog: true
title: 四步教你自动导出火焰图
pubDate: '2024-02-02'
author: 李仕林
abstract: 无人值守，你值得睡个好觉！
cover: /images/cover/20240202.png
recommend: 0
category: 技术解读
tag: openGemini,火焰图
---

## 你值得睡个好觉

大家平时研发已经非常辛苦了，服务上现网时，还要焦虑现网运行是否稳定，焦虑得晚上睡不着觉。有了**sherlock**，你值得睡个好觉 !!! 

启用`sherlock`可以保留openGemini服务在发生一些性能瓶颈的时候保留现场，可以通过火焰图找到关键的性能瓶颈在哪，方便分析原因和性能优化。

**sherlock**目前具备三项功能：

- 根据规则自动导出`heap`内存占用的火焰图。
- 根据规则自动导出`cpu`占用的火焰图。
- 根据规则自动导出`goroutines`堆栈的火焰图。

## 第一步：准备配置文件

部署openGemini集群的拓扑文件中添加如下配置项，即可开启**sherlock**服务。

其他完整的配置参数参考：https://github.com/openGemini/gemix/blob/main/embed/examples/cluster/topology.example.yaml

```yaml
# topology.yaml
......
server_configs:
  ts-meta:
      sherlock.sherlock-enable: true
      sherlock.collect-interval: '10s'
      sherlock.cpu-max-limit: 95
      sherlock.dump-path: "/tmp/sherlock"
      sherlock.max-num: 32  # 火焰图文件最多保存32个
      sherlock.max-age: 7   # 最多保存7天
      sherlock.cpu.enable: true
      sherlock.cpu.min: 30
      sherlock.cpu.diff: 100
      sherlock.cpu.abs: 70
      sherlock.cpu.cool-down: '10m'
      sherlock.memory.enable: true
      sherlock.memory.min: 30
      sherlock.memory.diff: 50
      sherlock.memory.abs: 60
      sherlock.memory.cool-down: "10m"
      sherlock.goroutine.enable: true
      sherlock.goroutine.min: 15000
      sherlock.goroutine.diff: 20
      sherlock.goroutine.abs: 20000
      sherlock.goroutine.max: 50000
      sherlock.goroutine.cool-down: "10m"
  ts-sql:
      # 同上ts-meta
  ts-store:
      # 同上ts-meta
......
```

就以`cpu`为例子，满足以下任意条件，系统会自动抓取profile，并导出到 `dump-path`：

1. `${current} > {$min}% && ${current} > ( 100 + ${diff} )% * ${average} `
2. `${current} >{$abs}% `

参数配置解释：

`current`: 当前CPU使用率。
`average`: 前10次采集的CPU使用率的平均值（注意：这10个数据，每个数据的值都需要 `>= ${min}`）。
`min/diff/abs`: 分别为cpu下面的配置参数。

`cool-down` 的时间间隔，是两次dump操作之间最小时间间隔，避免频繁profiling对性能产生的影响。

注意：`sherlock.goroutine`有个`max`参数表示：如果goroutine的数量超过了max，则不导出火焰图，避免STW对性能产生较大影响。

> SWT: Stop the World 的缩写，goroutine越多，导出火焰图会导致STW越长，可能会引发性能问题。不过这个问题已经在go1.19得到了优化。参考此CL：
>
> https://go-review.googlesource.com/c/go/+/387415/

## 第二步、启动集群

```bash
gemix cluster install gemini_demo v1.1.1 ./topology.yaml --skip-create-user -u root -p
```

具体细节请参考文章：https://docs.opengemini.org/zh/guide/deploy_cluster/deployment_using_gemix.html

## 第三步、导出 /tmp/sherlock 目录下的火焰图文件

如果/tmp目录下没有火焰图文件，应该是业务压力不大，集群健康状态正常。一般可以通过`grafana`监控面板，查看节点的CPU和内存等信息是否有**异常增高**的趋势。如果有，并且超过了配置文件中的配置的阈值，则会自动在 `/tmp/sherlock` 目录下生成火焰图文件。文件名规则如下：

- CPU：`{进程名}.cpu.{时间}.pb.gz`，e.g. `ts-sql.cpu.20230321113534.241.pb.gz`
- Heap：`{进程名}.mem.{时间}.pb.gz`，e.g. `ts-store.mem.20230321113534.241.pb.gz`
- Goroutine: `{进程名}.goroutine.{时间}.pb.gz`，e.g. `ts-store.goroutine.20230321113534.241.pb.gz`

## 第四步、使用 go tool 性能分析

执行如下命令可以使用 go自带的web页面分析火焰图等数据：

```sh
go tool pprof -http=:8888 ts-sql.cpu.20230321113534.241.pb.gz
```

效果图：

![img](/images/docs_img/20240202.png)

## 探索更多

1. 集群监控： https://docs.opengemini.org/zh/guide/maintenance/monitor.html
2. 配置文件：https://docs.opengemini.org/zh/guide/reference/configurations.html
3. gemix工具:star:：https://github.com/openGemini/gemix/issues/63

