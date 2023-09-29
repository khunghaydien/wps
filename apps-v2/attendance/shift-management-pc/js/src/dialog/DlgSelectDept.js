teasp.provide('teasp.dialog.SelectDept');
/**
 * 部署検索ダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.SelectDept = function(){
	this.id = 'dialogSelectDept';
	this.title = '部署検索';
	this.duration = 1;
	this.content = '<div class="dlg_content"><table border="0" cellpadding="0" cellspacing="0" style="width:100%;"><tr><td style="font-weight:bold;">絞り込み検索</td><td><div class="searchbox" style="border:1px solid gray;"><div><div class="loupe"></div></div><div><input type="text" id="selectDeptNameIn" style="width:300px;padding:1px 0px;" maxLength="80" placeholder="" /></div><div><div class="clear" id="selectDeptNameInClear" style="display:none;"></div></div></div></td></tr><tr><td colSpan="2" style="padding:8px 0px;width:500px;"><div id="selectDeptArea" style="overflow-y:scroll;overflow-x:hidden;height:240px;border:1px solid gray;"><table class="pane_table" style="width:100%;"><tbody id="selectDeptTbody"></tbody></table></div></td></tr><tr><td colSpan="2" style="padding:4px 0px;text-align:center;"><input type="button" class="normalbtn" value="選択" id="selectDeptOk" />&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" class="cancelbtn" value="キャンセル" id="selectDeptCancel" /></td></tr></table></div>';
	this.okLink = {
		id		 : 'selectDeptOk',
		callback : this.ok
	};
	this.cancelLink = {
		id		 : 'selectDeptCancel',
		callback : this.cancel
	};
};

teasp.dialog.SelectDept.prototype = new teasp.dialog.Base();

teasp.dialog.SelectDept.prototype.preStart = function(){
	dojo.attr(dojo.byId('selectDeptNameIn'), 'placeholder', '(全件表示)');
	dojo.connect(dojo.byId('selectDeptNameIn'), 'input', this, this.filterSelectDeptNameDelay); // 貼り付けなど
	dojo.connect(dojo.byId('selectDeptNameIn'), 'keypress', this, function(e){
		if(e.keyCode == 13){ // 絞り込み入力欄でEnterキーが入力されると画面がリフレッシュされるため無視する
			e.preventDefault();
			e.stopPropagation();
		}
	});
	dojo.connect(dojo.byId('selectDeptNameInClear'), 'click', this, this.clearFilter); // クリア
};
teasp.dialog.SelectDept.prototype.filterSelectDeptNameDelay = function(e){
	setTimeout(dojo.hitch(this, this.filterSelectDeptName), 10);
};
teasp.dialog.SelectDept.prototype.filterSelectDeptName = function(){
	var inp = dojo.byId('selectDeptNameIn');
	var clr = dojo.byId('selectDeptNameInClear');
	var str = inp.value;
	var v = teasp.util.convertStr(str);
	dojo.style(clr, 'display', (v ? '' : 'none'));
	var found = 0;
	var rowNo = 0;
	var rowmap = {};
	dojo.query('#selectDeptTbody tr').forEach(function(tr){
		rowNo++;
		dojo.query('input[type="hidden"]', tr).forEach(function(hid){
			if(!rowmap[rowNo]){
				var name = hid.value;
				if(v && name.indexOf(v) < 0){
					dojo.style(tr, 'display', 'none');
				}else{
					dojo.style(tr, 'display', '');
					dojo.toggleClass(tr, 'even', (found%2) == 0);
					dojo.toggleClass(tr, 'odd' , (found%2) != 0);
					found++;
					rowmap[rowNo] = 1;
				}
			}
		});
	});
	if(rowNo > 0){
		this.displayNoMatch(found, str);
	}
};
teasp.dialog.SelectDept.prototype.clearFilter = function(e){
	var inp = dojo.byId('selectDeptNameIn');
	inp.value = '';
	inp.focus();
	this.filterSelectDeptName();
};

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.SelectDept.prototype.preShow = function(){
	var depts = this.pouch.depts || [];
	var tbody = dojo.byId('selectDeptTbody');
	dojo.empty(tbody);
	var n = 0;
	for(var i = 0 ; i < depts.length ; i++){
		var dept = depts[i];
		if(dept.past || dept.future){
			continue;
		}
		var row = dojo.create('tr', { className:'ts-row-' + ((n++)%2==0 ? 'even' : 'odd'), style:'cursor:pointer;' }, tbody);
		var td1 = dojo.create('td', { style:'width:24px;padding:1px 4px;' }, row);
		var td2 = dojo.create('td', { innerHTML: dept.displayName, style:'padding:1px 4px;word-break:break-all;' }, row);
		dojo.create('input', { type:'radio', name:'selectDeptName', data:dept.Id }, td1);
		dojo.create('input', { type:'hidden', value:teasp.util.convertStr(dept.displayName.replace(/&nbsp;/ig, '')) }, td2);
	}
	dojo.byId('selectDeptNameIn').value = '';
	dojo.style('selectDeptNameInClear', 'display', 'none');
	var handles = this.selectDeptHandles || [];
	for(var i = 0 ; i < handles.length ; i++){
		dojo.disconnect(handles[i]);
	}
	this.selectDeptHandles = [];
	dojo.query('tr', tbody).forEach(function(el){
		this.selectDeptHandles.push(dojo.connect(el, 'click', this, function(e){
			var tr = teasp.util.getAncestorByTagName(e.target, 'TR');
			dojo.query('input', tr)[0].checked = true;
		}))
	}, this);
	return true;
};

teasp.dialog.SelectDept.prototype.displayNoMatch = function(found, str){
	var tbody = dojo.byId('selectDeptTbody');
	var divs = dojo.query('div.no-match', tbody);
	var v = (found ? '' : dojo.string.substitute('「${0}」に一致する部署はありません', [teasp.util.entitize(str, '')]));
	if(divs.length){
		if(!found){
			divs[0].innerHTML = v;
		}
		var tr = teasp.util.getAncestorByTagName(divs[0], 'TR');
		dojo.style(tr, 'display', (found ? 'none' : ''));
	}else if(!found){
		dojo.create('div', { innerHTML:v, className:'no-match' },
			dojo.create('td', { colSpan:2, style:'text-align:left;' },
				dojo.create('tr', null, tbody)
			)
		);
	}
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.SelectDept.prototype.ok = function(){
	var targetId = null;
	var els = dojo.query('input[type="radio"]:checked', dojo.byId('selectDeptTbody'));
	if(!els.length){
		return;
	}
	var tr = teasp.util.getAncestorByTagName(els[0], 'TR');
	if(dojo.style(tr, 'display') == 'none'){
		return;
	}
	targetId = dojo.attr(els[0], 'data');
	this.onfinishfunc({
			targetId: targetId
		},
		'selectDeptErrorRow',
		function(res){
			this.hide();
		},
		this
	);
};

teasp.dialog.SelectDept.prototype.cancel = function(){
	this.onfinishfunc({},
		'selectDeptErrorRow',
		function(res){
			this.hide();
		},
		this
	);
};
