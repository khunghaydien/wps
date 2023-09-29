/**
 * 経費精算のロード
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId     </td><td>{String}</td><td>社員ID    </td><td>省略可</td></tr>
 *     <tr><td>expApplyId</td><td>{String}</td><td>経費申請ID</td><td>省略可</td></tr>
 *     <tr><td>mode      </td><td>{String}</td><td>モード    </td><td>省略可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadEmpExp = function(params, pouch, thisObject, onSuccess, onFailure){
    var o = { params: params };
    teasp.action.contact.remoteMethod('loadEmpExp',
        [
              params.empId
            , params.expApplyId
            , (params.mode  || '')
        ],
        function(result){
            if(result.result == 'OK'){
                o.params.empId = result.empId;
                pouch.setKeyObj('params', o.params);
                var s = null, t = null;
                if(result.targetEmp.length == 1){ // レコードが１件の場合、対象社員とセッションユーザは同じ
                    t  = result.targetEmp[0];
                    s  = result.targetEmp[0];
                }else if(result.targetEmp.length > 1){
                    t  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 0 : 1];
                    s  = result.targetEmp[teasp.util.equalId(result.targetEmp[0].Id, o.params.empId) ? 1 : 0];
                }
                pouch.setKeyObj('isJobLeader', result.isJobleader);
                pouch.setKeyObj('sessionInfo'      , teasp.logic.convert.convSessionInfoObj(s, t, result.rights));
                pouch.setKeyObj('targetEmp'        , teasp.logic.convert.convTargetEmpObj(t, o.params.mode));
                pouch.setKeyObj('common'           , teasp.logic.convert.convCommonObj(result.common, result.borderRevNo));
                pouch.setKeyObj('payeeTypeNums'    , result.payeeTypeNums);
                if(!pouch.getEmpId()){
                    onSuccess.apply(thisObject, [true]);
                }else{
                    pouch.setKeyObj('expLogs'          , teasp.logic.convert.convExpLogObjs(result.expLogs || []));
                    pouch.setKeyObj('infos'            , teasp.logic.convert.convInfoObjs(result.infos));
                    pouch.setKeyObj('rejects'          , teasp.logic.convert.convRejectApplyList(result));
                    pouch.setKeyObj('expApply'         , teasp.logic.convert.convExpApplyObjs(result.expApplys || []));
                    pouch.setKeyObj('expApplyHistory'  , teasp.logic.convert.convExpApplyHistory(result.history));
                    pouch.setKeyObj('approver'         , teasp.logic.convert.convApprover(result.approver));
                    if(result.steps){
                        var as = teasp.logic.convert.convMixApplySteps(result, true, true);
                        pouch.setKeyObj('expApplySteps', ((typeof(as) == 'object' ? as.steps : as) || []));
                    }
                    pouch.setKeyObj('atkApplyTypeList' , result.atkApplyTypeList);
                    onSuccess.apply(thisObject, [false]);

                    teasp.action.contact.loadEmpExpDelay(pouch, thisObject, onSuccess, onFailure);
                }
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
 * 経費精算の遅延ロード
 *
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.loadEmpExpDelay = function(pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.remoteMethod('loadEmpExpDelay',
        [
            pouch.getEmpId(),
            (pouch.getExpApplyId() || '')
        ],
        function(result){
            if(result.result == 'OK'){
                pouch.setKeyObj('jobAssigns'     , teasp.logic.convert.convJobAssignObjs(result.jobAssign || []));
                pouch.setKeyObj('works'          , teasp.logic.convert.convWorkObjs(result.empWorks || []));
                pouch.setKeyObj('expItems'       , teasp.logic.convert.convExpItemObjs(result.expItems || []));
                pouch.setKeyObj('foreignCurrency', teasp.logic.convert.convForeignCurrencyObjs(result.foreignCurrency || []));
                pouch.setKeyObj('expHistory'     , (result.expHistory || null));
                pouch.setKeyObj('approverSet'    , teasp.logic.convert.convApproverSetObjs(result.approverSet));
                onSuccess.apply(thisObject, [true]);
            }else{
                onFailure.apply(thisObject, [result.error]);
            }
        },
        function(event){
        }
    );
};

/**
 * 経費精算の申請データ変更
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId     </td><td>{String}</td><td>社員ID    </td><td>省略不可</td></tr>
 *     <tr><td>expApplyId</td><td>{String}</td><td>経費申請ID</td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.transEmpExp = function(params, pouch, thisObject, onSuccess, onFailure){
    var o = { params: params };
    teasp.action.contact.remoteMethod('transEmpExp',
        [
              params.empId
            , params.expApplyId
            , pouch.getMode()
        ],
        function(result){
            if(result.result == 'OK'){
                pouch.setKeyObj('params', o.params);
                pouch.setKeyObj('expLogs'          , teasp.logic.convert.convExpLogObjs(result.expLogs || []));
                pouch.setKeyObj('expApply'         , teasp.logic.convert.convExpApplyObjs(result.expApplys || []));
                pouch.setKeyObj('rejects'          , teasp.logic.convert.convRejectApplyList(result));
                pouch.setKeyObj('works'            , teasp.logic.convert.convWorkObjs(result.empWorks || []));
                pouch.setKeyObj('approver'         , teasp.logic.convert.convApprover(result.approver));
                pouch.setKeyObj('expApplyHistory'  , teasp.logic.convert.convExpApplyHistory(result.history));
                onSuccess.apply(thisObject, [true]);
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
 * 経費精算の承認履歴取得
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>expApplyId</td><td>{String}</td><td>申請ID </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getExpApplySteps = function(obj, pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.remoteMethod('getExpApplySteps',
        [
            obj.expApplyId
        ],
        function(result){
            if(result.result == 'OK'){
                onSuccess.apply(thisObject, [true, teasp.logic.convert.convMixApplySteps(result, true, true)]);
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
 * 駅探検索
 *
 * @param {Object} params パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId        </td><td>{String}</td><td>社員ID            </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">expDate      </td><td>{String}</td><td>日付              </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">mode         </td><td>{Number}</td><td>0:交通費 1:定期代 </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">stationFrom  </td><td>        </td><td>発駅              </td><td>省略不可</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>name</td><td>{String}</td><td>駅                </td><td>省略不可</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>code</td><td>{String}</td><td>駅コード          </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">stationTo    </td><td>        </td><td>着駅              </td><td>省略不可</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>name</td><td>{String}</td><td>駅                </td><td>省略不可</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>code</td><td>{String}</td><td>駅コード          </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">stationVia   </td><td>[       </td><td>経由              </td><td>省略不可</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>name</td><td>{String}</td><td>着駅              </td><td>省略不可</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>code</td><td>{String}</td><td>着駅コード        </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.searchRoute = function(params, pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.remoteMethod('searchRoute', params,
        function(result){
            if(result.result == 'OK'){
                onSuccess.apply(thisObject, [true, result]);
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
 * 経費選択別ジョブ変更
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId        </td><td>{String}</td><td>社員ID            </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">setDate      </td><td>{String}</td><td>日付              </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">setJobId     </td><td>{String}</td><td>変更先のジョブID  </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">expLogs      </td><td>[       </td><td>                  </td><td>        </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>id  </td><td>{String} </td><td>明細ID           </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 *
 * @author cmpArai
 */
