// Load plugins
var gulp = require( 'gulp' ),
  sass = require( 'gulp-ruby-sass' ),
  autoprefixer = require( 'gulp-autoprefixer' ),
  minifycss = require( 'gulp-minify-css' ),
  jshint = require( 'gulp-jshint' ),
  uglify = require( 'gulp-uglifyjs' ),
  imagemin = require( 'gulp-imagemin' ),
  rename = require( 'gulp-rename' ),
  clean = require( 'gulp-clean' ),
  concat = require( 'gulp-concat' ),
  cache = require( 'gulp-cache' );

// Styles
gulp.task( 'styles', [ 'clean' ], function () {
  return gulp.src( 'src/css/main.sass' )
    .pipe( sass( {
      style: 'expanded',
    } ) )
    .pipe( cache( autoprefixer( 'last 5 version' ) ) )
    .pipe( gulp.dest( 'dist/css' ) )
    .pipe( rename( {
      suffix: '.min'
    } ) )
    .pipe( minifycss() )
    .pipe( gulp.dest( 'dist/css' ) );
} );

// Scripts
gulp.task( 'scripts', [ 'clean' ], function () {
  return gulp.src( 'src/js/**/*.js' )
    .pipe( uglify( 'main.min.js', {
      outSourceMap: 'main.min.js.map',
      basePath: '/public/assets'
    } ) )
    .pipe( gulp.dest( 'dist/js' ) );
} );

// Images
gulp.task( 'images', [ 'main', 'cleanimages' ], function () {
  return gulp.src( 'src/img/**/*' )
    .pipe( cache( imagemin( {
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
      pngquant: true
    } ) ) )
    .pipe( gulp.dest( 'dist/img' ) );
} );

// Clean
gulp.task( 'clean', function () {
  return gulp.src( [ 'dist/css', 'dist/js' ], {
      read: false
    } )
    .pipe( clean() );
} );

gulp.task( 'cleanimages', function () {
  return gulp.src( 'dist/img', {
      read: false
    } )
    .pipe( clean() );
} )

gulp.task( 'main', [ 'styles', 'scripts' ] );

// Default task
gulp.task( 'default', [ 'main' ] );