# gulp-continuation

> A compiler for JavaScript asynchronous Continuation-Passing Style transformation

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-continuation`

## Usage

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

`gulp-continuation` emits an 'error' event if there is unparseable code in the passed file. `message` property of 'error' constains description.

