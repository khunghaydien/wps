if(typeof(teasp) == 'object' && !teasp.resolved['V5-2189'] && location.pathname.indexOf('AtkManageView') > 0){
	var init0 = init;
	var init = function(){
		readV5_2189(function(flag){
			init0();
			if(!flag){
				dojo.query('.tscircle_menu').forEach(function(elem){
				    elem.style.display = 'none';
				});
				dojo.style('not_tscircle_menu', 'display','');
			}
		});
	};
	var readV5_2189 = function(callback){
		var soql = "select Id,DeptId__r.DeptGroupId__r.IsEnableEnvironmentSettings__c from AtkEmp__c where UserId__c = '"+data.sessionInfo.user.id+"'";
		teasp.action.contact.remoteMethods(
			[{funcName:'getExtResult',params:{soql:soql,limit:1,offset:0}}],
			{errorAreaId:null,nowait:true},
			dojo.hitch(this, function(result){
				teasp.util.excludeNameSpace(result);
				var flag = false;
				if(result.records && result.records.length > 0){
					var emp = result.records[0];
					flag = (emp.DeptId__r && emp.DeptId__r.DeptGroupId__r && emp.DeptId__r.DeptGroupId__r.IsEnableEnvironmentSettings__c);
				}
				callback(flag);
			}),
			dojo.hitch(this, function(result){
	            teasp.manager.dialogClose('BusyWait2');
				callback(false);
			}),
			this
		);
	};
}
