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

## About

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

<span> 中的中文名:
  直接写死为“孙森灿”。

style:
  这里使用内联样式控制中文名的字号和颜色。
  color: var(--text-secondary) 使用 CSS 变量，方便和主题颜色保持一致。
{% endcomment %}
<h3 class="pi-name">{{ site.name }}</h3>

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
<div class="credential-title">High School</div>
<div class="credential-meta">Zhengzhou Foreign Language School</div>
<div class="credential-date">Sep 2016 - Jun 2019</div>
</div>
</div>
<div class="credential-item">
<img src="{{ '/images/南京大学校徽.png' | relative_url }}" class="credential-logo" alt="Nanjing University logo" loading="lazy">
<div>
<div class="credential-title">B.S. Atmospheric Science</div>
<div class="credential-meta">School of Atmospheric Sciences, Nanjing University</div>
<div class="credential-date">Sep 2019 - Jun 2023</div>
</div>
</div>
<div class="credential-item">
<img src="{{ '/images/清华大学校徽.png' | relative_url }}" class="credential-logo" alt="Tsinghua University logo" loading="lazy">
<div>
<div class="credential-title">Doctoral student</div>
<div class="credential-meta">Department of Earth System Science, Tsinghua University</div>
<div class="credential-date">Sep 2023 - Present</div>
<div class="credential-advisors"><strong>Advisor:</strong> <a href="https://scholar.google.com/citations?user=WYyB7wYAAAAJ&hl=zh-CN&oi=ao">Yanluan Lin (林岩峦)</a></div>
<div class="credential-advisors"><strong>Co-advisors:</strong> <a href="https://scholar.google.com/citations?hl=zh-CN&user=DFgFVVYAAAAJ">Baoxiang Pan (潘宝祥)</a>, <a href="https://scholar.google.com/citations?hl=zh-CN&user=0QWGZ1sAAAAJ">Wenhao Dong (董文浩)</a></div>
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
<h3>Experience</h3>

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
<strong>Meteorological AI Algorithm Engineering Intern</strong><br>
<span class="experience-org">ColorfulClouds Tech.</span>
</div>
<div class="experience-date">2023.06 - 2023.09<br><span>Beijing</span></div>
</div>
<ul>
<li>Designed and implemented a radar image denoising system based on the HRNet deep learning architecture.</li>
<li>Learned the full workflow of AI-powered weather forecasting, including data transmission and management, model architecture design, cloud-based training and deployment, testing, and production rollout.</li>
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
<strong>Spatiotemporal Forecasting Algorithm Intern</strong><br>
<span class="experience-org">Huawei Technologies Co., Ltd.</span>
</div>
<div class="experience-date">2024.12 - 2025.05<br><span>Beijing</span></div>
</div>
<ul>
<li>Participated in weekly technical meetings and contributed insights on AI atmospheric model development.</li>
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
<strong>Large Language Model Research Intern</strong><br>
<span class="experience-org">Zhijiang Lab</span>
</div>
<div class="experience-date">2025.06.22 - 2025.08.03<br><span>Hangzhou</span></div>
</div>
<ul>
<li>Conducted research on enhancing the performance of large language models (LLMs) in geological question answering tasks, with a focus on the application of Test-Time Scaling (TTS) techniques.</li>
<li>Designed and implemented algorithms based on three representative TTS approaches: Parallel Scaling, Sequential Scaling, and Internal Scaling.</li>
</ul>
</div>
</div>

</div>

{% comment %}
Beyond Research 区域。

这是一段更个人化的介绍：
  - 出生信息（2000 年 7 月 14 日，河南周口鹿邑）
  - 一组生活照（童年、福州、洛杉矶），让读者更了解作者本人。

photo-gallery / photo-card:
  自定义 CSS，等高图片条带，统一不同长宽比的照片，照片下方带说明文字。
{% endcomment %}
<div class="section-card beyond-research-card" markdown="0">
<h3>Beyond Research</h3>
<p>Beyond my research, a little about me. </p>
<p>I was born on July 14, 2000, in a small farming village in Luyi County (鹿邑县), Zhoukou City (周口市), Henan Province, China. When I was five, my parents brought me to Zhengzhou, where I grew up and went to school until I left at nineteen to begin university in Nanjing. I am deeply grateful to my parents for the brave, tireless years they spent building a life in the city and giving me a better education — without them, nothing I have today would have been possible.</p>
<p>My undergraduate years in Nanjing were, quite simply, the happiest of my life. I am grateful to the city itself — its beautiful scenery, gentle climate, and warm, easygoing spirit — and to everyone who was part of my years at Nanjing University: the teachers who guided me, the teammates who played football alongside me (with their help, I even won the league's Golden Boot), and the senior schoolmates who joined me on long walks and conversations. Through those conversations, I gradually outgrew the naive outlook of a high school student and began to understand how modern society works. I am equally grateful to the many others I have not mentioned here. Their presence in my life has given me memories that, even across the passage of time, still fill me with happiness.</p>
<p>Here are a few snapshots along the way — from childhood to more recent travels.</p>
<div class="photo-gallery">
<figure class="photo-card">
<img src="{{ '/images/child.JPG' | relative_url }}" alt="Sencan Sun as a young child" loading="lazy">
<figcaption>Childhood, taken by my mother.</figcaption>
</figure>
<figure class="photo-card">
<img src="{{ '/images/fuzhou.JPG' | relative_url }}" alt="Sencan Sun in Fuzhou" loading="lazy">
<figcaption>Fuzhou</figcaption>
</figure>
<figure class="photo-card">
<img src="{{ '/images/losangles.jpg' | relative_url }}" alt="Sencan Sun in Los Angeles, with the Hollywood sign in the background" loading="lazy">
<figcaption>Los Angeles</figcaption>
</figure>
</div>
</div>

{% include guestbook.html %}
