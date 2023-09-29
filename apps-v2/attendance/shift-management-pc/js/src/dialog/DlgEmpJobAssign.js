teasp.provide('teasp.dialog.EmpJobAssign');
/**
 * ジョブアサインダイアログ
 *
 * @constructor
 * @extends {teasp.dialog.Base}
 */
teasp.dialog.EmpJobAssign = function(){
    this.widthHint = 820;
    this.heightHint = 440;
    this.id = 'dialogEmpJobAssign';
    this.title = teasp.message.getLabel('tm20003010');
    this.duration = 10;
    this.content = '<div id="empJobAssignRoot""></div>';
    this.id = 'empJobAssign';

    this.tc = null;
    this.jobMap = {};
    this.msgmap = {
        empJobLeftTable : { zeromsg: teasp.message.getLabel('tm20003020'),  nullmsg: teasp.message.getLabel('tm20003030')},
        empJobRightTable: { zeromsg: teasp.message.getLabel('tm20003040') }
    };
    this.eventHandles = [];
//    this.jobWorks;
//    this.scrollDiv;
//    this.classifyJobWorks;
};

teasp.dialog.EmpJobAssign.prototype = new teasp.dialog.Base();

teasp.dialog.EmpJobAssign.prototype.getLocalStorage = function(){
	return teasp.getLocalStorage('empJobAssignDialog');
};

teasp.dialog.EmpJobAssign.prototype.setLocalStorage = function(obj){
	teasp.setLocalStorage('empJobAssignDialog', obj);
};

/**
 * @override
 */
teasp.dialog.EmpJobAssign.prototype.preInit = function(){
    require(["dijit/layout/TabContainer", "dijit/layout/ContentPane"]);
};

/**
 * 画面生成
 * @override
 */
