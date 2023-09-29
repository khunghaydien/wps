teasp.provide('teasp.dialog.Status');
/**
 * ステータスダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.Status = function(){
	this.id = 'dialogStatus';
	this.title = teasp.message.getLabel('status_caption'); // ステータス
	this.duration = 1;
	this.content = '<table id="dialogStatusTable"><tr><td><table class="emp_apply_steps"><tbody><tr><td><table class="emp_apply_steps_head"><tbody></tbody></table></td></tr><tr><td><div class="emp_apply_steps_area" id="dialogStatusDiv"><table class="emp_apply_steps_body"><tbody></tbody></table></div></td></tr></tbody></table></td></tr><tr class="ts-buttons-row"><td style="text-align:center;padding-top:10px;"><div><button class="red-button1" id="dialogStatusRemove" ><div></div></button><button class="std-button2" id="dialogStatusClose"  ><div></div></button></div></td></tr></table>';
	this.cancelLink = {
		id		 : 'dialogStatusClose',
		callback : this.close
	};
	this.removeHandle = null;
};

teasp.dialog.Status.prototype = new teasp.dialog.Base();

teasp.dialog.Status.prototype.preStart = function(){
	dojo.byId('dialogStatusRemove').firstChild.innerHTML = teasp.message.getLabel('cancelApply_btn_title'); // 申請取消
	dojo.byId('dialogStatusClose' ).firstChild.innerHTML = teasp.message.getLabel('close_btn_title');		// 閉じる
};

/**
 *
 * @override
 */
teasp.dialog.Status.prototype.preShow = function(){
	if(this.removeHandle){
		dojo.disconnect(this.removeHandle);
	}
	if(this.args.unknotable){
		this.setUnknotButton();
	}else{
		this.setRemoveButton(this.args.removable);
	}

	dojo.style('dialogStatusTable', 'width', (teasp.isNarrow() ? '100%' : '612px'));
	dojo.style('dialogStatusDiv'  , 'width', (teasp.isNarrow() ? '100%' : '612px'));
	if(!teasp.isNarrow()){
		dojo.style('dialogStatusDiv', 'overflow-y', 'scroll');
		dojo.style('dialogStatusDiv', 'height'	  , '105px');
	}
	// ヘッダ部
	var thead = dojo.query('#dialogStatusTable table.emp_apply_steps_head > tbody')[0];
	dojo.empty(thead);
	var cr1 = dojo.create('tr', null, thead);
	var td1 = dojo.create('td', { className: 'number'  }, cr1);
	var td2 = dojo.create('td', { className: 'datetime'}, cr1);
	var td3 = dojo.create('td', { className: 'status'  }, cr1);
	var td4 = dojo.create('td', { className: 'actor'   }, cr1);
	var td5 = (teasp.isNarrow() ? null : dojo.create('td', { className: 'comment' }, cr1));
	dojo.create('div', { innerHTML: teasp.message.getLabel('number_head')	}, td1); // #
	dojo.create('div', { innerHTML: teasp.message.getLabel('dateTime_head') }, td2); // 日時
	dojo.create('div', { innerHTML: teasp.message.getLabel('statusj_head')	}, td3); // 状況
	dojo.create('div', { innerHTML: teasp.message.getLabel('actor_head')	}, td4); // 実行者
	if(td5){
		dojo.create('div', { innerHTML: teasp.message.getLabel('comment_head')	}, td5); // コメント
	}

	this.createTable((this.args.apply && this.args.apply.steps) || []);

	return true;
};

/**
 * 承認履歴テーブル作成
 *
 * @param {Array.<Object>} steps 承認履歴データ
 */
