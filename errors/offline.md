---
layout: error
title: Uh-Oh! It looks like you're offline
code: No internet connection
permalink: /offline.html
sitemap: false
---

Not everything on this website works without an internet connection. Try heading [back to the homepage](/), read one of the articles below, or [view the full listing](/writing).

<ul class="offline-listing">
  {% assign posts = site.categories.featured | sort: 'featured_order' | limit: 3 %}
  {% for post in posts %}
    <li class="offline-listing__item">
      <h3 class="offline-listing__title">
        <a class="offline-listing__link"
          href="{{ post.url }}"
          title="{{ post.title }}">
          {{ post.title }}
        </a>
      </h3>

      <div class="offline-listing__meta">
        <span>Published on</span>&nbsp;
        <date itemprop="datePublished"
              content="{{ post.date | date_to_xmlschema }}"
              class="offline-listing__date dt-published">
          {{ post.date | date: '%e' }}{{ post.date | date_to_xmlschema | ordinal }} {{ post.date | date: '%B %Y' }}
        </date>
      </div>
    </li>
  {% endfor %}
</ul>
