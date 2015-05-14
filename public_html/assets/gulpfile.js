// Load plugins
var gulp = require( 'gulp' ),
  sass = require( 'gulp-sass' ),
  autoprefixer = require( 'gulp-autoprefixer' ),
  minifycss = require( 'gulp-minify-css' ),
  jshint = require( 'gulp-jshint' ),
  uglify = require( 'gulp-uglifyjs' ),
  imagemin = require( 'gulp-imagemin' ),
  rename = require( 'gulp-rename' ),
  clean = require( 'gulp-clean' ),
  concat = require( 'gulp-concat' ),
  cache = require( 'gulp-cache' ),
  jpegoptim = require( 'imagemin-jpegoptim' ),
  pngquant = require( 'imagemin-pngquant' ),
  optipng = require( 'imagemin-optipng' ),
  svgo = require( 'imagemin-svgo' ),
  webp = require( 'gulp-webp' ),
  sourcemaps = require( 'gulp-sourcemaps' ),
  nightwatch = require( 'gulp-nightwatch' );

// Styles
gulp.task( 'styles', [ 'clean' ], function () {
  return gulp.src( 'src/css/main.sass' )
    .pipe( sass( {
      // style: 'expanded',
      indentedSyntax: true
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
    .pipe( sourcemaps.init() )
    .pipe( uglify( 'main.min.js', {
      outSourceMap: false
    } ) )
    .pipe( sourcemaps.write( './maps' ) )
    .pipe( gulp.dest( 'dist/js' ) );
} );

// Images
gulp.task( 'optimages', [ 'main', 'cleanimages' ], function () {
  return gulp.src( 'src/img/**/*' )
    .pipe( pngquant( {
      quality: '80',
      speed: 1
    } )() )
    .pipe( optipng( {
      optimizationLevel: 3
    } )() )
    .pipe( jpegoptim( {
      progressive: true,
      max: 80
    } )() )
    .pipe( svgo()() )
    // .pipe( imagemin( {
    //   optimizationLevel: 7,
    //   progressive: true,
    //   interlaced: true,
    //   pngquant: true
    // } ) )
    .pipe( gulp.dest( 'dist/img' ) );
} );

gulp.task( 'images', [ 'optimages' ], function () {
  return gulp.src( 'dist/img/**/*' )
    .pipe( webp( {
      quality: 70,
      alphaQuality: 70,
      method: 6
    } ) )
    .pipe( gulp.dest( 'dist/img' ) );
} )

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
} );

gulp.task( 'nightwatch', function () {
  return gulp.src( '' )
    .pipe( nightwatch( {
      configFile: '../_test/nightwatch.json',
      cliArgs: [ '--env firefox', '--group ../../_test' ]
    } ) )
    .pipe( nightwatch( {
      configFile: '../_test/nightwatch.json',
      cliArgs: [ '--env chrome', '--group ../../_test' ]
    } ) )
    .pipe( nightwatch( {
      configFile: '../_test/nightwatch.json',
      cliArgs: [ '--env safari', '--group ../../_test' ]
    } ) );
} );

gulp.task( 'test', [ 'nightwatch' ] );

gulp.task( 'main', [ 'styles', 'scripts' ] );

// Default task
gulp.task( 'default', [ 'main' ] );