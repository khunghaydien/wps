if(typeof(teasp) == 'object' && !teasp.resolved['JAG1'] && teasp.view && teasp.view.Monthly && teasp.view.MonthlySummary){
// 勤務表・月次サマリー共通(override)
teasp.data.Pouch.prototype.getDeptName = function(){
	return this.dataObj.targetEmp.newDeptName || '';
};
// 勤務表・月次サマリー共通(insert)
teasp.data.Pouch.prototype.setDeptName = function(name){
	this.dataObj.targetEmp.newDeptName = name || '';
};
// 勤務表(override)
teasp.view.Monthly.prototype.createGraphArea = function(){
	var div = dojo.byId('graphDiv');
	if(!div){
		return;
	}
	if(!this.graph){
		this.graph = new teasp.helper.Graph({
			widthPerH		   : 20
		, startY			 : 48
		, sizeType			 : 'small'
		, movable			 : false
		, clickedEvent		 : this.openEditTime
		, clickedApply		 : this.openEmpApply
		, hideTimeGraphPopup : this.pouch.isHideTimeGraphPopup()
		, that				 : this
	});
	}
	this.graph.clear();
	this.graph.draw(this.pouch, 'graphDiv', this.pouch.getMonthDateList());
	setTimeout(dojo.hitch(this, this.adjustGraphAreaScroll), 100);

	//----------- カスタマイズ開始 -------------
	teasp.prefixBar = 'teamspirit__';
	teasp.action.contact.remoteMethod(
		'getExtResult',
		{
			soql: "select HR_DeptName__c from AtkEmp__c where Id = '" + this.pouch.dataObj.targetEmp.id + "'",
			limit: 1,
			offset: 0
		},
		dojo.hitch(this, function(result){
			teasp.util.excludeNameSpace(result);
			if(result.result == 'NG'){
				alert(teasp.message.getErrorMessage(result));
			}else{
				this.pouch.setDeptName(result.records[0].HR_DeptName__c);
				dojo.query('td.ts-top-info-r > div.dept-name', dojo.byId('expTopView'))[0].innerHTML = this.pouch.getDeptName();
			}
		}),
		null,
		this
	);
	//----------- カスタマイズ終了 -------------
};
// 月次サマリー(override)
teasp.view.MonthlySummary.prototype.show = function(){
	if(typeof(teasp.helper.Summary) != 'undefined'){ // 5.220以降である
		this.helperSummary = new teasp.helper.Summary(this.pouch);
	}else{ // 5.200以前である
	    this.monSum = this.pouch.getMonthSummary();
	}

	// 入館管理情報の表示/非表示
	var msac = this.pouch.isMsAccessInfo(); // 月次サマリに入退館情報を表示する
	var table = dojo.byId('workTable');
	dojo.query('td.prtv_head_entr,td.prtv_head_exit,td.prtv_head_dive,td.prtv_entr,td.prtv_exit,td.prtv_dive', table).forEach(function(el){
		dojo.style(el, 'display', (msac ? '' : 'none'));
	});
	dojo.attr(dojo.query('td.prtv_foot_goke', table)[0], 'colSpan', (msac ? 9 : 6));

	//----------- カスタマイズ開始 -------------
	teasp.prefixBar = 'teamspirit__';
	teasp.action.contact.remoteMethod(
		'getExtResult',
		{
			soql: "select HR_DeptName__c from AtkEmp__c where Id = '" + this.pouch.dataObj.targetEmp.id + "'",
			limit: 1,
			offset: 0
		},
		dojo.hitch(this, function(result){
			teasp.util.excludeNameSpace(result);
			if(result.result == 'NG'){
				alert(teasp.message.getErrorMessage(result));
			}else{
				this.pouch.setDeptName(result.records[0].HR_DeptName__c);
			}
			this.showMain();
		}),
		null,
		this
	);
	//----------- カスタマイズ終了 -------------
};
}
