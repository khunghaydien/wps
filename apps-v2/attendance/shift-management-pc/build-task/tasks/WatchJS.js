const child_process = require("child_process");

const { watch, parallel, series } = require("gulp");

const { buildAtkBaseJS } = require("./BuildAtkBaseJS");
const { buildAtkPressJS } = require("./BuildAtkPressJS");
const { buildAtkResource } = require("./BuildAtkResource");
const { buildTsfResource } = require("./BuildTsfResource");
const { buildTs1Resource } = require("./BuildTs1Resource");

// JavaScirptファイルを監視し、更新が発生したら圧縮→デプロイ
function watchJs(done) {
  // AtkPressJS
  const atkPressJSWatcher = watch("../js/src/**/*.js");
  atkPressJSWatcher.on("change", () => {
    console.log("[AtkPressJS] File change detected. Deploying...");
    series(buildAtkPressJS, deployJs('AtkPressJS'))();
  });

  // AtkBaseJS
  const atkBaseJSWatcher = watch("../js/src_base/**/*.js");
  atkBaseJSWatcher.on("change", () => {
    console.log("[AtkBaseJS] File change detected. Deploying...");
    series(parallel(buildAtkBaseJS, buildAtkPressJS), deployJs('AtkBaseJS'))();
  });

  // Ts1Resource
  const ts1ResourceWatcher = watch("../Ts1Resource/**/*");
  ts1ResourceWatcher.on("change", () => {
    console.log("[Ts1Resource] File change detected. Deploying...");
    series(buildTs1Resource, deployJs('Ts1Resource'))();
  });

  // TsfResource
  const tsfResourceWatcher = watch([
    "../js/src_tsf/**/*.js",
    "../TsfResource/css/*",
    "../TsfResource/img/*",
  ]);
  tsfResourceWatcher.on("change", () => {
    console.log("[TsfResource] File change detected. Deploying...");
    series(buildTsfResource, deployJs('TsfResource'))();
  });

  // AtkResource
  const atkResourceWatcher = watch([
    "../translation/*.csv",
    "../resource/AtkResource/**/*",
    "!../resource/AtkResource/nls/ja/messages.js",
    "!../resource/AtkResource/nls/en_US/messages.js",
  ]);
  atkResourceWatcher.on("change", () => {
    console.log("[AtkResource] File change detected. Deploying...");
    series(buildAtkResource, deployJs('AtkResource'))();
  });

  done();
}

// 静的リソースをデプロイ
function deployJs(target) {
  return function(){
    child_process.exec(`ant deploy${target}`, { cwd: "../" }, (error, stdout) => {
      if (stdout) {
        console.log(stdout);
      }
      if (error) {
        console.log(error);
      }
    });
  };
}

exports.watchJs = watchJs;
