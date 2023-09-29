const { src } = require('gulp');
const {getSrcList} = require('./TaskUtil')
const jsdoc = require('gulp-jsdoc3');

function generateJsdoc(){
    const jsDocOptions = {
      "tags": {
        "allowUnknownTags": true
      },
      "opts": {
        "destination": "../docs/JavaScriptDocumentation"
      },
      "templates": {
        "theme": "cosmo",
        // "outputSourceFiles": true,
        "outputSourcePath": true,
        "linenums": true,
        "collapseSymbols": true
      }
    }
    const targetFiles = [
        '../Ts1Resource/js/**',
        '../TsfResource/js/*',
        ...getSrcList('./AtkPressJS.lst'),
        ...getSrcList('./AtkBaseJS.lst'),
        ...getSrcList('./tsfView.lst')
    ]
    return src(targetFiles, {read: false, allowEmpty: true}).pipe(jsdoc(jsDocOptions));
}

exports.generateJsdoc = generateJsdoc