teasp.dialog.EmpJobAssign.prototype.preStart = function(){
    this.tc = new dijit.layout.TabContainer({
        id    : 'empJobAssignTab'
    }, "empJobAssignRoot");

    this.tc.addChild(new dijit.layout.ContentPane({
        id        : 'empJobAssignPane1',
        title     : teasp.message.getLabel('tm20003011'),
//        style     : 'overflow:hidden;',
        content   : '<table class="eja_frame" style="width:100%;"><tr><td style="vertical-align:top !important;"><table class="pane_table" style="width:100%;"><tbody><tr><td><table class="atk_r_table" style="width:100%;"><tr><td class="head" style="width: 21px;"><input type="checkbox" id="empJobRightCheck0" style="margin:4px;" /></td><td class="head" style="width:110px;"><div id="dlg_jobAssign_code_head"></div></td><td class="head" style="width:auto;"><div id="dlg_jobAssign_jobName_head"></div></td><td class="head" style="width:185px;"><div id="dlg_jobAssign_effortName"></div></td></tr></table></td></tr><tr style="height:1px;"><td></td></tr><tr><td><div class="atk_r_record_area" style="width:100%;" id="empJobRightDiv"><table class="atk_r_record_table" id="empJobRightTable" style="width:100%;"><tbody></tbody></table></div></td></tr></tbody></table></td></tr><tr style="height:54px;vertical-align:middle;"><td><div id="empJobWarn1" style="padding:2px;color:red;"></div><table class="pane_table" style="width:100%;"><tbody><tr><td style="text-align:left;"><table class="pane_table" style="margin-left:10px;"><tbody><tr><td><button class="std-button2" style="margin:4px;" id="empJobDel"><div></div></button></td><td><button class="std-button2" style="margin:4px;" id="empJobReplicate" ><div></div></button></td><td><button class="std-button2" style="margin:4px;" id="empJobDown"><div></div></button></td><td><button class="std-button2" style="margin:4px;" id="empJobUp"><div></div></button></td></tr></tbody></table></td><td></td><td style="text-align:right;"><table class="pane_table" style="margin-right:20px;margin-left:auto;"><tbody><tr><td><button class="std-button1" style="margin:4px 10px;" id="empJobOk" ><div></div></button></td><td><button class="std-button2" style="margin:4px 10px;" id="empJobCancel" ><div></div></button></td></tr></tbody></table></td></tr></tbody></table></td></tr></table>'
    }));

    this.tc.addChild(new dijit.layout.ContentPane({
        id        : 'empJobAssignPane2',
        title     : teasp.message.getLabel('tm20003012'),
//        style     : 'overflow:hidden;',
        content   : '<table class="eja_frame" style="width:100%;"><tr><td><table style="background-color:#EFEFEF;width:100%;"><tr><td class="edge_gray_tl"></td><td></td><td class="edge_gray_tr"></td></tr><tr><td></td><td><div style="margin:2px 4px;font-weight:bold;float:left;" id="dlg_jobAssign_code_label"></div><input type="text" value="" id="empJobCode" style="width:100px;padding:1px;float:left;" class="inputran" /><div style="margin:2px 4px 2px 8px;font-weight:bold;float:left;" id="dlg_jobAssign_jobName_label"></div><input type="text" value="" id="empJobName" style="width:200px;padding:1px;float:left;" class="inputran" /><div style="margin:2px 4px 2px 8px;font-weight:bold;float:left;" id="dlg_jobAssign_date_label"></div><input type="text" value="" id="empJobDate" class="inputab inpudate" style="float:left;" /><input type="button" id="empJobDateCal" class="pp_base pp_btn_cal" style="margin: 2px 4px;float:left;"><div style="clear:both;"></div><div style="margin:8px 4px 2px 2px;font-weight:bold;float:left;" id="dlg_jobAssign_jobDept_label"></div><select style="margin:6px 4px 2px 2px;float:left;padding:1px;width:320px;" id="empJobDept"></select><button class="std-button1" id="empJobSearch" style="margin:6px 4px 0px 12px;float:left;" ><div style="margin:3px 10px !important;"></div></button><div style="clear:both;"></div></td><td></td></tr><tr><td class="edge_gray_bl"></td><td></td><td class="edge_gray_br"></td></tr></table></td></tr><tr><td><div style="margin:6px 0px 4px 0px;font-weight:bold;" id="dlg_jobAssign_result_head"></div></td></tr><tr><td style="vertical-align:top !important;"><table class="pane_table" style="width:100%;"><tbody><tr><td><table class="atk_r_table" style="width:100%;"><tr><td class="head" style="width: 21px;"><input type="checkbox" id="empJobLeftCheck0" style="margin:4px;" /></td><td class="head" style="width:110px;"><div id="dlg_jobAssign_code_head2"></div></td><td class="head" style="width:auto;"><div id="dlg_jobAssign_jobName_head2"></div></td><td class="head" style="width:110px;"><div id="dlg_jobAssign_jobLeader_head"></div></td><td class="head" style="width:175px;"><div id="dlg_jobAssign_deptName_head"></div></td></tr></table></td></tr><tr style="height:1px;"><td></td></tr><tr><td><div class="atk_r_record_area" style="width:100%;" id="empJobLeftDiv"><table class="atk_r_record_table" id="empJobLeftTable" style="width:100%;"><tbody></tbody></table></div></td></tr></tbody></table></td></tr><tr style="height:54px;vertical-align:middle;"><td><div id="empJobWarn2" style="padding:2px;color:red;"></div><table class="pane_table" style="width:100%;"><tbody><tr><td><table class="pane_table" style="margin-left:auto;margin-right:auto;"><tbody><tr><td><button class="std-button1" style="margin:4px 8px;" id="empJobAdd" ><div></div></button></td><td><button class="std-button2" style="margin:4px 20px;" id="empJobCancel2" ><div></div></button></td></tr></tbody></table></td></tr></tbody></table></td></tr></table>'
    }));
    this.tc.startup();

    var children = this.tc.getChildren();
    this.tc.selectChild(children[0]);

    dojo.create("div", { id: "empJobAssignHandle" }, dojo.byId("empJobAssign"));  // ダイアログ可変アイコン

    //content innerHTML
    teasp.message.setLabelHtml('dlg_jobAssign_code_head'      , 'code_head');      //コード
    teasp.message.setLabelHtml('dlg_jobAssign_code_head2'     , 'code_head');      //コード
    teasp.message.setLabelHtml('dlg_jobAssign_code_label'     , 'code_head');      //コード
    teasp.message.setLabelHtml('dlg_jobAssign_jobName_head'   , 'tm20001030');     //タスク名
    teasp.message.setLabelHtml('dlg_jobAssign_jobName_head2'  , 'tm20001030');     //タスク名
    teasp.message.setLabelHtml('dlg_jobAssign_jobName_label'  , 'tm20001030');     //タスク名
    teasp.message.setLabelHtml('dlg_jobAssign_jobLeader_head' , 'jobLeader_head'); //ジョブリーダー"
    teasp.message.setLabelHtml('dlg_jobAssign_effortName'     , 'workClass_head'); //作業分類
    teasp.message.setLabelHtml('dlg_jobAssign_result_head'    , 'tm20003013');     //検索結果
    teasp.message.setLabelHtml('dlg_jobAssign_jobDept_label'  , 'tk10000830');     // 主担当部署
    teasp.message.setLabelHtml('dlg_jobAssign_deptName_head'  , 'tk10000830');     // 主担当部署
    teasp.message.setLabelHtml('dlg_jobAssign_date_label'     , 'date_head');      // 日付

    dojo.byId('empJobDel'      ).firstChild.innerHTML = teasp.message.getLabel('delete_btn_title'); // 削除
    dojo.byId('empJobReplicate').firstChild.innerHTML = teasp.message.getLabel('clone_btn_title');  // 複製
    dojo.byId('empJobDown'     ).firstChild.innerHTML = teasp.message.getLabel('down_btn_title');   // 下へ
    dojo.byId('empJobUp'       ).firstChild.innerHTML = teasp.message.getLabel('up_btn_title');     // 上へ
    dojo.byId('empJobOk'       ).firstChild.innerHTML = teasp.message.getLabel('save_btn_title');   // 登録
    dojo.byId('empJobCancel'   ).firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title'); // キャンセル

    dojo.byId('empJobSearch'   ).firstChild.innerHTML = teasp.message.getLabel('search_btn_title'); // 検索
    dojo.byId('empJobAdd'      ).firstChild.innerHTML = teasp.message.getLabel('tf10000290');       // 選択したジョブをアサインする
    dojo.byId('empJobCancel2'  ).firstChild.innerHTML = teasp.message.getLabel('cancel_btn_title'); // キャンセル

    dojo.connect(dojo.byId('empJobSearch'     ), 'onclick', this, this.search    );
    dojo.connect(dojo.byId('empJobAdd'        ), 'onclick', this, this.empJobAdd );
    dojo.connect(dojo.byId('empJobDel'        ), 'onclick', this, this.empJobDel );
    dojo.connect(dojo.byId('empJobUp'         ), 'onclick', this, this.empJobUp  );
    dojo.connect(dojo.byId('empJobDown'       ), 'onclick', this, this.empJobDown);
    dojo.connect(dojo.byId('empJobReplicate'  ), 'onclick', this, this.empJobReplicate);
    dojo.connect(this.dialog, 'onCancel', this, this.hide);

    // カレンダーボタン
	dojo.connect(dojo.byId('empJobDateCal'), 'onclick', this, function(e){
		var ind = teasp.util.date.parseDate(dojo.byId('empJobDate').value); // 日付の入力値を取得
		teasp.manager.dialogOpen(
			'Calendar',
			{
				date: ind,
				isDisabledDateFunc: function(d) {
					return false;
				}
			},
			null,
			this,
			function(o){
				dojo.byId('empJobDate').value = teasp.util.date.formatDate(o, 'SLA');
			}
		);
	});

    dojo.connect(dojo.byId('empJobOk')    , "onclick", this, this.ok);
    dojo.connect(dojo.byId('empJobCancel'), "onclick", this, this.hide);

    dojo.connect(dojo.byId('empJobCancel2'), "onclick", this, this.hide);

    dojo.connect(dojo.byId('empJobLeftCheck0' ), 'onclick', this, function(){ this.checkAll('empJobLeftTable' , dojo.byId('empJobLeftCheck0' ).checked); });
    dojo.connect(dojo.byId('empJobRightCheck0'), 'onclick', this, function(){ this.checkAll('empJobRightTable', dojo.byId('empJobRightCheck0').checked); });
};

