/* global describe, it */

var assert = require('assert');
var File = require('vinyl');
var es = require('event-stream');
var gulpContinuation = require('./index');
var continuation = require('continuation');

var code = `function fibonacci() {
                var a = 0, current = 1;
                while (true) {
                    var b = a;
                    a = current;
                    current = a + b;
                    setTimeout(cont(), 1000);
                    console.log(current);
                }
            };`;

var malformedCode = `function fibonacci) {
                        var a = 0, current = 1;
                        while (true) {
                            var b = a;
                            a = current;
                            current = a + b;
                            setTimeout(cont(), 1000);
                            console.log(current);
                        }
                    };`;


describe('gulp-continuation', function () {
    it('should emit same code as plain continuation', function (done) {
        // create the fake file
        var fakeFile = new File({
            contents: new Buffer(code)
        });
        // Create a continuation plugin stream
        var myContinuation = gulpContinuation();
        myContinuation.write(fakeFile);
        myContinuation.once('data', function (file) {
            assert(file.isBuffer());
            assert.equal(file.contents.toString('utf8'), continuation.compile(code));
            done();
        });
    });

    it('should emit error if stream passed', function (done) {
        // create the fake file
        var fakeFile = new File({
            contents: es.readArray(code.split(' '))
        });
        // Create a continuation plugin stream
        var myContinuation = gulpContinuation();
        myContinuation.once('error', function (err) {
            assert.equal(err.message, 'Streaming not supported');
            done();
        });
        myContinuation.write(fakeFile);
    });

    it('should emit error if malformed code passed', function (done) {
        // create the fake file
        var fakeFile = new File({
            contents: new Buffer(malformedCode)
        });
        // Create a continuation plugin stream
        var myContinuation = gulpContinuation();
        myContinuation.once('error', function (err) {
            assert.equal(err.message, 'Line 1: Unexpected token ) in undefined');
            done();
        });
        myContinuation.write(fakeFile);
    });
});