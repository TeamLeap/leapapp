/*
Copyright 2013-2014 ASIAL CORPORATION
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
   http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var CORDOVA_APP = false;

////////////////////////////////////////

var gulp = require('gulp');
var path = require('path');
var $ = require('gulp-load-plugins')();
var gulpIf = require('gulp-if');
var pkg = require('./package.json');
var merge = require('event-stream').merge;
var runSequence = require('run-sequence');
var dateformat = require('dateformat');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var os = require('os');
//var fs = require('fs');
var argv = require('yargs').argv;
var npm  = require('rollup-plugin-npm');
var babel = require('rollup-plugin-babel');

////////////////////////////////////////
// browser-sync
////////////////////////////////////////
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: __dirname,
      index: 'index.html',
      directory: true
    },
    files: [],
    watchOptions: {
      //debounceDelay: 400
    },
    ghostMode: false,
    notify: false
  });
});
