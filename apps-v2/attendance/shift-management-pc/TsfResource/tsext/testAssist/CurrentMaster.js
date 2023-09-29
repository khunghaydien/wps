define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"dojo/Deferred",
	"tsext/service/Request",
	"tsext/testAssist/Constant",
	"tsext/util/TsError",
	"tsext/util/Util"
], function(declare, lang, array, str, Deferred, Request, Constant, TsError, Util){
	//
	return declare("tsext.testAssist.CurrentMaster", null, {
		constructor : function(){
			/**
			 * 名前からIDを引けるMAP
			 * {
			 * 'empTypes':{{string}:<Array.<string>,...},
			 * 'holidays':{{string}:<Array.<string>,...},
			 * 'patterns':{{string}:<Array.<string>,...},
			 * 'depts':{{string}:<Array.<string>,...},
			 * }
			 */
			this.nameMap = {};
			this.lastFetchedTime = null;
			this.LATEST_INTERVAL = 5 * 60 * 1000; // 前回取得時からの経過時間最大値
		},
		/**
		 * 名前でIDを引く
		 * ※第3,4引数をtrue以外でこの関数を呼ぶ際は try-catch で囲むこと
		 * @param {string} key 'empTypes','holidays','patterns','depts' のいずれか
		 * @param {string} name
		 * @param {boolean=} allowDupl true:重複があれば最初に見つかった方のIDを返す
		 * @param {boolean=} nullable true:該当なければnullを返す
		 * @return {string|null}
		 */
		getIdByName: function(key, name, allowDupl, nullable){
			var obj = this.getObjByName(key, name, allowDupl, nullable);
			return (obj && obj.Id) || null;
		},
		getObjByName: function(key, name, allowDupl, nullable){
			var objs = this.nameMap[key][name];
			if(objs && objs.length){
				if(objs.length > 1 && !allowDupl){
					throw new TsError(Constant.ERROR_NAME_DUPLICATE);
				}
				return objs[0];
			}
			if(nullable){
				return null;
			}else{
				throw new TsError(Constant.ERROR_NOTFOUND);
			}
		},
		getNameMapByKey: function(key){
			return this.nameMap[key];
		},
		/**
		 * マスタデータ取得開始
		 */
		getTargetObjs: function(targetKeys){
			var cbset = [
				'ConfigBaseId__c',
				'ConfigBaseId__r.InitialDateOfYear__c',
				'ConfigBaseId__r.MarkOfYear__c',
				'ConfigBaseId__r.InitialDateOfMonth__c',
				'ConfigBaseId__r.MarkOfMonth__c',
				'ConfigBaseId__r.InitialDayOfWeek__c'
			];
			var all = [
				{ key:'empTypes', name:'勤務体系'    ,soql:'select Id,Name,'+cbset.join(',')+' from AtkEmpType__c' },
				{ key:'holidays', name:'休暇'        ,soql:'select Id,Name,Managed__c,ManageName__c from AtkHoliday__c where OriginalId__c = null' },
				{ key:'patterns', name:'勤務パターン',soql:'select Id,Name from AtkPattern__c where OriginalId__c = null' },
				{ key:'workLocations', name:'勤務場所',soql:'select Id,Name from WorkLocation__c' },
				{ key:'emps'    , name:'社員'        ,soql:'select Id,Name from AtkEmp__c' },
				{ key:'depts'   , name:'部署'        ,soql:'select Id,Name from AtkDept__c' },
				{ key:'users'   , name:'ユーザ'      ,soql:'select Id,Name from User' }
			];
			if(!targetKeys || !targetKeys.length){
				return all;
			}
			var objs = [];
			for(var i = 0 ; i < all.length ; i++){
				var obj = all[i];
				if(targetKeys.indexOf(obj.key) >= 0){
					objs.push(obj);
				}
			}
			return objs;
		},
		getTargetNames: function(targets){
			var names = [];
			for(var i = 0 ; i < targets.length ; i++){
				var target = targets[i];
				names.push(target.name);
			}
			return names.join(',');
		},
		/**
		 * マスタデータ取得開始
		 * @param {teasp.testAssist.Bagged} bagged
		 * @param {Array.<string>} targetKeys
		 * @return {Object} dojo/Deferred.promise
		 */
		fetchMasterStart: function(view, targetKeys){
			var deferred = new Deferred();
			if(!targetKeys
			&& this.lastFetchedTime
			&& ((new Date()).getTime() - this.lastFetchedTime) < this.LATEST_INTERVAL
			){
				// 前回取得時からの経過時間が {this.LATEST_INTERVAL} 以内であるため、スキップ
				setTimeout(lang.hitch(this, function(){
					view.outputLog('fetch Master skip');
					deferred.resolve();
				}), 100);
			}else{
				var targets = this.getTargetObjs(targetKeys);
				view.outputLog('読込 ' + this.getTargetNames(targets));
				this.fetchMasterNext({
					targets: targets,
					index: 0,
					view: view,
					deferred: deferred
				});
			}
			return deferred.promise;
		},
		/**
		 * マスタデータ取得
		 */
		fetchMasterNext: function(obj){
			if(obj.errmsg){
				obj.view.showMessage('');
				obj.deferred.reject(obj.errmsg);
				return;
			}
			if(obj.index >= obj.targets.length){
				obj.view.showMessage('');
				obj.view.outputLog(Constant.LOG_OK);
				this.lastFetchedTime = (new Date()).getTime();
				obj.deferred.resolve();
				return;
			}
			var target = obj.targets[obj.index];
			if(this.nameMap[target.key]){
				delete this.nameMap[target.key];
				this.nameMap[target.key] = null;
			}
			obj.view.showMessage(target.name + 'リストを取得..');
			var soql = target.soql;
			var fetch = Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					this.nameMap[target.key] = this.createNameMap(records);
					obj.index++;
					return obj;
				}),
				lang.hitch(this, function(errmsg){
					obj.errmsg = errmsg;
					return obj;
				})
			);
			fetch.then(lang.hitch(this, this.fetchMasterNext));
		},
		fetchCommon: function(){
			var deferred = new Deferred();
			var soql = "select Id,Config__c from AtkCommon__c";
			Request.fetch(soql, true).then(
				lang.hitch(this, function(records){
					deferred.resolve(records);
				}),
				lang.hitch(this, function(errmsg){
					deferred.reject(errmsg);
				})
			);
			return deferred.promise;
		},
		/**
		 * レコード配列からマップ生成
		 * @param {Array.<Object>} records
		 * @return {Object}
		 */
		createNameMap: function(records){
			var mp = {};
			for(var i = 0 ; i < records.length ; i++){
				var record = records[i];
				var objs = mp[record.Name];
				if(!objs){
					objs = mp[record.Name] = [];
				}
				objs.push(record);
			}
			return mp;
		}
	});
});
