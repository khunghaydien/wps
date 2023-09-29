/**
 * 検索条件
 * @typedef {Object} OutputZengin.SearchParams
 * @property {Date} baseDate 検索基準日(精算日)
 * @property {String} payeeType 支払種別 1:本人立替、2:請求書、3:法人カード、4:仮払い
 */

/**
 * 精算実行履歴
 * @typedef {Object} OutputZengin.ExpPayHistory
 * @property {DateTime} setPaidTime 精算実行日時
 * @property {Date} payDate 精算日
 * @property {String} setPaidActorName 精算実行者
 * @property {String} totalNumber 合計件数
 * @property {String} totalAmount 合計金額
 * @property {Array<String>} expIds 精算した経費IDリスト
 */

/**
 * 全銀データ出力ダイアログ
 * @param {{
 *      searchParams: OutputZengin.SearchParams
 *      expPayHistories: Array<OutputZengin.ExpPayHistory>
 * }} param 
 * @constructor
 */
teasp.Tsf.OutputZengin = function(param){
    this._dialog = null;

    /** @type {teasp.Tsf.OutputZengin.ExpPayHistoryTableRow} 精算履歴リスト */
    this._expPayHistoryRows = param.expPayHistories.map(function(expPayHist, idx){
        const param = {
            expPayHistory: expPayHist,
            isEven: idx%2 == 0
        }
        return new teasp.Tsf.OutputZengin.ExpPayHistoryTableRow(param);
    }) || [];

    /** @type {teasp.Tsf.OutputZengin.SearchParamsWrap} 検索条件 */
    this._searchParams = new teasp.Tsf.OutputZengin.SearchParamsWrap(param.searchParams);

    /** @type {teasp.Tsf.OutputZengin.ExpPayHistoryTableRow} 選択中の精算履歴 */
    this._selectedExpPayHistory = null;
    
    /** @type {String} 選択中の振込元 */
    this._selectedSourceAccount = null;

};