/**
 * @override
 */
teasp.dialog.EmpJobAssign.prototype.preShow = function(){
    // 前回のイベントハンドルをクリアする
    for(var i = 0 ; i < this.eventHandles.length ; i++){
        dojo.disconnect(this.eventHandles[i]);
        delete this.eventHandles[i];
    }
    this.eventHandles = [];

    this.classifyJobWorks  = this.args.classifyJobWorks;

    dojo.byId('empJobLeftCheck0').checked = false;
    dojo.byId('empJobRightCheck0').checked = false;
    dojo.byId('empJobCode').value = '';
    dojo.byId('empJobName').value = '';
    dojo.byId('empJobDate').value = teasp.util.date.formatDate(this.args.date, 'SLA');

    this.jobMap = {};
    for(var key in this.classifyJobWorks){
        if(this.classifyJobWorks.hasOwnProperty(key)){
            var lst = this.classifyJobWorks[key];
            for(var j = 0 ; j < lst.length ; j++){
                this.jobMap[lst[j].jobId] = lst[j];
            }
        }
    }
    this.showWarn1(null);
    this.showWarn2(null);

    // APEX側からガバナ制限MAXで取ってきたジョブのデータを値渡しする
    var memberjobs = this.pouch.getMemberJobs(this.classifyJobWorks).concat(); 
　  // 値渡しでコピーした内容を300件に切り取る ※参照渡しにするとダイアログ二回目表示の時、memberjobsの中が300件のままなのでtk10000343のメッセージが出せない
    if(memberjobs.length > 300){
        this.showWarn2(teasp.message.getLabel('tk10000343', 300, 300));
        memberjobs.splice(300, memberjobs.length);
    }
    // 編集したデータ300件分のジョブが表示するテーブルを作成
    this.createTable(memberjobs, 'empJobLeftTable' , 'empJobLeftDiv' );

    var jobs = this.classifyJobWorks.assignJobs || [];
    var mp = {};
    var l = [];
    for(var i = 0 ; i < jobs.length ; i++){
        var k = jobs[i].jobId + ':' + (jobs[i].process || '');
        if(mp[k]){
            l.push(i);
        }else{
            mp[k] = jobs[i];
        }
    }
    for(i = l.length - 1 ; i >= 0 ; i--){
        jobs.splice(l[i], 1);
    }
    this.createTable(jobs, 'empJobRightTable', 'empJobRightDiv');

    dijit.byId('empJobAssignTab').selectChild(dijit.byId('empJobAssignPane1'));

    var select = dojo.byId('empJobDept');
    dojo.empty(select);
    var depts = this.pouch.getDeptList(this.args.date);
    dojo.create('option', { value: ''  , innerHTML: teasp.message.getLabel('tk10000344') }, select); // （すべて）
    dojo.create('option', { value: '-1', innerHTML: teasp.message.getLabel('tk10000807') }, select); // （部署未設定のジョブ）
    for(var i = 0 ; i < depts.length ; i++){
        var d = depts[i];
        if(!d.hidden){
            dojo.create('option', { value: d.id, innerHTML: d.displayName }, select);
        }
    }
    select.value = (this.pouch.getDeptId() || '');


    // ダイアログのリサイズ処理
    this.RIGHT_H = 188;
    this.LEFT_H = this.RIGHT_H + 80;

	if(this.noDialog()){
		dojo.style('empJobAssign', 'height', 'auto');
	}else{
        var areaH = 0;
        var areaW = 0;
        var box = dojo.window.getBox();
        if(!this.resizeHandle){
			this.resizeHandle = new dojox.layout.ResizeHandle({
				resizeAxis:'xy',
				activeResize:true,
				intermediateChanges: true,
                minHeight:this.LEFT_H + 26.4, // ジョブ検索タブのテーブル1行分の高さが最小サイズ
				minWidth:726,
                constrainMax:true,
                maxHeight: box.h * 0.85, // ダイアログ最大高さ
                maxWidth: box.w * 0.9, // ダイアログ最大横幅
				targetId: 'empJobAssign'
			}, dojo.byId('empJobAssignHandle'));
			dojo.connect(this.resizeHandle, 'onResize', this, this.resizeDialog);

			var obj = this.getLocalStorage(); // 保存されているサイズを読み込み
			if(obj && obj.height && obj.width){
                areaH = obj.height;
                areaW = obj.width;
			}else{
				areaH = 550;
                areaW = 1226;
			}
            dojo.style('empJobAssignTab', 'height', areaH - 53 + 'px'); // 初期表示時にタブエリアの高さを調整
		}else{
            areaH = this.jobDalogHeight;
            areaW = this.jobDalogWidth;
        }
        dojo.style('empJobAssign', 'height', areaH + 'px');
        dojo.style('empJobAssign', 'width', areaW + 'px');
        var rightH = areaH - this.RIGHT_H; // アサイン済みジョブタブのテーブルエリアの高さ
        var leftH = areaH - this.LEFT_H; // ジョブ検索タブのテーブルエリアの高さ
        dojo.style('empJobRightDiv', 'height', rightH + 'px');
        dojo.style('empJobLeftDiv', 'height', leftH + 'px');
    }
    dojo.style('empJobAssign', 'margin', '0px');
    return true;
};

