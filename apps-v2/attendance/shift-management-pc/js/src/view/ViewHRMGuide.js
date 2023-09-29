teasp.provide('teasp.view.HRMGuide');
/**
 * TSHRM用社員情報変更ナビ
 * @constructor
 * @extends {teasp.view.Base}
 */
teasp.view.HRMGuide = function(){
	this.isEmpInfoLoaded = false; // 社員情報の取得を行ったかどうか
};

teasp.view.HRMGuide.prototype = new teasp.view.Base();

/**
 * 画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function} onSuccess 正常受信時の処理
 * @param {Function} onFailure 異常受信時の処理
 */
teasp.view.HRMGuide.prototype.init = function(messageMap, onSuccess, onFailure){
	teasp.message.mergeLabels(globalMessages || {});
	teasp.message.mergeLabels(messageMap ? (messageMap[teasp.message.getLanguageLocaleKey()] || {}) : {});

	this.readParams();

	this.languageKey =
		teasp.message.getLanguageLocaleKey() === 'ja'
		|| teasp.message.getLanguageLocaleKey() === 'ja_JP'
		? 'ja_JP' : 'en_US';

	// 印刷用画面か
	if (this.printView) {
		// 印刷用提出資料一覧画面を表示
		this.buildResultPrint();
	}
	else {
		// 諸届ナビ一覧を作成
		this.buildNaviList(onSuccess, onFailure);
	}
};
/**
 * 印刷画面初期化
 *
 * @param {Object} messageMap メッセージテーブル
 * @param {Function} onSuccess 正常受信時の処理
 * @param {Function} onFailure 異常受信時の処理
 */
teasp.view.HRMGuide.prototype.printInit = function(messageMap, onSuccess, onFailure){
	// 印刷用画面として設定
	this.printView = true;
	this.init(messageMap, onSuccess, onFailure);
};
/**
 * 諸届ナビ一覧を作成
 */
teasp.view.HRMGuide.prototype.buildNaviList = function(onSuccess, onFailure){
	teasp.util.fadeInOut(false, { node:'hrmGuideSubmission' });

	dojo.connect(dojo.byId('hrmGuideBackMenu'), 'onclick', this, function(){
		this.changeView('EVENTS');
	});

// サーバへリクエスト送信
	teasp.manager.request(
		'loadHRMGuide',
		this.viewParams,
		this.pouch,
		{ hideBusy : false },
		this,
		function(result){
			this.initMenuBar();
			this.initNaviGroup(result.naviGroups);
			onSuccess();
		},
		function(event){
			onFailure(event);
		}
	);
};

/**
 * 画面上部のメニュー表示を作成
 */
teasp.view.HRMGuide.prototype.initMenuBar = function(){
    var empInfoTbl = dojo.query('#expTopView td.ts-top-empinfo table');
    var empInfoCols = [
         teasp.message.getLabel('dept_label'),        // 部署
         null,
         teasp.message.getLabel('empType_label'),     // 勤務体系
         teasp.message.getLabel('empName_label')      // 社員名
    ];

    // タイトル
    dojo.query('td.ts-top-title > div.main-title').forEach(function(elem){
		elem.innerHTML = teasp.message.getLabel('hr10010000');
    }, this);
    dojo.query('td.ts-top-title > div.sub-title').forEach(function(elem){
		elem.innerHTML = 'HR Process Navigator';
    }, this);

    var colX = 0;
    dojo.query('td.ts-top-info-l > div', empInfoTbl[0]).forEach(function(el){
        el.innerHTML = empInfoCols[colX++] || '';
    });

    var pDiv = dojo.query('#expTopView td.ts-top-photo > div')[0];
    var photoUrl = this.pouch.getSmallPhotoUrl();
    if(photoUrl){
        dojo.create('img', {
            src       : photoUrl,
            className : 'smallPhoto'
        }, pDiv);
    }else{
        dojo.create('img', {
            className : 'pp_base pp_default_photo'
        }, pDiv);
    }

    var helpLinks = dojo.query('td.ts-top-button3 > a', dojo.byId('expTopView'));
    if(helpLinks.length > 0){
        helpLinks[0].href = this.pouch.getHelpLink();
    }

    dojo.byId('empTypeName').innerHTML      = this.pouch.getEmpTypeName();
    dojo.byId('department').innerHTML       = this.pouch.getDeptName();
    dojo.byId('empName').innerHTML          = this.pouch.getName();
};

