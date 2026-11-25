---
# 页面标题，会被 Jekyll 用作该页面的 title。
title: "About"

# 指定该页面使用的 layout。
# 这里使用的是 gridlay，说明该页面会套用项目中 _layouts/gridlay.html 的布局模板。
layout: gridlay

# sitemap: false 表示该页面不加入 sitemap。
# 一般用于不希望搜索引擎通过 sitemap 主动索引的页面。
sitemap: false

# permalink 指定该页面生成后的固定访问路径。
# 这里最终页面路径是 /about/。
permalink: /about/
---

## About<span class="zh" lang="zh-CN">关于我</span>

{% comment %}
下面是个人简介卡片区域。

section-card:
  通常是自定义 CSS 类，用来包裹一个页面 section。
  它可能控制卡片背景、边距、圆角、阴影等视觉样式。

pi-card:
  PI / personal info card 的含义。
  这里用于放置头像、姓名、职位、机构、联系方式、教育背景等个人信息。
{% endcomment %}
<div class="section-card" markdown="0">
<div class="pi-card">

{% comment %}
个人头像图片。

src:
  {{ site.photo }} 从 Jekyll 的全局配置中读取 photo 字段。
  prepend: '/images/' 表示在文件名前面加上 /images/ 路径。
  relative_url 会根据站点的 baseurl 自动生成正确的相对路径。
  这样即使网站部署在 GitHub Pages 的子路径下，图片路径也不容易出错。

class="pi-photo":
  用于给头像图片应用 CSS 样式。

alt:
  使用 {{ site.name }} 作为图片替代文本。
  这有利于无障碍访问和 SEO。

loading="lazy":
  浏览器懒加载图片，只有当图片接近可视区域时才加载。
  可以提升页面初始加载速度。
{% endcomment %}
<img src="{{ '/images/avatar.JPG' | relative_url }}" class="pi-photo" alt="{{ site.name }}" loading="lazy">

<div>

{% comment %}
个人姓名标题。

{{ site.name }}:
  从 Jekyll 配置文件中读取姓名。

{{ site.name_en }} / {{ site.name_zh }}:
  分别读取 _config.yml 中的英文名和中文名，实现中英双语显示。
  中文名放在 <span class="zh"> 中，由 _sass/base/_bilingual.scss 统一控制字体、字号和颜色。
{% endcomment %}
<h3 class="pi-name">{{ site.name_en | default: site.name }}{% if site.name_zh %}<span class="zh" lang="zh-CN">{{ site.name_zh }}</span>{% endif %}</h3>
<p class="pi-role">{{ site.title }}<span class="zh" lang="zh-CN">{{ site.title_zh }}</span></p>

{% comment %}
联系方式链接区域。

pi-links:
  用于包裹邮箱、GitHub、Google Scholar 等图标链接。
  具体图标样式通常由 CSS 和 Font Awesome / Academicons 控制。
{% endcomment %}
<div class="pi-links">

{% comment %}
邮箱链接。

if site.email 条件:
  只有当 site.email 存在时才渲染邮箱图标。
  这样可以避免 email 为空时生成无效链接。

mailto:
  点击后会调用本地邮件客户端发送邮件。

fa-solid fa-envelope:
  Font Awesome 中的信封图标。
{% endcomment %}
{% if site.email %}<a href="mailto:{{ site.email }}" class="icon-link" title="Email"><i class="fa-solid fa-envelope"></i></a>{% endif %}

{% comment %}
GitHub 链接。

判断条件:
  site.links.github 存在，并且不等于空字符串时才显示。

这样写的好处:
  如果配置文件中没有 GitHub 链接，或者链接为空，页面不会显示 GitHub 图标。

fa-brands fa-github:
  Font Awesome 品牌图标中的 GitHub 图标。
{% endcomment %}
{% if site.links.github and site.links.github != "" %}<a href="{{ site.links.github }}" class="icon-link" title="GitHub"><i class="fa-brands fa-github"></i></a>{% endif %}

{% comment %}
Google Scholar 链接。

判断条件:
  site.links.google_scholar 存在且不为空时才显示。

ai ai-google-scholar:
  这是 Academicons 图标库中的 Google Scholar 图标。
  注意它不是 Font Awesome，而是 Academicons。
{% endcomment %}
{% if site.links.google_scholar and site.links.google_scholar != "" %}<a href="{{ site.links.google_scholar }}" class="icon-link" title="Google Scholar"><i class="ai ai-google-scholar"></i></a>{% endif %}
</div>

