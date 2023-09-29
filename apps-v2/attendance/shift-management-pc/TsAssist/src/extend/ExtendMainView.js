import {BaseView} from "../_common/BaseView.js?v=XVERSIONX";
import {Remoting} from "../_common/Remoting.js?v=XVERSIONX";

/**
 * 拡張オプション
 */
export class ExtendMainView extends BaseView {
    constructor(tsaMain){
        super(tsaMain, null);
        this.parentId = tsaMain.baseId;
        this.layers = [null, null, null];
        this.prefixHash = '#!exte';
        this.topNodeId = 'ExtendMainView';
        this.orgCommon = null;
    }

    open(hash){
        if(hash == '#!extend'){
            super.open(hash);
            this.buildContent();
        }else{
            this.tsaMain.setDefaultHash();
        }
    }
    buildContent(){
        this.domH.empty(this.baseId);
        document.getElementById(this.baseId).innerHTML = this.getContent();
        this.initListeners();
        this.setLabels();
        this.getTopNode().querySelectorAll('.tsa-exte-desc').forEach((el) => {
            el.title = 'クリックすると説明を表示します';
        });
        this.getTopNode().querySelectorAll('.tsa-exte-note').forEach((el) => {
            el.style.display = 'none';
        });
        this.fetchCommon();
    }
    getContent(){
        return `
            <div id="${this.topNodeId}">
                <div class="tsa-panel1">
                    <div class="tsa-menu-extend"></div>
                </div>
                <div class="tsa-error-main" style="display:none;"><div></div></div>
                <div class="tsa-panel1" style="margin-top:8px;margin-bottom:0px;">
                    <div style="margin:0px 20px;">
                        <button class="tsa-exte-save">保存</button>
                    </div>
                    <div class="tsa-exte-result" style="min-width:200px;">
                    </div>
                    <div class="tsa-exte-switch">
                        <label>
                            <input type="checkbox" id="ExteFieldSwitch" />
                            保存先を表示する
                        </label>
                    </div>
                </div>
                <div class="tsa-exte-options">
                    <div class="tsa-exte-section-name">
                        勤怠関連
                    </div>
                    <div class="tsa-exte-section">
                        <div>
                            <span class="tsa-exte-head">勤怠計算・休暇管理</span>
                            <div id="ExteA1010">
                                <label><input type="checkbox" /><span>退社後または出社前に時間単位休や半休がある時、定時で所定勤務に達していれば遅刻・早退時間をカウントしない</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.adjustLateTimeEarlyTime (Boolean)</div>
                            </div>
                            <div id="ExteA1020">
                                <label><input type="checkbox" /><span>勤怠連携バッチで反映されるデータで、退社打刻を常に上書きする</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.overwriteStampEndTime (Boolean)</div>
                            </div>
                            <div id="ExteA1030">
                                <label><input type="checkbox" /><span>36協定上限設定を勤務体系設定画面に表示する</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.use36AgreementCap (Boolean)</div>
                            </div>
                            <div id="ExteA1040">
                                <label><input type="checkbox" /><span>日次の申請を本日の前後１年以内にする制限を解除</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 9桁目='1'</div>
                            </div>
                            <div id="ExteA1050">
                                <label><input type="checkbox" /><span>個人設定を非表示にする</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.hidePersonalInfo (Boolean)</div>
                            </div>
                        </div>
                        <div>
                            <span class="tsa-exte-head">休暇管理</span>
                            <div id="ExteA2010">
                                <label><input type="checkbox" /><span>休暇申請の期間内の来月分を除いて有休残日数を計算</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 14桁目='1'</div>
                            </div>
                        </div>
                        <div>
                            <span class="tsa-exte-head">シフト管理</span>
                            <div id="ExteS0020">
                                <label><input type="checkbox" /><span>シフト管理のCSVインポート機能を有効にする</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.enableShiftCsvImport (Boolean)</div>
                            </div>
                            <div id="ExteS0030">
                                <label><input type="checkbox" /><span>シフト登録ツールのダウンロードリンクを表示する</span></label>
                                <div class="tsa-exte-input">ダウンロードリンクを差し替え <input type="text" style="width:300px;" /></div>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.shiftImportToolCustomURL (String)</div>
                            </div>
                            <div id="ExteS0035">
                                <label><input type="checkbox" /><span>シフトバリデーションを設定する</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.useShiftValidationSetting (Boolean)</div>
                            </div>
                            <div id="ExteS0040">
                                <label><input type="checkbox" /><span>シフト振替申請を利用可能にする</span></label>
                                <div class="tsa-exte-desc">?</div>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.useShiftChange (Boolean)</div>
                                <div class="tsa-exte-note">同月度同週内の勤務日/非勤務日のシフト設定を入れ替える。振替申請との併用不可。</div>
                            </div>
                        </div>
                        <div>
                            <span class="tsa-exte-head">入退館管理</span>
                            <div id="ExteN0010">
                                <label><input type="checkbox" /><span>入退館管理機能を有効にする</span></label>
                                <div class="tsa-exte-desc">?</div>
                                <div class="tsa-exte-field">AtkCommon__c.UseAccessControlSystem__c (Boolean)</div>
                                <div class="tsa-exte-note">有効にすると勤務体系設定画面に「入退館管理機能設定」セクション、社員設定画面に「入退館管理」項目が表示される。</div>
                            </div>
                            <div id="ExteN0020">
                                <label><input type="checkbox" /><span>入退館管理機能の内側の乖離判定を有効にする</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.DivergenceInnerCheck (Boolean)</div>
                            </div>
                            <div id="ExteN0030">
                                <label><input type="checkbox" /><span>入退館管理機能：月次確定後は乖離判定しない</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.SuppressDivergenceCheckOnFixedMonth (Boolean)</div>
                            </div>
                            <div id="ExteN0040">
                                <label><input type="checkbox" /><span>入退館管理機能：再判定期間</span></label>
                                <input type="text" style="width:24px;text-align:right;" maxLength="2" /> <span>日</span>
                                <div class="tsa-exte-desc">?</div>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.AutoReJudgeDays (Number)</div>
                                <div class="tsa-exte-note">バッチ実行時間から上記日数以内に追加/更新/削除された入退館ログがある日付に対して、乖離判定フラグの状態によらず強制的に再判定を行う（その際、前日の判定も更新される場合がある）。</div>
                            </div>
                        </div>
                    </div>
                    <div class="tsa-exte-section-name">
                        経費関連
                    </div>
                    <div class="tsa-exte-section">
                        <div>
                            <span class="tsa-exte-head">経費精算</span>
                            <div id="ExteE0010">
                                <label><input type="checkbox" /><span>経費精算の１申請あたりの明細数の上限</span></label>
                                <input type="text" style="width:32px;text-align:right;" maxLength="3" />
                                <div class="tsa-exte-desc">?</div>
                                <div class="tsa-exte-field">AtkCommon__c.ExpPreApplyConfig__c.expCountLimit (Number)</div>
                                <div class="tsa-exte-note">デフォルトは100件。200件まで入力可。</div>
                            </div>
                            <div id="ExteE0030">
                                <label><input type="checkbox" /><span>経費精算のCSV読込機能を有効にする</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 21桁目='1'</div>
                            </div>
                        </div>
                        <div>
                            <span class="tsa-exte-head">経費精算の消込</span>
                            <div id="ExteE0040">
                                <label><input type="checkbox" /><span>経費精算の消込画面に印刷ボタンを表示する</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.useExpPayPrint (Boolean)</div>
                            </div>
                            <div id="ExteE0050">
                                <label><input type="checkbox" /><span>電帳法オプションがオンの場合でも精算取消が可能な期間  </span></label>
                                <input type="date" />
                                <span>  23:59まで</span>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.expCancelDeadline (String)</div>
                            </div>
                            <div id="ExteE0060">
                                <label><input type="checkbox" /><span>仕訳データCSV出力を使用する</span></label>
                                <div class="tsa-exte-input">Visualforceページ <input type="text" style="width:300px;" /></div>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.useExpEntryData (Boolean)</div>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.expEntryDataUrl (String)</div>
                            </div>
                        </div>
                    </div>
                    <div class="tsa-exte-section-name">
                        工数関連
                    </div>
                    <div class="tsa-exte-section">
                        <div>
                            <span class="tsa-exte-head">工数時間のチェック</span>
                            <div id="ExteJ0010">
                                <label><input type="checkbox" /><span>工数確定申請時に工数の再計算を行う</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.recalcTimeOnJobFix (Boolean)</div>
                            </div>
                            <div id="ExteJ0020">
                                <label><input type="checkbox" /><span>工数確定申請時に工数の再計算＋工数と勤務時間のチェックを行う</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.checkTimeOnJobFix (Boolean)</div>
                            </div>
                        </div>
                    </div>
                    <div class="tsa-exte-section-name">
                        テスト環境用（本番環境では使用不可）
                    </div>
                    <div class="tsa-exte-section-test">
                        <div id="ExteX0010">
                            <label><input type="checkbox" /><span>Salesforceユーザに紐づかない社員を設定可</span></label>
                            <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 1-7桁目='132DBE4'</div>
                        </div>
                        <div id="ExteX0020">
                            <label><input type="checkbox" /><span>出退社時刻一括入力機能を追加</span></label>
                            <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 12桁目='1'</div>
                        </div>
                        <div id="ExteX0030">
                            <label><input type="checkbox" /><span>勤怠計算自動ベリファイをオンにする</span></label>
                            <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 18桁目='1'</div>
                        </div>
                        <div id="ExteX0040">
                            <label><input type="checkbox" /><span>J'sNAVIダミーを使用する（本番環境では使用不可）</span></label>
                            <div class="tsa-exte-field">AtkCommon__c.Config__c.useJsNaviDummy (Boolean)</div>
                        </div>
                        <div id="ExteX0050">
                            <label><input type="checkbox" /><span>テスト支援ツールでデータの削除・更新可</span></label>
                            <div class="tsa-exte-field">AtkCommon__c.Config__c.testEnvironment (Boolean)</div>
                        </div>
                    </div>
                    <div class="tsa-exte-section-name">
                        非推奨
                    </div>
                    <div class="tsa-exte-section-dep">
                        <div>
                            <span class="tsa-exte-head">勤怠</span>
                            <div id="ExteDA010">
                                <label><input type="checkbox" /><span>勤怠設定の時刻の丸めに「30分刻み」を追加</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 11桁目='1'</div>
                            </div>
                            <div id="ExteDA020">
                                <label><input type="checkbox" /><span>出退社時刻が入力されていれば実労働時間が０時間でも実勤務日数にカウントする</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 17桁目='1'</div>
                            </div>
                            <div id="ExteDA030">
                                <label><input type="checkbox" /><span>振替申請と休日出勤申請の取消時に入力時間を強制クリア</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 16桁目='1'</div>
                            </div>
                            <div id="ExteDA040">
                                <label><input type="checkbox" /><span>残業申請・早朝勤務申請の開始・終了時刻のデフォルト値をフレックス時間帯の境界とする</span></label>
                                <div class="tsa-exte-desc">?</div>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 20桁目='1'</div>
                                <div class="tsa-exte-note">フレックスタイム制で「申請の時間帯以外の勤務は認めない」オンの場合のみ有効</div>
                            </div>
                            <div id="ExteDA050">
                                <label><input type="checkbox" /><span>勤怠日次レコードの備考に入力がなければ備考入力済みと判定しない</span></label>
                                <div class="tsa-exte-desc">?</div>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 22桁目='1'</div>
                                <div class="tsa-exte-note">システム設定の「ＸＸＸは備考必須にする」=オンかつ「申請の備考と日次の備考を保存時に結合しない」=オンの場合のみ有効</div>
                            </div>
                            <div id="ExteA2020">
                                <label><input type="checkbox" /><span>有休を何か月前の勤怠確定時に付与するか </span></label>
                                <input type="text" style="width:24px;text-align:right;" maxLength="2" />
                                <div class="tsa-exte-field">AtkCommon__c.YuqProvidePriorMonth__c (Number)</div>
                            </div>
                        </div>
                        <div>
                            <span class="tsa-exte-head">シフト管理</span>
                            <div id="ExteS0010">
                                <label><input type="checkbox" /><span>シフト管理機能を有効にする</span></label>
                                <div class="tsa-exte-desc">?</div>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.enableShiftManagement (Boolean)</div>
                                <div class="tsa-exte-note">本設定は開発用となります。お客様組織では有効化しないでください。</div>
                            </div>
                        </div>
                        <div>
                            <span class="tsa-exte-head">事前申請</span>
                            <div id="ExteDE010">
                                <label><input type="checkbox" /><span>事前申請の「申請なしで事後精算を開始できる」オプションを表示する</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 19桁目='1'</div>
                            </div>
                        </div>
                        <div>
                            <span class="tsa-exte-head">工数</span>
                            <div id="ExteDJ010">
                                <label><input type="checkbox" /><span>工数実績画面に勤務時間と工数時間不一致の警告アイコンを表示する</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.warningOnMAPHW (Boolean)</div>
                            </div>
                            <div id="ExteDJ020">
                                <label><input type="checkbox" /><span>工数実績入力時に工数と勤務時間が合わなければ入力不可とする</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.checkInputWorkHours (Boolean)</div>
                            </div>
                            <div id="ExteDJ030">
                                <label><input type="checkbox" /><span>タイムレポートの勤怠情報と経費精算を非表示にする</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.timeReportDedicatedToJob (Boolean)</div>
                            </div>
                        </div>
                        <div>
                            <span class="tsa-exte-head">TS1勤務表</span>
                            <div id="ExteDM010">
                                <label><input type="checkbox" /><span>勤務表をモバイルブラウザで開く際にヘッダを表示する</span></label>
                                <div class="tsa-exte-desc">?</div>
                                <div class="tsa-exte-field">AtkCommon__c.LocalKey__c (String) 23桁目='1'</div>
                                <div class="tsa-exte-note">TS1勤務表モバイル専用画面をブラウザで作動させる時はオンにしないこと。Salesforce1で画面の左右に余白が追加され、Salesforce1を使う場合は見栄えの問題で非推奨</div>
                            </div>
                            <div id="ExteDM020">
                                <label><input type="checkbox" /><span>TS1勤務表モバイル専用画面をエミュレータやモバイルブラウザで作動させる</span></label>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.ts1OptimizeOnBrowser (Boolean)</div>
                            </div>
                            <div id="ExteDM030">
                                <label><input type="checkbox" /><span>TS1勤務表モバイル専用化の境界幅</span></label>
                                <input type="text" style="width:32px;text-align:right;" maxLength="3" />
                                <div class="tsa-exte-desc">?</div>
                                <div class="tsa-exte-field">AtkCommon__c.Config__c.ts1OptimizeWidth (Number)</div>
                                <div class="tsa-exte-note">デフォルトは 768</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tsa-error-main" style="display:none;"><div></div></div>
                <div class="tsa-panel1" style="margin-top:0px;margin-bottom:0px;">
                    <div style="margin:0px 20px;">
                        <button class="tsa-exte-save">保存</button>
                    </div>
                    <div class="tsa-exte-result">
                    </div>
                </div>
            </div>
        `;
    }
    initListeners(){
        super.initListeners();
        // 説明を表示
        this.getTopNode().querySelectorAll('.tsa-exte-desc').forEach((el) => {
            this.setListenerKey(0, this.domH.addListener(el, 'click', (e) => { this.showNote(e); }));
        });
        // 保存
        this.getTopNode().querySelectorAll('.tsa-exte-save').forEach((el) => {
            this.setListenerKey(0, this.domH.addListener(el, 'click', () => { this.saveStep1(); }));
        });
        this.setListenerKey(0, this.domH.addListener('ExteFieldSwitch', 'click', () => { this.showField(); }));
        // テキストボックスに値が入力されたら自動でチェックボックスをオンにする
        ['ExteA2020','ExteN0040','ExteE0010','ExteDM030','ExteE0050'].forEach((domId) => {
            const el = this.domH.byId(domId).querySelector('input[type="text"],input[type="date"]');
            if(el){
                this.setListenerKey(0, this.domH.addListener(el, 'input', (e) => {
                    const v = e.target.value.trim();
                    if(v){
                        const node = this.domH.byId(domId).querySelector('input[type="checkbox"]');
                        if(node && !node.checked){
                            node.checked = true;
                        }
                    }
                }));
            }
        });
        // チェックボックスがクリックされたら結果表示をクリア
        this.getTopNode().querySelectorAll('input[type="checkbox"]').forEach((el) => {
            this.setListenerKey(0, this.domH.addListener(el, 'click', () => { this.clearResult(); }));
        });
        // テキストボックスに入力されたら結果表示をクリア
        this.getTopNode().querySelectorAll('input[type="text"],input[type="date"]').forEach((el) => {
            this.setListenerKey(0, this.domH.addListener(el, 'input', () => { this.clearResult(); }));
        });
    }
    showNote(e){
        const node = e.target.parentNode.querySelector('.tsa-exte-note');
        if(node){
            node.style.display = (node.style.display == 'none' ? 'table' : 'none');
        }
    }
    showField(){
        const checked = this.domH.byId('ExteFieldSwitch').checked;
        this.getTopNode().querySelectorAll('.tsa-exte-field').forEach((el) => {
            // el.style.display = (checked ? 'table' : 'none');
            el.style.display = (checked ? 'inline-block' : 'none');
        });
    }
    clearResult(){
        this.showResult(null);
    }
    showResult(message){
        this.getTopNode().querySelectorAll('.tsa-exte-result').forEach((el) => {
            el.innerHTML = message || '';
        });
    }
    setLabels(){
        this.msgH.setLabel(this.getTopNode().querySelector('.tsa-menu-extend'), 'MenuExteOption');
    }
    /**
     * 設定値を読み込み
     */
    fetchCommon(){
        const req = {
            soql: "select Id,LocalKey__c,Config__c,YuqProvidePriorMonth__c,ExpPreApplyConfig__c,UseAccessControlSystem__c from AtkCommon__c",
            limit: 1,
            offset: 0,
            allRows: false
        };
        if(tsCONST.prefixBar){
            req.soql = req.soql.replace(/([A-Za-z0-9_]+__[cr])/g, `${tsCONST.prefixBar}$1`);
        }
        this.blockingUI(true, this.msgH.get('msg2000020')); // データを読み込んでいます
        Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
            (result) => {
                if(result.records.length){
                    this.initSettings(result.records[0]);
                }else{
                    this.showError('勤怠共通設定にデータがありません');
                    this.getTopNode().querySelectorAll('button').forEach((el) => {
                        this.domH.setAttr(el, 'disabled', true);
                    });
                }
                this.blockingUI(false);
            },
            (event) => {
                this.showError({message: this.msgH.parseErrorMessage(event)});
                this.blockingUI(false);
            }
        );
    }
    initSettings(common){
        this.orgCommon = common;
        const lk = (common.LocalKey__c || '').padEnd(30, '0');
        // JSON形式の文字列をオブジェクト化
        common.Config__c = (common.Config__c ? JSON.parse(common.Config__c) : {});
        common.ExpPreApplyConfig__c = (common.ExpPreApplyConfig__c ? JSON.parse(common.ExpPreApplyConfig__c) : {});
        this.settingMap = {};
        /*
        数値型
            ExteA2020: common.YuqProvidePriorMonth__c
            ExteN0040: common.Config__c.AutoReJudgeDays
            ExteE0010: common.ExpPreApplyConfig__c.expCountLimit
            ExteDM030: common.Config__c.ts1OptimizeWidth
        文字列型
            ExteE0060: common.Config__c.expEntryDataUrl
            ExteE0050: common.Config__c.expCancelDeadline ("YYYY-MM-DD")
            ExteS0030: common.Config__c.shiftImportToolCustomURL
        それ以外は boolean型
        */
        // 勤怠計算等
        this.setSettingMap('ExteA1010', common.Config__c.adjustLateTimeEarlyTime ); // 退社後または出社前に時間単位休や半休がある時、定時で所定勤務に達していれば遅刻・早退時間をカウントしない
        this.setSettingMap('ExteA1020', common.Config__c.overwriteStampEndTime   ); // 勤怠連携バッチで反映されるデータで、退社打刻を常に上書きする
        this.setSettingMap('ExteA1030', common.Config__c.use36AgreementCap       ); // 36協定上限設定を勤務体系設定画面に表示する
        this.setSettingMap('ExteA1040', lk.substring( 8,  9) == '1'              ); // 日次の申請を本日の前後１年以内にする制限を解除
        this.setSettingMap('ExteA1050', common.Config__c.hidePersonalInfo        ); // 個人設定を非表示にする
        // 休暇管理
        this.setSettingMap('ExteA2010', lk.substring(13, 14) == '1'              ); // 休暇申請の期間内の来月分を除いて有休残日数を計算
        this.setSettingMap('ExteA2020', common.YuqProvidePriorMonth__c           ); // 有休を何か月前の勤怠確定時に付与するか（★数値2桁以内）
        // シフト管理
        this.setSettingMap('ExteS0010', common.Config__c.enableShiftManagement   ); // シフト管理機能を有効にする
        this.setSettingMap('ExteS0020', common.Config__c.enableShiftCsvImport    ); // シフト管理のCSVインポート機能を有効にする
        this.setSettingMap('ExteS0030', common.Config__c.enableShiftImportToolDownload, // シフト登録ツールのダウンロードリンクを表示する
                                        common.Config__c.shiftImportToolCustomURL); // ダウンロードリンクを差し替え
        this.setSettingMap('ExteS0035', common.Config__c.useShiftValidationSetting); // シフトバリデーションを設定する
        this.setSettingMap('ExteS0040', common.Config__c.useShiftChange          ); // シフト振替申請を利用可能にする
        // 入退館管理
        this.setSettingMap('ExteN0010', common.UseAccessControlSystem__c         ); // 入退館管理機能を有効にする
        this.setSettingMap('ExteN0020', common.Config__c.DivergenceInnerCheck    ); // 入退館管理機能の内側の乖離判定を有効にする
        this.setSettingMap('ExteN0030', common.Config__c.SuppressDivergenceCheckOnFixedMonth); // 入退館管理機能：月次確定後は乖離判定しない
        this.setSettingMap('ExteN0040', common.Config__c.AutoReJudgeDays         ); // 入退館管理機能：再判定期間（★数値2桁以内）
        // 経費精算
        this.setSettingMap('ExteE0010', common.ExpPreApplyConfig__c.expCountLimit); // 経費精算の１申請あたりの明細数の上限（★数値3桁以内）
        this.setSettingMap('ExteE0030', lk.substring(20, 21) == '1'              ); // 経費精算のCSV読込機能を有効にする
        // 経費精算の消込
        this.setSettingMap('ExteE0040', common.Config__c.useExpPayPrint          ); // 経費精算の消込画面に印刷ボタンを表示する
        this.setSettingMap('ExteE0050', common.Config__c.expCancelDeadline       ); // 電帳法オプションがオンの場合でも精算取消が可能な期間
        this.setSettingMap('ExteE0060', common.Config__c.useExpEntryData,           // 仕訳データCSV出力を使用する
                                        common.Config__c.expEntryDataUrl         ); // Visualforceページ
        // 工数時間のチェック
        this.setSettingMap('ExteJ0010', common.Config__c.recalcTimeOnJobFix      ); // 工数確定申請時に工数の再計算を行う
        this.setSettingMap('ExteJ0020', common.Config__c.checkTimeOnJobFix       ); // 工数確定申請時に工数の再計算＋工数と勤務時間のチェックを行う
        // テスト環境用
        this.setSettingMap('ExteX0010', lk.substring( 0,  7) == '132DBE4'        ); // Salesforceユーザに紐づかない社員を設定可
        this.setSettingMap('ExteX0020', lk.substring(11, 12) == '1'              ); // 出退社時刻一括入力機能を追加
        this.setSettingMap('ExteX0030', lk.substring(17, 18) == '1'              ); // 勤怠計算自動ベリファイをオンにする
        this.setSettingMap('ExteX0040', common.Config__c.useJsNaviDummy          ); // J'sNAVIダミーを使用する（本番環境では使用不可）
        this.setSettingMap('ExteX0050', common.Config__c.testEnvironment         ); // テスト支援ツールでデータの削除・更新可
        // 非推奨-勤怠
        this.setSettingMap('ExteDA010', lk.substring(10, 11) == '1'              ); // 勤怠設定の時刻の丸めに「30分刻み」を追加
        this.setSettingMap('ExteDA020', lk.substring(16, 17) == '1'              ); // 出退社時刻が入力されていれば実労働時間が０時間でも実勤務日数にカウントする
        this.setSettingMap('ExteDA030', lk.substring(15, 16) == '1'              ); // 振替申請と休日出勤申請の取消時に入力時間を強制クリア
        this.setSettingMap('ExteDA040', lk.substring(19, 20) == '1'              ); // 残業申請・早朝勤務申請の開始・終了時刻のデフォルト値をフレックス時間帯の境界とする
        this.setSettingMap('ExteDA050', lk.substring(21, 22) == '1'              ); // 勤怠日次レコードの備考に入力がなければ備考入力済みと判定しない
        // 非推奨-事前申請                                                  
        this.setSettingMap('ExteDE010', lk.substring(18, 19) == '1'              ); // 事前申請の「申請なしで事後精算を開始できる」オプションを表示する
        // 非推奨-工数
        this.setSettingMap('ExteDJ010', common.Config__c.warningOnMAPHW          ); // 工数実績画面に勤務時間と工数時間不一致の警告アイコンを表示する
        this.setSettingMap('ExteDJ020', common.Config__c.checkInputWorkHours     ); // 工数実績入力時に工数と勤務時間が合わなければ入力不可とする
        this.setSettingMap('ExteDJ030', common.Config__c.timeReportDedicatedToJob); // タイムレポートの勤怠情報と経費精算を非表示にする
        // 非推奨-TS1勤務表
        this.setSettingMap('ExteDM010', lk.substring(22, 23) == '1'              ); // 勤務表をモバイルブラウザで開く際にヘッダを表示する
        this.setSettingMap('ExteDM020', common.Config__c.ts1OptimizeOnBrowser    ); // TS1勤務表モバイル専用画面をエミュレータやモバイルブラウザで作動させる
        this.setSettingMap('ExteDM030', common.Config__c.ts1OptimizeWidth        ); // TS1勤務表モバイル専用化の境界幅（★数値2桁以内）

        for(let domId in this.settingMap){
            const m = this.settingMap[domId];
            this.setValue(domId, m.checked, m.value);
        }
    }
    setSettingMap(domId, value1, value2){
        const m = this.settingMap[domId] || {};
        if(typeof(value1) == 'boolean'){
            m.checked = value1;
            m.value = (typeof(value2) == 'number' ? value2 : (value2 || null));
        }else if(typeof(value1) == 'number' || (value1 && typeof(value1) == 'string')){
            m.checked = true;
            m.value = value1;
        }else{
            m.checked = false;
            m.value = (typeof(value2) == 'number' ? value2 : (value2 || null));
        }
        this.settingMap[domId] = m;
    }
    setValue(domId, checked, value){
        const chkbox = this.domH.byId(domId).querySelector('input[type="checkbox"]');
        if(chkbox){
            chkbox.checked = checked;
        }
        if(value !== undefined){
            this.setTextValue(domId, value);
        }
    }
    setTextValue(domId, value){
        const inpText = this.domH.byId(domId).querySelector('input[type="text"],input[type="date"]');
        if(inpText){
            inpText.value = (typeof(value) == 'number' ? '' + value : value || '');
        }
    }
    getValue(domId){
        const obj = { checked: false, value: null};
        const chkbox = this.domH.byId(domId).querySelector('input[type="checkbox"]');
        if(chkbox){
            obj.checked = chkbox.checked;
        }
        const inpText = this.domH.byId(domId).querySelector('input[type="text"],input[type="date"]');
        if(inpText){
            obj.value = inpText.value.trim() || null;
        }
        if(!obj.checked && ['ExteA2020','ExteN0040','ExteE0010','ExteDM030','ExteE0050'].indexOf(domId) >= 0){
            obj.value = null;
        }
        return obj;
    }
    getSettings(){
        const newMap = {};
        for(let domId in this.settingMap){
            const no = this.getValue(domId);
            const oo = this.settingMap[domId];
            if(no.checked != oo.checked || no.value != oo.value){
                newMap[domId] = no;
            }
        }
        return newMap;
    }
    getNameByDomId(domId){
        return this.domH.byId(domId).querySelector('span').innerHTML;
    }
    clearErrorField(){
        this.getTopNode().querySelectorAll('.tsa-error-field').forEach((el) => {
            el.parentNode.removeChild(el);
        });
    }
    insertErrorField(domId, message){
        this.domH.create('div', { className:'tsa-error-field', innerHTML:message }, this.domH.byId(domId));
    }
    saveStep1(){
        if(!this.orgCommon){
            this.showError('勤怠共通設定にデータがありません');
            return;
        }
        this.clearErrorField();
        this.clearResult();
        this.hideError();
        const newMap = this.getSettings();
        if(!Object.keys(newMap).length){
            this.showResult('変更されてません');
            return;
        }
        const errs = [];
        // 数値を指定させる項目
        ['ExteA2020','ExteN0040','ExteE0010','ExteDM030'].forEach((domId) => {
            if(newMap[domId] && newMap[domId].checked){
                const v = newMap[domId].value;
                if(!v){
                    errs.push(`「${this.getNameByDomId(domId)}」の値を指定してください。`);
                    this.insertErrorField(domId, '値を指定してください');
                }else if(!/^\d+$/.test(v)){
                    errs.push(`「${this.getNameByDomId(domId)}」の値は数字を入力してください`);
                    this.insertErrorField(domId, '数字を入力してください');
                }
                newMap[domId].value = parseInt(newMap[domId].value, 10);
                if(domId == 'ExteE0010' && newMap[domId].value > 200){
                    errs.push(`「${this.getNameByDomId(domId)}」は200以下にしてください`);
                    this.insertErrorField(domId, '200以下にしてください');
                }
            }
        });
        // 日付を指定させる項目
        ['ExteE0050'].forEach((domId) => {
            if(newMap[domId] && newMap[domId].checked){
                if(!newMap[domId].value){
                    errs.push(`「${this.getNameByDomId(domId)}」の日付を指定してください。`);
                    this.insertErrorField(domId, '日付を指定してください');
                }
            }
        });
        if(errs.length){
            this.showError(errs.join('<br/>'));
            return;
        }
        this.saveStep2(newMap);
    }
    saveStep2(nm){
        const nc = Object.assign({}, this.orgCommon);
        for(let domId in nm){
            // 勤怠計算等
            if(domId=='ExteA1010'){       nc.Config__c.adjustLateTimeEarlyTime = nm[domId].checked;
            }else if(domId=='ExteA1020'){ nc.Config__c.overwriteStampEndTime   = nm[domId].checked;
            }else if(domId=='ExteA1030'){ nc.Config__c.use36AgreementCap       = nm[domId].checked;
            }else if(domId=='ExteA1040'){ this.setLocalKey(nc,  8,  9, nm[domId].checked);
            }else if(domId=='ExteA1050'){ nc.Config__c.hidePersonalInfo        = nm[domId].checked;
            // 休暇管理
            }else if(domId=='ExteA2010'){ this.setLocalKey(nc, 13, 14, nm[domId].checked);
            }else if(domId=='ExteA2020'){ nc.YuqProvidePriorMonth__c           = nm[domId].value;
            // シフト管理
            }else if(domId=='ExteS0010'){ nc.Config__c.enableShiftManagement         = nm[domId].checked;
            }else if(domId=='ExteS0020'){ nc.Config__c.enableShiftCsvImport          = nm[domId].checked;
            }else if(domId=='ExteS0030'){ nc.Config__c.enableShiftImportToolDownload = nm[domId].checked;
                                          nc.Config__c.shiftImportToolCustomURL      = nm[domId].value;
            }else if(domId=='ExteS0035'){ nc.Config__c.useShiftValidationSetting     = nm[domId].checked;
            }else if(domId=='ExteS0040'){ nc.Config__c.useShiftChange                = nm[domId].checked;
            // 入退館管理
            }else if(domId=='ExteN0010'){ nc.UseAccessControlSystem__c                     = nm[domId].checked;
            }else if(domId=='ExteN0020'){ nc.Config__c.DivergenceInnerCheck                = nm[domId].checked;
            }else if(domId=='ExteN0030'){ nc.Config__c.SuppressDivergenceCheckOnFixedMonth = nm[domId].checked;
            }else if(domId=='ExteN0040'){ nc.Config__c.AutoReJudgeDays                     = nm[domId].value;
            // 経費精算
            }else if(domId=='ExteE0010'){ nc.ExpPreApplyConfig__c.expCountLimit = nm[domId].value;
            }else if(domId=='ExteE0030'){ this.setLocalKey(nc, 20, 21, nm[domId].checked);
            // 経費精算の消込
            }else if(domId=='ExteE0040'){ nc.Config__c.useExpPayPrint     = nm[domId].checked;
            }else if(domId=='ExteE0050'){ nc.Config__c.expCancelDeadline  = nm[domId].value;
            }else if(domId=='ExteE0060'){ nc.Config__c.useExpEntryData    = nm[domId].checked;
                                          nc.Config__c.expEntryDataUrl    = nm[domId].value;
            // 工数時間のチェック
            }else if(domId=='ExteJ0010'){ nc.Config__c.recalcTimeOnJobFix = nm[domId].checked;
            }else if(domId=='ExteJ0020'){ nc.Config__c.checkTimeOnJobFix  = nm[domId].checked;
            // テスト環境用
            }else if(domId=='ExteX0010'){ this.setLocalKey(nc,  0,  7, nm[domId].checked ? '132DBE4' : '0000000');
            }else if(domId=='ExteX0020'){ this.setLocalKey(nc, 11, 12, nm[domId].checked);
            }else if(domId=='ExteX0030'){ this.setLocalKey(nc, 17, 18, nm[domId].checked);
            }else if(domId=='ExteX0040'){ nc.Config__c.useJsNaviDummy     = nm[domId].checked;
            }else if(domId=='ExteX0050'){ nc.Config__c.testEnvironment    = nm[domId].checked;
            // 非推奨-勤怠
            }else if(domId=='ExteDA010'){ this.setLocalKey(nc, 10, 11, nm[domId].checked);
            }else if(domId=='ExteDA020'){ this.setLocalKey(nc, 16, 17, nm[domId].checked);
            }else if(domId=='ExteDA030'){ this.setLocalKey(nc, 15, 16, nm[domId].checked);
            }else if(domId=='ExteDA040'){ this.setLocalKey(nc, 19, 20, nm[domId].checked);
            }else if(domId=='ExteDA050'){ this.setLocalKey(nc, 21, 22, nm[domId].checked);
            // 非推奨-事前申請
            }else if(domId=='ExteDE010'){ this.setLocalKey(nc, 18, 19, nm[domId].checked);
            // 非推奨-工数
            }else if(domId=='ExteDJ010'){ nc.Config__c.warningOnMAPHW           = nm[domId].checked;
            }else if(domId=='ExteDJ020'){ nc.Config__c.checkInputWorkHours      = nm[domId].checked;
            }else if(domId=='ExteDJ030'){ nc.Config__c.timeReportDedicatedToJob = nm[domId].checked;
            // 非推奨-TS1勤務表
            }else if(domId=='ExteDM010'){ this.setLocalKey(nc, 22, 23, nm[domId].checked);
            }else if(domId=='ExteDM020'){ nc.Config__c.ts1OptimizeOnBrowser     = nm[domId].checked;
            }else if(domId=='ExteDM030'){ nc.Config__c.ts1OptimizeWidth         = nm[domId].value;
            }
        }
        nc.Config__c = JSON.stringify(nc.Config__c);
        nc.ExpPreApplyConfig__c = JSON.stringify(nc.ExpPreApplyConfig__c);
        this.blockingUI(true, this.msgH.get('msg2000030')); // データを更新しています
        const req = {
            action: 'updateSObject',
            objName: 'AtkCommon__c',
            typeMap: {
                LocalKey__c: 'STRING',
                Config__c:'STRING',
                YuqProvidePriorMonth__c: 'DOUBLE',
                ExpPreApplyConfig__c:'STRING',
                UseAccessControlSystem__c: 'BOOLEAN'
            },
            idList: [nc.Id],
            values: {}
        };
        req.values[nc.Id] = nc;
        Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
            (result) => {
                console.log(result);
                this.initSettings(result.records[0]);
                this.showResult('保存しました');
                this.blockingUI(false);
            },
            (errobj) => {
                this.showError({message: this.msgH.parseErrorMessage(errobj)});
                this.blockingUI(false);
            }
        );
    }
    setLocalKey(c, indexStart, indexEnd, value){
        let v = (c.LocalKey__c || '').padEnd(indexEnd, '0');
        c.LocalKey__c = v.substring(0, indexStart)
            + (typeof(value) == 'boolean' ? (value ? '1' : '0') : value)
            + v.substring(indexEnd);
    }
}