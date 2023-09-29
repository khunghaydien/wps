const { series, src, dest } = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');
const gulpif = require('gulp-if');
const {debug, DEST_STATIC_RESOURCE} = require('./TaskConfig');
const {getSrcList} = require('./TaskUtil')

// TsfResource.resource に含めるJS(tsfView.js)のビルド
function buildTsfResource_js(){
	return src(getSrcList('./tsfView.lst'), {allowEmpty: true})
	.pipe(concat('tsfView.js'))
	.pipe(gulpif(!debug, uglify({output:{ max_line_len: 420 }})))
	.pipe(dest('../TsfResource/js'))
}

const tsfResourceFiles = [
	'../TsfResource/css/*',
	'../TsfResource/img/*',
	'../TsfResource/js/*',
	'../TsfResource/tsext/**',
	'../TsfResource/lib/*',
	'../TsfResource/template/*'
]

function buildTsfResource(){
	return src(tsfResourceFiles,
		{ base:'../TsfResource' }
	)
	.pipe(zip('TsfResource.resource'))
	.pipe(dest(DEST_STATIC_RESOURCE));
}

exports.buildTsfResource = series(buildTsfResource_js, buildTsfResource) // 順番に実行(buildTsfResource_js→buildTsfResource)
