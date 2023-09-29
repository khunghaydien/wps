/**
 * 社員情報のロード
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID</td><td>省略可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadEMEmployee = function(params, pouch, thisObject, onSuccess, onFailure ) {
    var o = { params: params };
    teasp.action.contact.remoteMethod( 'loadEMEmployee'
        ,[
            ( params.empId || '' )
        ]
        ,function( result ) {
            if ( result.result == 'OK' ) {
                pouch.setKeyObj( 'EMEmployee', teasp.logic.convert.convEmployeeMaster( result.employee ) );
                var s = null, t = null;
                if(result.targetEmp.length == 1){ // レコードが１件の場合、対象社員とセッションユーザは同じ
                    t  = result.targetEmp[0];
                    s  = result.targetEmp[0];
                }else if(result.targetEmp.length > 1){
                    t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
                    s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
                }
                pouch.setKeyObj('sessionInfo', teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
                pouch.setKeyObj('targetEmp'  , teasp.logic.convert.convTargetEmpObj(t, o.params.mode));
                pouch.setKeyObj( 'common'  , teasp.logic.convert.convCommonObj( result.common, result.borderRevNo ) );
                onSuccess.apply(thisObject, [true]);
            }
            else {
                onFailure.apply( thisObject, [result.error] );
            }
        },
        function( event ) {
            onFailure.apply( thisObject, [event] );
        }
    );
};

/**
 * 申請一覧情報取得
 *
 * @param {Object} obj パラメータ
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getRequestList = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getRequestList',
		[],
		function( result ) {
			if ( result.result == 'OK' ) {
				var requests = teasp.logic.convert.convRequestList( result.requests );
				onSuccess.apply(thisObject, [true, requests]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 申請作成時に必要な情報取得
 *
 * @param {Object} obj パラメータ
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getEmployeeMaster = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getEmployeeMaster',
		obj,
		function( result ) {
			if ( result.result == 'OK' ) {
				var o = {};
				teasp.logic.convert.excludeNameSpace(result);
				teasp.logic.convert.excludeTSEMNameSpace(result);
				o['request'] = result.request;
				o['events']  = result.events;
				o['setting']  = result.setting;
				onSuccess.apply(thisObject, [true, o]);
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * 申請の保存
 *
 * @param {Object} obj パラメータ
 *	 <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *	 <tr><td>EventRequestId	   </td><td>{String} </td><td>申請EventId				</td><td>			</td></tr>
 *	 <tr><td>Action					</td><td>{String} </td><td>処理(eventsubmit,eventdelete,flowsave,flowdelete)	</td><td>省略不可	</td></tr>
 *	 <tr><td>EmpId					</td><td>{String} </td><td>社員ID				</td><td>省略不可	</td></tr>
 *	 <tr><td>EventId			   </td><td>{String} </td><td>イベントId		</td><td>省略不可	</td></tr>
 *   <tr><td colspan="4">FlowBody フロー内容 ここから Actionが"eventsubmit"か"eventdelete"のみ省略可能</td></tr>
 *	 <tr><td>FlowRequestId	   </td><td>{String} </td><td>申請FlowId				</td><td>			</td></tr>
 *	 <tr><td>FlowPartsId			   </td><td>{String}   </td><td>フローパーツId				</td><td>省略不可	</td></tr>
 *   <tr><td colspan="4">Fields 項目内容 ここから</td></tr>
 *	 <tr><td>FieldName			   </td><td>{String}   </td><td>項目名		</td><td>省略不可	</td></tr>
 *	 <tr><td>FieldValue			   </td><td>{String}   </td><td>値		</td><td>省略不可	</td></tr>
 *	 <tr><td>DataType			   </td><td>{String}   </td><td>データ形式		</td><td>省略不可	</td></tr>
 *   <tr><td colspan="4">Fields 項目内容 ここまで</td></tr>
 *   <tr><td colspan="4">FlowBody フロー内容 ここまで</td></tr>
 *	 </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.executeChangeRequest = function( obj, pouch, thisObject, onSuccess, onFailure ) {
	var req = dojo.clone(obj);
	teasp.action.contact.remoteMethod( 'executeChangeRequest'
									  ,req
									  ,function( result ) {
									   if ( result.result == 'OK' ) {
											onSuccess.apply( thisObject, [true, result] );
										}
										else{
											onFailure.apply(thisObject, [result.error]);
										}
									},
									function(event)
									{
										onFailure.apply(thisObject, [event]);
									}
	);
};


/**
 * 申請の送信
 *
 * @param {Object} obj パラメータ
 *	 <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *	 <tr><td>EventRequestId	   </td><td>{String} </td><td>申請EventId				</td><td>			</td></tr>
 *	 <tr><td>Action					</td><td>{String} </td><td>処理(eventsave,eventdelete,flowsave,flowdelete)	</td><td>省略不可	</td></tr>
 *	 <tr><td>FlowRequestId	   </td><td>{String} </td><td>申請FlowId				</td><td>			</td></tr>
 *	 </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.executeAPIChangeRequest = function( obj, pouch, thisObject, onSuccess, onFailure ) {
	var req = dojo.clone(obj);
	teasp.action.contact.remoteMethod( 'executeAPIChangeRequest',
		req,
		function( result ) {
			if ( result.result == 'OK' ) {
				onSuccess.apply( thisObject, [true, result] );
			}else{
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event)
		{
			onFailure.apply(thisObject, [event]);
		}
	);
};


/////////// TSHR ///////////
/**
 * TSHR社員情報のロード
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId</td><td>{string}</td><td>社員ID</td><td>省略可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadHRMEmployee = function(params, pouch, thisObject, onSuccess, onFailure) {
    var o = { params: params };
    teasp.action.contact.remoteMethod('loadHRMEmployee'
        ,[
            (params.empId || '')
        ]
        ,function(result) {
            if (result.result == 'OK') {
				// HRM version1または1.2以降で作成された諸届に応じて変更申請の内容を表示するダイアログを分岐するため
				// HRMEmployeeだけでなくEMEmployeeを保持する。内容は同一。
				pouch.setKeyObj('HRMEmployee', teasp.logic.convert.convEmployeeMaster(result.employee));
				pouch.setKeyObj('EMEmployee', teasp.logic.convert.convEmployeeMaster(result.employee));
                var s = null, t = null;
                if (result.targetEmp.length == 1) { // レコードが１件の場合、対象社員とセッションユーザは同じ
                    t  = result.targetEmp[0];
                    s  = result.targetEmp[0];
                } else if(result.targetEmp.length > 1) {
                    t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
                    s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
                }
                pouch.setKeyObj('sessionInfo', teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
                pouch.setKeyObj('targetEmp', teasp.logic.convert.convTargetEmpObj(t, o.params.mode));
                pouch.setKeyObj('common', teasp.logic.convert.convCommonObj(result.common, result.borderRevNo));
                onSuccess.apply(thisObject, [true]);
            }
            else {
                onFailure.apply(thisObject, [result.error]);
            }
        },
        function(event) {
            onFailure.apply(thisObject, [event]);
        }
    );
};

/**
 * TSHR申請作成時に必要な情報取得
 *
 * @param {Object} obj パラメータ
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getHRMEmployeeMaster = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getHRMEmployeeMaster',
		obj,
		function(result) {
			if (result.result == 'OK') {
				var o = {};
				teasp.logic.convert.excludeNameSpace(result);
				teasp.logic.convert.excludeTSEMNameSpace(result);
				o['request'] = result.request;
				o['events']  = result.events;
				o['setting']  = result.setting;
				o['pickList'] = result.pickList;
				o['fieldSetting'] = result.fieldSetting;
				onSuccess.apply(thisObject, [true, o]);
			} else {
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * TSHR申請一覧情報取得
 *
 * @param {Object} obj パラメータ
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getHRMRequestList = function(obj, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('getHRMRequestList',
		[],
		function(result) {
			if (result.result == 'OK') {
				var requests = teasp.logic.convert.convRequestList(result.requests);
				onSuccess.apply(thisObject, [true, requests]);
			} else {
				onFailure.apply(thisObject, [result.error]);
			}
		},
		function(event){
			onFailure.apply(thisObject, [event]);
		}
	);
};

/**
 * TSHR諸届ナビのロード
 *
 * @param {Object} params パラメータ
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadHRMGuide = function(params, pouch, thisObject, onSuccess, onFailure) {
    var o = { params: params };
    teasp.action.contact.remoteMethod('loadHRMGuide'
        ,[
            (params.empId || '')
        ]
        ,function(result) {
            if (result.result == 'OK') {
				// HRM version1または1.2以降で作成された諸届に応じて変更申請の内容を表示するダイアログを分岐するため
				// HRMEmployeeだけでなくEMEmployeeを保持する。内容は同一。
                var s = null, t = null;
                if (result.targetEmp.length == 1) { // レコードが１件の場合、対象社員とセッションユーザは同じ
                    t  = result.targetEmp[0];
                    s  = result.targetEmp[0];
                } else if(result.targetEmp.length > 1) {
                    t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
                    s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
                }
                pouch.setKeyObj('sessionInfo', teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
                pouch.setKeyObj('targetEmp', teasp.logic.convert.convTargetEmpObj(t, o.params.mode));
                pouch.setKeyObj('common', teasp.logic.convert.convCommonObj(result.common, result.borderRevNo));

				var retMap = {};
				retMap['naviGroups'] = result.naviGroups;
                onSuccess.apply(thisObject, [true, retMap]);
            }
            else {
                onFailure.apply(thisObject, [result.error]);
            }
        },
        function(event) {
            onFailure.apply(thisObject, [event]);
        }
    );
};

/**
 * TSHR諸届ナビのグループIDを指定してイベントを取得する
 */
