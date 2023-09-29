teasp.provide('teasp.dialog.HRMGuide');
/**
 * TSHRM用社員情報変更ナビダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.HRMGuide = function(){
	this.widthHint = 588;
	this.heightHint = 334;
	this.id = 'dialogHRMGuide';
	this.title = '';
	this.duration = 1;
	this.content = '<table id="dlgHrmGuideTable"><tbody>' +
				'<tr>' +
					'<td class="hrm-guide-dlg-head">' +
						'<div id="dlgHrmGuideHead"></div>' +
					'</td>' +
					'<td class="hrm-guide-dlg-cancel">' +
						'<input type="button" class="gray-button" id="dlgHrmGuideCancel" />' +
					'</td>' +
				'</tr>' +
				'<tr>' +
					'<td colspan="2" class="hrm-guide-dlg-body">' +
						'<div>' +
							'<div id="dlgHrmGuideQuest">' +
								'<div class="hrm-guide-dlg-backlink">' +
									'<a href="#"></a>' +
								'</div>' +
								'<div class="hrm-guide-dlg-content">' +
									'<p></p>' +
								'</div>' +
								'<div class="hrm-guide-dlg-spc">' +
									'<p></p>' +
								'</div>' +
								'<div class="hrm-guide-dlg-select">' +
									'<ul id="dlgHrmGuideSelect"></ul>' +
								'</div>' +
							'</div>' +
							'<div id="dlgHrmGuideResult" style="display:none;">' +
								'<table><thead></thead><tbody></tbody></table>' +
							'</div>' +
						'</div>' +
					'</td>' +
				'</tr>' +
				'<tr id="dlgHrmGuideDone" style="display:none;">' +
					'<td colspan="2">' +
						'<div><input type="button" class="blue-button" id="dlgHrmGuideBuild" /></div>' +
					'</td>' +
				'</tr>' +
				'</tbody></table>';
};

teasp.dialog.HRMGuide.prototype = new teasp.dialog.Base();

/**
 * 画面生成
 *
 * @override
 */
teasp.dialog.HRMGuide.prototype.preStart = function(){
	dojo.query('.dijitDialogPaneContent', this.dialog.domNode).forEach(function(el){
		dojo.style(el, 'background', '#F0F0E1');
		dojo.style(el, 'padding', '16px 20px 20px 20px');
	});

	dojo.byId('dlgHrmGuideCancel').value = teasp.message.getLabel('hr10010060');
	dojo.byId('dlgHrmGuideBuild').value = teasp.message.getLabel('hr10010070');

	// ボタンクリックのイベント
	dojo.connect(dojo.byId('dlgHrmGuideCancel'), 'onclick', this, this.quitQuest);
	dojo.connect(dojo.byId('dlgHrmGuideBuild' ), 'onclick', this, this.finishQuest);
};

/**
 *
 * @override
 */
teasp.dialog.HRMGuide.prototype.preShow = function(){
	this.navi = this.args.navi;

	// 最初の質問が存在しない場合 -> 即座に結果画面に遷移
	if(this.navi.getNextQuestion(null) === null){
		this.finishQuest();
		return false; // ダイアログは開かない
	}

	this.question = null;
	this.questEvents = [];
	dojo.query(".dijitDialogTitleBar .dijitDialogTitle", this.id)[0].innerHTML = this.navi.getName();
	dojo.query(".dijitDialogTitleBar .dijitDialogCloseIcon", this.id)[0].title = teasp.message.getLabel('hr10010060');
	this.changeView(false);
	this.nextQuest();
	return true;
};

/**
 *
 * @override
 */
teasp.dialog.HRMGuide.prototype.postShow = function(){
};

/**
 * 質問ごとにイベントハンドラを解放
 */
teasp.dialog.HRMGuide.prototype.clearQuestEvents = function(){
	for(var i = 0 ; i < this.questEvents.length ; i++){
		dojo.disconnect(this.questEvents[i]);
	}
	this.questEvents = [];
};

/**
 * 次の質問を表示
 */
teasp.dialog.HRMGuide.prototype.nextQuest = function(){
	this.question = this.navi.getNextQuestion(this.question);
	console.log('this.navi', this.navi);
	console.log('this.question', this.question);
	if(!this.question){
		this.showResult();
	}else{
		this.setQuest();
		teasp.util.fadeInOut(true, { node:'dlgHrmGuideQuest' });
	}
};

/**
 * 前の質問を表示
 */
teasp.dialog.HRMGuide.prototype.prevQuest = function(){
	this.changeView(false);
	this.question = this.navi.getPrevQuestion();
	this.setQuest();
	teasp.util.fadeInOut(true, { node: 'dlgHrmGuideQuest' });
};

/**
 * 特定の質問を表示
 */
teasp.dialog.HRMGuide.prototype.backToQuest = function(index){
	this.changeView(false);
	this.question = this.navi.getAnsweredQuestion(index);
	this.setQuest();
	teasp.util.fadeInOut(true, { node: 'dlgHrmGuideQuest' });
};

/**
 * 質問の生成
 */
