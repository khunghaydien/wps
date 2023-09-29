define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, array, str, Util){
	return declare("tsext.absorber.Debug", null, {
		constructor : function(){
		},
		outputCsv: function(callback, area, emps){
			callback(
				area,
				{
					fname:'有休付与消化集計.csv',
					heads:this.getYuqHeads1(),
					value:this.getYuqValue1(emps.getEmps())
				}
			);
			callback(
				area,
				{
					fname:'有休付与消化明細.csv',
					heads:this.getYuqHeads2(),
					value:this.getYuqValue2(emps.getEmps())
				}
			);
			var types = emps.getStockTypeList();
			for(var i = 0 ; i < types.length ; i++){
				var type = types[i];
				callback(
					area,
					{
						fname:type + '付与消化集計.csv',
						heads:this.getStockHeads1(type),
						value:this.getStockValue1(emps.getEmps(), type)
					}
				);
				callback(
					area,
					{
						fname:type + '付与消化明細.csv',
						heads:this.getStockHeads2(type),
						value:this.getStockValue2(emps.getEmps(), type)
					}
				);
			}
			callback(
				area,
				{
					fname:'テスト.csv',
					heads:this.getMonthHead(),
					value:this.getMonthValue(emps.getEmps())
				}
			);
		},
		getYuqHeads1: function(){
			return ('"' + [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'入社日',
				'退社日',
				'付与日数',
				'付与時間',
				'消化日数',
				'消化時間',
				'失効日数',
				'失効時間',
				'残日数',
				'残時間',
				'紐付切れ日数',
				'紐付切れ時間'
			].join('","') + '"');
		},
		getYuqHeads2: function(){
			return ('"' + [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'入社日',
				'退社日',
				'分類',
				'付与日数',
				'付与時間',
				'消化日数',
				'消化時間',
				'残日数',
				'残時間',
				'失効',
				'有効開始日',
				'失効日',
				'消化日',
				'分割',
				'紐付切れ日数',
				'紐付切れ時間',
				'付与/消化要因',
				'事柄'
			].join('","') + '"');
		},
		getStockHeads1: function(){
			return ('"' + [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'入社日',
				'退社日',
				'種類',
				'付与数',
				'消化数',
				'失効数',
				'残日数',
				'紐付切れ数'
			].join('","') + '"');
		},
		getStockHeads2: function(){
			return ('"' + [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'入社日',
				'退社日',
				'種類',
				'分類',
				'付与',
				'消化',
				'残',
				'失効',
				'有効開始日',
				'失効日',
				'消化日',
				'分割',
				'紐付切れ',
				'付与/消化要因'
			].join('","') + '"');
		},
		getMonthHead: function(){
			return ('"' + [
				'社員コード',
				'社員名',
				'部署コード',
				'部署名',
				'勤務体系名',
				'入社日',
				'退社日',
				'月度',
				'開始日',
				'締め日',
				'ステータス'
			].join('","') + '"');
		},
		getYuqValue1: function(emps){
			var value = '';
			for(var i = 0 ; i < emps.length ; i++){
				var emp = emps[i];
				value += emp.getYuqLines1();
			}
			return value;
		},
		getYuqValue2: function(emps){
			var value = '';
			for(var i = 0 ; i < emps.length ; i++){
				var emp = emps[i];
				value += emp.getYuqLines2();
			}
			return value;
		},
		getStockValue1: function(emps, key){
			var value = '';
			for(var i = 0 ; i < emps.length ; i++){
				var emp = emps[i];
				value += emp.getStockLines1(key);
			}
			return value;
		},
		getStockValue2: function(emps, key){
			var value = '';
			for(var i = 0 ; i < emps.length ; i++){
				var emp = emps[i];
				value += emp.getStockLines2(key);
			}
			return value;
		},
		getMonthValue: function(emps){
			var value = '';
			for(var i = 0 ; i < emps.length ; i++){
				var emp = emps[i];
				value += emp.getMonthLines();
			}
			return value;
		}
	});
});
