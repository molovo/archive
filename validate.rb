#!/usr/bin/env ruby

require 'html-proofer'

opts = {
  :alt_ignore => [
    /^https:\/\/webmention.io\/avatar\/pbs.twimg.com\//
  ],
  :check_external_hash => false,
  :check_favicon => true,
  :check_opengraph => true,
  :check_html => true,
  :check_img_http => true,
  :parallel => {
    :in_processes => 4
  },
  :url_ignore => [
    /^https:\/\/twitter.com\/molovo\/status\//
  ]
}

HTMLProofer.check_directory('./_site', opts).run