teasp.view.HRMGuide.prototype.initNaviGroup = function(naviGroups){
	if (!naviGroups || !naviGroups.length) {
		teasp.tsAlert(teasp.message.getLabel('hr10010005')); // 諸届ナビイベントが何も設定されていません。
		return;
	}
	this.naviManager = new teasp.hrm.HrmNaviManager(naviGroups);

	// グループが1つしかない場合は直接イベント一覧へ
	if(this.naviManager.isSingleGroup()){
		var singleGroup = this.naviManager.getGroups()[0];
		this.fetchNaviEvents(singleGroup)
			.then(function (fetchedGroup) {
				this.initNavi(fetchedGroup);
			}.bind(this));
		return;
	}

	var pdiv = dojo.byId('hrmGuideGroups');
	dojo.create('p', { innerHTML: teasp.message.getLabel('hr10012000') }, pdiv);

	var ol = dojo.create('ol', null, pdiv);

	// ボタンを配置
	dojo.forEach(this.naviManager.getGroups(), function (group, index) {
		dojo.create('button', {
			textContent: group.getName(),
			title: group.getName(),
			groupId: group.getId() || 'noGroup' // TemNaviGroup__c.Id をセット
		}, dojo.create('li', null, ol));
	}, this);

	// ボタンのイベントハンドラをセット
	dojo.query('button', ol).forEach(function (el) {
		dojo.connect(el, 'onclick', this, function (e) {
			var groupId = dojo.attr(e.target, 'groupId'); // TemNavi__c.Id を得る
			if(groupId === 'noGroup'){
				groupId = null;
			}

			var group = this.naviManager.getGroupById(groupId); // teasp.hrm.HrmNavi インスタンスを得る
			var events = group.getEvents();
			if(events && events.length){
				this.initNavi(group);
			} else {
				// グループIDを指定してイベントを取得
				this.fetchNaviEvents(group)
				    .then(function(fetchedGroup){
						this.initNavi(fetchedGroup);
					}.bind(this));
			}
		});
	}, this);
};

// グループIDを指定してイベントを取得
teasp.view.HRMGuide.prototype.fetchNaviEvents = function(group){
	var deferred = new dojo.Deferred();
	teasp.manager.request(
		'loadHRMNaviEvents',
		group.getId(),
		this.pouch,
		{ hideBusy: false },
		this,
		function (result) {
			group.setEvents(result.naviEvents);
			deferred.resolve(group);
		}.bind(this),
		function (result) {
			teasp.message.alertError(result);
			deferred.reject();
		}
	);
	return deferred.promise;
}

/**
 * 手続一覧を表示
 */
teasp.view.HRMGuide.prototype.initNavi = function(group){
	var pdiv = dojo.byId('hrmGuideEvents');
	dojo.empty(pdiv);

	if(!this.naviManager.isSingleGroup()){
		// グループ一覧に戻るボタン
		var backButton = dojo.create('button', { innerHTML: teasp.message.getLabel('hr10012010') }, pdiv);
		dojo.connect(backButton, 'onclick', this, function (e) {
			this.changeView('GROUPS');
		}, this);
	}

	// グループ名を表示(グループ指定なし以外)
	if(group.getId() !== null){
		dojo.create('h2', { innerHTML: group.getName() }, pdiv);
	}

	dojo.create('p', { innerHTML: teasp.message.getLabel('hr10010001') }, pdiv);

	var ol = dojo.create('ol', null, pdiv);

	// ボタンを配置
	dojo.forEach(group.getEvents(), function(naviEvent, index){
		dojo.create('button', {
			className:'white-button',
			innerHTML: (index + 1) + '. ' + teasp.util.entitize(naviEvent.getName()),
			naviEventId: naviEvent.getId() // TemNavi__c.Id をセット
		}, dojo.create('li', null, ol));
	}, this);
	// ボタンのイベントハンドラをセット
	dojo.query('button', ol).forEach(function(el){
		dojo.connect(el, 'onclick', this, function(e){
			var naviEventId = dojo.attr(e.target, 'naviEventId'); // TemNavi__c.Id を得る
			var naviEvent = group.getEventById(naviEventId); // teasp.hrm.HrmNavi インスタンスを得る
			this.selectedEvent = naviEvent;
			// ダイアログ（DlgHRMGuide）を開く
			teasp.manager.dialogOpen(
				'HRMGuide',
				{ navi: naviEvent },
				this.pouch,
				this,
				function(naviId, questionList){
					this.sendAnswers(naviId, questionList);
				}
			);
		});
	}, this);

	this.changeView('EVENTS');
};

