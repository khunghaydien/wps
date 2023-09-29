/*
下記のTSの静的リソースをビルド
	1. src/staticresources/AtkBaseJS.resource
	2. src/staticresources/AtkPressJS.resource
	3. src/staticresources/AtkResource.resource
	4. src/staticresources/TsfResource.resource
	5. src/staticresources/Ts1Resource.resource

下記のメッセージリソースは AtkResource.resource 生成時に生成
	resource/AtkResource/nls/ja/messages.js
	resource/AtkResource/nls/en_US/messages.js
	src/classes/Atki18n.cls
	src/translates/en_US.translation
	translation/ts_en_US.stf

使用方法
	gulp              全部ビルド
	gulp {XXXX}       {XXXX}.resource だけビルド
*/

const { parallel } = require("gulp");
const { debug } = require("./tasks/TaskConfig");
console.log("debug=" + debug);

//--------------------------------------------------------------------
// タスク
const { buildAtkBaseJS } = require("./tasks/BuildAtkBaseJS");
const { buildAtkPressJS } = require("./tasks/BuildAtkPressJS");
const { buildAtkResource } = require("./tasks/BuildAtkResource");
const { buildTsfResource } = require("./tasks/BuildTsfResource");
const { buildTs1Resource } = require("./tasks/BuildTs1Resource");
const { generateJsdoc } = require("./tasks/generateJsdoc");
const { buildTsAssistResource } = require("./tasks/BuildTsAssistResource");
const { watchJs } = require("./tasks/WatchJS");

// default
exports.default = parallel(
  buildAtkBaseJS,
  buildAtkPressJS,
  buildAtkResource,
  buildTsfResource,
  buildTs1Resource,
  buildTsAssistResource
);
exports.watch = watchJs;
exports.AtkPressJS = buildAtkPressJS;
exports.AtkBaseJS = buildAtkBaseJS;
exports.AtkResource = buildAtkResource;
exports.TsfResource = buildTsfResource;
exports.Ts1Resource = buildTs1Resource;
exports.generateJsdoc = generateJsdoc;
exports.TsAssistResource = buildTsAssistResource;
