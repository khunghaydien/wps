/**
 * 経費明細入力ダイアログ
 *
 * @constructor
 */
teasp.Tsf.ExpRoute = function(){
    this.expRoute = null;
};

teasp.Tsf.ExpRoute.prototype.show = function(obj){
    teasp.Tsf.Error.showError();
    if(!this.dialog){
        this.domHelper = new teasp.Tsf.Dom();
        this.dialog = new dijit.Dialog({
            title       : teasp.message.getLabel('routeInfo_caption') // 経路情報
        });
        this.dialog.attr('content', this.getContent());
        this.dialog.startup();
        this.domHelper.connect(this.dialog, 'onCancel', this, function(){ this.hide(); });
    }
    this.showData(obj);
};

teasp.Tsf.ExpRoute.prototype.showData = function(obj){
    var o = obj;
    if(typeof(obj) == 'string'){
        o = dojo.fromJson(obj);
    }
    if(this.expRoute){
        this.expRoute.destroy();
    }
    this.expRoute = new teasp.helper.EkitanRoute(o.route);

    var s = teasp.message.getLabel('tm20009060', o.searchKey.stationFrom.name, o.searchKey.stationTo.name); // {0} ⇒ {1}
    if(o.searchKey.stationVia && o.searchKey.stationVia.length){
        s += teasp.message.getLabel('tm20009019'); //    （
        for(var i = 0 ; i < o.searchKey.stationVia.length ; i++){
            if(i > 0){
                s += teasp.message.getLabel('tm10001540'); // 、
            }
            s += o.searchKey.stationVia[i].name;
        }
        s += teasp.message.getLabel('tm20009020'); //   経由）
    }

    teasp.Tsf.Dom.node('.ts-title > div').innerHTML = s;
    teasp.Tsf.Dom.node('.ts-cost  > div').innerHTML = teasp.util.currency.formatMoney(o.route.fare)
                                                    + teasp.message.getLabel('tm20009090') // 円
                                                    + teasp.message.getLabel('tm20009030'); //（片道）
    teasp.Tsf.Dom.node('.ts-route-head > div').innerHTML = teasp.message.getLabel('route_head'); // 経路

    var body = teasp.Tsf.Dom.node('.ts-route-body > div');
    teasp.Tsf.Dom.empty(body);
    body.appendChild(this.expRoute.createTable({ tableId:'expRouteTable', readOnly:true }));

    this.dialog.show();
};

teasp.Tsf.ExpRoute.prototype.getDomHelper = function(){
    return this.domHelper;
};

teasp.Tsf.ExpRoute.prototype.getArea = function(){
    return teasp.Tsf.Dom.byId(this.dialog.id);
};

teasp.Tsf.ExpRoute.prototype.hide = function(){
    if(this.dialog){
        this.dialog.hide();
        this.domHelper.free();
        this.dialog.destroy();
        tsfManager.removeDialog('ExpRoute');
    }
};

teasp.Tsf.ExpRoute.prototype.getContent = function(){
    var areaEl  = this.getDomHelper().create('div', { className: 'ts-dialog ts-exp-route' });
    var table   = this.getDomHelper().create('table', null, areaEl);
    var tbody   = this.getDomHelper().create('tbody', null, table);
    this.getDomHelper().create('div', null, this.getDomHelper().create('td', { className: 'ts-title' }, this.getDomHelper().create('tr', null, tbody)));
    this.getDomHelper().create('div', null, this.getDomHelper().create('td', { className: 'ts-cost'  }, this.getDomHelper().create('tr', null, tbody)));
    this.getDomHelper().create('div', null, this.getDomHelper().create('td' , { className: 'ts-route-head' }, this.getDomHelper().create('tr', null, tbody)));
    this.getDomHelper().create('div', null, this.getDomHelper().create('td' , { className: 'ts-route-body' }, this.getDomHelper().create('tr', null, tbody)));

    this.createButtons(areaEl);

    return areaEl;
};

teasp.Tsf.ExpRoute.prototype.createButtons = function(areaEl){
    var area = this.getDomHelper().create('div', { className: 'ts-dialog-buttons' }, areaEl);
    var div  = this.getDomHelper().create('div', null, area);
    var canbtn = teasp.Tsf.Dialog.createButton(this.getDomHelper(), teasp.message.getLabel('close_btn_title'), 'ts-dialog-cancel', div); // 閉じる
    this.getDomHelper().connect(canbtn, 'onclick', this, this.hide);
};
