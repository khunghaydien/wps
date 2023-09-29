if(typeof(teasp) == 'object' && !teasp.resolved['9996'] && location.pathname.indexOf('AtkManageView') > 0){
	var init0 = init;
	var init = function(){
		console.log('ok');
		if(data.sessionInfo.user.sysAdmin){
			init0();
		}else{
			read9996(function(flag){
				init0();
				setReadOnly9996(flag, getParentTag9996('system_menu'));
				setReadOnly9996(flag, getParentTag9996('exp_manage_menu'));
				setReadOnly9996(flag, getParentTag9996('job_manage_menu'));
				setReadOnlyReportFolder9996(flag);
				dojo.style('baseArea', 'display', '');
			});
		}
	};
	var read9996 = function(callback){
		if(!data.sessionInfo.emp || !data.sessionInfo.emp.isAdmin){
			callback(false);
			return;
		}
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
	var setReadOnly9996 = function(flag, pt){
		if(!flag && pt){
			dojo.query('a', pt).forEach(function(el){
				dojo.attr(el, 'href', 'javascript:void(0);');
				dojo.style(el, 'text-decoration', 'none');
				dojo.style(el, 'color', 'gray');
				dojo.style(el, 'cursor', 'default');
			});
		}
	};
	var getParentTag9996 = function(key){
		var tags = dojo.query('#baseArea .' + key);
		return (tags.length ? teasp.util.getAncestorByTagName(tags[0], 'TBODY') : null);
	};
	var setReadOnlyReportFolder9996 = function(flag){
		if(!flag){
			dojo.query('#reportFolderTable a').forEach(function(el){
				dojo.attr(el, 'href', 'javascript:void(0);');
				dojo.style(el, 'text-decoration', 'none');
				dojo.style(el, 'color', 'gray');
				dojo.style(el, 'cursor', 'default');
			});
		}
	};
}
