require 'html/proofer'

task :default do
  # sh "bundle exec percy snapshot _site/"
  HTML::Proofer.new("./_site").run
  sh "http-server ./_site --silent -p 9543 &"
  sh "gulp test"
  sh "killall node"
end