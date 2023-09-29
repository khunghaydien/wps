const { src, dest } = require('gulp');
const {debug, DEST_STATIC_RESOURCE} = require('./TaskConfig');
const {getSrcList} = require('./TaskUtil')
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');

// AtkBaseJS.resource のビルド
function buildAtkBaseJS(){
	return src(getSrcList('./AtkBaseJS.lst'), {allowEmpty: true})
	.pipe(concat('AtkBaseJS.resource'))
	.pipe(gulpif(!debug, uglify({output:{ max_line_len: 420 }})))
	.pipe(dest(DEST_STATIC_RESOURCE));
}

exports.buildAtkBaseJS = buildAtkBaseJS