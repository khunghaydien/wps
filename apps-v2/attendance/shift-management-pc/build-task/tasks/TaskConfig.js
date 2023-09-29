// デバッグモード＝JS の圧縮をする・しないの切替（本番用は圧縮する）
// Windowsでは環境変数「SET TS_BUILD=debug」をセット
exports.debug = process.env.TS_BUILD == "debug" ? true : false;

// 静的リソース出力先
exports.DEST_STATIC_RESOURCE = '../src/staticresources';