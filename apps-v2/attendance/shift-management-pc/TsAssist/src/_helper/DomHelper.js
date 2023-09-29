/**
 * DOM操作クラス
 */
export class DomHelper {
    constructor(){
        this.events = {};
        this.key = 1;
    }
    addListener(target, type, listener, capture){
        target = this.byId(target);
        if(target){
            target.addEventListener(type, listener, capture);
            this.events['' + this.key] = {
                target: target,
                type: type,
                listener: listener,
                capture: capture
            };
            return this.key++;
        }
        return null;
    }
    removeListener(key){
        var e = this.events['' + key];
        if(e){
            e.target.removeEventListener(e.type, e.listener, e.capture);
            delete this.events['' + key];
        }
    }
    once(target, type, listener){
        target = this.byId(target);
        if(target){
            target.addEventListener(type, listener, { once: true });
        }
        return null;
    }
    byId(tag){
        if(typeof(tag) == 'string' && tag){
            return document.getElementById(tag);
        }
        return tag || null;
    }
    empty(tag){
        if(tag){
            const node = this.byId(tag);
            while(node && node.lastChild){
                node.removeChild(node.lastChild);
            }
        }
    }
    /**
     * 
     * @param {DOMNode|String} tag 
     * @param Object} attrs 
     * @param {DOMNode|String} refNode 
     * @returns 
     */
    create(tag, attrs, refNode){
        const p = this.byId(refNode);
        const node = document.createElement(tag);
        if(attrs){
            this.setAttr(node, attrs);
        }
        if(p){
            p.appendChild(node);
        }
        return node;
    }
    /**
     * 
     * @param {DOMNode|String} node 
     * @param {String|Object} name 
     * @param {String} value 
     * @returns 
     */
    setAttr(node, name, value){
		node = this.byId(node);
		if(arguments.length == 2){ // inline'd type check
			// the object form of setter: the 2nd argument is a dictionary
			for(var x in name){
				this.setAttr(node, x, name[x]);
			}
			return node;
		}
        const propNames = {
            // properties renamed to avoid clashes with reserved words
            "class": "className",
            "for": "htmlFor",
            // properties written as camelCase
            tabindex: "tabIndex",
            readonly: "readOnly",
            colspan: "colSpan",
            frameborder: "frameBorder",
            rowspan: "rowSpan",
            textcontent: "textContent",
            valuetype: "valueType"
        };
        const forcePropNames = {
			innerHTML:	1,
			textContent:1,
			className:	1,
			htmlFor:	0,
			value:		1
		};
		const attrNames = {
			// original attribute names
			classname: "class",
			htmlfor: "for",
			// for IE
			tabindex: "tabIndex",
			readonly: "readOnly"
		};
		var lc = name.toLowerCase(),
			propName = propNames[lc] || name,
			forceProp = forcePropNames[propName];
		if(propName == "style"){
            // value は string
            node.style = value;
        }else if(propName == 'oh2'){
            node.innerHTML = value;
            node.title = value;
		}else if(forceProp || typeof(value) == "boolean" || typeof(value) == 'function'){
            node[propName] = value;
		}else{
            node.setAttribute(attrNames[lc] || name, value);
        }
		return node;
    }
    setStyle(node, name, value){
		node = this.byId(node);
        node.style[name] = value;
    }
    /**
     * 
     * @param {DomNode|string} node 
     * @param {string} classStr 
     * @param {boolean=} condition 
     */
    toggleClass(node, classStr, condition){
		node = this.byId(node);
        const exist = node.classList.contains(classStr);
        if(condition && !exist){
            node.classList.add(classStr);
        }else if(!condition && exist){
            node.classList.remove(classStr);
        }
    }
    /**
     * アンカータグにBlobデータをセット
     * @param {Object} atag アンカータグ
     * @param {boolean} flag =true:CSV形式 =false:テキスト
     * @param {string} fname ファイル名
     * @param {string} contents データ
     * @param {boolean=} auto true:ダウンロード実行
     */
    setDownloadLink(atag, flag, fname, contents, auto){
        let blob = null;
        if(flag){
            const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
            blob = new Blob([bom, contents], { type: "text/csv" });
        }else{
            blob = new Blob([contents], { type:"text/plain" });
        }
        if(window.navigator.msSaveBlob){
            if(auto){
                window.navigator.msSaveBlob(blob, fname);
            }else{
                this.addListener(atag, 'click', () => {
                    window.navigator.msSaveBlob(blob, fname);
                });
            }
        }else{
            var url = (window.URL || window.webkitURL).createObjectURL(blob);
            this.setAttr(atag, 'download', fname);
            this.setAttr(atag, 'href', url);
            if(auto){
                atag.click();
                setTimeout(function(){
                    (window.URL || window.webkitURL).revokeObjectURL(atag.href);
                }, 3000);
            }
        }
    }
    getAncestorByElements(el, els){
        let pel = null;
        let p = el;
        while(p != null){
            if((p.tagName || '').toUpperCase() == 'BODY'){
                break;
            }
            for(let i = 0 ; i < els.length ; i++){
                if((typeof(els[i]) == 'string' && p.id == els[i])
                || (typeof(els[i]) == 'object' && p == els[i])){
                    pel = p;
                    break;
                }
            }
            p = p.parentNode;
        }
        return pel;
    }
    getAncestorByTagName(el, tagName){
        let pel = null;
        let p = el;
        while(p != null){
            const tn = (p.tagName || '').toUpperCase();
            if(tn == 'BODY'){
                break;
            }
            if(tn == tagName){
                pel = p;
                break;
            }
            p = p.parentNode;
        }
        return pel;
    }
}