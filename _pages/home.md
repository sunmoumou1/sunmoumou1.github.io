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
<div class="forecast-pipeline" role="img" aria-label="Operational forecasting pipeline: observations enter data assimilation to create an analysis and initial condition, a forecast model produces a rollout and weather products, the rollout returns as background information, and indicators or forcing support subseasonal-to-seasonal and climate simulation.">
<div class="forecast-pipeline__head" aria-hidden="true">
<span>Operational forecasting system</span>
<span class="forecast-pipeline__key"><i></i> AI-ready module</span>
</div>
<div class="forecast-pipeline__canvas" aria-hidden="true">
<div class="forecast-pipeline__cycle-frame"></div>
<div class="forecast-pipeline__context">
<span class="forecast-pipeline__context-item forecast-pipeline__context-item--climate"><i class="fa-solid fa-arrows-rotate"></i>S2S / climate simulation</span>
<span class="forecast-pipeline__context-item forecast-pipeline__context-item--forcing"><i class="fa-solid fa-bolt"></i>Indicator / forcing</span>
</div>
<ol class="forecast-pipeline__stages">
<li class="forecast-pipeline__stage forecast-pipeline__stage--observations">
<span class="forecast-pipeline__ai-marker"></span>
<span class="forecast-pipeline__step">01 · Observe</span>
<span class="forecast-pipeline__observation-visual">
<i class="fa-solid fa-earth-americas forecast-pipeline__earth"></i>
<i class="fa-solid fa-satellite forecast-pipeline__platform forecast-pipeline__platform--satellite"></i>
<i class="fa-solid fa-location-dot forecast-pipeline__platform forecast-pipeline__platform--balloon"></i>
<i class="fa-solid fa-satellite-dish forecast-pipeline__platform forecast-pipeline__platform--radar"></i>
</span>
<strong>Observations</strong>
<small>Satellite · balloon · radar</small>
<span class="forecast-pipeline__flow"></span>
</li>
<li class="forecast-pipeline__stage forecast-pipeline__stage--assimilation">
<span class="forecast-pipeline__ai-marker"></span>
<span class="forecast-pipeline__step">02 · Integrate</span>
<span class="forecast-pipeline__icon"><i class="fa-solid fa-code-merge"></i></span>
<strong>Assimilation</strong>
<small>Observations + prior state</small>
<span class="forecast-pipeline__flow"></span>
</li>
<li class="forecast-pipeline__stage forecast-pipeline__stage--analysis">
<span class="forecast-pipeline__ai-marker"></span>
<span class="forecast-pipeline__step">03 · Initialize</span>
<span class="forecast-pipeline__icon"><i class="fa-solid fa-chart-line"></i></span>
<strong>Analysis</strong>
<small>Initial condition <em>x</em><sub>0</sub></small>
<span class="forecast-pipeline__flow"></span>
</li>
<li class="forecast-pipeline__stage forecast-pipeline__stage--model">
<span class="forecast-pipeline__ai-marker"></span>
<span class="forecast-pipeline__step">04 · Predict</span>
<span class="forecast-pipeline__icon"><i class="fa-solid fa-microchip"></i></span>
<strong>Forecast model</strong>
<small>Advance the state in time</small>
<span class="forecast-pipeline__flow"></span>
</li>
<li class="forecast-pipeline__stage forecast-pipeline__stage--rollout">
<span class="forecast-pipeline__ai-marker"></span>
<span class="forecast-pipeline__step">05 · Roll out</span>
<span class="forecast-pipeline__icon"><i class="fa-solid fa-forward-fast"></i></span>
<strong>Rollout</strong>
<small>Trajectory <em>x</em><sub>1:T</sub></small>
<span class="forecast-pipeline__flow"></span>
</li>
<li class="forecast-pipeline__stage forecast-pipeline__stage--products">
<span class="forecast-pipeline__ai-marker"></span>
<span class="forecast-pipeline__step">06 · Deliver</span>
<span class="forecast-pipeline__icon"><i class="fa-solid fa-cloud-sun-rain"></i></span>
<strong>Weather products</strong>
<small>Decision-ready forecasts</small>
</li>
</ol>
<div class="forecast-pipeline__feedback"><span><i class="fa-solid fa-arrow-rotate-left"></i>Background feedback</span></div>
</div>
</div>
<figcaption>Figure drawn by Sencan Sun. AI methods can be inserted into each stage of the <strong>operational</strong> pipeline, replacing or augmenting modules where they improve forecast skill and reliability.</figcaption>
</figure>
<div class="research-interest-copy">
<p>I am interested in using AI to gradually replace and improve individual modules in the <strong>operational</strong> forecasting pipeline: from data assimilation, to medium-range weather prediction, to subseasonal-to-seasonal forecasting, and ultimately to climate projection.</p>
<p>The goal is not only to build stronger models, but to help <strong>operational</strong> forecasting skill continue growing rapidly and sustainably over the next decade.</p>
</div>
</section>

I welcome conversations and collaboration around AI for weather and climate. You can reach me at [ssc23@mails.tsinghua.edu.cn](mailto:ssc23@mails.tsinghua.edu.cn).

<section class="guestbook" id="guestbook" aria-labelledby="guestbook-title" markdown="0">
<div class="guestbook-intro">
<p class="section-kicker">Guestbook</p>
<h3 id="guestbook-title">Leave a message</h3>
<p>Questions, ideas, or just a hello — I would be delighted to hear from you. Messages are displayed publicly after posting; your email address is required for replies but is never shown with your message.</p>
</div>

<div id="HCB_comment_box" class="guestbook-comments">
<p class="guestbook-loading"><i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> Loading the guestbook…</p>
</div>
<script>
window.hcb_user = {
  PAGE: '{{ site.url }}{{ site.baseurl }}/guestbook',
  comments_header: 'Messages',
  name_label: 'Name',
  email_label: 'Email (required, never displayed publicly)',
  content_label: 'Write your public message here…',
  submit: 'Post message',
  no_comments_msg: 'No messages yet. Be the first to leave one!',
  add: 'Leave a message',
  again: 'Post another message',
  said: '',
  subscribe: 'Email me when someone replies',
  reply: 'Reply',
  flag: 'Flag',
  like: 'Like',
  msg_thankyou: 'Thank you — your message is now public.',
  msg_approval: 'This message will appear after moderation.',
  msg_approval_required: 'Thank you. Your message will appear after moderation.',
  err_bad_email: 'Please enter a valid email address.',
  err_comment_empty: 'Please write a message before posting.',
  MAX_CHARS: 1200,
  RELATIVE_DATES: true,
  onload: function () {
    window.setTimeout(function () {
      var name = document.getElementById('hcb_form_name');
      var email = document.getElementById('hcb_form_email');
      var message = document.getElementById('hcb_form_content');
      if (name) {
        name.required = true;
        name.autocomplete = 'name';
      }
      if (email) {
        email.required = true;
        email.autocomplete = 'email';
      }
      if (message) message.required = true;
    }, 0);
  }
};
(function () {
  var script = document.createElement('script');
  var host = 'https://www.htmlcommentbox.com';
  var page = encodeURIComponent(window.hcb_user.PAGE).replace('+', '%2B');
  script.id = 'hcb';
  script.type = 'text/javascript';
  script.async = true;
  script.src = host + '/jread?page=' + page + '&opts=21270&num=10&ts=' + Date.now();
  document.head.appendChild(script);
})();
</script>
<noscript><p class="guestbook-noscript">JavaScript is required to view and post public messages.</p></noscript>
</section>
