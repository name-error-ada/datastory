const { src, dest, series, watch, parallel, task } = require('gulp')

const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer')
// const DEPENDENCIES = require('./dependencies.js')

const files = {
  js: 'app/js/**/*.js',
  dependencyJS: 'app/js-dependencies/**/*.js',
  css: ['app/css/**/*.css', 'app/css/**/*.sass', 'app/css/**/*.scss'],
  html: 'app/**/*.html',
  data: ['app/**/*.csv', 'app/**/*.json'],
  images: ['app/**/*.png', 'app/**/*.jpg', 'app/**/*.svg']
}

const distFolder = 'docs'

function syncBrowser() {
  browserSync.init({
    server: {
      baseDir: `./${distFolder}`
    }
  });
  browserSync.watch(`./${distFolder}/**/*`).on('change', browserSync.reload)
}

function prepareJs() {
  return src(files.js)
    .pipe(plumber())
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(babel())
      .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(dest(`${distFolder}/js`))
}

function prepareDependencyJS() {
  return src(files.dependencyJS)
    .pipe(dest(`${distFolder}/js`))
}

function prepareCss() {
  return src(files.css)
    .pipe(plumber())
    .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(dest(`${distFolder}/css`))
}

function prepareHTML() {
  return src(files.html)
    .pipe(dest(distFolder))
}

function prepareData() {
  return src(files.data)
    .pipe(dest(distFolder))
}

function prepareImages() {
  return src(files.images)
    .pipe(dest(distFolder))
}

function watchFiles() {
  watch(files.dependencyJS, prepareDependencyJS)
  watch(files.js, prepareJs)
  watch(files.css, prepareCss)
  watch(files.html, prepareHTML)
  watch(files.data, prepareData)
  watch(files.images, prepareImages)
}

NODE_MODULES_DIR = 'node_modules'
let getModule = x => `${NODE_MODULES_DIR}/${x}`

// function includeJsDependencies() {
//   return src(DEPENDENCIES.js.map(getModule))
//     .pipe(dest(`${distFolder}/js`))
// }

// function includeCssDependencies() {
//   return src(DEPENDENCIES.css.map(getModule))
//     .pipe(dest(`${distFolder}/css`))
// }

function build() {
  return series(
    // parallel(includeJsDependencies, includeCssDependencies),
    parallel(
      prepareDependencyJS, prepareJs, prepareCss,
      prepareHTML, prepareData, prepareImages)
  )
}

function deploy() {
  return series(
    build()
  )
}

exports.build = build()
exports.deploy = deploy()

exports.default = series(
  build(),
  parallel(watchFiles, syncBrowser)
)