teasp.dialog.EmpJobAssign.prototype.hide = function(){
	if(!this.noDialog()){
		var n = dojo.byId('empJobAssign');
        this.jobDalogHeight = n.clientHeight; // コンテンツ高さ 
        this.jobDalogWidth = n.clientWidth; // コンテンツ高さ 
        // LocalStorageに保存
		this.setLocalStorage({ 
            height: n.clientHeight, 
            width: n.clientWidth,
        });
	}
	teasp.dialog.Base.prototype.hide.call(this);
};

teasp.dialog.EmpJobAssign.prototype.resizeDialog = function(o){
	if(!this.noDialog()){
		var h = dojo.byId('empJobAssign').clientHeight; // コンテンツ高さ
        var rightH = h - this.RIGHT_H; // アサイン済みジョブタブのテーブルエリアの高さ
        var leftH = h - this.LEFT_H; // ジョブ検索タブのテーブルエリアの高さ
        dojo.style('empJobRightDiv', 'height', rightH + 'px');
        dojo.style('empJobLeftDiv', 'height', leftH + 'px');
    }
};

/**
 * 登録
 *
 * @override
 */
teasp.dialog.EmpJobAssign.prototype.ok = function(){
    var jobs = this.getJobList('empJobRightTable');
    teasp.util.deleteHasSameJobId(jobs,true);
    var regJobs = [];
    for(var i = 0 ; i < jobs.length ; i++){
        var job = jobs[i];
        regJobs.push({
            id       : (job.jobAssign ? job.jobAssign.id : null),
            jobId    : job.jobId,
            process  : job.process
        });
    }
    console.log(regJobs);
    teasp.action.contact.remoteMethods(
        [{
            funcName: 'getExtResult',
            params  : {
                action    : 'saveJobAssign',
                empId     : this.pouch.getEmpId(),
                jobs      : regJobs
            }
        }],
        {
            errorAreaId : null,
            nowait      : false
        },
        function(result){
            this.pouch.setKeyObj('jobAssigns', teasp.logic.convert.convJobAssignObjs(result.jobAssign || []));
            this.pouch.clearClassifyJobWorks();
            this.onfinishfunc();
            this.close();
        },
        null,
        this
    );
};

/**
 * リストを作成
 *
 * @param {Array.<Object>} lst オブジェクトの配列
 * @param {string} tableId テーブルID
 * @param {string} areaId (未使用)
 *
 */
