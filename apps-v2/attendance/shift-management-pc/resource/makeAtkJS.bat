@echo off
rem ���\�[�X��ZIP���k���ăv���W�F�N�g�t�H���_�� staticresources ��
rem �R�s�[���܂��B�� �v���W�F�N�g�t�H���_�����قȂ�ꍇ�͏��������Ă��������B
rem 
@echo on
if exist AtkJS.zip del AtkJS.zip
cd AtkJS
..\zip -r AtkJS.zip dojo
move AtkJS.zip ..
cd ..
copy AtkJS.zip ..\src\staticresources\AtkJS.resource