teasp.action.contact.loadHRMNaviEvents = function(params, pouch, thisObject, onSuccess, onFailure) {
    var o = { params: params };
	teasp.action.contact.remoteMethod('loadHRMNaviEvents'
        ,[
            params
        ]
        ,function(result) {
            if (result.result == 'OK') {
				var retMap = {};
				retMap['naviEvents'] = result.naviEvents;
                onSuccess.apply(thisObject, [true, retMap]);
            }
            else {
                onFailure.apply(thisObject, [result.error]);
            }
        },
        function(event) {
            onFailure.apply(thisObject, [event]);
        }
    );
};

/**
 * TSHR諸届ナビの質問完了時に実行(提出書類一覧を取得する)
 */
teasp.action.contact.saveAnswersHRMGuide = function(params, pouch, thisObject, onSuccess, onFailure){
	teasp.action.contact.remoteMethod('saveAnswersHRMGuide'
		,dojo.toJson(params)
		,function(result) {
			retMap = {};
			if (result.result == 'OK') {
				retMap['submissions'] = result.submissions;
				onSuccess.apply(thisObject, [true, retMap]);
			}
			else {
				onFailure.apply(thisObject, [result.error]);
			}
		},
        function (event) {
			onFailure.apply(thisObject, [event]);
		}
	);
}