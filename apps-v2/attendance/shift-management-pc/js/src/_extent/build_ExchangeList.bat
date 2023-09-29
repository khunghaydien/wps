@echo on
rem JavaScriptソースを圧縮

@java -jar ..\..\compiler.jar --charset UTF-8 --js=ExchangeList.js --js_output_file=ExchangeList.compressed.js --warning_level=DEFAULT --compilation_level=WHITESPACE_ONLY

@echo off
if errorlevel 1 goto ERR

rem 圧縮したファイルをコピー

copy ExchangeList.compressed.js ExchangeList.compressed.escape.js

rem 文字変換をする。標準出力は見えなくても良いのでファイルに出力して後で消す。

..\..\mfind /E8 /W /Q /P:pattern.txt ExchangeList.compressed.escape.js > temp-out.txt
..\..\mfind /E8 /W /Q /M "/\r\n//g" ExchangeList.compressed.escape.js  > temp-out.txt

rem ワークを削除
del temp-out.txt

rem 正常終了
echo OK!

exit /b 0

rem 異常終了
:ERR
echo 失敗!
pause
exit /b 9