teasp.Tsf.OutputZengin.prototype = {
    /**
     * ダイアログ表示
     */
    show: function(){
        teasp.Tsf.Error.showError();
        if(!this._dialog){
            this._dialog = new dijit.Dialog({
                title       : teasp.message.getLabel('tk10000779') || '', // タイトル
                className   : 'ts-dialog-exp-item'
            });
            this._dialog.attr('content', this._getContent());
            this._dialog.startup();
            this._setEventHandler();
        }
        this._showData();
        this._validate();
        this._dialog.show();
    },

    /**
     * 全銀データ出力処理
     */
    output: function(){
        const target = this._searchParams.getTargetObjectName();
        const expids = this._selectedExpPayHistory.getExpIds();
        const payDate = this._selectedExpPayHistory.getPayDate('YYYY-MM-DD');
        const sourceAccountId = this._selectedSourceAccount;
        dojo.byId('payFormTarget').value          = target; // 支払種別 (ExpApply|EmpExp|ExpPreApply)
        dojo.byId('payFormExpApplyId').value      = expids.join(','); // 精算対象のID（カンマ区切り）
        dojo.byId('payFormPayDate').value         = payDate || ''; // 精算日
        dojo.byId('payFormSourceAccountId').value = sourceAccountId || ''; // 振込元（全銀口座マスター）のID
        dojo.attr('expPayForm', 'target', '_top');
        dojo.attr('expPayForm', 'action', teasp.getPageUrl('ebDataView')); // EBデータ出力のVisualforceページパス
        dojo.byId('expPayForm').submit();
    },
    
    /**
     * ダイアログを閉じる
     */
    hide: function(){
        if(this._dialog){
            this._dialog.hide();
            this._dialog.destroy();
            tsfManager.removeDialog('OutputZengin');
        }
    },
    
    /**
     * イベントハンドリングを設定する
     * @private
     */
    _setEventHandler: function(){
        const self = this;
    
        // ×ボタンを押された時
        dojo.connect(this._dialog, 'onCancel', function(){ 
            self.hide();
        });
        
        // 出力ボタンを押された時
        const outputButton = dojo.query('button.ts-dialog-ok')[0];
        dojo.connect(outputButton, 'onclick', function(){ 
            self.output(); 
        });
        
        // キャンセルボタンを押された時
        const cancelButton = dojo.query('button.ts-dialog-cancel')[0];
        dojo.connect(cancelButton, 'onclick', function(){
            self.hide(); 
        });

        // 行が選択された時
        self._expPayHistoryRows.forEach(function(expPayHist){
            expPayHist.setOnSelected(function(selected){
                self._selectedExpPayHistory = selected;
                self._validate();
            });
        });

        // 振込元が選択された時
        document.getElementById("zg-accounts").onchange = function(e){
            self._selectedSourceAccount = e.target.value;
            self._validate();
        };
    },

    /**
     * データ表示
     * 画面上のDOM要素にデータを流し込む
     * @private
     */
    _showData: function(){
        const self = this;

        // 表示条件ラベル
        const searchConditionsLabelElm = document.getElementById("search-conditions");
        searchConditionsLabelElm.innerHTML = teasp.message.getLabel('tk10007430', self._searchParams.getFormattedBaseDate(), self._searchParams.getPayeeTypeName());
        
        // 精算実行履歴の一覧
        const expPayHistoriesElm = document.getElementById("exp-histories");
        this._expPayHistoryRows.forEach(function(expPayHist){
            expPayHistoriesElm.appendChild(expPayHist.getDom());
        })
        if(this._expPayHistoryRows.length > 0){
            this._expPayHistoryRows[0].select(); // 初期表示時は一番上の精算履歴が選択される
        }

        // 振込元
        const zgAccountsSelect = document.getElementById("zg-accounts");
        /** @type {Array<{account: ZGAccount.account}>} */
        const zgAccounts = tsfManager.getZgAccounts();
        zgAccounts.forEach(function(zgAcc){
            const opt = document.createElement("option");
            opt.value = zgAcc.account.Id;
            opt.text = zgAcc.account.Name;
            zgAccountsSelect.appendChild(opt);
        })

    },

    /**
     * ダイアログ内のDOMを返す
     * @private
     */
    _getContent: function(){
        const labels = {
            tableHead: {
                thPayDate: teasp.message.getLabel('payDate_label'),
                thSetPaidTime: teasp.message.getLabel('tf10011080'),
                setPaidActorName: teasp.message.getLabel('tf10011070'),
                totalNumber: teasp.message.getLabel('tk10007440'),
                totalAmount: teasp.message.getLabel('tf10001110')
            },
            sourceAccount: teasp.message.getLabel('tk10000786'),
            button: {
                output: teasp.message.getLabel('output_btn_title'),
                cancel: teasp.message.getLabel('cancel_btn_title')
            }
        }

        const contentWrap = document.createElement('div');
        contentWrap.className = "ts-dialog ts-message";

        contentWrap.innerHTML =         
            '<div id="output-zengin-dialog-content" class="ts-section-form">' +
                '<!-- 精算実行履歴の表示条件 -->' +
                '<label id="search-conditions"></label>' +
                '<!-- 精算実行履歴の一覧 -->' +
                '<table class="scrollable-table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th style="width: 24px;">' +
                            '</th>' +
                            '<th style="width: 180px; cursor: pointer;">' +
                                '<div>' + labels.tableHead.thPayDate + '</div>' +
                            '</th>' +
                            '<th style="width: 180px; cursor: pointer;">' +
                                '<div>' + labels.tableHead.thSetPaidTime + '</div>' +
                            '</th>' +
                            '<th style="width: 180px; cursor: pointer;">' +
                                '<div>' + labels.tableHead.setPaidActorName + '</div>' +
                            '</th>' +
                            '<th style="width: 70px; cursor: pointer;">' +
                                '<div>' + labels.tableHead.totalNumber + '</div>' +
                            '</th>' +
                            '<th style="width: 180px; cursor: pointer;">' +
                                '<div>' + labels.tableHead.totalAmount + '</div>' +
                            '</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody id="exp-histories" style="height: 200px;">' +
                        '<!-- データ表示部 -->' +
                    '</tbody>' +
                '</table>' +
                '<!-- 振込元 -->' +
                '<div class="ts-form-row">' +
                    '<div class="ts-form-label">' +
                        '<div>' + labels.sourceAccount + '</div>' +
                        '<div class="ts-require"></div>' +
                    '</div>' +
                    '<div class="ts-form-value ts-form-select" style="width: 300px;">' +
                        '<select class="ts-form-select" id="zg-accounts">' +
                            '<option value=""></option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="ts-dialog-buttons">' +
                '<div>' +
                    '<button id="output-button" class="ts-dialog-ok">' +
                        '<div>' + labels.button.output + '</div>' +
                    '</button>' +
                    '<button class="ts-dialog-cancel">' +
                        '<div>' + labels.button.cancel + '</div>' +
                    '</button>' +
                '</div>' +
            '</div>';
        return contentWrap;
    },
    /**
     * 出力バリデーション
     */
    _validate: function(){
        const isFormInValid = !this._selectedExpPayHistory || !this._selectedSourceAccount;
        const outputButtonElm = document.getElementById("output-button");
        if(isFormInValid){
            outputButtonElm.setAttribute("disabled", true);
            outputButtonElm.classList.add('ts-dialog-ok-disabled');
            outputButtonElm.classList.remove('ts-dialog-ok');
            
        }else{
            outputButtonElm.removeAttribute("disabled");
            outputButtonElm.classList.add('ts-dialog-ok');
            outputButtonElm.classList.remove('ts-dialog-ok-disabled');
        }
    }
}

