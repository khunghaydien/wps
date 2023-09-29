define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/string",
	"tsext/util/Util"
], function(declare, lang, str, Util){
	teaspex.agent = (new declare("tsext.service.Agent", null, {
		CATEGORY_SOBJECT: 'SObject',
		CATEGORY_SOBJECTLIST: 'SObjectList',
		CATEGORY_KEY_PREFIX: 'KeyPrefix',
		CATEGORY_APPLYLIST: 'ApplyList',
		LOCAL_ID_PREFIX: 'LOCAL',
		constructor : function(){
			this.cache = {};
			this.hashPrefix = "!";
			this.params = this.getArgs();
			this.sequenceLocalId = 1;
		},
		init: function(res){
			var info = Util.fromJson(res) || {};
			Util.excludeNameSpace(info);
			this.user = (info.user && info.user.length ? info.user[0] : null);
			Object.keys(info.sObjects || {}).forEach(function(key){
				this.setSObjectList(key, info.sObjects[key]);
			}, this);
			this.checkPrefix();
		},
		getHashPrefix: function(){
			return this.hashPrefix;
		},
		getArgs: function(){
			var params = {};
			var args = location.search.split('&');
			for(var i = 0 ; i < args.length ; i++){
				var v = args[i];
				if(i == 0){
					v = v.substring(1);
				}
				var p = v.split('=');
				if(p.length){
					params[p[0].toLowerCase()] = (p.length > 1 ? p[1] : null);
				}
			}
			return params;
		},
		getDefaultHash: function(){
			if(this.params['support'] !== undefined){
				return 'menu';
			}else if(this.params['check'] !== undefined){
				return 'check';
			}
			return '';
		},
		getLocationHash: function(flag){
			var h = location.hash;
			if(h && flag){
				var m = /^#\!?(.+)/.exec(h);
				if(m){
					return m[1];
				}
			}
			return h;
		},
		set: function(category, key, value, flag){
			var obj = this.cache[category];
			if(!obj){
				obj = this.cache[category] = {};
			}
			obj[(flag ? key : key.toLowerCase())] = value;
		},
		get: function(category, key, flag){
			return (category ? (this.cache[category] && key ? this.cache[category][(flag ? key : key.toLowerCase())] : this.cache[category]) : this.cache) || null;
		},
		mix: function(category, map){
			var obj = this.cache[category];
			if(!obj){
				obj = this.cache[category] = map;
			}else{
				lang.mixin(obj, map);
			}
		},
		clear: function(category, key){
			if(category){
				if(key){
					delete this.cache[category][key.toLowerCase()];
				}else{
					delete this.cache[category];
				}
			}else{
				this.cache = {};
			}
		},
		checkPrefix: function(){
			var sobjs = this.get(this.CATEGORY_SOBJECTLIST);
			for(var key in sobjs){
				var sobj = sobjs[key];
				if(Util.rawName(sobj.name).toLowerCase() == 'atkcommon__c'){
					tsCONST.prefixBar = Util.getPrefix(sobj.name);
					break;
				}
			}
		},
		getSObjectList: function(key){
			return this.get(this.CATEGORY_SOBJECTLIST, key);
		},
		setSObjectList: function(key, value){
			this.set(this.CATEGORY_SOBJECTLIST, key, value);
		},
		getSObject: function(key){
			return this.get(this.CATEGORY_SOBJECT, key);
		},
		getSObjectKeys: function(){
			return Object.keys(this.get(this.CATEGORY_SOBJECT));
		},
		setSObject: function(key, value){
			this.set(this.CATEGORY_SOBJECT, key, value);
		},
		// 旧IDとSObjインスタンスのマップ
		setSObjByKeyPrefix: function(key, sobj){
			this.set(this.CATEGORY_KEY_PREFIX, key, sobj, true);
		},
		getSObjById: function(id){
			return this.get(this.CATEGORY_KEY_PREFIX, id.substring(0, 3), true);
		},
		// (承認履歴用)申請レコードのIDをセット
		setApplyId: function(id){
			return this.set(this.CATEGORY_APPLYLIST, id, 1, true);
		},
		// (承認履歴用)申請レコードのIDを返す
		// flag=true なら配列、falseならkey-value
		getApplyIds: function(flag){
			var m = this.get(this.CATEGORY_APPLYLIST);
			if(!m){
				return (flag ? [] : {});
			}
			return (flag ? Object.keys(m) : m);
		},
		// 自身のユーザIDを返す
		getUserId: function(){
			return (this.user && this.user.Id) || null;
		},
		// システム管理者
		isSystemAdmin: function(){
			return (this.user && this.user.Profile.PermissionsModifyAllData);
		},
		getLocalId: function(){
			return this.LOCAL_ID_PREFIX + str.pad(this.sequenceLocalId++, 8, '0', false);
		}
	}))();
	return teaspex.agent;
});