teasp.action.contact.changeEmpExpJob = function(obj, pouch, thisObject, onSuccess, onFailure){
    var openerClass = obj.openerClass;
    delete obj.openerClass;
    teasp.action.contact.remoteMethod('changeEmpExpJob',
            obj,
        function(result){
            if(result.result == 'OK'){
                if(openerClass=='Daily'){
                    teasp.action.contact.changeEmpExpDJDayDelay(pouch, thisObject, onSuccess, onFailure);
                }else if(openerClass=='EmpExps'){
                    teasp.action.contact.changeEmpExpDJDelay(pouch, thisObject, onSuccess, onFailure);
                }
                //onSuccess.apply(thisObject);
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
 * 経費選択別日付変更
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId        </td><td>{String}</td><td>社員ID            </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">setDate      </td><td>{String}</td><td>更新先日付        </td><td>省略不可</td></tr>
 *     <tr><td colspan="2">expLogs      </td><td>[       </td><td>                  </td><td>        </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>id  </td><td>{String} </td><td>明細ID           </td><td>省略不可</td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 *
 * @author cmpArai
 */
teasp.action.contact.changeEmpExpDate = function(obj, pouch, thisObject, onSuccess, onFailure){
    var openerClass = obj.openerClass;
    delete obj.openerClass;
    teasp.action.contact.remoteMethod('changeEmpExpDate',
            obj,
        function(result){
            if(result.result == 'OK'){
                if(openerClass=='Daily'){
                    teasp.action.contact.changeEmpExpDJDayDelay(pouch, thisObject, onSuccess, onFailure);
                }else if(openerClass=='EmpExps'){
                    teasp.action.contact.changeEmpExpDJDelay(pouch, thisObject, onSuccess, onFailure);
                }
                //onSuccess.apply(thisObject, [result]);
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
 * 経費選択別ジョブ変更送信後処理（タイムレポート画面）
 *
 * @author cmpArai
 */
teasp.action.contact.changeEmpExpDJDayDelay = function(pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.transEmpDay(
    {
        empId  : pouch.getEmpId(),
        date   : pouch.getParamDate()
    },
    pouch,
    thisObject,
    onSuccess,
    onFailure
    );
};

/**
 * 経費選択別ジョブ変更送信後処理（経費精算画面）
 *
 * @author cmpArai
 */
teasp.action.contact.changeEmpExpDJDelay = function(pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.transEmpExp(
        {
            empId      : pouch.getEmpId(),
            expApplyId : pouch.getExpApplyId()
        },
        pouch,
        thisObject,
        onSuccess,
        onFailure
    );
};


/**
 * 経費の登録
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId           </td><td>{String} </td><td>社員ID                </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">expApplyId      </td><td>{String} </td><td>申請ID                </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">date            </td><td>{String} </td><td>日付                  </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">expLogs         </td><td>[        </td><td>                      </td><td>            </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>id     </td><td>{String} </td><td>明細ID                </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>jobId              </td><td>{String} </td><td>ジョブID              </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>expItemId          </td><td>{String} </td><td>費目ID                </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>cost               </td><td>{Number} </td><td>金額                  </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>detail             </td><td>{String} </td><td>備考                  </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>startName          </td><td>{String} </td><td>発駅名                </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>startCode          </td><td>{String} </td><td>発駅コード            </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>endName            </td><td>{String} </td><td>着駅名                </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>endCode            </td><td>{String} </td><td>着駅コード            </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>roundTrip          </td><td>{Boolean}</td><td>true:往復             </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>route              </td><td>{String} </td><td>経路(JSONシリアライズ)</td><td>省略不可    </td></tr>
 *     <tr><td></td><td>receipt            </td><td>{Boolean}</td><td>領収書要否            </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>transportType      </td><td>{String} </td><td>費目タイプ
 *         <table>
 *         <tr><td>0</td><td>交通費以外</td></tr>
 *         <tr><td>1</td><td>駅探検索</td></tr>
 *         <tr><td>2</td><td>駅探検索以外</td></tr>
 *         </table>
 *     </td><td>省略不可    </td></tr>
 *     <tr><td></td><td>order              </td><td>{Number} </td><td>並び順                </td><td>省略不可    </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.saveEmpExp = function(obj, pouch, thisObject, onSuccess, onFailure){
    var req = dojo.clone(obj);
    req.expHistory = null;
    teasp.action.contact.remoteMethod('saveEmpExp',
        req,
        function(result){
            if(result.result == 'OK'){
                pouch.replaceExpLogs(obj.date, obj.expApplyId, teasp.logic.convert.convExpLogObjs(result.expLogs || []));
                onSuccess.apply(thisObject, [true]);
                if(obj.expHistory){
                    teasp.action.contact.saveEmpExpDelay(obj, pouch, thisObject, onSuccess, onFailure);
                }
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
 * 駅探検索履歴の登録
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{String} </td><td>社員ID                        </td><td>省略不可    </td></tr>
 *     <tr><td>expHistory      </td><td>{String} </td><td>駅探検索履歴(JSONシリアライズ)</td><td>省略不可    </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.saveEmpExpDelay = function(obj, pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.remoteMethod('saveEmpExpDelay',
        [
            obj.empId,
            obj.expHistory
        ],
        function(result){
        },
        function(event){
        }
    );
};

/**
 * 駅探検索設定の登録
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId           </td><td>{String} </td><td>社員ID                        </td><td>省略不可    </td></tr>
 *     <tr><td colspan="2">expConfig       </td><td>         </td><td>駅探設定                      </td><td>            </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>commuterRouteCode    </td><td>{String} </td><td>定期コード      </td><td>省略不可    </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>commuterRouteNote    </td><td>{String} </td><td>定期区間        </td><td>省略不可    </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>ekitanArea           </td><td>{Number} </td><td>駅探検索エリア
 *         <table>
 *         <tr><td>-1</td><td>全国  </td></tr>
 *         <tr><td> 0</td><td>首都圏</td></tr>
 *         <tr><td> 1</td><td>関西  </td></tr>
 *         <tr><td> 2</td><td>東海  </td></tr>
 *         <tr><td> 3</td><td>北海道</td></tr>
 *         <tr><td> 4</td><td>東北  </td></tr>
 *         <tr><td> 5</td><td>北陸  </td></tr>
 *         <tr><td> 6</td><td>甲信越</td></tr>
 *         <tr><td> 7</td><td>中国  </td></tr>
 *         <tr><td> 8</td><td>四国  </td></tr>
 *         <tr><td> 9</td><td>九州  </td></tr>
 *         </table>
 *     </td><td>省略不可    </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>excludeCommuterRoute </td><td>{Boolean}</td><td>定期区間の取扱
 *         <table>
 *         <tr><td>false</td><td>考慮しない        </td></tr>
 *         <tr><td>true </td><td>除いた交通費を計算</td></tr>
 *         </table>
 *     </td><td>省略不可    </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>preferredAirLine     </td><td>{Number} </td><td>優先する航空会社
 *         <table>
 *         <tr><td>0</td><td>なし        </td></tr>
 *         <tr><td>1</td><td>JAL         </td></tr>
 *         <tr><td>2</td><td>ANA         </td></tr>
 *         <tr><td>4</td><td>SKY/ADO     </td></tr>
 *         </table>
 *     </td><td>省略不可    </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>routePreference      </td><td>{Number} </td><td>検索結果のソート
 *         <table>
 *         <tr><td>0</td><td>時間優先    </td></tr>
 *         <tr><td>1</td><td>料金優先    </td></tr>
 *         <tr><td>2</td><td>乗換回数優先</td></tr>
 *         <tr><td>3</td><td>定期料金優先</td></tr>
 *         </table>
 *     </td><td>省略不可    </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>usePaidExpress       </td><td>{Boolean}</td><td>特急/新幹線を使う
 *         <table>
 *         <tr><td>false</td><td>自由席    </td></tr>
 *         <tr><td>true </td><td>指定席    </td></tr>
 *         </table>
 *     </td><td>省略不可    </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>useReservedSheet     </td><td>{Boolean}</td><td>特急料金
 *         <table>
 *         <tr><td>false</td><td>使わない  </td></tr>
 *         <tr><td>true </td><td>使う      </td></tr>
 *         </table>
 *     </td><td>省略不可    </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.saveEmpExpConfig = function(obj, pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.remoteMethod('saveEmpExpConfig',
        obj,
        function(result){
            if(result.result == 'OK'){
                onSuccess.apply(thisObject, [true, obj]);
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
 * 経費申請
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td colspan="2">empId           </td><td>{String} </td><td>社員ID                </td><td>省略不可  </td></tr>
 *     <tr><td colspan="2">expApplyId      </td><td>{String} </td><td>申請ID                </td><td>省略不可  </td></tr>
 *     <tr><td colspan="2">details         </td><td>[        </td><td>申請対象リスト        </td><td>          </td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>id     </td><td>{String} </td><td>明細ID                </td><td>省略不可  </td></tr>
 *     <tr><td></td><td>comment            </td><td>{String} </td><td>コメント              </td><td>省略不可  </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.submitExpApply = function(obj, pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.remoteMethod('submitExpApply',
        obj,
        function(result){
            if(result.result == 'OK'){
                teasp.logic.convert.excludeNameSpace(result);
                teasp.action.contact.transEmpExp({
                    empId      : pouch.getEmpId(),
                    expApplyId : result.expLogs[0].ExpApplyId__r.Id
                }, pouch, thisObject, onSuccess, onFailure);
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
 * 経費申請の取消
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>expApplyId      </td><td>{String} </td><td>申請ID                </td><td>省略不可  </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.cancelExpApply = function(obj, pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.remoteMethod('cancelExpApply',
        obj,
        function(result){
            if(result.result == 'OK'){
                teasp.logic.convert.excludeNameSpace(result);
                teasp.action.contact.transEmpExp({
                    empId      : pouch.getEmpId(),
                    expApplyId : null
                }, pouch, thisObject, onSuccess, onFailure);
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
 * 費目マスタ取得（テスト・デモデータ作成用）
 *
 * @param {*} obj (不要)
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getAtkExpItems = function(obj, pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.remoteMethod('getAtkExpItems',
        [
        ],
        function(result){
            pouch.setKeyObj('expItems' , teasp.logic.convert.convExpItemObjs(result.expItems || []));
            onSuccess.apply(thisObject, [true]);
        },
        function(event){
            onFailure.apply(thisObject, [event]);
        }
    );
};

/**
 * 月内の経費データ取得（テスト・デモデータ作成用）
 *
 * @param {Object} obj パラメータ
 *     <table style="border-collapse:collapse;border:1px solid gray;" border="1">
 *     <tr><td>empId           </td><td>{String} </td><td>社員ID                </td><td>省略不可    </td></tr>
 *     <tr><td>month           </td><td>{Number} </td><td>月                    </td><td>省略不可    </td></tr>
 *     </table>
 * @param {teasp.data.Pouch} pouch データクラス
 * @param {Object} thisObject コールバック関数内でthisが参照するオブジェクト
 * @param {Function} onSuccess 正常時のコールバック関数
 * @param {Function} onFailure 異常時のコールバック関数
 */
teasp.action.contact.getExpByDate = function(obj, pouch, thisObject, onSuccess, onFailure){
    teasp.action.contact.remoteMethod('getExpByDate',
        [ obj.empId, obj.month ],
        function(result){
            pouch.setKeyObj('expLogs' , teasp.logic.convert.convExpLogObjs(result.expLogs || []));
            pouch.setKeyObj('jobApply', teasp.logic.convert.convJobApplyObj(result.jobApply || null));
            onSuccess.apply(thisObject, [true]);
        },
        function(event){
            onFailure.apply(thisObject, [event]);
        }
    );
};