/**
 * グループ一覧⇔イベント一覧⇔提出書類一覧 画面切り替え
 * @param viewType (グループ一覧='GROUPS', イベント一覧='EVENTS', 提出書類一覧='SUBMISSIONS')
 */
teasp.view.HRMGuide.prototype.changeView = function(viewType){
	var showsGroupList = false;
	var showsEventList = false;
	var showsSubmissionList = false;
	switch (viewType) {
		case 'EVENTS':
			showsEventList = true;
			break;
		case 'SUBMISSIONS':
			showsSubmissionList = true;
			break;
		case 'GROUPS':
		default:
			showsGroupList = true;
		break;
	}
	// 表示/非表示
	dojo.style('hrmGuideGroups', 'display', (showsGroupList ? '' : 'none'));
	dojo.style('hrmGuideEvents', 'display', (showsEventList ? '' : 'none'));
	dojo.style('hrmGuideSubmission', 'display', (showsSubmissionList ? '' : 'none'));

	// フェード
	teasp.util.fadeInOut(showsGroupList, { node: 'hrmGuideGroups' });
	teasp.util.fadeInOut(showsEventList, { node: 'hrmGuideEvents' });
	teasp.util.fadeInOut(showsSubmissionList, { node: 'hrmGuideSubmission' });
};

teasp.view.HRMGuide.prototype.sendAnswers = function(naviId, questionList){
	this.questionList = questionList;
	var answerIdList = [];
	this.questionList.forEach(function(question){
		answerIdList.push(question.selected.getId());
	});

	// サーバへ回答を送信 & 提出書類一覧を受け取る
	teasp.manager.request(
		'saveAnswersHRMGuide',
		{
			naviId : naviId,
			answerIdList : answerIdList
		},
		this.pouch,
		{ hideBusy: false },
		this,
		function (result) {
			this.submissions = result.submissions;
			this.buildSubmissionForm(this.submissions);
			this.changeView('SUBMISSIONS');
		}.bind(this),
		function (event) {
			teasp.message.alertError(event);
		}
	);
}

/**
 * 印刷用画面を作成
 */
teasp.view.HRMGuide.prototype.buildResultPrint = function() {
	// 提出資料一覧の情報を取得する
	var resultData = this.getResultData();
	if (!resultData) {
		// 必要な作業情報が取得できませんでした。 再度開いてください。
		teasp.message.alertError(teasp.message.getLabel('hr10011100'));
		window.close();
		return false;
	}

	// 印刷を実行
    dojo.byId('naviPrint').firstChild.innerHTML = teasp.message.getLabel('printOut_btn_title'); // プリンタへ出力
	dojo.style(dojo.byId('naviPrint'), 'display', '');
	dojo.connect(dojo.byId('naviPrint'), 'onclick', function(){
        window.print();
        return false;
    });
    // ウィンドウを閉じる
    dojo.byId('naviClose').firstChild.innerHTML = teasp.message.getLabel('close_btn_title'); // 閉じる
	dojo.style(dojo.byId('naviClose'), 'display', '');
	dojo.connect(dojo.byId('naviClose'), 'onclick', function(){
        (window.open('','_top').opener=top).close();
        return false;
	});

	// 社員情報を表示する
	this.initEmpInfo(resultData.empInfo);

	// 手続名を設定
	dojo.byId('hrmGuideProcedures').innerHTML = (teasp.message.getLabel('hr10011110') + ':' + resultData.selectedEvent.getName());

	// 提出資料一覧を表示
	this.buildSubmissionForm(resultData.submissionList);
	// 選択した選択リストを表示
	this.buildQuestionSelect(resultData.questionList);

	// 処理後に表示
	dojo.style(dojo.byId('hrmGuidePrint'), 'display', '');
};
/**
 * 提出資料一覧の情報を取得
 */
teasp.view.HRMGuide.prototype.getResultData = function(){
	var parentObj;
	try{
		parentObj = window.opener && window.opener.teasp;
	} catch(e){
		// 親ウィンドウのドメインが異なる場合にerrorとなる
		console.log('security error', e);
		return null;
	}

	// 元ウィンドウが表示されているか
	if(parentObj && parentObj.viewPoint && parentObj.viewPoint.generateResultData){
		var resultData = parentObj.viewPoint.generateResultData();
		// 返却値があるか
		if (resultData.submissionList && resultData.submissionList.length) {
			// 提出資料一覧情報を返す
			return resultData;
		}
	}
	return null;
};
/**
 * 提出資料一覧の情報を作成
 */
