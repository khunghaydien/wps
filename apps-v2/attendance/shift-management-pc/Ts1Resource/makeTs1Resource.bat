@echo off
rem ���\�[�X��ZIP���k���ăv���W�F�N�g�t�H���_�� staticresources ��
rem �R�s�[���܂��B�� �v���W�F�N�g�t�H���_�����قȂ�ꍇ�͏��������Ă��������B
rem 
@echo on
if exist Ts1Resource.zip del Ts1Resource.zip
zip -r Ts1Resource.zip css image js vendor
copy Ts1Resource.zip ..\src\staticresources\Ts1Resource.resource

echo ### �������܂����B
set /p NULL="### Enter �L�[�������Ɖ�ʂ���܂��B"
