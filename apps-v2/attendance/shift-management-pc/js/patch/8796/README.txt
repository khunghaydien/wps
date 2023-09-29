不具合チケット:
(経費申請) 基本情報のジョブに未アサインのジョブを指定し、カード明細読込した場合ジョブが空白になる
https://labo.teamspirit.co.jp/trac/atkinmu_ent/ticket/8796

差し込み実施日:
2019/3/27

差し込み時バージョン:
5.220.5

対象ソース:
js/src_tsf/dialog/ExpImport.js

ソースリビジョン:
[16315]

上書き関数:
teasp.Tsf.ExpImport.prototype.getCurrentJob

説明:
「読み込み」実行時、アサイン済みでないジョブでないとジョブ情報をセットしてなかったため、
アサイン済みでなくてもメモリに保持しているジョブ情報をセットするように修正。