teasp.view.HRMGuide.prototype.generateResultData = function(){
	var resultData = {};
	// 社員情報を格納
	resultData.empInfo = {};
	resultData.empInfo.department = this.pouch.getDeptName();
	resultData.empInfo.empTypeName = this.pouch.getEmpTypeName();
	resultData.empInfo.empCode = this.pouch.getEmpCode();
	resultData.empInfo.empName = this.pouch.getName();
	// 選択手続情報を格納
	resultData.selectedEvent = this.selectedEvent;
	// 提出資料一覧を格納
	resultData.submissionList = this.submissions;
	// 選択リスト一覧を格納
	resultData.questionList = this.questionList;

	return resultData;
};
/**
 * 画面上部の社員情報表示を作成
 */
teasp.view.HRMGuide.prototype.initEmpInfo = function(empInfo){
    var empInfoTbl = dojo.query('#tsfArea #emp #empInfo');
    var empInfoCols = [
         teasp.message.getLabel('dept_label'),        // 部署
         teasp.message.getLabel('empType_label'),     // 勤務体系
         teasp.message.getLabel('empCode_label'),     // 社員コード
         teasp.message.getLabel('empName_label')      // 社員名
    ];

    var colX = 0;
    dojo.query('thead th > div', empInfoTbl[0]).forEach(function(el){
        el.innerHTML = empInfoCols[colX++] || '';
    });

    dojo.byId('department').innerHTML       = empInfo.department;
    dojo.byId('empTypeName').innerHTML      = empInfo.empTypeName;
    dojo.byId('empCode').innerHTML          = empInfo.empCode;
    dojo.byId('empName').innerHTML          = empInfo.empName;
};
/**
 * 提出リスト画面作成
 * @param answerIdList List<TemNaviQuestionSelect__c.Id> (HRMのAPIに送信する)
 */
