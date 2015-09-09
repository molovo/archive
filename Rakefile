require 'html/proofer'

task :default do
  sh "bundle exec jekyll build"
  HTML::Proofer.new("./public_html").run
end