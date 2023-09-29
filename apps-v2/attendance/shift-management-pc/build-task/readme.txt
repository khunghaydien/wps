■ 静的リソース、メッセージリソースのビルドは gulp で行う。

- ビルド対象ファイル
    src/staticresources/AtkBaseJS.resource
    src/staticresources/AtkPressJS.resource
    src/staticresources/AtkResource.resource
    src/staticresources/TsfResource.resource
    src/staticresources/Ts1Resource.resource

- メッセージリソースファイル
    resource/AtkResource/nls/ja/messages.js
    resource/AtkResource/nls/en_US/messages.js
    src/classes/Atki18n.cls
    src/translates/en_US.translation
    translation/ts_en_US.stf

- 使用方法
    gulp              全部ビルド
    gulp {XXXX}       {XXXX}.resource だけビルド

    gulp または gulp AtkResource を実行した時にメッセージリソースをビルドする。

- gulp で行う処理
    ・JSソースの結合、圧縮
    ・メッセージリソースファイル生成
    ・アーカイブ化

- 今後の課題
    ・sass → css 変換（gulp を使う場合でも compass と sass をインストールする必要がある）
    ・dojo のビルド(AtkJS.resource)
    ・開発環境へのデプロイ
    ・CustomObjectTranslationファイル生成(ts_en_US.stfが不要になる)
    ・JS構文チェック(jshint)
	・ユニットテスト

----------------------------------------------------------------------
(重要) メッセージリソースについて以下の変更をします。

- ソースファイルの変更
    メッセージのマスターは、下記の2つのCSVファイルとする。
    今後、メッセージを追加・修正・削除する場合は下記のファイルに対して行う。
    また、文字コードは必ずUTF-8 with BOMとして扱うこと。
    ・translation/TSLANG-対訳.csv
    ・translation/TSLANG-併記.csv

- フォーマットの変更
    CSVのヘッダの項目名を変える（CSVからJSON変換する際の処理速度に関わるため）
    ・TSLANG-対訳.csv
        (旧) 分類,#,メッセージID,日本語メッセージ,英語メッセージ,使用場所,備考,訳者
        (新) type,no,id,ja,en,use,note,author

    ・TSLANG-併記.csv
        (旧) 分類,単/併,メッセージID,併記メッセージ,使用場所,備考,訳者
        (新) type,sp,id,message,use,note,author

----------------------------------------------------------------------
■ 配置場所

    project
        ├─build    <-- このフォルダを追加、ここにモジュールを置く。
        ├─jripkg
        ├─js
        ├─Referenced Packages
        ├─resource
        ├─src
        ├─translation
        ├─Ts1Resource
        └─TsfResource

----------------------------------------------------------------------
■ ファイル整理
  下記のファイルについては使わなくなるため、新方式で問題なく運用できることを確認後、リポジトリから削除予定。
    js/compiler.jar
    js/dummy1.js
    js/dummy2.js
    js/JS-BASE.bat
    js/JS-COMPRESS.bat
    js/JS-DOC.bat
    js/JS-QC.bat
    js/JS-TSF.bat
    js/jsdoc
    js/mfind.exe
    resource/AtkResource/js
    resource/makeAtkResource.bat
    translation/TSLANG.xlsx
    TsfResource/RES-TSF.bat
    TsfResource/zip.exe

※ ビルド対象ファイルの管理について
    ビルド対象のファイルは、必ずしもリポジトリで管理する必要はないが、当面は管理することとし、
    関連ファイルの更新を行ってビルドした時は、関連ファイルとビルド対象ファイルは一緒にコミットすること。
    （理由）
        - 動作確認に使ったファイルをそのままコミットしておいた方が、不測の事態が起きた時に追及しやすい。
        - パッケージ作成時はビルド済みのファイルがあった方が良い（おそらく）。