<div class="credential-list" aria-label="Education">
<div class="credential-item">
<img src="{{ '/images/zzfls.png' | relative_url }}" class="credential-logo" alt="Zhengzhou Foreign Language School logo" loading="lazy">
<div>
<div class="credential-title">High School<span class="zh" lang="zh-CN">高中</span></div>
<div class="credential-meta">Zhengzhou Foreign Language School<span class="zh zh-line" lang="zh-CN">郑州外国语学校</span></div>
<div class="credential-date">2016.09 – 2019.06</div>
</div>
</div>
<div class="credential-item">
<img src="{{ '/images/南京大学校徽.png' | relative_url }}" class="credential-logo" alt="Nanjing University logo" loading="lazy">
<div>
<div class="credential-title">B.S. Atmospheric Science<span class="zh" lang="zh-CN">大气科学 理学学士</span></div>
<div class="credential-meta">School of Atmospheric Sciences, Nanjing University<span class="zh zh-line" lang="zh-CN">南京大学 大气科学学院</span></div>
<div class="credential-date">2019.09 – 2023.06</div>
</div>
</div>
<div class="credential-item">
<img src="{{ '/images/清华大学校徽.png' | relative_url }}" class="credential-logo" alt="Tsinghua University logo" loading="lazy">
<div>
<div class="credential-title">Doctoral Student<span class="zh" lang="zh-CN">博士研究生</span></div>
<div class="credential-meta">Department of Earth System Science, Tsinghua University<span class="zh zh-line" lang="zh-CN">清华大学 地球系统科学系</span></div>
<div class="credential-date">2023.09 – Present<span class="zh" lang="zh-CN">至今</span></div>
<div class="credential-advisors"><strong>Advisor<span class="zh" lang="zh-CN">导师</span></strong><a href="https://scholar.google.com/citations?user=WYyB7wYAAAAJ&hl=zh-CN&oi=ao">Yanluan Lin<span class="zh" lang="zh-CN">林岩峦</span></a></div>
<div class="credential-advisors"><strong>Co-advisors<span class="zh" lang="zh-CN">联合导师</span></strong><a href="https://scholar.google.com/citations?hl=zh-CN&user=DFgFVVYAAAAJ">Baoxiang Pan<span class="zh" lang="zh-CN">潘宝祥</span></a><span class="credential-sep" aria-hidden="true">·</span><a href="https://scholar.google.com/citations?hl=zh-CN&user=0QWGZ1sAAAAJ">Wenhao Dong<span class="zh" lang="zh-CN">董文浩</span></a></div>
</div>
</div>
</div>

</div>
</div>
</div>

{% comment %}
Experience 区域。

这个 section 介绍三段实习经历：
  1. ColorfulClouds Tech. 气象 AI 算法工程实习
  2. Huawei Technologies Co., Ltd. 时空预测算法实习
  3. Zhijiang Lab 大语言模型研究实习
{% endcomment %}
<div class="section-card" markdown="0">
<h3>Experience<span class="zh" lang="zh-CN">实习经历</span></h3>

{% comment %}
第一段实习经历：ColorfulClouds Tech.

职位：
  Meteorological AI Algorithm Engineering Intern

时间：
  2023.06 - 2023.09

地点：
  Beijing

主要内容：
  参与 AI 天气预报工程流程，并实现基于 HRNet 的雷达图像去噪系统。
{% endcomment %}
<div class="experience-item">
<img src="{{ '/images/彩云科技.png' | relative_url }}" class="experience-logo" alt="ColorfulClouds Tech logo" loading="lazy">
<div class="experience-content">
<div class="experience-header">
<div>
<strong class="experience-role">Meteorological AI Algorithm Engineering Intern<span class="zh zh-line" lang="zh-CN">气象 AI 算法工程实习生</span></strong>
<span class="experience-org">ColorfulClouds Tech.<span class="zh" lang="zh-CN">彩云科技</span></span>
</div>
<div class="experience-date">2023.06 – 2023.09<span class="experience-place">Beijing<span class="zh" lang="zh-CN">北京</span></span></div>
</div>
<ul>
<li>Designed and implemented a radar image denoising system based on the HRNet deep learning architecture.<span class="zh zh-line" lang="zh-CN">基于 HRNet 深度学习架构，设计并实现了一套雷达图像去噪系统。</span></li>
<li>Learned the full workflow of AI-powered weather forecasting, including data transmission and management, model architecture design, cloud-based training and deployment, testing, and production rollout.<span class="zh zh-line" lang="zh-CN">完整学习了 AI 天气预报的业务流程，包括数据传输与管理、模型架构设计、云端训练与部署、测试以及上线运行。</span></li>
</ul>
</div>
</div>

