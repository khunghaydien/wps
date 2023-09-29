import {DomHelper}       from "./_helper/DomHelper.js?v=XVERSIONX";
import {MessageHelper}   from "./_helper/MessageHelper.js?v=XVERSIONX";
import {HintHelper}      from "./_helper/HintHelper.js?v=XVERSIONX";
import {BlockingUI}      from "./_helper/BlockingUI.js?v=XVERSIONX";
import {CornerMenu}      from "./_common/CornerMenu.js?v=XVERSIONX";
import {MessageBox}      from "./_common/MessageBox.js?v=XVERSIONX";

/**
 * TsaMainクラス
 * 各種ヘルパーのインスタンスを保持
 * 共通で使用する機能を実装
 */
export class TsaMain {
    constructor(initParam){
        this.initParam = initParam;
        this.domHelper     = new DomHelper();
        this.messageHelper = new MessageHelper(this.domHelper, initParam.messageTable);
        this.hintHelper    = new HintHelper(this.domHelper, this.baseId);
        this.mainView = null;
        this.dialogSeqNo = 1;
        this.popupStay = false;
        this.user = (this.initParam.initRes && this.initParam.initRes.user) || {};
        this.organization = (this.initParam.initRes && this.initParam.initRes.organization.length && this.initParam.initRes.organization[0]) || {};
        this.tsVersion = (this.initParam.initRes && this.initParam.initRes.tsVersion) || '';
        this.setLangMode(this.user.LanguageLocaleKey == 'en_US' ? 1 : 0);
    }
    get domH(){ return this.domHelper; }
    get msgH(){ return this.messageHelper; }
    get hintH(){ return this.hintHelper; }
    get baseId(){ return this.initParam.baseId; }

    getNewDialogId(){
        return 'TSP_DIALOG_' + (this.dialogSeqNo++);
    }
    closeDialogAll(){
        this.domH.byId(this.baseId).querySelectorAll('.tsa-dialog-p').forEach((el) => {
            el.dispatchEvent(new Event('close'));
        });
    }
    removeHintAll(){
        this.hintH.removeHintAll();
    }
    setMainView(view){
        this.mainView = view;
        this.showOrganization();
        this.showTsVersion();
    }
    getArgs(){
        const args = {};
        location.search.split(/[?&]/).forEach((arg) => {
            const p = arg.split('=');
            if(p[0]){
                args[p[0]] = (p.length > 1 && p[1]) || null;
            }
        });
        return args;
    }
    checkArgs(){
        const args = this.getArgs();
        return (args.view == '2' || args.view == '3' || args.leave == '1');
    }
    isLeaveView(){
        const args = this.getArgs();
        return (args.leave == '1');
    }
    showOrganization(){
        this.domH.byId('TsaOrganization').innerHTML =
                `<span>${this.msgH.get('LabelOrganizationId')}: </span>${this.organization.Id}
                <span>${this.msgH.get('LabelOrganizationName')}: </span>${this.organization.Name}`;
    }
    showTsVersion(){
        this.domH.byId('TsaVersion').innerHTML = this.tsVersion;
    }
    isLangModeJp(){
        return (this.langMode == 0);
    }
    setLangMode(v){
        this.langMode = v;
        this.msgH.setLangMode(v);
        this.hintH.setLangMode(v);
    }
    blockingUI(flag, message){
        BlockingUI.show(flag, (message || this.msgH.get('msg2000010')));
    }
    hideError(){
        if(this.mainView){
            this.mainView.hideError();
        }
    }
    showError(err){
        if(this.mainView){
            this.mainView.showError(err);
        }
    }
    setDefaultHash(){
        if(this.mainView){
            this.mainView.setDefaultHash();
        }
    }
    showCornerMenu(e){
        (new CornerMenu(this)).open(e.target, 'CornerMenu').catch(()=>{});
    }
    messageBox(viewParam){
        return (new MessageBox(this, viewParam)).open();
    }
    simpleAlert(message, caption){
        const viewParam = {
            message: message,
            caption: caption,
            okOnly: true
        };
        (new MessageBox(this, viewParam)).open().then(() => {}, () => {});
    }
}