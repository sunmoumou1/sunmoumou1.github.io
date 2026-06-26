---
title: "About"
layout: gridlay
sitemap: false
permalink: /about/
---

## About

<div class="section-card">
<div class="pi-card">
<img src="{{ site.photo | prepend: '/images/' | relative_url }}" class="pi-photo" alt="{{ site.name }}" loading="lazy">
<div>
<h3 class="pi-name">{{ site.name }} <span style="font-size: 1rem; color: var(--text-secondary);">(孙森灿)</span></h3>
<p style="font-style: italic; color: var(--text-secondary);">{{ site.title }}, {{ site.institution }}</p>
<div class="pi-links">
{% if site.email %}<a href="mailto:{{ site.email }}" class="icon-link" title="Email"><i class="fa-solid fa-envelope"></i></a>{% endif %}
{% if site.links.github and site.links.github != "" %}<a href="{{ site.links.github }}" class="icon-link" title="GitHub"><i class="fa-brands fa-github"></i></a>{% endif %}
{% if site.links.google_scholar and site.links.google_scholar != "" %}<a href="{{ site.links.google_scholar }}" class="icon-link" title="Google Scholar"><i class="ai ai-google-scholar"></i></a>{% endif %}
</div>
{% if site.data.pi[0].education %}
<ul style="margin-top: var(--space-4);">
{% for education in site.data.pi[0].education %}
<li>{{ education | replace: "-","&#8211;" }}</li>
{% endfor %}
</ul>
{% endif %}
</div>
</div>
</div>

<div class="section-card">
<h3>Academic Background</h3>
<p>I work at the intersection of atmospheric science and artificial intelligence. My current research focuses on AI methods for weather forecasting, data assimilation, and climate prediction.</p>
<p>My undergraduate training in atmospheric science covered dynamic meteorology, principles of meteorology, climate dynamics, and experience with atmospheric numerical models. This background shapes my interest in AI systems that remain useful for real geophysical problems.</p>
</div>

<div class="section-card">
<h3>Research Interests</h3>
<ul>
<li>Probabilistic generative models, especially diffusion models.</li>
<li>AI methods for weather prediction and climate simulation.</li>
<li>Data assimilation and data-driven atmospheric modeling.</li>
<li>Extreme-event augmentation for predictive model training.</li>
</ul>
</div>

<div class="section-card">
<h3>Experience</h3>
<p><strong>Meteorological AI Algorithm Engineering Intern, ColorfulClouds Tech.</strong></p>
<p>During this internship, I learned the full workflow of AI-powered weather forecasting, including data transmission and management, model architecture design, cloud-based training and deployment, testing, and production rollout. In the early stage, I worked on an HRNet-based radar image denoising project.</p>
</div>

<div class="section-card">
<h3>Skills</h3>
<p><strong>Artificial Intelligence.</strong> My AI background builds on computer architecture, operating systems, data structures and algorithms, and high-performance computing. I am particularly interested in using deep learning to address scientific problems in meteorology.</p>
<p><strong>Meteorology.</strong> I have a solid foundation in atmospheric science from undergraduate and doctoral training, including dynamic meteorology and climate dynamics.</p>
<p><strong>Technical Writing.</strong> I enjoy explaining technical subjects in simple and practical terms. I hope to write more science and technical articles about Pangu-Weather, MetNet, diffusion models, and related topics.</p>
</div>
