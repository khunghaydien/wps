@echo on
rem JavaScript�\�[�X�����k

@java -jar ..\..\compiler.jar --charset UTF-8 --js=EmpDayTrust.js --js_output_file=EmpDayTrust.compressed.js --warning_level=DEFAULT --compilation_level=WHITESPACE_ONLY

@echo off
if errorlevel 1 goto ERR

rem ���k�����t�@�C�����R�s�[

copy EmpDayTrust.compressed.js EmpDayTrust.compressed.escape.js

rem �����ϊ�������B�W���o�͂͌����Ȃ��Ă��ǂ��̂Ńt�@�C���ɏo�͂��Č�ŏ����B

..\..\mfind /E8 /W /Q /P:pattern.txt EmpDayTrust.compressed.escape.js > temp-out.txt
..\..\mfind /E8 /W /Q /M "/\r\n//g" EmpDayTrust.compressed.escape.js  > temp-out.txt

rem ���[�N���폜
del temp-out.txt

rem ����I��
echo OK!

exit /b 0

rem �ُ�I��
:ERR
echo ���s!
pause
exit /b 9
