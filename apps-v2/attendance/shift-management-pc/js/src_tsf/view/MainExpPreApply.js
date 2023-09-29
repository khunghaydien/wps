/**
 * 事前申請メイン画面
 *
 * @constructor
 */
teasp.Tsf.MainExpPreApply = function(){
    this.titleCss = 'exp-pre-apply';
};

teasp.Tsf.MainExpPreApply.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainExpPreApply.prototype.init = function(){
    teasp.Tsf.MainBase.prototype.init.call(this);

    // J'sNAVIリンクボタン
    var d = teasp.Tsf.Dom.node('.ts-top-button2');
    if(d && tsfManager.isUsingJsNaviSystem()){
        if(tsfManager.isUseJsNaviDummy()){
            this.getDomHelper().connect(d, 'onclick', this, function(e){
                window.open(teasp.getPageUrl('timeSheetView') + '?support=jtb'
                        + '&z=' + (new Date()).getTime() // キャッシュされないための措置
                        + '#!menu',
                        'jsNaviDummy', 'width=800,height=750,resizable=yes,scrollbars=yes');
            });
            var bd = dojo.query('div', d)[0];
            bd.innerHTML = 'JsNAVI Dummy';
            dojo.style(bd, 'color', 'white');
            dojo.style(bd, 'font-weight', 'bold');
            dojo.style(d, 'cursor', 'pointer');
        }

    	//if(tsfManager.isUsingJsNaviSystem()){
        //	this.getDomHelper().connect(d, 'onclick', this, function(e){
        //		this.openJsNavi();
        //	});
    	//	teasp.Tsf.Dom.toggleClass(d, 'ts-top-button-jtb', true );
    	//	teasp.Tsf.Dom.toggleClass(d, 'ts-top-button2'   , false);

    	//}
    }
};

/**
 * J'sNAVI画面を開く
 */
teasp.Tsf.MainExpPreApply.prototype.openJsNavi = function (){
	var req = {
			method: 'getJsNaviParameter',
			empId : tsfManager.getEmpId(),
			proxyEmpId : tsfManager.getSessionEmpId()
		};

	// JTB送信用フォーム作成
	var form;
	if(!teasp.Tsf.Dom.node(document.jtbform)){
		form = document.createElement("form");
		form.setAttribute("method", "post");
		form.name="jtbform";
		form.style.display = "none";
		document.body.appendChild(form);

		dojo.create('input', {type: 'text', name:'TCKOPERATIONMODE', value:''}, form);
		dojo.create('input', {type: 'text', name:'action', value:''}, form);
		dojo.create('input', {type: 'text', name:'EbbaKey', value:''}, form);
		dojo.create('input', {type: 'text', name:'ENCRYPTMODE', value:''}, form);
		dojo.create('input', {type: 'text', name:'LOCATIONCODE', value:''}, form);
		dojo.create('input', {type: 'text', name:'LOCATIONPASSWORD', value:''}, form);
		dojo.create('input', {type: 'text', name:'USERID', value:''}, form);
		dojo.create('input', {type: 'text', name:'USERPASSWORD', value:''}, form);
		dojo.create('input', {type: 'text', name:'DRIUSERID', value:''}, form);
		dojo.create('input', {type: 'text', name:'OPERATIONNUMBER', value:''}, form);
		dojo.create('input', {type: 'text', name:'SUBNUMBER', value:''}, form);
		dojo.create('input', {type: 'text', name:'BUSINESSNAME', value:''}, form);
		dojo.create('input', {type: 'text', name:'PAYINGCCCD', value:''}, form);
		dojo.create('input', {type: 'text', name:'TRIPSTARTDAY', value:''}, form);
		dojo.create('input', {type: 'text', name:'TRIPENDDAY', value:''}, form);
		for(i=1; i <= 16; i++){
			dojo.create('input', {type: 'text', name:'MEMO' + i, value:''}, form);
		}
	}

	tsfManager.jtbAction(req, teasp.Tsf.Dom.hitch(this, function(succeed, result){
		if(succeed){
			document.jtbform.TCKOPERATIONMODE.value = "2";	// メインメニュー
			document.jtbform.action = result.mainUrl;
			document.jtbform.EbbaKey.value = result.EbbaKey;
			document.jtbform.ENCRYPTMODE.value = result.ENCRYPTMODE;
			document.jtbform.LOCATIONCODE.value = result.LOCATIONCODE;
			document.jtbform.LOCATIONPASSWORD.value = result.LOCATIONPASSWORD;
			document.jtbform.USERID.value = result.USERID;
			document.jtbform.USERPASSWORD.value = result.USERPASSWORD;
			// 代理ユーザー
			if(result.DRIUSERID){
				document.jtbform.DRIUSERID.value = result.DRIUSERID;
			}
			teasp.Tsf.SectionJtb.jtbOpen();
			if(form){
				dojo.destroy(form);
			}
		}else{
			teasp.Tsf.Error.showError(result);
			if(form){
				dojo.destroy(form);
			}
		}
	}));

};

