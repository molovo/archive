---
layout: post
title: "Things about CSS that make me want to put my face in a blender"
excerpt: "'Nuff said."
categories: blog
tags: css dev development "front-end dev" "front-end development" hacks
---

#### Padding

When you enter a margin value such as:

{% highlight css %}
margin: 12% 24%;
{% endhighlight %}

the vertical value is taken as a percentage of the height of the parent and the horizontal value is taken as a percentage of the  width of the parent. This makes sense.

If I enter the same values as padding:

{% highlight css %}
padding: 12% 24%;
{% endhighlight %}

the vertical value is taken from the width of the element (horizontal), and the horizontal value is taken from the height of the element (vertical). **This is stupid**.

The only time this has *ever* been of any use to me whatsoever in four years of writing CSS has been when forcing the aspect ratio of an element like so:

{% highlight css %}
height: 0;
padding: 0 0 50%;  /* Forces a 2:1 aspect ratio. */
{% endhighlight %}

You know what would be far more useful? Make the horizontal and vertical the right way around, and give us an aspect ratio property. Not only would this make aspect ratios an *actualproperthing&trade;* rather than a hack, it also allow us to **finally** vertically center things properly.

{% highlight css %}
/* 25% of the element's height will be
    whitespace above and below its children,
    making them vertically centered (Hurrah!) */
padding: 25% 0;

/* The elements width will be double that
    of its height, which is determined by
    the flow of content. */
height: auto;
width: auto;
aspect-ratio: 1 2;
{% endhighlight %}

---

#### Exes and Whys?

{% highlight css %}
margin: Y X;
padding: Y X;
border: Y X;
outline: Y X;
background-position: X Y;
transform: translate(X, Y);
transform: scale(X, Y);
{% endhighlight %}

Why, dear God, Why???

---

#### Fixed positioned elements

I set some elements at a certain size.

{% highlight css %}
.parent {
  width: 50%;
}
    .parent .child {
      width: 30%;
    }
{% endhighlight %}

`.child` is 30% of the width of it's parent. Nice and easy. Then I add `position: fixed;` to the child.

{% highlight css %}
.parent {
  width: 50%;
}
    .parent .child {
      width: 30%;
      position: fixed;
    }
{% endhighlight %}

Boom! `.child` has now doubled in width. That makes sense doesn't it? **No.**

---

#### Borders

I only ever use solid borders, because anything else is harder to see than a true word in the Daily Mail.

I want to write

{% highlight css %}
border: blue;
{% endhighlight %}

and have it give me a 1px wide, solid blue border.

{% highlight css %}
border: 5px blue;
{% endhighlight %}

gives me a 5px, solid blue border. Easy peasy.

---

#### Posititioning

{% highlight css %}
background-position: top center;
{% endhighlight %}

is a nice easy way to position a background. At the moment, to absolutely position an element in this way, I have to do this:

{% highlight css %}
width: 300px;
position: absolute;
top: 0;
left: 50%;
margin-left: -150px;
{% endhighlight %}

If the width is dynamic, the above is impossible without a javascript hack. This would be better:

{% highlight css %}
position: top center;  /* Boom! */
{% endhighlight %}

---

I've been Ranty Donaldson and this is the 9 o'clock news. Have a spiffing day.