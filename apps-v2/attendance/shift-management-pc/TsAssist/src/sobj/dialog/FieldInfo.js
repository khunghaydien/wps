import {BaseDialog} from "../../_common/BaseDialog.js?v=XVERSIONX";
import {Util}       from "../../_common/Util.js?v=XVERSIONX";
import {FieldUtil}  from "../util/FieldUtil.js?v=XVERSIONX";
/**
 * 項目値の表示/編集ダイアログ
 */
export class FieldInfo extends BaseDialog {
    constructor(tsaMain, sObjManager, viewParam){
        super(tsaMain, viewParam);
        this.sObjManager = sObjManager;
        this.field = viewParam.field;
        this.record = viewParam.record || {};
        this.value = viewParam.value;
        this.define = viewParam.define;
        this.readOnly = (viewParam.readOnly ? true : false);
    }
    get fieldTypeName(){
        return FieldUtil.getFieldTypeName(this.sObjManager, this.msgH, this.field);
    }
    get editable(){
        return (this.record.Id && this.field.isUpdateable) || (!this.record.Id && this.field.isCreateable);
    }
    get dspEditable(){
        return this.msgH.get(this.editable ? 'LabelYes1' : 'LabelNo1');
    }
    get inlineHelpText(){
        return (this.field.inlineHelpText || '');
    }
    getContent(){
        return `
            <table class="tsa-card1">
                <tbody>
                    <tr><td>${this.msgH.get('LabelLabel')}    </td><td><div>${this.field.label}    </div></td></tr>
                    <tr><td>${this.msgH.get('LabelAPIName')}  </td><td><div>${this.field.name}     </div></td></tr>
                    <tr><td>${this.msgH.get('LabelDataType')} </td><td><div>${this.fieldTypeName}  </div></td></tr>
                    <tr><td>${this.msgH.get('LabelEditable')} </td><td><div>${this.dspEditable}    </div></td></tr>
                    <tr><td>${this.msgH.get('LabelHelpText')} </td><td><div>${this.inlineHelpText} </div></td></tr>
                    <tr><td id="FieldLastLabel">${this.msgH.get('LabelDataValue')}</td><td id="FieldInfoValue"></td></tr>
                </tbody>
            </table>
        `;
    }
    buildContent(){
        super.buildContent();
        const readOnly = (this.readOnly || !this.editable || this.define || this.record.IsDeleted) ? true : false;
        const vArea = this.domH.byId('FieldInfoValue');
        if(this.define){
            if(this.field.isCalculated || this.field.typeName == 'PICKLIST' || this.field.typeName == 'MULTIPICKLIST'){
                const el = this.domH.create('textarea', { style:'width:420px;height:80px;' }, vArea);
                this.domH.setAttr(el, 'disabled', true);
                if(this.field.isCalculated){
                    this.domH.byId('FieldLastLabel').innerHTML = this.msgH.get('LabelFormula');
                    el.value = Util.text(this.field.calculatedFormula);
                }else{
                    this.domH.byId('FieldLastLabel').innerHTML = this.msgH.get('LabelPicklist');
                    const vals = [];
                    (this.field.picklistValues || []).forEach((plvs) => { vals.push(plvs[1]); });
                    el.value = vals.join('\n');
                }
            }else{
                this.domH.byId('FieldLastLabel').innerHTML = '';
                this.domH.byId('FieldInfoValue').innerHTML = '';
            }
        }else{
            this.domH.byId('FieldLastLabel').innerHTML = this.msgH.get('LabelDataValue');
            FieldUtil.createFieldDom(this.domH, vArea, this.field, this.value, readOnly);
        }
    }
    ok(){
        const els = [];
        const vArea = this.domH.byId('FieldInfoValue');
        vArea.querySelectorAll('input,select,textarea').forEach((el) => {
            if(el.type != 'hidden'){
                els.push(el);
            }
        });
        if(els.length){
            this.resolve(FieldUtil.getNodeValue(els, this.field));
        }
        this.destroy();
    }
}