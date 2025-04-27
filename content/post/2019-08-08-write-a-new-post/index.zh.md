---
title: 撰写新文章
date: 2019-08-08 14:10:00 +0800
description: >-
  文本、排版、数学公式、图表、流程图、图片、视频等示例。
categories:
  - 博客
  - 教程
tags:
  - 写作
pin: True
---

本教程将指导您如何在 _Chirpy_ 模板中撰写文章，即使您以前使用过Jekyll，也值得阅读，因为许多功能需要设置特定变量。

## 命名和路径

创建一个名为 `YYYY-MM-DD-TITLE.EXTENSION`{: .filepath} 的新文件，并将其放在根目录的 `_posts`{: .filepath} 中。请注意，`EXTENSION`{: .filepath} 必须是 `md`{: .filepath} 和 `markdown`{: .filepath} 之一。如果您想节省创建文件的时间，请考虑使用插件 [`Jekyll-Compose`](https://github.com/jekyll/jekyll-compose) 来完成此操作。

## 前言

基本上，您需要在文章顶部填写[前言](https://jekyllrb.com/docs/front-matter/)，如下所示：

```yaml
---
title: 标题
date: YYYY-MM-DD HH:MM:SS +/-TTTT
categories: [主分类, 子分类]
tags: [标签]     # 标签名称应始终为小写
---
```

> 文章的_布局_默认已设置为`post`，因此无需在前言块中添加变量_layout_。
{: .prompt-tip }

### 日期的时区

为了准确记录文章的发布日期，您不仅应该设置 `_config.yml`{: .filepath} 的 `timezone`，还应在其前言块的 `date` 变量中提供文章的时区。格式：`+/-TTTT`，例如 `+0800`。

### 分类和标签

每篇文章的 `categories` 设计为最多包含两个元素，而 `tags` 中的元素数量可以从零到无穷大。例如：

```yaml
---
categories: [动物, 昆虫]
tags: [蜜蜂]
---
```

### 作者信息

文章的作者信息通常不需要在 _前言_ 中填写，默认情况下，它们将从配置文件的 `social.name` 和 `social.links` 的第一个条目中获取。但您也可以按如下方式覆盖它：

在 `_data/authors.yml` 中添加作者信息（如果您的网站没有此文件，请创建一个）。

```yaml
<作者ID>:
  name: <全名>
  twitter: <作者的推特>
  url: <作者的主页>
```
{: file="_data/authors.yml" }

然后使用 `author` 指定单个条目或 `authors` 指定多个条目：

```yaml
---
author: <作者ID>                     # 单个条目
# 或
authors: [<作者1ID>, <作者2ID>]   # 多个条目
---
```

话虽如此，键 `author` 也可以识别多个条目。

> 从文件 `_data/authors.yml`{: .filepath } 读取作者信息的好处是页面将有元标签 `twitter:creator`，这丰富了 [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started#card-and-content-attribution) 并有利于SEO。
{: .prompt-info }

### 文章描述

默认情况下，文章的第一句话用于在首页的文章列表、_进一步阅读_ 部分以及RSS源的XML中显示。如果您不想为文章显示自动生成的描述，可以使用 _前言_ 中的 `description` 字段自定义它，如下所示：

```yaml
---
description: 文章的简短摘要。
---
```

此外，`description` 文本也将显示在文章页面的文章标题下方。

## 目录

默认情况下，目录（TOC）显示在文章的右侧面板上。如果您想全局关闭它，请转到 `_config.yml`{: .filepath} 并将变量 `toc` 的值设置为 `false`。如果您想为特定文章关闭TOC，请将以下内容添加到文章的[前言](https://jekyllrb.com/docs/front-matter/)中：

```yaml
---
toc: false
---
```

## 评论

评论的全局设置由 `_config.yml`{: .filepath} 文件中的 `comments.provider` 选项定义。一旦为此变量选择了评论系统，所有文章将启用评论。

如果您想关闭特定文章的评论，请将以下内容添加到文章的**前言**中：

```yaml
---
comments: false
---
```

## 媒体

在 _Chirpy_ 中，我们将图片、音频和视频称为媒体资源。

### URL前缀

有时，我们必须为一篇文章中的多个资源定义重复的URL前缀，这是一项可以通过设置两个参数来避免的繁琐任务。

- 如果您使用CDN托管媒体文件，可以在 `_config.yml`{: .filepath } 中指定 `cdn`。然后，站点头像和文章的媒体资源的URL将以CDN域名为前缀。

  ```yaml
  cdn: https://cdn.com
  ```
  {: file='_config.yml' .nolineno }

- 要为当前文章/页面范围指定资源路径前缀，请在文章的 _前言_ 中设置 `media_subpath`：

  ```yaml
  ---
  media_subpath: /path/to/media/
  ---
  ```
  {: .nolineno }

选项 `site.cdn` 和 `page.media_subpath` 可以单独使用或组合使用，以灵活组合最终的资源URL：`[site.cdn/][page.media_subpath/]file.ext`

### 图片

#### 标题

在图片的下一行添加斜体，然后它将成为标题并显示在图片底部：

```markdown
![图片描述](/path/to/image)
_图片标题_
```
{: .nolineno}

#### 尺寸

为防止图片加载时页面内容布局发生偏移，我们应该为每张图片设置宽度和高度。

```markdown
![桌面视图](/assets/img/sample/mockup.png){: width="700" height="400" }
```
{: .nolineno}

> 对于SVG，您至少必须指定其 _宽度_，否则它不会被渲染。
{: .prompt-info }

从 _Chirpy v5.0.0_ 开始，`height` 和 `width` 支持缩写（`height` → `h`，`width` → `w`）。以下示例与上述效果相同：

```markdown
![桌面视图](/assets/img/sample/mockup.png){: w="700" h="400" }
```
{: .nolineno}

#### 位置

默认情况下，图片居中，但您可以使用 `normal`、`left` 和 `right` 类之一指定位置。

> 一旦指定了位置，就不应添加图片标题。
{: .prompt-warning }

- **普通位置**

  在下面的示例中，图片将左对齐：

  ```markdown
  ![桌面视图](/assets/img/sample/mockup.png){: .normal }
  ```
  {: .nolineno}

- **向左浮动**

  ```markdown
  ![桌面视图](/assets/img/sample/mockup.png){: .left }
  ```
  {: .nolineno}

- **向右浮动**

  ```markdown
  ![桌面视图](/assets/img/sample/mockup.png){: .right }
  ```
  {: .nolineno}

#### 暗/亮模式

您可以使图片跟随暗/亮模式的主题偏好。这需要您准备两张图片，一张用于暗模式，一张用于亮模式，然后为它们分配特定的类（`dark` 或 `light`）：

```markdown
![仅亮模式](/path/to/light-mode.png){: .light }
![仅暗模式](/path/to/dark-mode.png){: .dark }
```

#### 阴影

程序窗口的截图可以考虑显示阴影效果：

```markdown
![桌面视图](/assets/img/sample/mockup.png){: .shadow }
```
{: .nolineno}

#### 预览图片

如果您想在文章顶部添加图片，请提供分辨率为 `1200 x 630` 的图片。请注意，如果图片的宽高比不符合 `1.91 : 1`，图片将被缩放和裁剪。

了解这些先决条件后，您可以开始设置图片的属性：

```yaml
---
image:
  path: /path/to/image
  alt: 图片替代文本
---
```

请注意，[`media_subpath`](#url前缀) 也可以传递给预览图片，也就是说，当它已经设置好时，属性 `path` 只需要图片文件名。

为了简单使用，您也可以只使用 `image` 来定义路径。

```yml
---
image: /path/to/image
---
```

#### LQIP

对于预览图片：

```yaml
---
image:
  lqip: /path/to/lqip-file # 或base64 URI
``` 