---
blog: true
title: 'openGemini: Full-Text Index Parsing'
pubDate: '2023-11-10'
author: 'Jie Li'
abstract: 'This article introduces the function of openGemini full-text index, including the basic principle, index creation, full-text query and filtering. Compared with the traditional full-text index, the CLV dynamic segmentation algorithm adopted by openGemini has great advantages in the memory resource consumption and matching efficiency of inverted index.'
cover: /images/cover/full_text_index_parsing.png
recommend: 1
category: 技术解读
tag: 'openGemini,Source code interpretation'
---

Full-text index refers to the technology of efficient retrieval and filtering based on the text content, such as the text set of keywords, phrases, word prefixes, etc. openGemini supports full-text retrieval, which uses a full-text indexing technology called CLV(Compressed Log with Variable Length Token) **[1]** to provide low disk usage and high query performance. And rich query methods.

Full-text index is one of the openGemini index types. It is based on the existing index framework of openGemini and is implemented using inverted index. This paper mainly introduces the implementation principle and overall flow of openGemini full-text index. For more details on the principle and implementation, please refer to the references at the end of this article.

## **Full-text index construction**

The general process of building openGemini full-text index is as follows:

![img](/images/docs_img/d47b364693f07e6e38a71f3a24bb03b9.jpg)

First, the text data goes through a standard word divider for basic word segmentation, in which the following separators are used: ", '\"; = () [] {}? @&<>/:\n\t\r", that is, when text data passes through a standard word divider, the data in the text data stream is divided into individual words using these separators.

For example: "GET /english/teams/teamgroup" text, after the standard word segmentation, will generate "GET","english","teams","teamgroup " 4 tokens.

After the standard word segmentation, the independent tokens will enter the learning word segmentation in order to match, for example, the learning word segmentation has a high probability of matching three words such as "GET","english" and "teams". Then an inverted list is created for the three words "GET","english" and "teams". The inversion table is shown in the following example (the docX in the inversion table represents different lines of text data) :

![img](/images/docs_img/e150ef26b3c8932ee18217d8b4dccb3b.jpg)

In this way, it was originally necessary to establish an inversion table for the three tokens such as "GET","english","teams", etc., and many of the same parts of the three inversion tables now only need to establish a copy, saving storage space.

## **Text retrieval principle**

In full-text index retrieval, we need to use the same standard word segmentation and learning word segmentation. After word segmentation, we search in inverted index. In particular, it is worth mentioning that the learning classifier is also for word segmentation, for example, when writing, "get english teams" 3 words are divided as a whole, if the search keyword contains the same keyword, after the learning classifier, it will become a whole, so the retrieval efficiency is higher, the results are more accurate.

The general process of query is shown in the figure below:

![img](/images/docs_img/1cf699a07ca3438431c2d0133f8ae601.png)

In the query, such as the exact query "english", when reading the inversion table, only need to merge doc1 and the inversion table information pointed to by the address addr0 in the inversion table, doc1, doc2, doc3, doc4 and doc5 are all the data we need to query.

## **Use tutorial**

### **Create index**

To use a full-text index, you need to create a table in advance, and the purpose of creating a table is to specify which Field fields to create a full-text index on (note that the type of the field must be string).

Related documents:

https://docs.opengemini.org/zh/guide/schema/measurement.html#文本检索

After the table and full-text index have been created, normal data writes to the table can be performed. In the process of data writing, the full-text index module will perform operations such as word segmentation and inverted index creation in the background index field content.

### **Full-text search**

openGemini database after the full-text index is created and the data is imported, openGemini provides a variety of query methods, including exact match query, phrase match query, fuzzy query and other functions. Full-text indexed queries also support combined queries with other types of predicates.

Related documents:

https://docs.opengemini.org/zh/guide/features/logs.html

## **Summary**

This article introduces the function of openGemini full-text index, including the basic principle, index creation, full-text query and filtering. Compared with the traditional full-text index, the CLV dynamic segmentation algorithm adopted by openGemini has great advantages in the memory resource consumption and matching efficiency of inverted index.

References:

[1]https://www.vldb.org/conf/2007/papers/research/p303-li.pdf
