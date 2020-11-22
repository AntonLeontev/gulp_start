const {src, dest, watch, parallel, series} = require('gulp');

const scss         = require('gulp-sass');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const del          = require('del');



function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() {
    return del('dist');
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());

}

function styles() {
    return src('app/scss/style.scss')
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
        grid: true,
    }))
    .pipe(concat('style.min.css'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function images() {
    return src('app/images/**/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'))
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], {base: 'app'})
    .pipe(dest('dist'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch("app/*.html").on('change', browserSync.reload);
    watch("app/css/*.css").on('change', browserSync.reload);
    watch("app/js/main.min.js").on('change', browserSync.reload);
}


exports.default      = parallel(styles, scripts, browsersync, watching);
exports.build        = series(cleanDist, images, build);

exports.styles       = styles;
exports.watching     = watching;
exports.browsersync  = browsersync;
exports.scripts      = scripts;
exports.autoprefixer = autoprefixer;
exports.images       = images;
exports.cleanDist    = cleanDist;
