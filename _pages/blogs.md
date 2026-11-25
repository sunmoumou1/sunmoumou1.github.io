---
title: "Posts"
layout: gridlay
sitemap: false
permalink: /blogs/
---

## Posts<span class="zh" lang="zh-CN">文章</span>

{% if site.posts.size > 0 %}
{% assign post_total = site.posts.size %}
{% comment %}
  Two ways to browse the same posts (both are filled from _posts/, nothing to edit here):
    Flip · 翻阅 — a pile of paper cards; click, swipe or press ← → to turn the page.
    Desk · 平铺 — every card laid out on the desk; click one to read it.
  The desk view is plain links, so it is also what visitors without JavaScript see.
  Desk tilts and tape colours repeat in a fixed order, so the layout is the same on every visit.
  Desk photos are cropped to 4:3; a post may set e.g. `image_position: "center top"` to choose the crop.

  同一组文章的两种浏览方式（内容都来自 _posts/，此处无需修改）：
    翻阅：一叠纸质卡片，点击、滑动或按 ← → 键翻页；
    平铺：所有卡片摊开在桌面上，点击任一卡片即可阅读。
  桌面卡片的倾斜角度和胶带颜色按固定顺序循环，每次访问看到的布局都一样。
  桌面卡片的封面按 4:3 裁切；如需调整裁切位置，可在文章头部加 image_position（如 "center top"）。
{% endcomment %}
{% assign desk_tilts = "-2.2,1.6,-1.2,2.4,-1.8,1.1" | split: "," %}
{% assign desk_nudges = "0,12,-4,8,-8,4" | split: "," %}
{% assign desk_tapes = "wine,kraft,slate" | split: "," %}

