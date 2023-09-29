不具合チケット:
(勤怠申請) 早退がカウントされてないのに「早退申請してください」エラー発生
https://labo.teamspirit.co.jp/trac/atkinmu_ent/ticket/8878

差し込み実施日:
2019/4/24

差し込み時バージョン:
5.240.3

対象ソース:
js/src/data/DataEmpDay.js

ソースリビジョン:
[16354]

上書き関数:
teasp.data.EmpDay.prototype.isMissingLateStartApply
teasp.data.EmpDay.prototype.isMissingEarlyEndApply

説明:
遅刻時間、早退時間がカウントされてないなら、遅刻・早退申請必須チェックに引っかからないようにする。


適用先:
①ハイメディック様組織用
②進興メディカルサポート様組織用
③アドバンスト・メディカル・ケア様組織用
