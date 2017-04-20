# Base gulp dependencies
gulp         = require 'gulp'
source       = require 'vinyl-source-stream'
buffer       = require 'vinyl-buffer'
gutil        = require 'gulp-util'
rename       = require 'gulp-rename'
browserSync  = require 'browser-sync'

# Dependencies for compiling coffeescript
uglify       = require 'gulp-uglify'
sourcemaps   = require 'gulp-sourcemaps'
browserify   = require 'browserify'
watchify     = require 'watchify'
coffeelint   = require 'gulp-coffeelint'

# Dependencies for compiling sass
sassLint     = require 'gulp-sass-lint'
sass         = require 'gulp-sass'
autoprefixer = require 'gulp-autoprefixer'

# Dependencies for compressing images
imagemin     = require 'gulp-imagemin'

# Sources and entry points for compilation
sources =
  sass: '_assets/sass/**/*.s+(a|c)ss'
  coffee: '_assets/coffee/**/*.coffee'
  images: '_assets/img/**/*'
  views: ['**/*.{html,md}', '!_site/**/*']
entries =
  sass: '_assets/sass/main.sass'
  coffee: '_assets/coffee/main.coffee'

###*
 * The default task. Lints and compiles sass and coffeescript
###
gulp.task 'default', ['lint', 'compile']

###*
 * Linting tasks
###
gulp.task 'lint', ['lint:sass', 'lint:coffee']

gulp.task 'lint:sass', () ->
  gulp.src sources.sass
    .pipe sassLint()
    .pipe sassLint.format()
    .pipe sassLint.failOnError()

gulp.task 'lint:coffee', () ->
  gulp.src sources.coffee
    .pipe coffeelint()
    .pipe coffeelint.reporter()
    .pipe coffeelint.reporter('fail')

###*
 * Compilation tasks
###
gulp.task 'compile', ['compile:html', 'compile:sass', 'compile:coffee', 'compile:images']

gulp.task 'compile:sass', () ->
  gulp.src entries.sass
    .pipe sass().on('error', sass.logError)
    .pipe autoprefixer(
      browsers: ['last 3 versions']
      cascade: false
    )
    .pipe rename('main.css')
    .pipe gulp.dest('_site/css/')

gulp.task 'compile:coffee', () ->
  # Set up the browserify instance
  bundler = browserify(
    transform: ['coffeeify']
    debug: true
  )
  bundler.add entries.coffee

  # Compile the source
  bundler.bundle()
    .on 'error', gutil.log
    .pipe source('main.js')
    .pipe buffer()
    .pipe sourcemaps.init(loadMaps: true)
    .pipe rename('main.min.js')
    .pipe sourcemaps.write('./')
    .pipe gulp.dest('_site/js/')

gulp.task 'compile:images', () ->
  gulp.src sources.images
    .pipe imagemin([
      imagemin.gifsicle interlaced: true
      imagemin.jpegtran progressive: true
      imagemin.optipng optimizationLevel: 5
      imagemin.svgo plugins: [removeViewBox: true]
    ])
    .pipe gulp.dest('_site/img/')

gulp.task 'compile:html', () ->
  args = ['build', '--incremental', '--config', '_config.yml,_config.dev.yml']

  if gutil.env.env is 'production'
    args = ['build']

  require 'child_process'
    .spawn 'jekyll', args, {stdio: 'inherit'}

gulp.task 'watch', () ->
  gulp.watch sources.images, ['compile:images']
  gulp.watch sources.coffee, ['compile:coffee']
  gulp.watch sources.sass, ['compile:sass']
  gulp.watch sources.views, ['compile:html']

gulp.task 'serve', ['compile', 'watch'], () ->
  browserSync.init(
    server:
      baseDir: './_site'
  )

  gulp.watch '_site/**/*'
    .on 'change', browserSync.reload
