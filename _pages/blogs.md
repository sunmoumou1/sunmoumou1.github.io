---
title: "Posts"
layout: gridlay
sitemap: false
permalink: /blogs/
---

## Posts

{% if site.posts.size > 0 %}
<div class="section-card" markdown="0">
{% for post in site.posts %}
{% if post.target_url %}{% assign post_href = post.target_url | relative_url %}{% else %}{% assign post_href = post.url | relative_url %}{% endif %}
<article class="blog-list-item">
<div class="blog-list-content">
<span class="news-date">{{ post.date | date: "%b %-d, %Y" }}</span>
<a class="blog-list-title" href="{{ post_href }}">{{ post.title }}</a>
{% if post.excerpt %}<div class="blog-list-excerpt">{{ post.excerpt | strip_html | truncatewords: 32 }}</div>{% endif %}
</div>
{% if post.image %}<a class="blog-list-image" href="{{ post_href }}" aria-label="Read {{ post.title | escape }}"><img src="{{ post.image | relative_url }}" alt="{{ post.title | escape }}" loading="lazy"></a>{% endif %}
</article>
{% endfor %}
</div>
{% else %}
<p class="text-muted">No blog posts yet.</p>
{% endif %}
