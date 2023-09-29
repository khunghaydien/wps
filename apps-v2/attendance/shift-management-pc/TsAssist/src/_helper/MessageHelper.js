import {MessageResource} from "./MessageResource.js?v=XVERSIONX";
/**
 * メッセージ共通クラス
 */
export class MessageHelper {
    constructor(domHelper, labels){
        this.domH = domHelper;
        // this.legacyLabels = labels;
        this.legacyLabels = globalMessages;
        this.labels = MessageResource.getAll();
        this.langMode = 0;
    }
    setLangMode(v){
        this.langMode = v;
    }
    get(...args){
        const o = this.labels[args[0]];
        let msg = (o && (!this.langMode ? (o.jp || o.en) : (o.en || o.jp))) || '';
        for(let i = 1 ; i < args.length ; i++){
            msg = msg.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), args[i]);
        }
        return msg;
    }
    setLabel(node, labelId){
        const o = this.labels[labelId] || null;
        if(o){
            node.innerHTML = (!this.langMode ? (o.jp || o.en) : (o.en || o.jp));
        }
    }
    setLabelById(id, labelId){
        const node = this.domH.byId(id);
        if(node){
            const o = (labelId && this.labels[labelId]) || this.labels[id] || null;
            if(o){
                node.innerHTML = (!this.langMode ? (o.jp || o.en) : (o.en || o.jp));
            }
        }
    }
    // レガシー
    getLabel(){
        let b = "", a = arguments;
        if (a[0]){
            b = (this.legacyLabels[a[0]] || '');
        }
        for (let i = 1; i < a.length; i++){
            b = b.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), a[i]);
        }
        return b;
    }
    parseErrorMessage(errobj){
        var ep = errobj;
        if(typeof(ep) == 'object'){
            if(ep.status && typeof(ep.result) == 'object'){
                ep = ep.result;
            }
            if(ep.error && typeof(ep.error) == 'object'){
                ep = ep.error;
            }
            if(ep.messageId){
                return this.getLabel(ep.messageId, this.convertArgs(ep.args));
            }else{
                return (ep.message || ep.name || 'Error');
            }
        }else{
            return (ep || 'Error');
        }
    }
    convertArgs(args){
        if(!args || typeof(args) != 'object'){
            return [];
        }
        if(Array.isArray(args)){
            return args;
        }
        var res = [];
        for(var key in args){
            res[parseInt(key, 10)] = args[key];
        }
        return res;
    }
    getStatus(status){
        switch(status){
            case '未確定'  : return this.get('NotConfirmed');
            case '確定取消': return this.get('CancelFinalize');
            case '申請取消': return this.get('CancelRequest');
            case '却下'    : return this.get('Reject');
            case '却下済み': return this.get('Rejected');
            case '承認待ち': return this.get('ApprovalPending');
            case '確定済み': return this.get('Finalized');
            case '承認済み': return this.get('Approved');
            default: return '';
        }
    }
}