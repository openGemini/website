# openGemini-website

openGemini website

node >= 16.19.0

## 简介

本项目为 vuePress2 框架构建生成的静态网站，通过 vuePress2 提供的自定义主题的方式实现网站的个性化展示需求。
vuePress2 详情访问 https://v2.vuepress.vuejs.org/。

## 开发环境

### 环境信息

1. Node Version >= 16.19.0

### 本地启动

1. 克隆代码

```

```

2. 进入项目目录进行依赖安装

```
cd opengemini-website
npm install
```

3. 本地启动项目

```
npm run docs:dev
```

## 博客/活动

1. 博客添加：通过 node 脚本快速创建博客文件

```shell
// 1. 创建英文博客 位于 /docs/blog 目录下
npm run docs:create -- --name=[文件名称]
// 2. 创建中文博客 位于 /docs/zh/blog 目录下
npm run docs:create -- --name=[文件名称] --zh
```

2. 活动添加

```shell
// 1. 创建英文活动 位于 /docs/community/events 目录下
npm run docs:create -- --name=[文件名称] --events
// 2. 创建中文博客 位于 /docs/zh/community/events 目录下
npm run docs:create -- --name=[文件名称] --events --zh
```

TODO

-   补充四篇英文博客
-   博客详情页去除左边栏 check
-   docker 国内仓 镜像仓
-   加入我们模板优化

3.  文件元信息：
    3.1 博客

        | 字段      | 含义             |                                                                                                                         |
        | --------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
        | blog      | 表示该文件为博客 |
        | title     | 博客标题         |
        | author    | 博客作者         |
        | pubdate   | 发布日期         |
        | abstract  | 内容摘要         |
        | cover     | 封面路径         | 封面图片位于 /docs/.vuepress/public/image/cover 目录下，路径只需从 image 目录填写，eg: /images/cover/query_template.png |
        | recommend | 推荐指数         | 用于博客页推荐文件展示，取五篇数值最高的博客进行展示                                                                    |
        | category  | 分类             | 技术解读 公司动态 案例实践 社区动态 观点洞察                                                                            |
        | tag       | 标签             |

    3.2 活动

    | 字段      | 含义             |                                                            |
    | --------- | ---------------- | ---------------------------------------------------------- |
    | blog      | 表示该文件为活动 |
    | title     | 博客标题         |
    | author    | 博客作者         |
    | eventDate | 活动日期         |
    | abstract  | 内容摘要         |
    | cover     | 封面路径         | 规则同博客                                                 |
    | pinned    | 顶部固定         | 用于活动宣传，设置为 true 可在网站顶部展示活动信息，倒计时 |

4.  文章内容
    支持正常 markdown 语法，也支持 html + css 语法
