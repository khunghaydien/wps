【適用先/組織ID/実施日/適用時バージョン/ケース番号】
・セコムトラストシステムズ株式会社様  00D0o00000195Eh  2019/07/16  5.220.5  00068930


【対応チケット】
https://labo.teamspirit.co.jp/trac/atkinmu_ent/ticket/9747


【対象ソース/リビジョン】
js/src/data/DataEmpDay.js
js/src/dialog/DlgInputTime.js
すべて[16126]（5.220ブランチ）


【上書き関数】
teasp.data.EmpDay.prototype.getTimeTable
teasp.dialog.InputTime.prototype.createInputArea


【説明】
公用外出入力欄を非表示にする（＋既存レコードの公用外出データを無視する）
・勤怠情報入力ダイアログの公用外出エリアを作成しないようにする。
・AtkEmpDay__c.TimeTable__c に公用外出のレコード（type=30）があれば無視する。


【備考】


