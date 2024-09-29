---
blog: true
title: openGemini如何开发一个字符串算子？
pubDate: '2023-10-13'
author: 李仕林
abstract: 本篇文章将教大家如何在openGemini内核中添加一个内置函数（算子）。
cover: /images/cover/develop_string_operator.png
recommend: 0
# category: 技术解读 公司动态 案例实践 社区动态 观点洞察
category: 技术解读
tag: 算子开发
---

本篇文章内容前导知识可参考文章：[openGemini 大解析：查询引擎框架](http://mp.weixin.qq.com/s?__biz=MzIwNjMzMTQ4Mg==&mid=2247484228&idx=1&sn=e6b253d826d979ff990d54a1e75cbbfa&chksm=97220871a0558167f3b0cfca28a6397bc4ea9d75266615156aab8e367a57d720ec177db7aba0&scene=21#wechat_redirect)

本篇文章将教大家如何在 openGemini 内核中添加一个内置函数（算子）。这里以 hello 算子为例，实现的功能为打印"hello, $filed_value"，类似这样的输出：

```javascript
> select hello("name") from mst
+----------------------+------------------+
| time                 | hello            |
+----------------------+------------------+
| 2021-08-16T16:00:00Z | hello, Tom       |
+----------------------+------------------+
```

希望能帮助大家熟悉算子开发流程，为熟悉内核源码打下一定的基础。

# **开发 hello 算子**

在这里，我们将实现一个 HELLO()函数，该函数有一个参数，即字符串。为此，您需要克隆 openGemini/openGemini 存储库

> （docs.opengemini.org/zh/dev-guide/get_started/build_source_code.html）

目前执行 hello 算子查询会报如下错误：

```java
> select hello("name") from mst
ERR: undefined function hello()
```

我们正式开始修改源码：

**第一步是在 open_src/influx/query/compile.go 中添加定义函数的名称，"hello"：**

```java
func isStringFunction(call *influxql.Call) bool {
  switch call.Name {
  case "str", "strlen", "substr", "hello":
    return true
  }
```

**下一步是修改 engine/executor/schema.go，添加"hello"**

```java
func (qs *QuerySchema) isStringFunction(call *influxql.Call) bool {
  switch call.Name {
  case "str", "strlen", "substr", "hello":
    return true
  }
```

**然后是修改 open_src/influx/query/functions.go，添加"hello"的 CallType**

```java
func (m StringFunctionTypeMapper) CallType(name string, _ []influxql.DataType) (influxql.DataType, error) {
  switch name {
  case "str":
    return influxql.Boolean, nil
  case "strlen":
    return influxql.Integer, nil
  case "substr":
    return influxql.String, nil
  case "hello":
    return influxql.String, nil
```

**最后需要补充我们的 hello 方法的真正实现，代码在 engine/executor/string_functions.go 中**

```java
func (v StringValuer) Call(name string, args []interface{}) (interface{}, bool) {
  switch name {
  case "strlen":
   ......
  case "hello":
    if len(args) != 1 {
      return nil, false
    }
    if arg0, ok := args[0].(string); ok {
      return HelloFunc(arg0), true
    }
    return nil, true
  default:
    return nil, false
}

func HelloFunc(srcStr string) string {
    // 测试性能优化时放开下面注释
  // var h []byte
  // h = make([]byte, 200*1024*1024)
  // fmt.Println(h)
  return "hello, " + srcStr
}
```

现在您需要**重新构建 openGemini**，并尝试新添加的功能。（https://docs.opengemini.org/zh/dev-guide/get_started/build_source_code.html）

最终结果：

```java
> insert mst name="Tom"
> SELECT HELLO(name) from mst
+----------------------+------------------+
| time                 | hello            |
+----------------------+------------------+
| 2021-08-16T16:00:00Z | hello, Tom       |
+----------------------+------------------+
```

# **单元测试**

我们需要测试**engine/executor/string_functions.go**中的**HelloFunc**是否符合预期：以 hello 开头。

在 engine/executor/string_function_test.go 文件中，添加如下测试：

```java
func TestStringFunctionHello(t *testing.T) {
  stringValuer := executor.StringValuer{}
  inputName := "hello"
  inputArgs := []interface{}{"Alice", "Bob", "Carry"}
  expects := []interface{}{"hello, Alice", "hello, Bob", "hello, Carry"}
  outputs := make([]interface{}, 0, len(expects))
  for _, arg := range inputArgs {
    if out, ok := stringValuer.Call(inputName, []interface{}{arg}); ok {
      outputs = append(outputs, out)
    }
  }
  assert.Equal(t, outputs, expects)
}
```

# **集成测试**

如果需要添加集成测试（https://docs.opengemini.org/zh/dev-guide/get_started/test_tutorials.html），请在**tests/server_test.go**文件中，增加如下测试函数：

```java
func TestServer_Query_Aggregate_For_Hello_Functions(t *testing.T) {
  t.Parallel()
  s := OpenServer(NewParseConfig(testCfgPath))
  defer s.Close()

  if err := s.CreateDatabaseAndRetentionPolicy("db0", NewRetentionPolicySpec("rp0", 1, 0), true); err != nil {
    t.Fatal(err)
  }

  writes := []string{
    fmt.Sprintf(`mst,country=china,name=azhu age=12.3,height=70i,address="shenzhen",alive=TRUE 1629129600000000000`),
    fmt.Sprintf(`mst,country=american,name=alan age=20.5,height=80i,address="shanghai",alive=FALSE 1629129601000000000`),
    fmt.Sprintf(`mst,country=germany,name=alang age=3.4,height=90i,address="beijin",alive=TRUE 1629129602000000000`),
    fmt.Sprintf(`mst,country=japan,name=ahui age=30,height=121i,address="guangzhou",alive=FALSE 1629129603000000000`),
    fmt.Sprintf(`mst,country=canada,name=aqiu age=35,height=138i,address="chengdu",alive=TRUE 1629129604000000000`),
    fmt.Sprintf(`mst,country=china,name=agang age=48.8,height=149i,address="wuhan" 1629129605000000000`),
    fmt.Sprintf(`mst,country=american,name=agan age=52.7,height=153i,alive=TRUE 1629129606000000000`),
    fmt.Sprintf(`mst,country=germany,name=alin age=28.3,address="anhui",alive=FALSE 1629129607000000000`),
    fmt.Sprintf(`mst,country=japan,name=ali height=179i,address="xian",alive=TRUE 1629129608000000000`),
    fmt.Sprintf(`mst,country=canada age=60.8,height=180i,address="hangzhou",alive=FALSE 1629129609000000000`),
    fmt.Sprintf(`mst,name=ahuang age=102,height=191i,address="nanjin",alive=TRUE 1629129610000000000`),
    fmt.Sprintf(`mst,country=china,name=ayin age=123,height=203i,address="zhengzhou",alive=FALSE 1629129611000000000`),
  }
  test := NewTest("db0", "rp0")
  test.writes = Writes{
    &Write{data: strings.Join(writes, "\n")},
  }

  test.addQueries([]*Query{
    &Query{
      name:    "SELECT hello(address)",
      command: `SELECT hello("address") FROM db0.rp0.mst`,
      exp:     `{"results":[{"statement_id":0,"series":[{"name":"mst","columns":["time","hello"],"values":[["2021-08-16T16:00:00Z","hello, shenzhen"],["2021-08-16T16:00:01Z","hello, shanghai"],["2021-08-16T16:00:02Z","hello, beijin"],["2021-08-16T16:00:03Z","hello, guangzhou"],["2021-08-16T16:00:04Z","hello, chengdu"],["2021-08-16T16:00:05Z","hello, wuhan"],["2021-08-16T16:00:07Z","hello, anhui"],["2021-08-16T16:00:08Z","hello, xian"],["2021-08-16T16:00:09Z","hello, hangzhou"],["2021-08-16T16:00:10Z","hello, nanjin"],["2021-08-16T16:00:11Z","hello, zhengzhou"]]}]}]}`,
    },
  }...)

  for i, query := range test.queries {
    t.Run(query.name, func(t *testing.T) {
      if i == 0 {
        if err := test.init(s); err != nil {
          t.Fatalf("test init failed: %s", err)
        }
      }
      if query.skip {
        t.Skipf("SKIP:: %s", query.name)
      }
      if err := query.Execute(s); err != nil {
        t.Error(query.Error(err))
      } else if !query.success() {
        t.Error(query.failureMessage())
      }
    })
  }
}
```

# **性能分析（profiling）和优化**

**（一）性能分析（profiling）**

对于任何数据库系统来说，性能始终很重要。如果你想知道性能瓶颈在哪里，可以使用一个强大的 Go 分析工具，名为 pprof。

> 启动进程的时候需要修改配置文件，才能开启 SQL 端的 pprof 功能，端口为 6061
>
> ```java
> [http]
> pprof-enabled = true
> ```

**通过 HTTP 端点收集运行时分析信息**

通常，当 openGemini 服务器运行时，它会通过 HTTP 在http://127.0.0.1:6061/debug/pprof/profile. 您可以通过运行以下命令获取配置文件结果：

```java
curl -G "http://127.0.0.1:6061/debug/pprof/profile?seconds=45" > profile.profile
go tool pprof -http 127.0.0.1:4001 profile.profile
```

这些命令捕获 45 秒的分析信息，然后在浏览器中输入 127.0.0.1:4001，打开分析 CPU 结果的 Web 视图。该视图包含执行的火焰图和更多可以帮助您诊断性能瓶颈的视图。（https://www.brendangregg.com/flamegraphs.html）

您还可以通过此端点收集其他运行时信息。例如：

-   goroutine

```java
curl -G "http://127.0.0.1:6061/debug/pprof/goroutine" > goroutine.profile
go tool trace -http 127.0.0.1:4001 goroutine.profile
```

-   trace(调用链)

```java
curl -G "http://127.0.0.1:6061/debug/pprof/trace?seconds=3" > trace.profile
go tool trace -http 127.0.0.1:4001 trace.profile
```

-   heap(内存)

```java
curl -G "http://127.0.0.1:6061/debug/pprof/heap" > heap.profile
go tool pprof -http 127.0.0.1:4001 heap.profile
```

要了解如何分析运行时信息，请参阅 Go 的诊断文档。（https://golang.org/doc/diagnostics）

**内存申请火焰图：**

HelloFunc，申请了**845MB**的内存。

![img](/images/docs_img/45f055f1232c2ade55fb8ef02bf5c879.png)

优化后火焰图如下：

基本上看不到特别消耗内存的地方，总共才申请**8MB**左右。

![img](/images/docs_img/35ff3ed72b923bd303aa54884fd0ff57.png)

**（二）性能优化**

性能优化的手段一般有：

1.优化 GC，减少小对象申请

**2.去掉无用对象的内存申请**

3.缓存区内容一次分配足够大小空间，并适当复用

4.高并发的任务处理使用 goroutine 池

5.减少[]byte 与 string 之间转换，尽量采用[]byte 字符串处理

# **总结**

我们已成功向 openGemini 内核添加了 hello 函数，并且完成了单元测试、集成测试、性能分析与优化，至此一个完整的开发流程就体验完毕了。在绝大部分企业级项目中都是遵循此开发节奏的。相信此篇文章能作为开发数据库项目的入门篇章，为开发者日后更加复杂的功能开发上带来一点点帮助。

---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
