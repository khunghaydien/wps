import {Util}       from "../../_common/Util.js?v=XVERSIONX";
/**
 * 
 */
export class FieldUtil {
    static getLabelsByNames(sObjManager, names, flag){
        const labels = [];
        let cnt = 0;
        const MAX_CNT = 5;
        names.forEach(name => {
            const sObject = sObjManager.getByName(name);
            if(sObject){
                if(labels.length < MAX_CNT){
                    if(flag){
                        labels.push(`<a href="#!sobj-search:${sObject.name.toLowerCase()}" target="_blank">${sObject.label}</a>`);
                    }else{
                        labels.push(sObject.label);
                    }
                }
                cnt++;
            }
        });
        if(cnt > MAX_CNT){
            labels.push(`...他(計${cnt}個)`);
        }
        return labels;
    }
    static getPickList(field, flag){
        const picklistValues = (field.picklistValues || []);
        const pickList = [];
        const len = picklistValues.length;
        picklistValues.splice(0, (flag ? 100 : len)).forEach((values) => {
            pickList.push(values[0]);
        });
        if(flag && len > 100){
            pickList.push('※100件に達したため打ち切り※');
        }
        return pickList;
    }
    static getFieldTypeName(sObjManager, msgH, field, flag){
        let typeName = '';
        let subName = '';
        if(field.isAutoNumber){
            typeName = msgH.get('TypeAutoNumber');
        }else if(field.typeName == 'DATE'){
            typeName = msgH.get('TypeDate');
        }else if(field.typeName == 'DATETIME'){
            typeName = msgH.get('TypeDateTime');
        }else if(field.typeName == 'DOUBLE' || field.typeName == 'CURRENCY' || field.typeName == 'PERCENT'){
            typeName = (field.typeName == 'DOUBLE' ? msgH.get('TypeNumber') : (field.typeName == 'CURRENCY' ? msgH.get('TypeCurrency') : msgH.get('TypePercent')));
            subName = `${(field.precision - field.scale)}, ${field.scale}`;
        }else if(field.typeName == 'STRING'){
            typeName = msgH.get('TypeText');
            subName = field.length;
        }else if(field.typeName == 'TEXTAREA'){
            typeName = (field.length < 256 ? msgH.get('TypeTextArea') : msgH.get('TypeLongTextArea'));
            subName = field.length;
        }else if(field.typeName == 'BOOLEAN'){
            typeName = msgH.get('TypeCheckbox');
        }else if(field.typeName == 'REFERENCE'){
            typeName = (!field.isNillable && field.isCustom ? msgH.get('TypeMasterDetail') : msgH.get('TypeLookup'));
            const labels = this.getLabelsByNames(sObjManager, field.referenceTo, !flag);
            subName = labels.join('、');
        }else if(field.typeName == 'PICKLIST'){
            typeName = msgH.get('TypePicklist');
        }else if(field.typeName == 'MULTIPICKLIST'){
            typeName = msgH.get('TypePicklistMulti');
        }else{
            typeName = field.typeName;
        }
        if(field.isCalculated){
            subName = typeName;
            typeName = msgH.get('TypeFormula');
        }
        let name = (subName ? `${typeName}(${subName})` : typeName);
        if(field.isExternalID){
            name += msgH.get('TypeExternalId');
        }
        if(!flag){
            const p = [];
            if(field.isUnique){
                p.push(msgH.get('TypeUnique'));
            }
            if(field.isCaseSensitive){
                p.push(msgH.get('TypeCaseSensitive'));
            }
            if(p.length){
                name += `(${p.join('、')})`;
            }
        }
        return name;
    }
    static createFieldDom(domH, parentNode, field, value, readOnly, width){
        const els = [];
        if(field.typeName == 'BOOLEAN'){
            els.push(domH.create('input', { type:'checkbox' }, parentNode));
        }else if(field.typeName == 'DATE' || field.typeName == 'DATETIME'){
            els.push(domH.create('input', { type:'date' }, parentNode));
            if(field.typeName == 'DATETIME'){
                els.push(domH.create('input', { type:'time', step:1, style:'margin-left:8px;' }, parentNode));
            }
        }else if(field.typeName == 'PICKLIST' || field.typeName == 'MULTIPICKLIST'){
            const el = domH.create('select', { style:'min-width:120px;' }, parentNode);
            els.push(el);
            if(width){
                el.style.maxWidth = width + 'px';
            }
            domH.create('option', { values:'', innerHTML:'' }, el);
            (field.picklistValues || []).forEach((plvs) => {
                domH.create('option', { values:plvs[0], innerHTML:plvs[1] }, el);
            });
        }else if(field.typeName == 'TEXTAREA' || (field.typeName == 'STRING' && field.length > 80)){
            const el = domH.create('textarea', { style:`width:${(width ? width : 420)}px;height:80px;`, maxLength:field.length }, parentNode);
            els.push(el);
            if(width){
                el.style.maxWidth = `${width}px`;
            }
        }else if(field.typeName == 'STRING'){
            const el = domH.create('input', { type:'text' }, parentNode);
            els.push(el);
            domH.setAttr(el, 'maxLength', field.length);
            domH.setAttr(el, 'style', `width:${(field.length < 20 ? 180 : (width ? width : 420))}px;`);
        }else if(field.typeName == 'REFERENCE'){
            els.push(domH.create('input', { type:'text', maxLength:18, style:'width:180px;' }, parentNode));
        }else if(field.typeName == 'DOUBLE' || field.typeName == 'CURRENCY'){
            els.push(domH.create('input', { type:'text', style:'width:120px;text-align:right;' }, parentNode));
        }else{
            els.push(domH.create('input', { type:'text', style:`width:${(width ? width : 420)}px;` }, parentNode));
        }
        this.setNodeValue(els, field, value);
        els.forEach((el) => {
            domH.setAttr(el, 'disabled', readOnly);
        });
        return els;
    }
    static setNodeValue(els, field, value){
        if(field.typeName == 'BOOLEAN'){
            els[0].checked = (value ? true : false);
        }else if(field.typeName == 'DATETIME'){
            let v = (value || '').split(/ /);
            els[0].value = (v.length > 0 ? Util.text(v[0]) : '');
            els[1].value = (v.length > 1 ? Util.text(v[1]) : '');
        }else{
            els[0].value = Util.text(value);
        }
    }
    static getNodeValue(els, field){
        if(field.typeName == 'BOOLEAN'){
            return els[0].checked;
        }else if(field.typeName == 'DATETIME'){
            if(els[0].value && els[1].value){
                return els[0].value + ' ' + els[1].value;
            }
            return null;
        }else if(field.typeName == 'DOUBLE' || field.typeName == 'CURRENCY'){
            const v = els[0].value.trim();
            if(/[+-]?\d+(?:\.\d+)?/.test(v)){
                return parseFloat(v);
            }
            return v || null;
        }else{
            return els[0].value.trim() || null;
        }
    }
}