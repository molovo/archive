# Base gulp dependencies
gulp         = require 'gulp'
source       = require 'vinyl-source-stream'
buffer       = require 'vinyl-buffer'
gutil        = require 'gulp-util'
rename       = require 'gulp-rename'
livereload   = require 'gulp-livereload'
spawnSync    = require('child_process').spawnSync
changed      = require 'gulp-changed'
clone        = require 'gulp-clone'
sink         = clone.sink()
runSequence  = require 'run-sequence'

# Dependencies for compiling coffeescript
uglify       = require 'gulp-uglify'
sourcemaps   = require 'gulp-sourcemaps'
browserify   = require 'browserify'
babelify     = require 'babelify'
uglifyify    = require 'uglifyify'
watchify     = require 'watchify'
eslint       = require 'gulp-eslint'

# Dependencies for compiling sass
sassLint     = require 'gulp-sass-lint'
sass         = require 'gulp-sass'
autoprefixer = require 'gulp-autoprefixer'
critical     = require('critical').stream

# Dependencies for compressing images
imagemin     = require 'gulp-imagemin'
mozJpeg      = require 'imagemin-mozjpeg'
webp         = require 'gulp-webp'

# Dependencies for compressing HTML
htmlmin      = require 'gulp-htmlmin'

# Sources and entry points for compilation
sources =
  sass: '_assets/sass/**/*.s+(a|c)ss'
  js: '_assets/js/**/*.js'
  images: [
    '_assets/img/**/*'
    '_site/img/**/resized/**/*'
  ]
  views: [
    '_{layouts,includes,posts,studies,archive}/**/*.{html,md,markdown,svg}'
    'errors/**/*.{html,md,markdown}'
    '_data/**/*.yml'
    '_config{,.dev}.yml'
    'sw.js'
  ]
entries =
  sass: '_assets/sass/main.sass'
  js: '_assets/js/main.js'

env = gutil.env.env or 'dev'

###*
 * Linting tasks
###
gulp.task 'lint', (cb) ->
  runSequence(
    'lint:sass'
    'lint:js'
  )

gulp.task 'lint:sass', () ->
  gulp.src sources.sass
    .pipe sassLint()
    .pipe sassLint.format()
    .pipe sassLint.failOnError()

gulp.task 'lint:js', () ->
  gulp.src sources.js
    .pipe eslint()
    .pipe eslint.format()
    .pipe eslint.failOnError()

###*
 * Compilation tasks
###
gulp.task 'compile', (cb) ->
  tasks = [
    ['compile:html', 'compile:sass', 'compile:js']
    'compile:images'
  ]

  if env isnt 'dev'
    tasks.push 'compile:critical'

  runSequence(tasks..., cb)

gulp.task 'compile:sass', () ->
  gulp.src entries.sass
    .pipe sourcemaps.init()
    .pipe sass(
      outputStyle: 'compressed'
    ).on('error', sass.logError)
    .pipe autoprefixer(
      browsers: ['last 3 versions']
      cascade: false
    )
    .pipe sourcemaps.write('./')
    .pipe rename('main.css')
    .pipe gulp.dest('_site/css/')
    .pipe livereload()

gulp.task 'compile:js', () ->
  # Set up the browserify instance
  bundle = browserify(entries.js)

  if env isnt 'dev'
    bundle.transform('uglifyify', global: true)

  bundle.transform('babelify')
        .bundle()
        .on 'error', gutil.log
        .pipe source('main.js')
        .pipe buffer()
        # .pipe uglify()
        .pipe rename('main.min.js')
        .pipe gulp.dest('_site/js/')
        .pipe livereload()

gulp.task 'compile:critical', () ->
  gulp.src '_site/**/*.html'
    .pipe critical(
      base: '_site/'
      inline: true
      minify: true
    )
    .on 'error', (err) -> gutil.log gutil.colors.red(err.message)
    .pipe htmlmin(
      collapseWhitespace: true
      minifyCSS: true
      minifyJS: true
      removeEmptyAttributes: true
      removeRedundantAttributes: true
      removeScriptTypeAttributes: true
      removeStyleLinkTypeAttributes: true
    )
    .pipe gulp.dest('_site')

gulp.task 'compile:images', () ->
  gulp.src sources.images
    .pipe changed('_site/img/')
    .pipe imagemin([
      imagemin.gifsicle(
        interlaced: true
        optimizationLevel: 3
      )
      mozJpeg(
        progressive: true
        quality: 72
      )
      imagemin.optipng optimizationLevel: 5
      imagemin.svgo plugins: [removeViewBox: true]
    ])
    .pipe sink
    .pipe webp(method: 6)
    .pipe sink.tap()
    .pipe gulp.dest('_site/img/')
    .pipe livereload()

gulp.task 'compile:html', () ->
  args = {
    dev: [
      'exec'
      'jekyll'
      'build'
      '--incremental'
      '--trace'
      '--drafts'
      '--config'
      '_config.yml,_config.dev.yml'
    ]
    staging: [
      'exec'
      'jekyll'
      'build'
      '--config'
      '_config.yml,_config.staging.yml'
    ]
    production: [
      'exec'
      'jekyll'
      'build'
    ]
  }

  spawnSync 'bundle', args[env], stdio: 'inherit'

gulp.task 'watch', () ->
  livereload.listen()
  gulp.watch sources.images, ['compile:images']
  gulp.watch sources.js, ['compile:js']
  gulp.watch sources.sass, ['compile:sass']
  gulp.watch sources.views, ['compile:html']

  gulp.watch '_site/**/*.html'
    .on 'change', (file) ->
      livereload.changed(file.path)

gulp.task 'default', (cb) ->
  runSequence(
    'compile',
    'watch',
    cb
  )