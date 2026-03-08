---
title: Hexo搭建个人博客
date: 2026-03-08 17:04:24
tags: Hexo
category: 教程
---

使用Hexo搭建个人博客，部署到Github Pages。

<!-- more -->

# 简介

[**Hexo**](https://hexo.io/zh-cn/) 是一个快速、简洁且高效的博客框架 。它基于 Node.js，能够将你用 Markdown 格式撰写的文章，在几秒内生成一个漂亮的静态网站。

**核心优势：**

- **⚡ 极速生成**：得益于 Node.js，即使有上百个页面，也能在几秒内完成渲染 。
- **📝 Markdown 支持**：你只需专注于用最流行的 Markdown 语法写作，排版工作交给 Hexo 即可 。
- **🚀 一键部署**：写好文章后，只需一条简单指令，就能将网站部署到 GitHub Pages 等免费服务器上，别人就能看到了 。
- **🎨 丰富的主题与插件**：社区提供了成百上千款精美主题和插件，可以轻松地更换网站外观和扩展功能。

# 环境准备

- Git
- Node.js
- Github Account
- pnpm / yarn / 其他包管理工具

# 安装 Hexo

新建一个文件夹，作为即将的博客目录。

执行以下命令：

```bash
pnpm add hexo-cli -g

hexo init --no-install

pnpm i
```

**常用命令：**

- `hexo init` : 新建一个网站
- `hexo new` : 新建一篇文章
  ```bash
  $ hexo new [layout] <title>
  ```
  如果没有设置 `layout` 的话，默认使用 [\_config.yml](https://hexo.io/zh-cn/docs/configuration) 中的 `default_layout` 参数代替。
  默认情况下，Hexo 会使用文章的标题来决定文章文件的路径。 对于独立页面来说，Hexo 会创建一个以标题为名字的目录，并在目录中放置一个 `index.md` 文件。
- `hexo generate` / `hexo g`: 生成静态网页文件
- `hexo server` / `hexo s`: 启动服务器
  默认情况下，访问网址为： `http://localhost:4000/`。
- `hexo deploy` / `hexo d`: 部署网站，将生成的网站部署到远程服务器（如 GitHub Pages）
- `hexo clean` :
  清除缓存文件 (`db.json`) 和已生成的静态文件 (`public`)。

# 设置 Hexo 主题

Hexo 提供许多主题风格可以设置，在 [这里](https://hexo.io/themes/) 可以浏览选择喜欢的主题。

在博客根目录下运行以下命令：

```bash
cd themes
git clone <link>.git <theme name> --depth=1
```

clone 完成之后，在播客项目根目录下 **\_config.yml** 文件中设置主题名称即可生效。

![theme配置示例](/images/hexo-theme-config.png)

通常情况下，Hexo 主题是一个独立的项目，并拥有一个独立的 `_config.yml` 配置文件。

> Hexo 在合并主题配置时，Hexo 配置文件中的 `theme_config` 的优先级最高，其次是 `_config.[theme].yml` 文件。 最后是位于主题目录下的 `_config.yml` 文件。

为了方便统一，建议使用**独立的 `_config.[theme].yml` 文件。**方式来管理主题配置。

例如：

```yaml
# _config.yml
theme: "my-theme"
```

```yaml
# _config.my-theme.yml
bio: "My awesome bio"
foo:
  bar: "a"
```

这里我选择使用 [arknights](https://github.com/Yue-plus/hexo-theme-arknights) 主题，clone 完之后，在根目录下执行以下命令：

```bash
pnpm add hexo-browsersync hexo-renderer-pug hexo-wordcount
```

1. 修改根目录下的 `_config.yml` ，设置主题并且开启代码高亮：

```yaml
highlight:
  hljs: true
...
theme: arknights
```

2. 把 **themes/arknights/\_config.yml** 剪切到项目根目录，并重命名为 `_config.arknights.yml`
3. 修改`_config.arknights.yml`开启字数统计和阅读时间预估

   ```yaml
   count: true # 是否显示字数统计
   time: true # 是否显示预计阅读时长
   ```

# 部署到Github Pages

Github 新建仓库，名称为 `<username>.github.io`，然后点击 Create repositpory 完成创建。

> 这里username是你的Github账号用户名

1. 创建完成之后，在项目根目录下执行以下命令：

```bash
git init
git remote add origin https://github.com/username/username.github.io.git
git branch -M main
```

2. 在代码仓库中前往 **Settings** > **Pages** 。
   将 source 选项更改为 **GitHub Actions。**
   ![GitHub Pages设置](/images/github-pages-setting.png)

3. 创建 `.github/workflows/pages.yml` 文件，写入以下内容并提交：

   ```yaml
   name: Pages

   on:
     push:
       branches:
         - main # default branch

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
           with:
             token: ${{ secrets.GITHUB_TOKEN }}
             # If your repository depends on submodule, please see: https://github.com/actions/checkout
             submodules: recursive
         - name: Setup pnpm
           uses: pnpm/action-setup@v4
           with:
             version: latest
         - name: Use Node.js 22
           uses: actions/setup-node@v4
           with:
             # Examples: 20, 18.19, >=16.20.2, lts/Iron, lts/Hydrogen, *, latest, current, node
             # Ref: https://github.com/actions/setup-node#supported-version-syntax
             node-version: "22"
             cache: "pnpm"
         - name: Install Dependencies
           run: pnpm install
         - name: Build
           run: pnpm run build
         - name: Upload Pages artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./public
     deploy:
       needs: build
       permissions:
         pages: write
         id-token: write
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

> 注意，这里面的 node version 最好要跟你本地环境的一致。可以通过 `node -v` 查看，只要大版本一致即可。

4. 提交改动，将 `main` 分支 push 到 GitHub：

```bash
git push -u origin main
```

> 默认情况下 `public/` 不会被上传(也不该被上传)，确保 `.gitignore` 文件中包含一行 `public/`。

5. Github Action 会自动触发部署，成功后前往 username.github.io 查看网页。
