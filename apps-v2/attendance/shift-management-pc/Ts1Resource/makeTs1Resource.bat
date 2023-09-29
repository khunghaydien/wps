@echo off
rem リソースをZIP圧縮してプロジェクトフォルダの staticresources へ
rem コピーします。※ プロジェクトフォルダ名が異なる場合は書き換えてください。
rem 
@echo on
if exist Ts1Resource.zip del Ts1Resource.zip
zip -r Ts1Resource.zip css image js vendor
copy Ts1Resource.zip ..\src\staticresources\Ts1Resource.resource

echo ### 完了しました。
set /p NULL="### Enter キーを押すと画面を閉じます。"
