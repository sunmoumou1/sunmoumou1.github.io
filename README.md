# 个人学术主页 (sunmoumou1.github.io)

孙森灿的个人学术网站。线上地址：**https://sunmoumou1.github.io**

这是一个基于 **Jekyll**（静态网站生成器）搭建的网站，托管在 **GitHub Pages** 上。
本文档说明：项目里每个文件/文件夹的作用、网站是怎么发布的、以及你后续最常做的几件事该怎么改。

---

## 1. 一句话原理：网站是怎么上线的

```
你修改文件  →  git push 到 GitHub 的 main 分支  →  GitHub Actions 自动用 Jekyll 编译  →  自动部署到 GitHub Pages
```

- **你不需要在本地手动编译。** 只要把改动 push 到 `main` 分支，几分钟后线上网站就会自动更新。
- 自动构建的脚本是 [`.github/workflows/jekyll.yml`](.github/workflows/jekyll.yml)。
- 编译过程会用 [Jekyll](https://jekyllrb.com/) 把 Markdown / 模板转换成最终的 HTML（输出到 `_site/`，这个目录不需要你管，也不会提交到仓库）。

> 想确认是否部署成功：打开 GitHub 仓库页面 → 上方 **Actions** 标签 → 看最新一次运行是不是绿色对勾。

---

## 2. 你最常改的东西（按需求查表）

| 我想… | 改这个文件 |
|---|---|
| 改姓名 / 头衔 / 单位 / 邮箱 / 各种社交链接 / 主题色 | [`_config.yml`](_config.yml) |
| 换头像 / 换主页配图 | 把图片放到 [`images/`](images/)，再在对应位置引用文件名 |
| 更新「最近动态 / News」时间线 | [`_data/news.yml`](_data/news.yml) |
| 改教育经历 | [`_data/pi.yml`](_data/pi.yml) |
| 增删论文（Publications 页面） | [`assets/ref.bib`](assets/ref.bib) |
| 写一篇博客 / 短文 | 在 [`_posts/`](_posts/) 新建 Markdown 文件 |
| 写一篇长笔记 | 在 [`blogs/`](blogs/) 新建 Markdown 文件 |
| 改某个页面的文字内容（About / 主页 / Research 等） | [`_pages/`](_pages/) 里对应的 `.md` 文件 |
| 改配色 / 字体 / 间距等样式 | 主题色在 `_config.yml`；细节在 [`_sass/`](_sass/) |
| 改页面交互（暗色切换、搜索、论文筛选） | [`assets/js/site.js`](assets/js/site.js)（改完要重新打包，见 §4.7） |
| 查看访问人数、热门页面、来源和国家/地区 | 按第 4 节启用 Google Analytics 4 |

具体操作步骤见下面的 **第 4 节**。

---

## 3. 文件结构总览（每个文件夹/文件干什么）

### 3.1 网站配置与发布

| 文件 | 作用 |
|---|---|
| `_config.yml` | **全站总配置。** 姓名、头衔、单位、邮箱、社交链接、导航栏、主题色（`accent_color`）、暗色模式开关、jekyll-scholar（论文插件）设置等。改动它通常要等下次构建生效。 |
| `Gemfile` | 声明 Jekyll 及插件（jekyll-scholar）的 Ruby 依赖。GitHub Actions 构建时会读它。 |
| `package.json` | 用 [esbuild](https://esbuild.github.io/) 把 `assets/js/site.js` 打包压缩成 `site.min.js`（见 §4.7）。 |
| `.github/workflows/jekyll.yml` | **自动构建 + 部署脚本。** push 到 `main` 时由 GitHub Actions 执行。 |
| `.gitignore` | 告诉 git 哪些文件不提交（如 `_site/`、`vendor/`、缓存等）。 |
| `favicon.svg` / `favicon.ico` | 浏览器标签页的小图标。 |
| `robots.txt` / `feed.xml` | 搜索引擎抓取规则 / RSS 订阅源。 |
| `citesty.csl` | 论文引用的排版样式（被 jekyll-scholar 使用）。 |

### 3.2 网站内容（**这些是你日常要改的**）

| 路径 | 作用 |
|---|---|
| `_pages/` | 各个**页面**。每个 `.md` 顶部的「front matter」（`---` 之间的部分）决定标题、布局和网址。包含：`home.md`（主页）、`about.md`、`publications.md`、`research.md`、`activities.md`、`blogs.md`（博客列表页）、`allnews.md`（全部动态）、`404.md`（找不到页面时显示）。 |
| `_posts/` | **博客文章 / 短文。** 文件名必须是 `年-月-日-标题.md` 格式（如 `2024-08-15-xxx.md`）。会自动出现在博客列表里。 |
| `blogs/` | 一些**长篇笔记页面**（如雷达、流体力学笔记）以及它们用到的图片。用的是 `page` 布局。 |
| `_data/news.yml` | 「最近动态 / News」时间线的数据（主页侧栏和 allnews 页面读取它）。 |
| `_data/pi.yml` | 教育经历（About 页面和主页侧栏读取它）。 |
| `assets/ref.bib` | **论文数据库（BibTeX 格式）。** Publications 页面的内容全部来自这里，由 jekyll-scholar 插件自动排版。 |
| `images/` | 网站用到的图片（头像、论文配图等）。 |

### 3.3 网站骨架与模板（**结构性文件，平时基本不用动**）

| 路径 | 作用 |
|---|---|
| `_layouts/` | **页面骨架模板。** 决定一类页面长什么样。 |
| ├ `default.html` | 最基础的骨架：装入 `<head>`、顶部导航、页脚。其它布局都基于它。 |
| ├ `gridlay.html` | 普通内容页（About / Publications / Research / Activities / Blog 列表 等）。 |
| ├ `homelay.html` | 主页专用（带左侧个人信息侧栏）。 |
| ├ `page.html` | 长文 / 笔记页面（`blogs/` 里的文章）。 |
| ├ `post.html` | 博客文章页（`_posts/` 里的文章）。 |
| └ `bibtemplate.html` | jekyll-scholar 渲染**每一条文献**时用的模板。 |
| `_includes/` | **可复用的页面片段**，被上面的布局引用。 |
| ├ `head.html` | 网页 `<head>`：标题、SEO/社交分享元信息、字体、图标、样式表、暗色模式脚本。 |
| ├ `header.html` | 顶部**导航栏** + 搜索框。导航项由 `_config.yml` 的 `nav_pages` 控制。 |
| ├ `footer.html` | **页脚**（About / 联系方式 / 链接），并在底部加载 Bootstrap 和 `site.min.js`。 |
| ├ `sidebar.html` | 主页**左侧栏**：头像、社交链接、教育经历、最新动态。 |
| ├ `mathjax.html` | 数学公式渲染（MathJax）。 |
| └ `analytics.html` | 访问统计（Google Analytics，仅在线上生产环境加载）。 |

### 3.4 样式与脚本

| 路径 | 作用 |
|---|---|
| `assets/main.scss` | **样式总入口。** Jekyll 会把它编译成 `assets/main.css`（网页实际加载的样式）。它按顺序 `@import` 了 `_sass/` 里的各个片段。 |
| `_sass/` | SCSS 样式源码（被 `main.scss` 引入后才生效）： |
| ├ `bootstrap/` | Bootstrap 5.3.3 框架源码（**不要改**，里面有 `__DO_NOT_MODIFY` 标记文件）。 |
| ├ `base/` | 基础变量、重置样式、排版。 |
| ├ `components/` | 各组件样式：卡片、导航栏、按钮、页脚、个人信息卡、论文列表、搜索、标签 chips。 |
| ├ `layouts/` | 页面级布局样式：网格、主页、team、research。 |
| └ `utilities/` | 暗色模式、动画。 |
| `assets/js/site.js` | **网站交互逻辑（源码）：** 暗色模式切换、论文筛选、搜索、复制 BibTeX、回到顶部等。 |
| `assets/js/site.min.js` | 上面的**压缩版**，是网页实际加载的那个。改了 `site.js` 后要重新打包生成它（见 §4.7）。 |
| `assets/javascript/bootstrap/` | Bootstrap 的 JavaScript（导航栏折叠、下拉等）。 |
| `assets/search.json` | 站内搜索的索引，构建时自动生成，**不用手动改**。 |

---

## 4. 网站访问统计（Google Analytics 4）

网站已经接入 Google Analytics 4（GA4），启用后可以查看访问人数、浏览量、热门页面、访问来源，以及按国家/地区汇总的访客分布。GitHub Pages 是静态托管，不能直接提供完整的访问日志，因此需要先创建一个免费的 GA4 衡量 ID。

### 4.1 首次启用（只需做一次）

1. 打开 [Google Analytics](https://analytics.google.com/)，创建账号和一个 GA4 媒体资源。
2. 新建“网站”数据流：
   - 网站网址：`https://sunmoumou1.github.io`
   - 数据流名称：可填写 `Sencan Sun Website`
3. 复制页面给出的“衡量 ID”，格式类似 `G-ABC123DEF4`。
4. 打开本仓库的 **Settings → Secrets and variables → Actions → Variables**，点击 **New repository variable**：
   - Name：`GOOGLE_ANALYTICS_ID`
   - Value：上一步复制的 `G-...`
5. 打开仓库的 **Actions**，选择 **Build and deploy Jekyll site to GitHub Pages**，点击 **Run workflow** 重新部署网站。

衡量 ID 会在构建时自动加入页面。它本身是公开标识符，不是密码；使用仓库变量是为了以后更换时不必改代码。

### 4.2 在哪里查看数据

- **当前访问情况**：GA4 左侧 **Reports → Realtime**。启用并重新部署后，自己打开网站，通常几分钟内就能看到实时访问。
- **总访问人数与浏览量**：**Reports → Acquisition → User acquisition**，以及 **Reports → Engagement → Pages and screens**。
- **访客国家/地区**：**Reports → User attributes → Demographic details**，将主要维度选择为 **Country**。
- **历史趋势**：在报告右上角修改日期范围。普通报告首次产生数据可能需要约 24 小时，且只统计启用之后的访问。

统计是近似值：广告拦截器以及浏览器的“请勿跟踪”设置可能阻止统计。网站已关闭 Google Signals 和广告个性化信号，并尊重“请勿跟踪”；GA4 报告展示的是汇总后的国家/地区，不会在本网站保存或展示访客的原始 IP 地址。

### 4.3 本地测试（可选）

如果需要在本地验证，可以临时在 `_config.yml` 的 `analytics.google_id` 中填写衡量 ID，并使用生产环境构建。正常情况下保持为空即可，线上部署会优先读取 GitHub 仓库变量。

---


## 5. 本地预览（可选，不是必须）

不在本地编译也完全能用（push 后线上会自动构建）。如果想在本地预览：
```bash
bundle install                  # 安装依赖（需要较新的 Ruby，建议 3.x）
bundle exec jekyll serve        # 本地启动，浏览器打开 http://localhost:4000
```
> ⚠️ 注意：本仓库目录路径含中文（`工作资料`），旧版 Ruby（如系统自带的 2.6）在本地编译时可能因编码报错。线上 GitHub Actions 用的是 Ruby 3.3，构建正常，所以**直接 push 让线上构建是最稳妥的方式**。


---

## 6. 技术栈速览

- **Jekyll 4** — 静态网站生成器
- **jekyll-scholar** — 从 BibTeX 自动生成论文列表
- **Bootstrap 5.3.3** — 前端 UI 框架（SCSS + JS）
- **GitHub Pages + GitHub Actions** — 托管与自动部署
- **MathJax** — 数学公式渲染
- Font Awesome / Academicons（CDN）— 图标
