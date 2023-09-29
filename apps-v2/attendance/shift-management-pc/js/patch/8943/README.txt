不具合チケット:
#8943 (勤怠申請) 早退申請で Attempt to de-reference a null object エラー発生

差し込み実施日:
2019/6/6

差し込み時バージョン:
5.240.5

対象ソース:
js/src/data/DataEmpDay.js

ソースリビジョン:
[15897]

上書き関数:
teasp.data.EmpDay.prototype.getCoreTime

説明:
当日のコア時間を得るところでシフト設定の勤務パターンを参照するように修正

適用先:
株式会社パートナーエージェント
00D100000002Z3L
