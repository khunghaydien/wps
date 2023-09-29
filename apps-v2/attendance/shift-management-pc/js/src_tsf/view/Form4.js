/**
 * 仮払い申請フォーム
 *
 * @constructor
 */
teasp.Tsf.Form4 = function(){
    this.fp = teasp.Tsf.Fp.createFp(teasp.Tsf.formParams.form4);
    this.sections = [
        new teasp.Tsf.SectionProvisional(this, false, teasp.Tsf.SectionProvisional.TYPE1), // 仮払い申請セクション
        new teasp.Tsf.SectionExpAttach(this)       // 添付ファイルセクション
    ];
};

teasp.Tsf.Form4.prototype = new teasp.Tsf.FormBase();

teasp.Tsf.Form4.prototype.getFormStyle = function(){ return 4; };