teasp.view.HRMGuide.prototype.buildSubmissionForm = function(submissionList){
	// モックデータ
	// var submissionList = [
	// 	{
	// 		'type': '社員情報変更申請',
	// 		'name': {
	// 			'ja_JP': '氏名を変更する',
	// 			'en_US': 'Change your name'
	// 		},
	// 		'foreignKey': '3',
	// 		'remarks': {
	// 			'ja_JP': '',
	// 			'en_US': ''
	// 		}
	// 	},
	// 	{
	// 		'type': '社員情報変更申請',
	// 		'name': {
	// 			'ja_JP': '住所を変更する',
	// 			'en_US': 'Change your address'
	// 		},
	// 		'foreignKey': '2',
	// 		'remarks': {
	// 			'ja_JP': '',
	// 			'en_US': ''
	// 		}
	// 	},
	// 	{
	// 		'type': '社員情報変更申請',
	// 		'name': {
	// 			'ja_JP': '家族情報を登録する',
	// 			'en_US': 'Add your family'
	// 		},
	// 		'foreignKey': '8',
	// 		'remarks': {
	// 			'ja_JP': '',
	// 			'en_US': ''
	// 		}
	// 	},
	// 	{
	// 		'type': 'ファイルダウンロード',
	// 		'name': {
	// 			'ja_JP': '住所変更届（PDF）',
	// 			'en_US': 'Notification report of changing address'
	// 		},
	// 		'url': 'http://www.teamspirit.co.jp/',
	// 		'remarks': {
	// 			'ja_JP': '人事部に提出してください。',
	// 			'en_US': 'Print and submit one to HR Department.'
	// 		}
	// 	},
	// 	{
	// 		'type': '稟議',
	// 		'name': {
	// 			'ja_JP': '社宅申請',
	// 			'en_US': 'Request of Company dormitory'
	// 		},
	// 		'remarks': {
	// 			'ja_JP': '稟議タブをクリックし、種別から「社宅申請」を選択してください。',
	// 			'en_US': 'Choose "Company dormitory" as the type of approvals.'
	// 		}
	// 	},
	// 	{
	// 		'type': 'その他',
	// 		'name': {
	// 			'ja_JP': 'その他申請1',
	// 			'en_US': 'other request 1'
	// 		},
	// 		'remarks': {
	// 			'ja_JP': 'その他申請です。',
	// 			'en_US': 'other type of request'
	// 		}
	// 	},
	// 	{
	// 		'type': 'その他',
	// 		'name': {
	// 			'ja_JP': 'その他申請2',
	// 			'en_US': 'other request 2'
	// 		},
	// 		'remarks': {
	// 			'ja_JP': '',
	// 			'en_US': ''
	// 		}
	// 	}
	// ];

	dojo.query('#hrmGuideBackMenu').forEach(function(obj) {
		obj.value = teasp.message.getLabel('hr10010030'); // 戻るボタン
	});
	dojo.query('#hrmGuideSubmission .hrm-guide-preview input').forEach(function(obj) {
		obj.value = teasp.message.getLabel('hr10010020'); // 印刷プレビューボタン
	});

	var tbody = dojo.query('#hrmGuideSubmissionTable tbody')[0];
	dojo.empty(tbody);

	// thead
	var index = 0;
	dojo.query('#hrmGuideSubmissionTable thead th')[index++].innerHTML = teasp.message.getLabel('hr10010080');
	// 印刷用画面の場合、チェックボックスが入るためパス
	if (this.printView) {
		index++;
	}
	dojo.query('#hrmGuideSubmissionTable thead th')[index++].innerHTML = teasp.message.getLabel('hr10010090');
	dojo.query('#hrmGuideSubmissionTable thead th')[index++].innerHTML = teasp.message.getLabel('hr10010100');

	if( !submissionList || !submissionList.length ){
		// 必要な手続はありません
		dojo.byId('hrmGuideInstruction').innerHTML = teasp.message.getLabel('hr10010015');
		// 提出書類一覧テーブル非表示
		dojo.style(dojo.byId('hrmGuideSubmissionTable'), 'display', 'none');
		// 印刷プレビューボタン非表示
		dojo.style(dojo.query('#hrmGuideSubmission .hrm-guide-preview input')[0], 'display', 'none');
		return;
	}

	// 以下の手続を行ってください
	dojo.byId('hrmGuideInstruction').innerHTML = teasp.message.getLabel('hr10010010');
	// 提出書類一覧テーブルを表示
	dojo.style(dojo.byId('hrmGuideSubmissionTable'), 'display', '');
	// 印刷プレビューボタンを表示
	dojo.query('#hrmGuideSubmission .hrm-guide-preview input').forEach(function(obj) {
		dojo.style(obj, 'display', '');
		dojo.connect(obj, 'onclick', this, this.openPrint);
	}.bind(this));

	var submissionsPerType = {
		'社員情報変更申請':[],
		'ファイルダウンロード':[],
		'稟議':[],
		'その他':[]
	};
	submissionList.forEach(function(submission){
		var submissionType = submission.type || 'その他';
		submissionsPerType[submissionType].push(submission);
	});

	var lang = this.languageKey;
	['社員情報変更申請', 'ファイルダウンロード', '稟議', 'その他'].forEach(function(type){
		if (submissionsPerType[type].length > 0 ){
			var firstTr = dojo.create('tr', null, tbody);

			var typeName = '';
			switch (type) {
				case '社員情報変更申請':
					typeName = teasp.message.getLabel('hr10011010');
					break;
				case 'ファイルダウンロード':
					typeName = teasp.message.getLabel('hr10011020');
					break;
				case '稟議':
					typeName = teasp.message.getLabel('hr10011030');
					break;
				default:
					typeName = teasp.message.getLabel('hr10011040');
			}

			// グループごとに格納
			var typeTd = dojo.create('td', {
				rowSpan: submissionsPerType[type].length,
				className: "hrm-guide-category",
				innerHTML: typeName
			}, firstTr);

			// リンク生成
			submissionsPerType[type].forEach(function(submission, index){
				var tr = index === 0 ? firstTr : dojo.create('tr', null, tbody);
				// 印刷用画面の場合、チェックボックスを入れる
				if (this.printView) {
					var checktd = dojo.create('td', { className: "hrm-guide-check" }, tr);
					var labelObj = dojo.create('label', null, checktd);
					dojo.create('input', { type: "checkbox" }, labelObj);
					dojo.create('span', null, labelObj);
				}
				var td = dojo.create('td', { className: "hrm-guide-item" }, tr);
				// 提出資料一覧画面の場合、リンクで表示させる
				var submissionName = (submission.name[lang] || submission.name['ja_JP']);
				if (!this.printView) {
					switch (type) {
						case '社員情報変更申請':
							if(submission.foreignKey){
								var changeEmpLink = dojo.create('a', {
									href: "javascript:void(0)",
									innerHTML: submissionName,
									changeEmpForeignKey: submission.foreignKey
								}, td);

								dojo.connect(changeEmpLink, 'onclick', this, function(e){
									var foreignKey = dojo.attr(e.target, 'changeEmpForeignKey');
									this.showChangeEmployeeDialog(foreignKey);
								});
							} else {
								td.innerHTML = submissionName;
							}
							break;
						case 'ファイルダウンロード':
						case '稟議':
							if(submission.url){
								dojo.create('a', { href: submission.url, target: "_blank", innerHTML: submissionName }, td);
							} else {
								td.innerHTML = submissionName;
							}
							break;
						default:
							td.innerHTML = submissionName;
					}
				}
				else {
					td.innerHTML = submissionName;
				}
				dojo.create('td', { className: "hrm-guide-remarks", innerHTML: (submission.remarks[lang] || submission.remarks['ja_JP'] || '') }, tr);
			}.bind(this));
		}
	}.bind(this));
};

