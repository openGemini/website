---
blog: true
title: openGemini：全文索引解析
pubDate: '2023-11-10'
author: 李杰
abstract: 本文介绍了openGemini全文索引功能，包括基本原理，索引创建，全文查询与过滤等。与传统全文索引相比，openGemini采用的CLV动态分词算法，在倒排索引的内存资源占用、匹配效率方面都具有较大优势。
cover: /images/cover/full_text_index_parsing.png
recommend: 0
category: 技术解读
tag: 日志索引
---

全文索引是指根据文本内容，例如文本内的关键词、短语、单词前缀等文本集合进行高效检索、过滤等的技术。openGemini 支持全文检索，其使用了一种称为 CLV(Compressed Log with Variable Length Token)变长 token 的全文索引技术**[1]**，以提供较低的磁盘占用，较高的查询性能，以及丰富的查询方式。

全文索引是 openGemini 索引类型中的一种，是在 openGemini 现有索引框架下，并且采用了倒排索引（inverted index）来实现。本文主要介绍 openGemini 全文索引的实现原理和整体流程。了解更多原理和实现细节，请参考文末的参考文献。

## **全文索引构建**

构建 openGemini 全文索引的大体流程如下图所示：

![img](/images/docs_img/d47b364693f07e6e38a71f3a24bb03b9.jpg)

首先文本数据先经过一个标准的分词器进行基础的分词，在标准分词器中使用了如下的分隔符：", '\";=()[]{}?@&<>/:\n\t\r"，即文本数据在经过标准分词器时，会使用使用这些分割符将文本数据流中的数据分割成单个的单词。

例如："GET /english/teams/teamgroup"文本，经过标准分词器后，会生成"GET","english","teams","teamgroup "等 4 个 token。

经过标准分词之后，独立的 token 会按照顺序进入学习型分词器进行匹配，例如学习型分词器在匹配到"GET","english","teams"等 3 个单词经常出现在一起的概率很高，那么就会为这"GET","english","teams"3 个单词建立一条倒排表记录。倒排表如下图示例（倒排表中 docX 表示不同的文本数据行）：

![img](/images/docs_img/e150ef26b3c8932ee18217d8b4dccb3b.jpg)

这样原来本来需要分别针对"GET","english","teams"等 3 个 token 都需要建立的倒排表，而这三个倒排表中很多相同的部分现在只需要建立一份，节约了存储空间。

## **文本检索原理**

全文索引检索时需要使用相同的标准分词器和学习型分词器，经过分词后，再到倒排索引中进行检索。特别值得一提的是，这里学习型分词器也是为了分词，例如写入的时候，“get english teams” 3 个词是作为一个整体分词，检索的关键字若包含相同关键字，经过学习型分词器后，也会变为一个整体，这样的检索效率是更高的，结果更准确。

查询的大体流程如下图所示：

![img](/images/docs_img/1cf699a07ca3438431c2d0133f8ae601.png)

在查询的时候，例如精确查询”english”，读取倒排表时，只需要将 doc1 以及倒排表中的地址 addr0 指向的倒排表信息进行合并，合并后 doc1、doc2、doc3、doc4、doc5 即是我们需要查询的所有数据。

## **使用教程**

### **创建索引**

若要使用全文索引，需要预先创建表，创建表的目的其实是为了指定要在哪些 Field 字段上创建全文索引（注意，对应 filed 字段的类型必须是 string 类型）。

相关文档阅读：

https://docs.opengemini.org/zh/guide/schema/measurement.html#文本检索

当表和全文索引创建完成之后，即可对该表进行正常的数据写入。在数据写入过程，全文索引模块会在后台索引字段内容进行分词、倒排索引创建等操作。

### **全文检索**

openGemini 数据库在全文索引创建完成并且数据导入之后，可使用 openGemini 提供了多种查询方式进行查询，包括精确匹配查询、短语匹配查询、模糊查询等多种功能。全文索引查询也支持与其他类型的谓词进行组合查询。

相关文档阅读：

https://docs.opengemini.org/zh/guide/features/logs.html

## **总结**

本文介绍了 openGemini 全文索引功能，包括基本原理，索引创建，全文查询与过滤等。与传统全文索引相比，openGemini 采用的 CLV 动态分词算法，在倒排索引的内存资源占用、匹配效率方面都具有较大优势。

参考文献：

[1]https://www.vldb.org/conf/2007/papers/research/p303-li.pdf

---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
