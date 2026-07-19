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
{% include research-pipeline.html %}
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