teasp.dialog.EmpJobAssign.prototype.createTable = function(lst, tableId, areaId){
    var tbody = dojo.byId(tableId).getElementsByTagName('tbody')[0];
    var row, ss;
    while(tbody.firstChild){
        dojo.destroy(tbody.firstChild);
    }
    var ruler = dojo.byId('ruler1');
    ruler.style.fontSize = '12px';
    ruler.style.width = '329px';
    var divH = 0;
    if(!lst){
        row = dojo.create('tr', null, tbody);
        ss = this.msgmap[tableId].nullmsg;
        dojo.create('div', { style: { margin:"4px" }, innerHTML: ss }, dojo.create('td', { style: { textAlign:"left", width:"329px" }, colSpan: '3' }, row));
        divH += (ss.getExtent(ruler).height + 8);
    }else if(lst.length <= 0){
        row = dojo.create('tr', null, tbody);
        ss = this.msgmap[tableId].zeromsg;
        dojo.create('div', { style: { margin:"4px" }, innerHTML: ss }, dojo.create('td', { style: { textAlign:"left", width:"329px" }, colSpan: '3' }, row));
        divH += (ss.getExtent(ruler).height + 8);
    }else{
        ruler.style.width = '203px';
        for(var i = 0 ; i < lst.length ; i++){
            this.insertRow(lst[i], tableId, tbody);
            divH += (lst[i].jobName.getExtent(ruler).height + 8);
        }
    }
};

/**
 * 行挿入（１）
 *
 * @param {Object} o 挿入するジョブオブジェクト
 * @param {string} tableId テーブルID
 * @param {Object} tbody テーブルボディ
 * @param {Object=} brow 行オブジェクト（位置を指定する場合）
 * @param {boolean=} chk true:チェック状態にする
 */
teasp.dialog.EmpJobAssign.prototype.insertRow = function(o, tableId, tbody, brow, chk){
    var i = tbody.rows.length;
    var rowp = {
        id         : tableId + 'Row' + i,
        className  : 'sele ' + ((i%2) == 0 ? 'even' : 'odd'),
        style      : { cursor: "pointer" }
    };
    var row = (brow ? dojo.create('tr', rowp, brow, 'before') : dojo.create('tr', rowp, tbody));
    //checkボックス
    var cell = dojo.create('td', { style: { width:"21px", textAlign:"center" } }, row);
    var inp = null;
    if(tableId == 'empJobLeftTable' || o.jobId != this.pouch.getLeftoverJobId()){
        inp = dojo.create('input', { type: 'checkbox', style: { margin:"4px" } }, cell);
    }
    //コード
    cell = dojo.create('td', { style: { width:"110px", fontSize:"12px", textAlign:"left" } }, row);
    this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickRow));
    dojo.create('div', { innerHTML: o.jobCode, style: { margin:"4px", wordBreak:"break-all" } }, cell);
    dojo.create('input',{ type: 'hidden', name: 'jobId', value: o.jobId }, cell);
    //タスク名
    cell = dojo.create('td', { style: { width:"auto", fontSize:"12px", textAlign:"left" } }, row);
    this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickRow));
    var div = dojo.create('div', { innerHTML: o.jobName, style: "margin:4px;word-break:break-all;" }, cell);

    var sd = ((o.jobAssign && o.jobAssign.job && o.jobAssign.job.startDate) || o.startDate || null);
    var ed = ((o.jobAssign && o.jobAssign.job && o.jobAssign.job.endDate)   || o.endDate   || null);
    if(ed < this.args.date){
        dojo.create('div', { innerHTML: teasp.message.getLabel('tf10008290'), style: 'float:right;font-size:90%;color:red;' }, div); // (終了)
    }
    if(this.args.date < sd){
        dojo.create('div', { innerHTML: teasp.message.getLabel('tf10008300'), style: 'float:right;font-size:90%;color:#3131de;' }, div); // (開始前)
    }

    if(tableId == 'empJobLeftTable'){
        cell = dojo.create('td', { style: { width:"110px", fontSize:"12px", textAlign:"left" } }, row);
        //ジョブリーダー
        this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickRow));
        var jobleaderTex = (o.jobLeader?o.jobLeader:'');
        dojo.create('div', { innerHTML: jobleaderTex, style: { margin:"4px", wordBreak:"break-all" } }, cell);

        cell = dojo.create('td', { style: { width:"158px", fontSize:"12px", textAlign:"left" } }, row);
        this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickRow));
        dojo.create('div', { innerHTML: (o.deptId ? (o.deptCode || '') + '-' + (o.deptName || '') : ''), style: { margin:"4px", wordBreak:"break-all" } }, cell);
    }else if(tableId == 'empJobRightTable'){
        cell = dojo.create('td', { style: { width:"168px", fontSize:"12px", textAlign:"left", wordBreak:"break-all" } }, row);
        if(o.jobId != this.pouch.getLeftoverJobId()){
            //工程プルダウン+
            var select = dojo.create('select', {style: { width:"164px", marginLeft:"4px" } }, cell);

            var processList = this.pouch.getProcessList((o.jobAssign && o.jobAssign.job) || o);
            dojo.create('option', { value: '', innerHTML: '' }, select);
            for(i = 0 ; i < processList.length ; i++){
                dojo.create('option', {
                    value     : processList[i],
                    innerHTML : processList[i]
                }, select);
            }
            for(i = 0; i <= select.options.length; i++){
                if(i == select.options.length){
                    dojo.create('option',{
                        value :o.process,
                        innerHTML :(o.process)?o.process:''
                    },select);
                    select.value = (o.process)?o.process:'';
                    break;
                }
                if(((o.process)?o.process:'') == select.options[i].value){
                    select.value = (o.process)?o.process:'';
                    break;
                }
            }
        }
    }


    if(chk && inp){
        inp.checked = true;
    }
    if(brow && brow.cells[0].colSpan > 1){
        tbody.removeChild(brow);
    }
};

