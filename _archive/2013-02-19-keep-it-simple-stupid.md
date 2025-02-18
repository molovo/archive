---
layout: post
title:  "Keep it Simple, Stupid"
date:   2013-02-19 14:09:28
excerpt: "Making formatting images and links in Markdown easy for non-technical users."
categories: archive

---

I've been working on a site recently that will have a number of authors, without any technical ability, needing to write, edit and update articles through the CMS. I've set up some CSS and jQuery rules to automatically format images and links written in standard Markdown syntax, to allow them to easily size, align and caption their images, as well as a couple of custom buttons for links to audio files and documents.

I'm conscious of accessibility, and whilst I think I've done a reasonably good job in this regard, I'd be interested to hear your thoughts on the generated markup, and whether there's an easier way to do it.

##### Links

Very simple, a title of either 'pdf' or 'audio' is added after the URL in the Markdown syntax as follows:

{% highlight html %}
[ Click to Download Audio](/example.mp3 'audio')
[ Click to Download PDF](/example.mp3 'pdf')
{% endhighlight %}

This title can then be picked up in CSS and have custom styles added to it to create the buttons. No title means just a standard text link.

##### Images

Images are a little more complicated. I'm using the alt text of the image as the content of an :after pseudo-element to create the captions (simply for ease of use for the authors). As browsers will not render an :after pseudo-element on an image, I'm using jQuery to wrap a div around each image with the same alt text. To allow for sizing and alignment, I'm using the title attribute of the image to add a class to the generated div. The jQuery code looks like this:

{% highlight javascript %}
$('section.content img').each(function(){
  $(this).wrap('<div class="image-wrapper ' + $(this).attr('title') + '" alt="' + $(this).attr('alt') + '" />');
  var src = $(this).attr('src');
  $(this).attr('src', '<?php echo base_url(); ?>/content/' + src);
});
{% endhighlight %}

The reasoning is simple. The alt text of the div can be used for the content of `.image-wrapper:after` to provide the caption, but will be ignored by screen readers, so only the alt text on the original image will be read.

The title is used for the alignment simply because it is the only other attribute that can be passed through Markdown. The majority of screen readers will ignore this too, but some won't so it's less than ideal. A title of 'left' floats left, 'right' floats right, and 'full' stretches the image across the width of the article.

The URL of the image is also generated by the jQuery, so the user need only enter the filename of the image they have uploaded and the rest is done for them.

Example Markdown:

{% highlight html %}
![This is aligned to the left](boysbrigade.jpg 'left')
{% endhighlight %}

Generated markup:

{% highlight html %}
<p>
  <div class="image-wrapper left" alt="This is aligned to the left">
    <img src="/bmc/content/boysbrigade.jpg" alt="This is aligned to the left" title="left">
  </div>
</p>
{% endhighlight %}

Is this as accessible as it can be, or should I go about it another way? All input is appreciated.

---

**UPDATE:** After a good discussion with [Jelmer Borst](http://twitter.com/japborst) and [Matthew Jackson](http://twitter.com/matthewbeta) and some testing I concluded that the best way to mark up the images would be to use a figure and figcaption, and then replace the alt text of the image with "Image" so that a screenreader will not repeat the caption twice, instead announcing "Image: Caption". I've also removed the title (as it's only needed to apply the class to the figure) to avoid any confusion.

(This method is not recommended for images alone, **always use alt text**. It is only workable in this instance because the content of the figcaption will be announced to a screenreader immediately after the image).

With the same Markdown as above, this is the generated markup:

{% highlight html %}
<p>
  <figure class="image-wrapper left">
    <img src="/bmc/content/boysbrigade.jpg" alt="Image">
    <figcaption>This is aligned to the left</figcaption>
  </figure>
</p>
{% endhighlight %}

And the jQuery to do it:

{% highlight javascript %}
$('section.content img').each(function(){
  var act = $(this);
  var src = base_url + '/content/' + act.attr('src');

  act.wrap('<figure class="image-wrapper ' + act.attr('title') + '" />')
     .after('<figcaption>' + act.attr('alt') + '</figcaption>')
     .attr('alt', 'Image')
     .removeAttr('title')
     .attr('src', src);
});
{% endhighlight %}

Any more thoughts?