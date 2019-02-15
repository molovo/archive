---
title: Social media responses on a Jekyll site using webmentions
description: Learn how to set up social media responses on your Jekyll website, and increase user engagement. Click here for the step-by-step guide.
layout: post
tags:
- web
- webmentions
- social
---

I've tried a few times to host some form of comment feed on my Jekyll site, but always ended up abandoning them. Hosted solutions such as Disqus and Facebook were too invasive for my tastes, and after trying and failing to launch my own SaaS company (Chatter.li) to solve the problem, my site has been left comment-less for a few years.

<figure class="image">
  {% responsive_image_block %}
    path: 'img/articles/jekyll-webmentions/chatter.jpg'
    alt: 'A screenshot of the commenting service Chatter, which I launched in 2013, appearing on an older version of this blog.'
    sizes: '(min-width: 42em) 36em, 100vw'
  {% endresponsive_image_block %}

  <figcaption class="image__caption">A screenshot of the commenting service Chatter, which I launched in 2013, appearing on an older version of this blog.</figcaption>
</figure>

I recently came across the new [webmention](https://www.w3.org/TR/webmention/) specification, and the hosted webmention API [webmention.io](https://webmention.io). There were quite a few steps to get it set up, but now that it's done and everything is automated, I am able to have posts about my site and their responses appear as webmentions on my Jekyll blog automatically. I'll talk you through the process below.

### 1. Authenticate your domain

To use the webmention.io API, you'll need to authenticate your domain. To do this, add a few `rel="me"` links to the `<head>` of your site, pointing to your various social media profiles.

```html
<link rel="me" href="https://twitter.com/USERNAME" />
<link rel="me" href="https://github.com/USERNAME" />
<link rel="me" href="mailto:YOUR@EMAIL.COM" />
```

### 2. Sign in to webmention.io with your domain

Go to [webmention.io](https://webmention.io) and sign in using your domain name. This will be your username, which you'll need later on. You'll need to authenticate using one of the social media accounts you linked to in the previous step.

### 3. Install the [jekyll-webmention_io](https://github.com/aarongustafson/jekyll-webmention_io) plugin

This plugin performs a few different tasks for you. It adds the necessary tags to the head of your page to allow you to accept webmentions, it pulls webmentions into your site via the webmention.io API, and it sends outgoing webmentions for any outbound links in your content.

To install the plugin, first add the following to your `Gemfile` and run `bundle install`.

```ruby
group :jekyll_plugins do
  gem "jekyll-webmention_io"
end
```

Then, add the plugin and configuration to `_config.yml`.

```yaml
gems:
  - jekyll-webmention_io

webmentions:
  # Enter your webmention.io username
  username: your-domain-name.com
  cache_bad_uris_for: 5
  # If you've changed domain in the past, list the old ones here
  legacy_domains:
    - https://old-domain.com
    - https://another.com
  # I have the JavaScript portion of the plugin disabled, since I'm
  # triggering builds with Netlify
  js: false
```

Once that's done, add the following liquid tags to your templates.

{% raw %}
```html
<html>
<head>
  ...
  {% webmentions_head %}
  ...
</head>
<body>
  ...
  <!-- You'll probably only want this on article pages -->
  {% webmentions page.url %}
</body>
</html>
```
{% endraw %}

Build and deploy your site, and you're now ready to accept webmentions. If you want to, you can be a lot more specific with the plugin configuration. Take a look at [the jekyll-webmention_io repository](https://github.com/aarongustafson/jekyll-webmention_io) for more details.

### 4. Trigger webmentions for your social media posts

There are a few services out there for sending webmentions, and I haven't tried them all, as I settled on Bridgy pretty quickly. The setup for each of them should be fairly similiar.

To authenticate with Bridgy, go to [brid.gy](https://brid.gy) and sign in with your preferred social media accounts. You'll need to have the URL of your site listed as the website URL on your profile on each service for this step to work. Bridgy will immediately start crawling your website and social media feed, and send webmentions for each of the URLs it finds in your posts, and any posts which mention your domain.

### 5. Trigger site builds when mentions are received

If you head back to [webmention.io](https://webmention.io), you should start seeing the mentions appearing in the dashboard. Now, if you have some mentions, on the settings tab, you can add a webhook address which will be pinged every time a mention is received. I use this to send a request to [Netlify](https://netlify.com) to trigger a rebuild and deploy of my site, meaning the mentions appear on my posts almost immediately.

So there you are, hopefully now you're up and running, with responses to your posts appearing automatically. It may take a while for posts to trickle through, since social media APIs aren't great for accessing historical content (Twitter only lets you search the last 7 days for example), but any new posts after setup should be picked up.

*Thanks to [Aaron Parecki](https://aaronparecki.com/) for his work on building webmention.io, and to [Aaron Gustafson](https://www.aaron-gustafson.com/) for his work on the jekyll-webmention_io plugin. To learn more about webmentions, POSSE and owning your own content, check out [IndieWeb](https://indieweb.org)*
