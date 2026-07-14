---
title: "Home"
layout: homelay
sitemap: false
permalink: /
---

<header class="home-hero-block" markdown="0">
<img src="{{ '/images/avatar.JPG' | relative_url }}" class="home-hero-avatar" alt="{{ site.name }}" loading="lazy">
<div class="home-hero-text">
<h2 class="home-hero">{{ site.name }}</h2>
<p class="home-hero-sub">{{ site.title }}, {{ site.institution }}</p>
<div class="home-hero-links">
{% if site.email %}<a href="mailto:{{ site.email }}" class="icon-link" title="Email"><i class="fa-solid fa-envelope"></i></a>{% endif %}
{% if site.links.google_scholar and site.links.google_scholar != "" %}<a href="{{ site.links.google_scholar }}" class="icon-link" title="Google Scholar"><i class="ai ai-google-scholar"></i></a>{% endif %}
{% if site.links.github and site.links.github != "" %}<a href="{{ site.links.github }}" class="icon-link" title="GitHub"><i class="fa-brands fa-github"></i></a>{% endif %}
</div>
</div>
</header>

<section class="research-interest-feature" aria-labelledby="forecasting-focus" markdown="0">
<p class="section-kicker">Research Focus</p>
<h3 id="forecasting-focus">AI for operational forecasting</h3>
<div class="chip-container">
<span class="chip"><i class="fa-solid fa-satellite-dish"></i>AI for Operational Forecasting</span>
<span class="chip"><i class="fa-solid fa-database"></i>Data Assimilation</span>
<span class="chip"><i class="fa-solid fa-cloud-sun-rain"></i>Weather Prediction</span>
<span class="chip"><i class="fa-solid fa-calendar-days"></i>S2S Forecasting</span>
<span class="chip"><i class="fa-solid fa-earth-asia"></i>Climate Projection</span>
</div>
<figure class="research-interest-figure">
<img src="{{ '/images/my_research_interest.png' | relative_url }}" alt="Operational forecasting pipeline from assimilation to forecast model, weather products, S2S, and climate simulation" loading="lazy">
<figcaption>Figure drawn by Sencan Sun. AI methods can be inserted into each stage of the <strong>operational</strong> pipeline, replacing or augmenting modules where they improve forecast skill and reliability.</figcaption>
</figure>
<div class="research-interest-copy">
<p>I am interested in using AI to gradually replace and improve individual modules in the <strong>operational</strong> forecasting pipeline: from data assimilation, to medium-range weather prediction, to subseasonal-to-seasonal forecasting, and ultimately to climate projection.</p>
<p>The goal is not only to build stronger models, but to help <strong>operational</strong> forecasting skill continue growing rapidly and sustainably over the next decade.</p>
</div>
</section>

I welcome conversations and collaboration around AI for weather and climate. You can reach me at [ssc23@mails.tsinghua.edu.cn](mailto:ssc23@mails.tsinghua.edu.cn).

<section class="guestbook" aria-labelledby="guestbook-title" markdown="0">
<div class="guestbook-intro">
<p class="section-kicker">Guestbook</p>
<h3 id="guestbook-title">Leave a message</h3>
<p>Questions, ideas, or just a hello — I would be delighted to hear from you. Your email address will only be used to reply and will never be displayed publicly.</p>
</div>

<form class="guestbook-form" id="guestbookForm" action="https://formsubmit.co/ssc23@mails.tsinghua.edu.cn" method="POST">
<input type="hidden" name="_subject" value="New message from the website guestbook">
<input type="hidden" name="_template" value="table">
<input type="hidden" name="_url" value="{{ site.url }}{{ site.baseurl }}/#guestbook-title">
<div class="guestbook-honeypot" aria-hidden="true">
<label for="guestbookWebsite">Website</label>
<input id="guestbookWebsite" type="text" name="_honey" tabindex="-1" autocomplete="off">
</div>

<div class="guestbook-fields">
<div class="guestbook-field">
<label for="guestbookName">Name</label>
<input id="guestbookName" type="text" name="name" autocomplete="name" minlength="2" maxlength="80" placeholder="Your name" required>
</div>
<div class="guestbook-field">
<label for="guestbookEmail">Email</label>
<input id="guestbookEmail" type="email" name="email" autocomplete="email" maxlength="160" placeholder="you@example.com" required>
</div>
</div>

<div class="guestbook-field">
<div class="guestbook-label-row">
<label for="guestbookMessage">Message</label>
<span id="guestbookCount" aria-live="polite">0 / 1200</span>
</div>
<textarea id="guestbookMessage" name="message" rows="6" minlength="2" maxlength="1200" placeholder="Write your message here…" required></textarea>
</div>

<div class="guestbook-actions">
<button class="guestbook-submit" type="submit">
<span>Send message</span>
<i class="fa-solid fa-paper-plane" aria-hidden="true"></i>
</button>
<p class="guestbook-status" id="guestbookStatus" role="status" aria-live="polite"></p>
</div>
</form>
</section>
