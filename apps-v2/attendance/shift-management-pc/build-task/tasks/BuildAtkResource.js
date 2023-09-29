const { src, dest, series } = require("gulp");
const zip = require("gulp-zip");
const csv2json = require("gulp-csv2json");
const convertEncoding = require("gulp-convert-encoding");
const messageRes = require("../messageRes");
const { DEST_STATIC_RESOURCE } = require("./TaskConfig");

// AtkResource.resource に含めるメッセージリソースのビルド
function buildAtkResource_message() {
  return src([
    "../translation/TSLANG-対訳.csv",
    "../translation/TSLANG-併記.csv",
  ])
    .pipe(csv2json({}))
    .pipe(
      messageRes({
        ja: "../resource/AtkResource/nls/ja/messages.js", // 出力先
        en: "../resource/AtkResource/nls/en_US/messages.js", // 出力先
        i18n: "../src/classes/AtkI18n.cls", // 読み込み元＆出力先
        enUs: "../src/translations/en_US.translation", // 読み込み元＆出力先
        stf: {
          src: "../translation/ソース_ja.stf", // 読み込み元
          dst: "../translation/ts_en_US.stf", // 出力先
          template: "./messageRes/template_en_US.stf", // 読み込み元
          ignore: "./messageRes/ignores.txt", // 読み込み元
        },
      })
    );
}

// AtkResource.resource のビルド
function buildAtkResource_files() {
  return src(
    [
      "../resource/AtkResource/css/**",
      "../resource/AtkResource/graph/**",
      "../resource/AtkResource/image/**",
      "../resource/AtkResource/nls/**",
      "../resource/AtkResource/lib/**",
    ],
    { base: "../resource/AtkResource" }
  )
    .pipe(zip("AtkResource.resource"))
    .pipe(dest(DEST_STATIC_RESOURCE));
}

exports.buildAtkResource = series(
  buildAtkResource_message,
  buildAtkResource_files
); // 順番に実行(buildAtkResource_message→buildAtkResource_files)
