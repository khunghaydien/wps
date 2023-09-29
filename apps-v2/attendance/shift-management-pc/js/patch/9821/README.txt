仕様検討チケット:
#9821 (特別対応) 1日の休憩時間の回数上限を15回にする (資生堂様)
https://labo.teamspirit.co.jp/trac/atkinmu_ent/ticket/9821

差し込み実施日:
2020/09/07

差し込み時バージョン:
5.300.5

対象ソース:
js/src/dialog/DlgInputTime.js
js/src/dialog/DlgEmpApplyReviseTime.js

ソースリビジョン:
[17579]

上書き関数:
teasp.dialog.InputTime.prototype.ready
teasp.dialog.EmpApply.prototype.createReviseTimeForm

適用先:
株式会社資生堂
本番環境：00D2w000004tm88
Partial環境：00D1s0000008l5z
Test01環境：00D1s0000008kv6
Dev01環境： 00D9D0000008e0r
Dev02環境：00D1s0000008pul
Dev09環境：00D9D0000008ft4

備考：
9821patch_ver2.js は Winter22(5.400)以降向け