/**
 * 申請種類を指定して社員情報変更申請画面を呼び出す
 * @param {string} firstForeignKey 申請種類を表す外部キー(文字列型なので注意)
 */
teasp.view.HRMGuide.prototype.showChangeEmployeeDialog = function(firstForeignKey){
	(function(){
		var deferred = new dojo.Deferred();

		if( this.isEmpInfoLoaded ){
			// APIコール数節約のため、最初の1回以外は社員情報取得を行わない
			deferred.resolve();
		} else {
			// 社員情報を取得
			teasp.manager.request(
				'loadHRMEmployee',
				this.viewParams,
				this.pouch,
				{ hideBusy: false },
				this,
				function () {
					this.isEmpInfoLoaded = true;
					deferred.resolve();
				}.bind(this),
				function (event) {
					teasp.message.alertError(event);
					deferred.reject();
				}.bind(this)
			);
		}
		return deferred.promise;
	}.bind(this))().then(
		function(){
			// 社員情報変更申請ダイアログを開く
			teasp.manager.dialogOpen(
				'ChangeHRMEmp',
				{
					client: teasp.constant.APPLY_CLIENT_CHANGE_HRM_EMP,
					firstForeignKey: firstForeignKey
				},
				this.pouch,
				this,
				function () {
				}
			);
		}.bind(this)
	);
};
/**
 * 提出リスト印刷画面表示
 */
teasp.view.HRMGuide.prototype.openPrint = function(){
    var h = (screen.availHeight || 800);
    if(h > 800){
        h = 800;
    }
    var wh = window.open(teasp.getPageUrl('guidePrintView'), 'print', 'width=700,height=' + h + ',resizable=yes,scrollbars=yes');
    setTimeout(function(){ wh.resizeTo(710, h); }, 100);
};
/**
 * 質問での選択リスト一覧を作成
 * @param questionList {Array} 選択された質問リスト
 */
teasp.view.HRMGuide.prototype.buildQuestionSelect = function(questionList) {
	// 質問 & 回答一覧は、質問がない場合は生成しない
	if (questionList.length > 0) {
		// 質問に対する回答項目
		dojo.byId('hrmGuideSelectedInstruction').innerHTML = teasp.message.getLabel('hr10011090');
		// table を生成
		var selectedTableObj = dojo.create('table', null, dojo.byId('hrmGuideSelectedTable'));
		// thead
		var thead = dojo.create('thead', null, selectedTableObj);
		dojo.create('th', { innerHTML: teasp.message.getLabel('hr10010110') }, thead); // 質問
		dojo.create('th', { innerHTML: teasp.message.getLabel('hr10010120') }, thead); // 回答

		var tbody = dojo.create('tbody', null, selectedTableObj);
		// 質問&回答一覧を生成
		for(var i = 0 ; i < questionList.length ; i++){
			var question = questionList[i];
			tr = dojo.create('tr', null, tbody);
			var questionLink = dojo.create('div', {
				innerHTML: '(' + ( i + 1 ) + ') ' + question.getName()
			}, dojo.create('td', null, tr));

			dojo.create('td', { innerHTML: question.getAnswer() || '' }, tr);
		}
	}
};
