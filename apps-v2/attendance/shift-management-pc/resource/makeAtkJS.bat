@echo off
rem リソースをZIP圧縮してプロジェクトフォルダの staticresources へ
rem コピーします。※ プロジェクトフォルダ名が異なる場合は書き換えてください。
rem 
@echo on
if exist AtkJS.zip del AtkJS.zip
cd AtkJS
..\zip -r AtkJS.zip dojo
move AtkJS.zip ..
cd ..
copy AtkJS.zip ..\src\staticresources\AtkJS.resource