{% comment %}
第二段实习经历：Huawei Technologies Co., Ltd.

职位：
  Spatiotemporal Forecasting Algorithm Intern

时间：
  2024.12 - 2025.05

地点：
  Beijing

主要内容：
  参与 AI atmospheric model development 相关技术讨论。
{% endcomment %}
<div class="experience-item">
<img src="{{ '/images/Huawei.png' | relative_url }}" class="experience-logo" alt="Huawei logo" loading="lazy">
<div class="experience-content">
<div class="experience-header">
<div>
<strong class="experience-role">Spatiotemporal Forecasting Algorithm Intern<span class="zh zh-line" lang="zh-CN">时空预测算法实习生</span></strong>
<span class="experience-org">Huawei Technologies Co., Ltd.<span class="zh" lang="zh-CN">华为技术有限公司</span></span>
</div>
<div class="experience-date">2024.12 – 2025.05<span class="experience-place">Beijing<span class="zh" lang="zh-CN">北京</span></span></div>
</div>
<ul>
<li>Participated in weekly technical meetings and contributed insights on AI atmospheric model development.<span class="zh zh-line" lang="zh-CN">参与每周技术例会，为 AI 大气模型的研发贡献见解与建议。</span></li>
</ul>
</div>
</div>

{% comment %}
第三段实习经历：Zhijiang Lab.

职位：
  Large Language Model Research Intern

时间：
  2025.06.22 - 2025.08.03

地点：
  Hangzhou

主要内容：
  研究大语言模型在地学问答任务中的性能提升，重点关注 Test-Time Scaling。
{% endcomment %}
<div class="experience-item">
<img src="{{ '/images/zhijiang_lab.png' | relative_url }}" class="experience-logo" alt="Zhijiang Lab logo" loading="lazy">
<div class="experience-content">
<div class="experience-header">
<div>
<strong class="experience-role">Large Language Model Research Intern<span class="zh zh-line" lang="zh-CN">大语言模型研究实习生</span></strong>
<span class="experience-org">Zhijiang Lab<span class="zh" lang="zh-CN">之江实验室</span></span>
</div>
<div class="experience-date">2025.06.22 – 2025.08.03<span class="experience-place">Hangzhou<span class="zh" lang="zh-CN">杭州</span></span></div>
</div>
<ul>
<li>Conducted research on enhancing the performance of large language models (LLMs) in geological question answering tasks, with a focus on the application of Test-Time Scaling (TTS) techniques.<span class="zh zh-line" lang="zh-CN">研究如何提升大语言模型（LLM）在地学问答任务中的表现，重点关注测试时扩展（Test-Time Scaling，TTS）技术的应用。</span></li>
<li>Designed and implemented algorithms based on three representative TTS approaches: Parallel Scaling, Sequential Scaling, and Internal Scaling.<span class="zh zh-line" lang="zh-CN">基于三类代表性的 TTS 方法——并行扩展（Parallel Scaling）、序列扩展（Sequential Scaling）与内部扩展（Internal Scaling）——设计并实现了相应算法。</span></li>
</ul>
</div>
</div>

</div>

{% comment %}
Beyond Research 区域。

这是一段更个人化的介绍：
  - 出生信息（2000 年 7 月 14 日，河南周口鹿邑）
  - 一组按年龄排列的生活照（童年、高中、福州、洛杉矶），让读者更了解作者本人。

