teasp.provide('teasp.helper.EkitanRoutes');
/**
 * 駅探検索経路解析クラス
 *
 * @constructor
 * @param {Array.<Object>} routes 経路情報の配列
 */
teasp.helper.EkitanRoutes = function(routes){
	// 経路情報クラスのインスタンスを作成
	this.routes = new Array();
	for(var i = 0 ; i < routes.length ; i++){
		this.routes.push(new teasp.helper.EkitanRoute(routes[i]));
	}
};

/**
 * 経路情報の数を返す
 * @returns {number}
 */
teasp.helper.EkitanRoutes.prototype.getRouteCount = function(){
	return this.routes.length;
};

/**
 * 経路情報の配列を返す
 * @returns {Array.<teasp.helper.EkitanRoute>}
 */
teasp.helper.EkitanRoutes.prototype.getRoutes = function(){
	return this.routes;
};

/**
 * 経路情報を返す
 * @param {number} index
 * @returns {teasp.helper.EkitanRoute|null}
 */
teasp.helper.EkitanRoutes.prototype.getRoute = function(index){
	return (index < this.routes.length ? this.routes[index] : null);
};

/**
 * インスタンスの破棄
 */
teasp.helper.EkitanRoutes.prototype.destroy = function(){
	dojo.forEach(this.routes, function(route){
		route.destroy();
	});
};

//--------------------------------------------------------------------
/**
 * 経路クラス
 * @param {Object} route
 */
teasp.helper.EkitanRoute = function(route){
	this.route = route;
	this.fare = route.fare;
	this.fareIc = route.fareIc;
	this.commuterCode = route.commuterCode;
	this.commuterFare = route.commuterFare;
	this.lines = new Array();
    this.groups = new teasp.helper.EkitanGroups();
	this.handles = new Array();
	if(route.lines[0].fareGroupId){
		this.buildNormal(route);
	}else{
		this.buildLegacy(route);
	}
	this.recalc();
};

/**
 * 金額を出力
 * @param {number|null} fare
 * @returns {string}
 */
teasp.helper.EkitanRoute.formatFare = function(fare){
	return teasp.util.currency.formatMoney(fare, '#,##0円');
};

/**
 * 路線クラスのインスタンス作成とグルーピング
 * （fareGroupId をサーバを返してくれる前提）
 * @param {Object} route 路線情報
 */
teasp.helper.EkitanRoute.prototype.buildNormal = function(route){
	for(var i = 0 ; i < route.lines.length ; i++){
		var line = new teasp.helper.EkitanLine(route.lines[i]);
		this.lines.push(line);
		this.groups.addGroup(i, line);
	}
};

/**
 * 路線クラスのインスタンス作成とグルーピング
 * fareGroupId がない旧仕様の経路情報を扱う場合。
 * ※特急料金を変更する操作は行われないはずで、厳密なグルーピングは不要だが
 * 一応何があるかわからないため旧ロジックを改良してグルーピングしている。
 * @param {Object} route 路線情報
 */
teasp.helper.EkitanRoute.prototype.buildLegacy = function(route){
	var seq = 1;
	var fgId = null;
	var railKind = null;
	for(var i = 0 ; i < route.lines.length ; i++){
		var line = new teasp.helper.EkitanLine(route.lines[i]);
		this.lines.push(line);
		if(line.getFare() !== null){ // fare がある Line に fareGroupId をセット
			fgId = 'f' + (seq++);
			line.setFareGroupId(fgId);
			this.groups.addGroup(i, line);
		}
		railKind = line.getRailKind();
	}
	// fare がない Line に fareGroupId をセット。
	// 後方からグルーピングする
	for(i = this.lines.length - 1 ; i >= 0 ; i--){
		var line = this.lines[i];
		if(line.getGroup() !== null){
			fgId = line.getFareGroupId();
		}else{
			if(railKind != line.getRailKind()){
				fgId = 'f' + (seq++);
			}
			line.setFareGroupId(fgId);
			this.groups.addGroup(i, line);
		}
		railKind = line.getRailKind();
	}
};

/**
 * 経路情報をテーブルに配置しやすいパーツに分解する
 * （この後の経路情報からテーブルDOMを作成メソッドの中から呼ばれる）
 * @returns {Array.<Object>}
 */
