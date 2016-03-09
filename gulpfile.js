var gulp = require('gulp'),
    browserSync=require('browser-sync'),
    concat=require('gulp-concat'),
    coffee=require('gulp-coffee'),
    del=require('del'),
    gutil=require('gulp-util'),
    jshint=require('gulp-jshint'),
    minify=require('gulp-minify'),
    minifyCss=require('gulp-minify-css'),
    rename=require('gulp-rename'),
    runsequence=require('run-sequence'),
    sourcemaps=require("gulp-sourcemaps"),
    uglify = require('gulp-uglify'),
    rev=require('gulp-rev'),
    revAppend=require('gulp-rev-append'),
    sass=require('gulp-sass'),
    webpack=require('webpack');

var webpackConfig=require('./webpack.config.js');

//清理文件
gulp.task('clean',function(cb){
	del(['build/css','build/scripts'],cb);
});

//构建
gulp.task('build',['minify','minifycss','sass'],function(){
   console.log("Good Job!");
});

//默认启动任务
gulp.task("default",['browserSync'],function(){
	// gulp.start('minify','minifycss')
   console.log("Enjoy!");
});

//文件添加版本号，在HTML中写入**.js?rev=@hash
gulp.task('rev',function(){
  gulp.src('./src/htmls/pc/*.html')
  .pipe(revAppend())
  .pipe(gulp.dest('./dist/htmls/pc/'));
})

gulp.task("greet",function(){
  console.log('Hello World!');
});

gulp.task('jshint',function(){
  gulp.src('./scripts/*.js').pipe(jshint());
});

//压缩、链接资源类
gulp.task('unlify', function () {
   gulp.src('./src/scripts/*.js')
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({suffix:'.min'}))
      .pipe(sourcemaps.write('../maps'))
      .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('minify',function(){
    gulp.src('./src/scripts/*.js')
        .pipe(minify({
                exclude:['tasks'],
                ignoreFiles:['.combo.js','-min.js']
        }))
        .pipe(gulp.dest('./dist/scripts'));
})

gulp.task("minifycss",function(){
  gulp.src("./css/*.css").pipe(minifyCss()).pipe(rename({suffix:'.min'})).pipe(gulp.dest('./dist/css/'))
});

gulp.task('concat',function(){
   gulp.src('./scripts/*.js')
   .pipe(uglify())
   .pipe(concat('site.js'))
   .pipe(gulp.dest('./dist/scripts'));
});

/*预处理系列*/
gulp.task('coffee',function(){
   gulp.src('coffee/*.coffee')
   .pipe(sourcemaps.init())
   .pipe(coffee({bare:true}).on('error',gutil.log))
   .pipe(sourcemaps.write('../maps'))
   .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('sass',function(){
    return gulp.src('./scss/*.scss')
    .pipe(sass({outputStyle:'compressed'}).on('error',sass.logError))
    .pipe(gulp.dest('./dist/css'));

  //以下为传给browseSync用
  // return gulp.src("app/scss/*.scss")
  //       .pipe(sass())
  //       .pipe(gulp.dest("app/css"))
  //       .pipe(browserSync.stream());
});

//监视文件变化，执行相关任务
gulp.task('watch',function(){
   gulp.watch("**.coffee",['coffee']);
   gulp.watch('./scripts/**/*.js', ['rev']);
   gulp.watch('./css/**/*.css','rev');
   gulp.watch('/scss/*.scss','sass');
});

gulp.task('webpack',function(callback){
  var config=Object.create(webpackConfig);
  webpack(
    config,function(err,stats){
      callback();
    })
})

//根据文件类型变动，自动刷新浏览器
gulp.task("browserSync",['sass'],function(){
   browserSync({
      files:["**/*.html","**/*.css","**/*.js",'!**.less','!**.coffee','!**.SCSS','!node_modules/**.*'],
      server:{
         baseDir:"./"
      },
      port:2016
   });
   gulp.watch('./scss/**/*.scss',['sass']);
   //gulp.watch('./src/scripts/**/*.js', ['rev']);
   //gulp.watch('./src/css/**/*.css','rev')
});