---
blog: true
title: openGemini vs Elasticsearch，这两者的差异和优势你了解多少？
pubDate: '2024-04-01'
author: 谢振宇
abstract: 数据库在应用开发中的地位可见一斑，选择一款适合业务的数据库至关重要。而选择数据库的一个重要环节就是调研它们的架构设计、基本概念等，有了这些信息，可以帮助决策者正确地选取合适的数据库。
cover: /images/cover/ESvsog.png
recommend: 0
category: 技术解读
tag: openGemini,Elasticsearch
---

数据库在应用开发中的地位可见一斑，选择一款适合业务的数据库至关重要。而选择数据库的一个重要环节就是调研它们的架构设计、基本概念等，有了这些信息，可以帮助决策者正确地选取合适的数据库。

本文的目的不是对比哪款数据库更好，而是从总览的角度分别对比 openGemini 和 Elasticsearch 的架构、特性、关键概念、数据模型等。希望能帮助大家清晰地认识两者的差异。

## 产品介绍对比

### openGemini 介绍

openGemini是一款开源的分布式时序数据库，主要应用场景为Devops和IoT，细分领域包括工业物联网，智能家居，车联网，电力，物流，交通，运维监控等，主要关注海量时序数据的存储和分析，通过技术创新，降低海量时序数据存储成本，简化系统架构，提升时序数据存储和分析效率。

### Elasticsearch 介绍

Elasticsearch 是一个基于 Apache Lucene 打造的开源分布式搜索及分析引擎。Elasticsearch 具备大规模数据分析和近实时查询能力，配合 Elastic Stack 生态， Elasticsearch 迅速流行起来。Elasticsearch 可以应用于搜索、日志、监控等场景，当然也能应用于时序场景。

## 适用场景对比

### openGemini 适用场景

openGemini 是一款专业的时序数据库，专门针对时序数据而设计。openGemini的数据按照时间线组织，时间线内的数据点按照时间排序，数据按时间进行了分区。同时 openGemini 根据时序数据的特点进行了高效地压缩处理。因此，openGemini 特别适用于海量时序数据持续写入和实时分析场景。

**时序数据**

IoT 和Devops数据是典型的时序数据，得益于 openGemini 高性能的查询和存储引擎，再加上 openGemini 可以对接 Grafana，因此，将 openGemini 应用于监控告警场景和物联网监控非常合适。

**实时分析**

openGemini支持类SQL，用户可以写出复杂的数据分析和聚合语句，高效的查询分析能力和可扩展性使得它可以很好地应对各种复杂实时分析场景。

### Elasticsearch 适用场景

得益于 Elasticsearch 分布式架构和丰富的索引能力。ES 也可以用于时序数据场景，但是 ES 并未专门针对时序数据做优化，在海量时序数据场景下，ES 的存储成本和性能都将成为痛点。因此，相比专业的时序数据库，ES 更适合搜索场景，但可以应用于中小规模时序场景。

**日志分析**

ES 广泛应用于日志存储和分析场景，如网络服务器日志，应用程序日志等，配合 ELK 生态，可以快速搭建日志平台，非常方便易用。

**全文检索**

全文检索是 ES 最擅长的事情，得益于其丰富的索引能力，可以快速对数据进行检索过滤，非常适合网站搜索、日志检索等场景。

## 处理架构对比

### openGemini 架构

openGemini采用MPP 大规模并行处理分层架构，由ts-sql、ts-store、ts-meta三大部分组成。openGemini既支持集群部署，也可以单机部署。

ts-sql 是高性能查询引擎；ts-store 是专门针对时序数据开发的存储引擎，同时，ts-store 也具备计算能力，ts-sql 将可以下推的计算推给 ts-store，实现数据的就近计算；ts-meta 是元数据管理引擎，通过 raft 实现多副本，从而保证数据可靠性。

### Elasticsearch 架构

和 openGemini 类似，Elasticsearch 也是采用 MPP 并行处理架构，coordinating node 为协调点，负责接收请求、解析请求和转发请求，并汇聚查询结果。data node 是数据节点，负责查询、写入数据。master node 是元数据节点，使用类 raft 算法保证数据可靠性。

## 数据模型对比

### openGemini 数据模型

**measurement**： 类似关系数据库中的表，openGemini可以不用提前建表，数据写入时，openGemini 可以根据写入数据自动建表。

**Point**：类似关系数据库中的一行数据， point 由 measurement, tag, field, time 构成。

**tag**：相当于关系数据库中的字段，tag key 表示字段名，tag value 表示字段值，所有 tag value 都是字符串类型。所有 tag 都会建立倒排索引，用于数据的查询过滤。

**field**：也相当于关系数据库中的字段， field key 表示字段名， field value 表示字段值， tag value 既支持数值类型也支持字符串类型。field 在 openGemini 中表示指标数据，不建立倒排索引。

**time**：时间字段，在 openGemini 中任何数据点都必须带有时间字段。

**series**：时间线可以理解为时序数据的产生源，openGemini 的数据按照时间线组织，通过倒排索引过滤时间线，然后再根据时间线可以查询到相关的数据。

### Elasticsearch 数据模型

**indice**：类似关系数据库中的表，ES 也可以不用提前建表，数据写入时，自动生成表。但是一般在使用 ES 时，会根据业务特性规划表结构提前建表。

**Document**：类似关系数据库中的一行数据，由多个 field 构成。

**Field**： ES 中的字段可以支持多种类型，类型一旦确定不能动态修改。

## 特性对比

### openGemini 特性

**高性能的存储和查询**

openGemini 专门针对时序数据做了优化，提供高效的存储和查询能力。通过批量化和并发写入可以充分发挥存储引擎的性能优势。通过引入向量化执行模型和高效的索引能力，openGemini 可以高效快速地查询分析时序数据。

**Retention policies**

openGemini 自带保留策略，可以自动对过期数据进行清理，该特性帮助用户管理存储开销，极大降低用户成本。

**数据压缩**

openGemini 根据时序数据特征，针对不同数据类型使用不同压缩编码算法，将数据极致压缩，控制存储成本

### Elasticsearch 特性

**全文检索**

Elasticsearch ES 支持强大的分词、打分、相关性排名能力，支持复杂的检索条件，特别适用于全文检索场景。

**索引**

索引是 Elasticsearch 的核心，ES 针对不同的数据类型设计了不同的索引结构，在搜索场景，可以根据过滤条件实现快速检索。

**分布式**

ES 的分布式部署非常简单，开箱即用。只需一套程序，根据角色配置，可以快速搭建分布式集群。