/**
 * 行挿入（２）
 *
 * @param {Object} o 挿入するジョブオブジェクト
 * @param {string} tableId テーブルID
 * @param {Object} tbody テーブルボディ
 * @param {boolean=} chk true:チェック状態にする
 */
teasp.dialog.EmpJobAssign.prototype.insertElement = function(o, tableId, tbody, chk){
    var brow = null;
    for(var r = tbody.rows.length - 1 ; r >= 0 ; r--){
        var row = tbody.rows[r];
        if(row.cells[0].colSpan > 1 || !row.cells[0].firstChild){
            brow = row;
        }
    }
    this.insertRow(o, tableId, tbody, brow, false);
};

/**
 * 行削除
 *
 * @param {number} rowIndex 削除する行インデックス
 * @param {string} tableId テーブルID
 * @param {Object} tbody テーブルボディ
 */
teasp.dialog.EmpJobAssign.prototype.deleteElement = function(rowIndex, tableId, tbody){
    var row = tbody.rows[rowIndex];
    tbody.removeChild(row);
    dojo.destroy(row);
    row = null;
};

/**
 * まとめて行挿入
 *
 * @param {Array.<Object>} lst 挿入するジョブオブジェクトの配列
 * @param {string} tableId テーブルID
 */
teasp.dialog.EmpJobAssign.prototype.insertElements = function(lst, tableId){
    var tbody = dojo.byId(tableId).getElementsByTagName('tbody')[0];
    for(var i = 0 ; i < lst.length ; i++){
        this.insertElement(lst[i], tableId, tbody);
    }
    this.bulkConfiguration(tableId,tbody);
};

/**
 * まとめて行削除
 *
 * @param {Array.<number>} rowIndexs 削除する行オブジェクトの行番号配列
 * @param {string} tableId テーブルID
 */
teasp.dialog.EmpJobAssign.prototype.deleteElements = function(rowIndexs, tableId){
    var tbody = dojo.byId(tableId).getElementsByTagName('tbody')[0];
    for(var i = rowIndexs.length-1 ; i >= 0 ; i--){
        this.deleteElement(rowIndexs[i], tableId, tbody);
    }
    this.bulkConfiguration(tableId,tbody);
    if(!tbody.rows.length){
        var row = dojo.create('tr', null, tbody);
        var ss = this.msgmap[tableId].zeromsg;
        dojo.create('div', { style: { margin:"4px" }, innerHTML: ss }, dojo.create('td', { style: { textAlign:"left", width:"329px" }, colSpan: '3' }, row));
    }
};

/**
 * ジョブオブジェクトの配列を返す
 *
 * @param {string} tableId テーブルID
 * @param {boolean=} flag true:チェック状態のものだけ
 * @return {Array.<Object>} ジョブオブジェクトの配列
 */
teasp.dialog.EmpJobAssign.prototype.getJobList = function(tableId, flag){
    var jobs = [];
    var tbody = dojo.byId(tableId).getElementsByTagName('tbody')[0];
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var row = tbody.rows[i];
        var id = this.getJobIdByRow(row);
        if(id && (!flag || (row.cells[0].firstChild && row.cells[0].firstChild.checked))){
            if((tableId == 'empJobRightTable') && !flag){
                var jobProcessSelect = (row.cells.length > 3 ? row.cells[3].firstChild : null);
                var jobProcess = ((jobProcessSelect && jobProcessSelect.value) || null);
                if(jobs.hasOwnProperty(id + jobProcess)){
                    jobs.push(this.jobMap[id + jobProcess]);
                }else{
                    jobs.push(dojo.clone(this.jobMap[id]));
                    jobs[jobs.length-1].process = jobProcess;
                }
            }else{
                jobs.push(this.jobMap[id]);
            }
        }
    }
    return jobs;
};

teasp.dialog.EmpJobAssign.prototype.getJobIdByRow = function(row){
    var node = (row.cells.length > 1 ? row.cells[1].firstChild : null);
    while(node){
        if(node.tagName == 'INPUT' && node.type == 'hidden'){
            return node.value;
        }
        node = node.nextSibling;
    }
    return null;
};

/**
 * chekedされてるrowIndex配列を返す
 *
 * @param {string} tableId テーブルID
 * @param {boolean=} flag true:チェック状態のものだけ
 * @return {Array.<Object>} ジョブオブジェクトの配列
 */
teasp.dialog.EmpJobAssign.prototype.getCheckedIndex = function(tableId, flag){
    var tbody = dojo.byId(tableId).getElementsByTagName('tbody')[0];
    var checkedIndex=[];
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var row = tbody.rows[i];
        if(row.cells[0].firstChild && row.cells[0].firstChild.checked){
            checkedIndex.push(i);
        }
    }

    return checkedIndex;
};

