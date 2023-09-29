staticresources/AtkJS.resource = カスタムビルドしたDojoライブラリ 手順

1. https://download.dojotoolkit.org/
    で STABLE の最新をダウンロード

2. dojo-release-1.xx.x-src.zip を展開、展開先の buildscripts に
    本フォルダ内にある build_ts.bat と ts.profile.js をコピーする。

2.5 dojox フォルダ下の layoutフォルダ以外のファイル・フォルダをすべて削除
    同 layoutフォルダ下の tests フォルダも削除

3. build_ts.bat を実行する（Java の環境が必要）
    → release フォルダができる。

4. release/dojo/* を AtkJS の下の dojo フォルダにコピーする。
   (release/dojo/build-report.txt は不要)

   コピー先のdojo フォルダ下で下記を実行して、非圧縮ファイルを削除
     del /s *.uncompressed.js

5. makeAtkJS.bat を実行すると、リソースファイルが zip 圧縮されて
    staticresources/AtkJS.resource にコピーされる。
    これをデプロイする。

6. src/classes/AtkConstant.cls の定数 DOJO_VER の値を変更する。

