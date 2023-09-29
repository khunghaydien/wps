【適用先/組織ID/実施日/適用時バージョン/ケース番号】
・株式会社電通デジタル  00D28000001JAHw(Sandbox:00DO00000055rs8)  2019/10/09  5.260.3  00074557


【対応チケット】
https://labo.teamspirit.co.jp/trac/atkinmu_ent/ticket/9748


【対象ソース/リビジョン】
js/src/dialog/DlgEmpApplyZangyo.js
js/src/dialog/DlgEmpApplyEarlyStart.js  [16754]


【上書き関数】
teasp.dialog.EmpApply.prototype.createZangyoForm
teasp.dialog.EmpApply.prototype.createEarlyStartForm


【説明】
・残業申請の時間のデフォルト値を 22:00-29:00 に固定する。
・残業申請/早朝勤務申請の「申請の時間帯以外の勤務は認めない」=オフ時の下記の制限を外す。
　　- 残業申請の開始時刻が終業時刻と一致すること。
　　- 早朝勤務申請の終了時刻が始業時刻と一致すること。


【備考】