<section class="posts-shelf" id="posts-shelf" data-view="desk" aria-label="Posts · 文章" markdown="0">
  <div class="posts-toolbar">
    <p class="posts-count"><span class="posts-count-num">{{ post_total }}</span> {% if post_total == 1 %}post{% else %}posts{% endif %}<span class="zh" lang="zh-CN">共 {{ post_total }} 篇</span></p>
    <div class="posts-view-toggle" role="group" aria-label="View · 浏览方式" hidden>
      <button type="button" class="posts-view-btn" data-view-target="flip" aria-pressed="false" aria-controls="posts-flip"><i class="fa-solid fa-book-open" aria-hidden="true"></i>Flip<span class="zh" lang="zh-CN">翻阅</span></button>
      <button type="button" class="posts-view-btn" data-view-target="desk" aria-pressed="true" aria-controls="posts-desk"><i class="fa-solid fa-table-cells-large" aria-hidden="true"></i>Desk<span class="zh" lang="zh-CN">平铺</span></button>
    </div>
  </div>

  <div class="posts-surface">
    <div class="posts-flip" id="posts-flip" hidden>
      <div class="posts-deck" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Posts, one card at a time · 逐篇翻阅">
        {% for post in site.posts %}
        {% if post.target_url %}{% assign post_href = post.target_url | relative_url %}{% else %}{% assign post_href = post.url | relative_url %}{% endif %}
        <article class="post-card" role="group" aria-roledescription="slide" aria-label="{{ forloop.index }} / {{ forloop.length }}" data-title="{{ post.title | escape }}">
          <div class="post-card-media{% unless post.image %} is-missing{% endunless %}">
            <span class="post-cover-fallback" aria-hidden="true"><span>{{ post.date | date: "%b" }}</span><strong>{{ post.date | date: "%-d" }}</strong><span>{{ post.date | date: "%Y" }}</span></span>
            {% if post.image %}<img src="{{ post.image | relative_url }}" alt="" {% if forloop.first %}fetchpriority="high"{% else %}loading="lazy"{% endif %} decoding="async">{% endif %}
          </div>
          <div class="post-card-body">
            <time class="post-card-date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}<span class="zh" lang="zh-CN">{{ post.date | date: "%Y年%-m月%-d日" }}</span></time>
            <h3 class="post-card-title"><a href="{{ post_href }}">{{ post.title | escape }}{% if post.title_zh %}<span class="zh zh-line" lang="zh-CN">{{ post.title_zh | escape }}</span>{% endif %}</a></h3>
            {% if post.excerpt %}<p class="post-card-excerpt">{{ post.excerpt | strip_html | strip | truncatewords: 48 }}</p>{% endif %}
            {% if post.excerpt_zh %}<p class="post-card-excerpt post-card-excerpt-zh zh" lang="zh-CN">{{ post.excerpt_zh }}</p>{% endif %}
            <a class="post-card-read" href="{{ post_href }}">Read post<span class="zh" lang="zh-CN">阅读全文</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          </div>
          <span class="post-card-curl" aria-hidden="true"></span>
        </article>
        {% endfor %}
        <span class="posts-edge posts-edge--prev" aria-hidden="true"><i class="fa-solid fa-chevron-left"></i></span>
        <span class="posts-edge posts-edge--next" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>
      </div>

      <div class="posts-controls">
        <button type="button" class="posts-nav" data-step="-1" aria-label="Previous post · 上一篇"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>
        <span class="posts-counter posts-counter-current" aria-hidden="true">01</span>
        <div class="posts-progress"></div>
        <span class="posts-counter" aria-hidden="true">{% if post_total < 10 %}0{% endif %}{{ post_total }}</span>
        <button type="button" class="posts-nav" data-step="1" aria-label="Next post · 下一篇"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
      </div>
      <p class="posts-hint">
        <span class="posts-hint-pointer">Click the card or press ← → to turn the page<span class="zh" lang="zh-CN">点击卡片或按 ← → 键翻页</span></span>
        <span class="posts-hint-touch">Swipe or tap the card to turn the page<span class="zh" lang="zh-CN">左右滑动或轻点卡片翻页</span></span>
      </p>
      <p class="posts-live" aria-live="polite" aria-atomic="true"></p>
    </div>

    <div class="posts-desk" id="posts-desk">
      <ol class="desk-grid">
        {% for post in site.posts %}
        {% if post.target_url %}{% assign post_href = post.target_url | relative_url %}{% else %}{% assign post_href = post.url | relative_url %}{% endif %}
        {% assign tilt_i = forloop.index0 | modulo: desk_tilts.size %}
        {% assign nudge_i = forloop.index0 | modulo: desk_nudges.size %}
        {% assign tape_i = forloop.index0 | modulo: desk_tapes.size %}
        <li class="desk-item desk-item--{{ desk_tapes[tape_i] }}" style="--tilt: {{ desk_tilts[tilt_i] }}deg; --nudge: {{ desk_nudges[nudge_i] }}px; --i: {{ forloop.index0 }};">
          <a class="desk-card" href="{{ post_href }}">
            <span class="desk-tape" aria-hidden="true"></span>
            <span class="desk-photo{% unless post.image %} is-missing{% endunless %}">
              <span class="post-cover-fallback" aria-hidden="true"><span>{{ post.date | date: "%b" }}</span><strong>{{ post.date | date: "%-d" }}</strong><span>{{ post.date | date: "%Y" }}</span></span>
              {% if post.image %}<img src="{{ post.image | relative_url }}" alt="" loading="lazy" decoding="async"{% if post.image_position %} style="object-position: {{ post.image_position }};"{% endif %}>{% endif %}
            </span>
            <span class="desk-caption">
              <time class="desk-date" datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}<span class="zh" lang="zh-CN">{{ post.date | date: "%Y年%-m月%-d日" }}</span></time>
              <span class="desk-title">{{ post.title | escape }}</span>
              {% if post.title_zh %}<span class="desk-title-zh zh" lang="zh-CN">{{ post.title_zh | escape }}</span>{% endif %}
            </span>
          </a>
        </li>
        {% endfor %}
      </ol>
    </div>
  </div>
</section>
<script src="{{ '/assets/js/posts-deck.js' | relative_url }}"></script>
{% else %}
<p class="text-muted">No blog posts yet.<span class="zh" lang="zh-CN">暂无文章。</span></p>
{% endif %}
