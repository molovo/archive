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
  return gulp.src( 'assets/src/css/main.sass' )
    .pipe( sass( {
      // style: 'expanded',
      indentedSyntax: true
    } ) )
    .pipe( cache( autoprefixer( 'last 5 version' ) ) )
    .pipe( gulp.dest( 'assets/dist/css' ) )
    .pipe( rename( {
      suffix: '.min'
    } ) )
    .pipe( minifycss() )
    .pipe( gulp.dest( 'assets/dist/css' ) );
} );

// Scripts
gulp.task( 'scripts', [ 'clean' ], function () {
  return gulp.src( 'assets/src/js/**/*.js' )
    .pipe( sourcemaps.init() )
    .pipe( uglify( 'main.min.js', {
      outSourceMap: false
    } ) )
    .pipe( sourcemaps.write( './maps' ) )
    .pipe( gulp.dest( 'assets/dist/js' ) );
} );

// Images
gulp.task( 'optimages', [ 'main', 'cleanimages' ], function () {
  return gulp.src( 'assets/src/img/**/*' )
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
    .pipe( gulp.dest( 'assets/dist/img' ) );
} );

gulp.task( 'images', [ 'optimages' ], function () {
  return gulp.src( 'assets/dist/img/**/*' )
    .pipe( webp( {
      quality: 70,
      alphaQuality: 70,
      method: 6
    } ) )
    .pipe( gulp.dest( 'assets/dist/img' ) );
} )

// Clean
gulp.task( 'clean', function () {
  return gulp.src( [ 'assets/dist/css', 'assets/dist/js' ], {
      read: false
    } )
    .pipe( clean() );
} );

gulp.task( 'cleanimages', function () {
  return gulp.src( 'assets/dist/img', {
      read: false
    } )
    .pipe( clean() );
} );

gulp.task( 'nightwatch', function () {
  return gulp.src( '' )
    .pipe( nightwatch( {
      configFile: 'nightwatch.json',
      cliArgs: [ '--env firefox' ]
    } ) )
    .pipe( nightwatch( {
      configFile: 'nightwatch.json',
      cliArgs: [ '--env chrome' ]
    } ) );
} );

gulp.task( 'test', [ 'nightwatch' ] );

gulp.task( 'main', [ 'styles', 'scripts' ] );

// Default task
gulp.task( 'default', [ 'main' ] );