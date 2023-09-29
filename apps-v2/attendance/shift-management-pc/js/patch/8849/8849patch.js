if(typeof(teasp) == 'object' && !teasp.resolved['8849']){
	if(location.pathname.indexOf('AtkEmpEditView') > 0){
		function showChangeEmpType(){
			changeEmpTypeInfo.remoteAction = "teamspirit.AtkEmpCtl.remoteAction";
			for(var i = 0 ; i < changeEmpTypeInfo.configs.length ; i++){
				var c = changeEmpTypeInfo.configs[i];
				if(c.ValidStartDate__c){
					c.ValidStartDate__c = moment(moment(c.ValidStartDate__c).format('YYYY-MM-DD')).toDate().getTime();
				}
				if(c.ValidEndDate__c  ){
					c.ValidEndDate__c = moment(moment(c.ValidEndDate__c).format('YYYY-MM-DD')).toDate().getTime();
				}
			}
			changeEmpTypeDialog.open(changeEmpTypeInfo, function(result){
				changeEmpTypeInfo = null;
				empTypeHistory = null;
				data.emp.empTypeId      = result.empType.Id;
				data.emp.empTypeName    = result.empType.Name;
				dojo.byId('empTypeValue').value = data.emp.empTypeName;
			});
		}
	}else if(location.pathname.indexOf('AtkEmpListView') > 0){
		function showChangeEmpType(){
			changeEmpTypeInfo.remoteAction = "teamspirit.AtkEmpCtl.remoteAction";
			for(var i = 0 ; i < changeEmpTypeInfo.configs.length ; i++){
				var c = changeEmpTypeInfo.configs[i];
				if(c.ValidStartDate__c){
					c.ValidStartDate__c = moment(moment(c.ValidStartDate__c).format('YYYY-MM-DD')).toDate().getTime();
				}
				if(c.ValidEndDate__c  ){
					c.ValidEndDate__c = moment(moment(c.ValidEndDate__c).format('YYYY-MM-DD')).toDate().getTime();
				}
			}
			changeEmpTypeDialog.open(changeEmpTypeInfo, function(result){
				changeEmpTypeInfo = null;
				for(var i = 0 ; i < data.empList.length ; i++){
					var emp = data.empList[i];
					if(emp.id == result.empId){
						emp.empTypeId   = result.empType.Id;
						emp.empTypeName = result.empType.Name;
						dojo.query('div.emp-type-name', dojo.byId('emp' + emp.id)).forEach(function(el){
							el.innerHTML = emp.empTypeName;
						});
						break;
					}
				}
			});
		}
	}
}
