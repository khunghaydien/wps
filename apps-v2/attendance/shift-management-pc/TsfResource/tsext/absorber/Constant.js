define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return new (declare("tsext.absorber.Constant", null, {
		constructor : function(){
			this.EMP          = '社員';
			this.EMP_CODE     = '社員番号';
			this.EMP_NAME     = '社員名';
			this.YEAR_MONTH   = '月度';
			this.HOLIDAY_NAME = '休暇種類';
			this.SPEND_DAYS   = '取得日数';
			this.SPEND_TIME   = '取得時間';
			this.NOTE         = '備考';
			this.ERROR_NOTE   = 'エラー内容';
			this.B_DAYS       = '(日数)';
			this.B_HOURS      = '(時間)';
			this.DUPLICATE_ROW    = 'データ重複';
			this.ERROR_FILE_NAME  = 'エラー詳細.csv';
			this.YUQ_KEY          = '年次有給休暇';
			this.NOT_ALLOWED_TIME = '日数管理休暇は時間単位不可';
			this.NOT_EXIST_MONTH  = '存在しない月度';
			this.MINUS_SUBJECT    = '出向者休暇情報取込';
			this.APPLY_COMMENT    = '出向者休暇情報取込';
			this.MSG_FILE_NAME    = 'ファイル名: ${0}';
			this.MSG_ROW_COUNT    = '${0} 件のデータがあります';
			this.MSG_ERROR_COUNT  = '${1} 件中 ${0} 件のエラーがあります';
			this.MSG_NOT_CSV      = '拡張子がCSVのファイルを指定してください';
			this.MSG_NO_ERROR     = 'エラーはありません';
			this.MSG_NO_MONTH     = '-';
			this.MSG_EMP_COUNT    = '[処理対象社員数] ${0}';
			this.MSG_FIRST_CHECK  = '[書式チェック]';
			this.MSG_PROC_CHECK   = '== 事前チェック ==';
			this.MSG_PROC_IMPORT  = '== 取り込み開始 ==';
			this.MSG_PROC_LOOP    = '(${0}/${1})##################################################';
			this.MSG_PROC_DIV     = '------------------------------------------------------------';
			this.MSG_PROC_EMP           = '[社員] ${0}(${1})';
			this.MSG_PROC_MONTH         = '[月度] ${0}(${1})';
			this.MSG_PROC_RANGE         = '[期間] ${0}～${1}';
			this.MSG_PROC_MONTH_STATUS  = '[ステータス] ${0}';
			this.MSG_PROC_IMPORT_TARGET = '[取り込み対象]';
			this.MSG_PROC_REMAIN_DETAIL = '[残日数明細]';
			this.MSG_PROC_HOLIDAY       = '[休暇] ${0}';
			this.MSG_PROC_SPEND_DAYS    = '[期間内の消化日数] ${0}';
			this.MSG_PROC_REMAIN_DAYS   = '[残日数]           ${0}';
			this.MSG_PROC_REQUEST_DAYS  = '[取り込み消化日数] ${0}';
			this.MSG_PROC_MINUS         = '[マイナス付与]     ${0}(${1})';
			this.MSG_PROC_REQUST_TABLE  = '${0} ${1} ${2} ${3}';
			this.MSG_PROC_YUQ_REMAIN    = '${0} ${1} ${2} ${3} ${4} ${5} ${6} ${7}';
			this.MSG_PROC_STOCK_REMAIN  = '${0} ${1} ${2} ${3} ${4} ${5}';
			this.MSG_PROC_ERROR         = '[エラー] ';
			this.MSG_PROC_EXCEED        = '期間内の消化日数（${0}）が取り込み消化日数（${1}）を超えています';
			this.MSG_PROC_FULFILL       = '期間内の消化日数は取り込み消化日数と一致します';
			this.MSG_PROC_ERROR_ROW     = '${0} ${1}';
			this.MSG_PROC_CREATE_MONTH    = '[DML] 勤怠月次作成 - ${0}（${1}）';
			this.MSG_PROC_CREATE_MONTH_NG = '[DML] 勤怠月次作成失敗（${0}）';
			this.MSG_PROC_MINUS_DO        = '[DML] マイナス付与実行';
			this.MSG_PROC_MINUS_NG        = '[DML] マイナス付与失敗（${0}）';
			this.MSG_PROC_DML_SUCCESS     = '[DML] OK';
			this.MSG_PROC_UPDATE_MONTH    = '[DML] 勤怠月次更新';
			this.MSG_PROC_UPDATE_MONTH_NG = '[DML] 勤怠月次更新失敗（${0}）';
			this.MSG_PROC_UPDATE_MONTH_SKIP = '更新する値がないため、勤怠月次更新スキップ';
			this.MSG_PROC_MONTH_VALUE     = '[DML] ${0} = ${1}';
			this.MSG_PROC_FIX_MONTH       = '[DML] 勤怠月次確定  ${0}';
			this.MSG_PROC_FIX_MONTH_NG    = '[DML] 勤怠月次確定失敗（${0}）';
			this.MSG_PROC_FETCH_MONTH     = '勤怠月次取得';
			this.MSG_PROC_FETCH_MONTH_NG  = '勤怠月次取得失敗（${0}）';
			this.MSG_PROC_SUCCESS         = 'OK';
			this.MSG_PROC_END = 'END';
			this.MSG_EMP_MONTH_TARGET_FIELD = '[休暇キー名と勤怠月次項目のマッピング]';
			this.MSG_EMP_MONTH_MAPPING   = '${0} => ${1}${2}';
			this.MSG_EMP_MONTH_NO_DEFINE = '${0} => ${1}${2} 該当項目なし';
			this.MSG_FIELD_VALUES_TITLE  = '[勤怠月次 休暇項目]';
			this.MSG_FIELD_VALUES        = '${0} ${1} ${2}';
		},
		getErrorTableHead: function(){
			return 'Line  エラー';
		},
		getErrorTableBorder: function(){
			return '----- ------------------------------';
		},
		getRequestTableHead: function(){ // 取り込み対象表のヘッダ
			return 'Line  休暇                           取得日数 取得時間';
		},
		getRequestTableBorder: function(){ // 取り込み対象表の罫線
			return '----- ------------------------------ -------- --------';
		},
		getYuqRemainTableHead: function(){ // 有休残日数詳細表のヘッダ
			return '#  勤怠有休ID         有効開始日 失効日     基準時間 残日数     名称                                     事柄';
		},
		getYuqRemainTableBorder: function(){ // 有休残日数詳細表の罫線
			return '-- ------------------ ---------- ---------- -------- ---------- ---------------------------------------- ------------------------------';
		},
		getStockRemainTableHead: function(){ // 積休残日数詳細表のヘッダ
			return '#  勤怠積休ID         有効開始日 失効日     残日数     名称';
		},
		getStockRemainTableBorder: function(){ // 積休残日数詳細表の罫線
			return '-- ------------------ ---------- ---------- ---------- ------------------------------';
		},
		getFieldValueTableHead: function(){ // 勤怠月次休暇値表のヘッダ
			return 'API参照名                                    旧値   新値';
		},
		getFieldValueTableBorder: function(){ // 勤怠月次休暇値表の罫線
			return '-------------------------------------------- ------ ------';
		},
		getDispYearMonth: function(ym, sn){
			return (sn ? str.substitute('${0}(${1})', [ym, sn+1]) : ym);
		},
		Empty: function(v){
			return v + '未入力';
		},
		Invalid: function(v){
			return v + '不正';
		},
		NotAvailable: function(v){
			return v + '使用不可';
		},
		NotIdentify: function(v){
			return v + '該当なし';
		},
		Irregularity: function(v){
			return v + '不揃い';
		},
		LackOfRemaining: function(obj){
			var v = [];
			if(obj && obj.days){
				v.push('' + obj.days);
			}
			if(obj && obj.hours){
				v.push(Util.formatTime(obj.hours * 60));
			}
			return '残日数不足' + (v.length ? str.substitute('(${0}不足)', [v.join('+')]) : '');
		}
	}))();
});
