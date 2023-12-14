---
blog: true
title: 它来了，openGemini有了专属的Grafana插件！
pubDate: '2023-09-27'
author: 陈世航
abstract: openGemini再添一员“猛将“，有了专属自己的数据源插件—openGemini-Grafana！本文从安装—使用—数据源配置三个步骤细致地描述了如何在openGemini轻松接入Grafana，欢迎大家下载安装体验。
cover: /images/cover/grafana_plugin.png
recommend: 0
# category: 技术解读 公司动态 案例实践 社区动态 观点洞察
category: 社区动态
tag: openGemini,社区
---

## Grafana-openGemini 介绍

[Grafana](https://grafana.com/) 是一款流行的开源数据可视化和监控分析平台，可以通过灵活的配置查询采集到的数据并进行可视化展示。它可以快速灵活的创建客户端图表，官方库中具有丰富的仪表盘插件，比如热图、折线图、图表等多种展示方式。支持 InfluxDB，OpenTSDB，Prometheus，ElasticSerach，MySQL 等数据源，还可以创建自定义告警规则并通知到其他消息处理服务或组件中。

openGemini 由于兼容 InfluxDB 接口，自开源以来一直推荐使用 InfluxDB 数据源连接 openGemini，直到今天，社区终于开发了自己的数据源插件，填补了空白。本文主要介绍该插件的功能和使用方法**\*（需注意，插件依赖 Grafana 版本：v9.5.3+）\***。

插件已在社区开源，若有功能不满足需求，可进行二次开发。

```
https://github.com/openGemini/grafana-opengemini-datasource
```

## 插件功能特性

-   支持将源数据格式化为 time series，table，log 三种类型的数据。
-   支持日志数据的展示。结合 openGemini 数据库自身的日志检索相关语法和 openGemini 数据源插件的关键词高亮功能，实现对日志的查询，展示及检索等操作。
-   别名支持。别名模式支持对表名、列名或 tag 名称进行名称替换，用于区分复杂数据。
-   插件支持$timeFilter, $\_\_interval 等变量出现在查询语句中，查询过程中会将变量替换为对应值。

## 插件安装

**你可以选择如下任何一种方式使用 Grafana-openGemini 插件：**

### （一）源码编译

**编译环境信息**

-   [**Node.js**](https://nodejs.org/zh-cn/download)： version v16+

-   yarn，可通过如下命令安装

    ```shell
    > npm install yarn
    ```

**下载源码**

```shell
> git clone https://github.com/openGemini/grafana-opengemini-datasource.git
```

**进入主目录**

```shell
> cd grafana-opengemini-datasource
```

**编译**

```shell
> yarn install
> yarn run build
```

编译好的插件存放在 dist 文件夹下

### （二）下载 release 版本

**下载最新版本 release ，下载链接：**

> https://github.com/openGemini/grafana-opengemini-datasource/releases/

### 配置 Grafana

修改 Grafana 配置文件`custom.ini`：

```tex
[paths]
...
//配置下载的源码路径
plugins = /path/to/[plugin-path]
...
[plugins]
...
//配置插件名称为opengemini-opengemini-datasource (不可修改)
allow_loading_unsigned_plugins = opengemini-opengemini-datasource
```

> 如果没有 custom.ini 文件，可以拷贝 sample.ini 文件，并重命名为 custom.ini

配置修改成功后，重新启动 grafana-server

## 插件使用

1. 点击左侧菜单**Connections**

    ![img](/images/docs_img/a7810e4beb7d94cd2dfb962d9a507cf0.png)

2. 选择 openGemini

    ![img](/images/docs_img/06870503a4d8bfc339483d98f5af1512.png)

3. 点击**Add new data source**

    ![img](/images/docs_img/fe8a81f0ca0190912e2a4c797548a44f.png)

## 数据源配置

1. 配置链接 openGemini 的各项参数，比如 HTTP URL，用户名密码，数据库等相关信息

    ![img](/images/docs_img/edb33e147e67d90ddca04b9baca41363.png)

2. 配置项说明

    - **Name**，设置该数据源的名称
    - **Default**，打开默认可以在新 panel 中默认选择该数据源
    - **URL**，openGemini 服务的地址，openGemini 服务默认端口号为 8086
    - **Allowed cookies** ，默认情况下 grafana 代理会删除转发的 cookie。该项按照名称指定应转发到数据源的 cookie
    - **Timeout**，设置请求的超时时间
    - **Database**，设置 openGemini 的默认 database
    - **HTTP Method**，设置 openGemini 的请求方法
    - **Min time interval**，设置自动分组的最小时间间隔

### 查询

查询语法: [详见 openGemini 文档](https://docs.opengemini.org/zh/)

> https://docs.opengemini.org/zh/

**Format as**：选择将数据格式化为 time series，table，log 等类型

![img](/images/docs_img/a0458a5c4ca9c0db57553cac50b83d19.png)

**Alias by**: 支持对表名、列名或 tag 名称进行名称替换

-   $measurement 替换 measurement 名称
-   $col 替换列名
-   $tag_exampletag 替换 exampletag tag 的值

举个例子，查询每个节点的 CPU 利用率，查询语句

```sql
SELECT mean("CpuUsage") FROM $database.."system" WHERE $timeFilter GROUP BY time($__interval), "host" fill(null)
```

Alias by 中填入$tag_host,表示使用 host 值替换默认表名的展示

![img](/images/docs_img/654c365a651647d57760eb16c4291d18.png)

分别使用 time series 和 table 格式展示效果如下图所示：

![img](/images/docs_img/a91c972ec763ed6a5de7ee8dfdc11adf.png)

​ time series

![img](/images/docs_img/a6b117bda8eae61ea99b4759201004dd.png)

​ table

再举个例子，查询日志，查询语句如下：

```sql
select * from mst181998 limit 100
```

效果如下图所示:

![img](/images/docs_img/a714ea310ef0800d5d6635759e3b1361.png)

## 总结

openGemini 再添一员“猛将“，有了专属自己的数据源插件—openGemini-Grafana！本文从安装—使用—数据源配置三个步骤细致地描述了如何在 openGemini 轻松接入 Grafana，欢迎大家下载安装体验。

---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
