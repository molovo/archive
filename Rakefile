require 'html/proofer'

task :default do
  sh "bundle exec jekyll build"
  # sh "bundle exec percy snapshot _site/"
  HTML::Proofer.new("./_site").run
  sh "gulp test"
end