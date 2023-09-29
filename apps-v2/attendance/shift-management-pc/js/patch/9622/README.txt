不具合チケット:
#9622 (勤怠申請) 休日出勤日を平日扱いするオプションに関する仕様変更
https://labo.teamspirit.co.jp/trac/atkinmu_ent/ticket/9622

#9587 (勤怠申請) 休日出勤申請の代休取得予定がONかOFFかで勤怠計算が変わる
https://labo.teamspirit.co.jp/trac/atkinmu_ent/ticket/9587

差し込み実施日:
2020/06/09

差し込み時バージョン:
5.300.3

対象ソース:
js/src/dialog/EmpApply.js

ソースリビジョン:
[17215]

上書き関数:
teasp.dialog.EmpApply.prototype.createTimeParts
teasp.dialog.EmpApply.prototype.drawLast

説明:
代休管理設定の「休日出勤の勤怠規則は平日に準拠する」がオンかつ労働時間制がフレックスの場合に限り、
休日出勤申請画面の開始・終了時刻にフレックス時間帯の開始・終了時刻をセットする。


適用先:
株式会社グッドパッチ
00D28000000U6rO