teasp.helper.EkitanRoute.prototype.createItems = function(){
	var items = new Array();
	for(var i = 0 ; i < this.lines.length ; i++){
		var o = this.lines[i];
		var fare = o.getFare(i);
		// 途中の運賃が 0円の場合は非表示になるようにする（徒歩など）
		fare = ((i > 0 && !fare) ? '' : teasp.helper.EkitanRoute.formatFare(fare));
		items.push({
			top    : o.getFrom(),
			fare   : fare,
			css    : 'station',
			line   : o
		});
		items.push({
			top    : teasp.message.getLabel('tm20009100', o.getLineName()), // --({0})--
			css    : 'way',
			charges: o.getCharges(),
			line   : o
		});
		var n = (i < (this.lines.length - 1) ? this.lines[i + 1] : null);
		if(!n){
			items.push({
				top    : o.getTo(),
				css    : 'station',
				last   : true,
				line   : o
			});
		}
	}
	return items;
};

/**
 * 駅名、路線名をつなげたものをテキストで返す
 * {駅名}→{駅名}→{駅名}
 * @returns {string}
 */
teasp.helper.EkitanRoute.prototype.createSimpleText = function(){
	var vs = new Array();
	for(var i = 0 ; i < this.lines.length ; i++){
		var line = this.lines[i];
		vs.push(line.getFrom());
		vs.push(teasp.message.getLabel('tm20009110')); // →
		if(i >= (this.lines.length - 1)){
			vs.push(line.getTo());
		}
	}
	return vs.join('');
};

/**
 * 駅名、路線名をつなげたものをテキストで返す
 * {駅名}→{駅名}→{駅名}
 * @returns {string}
 */
teasp.helper.EkitanRoute.prototype.createSimpleText2 = function(){
    var vs = new Array();
	for(var i = 0 ; i < this.lines.length ; i++){
		var line = this.lines[i];
		vs.push(line.getFrom());
		vs.push('-(');
		vs.push(line.getLineName());
		vs.push(')-');
		if(i >= (this.lines.length - 1)){
			vs.push(line.getTo());
		}
	}
	return vs.join('');
};

/**
 * 駅名、路線名をつなげたものをテキストで返す（デバッグ用）
 * @param {boolean=} flag trueの場合、運賃も入れ込む
 * @returns {string}
 */
teasp.helper.EkitanRoute.prototype.createText = function(flag){
	var texts = new Array();
	for(var i = 0 ; i < this.lines.length ; i++){
		var o = this.lines[i];
		texts.push(o.getFrom());
		var fare = o.getFare(i);
		if(flag && fare !== null){
			texts.push('(' + fare + ')');
		}
		texts.push('--');
		texts.push(o.getLineName());
		if(flag && o.getCharges().length){
			var cs = new Array();
			dojo.forEach(o.getCharges(), function(c){
				cs.push(c.name + (c.use ? '*' : '') + ':' + c.charge);
			});
			texts.push('[' + cs.join(',') + ']');
		}
		texts.push('--');
		if(i >= (this.lines.length - 1)){
			texts.push(o.getTo());
		}
	}
	return 'total:' + this.getFare() + ' ' + texts.join('');
};

/**
 * 経路情報からテーブルDOMを作成
 * @param {Object} attrs
 * @returns {Object} tableのDOMを返す
 */
teasp.helper.EkitanRoute.prototype.createTable = function(attrs){
	var items = this.createItems(); // パーツに分解
	var table = dojo.create('table', { id:(attrs.tableId || null), className:'ekitan_route' });
	var tbody = dojo.create('tbody', null, table);
	var tr1 = dojo.create('tr', null, tbody);
	var tr2 = dojo.create('tr', null, tbody);
	for(var i = 0 ; i < items.length ; i++){
		var item = items[i];
		dojo.create('td', { className:item.css, innerHTML:item.top }, tr1);
		var td = dojo.create('td', { className:'under' }, tr2);
		if(item.charges && item.charges.length){
			if(attrs.readOnly){
				var o = item.line.getCurChargeObj();
				dojo.create('span', {
					innerHTML: '（' + (o.name || '') + ' ' + teasp.helper.EkitanRoute.formatFare(o.charge) + ')',
					style    : 'font-size:95%;color:red;'
				}, td);
			}else{
				dojo.place(this.createSelect(item, attrs), td);
			}
		}else if(item.fare){
			td.innerHTML = item.fare;
			td.className += ' fare-' + item.line.getFareGroupId();
		}else{
			td.innerHTML = (item.last
					? teasp.message.getLabel('tm20009120') // *
					: teasp.message.getLabel('tm20009110') // →
					);
		}
	}
	// 金額を表示するためのコールバック関数があれば、それを呼ぶ
	if(attrs.changedFare){
		attrs.changedFare(teasp.helper.EkitanRoute.formatFare(this.getFare()));
	}
	return table;
};

