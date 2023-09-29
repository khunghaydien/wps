不具合チケット:
#9457 (勤怠計算) 半休取得日の控除時間で差異が発生することがある
https://labo.teamspirit.co.jp/trac/atkinmu_ent/ticket/9457

差し込み実施日:
2020/02/10

差し込み時バージョン:
5.260.8

対象ソース:
js/src/logic/EmpTime.js

ソースリビジョン:
[17175]

追加関数:
teasp.logic.EmpTime.prototype.calculateEmpDay

対応内容:
午後半休の終了時刻＜終業時刻の場合、終業時刻を午後半休の終了時刻に修正して計算処理を行う。

適用先:
株式会社コングレ 様
00D7F000003CxFX