photo-gallery / photo-card:
  自定义 CSS，等高图片条带，统一不同长宽比的照片，照片下方带说明文字。
{% endcomment %}
<div class="section-card beyond-research-card" markdown="0">
<h3>Beyond Research<span class="zh" lang="zh-CN">研究之外</span></h3>
<p>Beyond my research, a little about me.</p>
<p class="zh" lang="zh-CN">科研之外，也简单介绍一下我自己。</p>
<p>I was born on July 14, 2000, in a small farming village in Luyi County (鹿邑县), Zhoukou City (周口市), Henan Province, China. When I was five, my parents brought me to Zhengzhou, where I grew up and went to school until I left at nineteen to begin university in Nanjing. I am deeply grateful to my parents for the brave, tireless years they spent building a life in the city and giving me a better education — without them, nothing I have today would have been possible.</p>
<p class="zh" lang="zh-CN">2000年7月14日，我出生在河南省周口市鹿邑县的一个小村庄。五岁那年，父母带我来到郑州，我在那里长大、上学，直到十九岁离家，到南京开始大学生活。我由衷地感谢我的父母：那些年，他们勇敢而不知疲倦地在城市里打拼、扎根，为我争取更好的教育。没有他们，就没有我今天所拥有的一切。</p>
<p>My undergraduate years in Nanjing were, quite simply, the happiest of my life. I am grateful to the city itself — its beautiful scenery, gentle climate, and warm, easygoing spirit — and to everyone who was part of my years at Nanjing University: the teachers who guided me, the teammates who played football alongside me (with their help, I even won the league's Golden Boot), and the senior schoolmates who joined me on long walks and conversations. Through those conversations, I gradually outgrew the naive outlook of a high school student and began to understand how modern society works. I am equally grateful to the many others I have not mentioned here. Their presence in my life has given me memories that, even across the passage of time, still fill me with happiness.</p>
<p class="zh" lang="zh-CN">在南京读本科的那几年，是我人生中最快乐的时光。我感谢这座城市——它秀美的风景、温和的气候，以及温暖而闲适的气质；也感谢在南京大学陪伴过我的每一个人：悉心指导我的老师们，和我一起在球场上奔跑的队友们（在他们的帮助下，我甚至拿到了联赛金靴），还有陪我一起散步、长谈的学长学姐们。正是在这些交谈中，我渐渐褪去了高中生的稚气，开始理解现代社会是如何运转的。同样感谢许多未能在此一一提及的人。他们的出现给我留下了许多回忆，即使时光流逝，至今想起仍让我满心欢喜。</p>
<p>Here are a few snapshots along the way — from childhood to more recent travels.</p>
<p class="zh" lang="zh-CN">下面是一路走来的几张照片——从童年，到近几年的旅行。</p>
<div class="photo-gallery">
<figure class="photo-card">
<img src="{{ '/images/child.JPG' | relative_url }}" alt="Sencan Sun at around one or two years old in a park" loading="lazy">
<figcaption><strong>Age 1–2</strong> · A candid moment in the park, photographed by my mother.<span class="zh zh-line" lang="zh-CN"><strong>1–2岁</strong> · 在公园里被妈妈抓拍的瞬间。</span></figcaption>
</figure>
<figure class="photo-card">
<img src="{{ '/images/year_10.png' | relative_url }}" alt="Sencan Sun at around ten years old with his grandmother" loading="lazy">
<figcaption><strong>Around age 10</strong> · With my grandmother; the exact age is a little uncertain.<span class="zh zh-line" lang="zh-CN"><strong>10岁左右</strong> · 和奶奶在一起；具体年龄已经记不太清了。</span></figcaption>
</figure>
<figure class="photo-card">
<img src="{{ '/images/yaer17.JPG' | relative_url }}" alt="Sencan Sun at age seventeen playing in an inter-class football tournament" loading="lazy">
<figcaption><strong>Age 17</strong> · Playing in an inter-class football tournament during my second year of high school.<span class="zh zh-line" lang="zh-CN"><strong>17岁</strong> · 高二时参加班级足球联赛。</span></figcaption>
</figure>
<figure class="photo-card">
<img src="{{ '/images/fuzhou.JPG' | relative_url }}" alt="Sencan Sun in Fuzhou" loading="lazy">
<figcaption><strong>Age 23</strong> · In Fuzhou.<span class="zh zh-line" lang="zh-CN"><strong>23岁</strong> · 在福州。</span></figcaption>
</figure>
<figure class="photo-card">
<img src="{{ '/images/losangles.jpg' | relative_url }}" alt="Sencan Sun in Los Angeles, with the Hollywood sign in the background" loading="lazy">
<figcaption><strong>Age 25</strong> · In front of the Hollywood sign in Los Angeles.<span class="zh zh-line" lang="zh-CN"><strong>25岁</strong> · 在洛杉矶的好莱坞标志前。</span></figcaption>
</figure>
</div>
</div>

{% include guestbook.html %}
