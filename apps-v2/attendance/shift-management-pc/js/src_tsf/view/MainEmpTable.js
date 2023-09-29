/**
 * 社員選択画面
 *
 * @constructor
 */
teasp.Tsf.MainEmpTable = function(){
    this.titleCss = 'exp-empTable';
};

teasp.Tsf.MainEmpTable.prototype = new teasp.Tsf.MainBase();

teasp.Tsf.MainEmpTable.prototype.init = function(){
    this.domHelper = new teasp.Tsf.Dom();

    this.createBase();

    // ウィンドウリサイズイベント
    window.onresize = teasp.Tsf.MainEmpTable.resize;
};

/**
 * 表示エリア作成
 *
 */
teasp.Tsf.MainEmpTable.prototype.createBase = function(){
    var area = teasp.Tsf.Dom.byId(teasp.Tsf.ROOT_AREA_ID);
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('' // コントロール部
        + '<div>'
        + '    <table>'
        + '    <tr>'
        + '        <td>'
        + '            <div class="ts-emp-table-title"></div>'
        + '        </td>'
        + '    </tr>'
        + '    </table>'
        + '</div>'
    ));
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div id="expListView"></div>')); // テーブルエリア
    teasp.Tsf.Dom.append(area, teasp.Tsf.Dom.toDom('<div class="ts-form-spacer"></div>'));

    var title = '';
    var type = tsfManager.getType();
    switch(type){
        case 'Exp'   : title = teasp.message.getLabel('tf10006280', teasp.message.getLabel('empExp_label'   )); break; // 経費精算：社員選択
        case 'ExpPre': title = teasp.message.getLabel('tf10006280', teasp.message.getLabel('tk10004031'     )); break; // 事前申請：社員選択
        case 'Time'  : title = teasp.message.getLabel('tf10006280', teasp.message.getLabel('workTable_label')); break; // 勤務表：社員選択
        case 'Job'   : title = teasp.message.getLabel('tf10006280', teasp.message.getLabel('empWork_label'  )); break; // 工数実績：社員選択
    }
    teasp.Tsf.Dom.html('div.ts-emp-table-title', area, title);
};

/**
 * ウィンドウリサイズ
 *
 */
teasp.Tsf.MainEmpTable.resize = function(){
    var box = teasp.Tsf.Dom.getBox();
    tsfManager.resizedArea(box);
};
