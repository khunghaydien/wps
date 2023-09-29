define([
	"dojo/_base/declare",
	"dojo/_base/json",
	"dojo/_base/array",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/query",
	"dojo/on",
	"dojo/string",
	"dojo/Deferred",
	"dojo/_base/lang",
	"dojo/text!tsext/customFields/CustomFieldsView.html",
	"tsext/service/Request",
	"tsext/logic/DataLoader",
	"tsext/util/Util"
], function(declare, json, array, _WidgetBase, _TemplatedMixin, dom, domConstruct, domAttr, domStyle, domClass, query, on, str, Deferred, lang, template, Request, DataLoader, Util) {
	return declare("tsext.customFields.CustomFieldsView", [_WidgetBase, _TemplatedMixin], {
		templateString: template,
		constructor: function(){
			this.sobjs = [];
			this.bfld = {
				id: 1,
				name: 2,
				createddate: 3,
				createdbyid: 4,
				lastmodifieddate: 5,
				lastmodifiedbyid: 6,
				systemmodstamp: 7,
				isdeleted: 8,
				ownerid: 9
			};
			this.targets = [
			'account','apexclass','asset','assetrelationship','authprovider','businesshours','businessprocess','callcenter',
			'campaign','case','connectedapplication','contact','contract','duplicaterecorditem','duplicaterecordset','duplicaterule',
			'emailmessage','event','externaldatasource','externaleventmapping','externalsocialaccount','goal','group','lead','metric',
			'namedcredential','opportunity','order','organization','pricebook2','pricebookentry','processdefinition','processinstance',
			'processinstancestep','processnode','product2','profile','profileskill','profileskillendorsement','profileskilluser',
			'recordtype','socialpersona','socialpost','solution','sosdeployment','sossession','staticresource','streamingchannel','task',
			'user','userlicense','userprovaccount','userprovisioningconfig','userprovisioningrequest','userrole','workbadgedefinition',
			'workcoaching','workfeedback','workfeedbackquestion','workfeedbackquestionset','workfeedbackrequest','workfeedbacktemplate',
			'workorder','workorderlineitem','workperformancecycle','workreward','workrewardfund','workrewardfundtype'
			];
			this.excepts = ['organization','processinstance','processinstancestep'];
		},
		placeAt: function(){
			this.inherited(arguments);
			this.startup();
		},
		startup: function(){
			this.inherited(arguments);
			this.own(
				on(dom.byId('customFieldsDL'), 'click', lang.hitch(this, this.fetchStart))
			);
		},
		destroy : function(){
			this.inherited(arguments);
		},
		// エラー表示
		showError: function(errmsg){
			var area = query('div.tsext-error', this.domNode)[0];
			domStyle.set(area, 'color', 'red');
			domStyle.set(area, 'display', (errmsg ? '' : 'none'));
			area.innerHTML = errmsg || '&nbsp;';
			this.disableButton(false);
		},
		// 進捗を表示
		displayProgress: function(msg){
			var area = query('div.tsext-monitor', this.domNode)[0];
			domStyle.set(area, 'display', (msg ? '' : 'none'));
			area.innerHTML = msg || '&nbsp;';
		},
		// ボタンの活性/非活性
		disableButton: function(flag){
			domAttr.set(dom.byId('customFieldsDL') , 'disabled', flag);
			domAttr.set(dom.byId('customFieldsAll'), 'disabled', flag);
		},
		// 処理開始
		fetchStart: function(){
			this.disableButton(true);
			var mediator = {
				index: 0,
				includeAll: dom.byId('customFieldsAll').checked,
				errmsg: null
			};
			var result = this.fetchOrganization(mediator);
			if(mediator.errmsg){
				return;
			}
			result.then(lang.hitch(this, this.fetchNext));
		},
		// 組織情報を読込
		fetchOrganization: function(mediator){
			this.displayProgress('Organization');
			return Request.fetch('select Id, Name from Organization', true, true).then(
				lang.hitch(this, function(records){
					this.organization = records[0];
					return mediator;
				}),
				lang.hitch(this, function(errmsg){
					mediator.errmsg = errmsg;
					this.showError(errmsg);
					return mediator;
				})
			);
		},
		fetchNext: function(mediator){
			var result = this.fetchSObjList(mediator);
			result.then(lang.hitch(this, this.fetchSObjFieldsLoop));
		},
		// フィールド定義読込
		fetchSObjFieldsLoop: function(mediator){
			if(mediator.errmsg){
				return;
			}
			if(mediator.index >= this.sobjs.length){
				this.fetchEnd(mediator);
				return;
			}
			var result = this.fetchSObjFields(mediator);
			result.then(lang.hitch(this, this.fetchSObjFieldsLoop));
		},
		// 処理終了
		fetchEnd: function(mediator){
			for(var i = 0 ; i < this.sobjs.length ; i++){
				console.log(this.sobjs[i]);
			}
			this.download(mediator.includeAll);
			this.displayProgress('終了');
			this.disableButton(false);
		},
		// SObject定義情報読込
		fetchSObjList: function(mediator){
			this.displayProgress('SObject');
			var req = {
				action: 'SObjectList',
				keepNameSpace: true
			};
			return Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					var sObjects = result.sObjects;
					for(var key in sObjects){
						var sobj = sObjects[key];
						if(mediator.includeAll || (sobj.isCustom || this.targets.indexOf(key.toLowerCase()) >= 0)){
							sobj.key = key;
							this.sobjs.push(sobj);
						}
					}
					this.sobjs = this.sobjs.sort(function(a, b){
						if(a.isCustom && !b.isCustom){
							return -1;
						}else if(!a.isCustom && b.isCustom){
							return 1;
						}else {
							return (a.key < b.key ? -1 : 1);
						}
					});
					mediator.index = 0;
					return mediator;
				}),
				lang.hitch(this, function(errmsg){
					mediator.errmsg = errmsg;
					this.showError(errmsg);
					return mediator;
				})
			);
		},
		// フィールド定義情報読込
		fetchSObjFields: function(mediator){
			this.displayProgress('SObjectField ' + (mediator.index + 1) + ' / ' + this.sobjs.length);
			var sobj = this.sobjs[mediator.index];
			var req = {
				action: 'SObject',
				key: sobj.key,
				keepNameSpace: true
			};
			return Request.actionA(tsCONST.API_GET_EXT_RESULT, req, true).then(
				lang.hitch(this, function(result){
					lang.mixin(sobj, result);
					sobj.fields = this.sortFields(sobj.fields);
					mediator.index++;
					return mediator;
				}),
				lang.hitch(this, function(errmsg){
					mediator.errmsg = errmsg;
					this.showError(errmsg);
					return mediator;
				})
			);
		},
		// ダウンロード
		download: function(includeAll){
			this.zip = new JSZip();
			var objectList = this.getSObjectListCsv(this.sobjs, includeAll);
			this.zip.file('object_list.csv', Util.unicodeStringToTypedArray(objectList.heads + '\n' + objectList.value, true), {binary:true});
			var fieldList = this.getFieldListCsv(this.sobjs, includeAll);
			this.zip.file('object_fields.csv', Util.unicodeStringToTypedArray(fieldList.heads + '\n' + fieldList.value, true), {binary:true});
			var jsonText = this.getFieldListJson(this.sobjs);
			this.zip.file('json_fields.txt', Util.unicodeStringToTypedArray(jsonText, true), {binary:true});
			var fname = str.substitute('${0}_定義情報.zip', [this.organization.Id]);
			this.zip.generateAsync({ type: 'blob', compression: "DEFLATE" }).then(lang.hitch(this, function(content){
				// IEか他ブラウザかの判定
				if(window.navigator.msSaveBlob){
					// IEなら独自関数を使います。
					window.navigator.msSaveBlob(content, fname);
				} else {
					// それ以外はaタグを利用してイベントを発火させます
					var a = query('a.tsext-anchor', this.domNode)[0];
					a.href = URL.createObjectURL(content);
					a.download = fname;
					a.click();
					setTimeout(function(){
						URL.revokeObjectURL(a.href);
					}, 3000);
				}
			}));
		},
		/**
		 * 定義情報を検証データエクスポート／インポートに必要な項目に絞りこみJSONテキストで返す
		 */
		getFieldListJson: function(sobjs){
			var objs = [];
			for(var i = 0 ; i < sobjs.length ; i++){
				var so = sobjs[i];
				if(!so.isCustom && this.targets.indexOf(so.key.toLowerCase()) < 0){
					continue;
				}
				var obj = {
					key:       so.key,
					name:      so.name,
					label:     so.label,
					keyPrefix: so.keyPrefix,
					fields:    []
				};
				if(so.localName && so.localName != so.name){
					obj.localName = so.localName;
				}
				var fields = so.fields || [];
				if(!so.isCustom && this.excepts.indexOf(so.key) < 0){
					var nfs = [];
					for(var j = 0 ; j < fields.length ; j++){
						var k = fields[j].name.toLowerCase();
						if(k == 'id' || k == 'name'){
							nfs.push(fields[j]);
						}
					}
					fields = nfs;
				}
				for(var j = 0 ; j < fields.length ; j++){
					var field = fields[j];
					if(field.label.indexOf('削除予定') >= 0){
						continue;
					}
					var o ={
						name:      field.name,
						label:     field.label,
						typeName:  field.typeName
					};
					if(field.localName && field.localName != field.name){
						o.localName = field.localName;
					}
					if(field.length          ){ o.length           = field.length;           }
					if(field.precision       ){ o.precision        = field.precision;        }
					if(field.scale           ){ o.scale            = field.scale;            }
					if(field.isCustom        ){ o.isCustom         = field.isCustom;         }
					if(field.isCalculated    ){ o.isCalculated     = field.isCalculated;     }
					if(field.isAutoNumber    ){ o.isAutoNumber     = field.isAutoNumber;     }
					if((field.referenceTo || []).length){ o.referenceTo = field.referenceTo; }
					if(field.relationshipName){ o.relationshipName = field.relationshipName; }
					obj.fields.push(o);
				}
				objs.push(obj);
			}
			return Util.toJson(objs, true);
		},
		/**
		 * DataLoader から流用
		 */
		getSObjectListCsv: function(sobjs, includeAll){
			var value = '';
			for(var i = 0 ; i < sobjs.length ; i++){
				var so = sobjs[i];
				if(!so.name || (!includeAll && !so.isCustom)){
					continue;
				}
				var lst = [];
				lst.push(so.name);
				lst.push(so.localName || so.name);
				lst.push(so.label);
				lst.push(so.labelPlural);
				lst.push(so.keyPrefix);
				lst.push(so.isAccessible		  ? '○' : '');
				lst.push(so.isCreateable		  ? '○' : '');
				lst.push(so.isCustom			  ? '○' : '');
				lst.push(so.isCustomSetting 	  ? '○' : '');
				lst.push(so.isDeletable 		  ? '○' : '');
				lst.push(so.isDeprecatedAndHidden ? '○' : '');
				lst.push(so.isFeedEnabled		  ? '○' : '');
				lst.push(so.isMergeable 		  ? '○' : '');
				lst.push(so.isQueryable 		  ? '○' : '');
				lst.push(so.isSearchable		  ? '○' : '');
				lst.push(so.isUndeletable		  ? '○' : '');
				lst.push(so.isUpdateable		  ? '○' : '');
				value += '"' + lst.join('","') + '"\n';
			}
			var heads = [
				'name',
				'localName',
				'label',
				'labelPlural',
				'keyPrefix',
				'isAccessible',
				'isCreateable',
				'isCustom',
				'isCustomSetting',
				'isDeletable',
				'isDeprecatedAndHidden',
				'isFeedEnabled',
				'isMergeable',
				'isQueryable',
				'isSearchable',
				'isUndeletable',
				'isUpdateable'
			];
			return {
				heads: '"' + heads.join('","') + '"',
				value: value
			};
		},
		/**
		 * DataLoader から流用
		 */
		getFieldListCsv: function(sobjs, includeAll){
			var value = '';
			var customFieldOnly 	= false;
			var excludeRemoveField	= false;
			var excludeRemoveCalc	= false;
			var cutPickList 		= true;
			for(var i = 0 ; i < sobjs.length ; i++){
				var sobj = sobjs[i];
				if(!sobj.name || (!includeAll && !sobj.isCustom)){
					continue;
				}
				for(var j = 0 ; j < sobj.fields.length ; j++){
					var field = sobj.fields[j];
					if(customFieldOnly && !field.isCustom){
						continue;
					}
					if(excludeRemoveField && field.label.indexOf('削除予定') >= 0){
						continue;
					}
					if(excludeRemoveCalc && field.isCalculated){
						continue;
					}
					var lst = [];
					lst.push(sobj.label || '');
					lst.push(sobj.name || '');
					lst.push(field.label);
					lst.push(field.name);
					lst.push(field.typeName);
					lst.push('' + field.length);
					lst.push('' + (field.precision || 0));
					lst.push('' + (field.scale || 0));
					lst.push((field.referenceTo || []).join(','));
					lst.push(this.getPickLabels(field.picklistValues, '\n', (cutPickList ? 100 : 0)));
					lst.push(field.inlineHelpText	 ? field.inlineHelpText.replace(/"/g, '""')    : '');
					lst.push(field.calculatedFormula ? field.calculatedFormula.replace(/"/g, '""') : '');
					lst.push(field.isAutoNumber ? '○' : '');
					lst.push(field.isIdLookup	? '○' : '');
					lst.push(field.isCalculated ? '○' : '');
					lst.push(field.isCustom 	? '○' : '');
					lst.push(field.isNillable	? '○' : '');
					lst.push(field.isUnique 	? '○' : '');
					lst.push(field.isExternalID 			 ? '○' : '');
					lst.push(field.isGroupable				 ? '○' : '');
					lst.push(field.isHtmlFormatted			 ? '○' : '');
					lst.push(field.isRestrictedDelete		 ? '○' : '');
					lst.push(this.getChildRelationshipName(sobj.name, field.name) || '');
					value += '"' + lst.join('","') + '"\n';
				}
			}
			var heads = [
				"objectLabel",
				"objectName",
				"label",
				"name",
				"type",
				"length",
				"precision",
				"scale",
				"referenceTo",
				"pickList",
				"helpText",
				"calculatedFormula",
				"isAutoNumber",
				"isIdLookup",
				"isCalculated",
				"isCustom",
				"isNilable",
				"isUnique",
				"isExternalID",
				"isGroupable",
				"isHtmlFormatted",
				"isRestrictedDelete",
				"childRelationshipName"
			];
			return {
				heads: '"' + heads.join('","') + '"',
				value: value
			};
		},
		/**
		 * DataLoader から流用
		 */
		getPickLabels: function(values, d, cutLen){
			if(!values || values.length <= 0){
				return '';
			}
			var labels = [];
			for(var i = 0 ; i < values.length ; i++){
				labels.push(values[i][0]);
				if(cutLen && labels.length >= cutLen){
					labels.push('※' + cutLen + '件に達したため打ち切り※');
					break;
				}
			}
			return labels.join(d);
		},
		/**
		 * DataLoader から流用
		 */
		getChildRelationshipName: function(soName, fieldName){
			var sn = soName.toLowerCase();
			var fn = fieldName.toLowerCase();
			for(var i = 0 ; i < this.sobjs.length ; i++){
				var sobj = this.sobjs[i];
				var ships = sobj.childRelationships || [];
				for(var j = 0 ; j < ships.length ; j++){
					var ship = ships[j];
					if(ship.objectName.toLowerCase() == sn
					&& ship.fieldName.toLowerCase() == fn){
						return ship.relationshipName;
					}
				}
			}
			return null;
		},
		/**
		 * DataLoader から流用
		 */
		sortFields: function(fields){
			fields = fields.sort(lang.hitch(this, function(a, b){
				var x = this.bfld[a.name.toLowerCase()];
				var y = this.bfld[b.name.toLowerCase()];
				if(x && y){
					return x - y;
				}else if(x){
					return -1;
				}else if(y){
					return 1;
				}else{
					if(a.isCustom && !b.isCustom){
						return 1;
					}else if(!a.isCustom && b.isCustom){
						return -1;
					}
					return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
				}
			}));
			return fields;
		}
	});
});
