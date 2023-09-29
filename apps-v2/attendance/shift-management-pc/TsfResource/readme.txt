■ スタイルシートの編集について

    Compass を使用して、sass/*.scss のファイルを css/*.css に変換を行っています。
    Web環境では *.css の方だけ使います。
    変更を加える場合、*.css ではなく *.scss を編集して、compass で変換を行います。

    ※ スタイルシートを編集する場合は、Compass を開発環境にインストールする必要があります。

◆ Compass(Sass) のバージョンについて

    [14543]あたりまでは、Compass のバージョン 0.12.2 でビルドしていましたが、
    その後から新しいバージョン(1.0.3)でビルドするようにします。

    Compass のバージョン違いによって生成される css の内容が一部異なる部分が
    生じますが、違いは下記のようなものであり、影響はありません。

      ・ボタンの角丸のためのプロパティ
          下記のプロパティがなくなった。
          -ms-border-radius IE8以前向け
          -o-border-radius 古いOpera向け

      ・色の指定が16進表記
          white → #FFFFFF
          snow → #FFFAFA

      ・カラーコントロール機能による色指定が微妙に異なる
          lighten(#e3ebf1, 5%) の値が変更前= #f4f7f9、変更後= #f4f7fa
          （使われている箇所：明細エリアの行の色）
          →肉眼ではわからない違い。

    2017.2.24 の時点で小島の開発環境（Win10）では下記バージョンが入っています。
    とりあえずこの付近のバージョンであれば良いと思います。
    バージョンが異なり、生成される css に違いが生じたら合わせることを検討します。
    ----------------------------------
    > compass -v
    Compass 1.0.3 (Polaris)
    Copyright (c) 2008-2017 Chris Eppstein
    Released under the MIT License.
    Compass is charityware.
    Please make a tax deductable donation for a worthy cause: http://umdf.org/compass
    ----------------------------------
    > sass -v
    Sass 3.4.22 (Selective Steve)
    ----------------------------------

◆ 文字コードについて

    文字コードはUTF-8で統一します。
    （[14543]あたりまでは、Windows-31J でしたが、変更します）
    config.rb に Encoding.default_external = 'utf-8' の記述を追加


◆ (参考)環境作成時のコマンド

    最初に下記コマンドで環境を作成しています。

        > compass create --sass-dir "sass" --css-dir "css" --javascripts-dir "js" --images-dir "img"

    これを行うと、.sass-cache というフォルダができます。compass watch を利用する場合は
    たぶんこのフォルダが必要になります。このフォルダはソースのリポジトリに入れてないので、
    compass watch を使う場合は、上記コマンドを実行して　.sass-cache フォルダを作って、
    ソースを配置する必要があります。


