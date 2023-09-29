const { src, dest } = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const {debug, DEST_STATIC_RESOURCE} = require('./TaskConfig');
const {getSrcList} = require('./TaskUtil')

// AtkPressJS.resource のビルド
function buildAtkPressJS(){
	return src(getSrcList('./AtkPressJS.lst'))
	.pipe(concat('AtkPressJS.resource'))
	.pipe(gulpif(!debug, uglify({output:{ max_line_len: 420 }})))
	.pipe(dest(DEST_STATIC_RESOURCE));
}

exports.buildAtkPressJS = buildAtkPressJS