teasp.dialog.Status.prototype.createTable = function(steps){
	var tbody = dojo.query('#dialogStatusTable table.emp_apply_steps_body > tbody')[0];
	dojo.empty(tbody);
	var reverseSteps = dojo.clone(steps).reverse();
	var stepCnt = Math.max(reverseSteps.length, 5);
	var n = reverseSteps.length;
	for(var i = 0 ; i < stepCnt ; i++){
		var step = (i < reverseSteps.length ? reverseSteps[i] : null);
		var cr1 = dojo.create('tr', { className: ((i%2) == 0 ? 'even' : 'odd') }, tbody);
		var cr2 = (teasp.isNarrow() ? dojo.create('tr', { className: ((i%2) == 0 ? 'even' : 'odd') }, tbody) : null);
		var td1 = null, td2 = null, td3 = null, td4 = null, td5 = null;
		if(!i && !step){
			td1 = dojo.create('td', {
				colspan:(teasp.isNarrow() ? '4' : '5'),
				style:"text-align:left;"
			}, cr1);
			dojo.create('div', {
				innerHTML:teasp.message.getLabel('tm10006010'), // 承認履歴はありません
				style:"margin:4px;"
			}, td1);
		}else{
			td1 = dojo.create('td', { className:'number'  }, cr1);
			td2 = dojo.create('td', { className:'datetime'}, cr1);
			td3 = dojo.create('td', { className:'status'  }, cr1);
			td4 = dojo.create('td', { className:'actor'   }, cr1);
			td5 = dojo.create('td', { className:'comment' }, cr2 || cr1);
			if(teasp.isNarrow()){
				dojo.attr(td1, 'rowSpan', '2');
				dojo.attr(td5, 'colSpan', '3');
			}
		}
		if(step){
			var v1 = n--;
			var v2 = (step.createdDateS || teasp.util.date.formatDateTime(step.createdDate, 'SLA-HM'));
			var v3 = teasp.constant.getDisplayStatus(step.stepStatus);
			var v4 = step.actorName;
			var v5 = teasp.util.entitize(step.comments || '', '');
			if(!this.args.showCancelComment 						  // ※ 引数で showCancelComment=true が指定されていたら、取り消しコメントを表示する（2015.9.25）
			&& teasp.constant.STATUS_CANCELS.contains(step.stepStatus)){ // 申請取消、確定取消の場合はコメント欄を強制で空にする（申請時のコメントが表示されてしまうため）。
				v5 = '';
			}
			dojo.create('div', { innerHTML: v1 }, td1);
			dojo.create('div', { innerHTML: v2 }, td2);
			dojo.create('div', { innerHTML: v3 }, td3);
			dojo.create('div', { innerHTML: v4 }, td4);
			dojo.create('div', { innerHTML: v5 }, td5);
			if(!v5){
				dojo.style(td5, 'height', '1px');
			}
		}else if(td5){
			dojo.style(td5, 'height', '1px');
		}
	}
	setTimeout(function(){
		var tbody = dojo.query('#dialogStatusTable table.emp_apply_steps_body > tbody')[0];
		var h = tbody.offsetHeight;
		if(!teasp.isNarrow() && h > 105){
			dojo.style('dialogStatusDiv', 'height', Math.min(h, 200) + 'px');
		}
	}, 100);
};

/**
 * 取消ボタンのセット
 *
 * @param {boolean} flag true:取消ボタン活性
 */
teasp.dialog.Status.prototype.setRemoveButton = function(flag){
	var btnLabel = teasp.message.getLabel('cancelFix_btn_title'); // 確定取消
	if(this.args.removeButtonType == 1){
		btnLabel = teasp.message.getLabel('cancelApply_btn_title'); // 申請取消
	}else if(this.args.removeButtonType == 2){
		btnLabel = teasp.message.getLabel('tk10000741'); // 承認取消
	}else if(this.args.removeButtonType == 3){
		btnLabel = teasp.message.getLabel('retractApply_label'); // 申請取下
	}else if(this.args.removeButtonType == 4){
		btnLabel = teasp.message.getLabel('cancelFix_btn_title'); // 確定取消
	}
	var removeBtn = dojo.byId('dialogStatusRemove');
	removeBtn.className = 'red-button1' + (flag ? '' : '-disabled');
	removeBtn.firstChild.innerHTML = btnLabel;

	if(flag){
		var that = this;
		this.removeHandle = dojo.connect(dojo.byId('dialogStatusRemove'), 'onclick', this, function(){
			this.args.cancelApply.apply(this.thisObject, [
				this.args.apply,
				function(res){
					that.onfinishfunc(res);
					that.close();
				},
				function(event){
					teasp.message.alertError(event);
				}
			]);
		});
	}
};

/**
 * 取下げボタンのセット
 *
 */
teasp.dialog.Status.prototype.setUnknotButton = function(){
	var removeBtn = dojo.byId('dialogStatusRemove');
	removeBtn.className = 'red-button1';
	removeBtn.firstChild.innerHTML = teasp.message.getLabel('retractApply_label'); // 申請取下

	var that = this;
	this.removeHandle = dojo.connect(dojo.byId('dialogStatusRemove'), 'onclick', this, function(){
		this.args.cancelApply.apply(this.thisObject, [
			this.args.apply,
			function(res){
				that.onfinishfunc(res);
				that.close();
			},
			function(event){
				teasp.message.alertError(event);
			}
		]);
	});
};