/**
 * すべてチェック状態にするまたはチェックを解除する
 *
 * @param {string} tableId テーブルID
 * @param {boolean} flag true:チェック状態にする
 */
teasp.dialog.EmpJobAssign.prototype.checkAll = function(tableId, flag){
    var tbody = dojo.byId(tableId).getElementsByTagName('tbody')[0];
    for(var i = 0 ; i < tbody.rows.length ; i++){
        var row = tbody.rows[i];
        var node = row.cells[0].firstChild;
        if(node && node.tagName.toLowerCase() == 'input' && node.type == 'checkbox'){
            node.checked = flag;
        }
    }
};

/**
 * 検索
 *
 */
teasp.dialog.EmpJobAssign.prototype.search = function(){
    this.showWarn2(null);

    var targetDate = teasp.util.strToDate(dojo.byId('empJobDate').value);
    if(targetDate.failed != 0){
        teasp.message.alertError(teasp.message.getLabel('tm00000050', teasp.message.getLabel('date_head'))); // {0}を入力してください
        return;
    }
    dojo.byId('empJobDate').value = targetDate.dater;

    var lst = this.getJobList('empJobRightTable');
    var excludes = [];
    for(var i = 0 ; i < lst.length ; i++){
        excludes.push(lst[i].jobId);
    }
    var leftoverJobId = this.pouch.getLeftoverJobId();
    if(!excludes.contains(leftoverJobId)){
        excludes.push(leftoverJobId);
    }

    teasp.manager.request(
        'searchJob',
        {
            empId    : this.pouch.getEmpId(),
            date     : targetDate.datef,
            jobCode  : (dojo.byId('empJobCode').value || null),
            jobName  : (dojo.byId('empJobName').value || null),
            deptId   : (dojo.byId('empJobDept').value || null),
            excludes : excludes,
            jobAssignClass : this.pouch.getJobAssignClass()
        },
        this.pouch,
        { hideBusy : false },
        this,
        function(jobs){
            if(jobs.length > 300){
                this.showWarn2(teasp.message.getLabel('tk10000343', 300, 300));
                jobs.splice(300, jobs.length);
            }
            this.setSearchResult(jobs);
        },
        function(event){
            teasp.message.alertError(event);
        }
    );
};

/**
 * タスクを追加
 *
 */
teasp.dialog.EmpJobAssign.prototype.empJobAdd = function(){
    var choice = this.getJobList('empJobLeftTable', true);
    var checkedIndex = this.getCheckedIndex('empJobLeftTable');
    if(choice.length <= 0){
        return;
    }
    this.checkAll('empJobRightTable', false);
    this.insertElements(choice, 'empJobRightTable');
    this.deleteElements(checkedIndex, 'empJobLeftTable');
    dojo.byId('empJobLeftCheck0').checked = false;
    dijit.byId('empJobAssignTab').selectChild(dijit.byId('empJobAssignPane1'));
};

/**
 * タスクを削除
 *
 */
teasp.dialog.EmpJobAssign.prototype.empJobDel = function(){
    var choice = this.getJobList('empJobRightTable', true);
    var checkedIndex = this.getCheckedIndex('empJobRightTable');
    if(choice.length <= 0){
        return;
    }
    var unCheckedJob = this.getUnCheckedJob(false,0);
    this.checkAll('empJobLeftTable', false);
    this.deleteElements(checkedIndex, 'empJobRightTable');
    teasp.util.deleteHasSameJobId(choice);
    this.minusBySameJobId(choice,unCheckedJob);

    this.insertElements(choice, 'empJobLeftTable');
    dojo.byId('empJobRightCheck0').checked = false;
};

/**
 * 並び順を１つ上へ
 *
 */
teasp.dialog.EmpJobAssign.prototype.empJobUp = function(){
    var tbody = dojo.byId('empJobRightTable').getElementsByTagName('tbody')[0];
    for(var r = 0 ; r < tbody.rows.length ; r++){
        var node = tbody.rows[r].cells[0].firstChild;
        if(node
        && node.checked && r > 0
        && (!tbody.rows[r - 1].cells[0].firstChild || !tbody.rows[r - 1].cells[0].firstChild.checked)){
            var row = tbody.removeChild(tbody.rows[r - 1]);
            var row2 = tbody.rows[r];
            if(!row2){
                tbody.appendChild(row);
            }else{
                tbody.insertBefore(row, row2);
            }
        }
    }

    this.bulkConfiguration('empJobRightTable',tbody);
};

/**
 * 並び順を１つ下へ
 *
 */
teasp.dialog.EmpJobAssign.prototype.empJobDown = function(){
    var tbody = dojo.byId('empJobRightTable').getElementsByTagName('tbody')[0];
    for(var r = tbody.rows.length - 1 ; r >= 0  ; r--){
        var node = tbody.rows[r].cells[0].firstChild;
        if(node
        && node.checked
        && r < (tbody.rows.length - 1)
        && tbody.rows[r + 1].cells[0].firstChild
        && !tbody.rows[r + 1].cells[0].firstChild.checked){
            tbody.insertBefore(tbody.removeChild(tbody.rows[r + 1]), tbody.rows[r]);
        }
    }
    this.bulkConfiguration('empJobRightTable',tbody);
};

