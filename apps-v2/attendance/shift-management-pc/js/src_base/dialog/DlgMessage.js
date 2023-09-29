teasp.provide('teasp.dialog.Message');
/**
 * メッセージダイアログ
 * @constructor
 * @extends teasp.dialog.Base
 */
teasp.dialog.Message = function(){
	this.title = "";
	this.duration = 10;
	this.content = '<table id="tsMessageTable"><tr>'
			+ '<td style="text-align:center;">'
			+ '<div id="tsMessageMain" style="font-size:12px;color:#3B40FF;"></div>'
			+ '<div id="tsMessageSub1" style="font-size:11px;color:#3B40FF;"></div>'
			+ '<div id="tsMessageSub2" style="font-size:11px;color:#3B40FF;"></div>'
			+ '</td><td style="padding-left:8px;"><input type="button" value="OK" class="std-button1" style="padding:1px 4px;" /></td></tr></table>';
	this.nohack = true;
};

teasp.dialog.Message.prototype = new teasp.dialog.Base();

/**
 *
 * @override
 */
teasp.dialog.Message.prototype.preStart = function(){
	dojo.query(".dijitDialogTitleBar", this.dialog.id)[0].style.display = 'none';

	var table = dojo.byId('tsMessageTable');
	dojo.style(table.parentNode, 'border', 'none');
	dojo.style(table.parentNode.parentNode, 'border', 'none');
	dojo.style(table.parentNode.parentNode, 'opacity', '0');

	dojo.connect(dojo.query('input[type="button"]', this.dialog.id)[0], 'onclick', this, function(){
		this.hide();
		this.onfinishfunc();
	});
};

/**
 *
 * @override
 */
teasp.dialog.Message.prototype.preShow = function(){
	if(!this.args.nomove){
		this.dialog._position = dojo.hitch(this.dialog, function(){
			var style = this.domNode.style;
			style.left = "180px";
			style.top  = "40px";
		});
	}
	dojo.byId('tsMessageMain').innerHTML = (this.args.msg || '');
	dojo.byId('tsMessageSub1').innerHTML = (this.args.sub1 || '');
	dojo.byId('tsMessageSub2').innerHTML = (this.args.sub2 || '');
	return true;
};
