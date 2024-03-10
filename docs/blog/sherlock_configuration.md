---
blog: true
title: Four steps to teach you to automatically export flame graphs
pubDate: '2024-02-02'
author: shilin.lee
abstract: A good helper for operations engineers
cover: /images/cover/20240202.png
recommend: 0
category: 技术解读
tag: openGemini,flame graphs
---

You will be able to have a good sleep！

When the service goes online, O&M engineers often worry about the stability of the service and can't sleep well at night. With Sherlock, you will have a good sleep !!!

Enabling Sherlock can preserve the scene when some performance bottlenecks occur in the openGemini service, and find out where the key performance bottleneck is through the flame graph, which is convenient for analyzing the cause and performance optimization.

Sherlock currently has three functions:

- Automatically export the flame graph of heap memory occupation according to the rules.
- Automatically export the flame graph of CPU occupation according to the rules.
- Automatically export the flame graph of goroutines stack according to the rules.

## Step 1: prepare the configuration file

Add the following configuration items to the topology file of the deployed openGemini cluster to enable the Sherlock service.

other parameters reference：[https://github.com/openGemini/gemix/blob/main/embed/examples/cluster/topology.example.yaml](https://github.com/openGemini/gemix/blob/main/embed/examples/cluster/topology.example.yaml)

```yaml
# topology.yaml
...
server_configs:
  ts-meta:
      sherlock.sherlock-enable: true
      sherlock.collect-interval: '10s'
      sherlock.cpu-max-limit: 95
      sherlock.dump-path: "/tmp/sherlock"
      sherlock.max-num: 32  # Up to 32 flame graph files are saved
      sherlock.max-age: 7   # Maximum retention for 7 days
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
      # same as ts-meta
  ts-store:
      # same as ts-meta
...
```

Take the `CPU` as an example, if any of the following conditions are met, the system will automatically capture the profile and export it to the dump-path:

1. `${current} > {$min}% && ${current} > ( 100 + ${diff} )% * ${average} `
2. `${current} >{$abs}% `

Parameter explanation:

`current`: the current CPU usage rate

`average`: the average value of the CPU usage rate collected in the previous 10 times (NOTE: every value needs to be >= ${min} )

`min/diff/abs`: the configuration parameters under the CPU

`cool-down` means the minimum time interval between two dump operations to avoid the impact of frequent profiling on performance.

:::tip

The max parameter of sherlock.goroutine means: if the number of goroutines exceeds max, the flame graph will not be exported to avoid a significant impact on performance due to STW.

The more goroutines, the longer the STW caused by exporting the flame graph, which may cause performance problems. However, this problem has been optimized in Go v1.19. 

Refer to this CL: https://go-review.googlesource.com/c/go/+/387415/

:::

## Step 2: start the cluster

```bash
gemix cluster install gemini_demo v1.1.1 ./topology.yaml --skip-create-user -u root -p
```

For details, please refer to the document.：https://docs.opengemini.org/zh/guide/deploy_cluster/deployment_using_gemix.html

## Step 3: export the flame graph files in the /tmp/sherlock directory

If there are no flame graph files in the /tmp directory, it should be that the business pressure is not large and the cluster is in a normal healthy state. Generally, you can use the Grafana monitoring panel to check if there is an abnormally increasing trend in the CPU and memory information of the node. If so, and it exceeds the threshold configured in the configuration file, it will automatically generate flame graph files in the /tmp/sherlock direc[tory](coco://sendMessage?ext={"s%24wiki_link"%3A"https%3A%2F%2Fm.baike.com%2Fwikiid%2F3286065776310519282"}&msg=tory). The file naming rule is as follows:

- CPU：`{process name}.cpu.{time}.pb.gz`，e.g. `ts-sql.cpu.20230321113534.241.pb.gz`
- Heap：`{process name}.mem.{time}.pb.gz`，e.g. `ts-store.mem.20230321113534.241.pb.gz`
- Goroutine: `{process name}.goroutine.{time}.pb.gz`，e.g. `ts-store.goroutine.20230321113534.241.pb.gz`

## Step 4: use the go tool for performance profiling

You can use the following command to analyze flame graph data :

```sh
go tool pprof -http=:8888 ts-sql.cpu.20230321113534.241.pb.gz
```

sample image：

![img](/images/docs_img/20240202.png)



## END

Star For Me：https://github.com/openGemini/openGemini

