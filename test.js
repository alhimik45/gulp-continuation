/* global describe, it */

var assert = require('assert');
var File = require('vinyl');
var stream = require('stream');
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
            contents: Buffer.from(code)
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
            contents: new stream.PassThrough()
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
            contents: Buffer.from(malformedCode)
        });
        // Create a continuation plugin stream
        var myContinuation = gulpContinuation();
        myContinuation.once('error', function (err) {
            assert.equal(err.message, 'Line 1: Unexpected token ) in undefined');
            done();
        });
        myContinuation.write(fakeFile);
    });

    it('should emit same source map as plain continuation', function (done) {
        // create the fake file
        var fakeFile = new File({
            contents: Buffer.from(code),
            sourceMap: {
                file: 'test.js',
                mappings: '',
                names: [],
                sources: ['test1.js'],
                sourcesContent: [code],
                version: 3
            }
        });

        var plainCompiled = continuation.compile(code, {sourceMap: true});
        var plainSourceMap = JSON.parse(continuation.getSourceMap('test.js', ['test.js']));

        // Create a continuation plugin stream
        var myContinuation = gulpContinuation();
        myContinuation.write(fakeFile);
        myContinuation.once('data', function (file) {
            assert(file.isBuffer());
            assert.equal(file.contents.toString('utf8'), plainCompiled);
            assert.deepEqual(file.sourceMap, plainSourceMap);
            done();
        });
    });
});