/**
 * 検索条件
 * @param {OutputZengin.SearchParams} obj 
 */
 teasp.Tsf.OutputZengin.SearchParamsWrap = function(obj){
    this.baseDate = obj.baseDate;
    this.payeeType = obj.payeeType;
}
teasp.Tsf.OutputZengin.SearchParamsWrap.prototype = {
    /**
     * 支払種別名の取得
     * @returns {String} 支払種別名
     */
    getPayeeTypeName: function(){
        switch (this.payeeType) {
            case '1':
                return teasp.message.getLabel('tf10001360'); //'本人立替分'
        
            case '2':
                return teasp.message.getLabel('tf10001370'); //'請求書'
        
            case '3':
                return teasp.message.getLabel('tf10001380'); // '法人カード'
        
            case '4':
                return teasp.message.getLabel('tf10001450'); //'仮払い'
        }
    },
    /**
     * フォーマット済日付文字列の取得
     * @returns 表示用の日付文字列
     */
    getFormattedBaseDate: function(){
        return moment(this.baseDate).format('YYYY/MM/DD');
    },
    /**
     * 対象のオブジェクト名を取得
     * @returns 対象のオブジェクト名
     */
    getTargetObjectName: function(){
        switch (this.payeeType) {
            case '1':
                return 'ExpApply';
        
            case '2':
                return 'EmpExp';
        
            case '3':
                return 'EmpExp';
        
            case '4':
                return 'ExpPreApply';
        }
    }
}

/**
 * 精算履歴テーブルアイテム
 * @param {{
 *  expPayHistory: OutputZengin.ExpPayHistory
 *  isEven: boolean
 * }} arg
 * @constructor
 */
teasp.Tsf.OutputZengin.ExpPayHistoryTableRow = function(arg){

    /** @type {OutputZengin.ExpPayHistory} */
    this._obj = arg.expPayHistory;

    /** @type {boolean} */
    this._isEven = arg.isEven;

    /** @type {Function} */
    this._onSelected = null;

    /** @type {HTMLTableRowElement} */
    this._dom = this._createContent();
}

