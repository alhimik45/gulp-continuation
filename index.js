var continuation = require('continuation');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-continuation';

function gulpContinuation(options) {

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            // return empty file
            return cb(null, file);
        }
        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }
        if (file.isBuffer()) {
            var code = file.contents.toString('utf8');
            var compiled = code;
            try {
                compiled = continuation.compile(code, options);
            } catch (e) {
                this.emit('error', new PluginError(PLUGIN_NAME, e.message));
                return cb();
            }
            file.contents = new Buffer(compiled);
        }
        cb(null, file);
    });
}

module.exports = gulpContinuation;