/**
 * 特急料金のプルダウンを作成
 * @param {Object} item
 * @param {Object} attrs
 * @returns {Object}
 */
teasp.helper.EkitanRoute.prototype.createSelect = function(item, attrs){
	var select = dojo.create('select');
	for(var i = 0 ; i < item.charges.length ; i++){
		var c = item.charges[i];
		dojo.create('option', {
			innerHTML: c.name + ' ' + teasp.helper.EkitanRoute.formatFare(c.charge),
			value    : c.name,
			selected : c.use
		}, select);
	}
	// 変更のイベントハンドラをセット
	this.handles.push(dojo.connect(select, 'onchange', this, this.changeCharge(item.line, attrs)));
	return select;
};

/**
 * 特急料金変更イベント処理（クロージャ）
 * @param {Object} item
 * @param {Object} attrs
 */
teasp.helper.EkitanRoute.prototype.changeCharge = function(line, attrs){
	return dojo.hitch(this, function(e){
		line.changeCharge(e.target.value);
		this.recalc(); // 金額再計算
		// 再計算後の金額を出力
		dojo.query('.fare-' + line.getFareGroupId(), attrs.tableId).forEach(function(el){
			el.innerHTML = teasp.helper.EkitanRoute.formatFare(line.getGroupFare());
		});
		if(attrs.changedFare){
			attrs.changedFare(teasp.helper.EkitanRoute.formatFare(this.getFare()));
		}
	});
};

/**
 * 特急料金変更（ユニットテスト用）
 * @param {number} index
 * @param {string} name
 */
teasp.helper.EkitanRoute.prototype.changeChargeSimple = function(index, name){
	var line = this.lines[index];
	line.changeCharge(name);
	this.recalc(); // 金額再計算
};

/**
 * 特急料金候補を返す（ユニットテスト用）
 * @returns {Object}
 */
teasp.helper.EkitanRoute.prototype.getChargeInfo = function(){
	var map = {};
	for(var i = 0 ; i < this.lines.length ; i++){
		var line = this.lines[i];
		if(line.getCharges().length){
			map[i] = line.getCharges();
		}
	}
	return map;
};

/**
 * インスタンスの破棄
 */
teasp.helper.EkitanRoute.prototype.destroy = function(){
	for(var i = 0 ; i < this.handles.length ; i++){
		dojo.disconnect(this.handles[i]);
	}
	this.handles = new Array();
};

/**
 * 金額を再計算
 */
teasp.helper.EkitanRoute.prototype.recalc = function(){
	this.groups.recalc();
	this.route.fare = this.getFare();
};

/**
 * 経路の金額を返す
 * @returns {number}
 */
teasp.helper.EkitanRoute.prototype.getFare = function(){
	return this.groups.getFare();
};

/**
 * 経路の金額を返す
 * @param {boolean=} roundTrip trueの場合、往復運賃と片道運賃を表示
 * @returns
 */
teasp.helper.EkitanRoute.prototype.getFareEx = function(roundTrip){
	if(roundTrip){
		var fare = this.getFare();
		return teasp.helper.EkitanRoute.formatFare(fare * 2)
			+ '<br/>'
			+ teasp.message.getLabel('tm20001320', teasp.helper.EkitanRoute.formatFare(fare));
	}else{
		return teasp.helper.EkitanRoute.formatFare(this.getFare());
	}
};

teasp.helper.EkitanRoute.prototype.getCommuterCode = function(){
	return this.commuterCode;
};

teasp.helper.EkitanRoute.prototype.getCommuterFare = function(form){
	return teasp.util.currency.formatMoney(this.commuterFare, form);
};

/**
 * 経路オブジェクトを返す。
 * （特急料金の変更が反映されたJSONオブジェクトを返す。DB保存用）
 * @returns {Object}
 */
teasp.helper.EkitanRoute.prototype.getRouteObj = function(){
	return this.route;
};