/**
 * 新規作成選択時のポップアップメニュー情報
 *
 * @returns {Array.<Object>}
 */
teasp.Tsf.MainExpPreApply.prototype.getViewConfig = function(){
    return tsfManager.getInfo().getExpPreApplyConfigs().views;
};

teasp.Tsf.MainExpPreApply.prototype.initEnd = function(areaEl){
    teasp.Tsf.Dom.html('div.main-title', teasp.Tsf.Dom.byId('expTopView'), teasp.message.getLabel('tk10004031')); // 事前申請
    teasp.Tsf.Dom.html('div.sub-title' , teasp.Tsf.Dom.byId('expTopView'), teasp.message.getLabel('tf10004590')); // 事前申請(英語)

    // 一覧へ戻る
    this.domHelper.connect(teasp.Tsf.Dom.node('.ts-form-control .ts-form-back > button'), 'onclick', this, function(){

    	// J'sNAVIの明細が存在する場合は情報をクリアする
    	if(tsfManager.isUsingJsNaviSystem() && tsfManager.getInfo().objects){
    		for(var i = 0; i < tsfManager.getInfo().objects.length; i++){
    			var expPreApply = tsfManager.getInfo().objects[i];
    			if(expPreApply.obj && expPreApply.obj.ExpJsNavi__r){
    				expPreApply.obj.ExpJsNavi__r = null;
    			}
    		}
    	}

        if(tsfManager.checkDiff()){
            teasp.tsConfirm(teasp.message.getLabel('tf10001600'),this,function(result){// 編集中のデータを破棄して一覧へ戻ります。よろしいですか？
				if(result){
					tsfManager.backToList();
				}
			});
        }else{
			tsfManager.backToList();
		}
    });

    // 削除
    this.domHelper.connect(teasp.Tsf.Dom.query('.ts-form-control .ts-form-delete > button'), 'onclick', this, function(e){

    	// J'sNAVIの明細が存在する場合は削除しない
    	if(tsfManager.isUsingJsNaviSystem() && tsfManager.getInfo().objects){
    		for(var i = 0; i < tsfManager.getInfo().objects.length; i++){
    			var expPreApply = tsfManager.getInfo().objects[i];
    			if(expPreApply.obj && expPreApply.obj.ExpJsNavi__r){
    				if(expPreApply.obj.ExpJsNavi__r.length > 0){
    					// 出張手配の明細がある場合は削除できません。\n
    					// 出張手配側で削除して同期をとるか、予約連携から連携を解除してください。
    					teasp.tsAlert(teasp.message.getLabel('jt12000100'));
						return;
    				}
    			}
    		}
    	}

        teasp.tsConfirm(teasp.message.getLabel('tf10001910'),this,function(result){// 申請を削除します。よろしいですか？
			if(result){
				tsfManager.deleteExpPreApply(teasp.Tsf.Dom.hitch(this, function(succeed, result){
					if(succeed){
						console.log(result);
						tsfManager.changeView();
					}else{
						teasp.Tsf.Error.showError(result);
					}
				}));
			}
		});
    });
};

teasp.Tsf.MainExpPreApply.prototype.openEmpTable = function(){
    var url = teasp.getPageUrl('deptRefView') + '?type=ExpPre&empId=' + tsfManager.getSessionEmpId() + '&deptId=' + tsfManager.getSessionDeptId();
    if(teasp.isSforce1()){
        sforce.one.navigateToURL(url);
    }else{
        var wh = window.open(url, 'empTable', 'width=690,height=340,resizable=yes,scrollbars=yes');
        if(wh){
            wh.focus();
        }
    }
};
