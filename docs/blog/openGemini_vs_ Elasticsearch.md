---
blog: true
title: openGemini vs. Elasticsearch
pubDate: '2024-06-09'
author: Zhenyu xie @debuger6
abstract: provide an overview and comparison with openGemini and Elasticsearch
cover: /images/cover/ESvsog.png
recommend: 0
category: 技术解读
tag: openGemini,Elasticsearch
---

Databases play an indispensable role in application development, and selecting a suitable database for business is crucial. A key step in choosing a database is to research their architectural designs and fundamental concepts. With this information, decision-makers can accurately select the appropriate database.

The purpose of this article is not to compare which database is better, but to provide an overview and compare the architecture, features, key concepts, and data models of openGemini and Elasticsearch. It is hoped that this will help everyone clearly understand the differences between the two.

## Product Introduction Comparison

### openGemini

openGemini is an open-source distributed time series database primarily used in scenarios such as DevOps and IoT. It covers specific fields like industrial IoT, smart homes, connected vehicles, electricity, logistics, transportation, and operational monitoring. It focuses on the storage and analysis of massive time series data, reducing the storage costs of such data through technological innovation, simplifying system architecture, and enhancing the efficiency of storage and analysis.

### Elasticsearch

Elasticsearch is an open-source distributed search and analytics engine built on Apache Lucene. It has capabilities for large-scale data analysis and near real-time querying. With the Elastic Stack ecosystem, Elasticsearch has quickly become popular. It can be applied to search, logging, monitoring, and, of course, time series scenarios.

## Applicable Scenario Comparison

### openGemini

openGemini is a specialized time series database designed specifically for time series data. Its data is organized along a timeline, with data points sorted by time and partitioned accordingly. openGemini has been efficiently compressed based on the characteristics of time series data, making it particularly suitable for scenarios involving continuous writing and real-time analysis of massive time series data.

##### Time Series Data

IoT and DevOps data are typical time series data. Thanks to the high-performance query and storage engine of openGemini, coupled with its compatibility with Grafana, it is very suitable for applying openGemini to monitoring and alert scenarios as well as IoT monitoring.

##### Real-time Analysis

openGemini supports SQL-like syntax, allowing users to write complex data analysis and aggregation statements. Its efficient query and analysis capabilities and scalability make it well-suited for various complex real-time analysis scenarios.

### Elasticsearch

Thanks to Elasticsearch's distributed architecture and rich indexing capabilities, it can also be used in time series data scenarios. However, it has not been specifically optimized for time series data. In scenarios with massive time series data, the storage cost and performance of Elasticsearch can become issues. Therefore, compared to specialized time series databases, Elasticsearch is more suitable for search scenarios but can be applied to small to medium-scale time series scenarios.

##### Log Analysis

Elasticsearch is widely used in log storage and analysis scenarios, such as network server logs and application logs. With the ELK ecosystem, it is very convenient and easy to quickly build a log platform.

##### Full-Text Search

Full-text search is what Elasticsearch excels at, thanks to its rich indexing capabilities, allowing for quick data retrieval and filtering, making it very suitable for website search, log retrieval, and other similar scenarios.

## Architecture Comparison

### openGemini

openGemini uses an MPP (Massively Parallel Processing) large-scale parallel processing layered architecture, consisting of three major components: ts-sql, ts-store, and ts-meta. openGemini supports both cluster and single-machine deployment.

- ts-sql is a high-performance query engine.
- ts-store is a storage engine specifically developed for time series data, which also has computing capabilities. ts-sql can push down computable operations to ts-store for data's local computation.
- ts-meta is the metadata management engine, which uses the Raft protocol to ensure data reliability through multiple copies.

### Architecture of Elasticsearch

- Like openGemini, Elasticsearch also uses an MPP parallel processing architecture.
- The coordinating node acts as the coordination point, responsible for receiving, parsing, and forwarding requests, and converging query results.
- The data node is responsible for querying and writing data.
- The master node is the metadata node, using a Raft-like algorithm to ensure data reliability.

## Data Model Comparison

### openGemini Data Model

openGemini has the following concepts:

- Measurement: Similar to a table in a relational database, openGemini can automatically create a table based on the data written without the need to pre-create tables.
- Point: Similar to a row of data in a relational database, a point consists of measurement, tag, field, and time.
- Tag: Equivalent to a field in a relational database, with tag key representing the field name and tag value representing the field value. All tag values are of string type, and all tags establish an inverted index for data query filtering.
- Field: Also equivalent to a field in a relational database, with field key representing the field name and field value representing the field value. Field values support both numerical and string types in openGemini, representing metric data without an inverted index.
- Time: The time field, where any data point in openGemini must have a time field.
- Series: The timeline can be understood as the source of time series data. Data in openGemini is organized by timeline, and related data can be queried through the timeline after filtering by inverted index.

### Elasticsearch Data Model

Elasticsearch has the following concepts:

- Index: Similar to a table in a relational database, ES can also automatically generate a table when data is written, although it is common to plan the table structure in advance according to business characteristics.
- Document: Similar to a row of data in a relational database, composed of multiple fields.
- Field: Fields in ES can support various types, and once determined, the type cannot be dynamically modified.

## Feature Comparison

openGemini has the following features:

- High-performance storage and query: openGemini is optimized for time series data, offering efficient storage and query capabilities. It leverages batch processing and concurrent writing to fully utilize the performance advantages of the storage engine. With the introduction of vectorized execution models and efficient indexing, openGemini can quickly analyze time series data.
- Retention policies: openGemini has built-in retention policies that automatically clean up expired data, helping users manage storage costs and significantly reduce expenses.
- Data compression: openGemini uses different compression encoding algorithms for different data types based on the characteristics of time series data, compressing the data to an extreme degree and controlling storage costs.

Elasticsearch has the following features:

- Full-text search: Elasticsearch supports powerful word segmentation, scoring, and relevance ranking capabilities, suitable for full-text search scenarios.
- Indexing: Indexing is the core of Elasticsearch. ES has designed different indexing structures for different data types, enabling fast retrieval based on filtering conditions in search scenarios.
- Distributed: The distributed deployment of ES is very simple and out-of-the-box. With a single set of programs and role-based configurations, a distributed cluster can be quickly built.
