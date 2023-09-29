/**
 * メッセージリソース
 */
export class MessageResource {
    static getAll(){
        return Object.assign(this.getLabelAll(), this.getMessageAll());
    }
    static getLabelAll(){
        return {
            MenuMainMenu: { jp:'メニュー', en:'Menu' },
            MenuExteOption: { jp:'TeamSpirit 拡張オプション', en:'TeamSpirit Extended Options' },
            MenuCleaning: { jp:'TeamSpirit トランザクションデータ削除', en:'TeamSpirit Transaction Data Deletion' },
            MenuSObjViewer: { jp:'オブジェクトビューア', en:'SObject Viewer' },
            MenuSupportFull: { jp:'その他ツール', en:'Other Tools' },
            MenuOldView2: { jp:'旧View2', en:'Old View2' },
            MenuOutputPlus: { jp:'その他のデータ出力拡張', en:'Other data output expansion' },
            LabelLangJp: { jp:'日本語', en:'Japanese' },
            LabelLangEn: { jp:'英語'  , en:'English' },
            LabelOrganizationId: { jp:'組織ID'  , en:'Organization ID' },
            LabelOrganizationName: { jp:'組織名'  , en:'Organization Name' },
            LabelSObjectList: { jp:'オブジェクト一覧', en:'SObject List' },
            LabelFilter: { jp:'フィルタ', en:'Filter' },
            LabelQuickFind: { jp:'絞り込み', en:'Quick Find' },
            LabelCustomOnly: { jp:'カスタムオブジェクトのみ', en:'Custom objects only' },
            LabelQueryableOnly: { jp:'照会可のみ', en:'Queryable only' },
            LabelDownload: { jp:'ダウンロード', en:'Download' },
            LabelLabel: { jp:'表示ラベル', en:'Label' },
            LabelAPIName: { jp:'API参照名', en:'API Name' },
            LabelDataType: { jp:'型', en:'Data Type' },
            LabelDataValue: { jp:'値', en:'Value' },
            LabelHelpText: { jp:'ヘルプテキスト', en:'Help Text' },
            LabelFormula: { jp:'数式', en:'Formula' },
            LabelPicklist: { jp:'選択リスト', en:'Picklist' },
            LabelEditable: { jp:'編集', en:'Editable' },
            LabelIncludeTrash: { jp:'ゴミ箱のレコードも含める', en:'Include recycle bin records' },
            LabelItemDefine: { jp:'項目定義情報', en:'Item definition' },
            LabelSearch: { jp:'検索', en:'Search' },
            LabelDelete: { jp:'削除', en:'Delete' },
            LabelRestore: { jp:'復元', en:'Restore' },
            LabelNew: { jp:'新規', en:'New' },
            LabelNewDsp: { jp:'(新規)', en:'(New)' },
            LabelClone: { jp:'複製', en:'Copy' },
            LabelCloneDsp: { jp:'(複製)', en:'(Copy)' },
            LabelEdit: { jp:'編集', en:'Edit' },
            LabelSave: { jp:'登録', en:'Save' },
            LabelChange: { jp:'変更', en:'Change' },
            LabelMainteOn: { jp:'メンテナンスモードへ', en:'Go To Maintenance Mode' },
            LabelMainteOff: { jp:'メンテナンスモード終了', en:'Exit Maintenance Mode' },
            LabelSaveConfirm: { jp:'登録確認', en:'Confirmation of save' },
            LabelCancel: { jp:'キャンセル', en:'Cancel' },
            LabelOk: { jp:'ＯＫ', en:'OK' },
            LabelClose: { jp:'閉じる', en:'Close' },
            LabelRelatedData: { jp:'関連データ', en:'Related data' },
            LabelFieldInfo: { jp:'項目情報', en:'Field detail' },
            LabelDispNum: { jp:'{0} 件を表示', en:'{0} displayed' },
            LabelDispNumRange: { jp:'{0} 件中 {1}～{2} 件を表示', en:'{1} to {2} of {0} displayed' },
            LabelSelectDLTarget: { jp:'ダウンロード対象を選択', en:'Select download target' },
            LabelDLSObjectList: { jp:'オブジェクト一覧', en:'SObject List' },
            LabelDLSObjectFieldV1: { jp:'オブジェクト項目定義一覧(v1)', en:'SObject Field List (v1)' },
            LabelDLSObjectFieldV2: { jp:'オブジェクト項目定義一覧(v2)', en:'SObject Field List (v2)' },
            LabelYes1: { jp:'可', en:'Yes' },
            LabelNo1: { jp:'不可', en:'No' },
            LabelCountTheNumber: { jp:'件数をカウント', en:'Count the number' },
            LabelCopyToClipboard: { jp:'クリップボードへコピー', en:'Copy to clipboard' },
            LabelFieldName: { jp:'項目名', en:'Field Name' },
            LabelChildRelName: { jp:'子リレーション名', en:'Child Relationship Name' },
            LabelNumber: { jp:'件数', en:'Number' },
            LabelThatReference: { jp:'{0}を参照するデータ', en:'Data that references {0}' },
            LabelRowsPerPage: { jp:'1ページあたり件数', en:'Number of lines per page' },
            LabelOpenNewWindow: { jp:'別ウィンドウで開く', en:'Open in a new window' },
            LabelConfirmation: { jp:'確認', en:'Confirmation' },
            TypeAutoNumber: { jp:'自動採番', en:'Auto Number' },
            TypeDate: { jp:'日付', en:'Date' },
            TypeDateTime: { jp:'日付/時間', en:'Date/Time' },
            TypeNumber: { jp:'数値', en:'Number' },
            TypeCurrency: { jp:'通貨', en:'Currency' },
            TypePercent: { jp:'パーセント', en:'Percent' },
            TypeText: { jp:'テキスト', en:'Text' },
            TypeTextArea: { jp:'テキストエリア', en:'Text Area' },
            TypeLongTextArea: { jp:'ロングテキストエリア', en:'Long Text Area' },
            TypeCheckbox: { jp:'チェックボックス', en:'Checkbox' },
            TypeMasterDetail: { jp:'主従関係', en:'Master-Detail' },
            TypeLookup: { jp:'参照関係', en:'Lookup' },
            TypePicklist: { jp:'選択リスト', en:'Picklist' },
            TypePicklistMulti: { jp:'選択リスト(複数選択)', en:'Picklist (Multi-Select)' },
            TypeFormula: { jp:'数式', en:'Formula' },
            TypeExternalId: { jp:'(外部ID)', en:'(External ID)' },
            TypeUnique: { jp:'ユニーク', en:'Unique' },
            TypeCaseSensitive: { jp:'大文字と小文字を区別する', en:'Case Sensitive' },
            X: {}
        };
    }
    static getMessageAll(){
        return {
            msg2000000: {
                jp:'ERROR',
                en:'ERROR'
            },
            msg2000010: {
                jp:'お待ちください',
                en:'Please wait..'
            },
            msg2000020: {
                jp:'データを読み込んでいます',
                en:'Loading data..'
            },
            msg2000030: {
                jp:'データを更新しています',
                en:'Updating data..'
            },
            msg2000035: {
                jp:'データを削除しています',
                en:'Deleting data..'
            },
            msg2000040: {
                jp:'データを数えています',
                en:'Counting the data..'
            },
            msg2000050: {
                jp:'データを検索しています',
                en:'Searching..'
            },
            msg2000110: {
                jp:'削除対象をチェックしてください',
                en:'Check the deletion target.'
            },
            msg2000120: {
                jp:'選択された{0}件のレコードを削除します。よろしいですか？',
                en:'Deletes the selected {0} records. Is it OK?'
            },
            msg2000130: {
                jp:'【最終確認】<br/>削除を実行します。よろしいですか？',
                en:'[Final confirmation] <br/>Execute the deletion. Is it OK?'
            },
            msg2000140: {
                jp:'復元対象をチェックしてください',
                en:'Check the restoration target.'
            },
            msg2000150: {
                jp:'選択された{0}件のレコードを復元します。よろしいですか？',
                en:'Restores the selected {0} records. Is it OK?'
            },
            msg2000160: {
                jp:'{0} を削除してよろしいですか？',
                en:'Are you sure you want to delete {0}?'
            },
            msg2000170: {
                jp:'{0} を復元してよろしいですか？',
                en:'Are you sure you want to restore {0}?'
            },
            msg2000180: {
                jp:'編集内容を登録します。よろしいですか？（登録すると元に戻せません）',
                en:'Save the edited content. Is it OK? (it cannot be restored)'
            },
            msg2000190: {
                jp:'入力内容で新規データを作成します。よろしいですか？',
                en:'Create new data with the input contents. Is it OK?'
            },
            msg2000200: {
                jp:'変更がありません',
                en:'No change'
            },
            msg2000210: {
                jp:'{0}の値が正しくありません',
                en:'{0} is incorrect.'
            },
            msg2000220: {
                jp:'ユーザはオブジェクトを照会できません',
                en:'User cannot query object.'
            },
            "hg00001000": {
                "jp":"付与",
                "en":"Provide"
            },
            "hg00001010": {
                "jp":"消化",
                "en":"Consume"
            },
            "hg00001020": {
                "jp":"失効日",
                "en":"Expiration date"
            },
            "hg00001030": {
                "jp":"付与日数",
                "en":"Provided days"
            },
            "hg00001040": {
                "jp":"消化日数",
                "en":"Consumed days"
            },
            "hg00001050": {
                "jp":"マイナス対象",
                "en":"Negative target"
            },
            "hg00001060": {
                "jp":"有効開始日",
                "en":"Effective date"
            },
            "hg00001070": {
                "jp":"有効終了日",
                "en":"End date"
            },
            "hg00001080": {
                "jp":"説明",
                "en":"Explanation"
            },
            "hg00001090": {
                "jp":"付与形態",
                "en":"Type of provided"
            },
            "hg00001100": {
                "jp":"臨時付与",
                "en":"Temporary Provided"
            },
            "hg00001110": {
                "jp":"定期付与",
                "en":"Scheduled Provided"
            },
            "hg00001120": {
                "jp":"実付与日数",
                "en":"Real provided days"
            },
            "hg00001130": {
                "jp":"取得義務判定対象",
                "en":"Obligation judgement to take paid leave"
            },
            "hg00001140": {
                "jp":"対象外とする",
                "en":"Exclude"
            },
            "hg00001150": {
                "jp":"失効",
                "en":"Expired"
            },
            "hg00001160": {
                "jp":"期間変更",
                "en":"Change period"
            },
            "hg00001170": {
                "jp":"休暇管理",
                "en":"Days management of leave"
            },
            "hg00001180": {
                "jp":"休暇グループ",
                "en":"Holiday Group"
            },
            "hg00001190": {
                "jp":"入払区分",
                "en":"P/C"
            },
            "hg00001200": {
                "jp":"絞り込み",
                "en":"Search"
            },
            "hg00001210": {
                "jp":"表示種類",
                "en":"Display type"
            },
            "hg00001220": {
                "jp":"データ入力",
                "en":"Data entry"
            },
            "hg00001230": {
                "jp":"全期間",
                "en":"Whole period"
            },
            "hg00001240": {
                "jp":"休暇履歴",
                "en":"Leave History"
            },
            "hg00001250": {
                "jp":"月次休暇履歴",
                "en":"Monthly Leave History"
            },
            "hg00001260": {
                "jp":"年次有給休暇の次回付与予定日",
                "en":"Next scheduled date of annual paid leave"
            },
            "hg00001270": {
                "jp":"次回付与予定日の変更",
                "en":"Change of next scheduled provide date"
            },
            "hg00001280": {
                "jp":"付与データの登録",
                "en":"Registration of provide data"
            },
            "hg00001290": {
                "jp":"消化データの登録",
                "en":"Registration of consumed data"
            },
            "hg00001300": {
                "jp":"マイナス調整",
                "en":"Negative adjustment"
            },
            "hg00001310": {
                "jp":"マイナス付与データの登録",
                "en":"Registration of Negative provide data"
            },
            "hg00001320": {
                "jp":"有効期間",
                "en":"Validity period"
            },
            "hg00001330": {
                "jp":"期間で指定",
                "en":"Specified by period"
            },
            "hg00001340": {
                "jp":"消化開始日",
                "en":"Consumed start date"
            },
            "hg00001350": {
                "jp":"消化終了日",
                "en":"Consumed end date"
            },
            "hg00001360": {
                "jp":"消化日",
                "en":"Consumed date"
            },
            "hg00001370": {
                "jp":"付与時間",
                "en":"Provided time"
            },
            "hg00001380": {
                "jp":"消化時間",
                "en":"Consumed time"
            },
            "hg00001390": {
                "jp":"対象年度",
                "en":"Target year"
            },
            "hg00001400": {
                "jp":"日タイプ",
                "en":"Day type"
            },
            "hg00001410": {
                "jp":"1（所定休日）",
                "en":"1 (Regular holiday)"
            },
            "hg00001420": {
                "jp":"2（法定休日）",
                "en":"2 (Legal holiday)"
            },
            "hg00001430": {
                "jp":"3（祝日）",
                "en":"3 (Public holiday)"
            },
            "hg00001440": {
                "jp":"過消化を許容する",
                "en":"Allow Overconsumption"
            },
            "hg00001450": {
                "jp":"付与日数または付与時間を入力してください",
                "en":"Enter the number of days or time of provide"
            },
            "hg00001460": {
                "jp":"消化日数または消化時間を入力してください",
                "en":"Enter the number of days or time of consumed"
            },
            "hg00001470": {
                "jp":"除外日を入力",
                "en":"Enter the exclusion date"
            },
            "hg00001480": {
                "jp":"除外日はYYYYMMDDで複数ある場合は':'(コロン)区切りで日付を指定します",
                "en":"Enter the exclusion date in YYYYMMDD. If there is more than one, specify the dates separated by':' (colon)."
            },
            "hg00001490": {
                "jp":"除外日の書式が正しくありません",
                "en":"Exclusion date format is incorrect."
            },
            "hg00001500": {
                "jp":"期間に存在しない日付が除外日に指定されています",
                "en":"Do not enter a date that does not exist in the period as an exclusion date."
            },
            "hg00001510": {
                "jp":"期間と消化日数が整合しません",
                "en":"Period and number of days of consumption do not match."
            },
            "hg00001520": {
                "jp":"すべてマイナスする",
                "en":"Minus everything"
            },
            "hg00001530": {
                "jp":"{0}データの編集",
                "en":"Editing {0} data"
            },
            "hg00001540": {
                "jp":"{0}データの削除",
                "en":"Deletion of {0} data"
            },
            "hg00001550": {
                "jp":"{0}データを削除します",
                "en":"Delete the {0} data"
            },
            "hg00001560": {
                "jp":"{0}年",
                "en":"{0} years"
            },
            "hg00001570": {
                "jp":"{0}ヵ月",
                "en":"{0} months"
            },
            "hg00001580": {
                "jp":"{0}日",
                "en":"{0} days"
            },
            "hg00001590": {
                "jp":"{0}が不正です",
                "en":"{0} is incorrect"
            },
            "hg00001600": {
                "jp":"{0}を選択してください",
                "en":"Select the {0}"
            },
            "hg00001610": {
                "jp":"{0}を入力してください",
                "en":"Enter {0}"
            },
            "hg00001620": {
                "jp":"入払<br/>区分",
                "en":"P/C"
            },
            "hg00001630": {
                "jp":"付与<br/>日数",
                "en":"Provide<br/>days"
            },
            "hg00001640": {
                "jp":"付与<br/>時間",
                "en":"Provide<br/>time"
            },
            "hg00001650": {
                "jp":"消化<br/>日数",
                "en":"Consumed<br/>days"
            },
            "hg00001660": {
                "jp":"消化<br/>時間",
                "en":"Consumed<br/>time"
            },
            "hg00001670": {
                "jp":"月初残<br/>日数",
                "en":"Remain days<br/>at begin"
            },
            "hg00001680": {
                "jp":"月初残<br/>時間",
                "en":"Remain time<br/>at begin"
            },
            "hg00001690": {
                "jp":"月末残<br/>日数",
                "en":"Remain days<br/>at end"
            },
            "hg00001700": {
                "jp":"月末残<br/>時間",
                "en":"Remain time<br/>at end"
            },
            "hg00001710": {
                "jp":"過消化<br/>日数",
                "en":"Overconsumption<br/>days"
            },
            "hg00001720": {
                "jp":"過消化<br/>時間",
                "en":"Overconsumption<br/>time"
            },
            "hg00001730": {
                "jp":"制限外<br/>時間",
                "en":"Out of time<br/>limit"
            },
            "hg00001740": {
                "jp":"計画<br/>有休",
                "en":"Planned<br/>Leave"
            },
            "hg00001750": {
                "jp":"マイナ<br/>ス付与",
                "en":"Minus<br/>provide"
            },
            "hg00001760": {
                "jp":"定期<br/>付与",
                "en":"Periodic<br/>provide"
            },
            "hg00001770": {
                "jp":"取得<br/>義務外",
                "en":"Not<br/>obligatory"
            },
            "hg00001780": {
                "jp":"実付与<br/>日数",
                "en":"Actual<br/>provide days"
            },
            "hg00001790": {
                "jp":"基準<br/>時間",
                "en":"Base<br/>time"
            },
            "hg00001800": {
                "jp":"説明等",
                "en":"Explanation etc."
            },
            "hg00001810": {
                "jp":"休暇型",
                "en":"Leave type"
            },
            "hg00001820": {
                "jp":"開始日",
                "en":"Start date"
            },
            "hg00001830": {
                "jp":"終了日",
                "en":"End date"
            },
            "hg00001840": {
                "jp":"除外日",
                "en":"Exclusion date"
            },
            "hg00001850": {
                "jp":"消化期間",
                "en":"Consumed period"
            },
            "hg00001860": {
                "jp":"終日休",
                "en":"Day Off"
            },
            "hg00001870": {
                "jp":"午前半休",
                "en":"Morning Leave"
            },
            "hg00001880": {
                "jp":"午後半休",
                "en":"Afternoon Leave"
            },
            "hg00001890": {
                "jp":"時間単位休",
                "en":"Hourly leave"
            },
            "hg00001900": {
                "jp":"期間",
                "en":"Period"
            },
            "hg00001910": {
                "jp":"消化日にはマイナス対象の有効期間内の日付を入力してください",
                "en":"For the date of consumed date, enter the date within the valid period of the minus target"
            },
            "hg00001920": {
                "jp":"時間単位有休調整",
                "en":"Hourly paid leave adjustment"
            },
            "hg00001930": {
                "jp":"（退社日 {0}）",
                "en":" (End date {0})"
            },
            "hg00001940": {
                "jp":"マイナス対象となるデータはありません",
                "en":"There is no provided data that can be negatively target."
            },
            "hg00001950": {
                "jp":"※ 関連するマイナス付与データも同時に削除します",
                "en":"* The related negative provided data is also deleted at the same time."
            },
            "hg00001960": {
                "jp":"残日数 {0}",
                "en":"Available {0}"
            },
            "hg00001970": {
                "jp":"データチェック",
                "en":"Data Check"
            },
            "hg00001980": {
                "jp":"データは最新の状態です",
                "en":"The data is up to date"
            },
            "hg00001990": {
                "jp":"データは最新ではありません。更新しますか？",
                "en":"The data is not up to date. Do you want to update?"
            },
            "hg00002000": {
                "jp":"{0} 以降",
                "en":"After {0}"
            },
            "hg00002010": {
                "jp":"（マイナス付与）",
                "en":"(Negative provide) "
            },
            "hg00002020": {
                "jp":"日数の整数部分は2桁以内で入力してください",
                "en":"Enter the integer number of days within 2 digits"
            },
            "hg00002030": {
                "jp":"マイナス",
                "en":"Minus"
            },
            "hg00002040": {
                "jp":"プラス",
                "en":"Plus"
            },
            "hg00002050": {
                "jp":"CSVダウンロード",
                "en":"CSV download"
            },
            "hg00002060": {
                "jp":"自動付与予定",
                "en":"Scheduled to be automatically provided"
            },
            "hg00000900": {
                "jp":"管理メニュー",
                "en":"Management Menu"
            },
            "hg00000910": {
                "jp":"社員一覧",
                "en":"Employees List"
            },
            "tk10000357": {
                "jp":"社員設定",
                "en":"Employee Settings"
            },
            "empCode_label": {
                "jp":"社員コード",
                "en":"Employee Code"
            },
            "empName_label": {
                "jp":"社員名",
                "en":"Employee Name"
            },
            "empEntryDate_label": {
                "jp":"入社日",
                "en":"Start Date"
            },
            "tk10000063": {
                "jp":"月度",
                "en":"Month"
            },
            "status_head": {
                "jp":"ステータス",
                "en":"Status"
            },
            "range_label": {
                "jp":"期間",
                "en":"Date Range"
            },
            "wave_label": {
                "jp":"～",
                "en":" - "
            },
            "all_label": {
                "jp":"すべて",
                "en":"All"
            },
            "NotConfirmed": {
                "jp":"未確定",
                "en":"Not confirmed"
            },
            "CancelFinalize": {
                "jp":"確定取消",
                "en":"Cancel Finalize"
            },
            "CancelRequest": {
                "jp":"申請取消",
                "en":"Cancel Request"
            },
            "Reject": {
                "jp":"却下",
                "en":"Reject"
            },
            "Rejected": {
                "jp":"却下済み",
                "en":"Rejected"
            },
            "ApprovalPending": {
                "jp":"承認待ち",
                "en":"Approval Pending"
            },
            "Finalized": {
                "jp":"確定済み",
                "en":"Finalized"
            },
            "Approved": {
                "jp":"承認済み",
                "en":"Approved"
            },
            x: {}
        };
    }
    static getHintAll(){
        return {
            HintSObjectDL: {
                jp:'オブジェクト一覧またはオブジェクト項目定義情報をCSV形式でダウンロードします。',
                en:'Download the object list or object item definition information in CSV format.'
            },
            HintSObjectListDL: {
                jp:'フィルタで絞られたオブジェクト一覧をCSV形式でダウンロードします。DescribeSObjectResultから得た情報を出力します（全部ではありません）。',
                en:'Download the filtered object list in CSV format. Outputs the information obtained from DescribeSObjectResult (not all, may change depending on API version).'
            },
            HintSObjectFieldDLV1: {
                jp:'選択したオブジェクトの項目定義情報をCSV形式でダウンロードします。DescribeFieldResultから得た情報を出力します（全部ではありません）。',
                en:'Downloads the item definition information of the selected object in CSV format. Outputs the information obtained from DescribeFieldResult (not all, may change depending on API version).'
            },
            HintSObjectFieldDLV2: {
                jp:'選択したオブジェクトの項目定義情報をCSV形式でダウンロードします。旧view=2の同機能の出力内容に合わせています。',
                en:'Downloads the item definition information of the selected object in CSV format. It matches the output content of the same function of the old view = 2.'
            },
            HintSObjectDataDL: {
                jp:'条件に該当する全レコードをCSV形式でダウンロードします。並び順はID順固定です。',
                en:'Download all the records that meet the conditions in CSV format. The order is fixed to ID order.'
            },
            HintSObjectDelete: {
                jp:'選択したデータ（ゴミ箱のデータは除く）をまとめて削除します。',
                en:'Deletes the selected data (excluding the data in the trash can) at once.'
            },
            HintSObjectRestore: {
                jp:'選択したゴミ箱のデータをまとめて復元します。',
                en:'Restores the selected Trash data in bulk.'
            },
            HintSObjectListPage: {
                jp:'表示できるのは 2000 件までです。',
                en:'Up to 2000 items can be displayed.'
            },
            HintSObjectListNew: {
                jp:'新規データ作成画面に移ります。',
                en:'Moves to the new data creation mode.'
            },
            HintSObjectListAllRows: {
                jp:'ゴミ箱のデータを含むすべてのデータを検索対象にします。ゴミ箱のデータ（IsDeleted=true）は背景色をグレーで表示します。',
                en:'All data, including data in the recycle bin, will be searched. Records in the recycle bin (IsDeleted=true) will be displayed with a gray background color.'
            },
            HintSObjectDataEdit: {
                jp:'編集画面に移ります。',
                en:'Move to edit mode.'
            },
            HintSObjectDataDelete: {
                jp:'表示中のデータを削除します。',
                en:'Delete the displayed data.'
            },
            HintSObjectDataRestore: {
                jp:'表示中のデータを復元します。',
                en:'Restores the displayed data.'
            },
            HintSObjectDataClone: {
                jp:'表示中のデータの複製画面に移ります。',
                en:'Duplicate the displayed data.'
            },
            HintSObjectCascadeDel: {
                jp:'isCascadeDelete<br/>親オブジェクトの削除時に子オブジェクトが削除される場合は○',
                en:'isCascadeDelete<br/>If the child object is deleted when the parent object is deleted, ○'
            },
            HintSObjectRestictedDel: {
                jp:'isRestrictedDelete<br/>子オブジェクトから参照されていると親オブジェクトを削除できない場合は○',
                en:'isRestrictedDelete<br/>If the parent object cannot be deleted when it is referenced from the child object, ○'
            },
            HintSObjectRelationCount: {
                jp:'(click)リンクをクリックすると本データを参照するデータの件数をカウントします。［件数カウント］ボタンをクリックすると一括で件数カウントを行います。<br/>件数の数値をクリックするとデータ検索画面に遷移します。',
                en:'Clicking the "(click)" link counts the number of data that refers to this data. Click the [Count Count] button to count the number of cases at once. <br/> Click the number of cases to move to the data search.'
            },
            HintSObjectRelationShipCount: {
                jp:'本データを参照する各リレーションのデータ件数をカウントします。',
                en:'The number of data that refers to this data is counted for each displayed relation.'
            },
            HintSObjectRelationShipCopy: {
                jp:'表の内容をタブ区切りテキストでクリップボードへコピーします。',
                en:'Copy the contents of the table to the clipboard.'
            }
        };
    }
}