/**
 * 複製クリック時の処理
 *
 */
teasp.dialog.EmpJobAssign.prototype.empJobReplicate = function(){
    var tbody = dojo.byId('empJobRightTable').getElementsByTagName('tbody')[0];
    for(var r = tbody.rows.length - 1 ; r >= 0  ; r--){
        var node = tbody.rows[r].cells[0].firstChild;
        if(node && node.checked){
            var copyNode = tbody.rows[r].cloneNode(true);
            var row2 = tbody.rows[r+1];
            if(!row2){
                tbody.appendChild(copyNode);
            }else{
                tbody.insertBefore(copyNode, row2);
            }
            var checkBox = copyNode.cells[0].firstChild;
            checkBox.checked = false;
            for(var i = 1; i < 3; i++){
                var cell = copyNode.cells[i];
                this.eventHandles.push(dojo.connect(cell, 'onclick', this, this.clickRow));
            }
        }
    }

    this.bulkConfiguration('empJobRightTable',tbody);
};

/**
 * 行クリック時の処理
 *
 */
teasp.dialog.EmpJobAssign.prototype.clickRow = function(e){
    var p = teasp.util.getAncestorByTagName(e.target, 'TR');
    if(p){
        dojo.query('input[type="checkbox"]', p).forEach(function(el){
            el.checked = !el.checked;
        });
    }
};

/**
 * 検索結果を表示する
 *
 * @param {Array.<Object>} jobs ジョブオブジェクトの配列
 */
teasp.dialog.EmpJobAssign.prototype.setSearchResult = function(jobs){
    teasp.util.deleteHasSameJobId(jobs);
    for(var i = 0 ; i < jobs.length ; i++){
        var j = jobs[i];
        this.jobMap[j.jobId] = j;
    }
    this.createTable(jobs, 'empJobLeftTable', 'empJobLeftDiv');
};

/**
 * 警告メッセージ１を表示
 *
 * @param {?string} msg メッセージ
 */
teasp.dialog.EmpJobAssign.prototype.showWarn1 = function(msg){
//    dojo.style('empJobWarnRow1', 'display', (msg ? '' : 'none'));
    dojo.byId('empJobWarn1').innerHTML = (msg ? msg : '');
};

/**
 * 警告メッセージ２を表示
 *
 * @param {?string} msg メッセージ
 */
teasp.dialog.EmpJobAssign.prototype.showWarn2 = function(msg){
//    dojo.style('empJobWarnRow2', 'display', (msg ? '' : 'none'));
    dojo.byId('empJobWarn2').innerHTML = (msg ? msg : '');
};

/**
 * 重複ジョブを配列から除く
 * lstに評価したい配列　othersに重複対象となる配列
 *
 * @param {Array.<Object>} lst ジョブオブジェクトの配列１（※メソッド内で更新）
 * @param {Array.<Object>} others ジョブオブジェクトの配列２
 *
 * @return {Array.<Object>} lst 重複ジョブを削除整形された配列
 */
teasp.dialog.EmpJobAssign.prototype.minusBySameJobId = function(lst, others){
    var indexes = [];
    for(var i = 0 ; i < lst.length ; i++){
        for(var j = 0 ; j < others.length ; j++){
            if(lst[i].jobId == others[j].jobId){
                indexes.push(i);
            }
        }
    }
    for(i = indexes.length - 1 ; i >= 0 ; i--){
        lst.splice(indexes[i], 1);
    }
    return lst;
};


/**
 * table内の行のインデックス番号付け処理と背景クラスの一括設定
 *
 * @param {string} tableId テーブルID
 * @param {Object} tbody 該当tbodyノード
 */
teasp.dialog.EmpJobAssign.prototype.bulkConfiguration = function(tableId,tbody){
        for(var i = 0; i<tbody.rows.length; i++){
            tbody.rows[i].id = tableId + 'Row' + i;
            dojo.toggleClass(tbody.rows[i], 'even', ((i%2) == 0));
            dojo.toggleClass(tbody.rows[i], 'odd' , ((i%2) != 0));
        }
};

/**
 * chekedされてないjobオブジェクトを返す
 * @param {boolean} flag true:特定行飛ばしモード
 * @param {number} idx  飛ばし行インデックス
 * @return {Array.<Object>} ジョブオブジェクトの配列
 */
teasp.dialog.EmpJobAssign.prototype.getUnCheckedJob = function(flag,idx){
    var tbody = dojo.byId('empJobRightTable').getElementsByTagName('tbody')[0];
    var unCheckedJob=[];
    for(var i = 0 ; i < tbody.rows.length ; i++){
        if(flag&&(i==idx)){
            continue;
        }
        var row = tbody.rows[i];
        var id = this.getJobIdByRow(row);
        if(!row.cells[0].firstChild || !row.cells[0].firstChild.checked){
            unCheckedJob.push(this.jobMap[id]);
        }
    }
    unCheckedJob=teasp.util.deleteHasSameJobId(unCheckedJob);


    return unCheckedJob;
};