teasp.dialog.HRMGuide.prototype.setQuest = function(){
	// 質問
	dojo.query('.hrm-guide-dlg-content p', this.dialog.domNode)[0].textContent = this.question.getName();

	// 質問補足(改行を反映)
	dojo.query('.hrm-guide-dlg-spc p', this.dialog.domNode)[0].innerHTML
	    = teasp.util.entitize( this.question.getRemarks(), '' ).replace(/\n/g, '<br>');

	// 回答エリア
	var contentArea = dojo.query('.hrm-guide-dlg-content', this.dialog.domNode)[0];
	var ul = dojo.byId('dlgHrmGuideSelect');
	dojo.empty(ul);
	var selects = this.question.getSelects();

	// 選択肢を生成
	if(!selects.length){
		// 選択肢がない場合は「選択肢がありません」と表示
		dojo.create('li', { innerHTML: teasp.message.getLabel('hr10011060')}, ul);

		// 「ナビを終了する」ボタンを表示
		var closeBtn = dojo.create('button', {
			innerHTML: teasp.message.getLabel('hr10010065'),
			className: 'gray'
		}, dojo.create('li', null, ul));
		this.questEvents.push(dojo.connect(closeBtn, 'onclick', this, this.quitQuest));
	} else {
		for (var i = 0; i < selects.length; i++) {
			var select = selects[i];
			// 回答ボタン
			var btn = dojo.create('button', {
				innerHTML: select.getName(), // 回答
				selectId: select.getId() // 回答ID
			}, dojo.create('li', null, ul));
			// 回答ボタンのイベントハンドラ
			this.questEvents.push(dojo.connect(btn, 'onclick', this, this.setAnswer));
		}
	}

	// 前の質問に戻るリンク
	var backLink = dojo.query('.hrm-guide-dlg-backlink a', this.dialog.domNode)[0];
	if(this.navi.answerList.length){
		backLink.innerHTML = teasp.message.getLabel('hr10011080');
		dojo.style(backLink, 'display', '');
		this.questEvents.push(dojo.connect(backLink, 'onclick', this, function(){
			this.backToPreviousQuestion(false);
		}.bind(this)));
	} else {
		dojo.style(backLink, 'display', 'none');
	}

};

/**
 * 質問の回答をセット
 * @param {Object} e
 */
teasp.dialog.HRMGuide.prototype.setAnswer = function(e){
	var selectId = dojo.attr(e.target, 'selectId'); // 回答IDを取得
	if(selectId){
		this.question.setSelect(selectId);
	}
	// 次の質問へ
	this.clearQuestEvents();
	teasp.util.fadeInOut(false, {
		node:'dlgHrmGuideQuest',
		onEnd:dojo.hitch(this, this.nextQuest)
	});
};

/**
 * 質問画面から、1つ前の質問に戻る
 */
teasp.dialog.HRMGuide.prototype.backToPreviousQuestion = function () {
	this.clearQuestEvents();
	teasp.util.fadeInOut(false, {
		node: 'dlgHrmGuideQuest',
		onEnd: function () {
			this.prevQuest();
		}.bind(this)
	});
};

/**
 * 結果画面から、特定の質問まで戻る
 * @param {Integer} index 何問目に戻るか(starts from 1)
 */
teasp.dialog.HRMGuide.prototype.backToQuestion = function(index){
	this.clearQuestEvents();
	teasp.util.fadeInOut(false, {
		node: 'dlgHrmGuideResult',
		onEnd: function () {
			this.backToQuest(index);
		}.bind(this)
	});
};

/**
 * 表示の切り替え
 * @param {boolean} flag  =true:確認リスト  =false:質問
 */
teasp.dialog.HRMGuide.prototype.changeView = function(isFinished){
	dojo.style('dlgHrmGuideQuest' , 'display', (!isFinished ? '' : 'none'));
	dojo.style('dlgHrmGuideResult', 'display', (!isFinished ? 'none' : ''));
	dojo.style('dlgHrmGuideDone'  , 'display', (!isFinished ? 'none' : ''));
	if(isFinished){
		dojo.byId('dlgHrmGuideHead').innerHTML = teasp.message.getLabel('hr10010050');
	}else{
		dojo.byId('dlgHrmGuideHead').innerHTML = teasp.message.getLabel('hr10010040');
	}
	teasp.util.fadeInOut(isFinished, { node:'dlgHrmGuideResult' });
	teasp.util.fadeInOut(isFinished, { node:'dlgHrmGuideDone'   });
};

/**
 * 確認リストの生成
 */
teasp.dialog.HRMGuide.prototype.showResult = function(){
	var thead = dojo.query('#dlgHrmGuideResult thead')[0];
	var tbody = dojo.query('#dlgHrmGuideResult tbody')[0];
	dojo.empty(thead);
	dojo.empty(tbody);
	var tr = dojo.create('tr', null, thead);
	dojo.create('th', { innerHTML: teasp.message.getLabel('hr10010110') }, tr);
	dojo.create('th', { innerHTML: teasp.message.getLabel('hr10010120') }, tr);
	var answerList = this.navi.getAnswerList(); // 質問＆回答リスト

	// 質問&回答一覧を生成
	for(var i = 0 ; i < answerList.length ; i++){
		var question = answerList[i];
		tr = dojo.create('tr', null, tbody);
		var questionLink = dojo.create('a', {
			innerHTML: '(' + ( i + 1 ) + ') ' + question.getName(),
			href: '#',
			answerNumber: ( i + 1 )
		}, dojo.create('td', null, tr));

		// 各質問に戻るためのリンク
		this.questEvents.push(dojo.connect(questionLink, 'onclick', this, function (e) {
			var num = parseInt(dojo.attr(e.target, 'answerNumber'));
			this.backToQuestion( num );
		}));

		dojo.create('td', { innerHTML: question.getAnswer() || '' }, tr);
	}

	this.changeView(true);
};

teasp.dialog.HRMGuide.prototype.quitQuest = function(){
	this.clearQuestEvents();
	this.hide();
}

/**
 * 「回答を送信」ボタンが押された
 */
teasp.dialog.HRMGuide.prototype.finishQuest = function(){
	this.onfinishfunc(this.navi.getId(), this.navi.getAnswerList());
	this.quitQuest();
};
