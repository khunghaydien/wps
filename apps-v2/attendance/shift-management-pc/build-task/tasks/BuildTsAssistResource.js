const { series, src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');
const gulpif = require('gulp-if');
const replace = require('gulp-replace');
const fs  = require('fs');
const {debug, DEST_STATIC_RESOURCE} = require('./TaskConfig');
const currentTime = '' + (new Date()).getTime();

// TsAssist.resource に含めるJSのビルド
function buildTsAssistResource_js(){
    return src(['../TsAssist/src/**'])
    .pipe(replace(/XVERSIONX/g, currentTime))
    .pipe(gulpif(!debug, gulpif('*.js', uglify({output:{ max_line_len: 420 }}))))
	.pipe(dest('../TsAssist/js'))
}

// Ts1Assist.resource のビルド
function buildTsAssistResource(){
	return src([
            '../TsAssist/css/*',
            '../TsAssist/img/*',
            '../TsAssist/js/**',
            '../TsAssist/lib/*'
        ],{ base:'../TsAssist' }
    )
	.pipe(zip('TsAssist.resource'))
	.pipe(dest(DEST_STATIC_RESOURCE));
}

function cleanJs(done) {
    fs.rmSync('../TsAssist/js', {recursive:true, force:true})
    done();
};

exports.buildTsAssistResource = series(buildTsAssistResource_js, buildTsAssistResource, cleanJs) // 順番に実行(buildTsAssistResource_js→buildTsAssistResource→cleanJs)