const { src, dest } = require('gulp');
const zip = require('gulp-zip');
const {DEST_STATIC_RESOURCE} = require('./TaskConfig');

const ts1ResourceFiles = [
	'../Ts1Resource/css/**',
	'../Ts1Resource/image/**',
	'../Ts1Resource/js/**',
	'../Ts1Resource/vendor/**'
]

// Ts1Resource.resource のビルド
function buildTs1Resource(){
	return src(ts1ResourceFiles,
		{ base:'../Ts1Resource' }
	)
	.pipe(zip('Ts1Resource.resource'))
	.pipe(dest(DEST_STATIC_RESOURCE));
}

exports.buildTs1Resource = buildTs1Resource