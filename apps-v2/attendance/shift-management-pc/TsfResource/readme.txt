�� �X�^�C���V�[�g�̕ҏW�ɂ���

    Compass ���g�p���āAsass/*.scss �̃t�@�C���� css/*.css �ɕϊ����s���Ă��܂��B
    Web���ł� *.css �̕������g���܂��B
    �ύX��������ꍇ�A*.css �ł͂Ȃ� *.scss ��ҏW���āAcompass �ŕϊ����s���܂��B

    �� �X�^�C���V�[�g��ҏW����ꍇ�́ACompass ���J�����ɃC���X�g�[������K�v������܂��B

�� Compass(Sass) �̃o�[�W�����ɂ���

    [14543]������܂ł́ACompass �̃o�[�W���� 0.12.2 �Ńr���h���Ă��܂������A
    ���̌ォ��V�����o�[�W����(1.0.3)�Ńr���h����悤�ɂ��܂��B

    Compass �̃o�[�W�����Ⴂ�ɂ���Đ�������� css �̓��e���ꕔ�قȂ镔����
    �����܂����A�Ⴂ�͉��L�̂悤�Ȃ��̂ł���A�e���͂���܂���B

      �E�{�^���̊p�ۂ̂��߂̃v���p�e�B
          ���L�̃v���p�e�B���Ȃ��Ȃ����B
          -ms-border-radius IE8�ȑO����
          -o-border-radius �Â�Opera����

      �E�F�̎w�肪16�i�\�L
          white �� #FFFFFF
          snow �� #FFFAFA

      �E�J���[�R���g���[���@�\�ɂ��F�w�肪�����ɈقȂ�
          lighten(#e3ebf1, 5%) �̒l���ύX�O= #f4f7f9�A�ύX��= #f4f7fa
          �i�g���Ă���ӏ��F���׃G���A�̍s�̐F�j
          ������ł͂킩��Ȃ��Ⴂ�B

    2017.2.24 �̎��_�ŏ����̊J�����iWin10�j�ł͉��L�o�[�W�����������Ă��܂��B
    �Ƃ肠�������̕t�߂̃o�[�W�����ł���Ηǂ��Ǝv���܂��B
    �o�[�W�������قȂ�A��������� css �ɈႢ���������獇�킹�邱�Ƃ��������܂��B
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

�� �����R�[�h�ɂ���

    �����R�[�h��UTF-8�œ��ꂵ�܂��B
    �i[14543]������܂ł́AWindows-31J �ł������A�ύX���܂��j
    config.rb �� Encoding.default_external = 'utf-8' �̋L�q��ǉ�


�� (�Q�l)���쐬���̃R�}���h

    �ŏ��ɉ��L�R�}���h�Ŋ����쐬���Ă��܂��B

        > compass create --sass-dir "sass" --css-dir "css" --javascripts-dir "js" --images-dir "img"

    ������s���ƁA.sass-cache �Ƃ����t�H���_���ł��܂��Bcompass watch �𗘗p����ꍇ��
    ���Ԃ񂱂̃t�H���_���K�v�ɂȂ�܂��B���̃t�H���_�̓\�[�X�̃��|�W�g���ɓ���ĂȂ��̂ŁA
    compass watch ���g���ꍇ�́A��L�R�}���h�����s���ā@.sass-cache �t�H���_������āA
    �\�[�X��z�u����K�v������܂��B