teasp.helper.EkitanRoute.prototype.getLines = function(){
	return this.lines;
};

teasp.helper.EkitanRoute.prototype.getLine = function(index){
	return (index < this.lines.length ? this.lines[index] : null);
};

//--------------------------------------------------------------------
/**
 * ラインクラス
 */
teasp.helper.EkitanLine = function(line){
	this.line = line;
	this.groupId     = line.groupId;
	this.lineName    = line.lineName; // 路線名
	this.railKind    = line.railKind; // 路線種別
	this.stationFrom = line.stationFrom; // 発駅名
	this.stationTo   = line.stationTo; // 着駅名
	this.fareGroupId = line.fareGroupId || null; // fare の属性の groupId
	this.charges     = line.charges || []; // 特急料金候補
	this.fare        = (typeof(line.fare) == 'number' ? line.fare : null); // 運賃
	this.fareIc      = (typeof(line.fareIc) == 'number' ? line.fareIc : null); // IC運賃
	this.kind        = line.kind || null; // 列車種別
	this.curCharge   = 0; // 現在選択中の特急料金
	for(var i = 0 ; i < this.charges.length ; i++){
		var c = this.charges[i];
		if(c.use){
			this.curCharge = c.charge;
		}
	}
};

teasp.helper.EkitanLine.prototype.getFrom = function(){ return this.stationFrom; }; // 発駅名
teasp.helper.EkitanLine.prototype.getTo = function(){ return this.stationTo; }; // 着駅名
teasp.helper.EkitanLine.prototype.getRailKind = function(){ return this.railKind; }; // 路線種別
teasp.helper.EkitanLine.prototype.getLineName = function(){ return this.lineName; }; // 路線名
teasp.helper.EkitanLine.prototype.getCharges = function(){ return this.charges; }; // 特急料金候補
teasp.helper.EkitanLine.prototype.getCharge = function(index){ return this.charges[index]; }; // 特急料金候補

teasp.helper.EkitanLine.prototype.getFareGroupId = function(){
	return this.fareGroupId;
};

teasp.helper.EkitanLine.prototype.setFareGroupId = function(fareGroupId){
	this.fareGroupId = fareGroupId;
};

/**
 * 特急料金を変更した
 * @param {string} name
 */
teasp.helper.EkitanLine.prototype.changeCharge = function(name){
	for(var i = 0 ; i < this.charges.length ; i++){
		var c = this.charges[i];
		if(c.name == name){
			this.curCharge = c.charge;
			c.use = true;
		}else{
			c.use = false;
		}
	}
};

/**
 * 現在選択中の特急料金
 * @returns {number}
 */
teasp.helper.EkitanLine.prototype.getCurCharge = function(){
	return this.curCharge;
};

/**
 * 現在選択中の特急料金情報
 * @returns {Object}
 */
teasp.helper.EkitanLine.prototype.getCurChargeObj = function(){
	for(var i = 0 ; i < this.charges.length ; i++){
		var c = this.charges[i];
		if(c.use){
			return c;
		}
	}
	return {};
};

/**
 * ラインの料金
 * @param {number=} index 省略なら単純に設定されている料金を返す。
 * 		非省略ならこのラインがグループの先頭にある時だけグループの金額を返す
 * @returns {number}
 */
teasp.helper.EkitanLine.prototype.getFare = function(index){
	if(index === undefined){
		return this.fare;
	}
	return this.group.getFare(index);
};

teasp.helper.EkitanLine.prototype.setFare = function(fare){
	this.fare = this.line.fare = fare;
};

/**
 * グループを返す
 * @returns {teasp.helper.EkitanGroup|null}
 */
teasp.helper.EkitanLine.prototype.getGroup = function(){
	return this.group || null;
};

/**
 * グループをセット
 * @param {teasp.helper.EkitanGroup}
 */
teasp.helper.EkitanLine.prototype.setGroup = function(group){
	this.group = group;
};

/**
 * グループに属していればグループの金額を、それ以外はラインの金額を返す
 * @returns {number|null}
 */
teasp.helper.EkitanLine.prototype.getGroupFare = function(){
	if(this.group){
		return this.group.getFare();
	}
	return this.fare;
};

