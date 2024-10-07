---
blog: true
title: 开发者故事|开发一个新的数据库命令是什么体验？
pubDate: '2024-10-07'
author: 四川大学 高继垚
abstract: 本期，来自川大的高继垚同学为我们讲述他在社区的经历！
cover: /images/cover/gaojiyao.png
recommend: 0
category: 开发者故事
tag: 开发者故事
---

本期，来自川大的高继垚同学为我们讲述他在社区的经历！

大家好，我是高继垚，四川大学计算机学院的一名研究生二年级学生。一直以来，我对数据库开发有着浓厚的兴趣，自己最早也学习过很多这方面的课程，例如CMU的15445，写过一些小的玩具项目。但在心里总是感觉这些还不够，渴望能接触到业界的真实场景并从中学习。我是2024年7月前后开始正式在openGemini社区贡献，截止目前已成功合入5个PR，包括新增了一个查询数据表详细信息的命令，以及多个bug fix，共计2000多行代码。 

![图片](/images/docs_img/developer-3-1.png)

## **开源之旅：从新手到Contributor的成长之路**

最早参与到openGemini社区中来的契机是一个非常巧的事情。在完成一年级课程内容的学习之后，我一直苦于没有机会深入参与到实际工程项目当中。机缘巧合之下，在今年的7月份左右，我的一位同学向我提起openGemini，推荐我参与一些bug fix的工作，并向我介绍了社区的负责人向宇老师。当时的我在开源项目上是一个完全的新人，非常担心自己能否顺利的上手与完成这些任务。幸好，向老师非常热心负责地给我做了几次培训，帮助我成功地对openGemini的项目有了基本的认识。在和向老师的交流中，他帮我分析了社区现有的一些issue，还给出了解决的基本思路，让我能快速地上手，准备进行自己的贡献。



我真正意义上为openGemini贡献的第一个commit是解决了在删除measurements时无法指定retention policy的问题。虽然现在看来是个比较简单的问题了，但在当时的我看来还是非常具有挑战性的：这一bug涉及到了对于SQL语句的语法修改，而这一修改需要深入到openGemini的词法、语法分析部分，对其做出对应的修改。面对着这些内容，我的内心实际上是有一种兴奋感：我在编译原理、数据库理论里学到的知识第一次不再是冷冰冰的概念，而是成为了实际工程中我所需要解决问题的背景。随后，我又在社区提交了一个PR，希望开发一个新的命令解决openGemini目前无法通过SHOW MEASUREMENT命令查看全部表元数据信息的问题。在与社区成员就解决方案进行深入讨论的过程中，我学到了很多宝贵的经验，比如如何设计命令语法，保持与系统其他命令风格一致；如何确保修改后的命令与InfluxDB保持兼容性；以及如何设计返回值以提高可读性。



在数据库系统开发的过程中，它能极大地训练了我思考问题的全面性，让我学会了在设计和实现解决方案时，不仅要考虑技术层面的可行性，还要兼顾用户体验、系统兼容性、性能优化以及可维护性等多个维度。这种全面的思考方式，对于我未来在软件开发领域的成长和进步，无疑是一笔宝贵的财富。



在对自己的方案进行了精心的调整和优化之后，我再次将其呈现给了社区，与更广泛的成员进行了进一步的探讨。最终，我们的方案获得了大多数社区成员的认可，我也成功地新增了一条数据库命令。当我目睹自己的代码在经过多轮的审查和改进后，被正式合并到主分支，那种成就感是无以伦比的。我编写的代码能够得到资深开发者的肯定，这对我来说是极大的鼓励，它激励我继续努力学习，为社区贡献更多的力量。

## **个人收获：深化数据库理解与编码质量提升**

在openGemini社区学习的这段时间里，可以说我对数据库和其整体构成有了全新的理解。这种新的理解主要来自于两方面：



### **一、 对数据库的内部逻辑的认识**

数据库的每一个模块的实现实际上是一个非常复杂的工程问题，而并不仅仅局限于教科书上的原则。而这种知识是必须从实际的项目中学习到的。openGemini的工程师前辈们在长年累月的实践和优化中积累了非常多的经验，并将其内化至openGemini中。就比如之前提到的关于新增，修改命令，乃至变更时需要考虑的一些问题等，这些软件设计上的经验是我之前在学校接触不到的，让我受益良多。



### **二、 提高个人编码质量上的认识**

是在数据库开发过程中，openGemini社区的前辈们都会热心地为你的代码进行认真的审查，包括变量命名是否清晰易懂，代码逻辑是否简单高效等。这些审查意见为我带来了全新的视角，帮助我重新审视自己的代码，提高了自己代码的质量。

## **未来计划：持续在社区学习与贡献**

openGemini社区是一个非常有活力的社区，给了我一个学习和成长的平台，未来我打算深入到数据库的更加复杂的技术领域，包括AI在数据库中的应用，大量乱序时序数据高效处理等问题的研究，不断提升自己，为社区做出更多属于自己的高质量贡献，帮助社区变得越来越好。也希望自己未来有一天可以像今天社区的各位前辈一样，能够帮助更多的人融入到这个大家庭中。



感谢大家的阅读，最后给大家一个建议：如果你对数据库技术感兴趣，或者想要加入openGemini社区，一定提前添加向宇老师的微信（xiangyu5632）交流，向宇老师会根据每个人的情况，为你分配比较适合的任务，能让你快速上手，少走很多弯路！