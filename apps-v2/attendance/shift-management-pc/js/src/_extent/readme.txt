★ ここにはカスタムオブジェクトの「勤怠拡張」に入れるスクリプトを置く。

    スクリプトは「その他のデータ出力」画面で読み込まれ、実行される。

    「その他のデータ出力」の画面生成とイベントの処理は ViewExt.js で行っており、
    概略は下記のとおりとなる。
        ViewExt.js の処理概略
        a) teasp.view.Ext.prototype.init()
                画面初期化
        b) teasp.view.Ext.prototype.queryStep1()
                スクリプト読み込み
        c) teasp.view.Ext.prototype.initQuery()
                tsq.QueryObj オブジェクトを作成
                tsq.QueryObj.buildForm() → フォーム生成

    「勤怠拡張」に入れるスクリプトは tsq.QueryObj の機能拡張を記述したものになる。

    標準で「勤怠拡張」に格納するレコードは ViewExt.js にハードコーディングしている。
    そのハードコーディングの元となるソースをこのフォルダに保存している。
    元となるソースは次の手順でビルドする。

        1) XXXXX.js を記述する。

        2) build_XXXXX.bat を実行する。バッチでは以下の処理が行われる。

            Closure Library の圧縮ツールでソースを圧縮
                → XXXXX.compressed.js が出力される。

            圧縮されたソース内の文字を変換する。
                「\」→「\\」
                「"」→「\"」
                改行コードを除去
                → XXXXX.compressed.escape.js が出力される。

    XXXXX.compressed.escape.js の内容がハードコーディングに使用する文字列となる。
    XXXXX.compressed.js は特に使わない（XXXXX.compressed.escape.js を使って障害が起きた時の検証用）

★ 「その他のデータ出力」画面を表示した時、上述の ViewExt.js の処理 a) の中で
    以下のチェックを行い、該当した場合にスクリプトを「勤怠拡張」に格納する。

    ・「勤怠拡張」にレコードが入ってない
            tsq.initialContents() を呼ぶ。
                RtkPotalCtl.inputContent() を呼び、AtkExt__c にレコードを挿入する。

    ・「勤怠拡張」のレコードが古い
            （この処理はまだ実装されてないが、下記のことを行う予定）
            AtkExt__c のレコードの Revision__c をチェック。
            ハードコーディングされたレコードと既存レコードを Name でマッチングして、
            ハードコーディング側の Revison__c の方が新しければ既存レコードの Removed__c に True をセット、
            AtkExt__c に新しいレコードを挿入する。
            既存レコードの Customized__c が True の場合、そのレコードは更新しない。


★ Eclipse のプロジェクトに入れた時は、*.compressed.js や *.compressed.escape.js （他）を
	Eclipse から見えないようにリソース・フィルターをかけた方が良い。
	プロジェクトフォルダを右クリック→プロパティ→リソース→リソース・フィルターで行う。
