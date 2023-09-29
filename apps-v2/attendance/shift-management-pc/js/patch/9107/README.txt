不具合チケット:
#9107 [打刻なしは備考必須にする] = OFFの場合に修正前の打刻時間を常に表示する

差し込み実施日:
2019/8/29

差し込み時バージョン:
5.260

対象ソース:
src/data/DataEmpDay.js

ソースリビジョン:
[15897]

上書き関数:
teasp.data.EmpDay.prototype.getStartTimeJudge
teasp.data.EmpDay.prototype.getEndTimeJudge

説明:
改善要望 https://tsi.my.salesforce.com/a2U5F000005BOWu

現在、[打刻なしは備考必須にする] = OFFの場合は、退社打刻＜修正された退社打刻のときのみ修正前の打刻を画面に表示する仕様となっている。 
どんな場合でも（退社打刻＞修正された退社打刻の場合も）修正前の打刻を表示してほしい。


適用先:
株式会社ADKホールディングス（Sandbox）
00DO0000004uIMd