teasp.Tsf.OutputZengin.ExpPayHistoryTableRow.prototype = {
    /**
     * 精算実行日時を取得
     * @param {String} format 出力する日付フォーマット(デフォルト: YYYY/MM/DD HH:mm:ss)
     * @returns 精算実行日時 
     */
    getSetPaidTime: function(format){
        var fmt = 'YYYY/MM/DD HH:mm:ss';
        if(format){
            fmt = format;
        }
        return moment(this._obj.setPaidTime).format(fmt);
    },
    /**
     * 精算日を取得
     * @param {String} format 出力する日付フォーマット(デフォルト: YYYY/MM/DD)
     * @returns {String} 精算日
     */
    getPayDate: function(format){
        var fmt = 'YYYY/MM/DD';
        if(format){
            fmt = format;
        }
        return moment(this._obj.payDate).format(fmt);
    },
    /**
     * 履歴に紐づく経費精算IDリストを取得
     * @returns 履歴に紐づく経費精算IDリスト
     */
    getExpIds: function(){
        return this._obj.expIds;
    },
    getDom: function(){
        return this._dom;
    },

    /**
     * 行選択イベントハンドラ
     * @param {Function} callback 
     */
    setOnSelected: function(callback){
        this._onSelected = callback;
    },
    /**
     * 行選択時の処理
     */
    select: function(){
        this._dom.getElementsByClassName("radio-exp-pay-hist")[0].checked = true;
        this._onSelected(this);
    },
    /**
     * 
     * @returns {HTMLTableRowElement} trエレメント
     */
    _createContent: function(){
        const self = this;
        const trElm = document.createElement("tr");
        trElm.className = this._isEven ? "ts-row-even" : "ts-row-odd";
        trElm.style = "cursor: pointer"
        trElm.innerHTML = 
            '<td class="ts-form-checkbox" style="width: 24px">' +
                '<div class="ts-form-value ts-form-checkbox">' +
                    '<input type="radio" name="radioExpPayHistory" class="radio-exp-pay-hist ts-check" />' +
                '</div>' +
            '</td>' +
            '<!-- 精算日 -->' +
            '<td class="ts-form-text" style="width: 180px">' +
                '<div class="pay-date ts-form-value ts-form-date" style="width: 100%"></div>' +
            '</td>' +
            '<!-- 精算実行日時 -->' +
            '<td class="ts-form-text" style="width: 180px">' +
                '<div class="set-paid-time ts-form-value ts-form-time" style="width: 100%"></div>' +
            '</td>' +
            '<!-- 精算実行者 -->' +
            '<td class="ts-form-text" style="width: 180px">' +
                '<div class="set-paid-actor ts-form-value ts-form-text" style="width: 100%"></div>' +
            '</td>' +
            '<!-- 合計件数 -->' +
            '<td class="ts-form-text" style="width: 70px">' +
                '<div class="total-number ts-form-value ts-form-number" style="width: 100%"></div>' +
            '</td>' +
            '<!-- 合計金額 -->' +
            '<td class="ts-form-text" style="width: 180px">' +
                '<div class="total-amount ts-form-value ts-form-currency" style="width: 100%"></div>' +
            '</td>' +
            '<td class="last" style="width: 16px; display: none"></td>';

        // データを流し込む
        trElm.getElementsByClassName("radio-exp-pay-hist")[0].value = self._obj.setPaidTime;
        trElm.getElementsByClassName("set-paid-time")[0].innerHTML = self.getSetPaidTime();
        trElm.getElementsByClassName("set-paid-actor")[0].innerHTML = self._obj.setPaidActorName;
        trElm.getElementsByClassName("pay-date")[0].innerHTML = self.getPayDate();
        trElm.getElementsByClassName("total-number")[0].innerHTML = self._obj.totalNumber;
        trElm.getElementsByClassName("total-amount")[0].innerHTML = teasp.Tsf.Currency.formatMoney(self._obj.totalAmount, teasp.Tsf.Currency.V_YEN, false, true);
        
        // イベントハンドラの設定
        trElm.onclick = function(){
            self.select();
        }

        return trElm;
    }
}