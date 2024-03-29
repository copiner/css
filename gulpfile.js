
const { src, dest, task, series, parallel, watch, lastRun } = require('gulp');
const connect = require('gulp-connect');

const del = require('del');


task('source', function (cb) {
    src('src/**/*')
    .pipe(dest('dist/'))
    .pipe(connect.reload());
    cb();
});

task('watch', function(cb){//监控

  let watcher = watch(
    ['src/**/*'],
    {events:['change','add','unlink']},
    parallel('source')
  );

  watcher.on('change', function(path, stats) {
    console.log(`
      ------------------------
      File ${path} was changed
      ------------------------
      `);
  });

  watcher.on('add', function(path, stats) {
    console.log(`
      ----------------------
      File ${path} was added
      ----------------------
      `);
  });

  watcher.on('unlink', function(path, stats) {
    console.log(`
      ------------------------
      File ${path} was removed
      ------------------------
      `);
  });

  //watcher.close();
  cb();
});


task('clean', () => {
  return del('./dist').then(() => {
    console.log(`
        -----------------------------
          clean tasks are successful
        -----------------------------`);
  }).catch((e) =>{
    console.log(e);
  })
});

//开发环境
task('server',series('clean','watch','source',function(){
    connect.server({
        root: 'dist',
        host:'127.0.0.1',
        port: 3000,
        livereload: true
    });
    console.log(`
        -----------------------------
          server tasks are successful
        -----------------------------`);
}));
