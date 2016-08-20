# gulp-continuation

> A compiler for JavaScript asynchronous Continuation-Passing Style transformation

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-continuation`

## Usage

For using with browserify there is [continuatify](https://github.com/alhimik45/continuatify) transformer.

```javascript
var gulp = require('gulp');
var continuation = require('gulp-continuation');

gulp.task('js', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(continuation())
        .pipe(gulp.dest('build'))
});
```


## Options

You can pass all options available for [continuation.js](https://github.com/BYVoid/continuation/)

## Errors

`gulp-continuation` emits an 'error' event if there is unparseable code in the passed file. `message` property of 'error' contains description.