//--------------------------------------------------------------------
/**
 * 路線グループ集合クラス
 * 路線(line)をグループ化して扱うためのもの。
 * 路線に運賃(fare)があるもの＝１グループ
 * 運賃がない路線（特に特急料金のある路線）は運賃のあるグループに紐づける必要がある。
 * (例)
 * 路線1(運賃) - 路線2(特急料金) - 路線3(運賃)
 * 路線1 は1つめのグループ、路線3 は2つめのグループとなることがまず決まる。
 * 路線2 は 運賃 がないので、1つめか2つめどちらかのグループに属させる。
 */
teasp.helper.EkitanGroups = function(){
	this.fare = 0;
	this.map = {};
	this.summaried = false;
};

/**
 * fareGroupId で寄せたグループを作り、Line を追加
 * @param {number} index
 * @param {number} groupIndex
 * @param {teasp.helper.EkitanLine} line 路線クラス
 */
teasp.helper.EkitanGroups.prototype.addGroup = function(index, line){
	var fg = line.getFareGroupId();
	var group = this.map[fg];
	if(!group){
		group = this.map[fg] = new teasp.helper.EkitanGroup(index, line);
	}else{
		group.add(index, line);
	}
	this.summaried = false;
};

/**
 * グループ内の情報を整理する（グループ内の基本金額の計算も行う）
 */
teasp.helper.EkitanGroups.prototype.summary = function(){
	for(var key in this.map){
		var group = this.map[key];
		group.summary();
	}
	this.summaried = true;
};

/**
 * 合計金額を再計算する
 * @returns {number} グループの金額
 */
teasp.helper.EkitanGroups.prototype.recalc = function(){
	if(!this.summaried){
		this.summary();
	}
	this.fare = 0;
	for(var key in this.map){
		var group = this.map[key];
		this.fare += group.recalc();
	}
	return this.fare;
};

/**
 * 合計金額を返す
 * @returns {number}
 */
teasp.helper.EkitanGroups.prototype.getFare = function(){
	return this.fare;
};

//--------------------------------------------------------------------
/**
 * 路線グループクラス
 * @param {number} groupIndex
 * @param {number} index
 * @param {teasp.helper.EkitanLine} line
 */
teasp.helper.EkitanGroup = function(index, line){
	this.indexes = new Array();
	this.map = {};
	this.fare = null;
	this.fareLine = null;
	this.baseFare = 0;
	this.fareGroupId = line.getFareGroupId();
	this.add(index, line);
};

/**
 * グループに路線を追加
 * @param {number} index
 * @param {teasp.helper.EkitanLine} line 路線
 */
teasp.helper.EkitanGroup.prototype.add = function(index, line){
	this.indexes.push(index);
	this.map[index] = line;
	if(line.getFare() !== null){
		this.fare = line.getFare();
		if(!this.fareLine){
			this.fareLine = line;
		}
	}
	line.setGroup(this);
};

/**
 * fareGroupId を返す
 * @returns {number}
 */
teasp.helper.EkitanGroup.prototype.getFareGroupId = function(){
	return this.fareGroupId;
};

/**
 * グループの金額を返す。
 * @param {number=} index 省略の場合、グループの金額を返す。
 * 		非省略の場合、index が this.indexes 配列の先頭の値に一致すれば、グループの金額を返し、そうでなければ、null を返す。
 * @returns
 */
teasp.helper.EkitanGroup.prototype.getFare = function(index){
	if(index === undefined){
		return this.fare;
	}
	for(var i = 0 ; i < this.indexes.length ; i++){
		if(this.indexes[i] == index && i == 0){
			return this.fare;
		}
	}
	return null;
};

/**
 * this.indexes を昇順ソート。
 * グループの金額から特急料金を引き算して、基本金額（baseFare）を求める。
 */
teasp.helper.EkitanGroup.prototype.summary = function(){
	this.indexes = this.indexes.sort(function(a, b){ return (a - b); });
	this.baseFare = 0;
	var cc = 0;
	for(var key in this.map){
		var line = this.map[key];
		cc += line.getCurCharge();
	}
	this.baseFare = (this.fare || 0) - cc;
};

/**
 * 特急料金変更後の金額を再計算する。
 * @returns {number}
 */
teasp.helper.EkitanGroup.prototype.recalc = function(){
	var cc = 0;
	for(var key in this.map){
		var line = this.map[key];
		cc += line.getCurCharge();
	}
	this.fare = this.baseFare + cc;
	if(this.fareLine){
		this.fareLine.setFare(this.fare);
	}
	return this.fare;
};
