teasp.provide('teasp.logic.EmpTime');
/**
 * 勤怠集計クラス.<br/>
 *
 * <pre>
 * 勤怠データのマージ・集計を行い、結果をオブジェクトにセットする。<br/>
 * 月次の勤怠の集計を行う場合、以下のように3つのメソッドを呼ぶ。
 * obj は集計するのに必要なデータを持っており下記メソッドは obj の内容を参照・更新する。
 *       var empTime  = ATK.empTime();
 *       empTime.mergeCalendar(obj);
 *       empTime.buildConfig(obj);
 *       empTime.buildEmpMonth(obj);
 * </pre>
 * 内部の呼び出し階層
 * <table style="margin-left:32px;border-collapse:collapse;border:1px solid black;">
 * <tr><td><pre><a href="#mergeCalendar">mergeCalendar(obj)</a>
 *     <a href="#isFixedMonth">isFixedMonth(obj, dkey)</a>
 *     <a href="#clearDayElements">clearDayElements(day)</a>
 *     <a href="#getMonthByDate">getMonthByDate(months, dkey)</a>
 *     <a href="#getPatternByDate">getPatternByDate(patterns, dt)</a>
 *
 * <a href="#buildConfig">buildConfig(obj)</a>
 *     <a href="#getLoopSpans">getLoopSpans(st, et, loopt, maxt)</a>
 *
 * <a href="#buildEmpMonth">buildEmpMonth(obj)</a>
 *     <a href="#mergeEmpDays">mergeEmpDays(common, config, days, applys, sd, ed)</a>
 *         <a href="#getApplyDateMap">getApplyDateMap(applys)</a>
 *         <a href="#createWeekObjs">createWeekObjs(dkey, lastDkey, startOfWeek)</a>
 *         <a href="#getDateListByWeekObjs">getDateListByWeekObjs(weekObjs)</a>
 *         <a href="#mergeEmpDay">mergeEmpDay(days, dkey, alst, dlst, config)</a>
 *             <a href="#getValidApplys">getValidApplys(alst, na)</a>
 *             <a href="#getRealTime">getRealTime(t1, t2, rests)</a>
 *         <a href="#getWeekObj">getWeekObj(weekObjs, dkey)</a>
 *         <a href="#getCompleteWeekCnt">getCompleteWeekCnt(weekObjs)</a>
 *     <a href="#getPeriodMap">getPeriodMap()</a>
 *     <a href="#calculateEmpDays">calculateEmpDays(months, days, dlst, periodMap, calcType, calcType)</a>
 *         <a href="#getMonthByDate">getMonthByDate(months, dkey)</a>
 *         <a href="#calculateEmpDay">calculateEmpDay(day, period, , , calcType)</a>
 *             <a href="#getRealTime">getRealTime(t1, t2, rests)</a>
 *             <a href="#getSpanOnRanges">getSpanOnRanges(span, ranges)</a>
 *             <a href="#sliceRange">sliceRange(st, et, dayType0, dayType1, nights)</a>
 *     <a href="#decorateEmpDays">decorateEmpDays(common, config, days, dlst)</a>
 *         <a href="#decorateEmpDays">decorateEmpDay(common, config, days, dlst)</pre></td></tr></table></a>
 *
 * @constructor
 * @author DCI小島
 */
teasp.logic.EmpTime = function(pouch){
	this.todayKey = pouch.getToday();
	this.pouch = pouch;

};

/**
 * カレンダー、勤務パターン適用日、申請情報をマージする.<br/>
 * 勤務確定してない場合、カレンダー、勤務パターン適用日、申請情報をマージして、以下の要素をセットする。<br/>
 * 勤務確定している場合は、すでに持っている情報をそのまま使う。<br/><br/>
 * <div style="margin-left:16px;">
 *     obj.days[日付]の更新対象の要素<br/>
 *     <table style="border-collapse:collapse;border:1px solid #7F8FB1;margin:4px;" border="1">
 *     <tr><td>dayType              </td><td>{string}  </td><td>日タイプ                  </td></tr>
 *     <tr><td>dbDayType            </td><td>{string}  </td><td>日タイプ                  </td></tr>
 *     <tr><td>plannedHoliday       </td><td>{boolean} </td><td>有休計画付与日            </td></tr>
 *     <tr><td>pattern              </td><td>{Object}  </td><td>勤務パターンオブジェクト  </td></tr>
 *     <tr><td>pattern.restTimes    </td><td>{Array.<Object>}</td><td>勤務パターン休憩時間リスト</td></tr>
 *     <tr><td>holiday1             </td><td>{Object}  </td><td>休憩1オブジェクト         </td></tr>
 *     <tr><td>holiday2             </td><td>{Object}  </td><td>休憩2オブジェクト         </td></tr>
 *     </table>
 * </div>
 * @return {Object} マージ済みのオブジェクト
 */
teasp.logic.EmpTime.prototype.mergeCalendar = function(){
	var obj = this.pouch.getObj();
	var dlst = teasp.util.date.getDateList(obj.params.startLdate, obj.params.endLdate);
	// 振替日などがあれば dlst に追加して日付順にソート
	if(obj.params.dateList && obj.params.dateList.length > 0){
		dlst = dlst.concat(obj.params.dateList);
		dlst = dlst.sort(function(a, b){
			return (a < b ? -1 : (a > b ? 1 : 0));
		});
	}
	// obj.days に dlst の日付が含まれてない場合、補完しつつ days の要素を配列に再格納する。
	var dayList = [];
	for(var i = 0 ; i < dlst.length ; i++){
		var key = dlst[i];
		if(obj.days[key]){
			obj.days[key].date = key;
			dayList.push(obj.days[key]);
		}else{
			var o = {
				date : key
			};
			dayList.push(o);
			obj.days[key] = o;
		}
	}
	for(var i = 0 ; i < dayList.length ; i++){
		var day = dayList[i];
		var pday = (i > 0 ? dayList[i - 1] : null);
		day.dbDayType = day.dayType; // DBに保存されている dayType の値を別要素に保存
		var em = this.getMonthByDate(obj.empMonthMap, day.date);
		// 日付を含む月度が確定済みの場合、day の要素をそのまま使う。
		if(this.isFixedMonth(obj, day.date)){
			var defaultLegalHolidayOn = (em && em.config && typeof(em.config.defaultLegalHoliday) == 'number'); // 優先法定休日の設定あり
			if(!this.pouch.isUseLegalHoliday() // （旧仕様：休日１!=法定休日）
			&& !defaultLegalHolidayOn // 優先法定休日の設定なし
			&& !teasp.util.time.isValidRange(day.startTime, day.endTime) // 勤務してない
			&& (!pday || typeof(pday.endTime) != 'number' || pday.endTime <= (60*24))
			&& day.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY // dayType == 2
			){
				var c = obj.cals[day.date];
				if(!c || !c.type || c.type == teasp.constant.DAY_TYPE_NORMAL){ // 勤怠カレンダーで法定休日と設定されていたら法定休日のまま
					var fh = em.fixHolidays[day.date];
					if((fh && fh.dayType != 0) || day.dbOrgDayType == 1 || day.dbOrgDayType == 3){ // 曜日の設定が平日でない or 元が休日
						day.dayType = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
					}else{
						day.dayType = teasp.constant.DAY_TYPE_NORMAL; // 平日が自動判定で dayType=2 で登録されているが、勤務してないので平日扱いに戻す
						day.zanteiDayType = true; // シフト設定、勤務時間変更申請の勤務日変更、振替で変わることがあるので、暫定dayTypeフラグをセット
					}
				}else if(c && (c.type == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY || c.type == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY)){
					day.dayType = teasp.constant.DAY_TYPE_NORMAL_HOLIDAY;
				}
			}
			// 勤務確定後、holiday1 の plannedHoliday が真ならその日は有休計画付与日と判定
			if(day.holiday1 && day.holiday1.plannedHoliday){
				day.plannedHoliday = true;
			}
			// 確定済みなら平日以外で出退時刻が入っていても問題ない（振替などが行われている）
			// フラグをセットして「休日の労働時間は休日出勤申請がなければ無効です。」の警告が出るのを防ぐ。
			if(day.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){
				if(teasp.util.time.isValidRange(day.startTime, day.endTime)){
					day.workFlag = true;
				}else if(pday && typeof(pday.endTime) == 'number' && pday.endTime > (60*24) // 前日の退社時刻が24時超えかつ元の日タイプが平日
				&& day.dbOrgDayType == 0){
					day.autoLH = true;
				}
			}
			// 優先法定休日の日かどうかをチェックする
			var ho = em.fixHolidays[day.date];
			if(em && em.config.defaultLegalHoliday !== null
			&& day.dayType != teasp.constant.DAY_TYPE_NORMAL){
				var d = teasp.util.date.parseDate(day.date);
				if(d.getDay() == em.config.defaultLegalHoliday){
					day.defaultLegalHolidayFlag = true;
				}
			}
			continue;
		}
		// day の要素を再構築する前にいったん削除
		this.clearDayElements(day);

		day.dayType = teasp.constant.DAY_TYPE_NORMAL;
		day.plannedHoliday = false;
		// 日付オブジェクトを得る
		var d = teasp.util.date.parseDate(day.date);
		// dayType、plannedHoliday、event は Config、カレンダーとマージして決定
		if(!em){
			continue;
		}
		// 勤怠設定の繰り返し休日と国民の祝日で dayType をセット
		var ho = em.fixHolidays[day.date];
		day.dayType = (ho ? ho.dayType : teasp.constant.DAY_TYPE_NORMAL);
		if(em.config.defaultLegalHoliday !== null
		&& day.dayType != teasp.constant.DAY_TYPE_NORMAL
		&& d.getDay() == em.config.defaultLegalHoliday){
			day.defaultLegalHolidayFlag = true;
		}
		// 勤怠カレンダーとマージ
		var events = [];
		if(ho && ho.title){
			events.push('(' + ho.title + ')');
		}
		var c = obj.cals[day.date];
		if(c){
			if(c.type){
				day.dayType = (typeof(c.type) == 'string' ? parseInt(c.type, 10) : c.type);
				day.plannedHoliday = c.plannedHoliday;
			}
			if(c.pattern){
				day.pattern = c.pattern;
			}
			if(c.event){
				events.push(c.event);
			}
		}
		var deptId = this.pouch.getDeptIdByMonth(em);
		var c2 = (deptId && obj.cals[deptId] && obj.cals[deptId][day.date]) || null;
		if(c2 && c2.event){
			events.push(c2.event);
		}
		day.event = events.join(teasp.message.getLabel('tm10001470')); // ／(区切り)
		if(!day.pattern){
			// 勤務パターンの適用日で pattern を決定
			// ※他の要素については別ロジックで申請レコードとマージして決定する
			var p = teasp.logic.EmpTime.getPatternByDate(obj.empTypePatterns, d);
			if(p){
				day.pattern = p.pattern;
			}
		}
		day.explicDayType = day.dayType;
	}
	return obj;
};

/**
 * 日次オブジェクトの要素クリア.<br/><br/>
 * 未確定の場合は mergeCalendar() 内で各種情報をマージして要素を再構築するので
 * いったんクリアする。
 *
 * @param {Object} day 日次オブジェクト
 */
teasp.logic.EmpTime.prototype.clearDayElements = function(day){
	delete day.dayType;
	delete day.event;
	delete day.plannedHoliday;
	delete day.pattern;
	delete day.holiday1;
	delete day.holiday2;
	delete day.exchangeDate;

	delete day.rack;
	delete day.period;
	delete day.real;
	delete day.deco;
};

/**
 * 指定日付を含む月度が勤務確定済み（承認済みまたは承認待ち）か.
 *
 * @param {Object} obj 月次オブジェクトの要素を持つオブジェクト
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {boolean} true:承認済みまたは承認まちである
 */
teasp.logic.EmpTime.prototype.isFixedMonth = function(obj, dkey){
	for(var i = 0 ; i < obj.months.length ; i++){
		var m = obj.months[i];
		if(m.startDate <= dkey && dkey <= m.endDate){
			if(!m.apply){
				return false;
			}
			return (teasp.constant.STATUS_APPROVES.contains(m.apply.status) || teasp.constant.STATUS_WAIT == m.apply.status);
		}
	}
	return false;
};

/**
 * 勤怠設定オブジェクトの構築.<br/><br/>
 * 共通設定オブジェクト、勤怠設定オブジェクトを構成する要素を作成<br/>
 */
teasp.logic.EmpTime.prototype.buildConfig = function(){
	var obj = this.pouch.getObj();
	var common = obj.common;
	var targetEmp = obj.targetEmp;

	for(var i = 0 ; i < obj.configs.length ; i++){
		var c = obj.configs[i];
		c.initialDateOfYear =  targetEmp.configBase.initialDateOfYear;
		c.initialDateOfMonth = targetEmp.configBase.initialDateOfMonth;
		c.initialDayOfWeek =   targetEmp.configBase.initialDayOfWeek;
		c.markOfYear =         targetEmp.configBase.markOfYear;
		c.markOfMonth =        targetEmp.configBase.markOfMonth;
		c.legalTimeOfDay = common.legalTimeOfDay;
	}

	if(!common.nightTimes){
		common.nightTimes  = this.getLoopSpans(common.nightStartTime, common.nightEndTime, 24 * 60, 48 * 60); // 深夜時間帯リスト作成
	}
};

/**
 * 月次オブジェクトの構築.<br/><br/>
 *
 * 勤怠計算、集計を行い、日次・月次オブジェクトを構成する要素を作成する。
 *
 * <div style="margin-left:16px;margin-top:4px;">
 *     obj.monthに追加する要素<br/>
 *     <table style="border-collapse:collapse;border:1px solid #7F8FB1;margin:4px;" border="1">
 *     <tr><td colspan="2">fixDays                </td><td>{number}  </td><td>所定出勤日数           </td></tr>
 *     <tr><td colspan="2">workDays               </td><td>{number}  </td><td>実出勤日数             </td></tr>
 *     <tr><td colspan="2">workLegalHolidays      </td><td>{number}  </td><td>法定休日出勤日数       </td></tr>
 *     <tr><td colspan="2">workHolidays           </td><td>{number}  </td><td>所定休日出勤日数       </td></tr>
 *     <tr><td colspan="2">workPublicHolidays     </td><td>{number}  </td><td>祝日出勤日数           </td></tr>
 *     <tr><td colspan="2">fixTime                </td><td>{number}  </td><td>所定労働時間           </td></tr>
 *     <tr><td colspan="3">real,disc</td><td>計算タイプ別のオブジェクト要素</td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>workRealTime  </td><td>{number}  </td><td>実労働時間                                       </td></tr>
 *     <tr><td></td><td>workWholeTime             </td><td>{number}  </td><td>総労働時間                                       </td></tr>
 *     <tr><td></td><td>workInFixedTime           </td><td>{number}  </td><td>所定内労働時間                                   </td></tr>
 *     <tr><td></td><td>workLegalTime             </td><td>{number}  </td><td>法定時間内労働時間                               </td></tr>
 *     <tr><td></td><td>workLegalOverTime         </td><td>{number}  </td><td>法定時間内残業時間                               </td></tr>
 *     <tr><td></td><td>workLegalOutOverTime      </td><td>{number}  </td><td>法定時間外労働時間                               </td></tr>
 *     <tr><td></td><td>workChargeTime            </td><td>{number}  </td><td>法定時間外割増時間                               </td></tr>
 *     <tr><td></td><td>workOverTime              </td><td>{number}  </td><td>残業時間                                         </td></tr>
 *     <tr><td></td><td>workHolidayTime           </td><td>{number}  </td><td>法定休日労働時間                                 </td></tr>
 *     <tr><td></td><td>workNightTime             </td><td>{number}  </td><td>深夜労働時間                                     </td></tr>
 *     <tr><td></td><td>amountTime                </td><td>{number}  </td><td>過不足時間（フレックスタイム制）                 </td></tr>
 *     <tr><td></td><td>curAmountTime             </td><td>{number}  </td><td>現時点の過不足時間（現時点を含む月度の処理限定） </td></tr>
 *     <tr><td></td><td>restTime                  </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>earlyCount                </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>earlyLostTime             </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>earlyTime                 </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>lateCount                 </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>lateLostTime              </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>lateTime                  </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>lostTime                  </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>privateCount              </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>privateInnerCount         </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>privateInnerLostTime      </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>privateInnerTime          </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>privateOuterTime          </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>paidHolidayCount          </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>absentCount               </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>daiqHolidayCount          </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>paidRestTime              </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>paidHolyTime              </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>plannedHolidayCount       </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>preWorkLegalTimeOfWeek    </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>preWorkLegalTimeOfPeriod  </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workAwayTime              </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workOffTime               </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>totalWorkOverCount36      </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>totalWorkOverTime36       </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workOver40perWeek         </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workOver45Time            </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workOver60Time            </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workOverTime36            </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>legalWorkTime             </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>nextMonthFistDayType      </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekDayDayLegalFixTime    </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekDayDayLegalExtTime    </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekDayDayLegalOutTime    </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekDayNightLegalFixTime  </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekDayNightLegalExtTime  </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekDayNightLegalOutTime  </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekEndDayLegalTime       </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekEndDayLegalOutTime    </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekEndNightLegalTime     </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>weekEndNightLegalOutTime  </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>holidayDayTime            </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>holidayNightTime          </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workFixedDay              </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workFixedTime             </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workHolidayCount          </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workLegalHolidayCount     </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workPublicHolidayCount    </td><td>{number}  </td><td></td></tr>
 *     <tr><td></td><td>workRealDay               </td><td>{number}  </td><td></td></tr>
 *     </table>
 * </div>
 * 日次オブジェクトの追加・更新要素は mergeEmpDays, calculateEmpDays, decorateEmpDays 参照。
 *
 *
 * @see <a href="#mergeEmpDays">mergeEmpDays</a>
 * @see <a href="#calculateEmpDays">calculateEmpDays</a>
 * @see <a href="#decorateEmpDays">decorateEmpDays</a>
 */
teasp.logic.EmpTime.prototype.buildEmpMonth = function(){
	var obj = this.pouch.getObj();
	var common = obj.common;
	var config = obj.config;
	var month  = obj.month;
	var months = obj.months;
	var days   = obj.days;
	var applys = obj.applys;

	var calcTypes = [teasp.constant.C_REAL, teasp.constant.C_DISC]; // 集計タイプのリスト
	/*
	 * 月次労働時間リセット
	 */
	month.fixDays              = 0; // 所定出勤日数
	month.workDays             = 0; // 実出勤日数
	month.workLegalHolidays    = 0; // 法定休日出勤日数
	month.workHolidays         = 0; // 所定休日出勤日数
	month.workPublicHolidays   = 0; // 祝日出勤日数
	month.fixTime              = 0; // 所定労働時間
	// 計算値を保持するオブジェクト（集計タイプごとにある）
	for(var i = 0 ; i < calcTypes.length ; i++){
		var calcType = calcTypes[i];
		month[calcType] = {
			workRealTime              : 0 // 実労働時間
			, workWholeTime             : 0 // 総労働時間
			, workInFixedTime           : 0 // 所定内労働時間
			, workLegalTime             : 0 // 法定時間内労働時間
			, workLegalOverTime         : 0 // 法定時間内残業時間
			, workLegalOutOverTime      : 0 // 法定時間外労働時間
			, workChargeTime            : 0 // 法定時間外割増時間
			, workChargeTime40H         : 0 // 法定時間外割増時間（週40Hオーバー分のみ。変形のみで使用）
			, workOverTime              : 0 // 残業時間
			, workHolidayTime           : 0 // 法定休日労働時間
			, workNightTime             : 0 // 深夜労働時間
			, amountTime                : 0 // 過不足時間（フレックスタイム制）
			, curAmountTime             : 0 // 現時点の過不足時間（現時点を含む月度の処理限定）
			, curAmountDate             : 0 // 過不足時間の日付
			, settlementTime            : 0 // 当月清算時間
			, carryforwardTime          : 0 // 繰越時間
			, restTime                  : 0
			//---------------------------------
			, earlyCount                : 0
			, earlyLostTime             : 0
			, earlyTime                 : 0
			, lateCount                 : 0
			, lateLostTime              : 0
			, lateTime                  : 0
			, lostTime                  : 0
			, privateCount              : 0
			, privateInnerCount         : 0
			, privateInnerLostTime      : 0
			, privateInnerTime          : 0
			, privateOuterTime          : 0
			, paidHolidayCount          : 0
			, absentCount               : 0
			, daiqHolidayCount          : 0
			, paidRestTime              : 0
			, paidHolyTime              : 0
			, holidayDeductionTime      : 0
			, plannedHolidayCount       : 0
			, preWorkLegalTimeOfWeek    : 0
			, preWorkLegalTimeOfPeriod  : 0
			, workAwayTime              : 0
			, workOffTime               : 0
			, totalWorkOverCount36      : 0
			, totalWorkOverTime36       : 0
			, workOver40perWeek         : 0
			, workOver45Time            : 0
			, workOver60Time            : 0
			, workOverTime36            : 0
			, legalWorkTime             : 0
			, nextMonthFistDayType      : 0
			, weekDayDayLegalFixTime    : 0
			, weekDayDayLegalExtTime    : 0
			, weekDayDayLegalOutTime    : 0
			, weekDayNightLegalFixTime  : 0
			, weekDayNightLegalExtTime  : 0
			, weekDayNightLegalOutTime  : 0
			, weekEndDayLegalTime       : 0
			, weekEndDayLegalOutTime    : 0
			, weekEndNightLegalTime     : 0
			, weekEndNightLegalOutTime  : 0
			, holidayDayTime            : 0
			, holidayNightTime          : 0
			//---------------------------------
			, workFixedDay              : 0
			, workFixedTime             : 0
			, workHolidayCount          : 0
			, workLegalHolidayCount     : 0
			, workPublicHolidayCount    : 0
			, workRealDay               : 0
			, minasiWorkWholeTime       : 0 // みなし時間（管理監督者のみなし時間モードのみ集計）
		};
	}
	/*
	 * 月度の開始日～終了日の日付リスト作成
	 */
	var monthDates  = teasp.util.date.getDateList(month.startDate, month.endDate);
	/*
	 * 日次情報のマージ
	 */
	var merge = this.mergeEmpDays(common, config, days, applys, month.startDate, month.endDate);
	month.paidHolyTime = merge.paidHolyTime; // その月の有給休暇の時間合計
	/*
	 * 月次の所定出勤日数、所定勤務時間を集計
	 */
	for(var i = 0 ; i < monthDates.length ; i++){
		var day = days[monthDates[i]];
		if((this.pouch.getEndDate() && teasp.util.date.compareDate(monthDates[i], this.pouch.getEndDate()) > 0)
		|| (this.pouch.getEntryDate() && teasp.util.date.compareDate(monthDates[i], this.pouch.getEntryDate()) < 0)){
			continue;
		}
		if(this.isFixDay(day)){
			month.fixDays++; // 定出勤日数
			month.fixTime += day.rack.fixTime;
		}
	}
	// フレックスタイム制で月の所定労働時間が一律固定の場合
	if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX && config.flexFixOption == '1'){
		month.fixTime = config.flexFixMonthTime; // 一律固定
	}
	/*
	 * 労働時間仕分け
	 */
	this.calculateEmpDays(months, days, common, merge.dlst, this.getPeriodMap(months), teasp.constant.C_REAL);
	this.calculateEmpDays(months, days, common, merge.dlst, this.getPeriodMap(months), teasp.constant.C_DISC);
	this.calculateEmpDays(months, days, common, merge.dlst, this.getPeriodMap(months), teasp.constant.C_FREAL); // フレックスの１日単位残業グラフ表示用の集計
	this.calculateEmpDays(months, days, common, merge.dlst, this.getPeriodMap(months), teasp.constant.C_FDISC); // フレックスの１日単位残業・裁量のグラフ表示用の集計
	if(config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){
		this.recalcDiscForManager(months, days, common, merge.dlst, this.getPeriodMap(months));
	}
	/*
	 * 月次の労働時間を集計
	 */
	var activeDays = 0;
	for(var i = 0 ; i < monthDates.length ; i++){
		var day = days[monthDates[i]];
		if((this.pouch.getEndDate() && teasp.util.date.compareDate(monthDates[i], this.pouch.getEndDate()) > 0)
		|| (this.pouch.getEntryDate() && teasp.util.date.compareDate(monthDates[i], this.pouch.getEntryDate()) < 0)){
			continue;
		}
		activeDays++;
		/*
		 * 月次労働時間集計
		 */
		if(day.rack.worked                     // 出退時刻とも入力されている
		&& (this.pouch.isCountZeroWorkTime()   // かつ（実労働時間が0時間の場合でも実勤務日数にカウントする
		|| (day.real.workRealTime || 0) > 0)){ // または実労働時間がある）
			month.workDays++;                              // 実出勤日数カウント
			if(day.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY && (!day.workFlag || day.rack.validApplys.kyushtu.length > 0)){
				month.workLegalHolidays++;                 // 法定休日出勤日数カウント
			}else if(day.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY){
				month.workHolidays++;                      // 所定休日出勤日数カウント
			}else if(day.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
				month.workPublicHolidays++;                // 祝日出勤日数カウント
			}
		}
		this.correctDiscChargeTime(day, config.defaultPattern.useDiscretionary);
	}
	for(var c = 0 ; c < calcTypes.length ; c++){
		var calcType = calcTypes[c];
		/*
		 * 月次労働時間集計
		 */
		var curFixTime = 0;
		var curWorkTime = 0;
		var today = this.pouch.getToday();
		for(var i = 0 ; i < monthDates.length ; i++){
			var day = days[monthDates[i]];
			if((this.pouch.getEndDate() && teasp.util.date.compareDate(monthDates[i], this.pouch.getEndDate()) > 0)
			|| (this.pouch.getEntryDate() && teasp.util.date.compareDate(monthDates[i], this.pouch.getEntryDate()) < 0)){
				continue;
			}
			month = this.getMonthByDate(months, day.rack.key);
			config = month.config;
			var dayCa = dojo.clone(day[calcType]);
			month[calcType].restTime              += dayCa.restTime;
			month[calcType].workRealTime          += dayCa.workRealTime;
			month[calcType].workWholeTime         += dayCa.workWholeTime;
			month[calcType].workInFixedTime       += dayCa.workInFixedTime;
			month[calcType].workLegalTime         += dayCa.workLegalTime;
			month[calcType].workLegalOverTime     += dayCa.workLegalOverTime;
			month[calcType].workLegalOutOverTime  += dayCa.workLegalOutOverTime;
			month[calcType].workChargeTime        += dayCa.workChargeTime;
			month[calcType].workChargeTime40H     += dayCa.workChargeTime40H;
			month[calcType].workOverTime          += dayCa.workOverTime;
			month[calcType].workHolidayTime       += dayCa.workHolidayTime;
			month[calcType].workNightTime         += dayCa.workNightTime;
			month[calcType].workAwayTime          += dayCa.awayTime;
			month[calcType].settlementTime        += dayCa.settlementTime;

			if(teasp.util.date.compareDate(monthDates[i], today) <= 0){
				// 現時点の過不足時間を計算
				if(day.dayType == teasp.constant.DAY_TYPE_NORMAL){
					if(day.pattern.useDiscretionary){
						curFixTime += day.pattern.standardFixTime;
					}else{
						curFixTime += day.rack.fixTime;
					}
				}
				curWorkTime += (dayCa.workWholeTime - dayCa.workHolidayTime);
				if(teasp.util.date.compareDate(monthDates[i], today) != 0 || day.rack.worked){
					month[calcType].curAmountTime = (curWorkTime - curFixTime);
					month.amountTimeDate = day.rack.key;
				}
			}

			if(dayCa.lateTime > 0){
				month[calcType].lateCount++;
				month[calcType].lateTime     += dayCa.lateTime;
				month[calcType].lateLostTime += dayCa.lateLostTime;
			}
			if(dayCa.earlyTime > 0){
				month[calcType].earlyCount++;
				month[calcType].earlyTime     += dayCa.earlyTime;
				month[calcType].earlyLostTime += dayCa.earlyLostTime;
			}
			if(dayCa.privateInnerTime > 0){
				month[calcType].privateInnerCount++;
				month[calcType].privateInnerTime     += dayCa.privateInnerTime;
				month[calcType].privateInnerLostTime += dayCa.privateInnerLostTime;
			}
			month[calcType].lostTime += ((dayCa.lateLostTime || 0) + (dayCa.earlyLostTime || 0) + (dayCa.privateInnerLostTime || 0));
			month[calcType].paidRestTime += day.rack.paidRestTime;
			month[calcType].paidHolyTime += day.rack.paidHolyTime;
			month[calcType].holidayDeductionTime += day.rack.holidayDeductionTime; // 休暇控除時間
			if(day.rack.plannedHolidayReal){
				month[calcType].plannedHolidayCount++;
			}else{
				if(day.holiday1){
					var h = ((day.holiday1.range == teasp.constant.RANGE_ALL) ? 1 : 0.5);
					if(day.holiday1.type == teasp.constant.HOLIDAY_TYPE_PAID){       month[calcType].paidHolidayCount += h;
					}else if(day.holiday1.type == teasp.constant.HOLIDAY_TYPE_DAIQ){ month[calcType].daiqHolidayCount += h;
					}else if(day.holiday1.type == teasp.constant.HOLIDAY_TYPE_FREE){ month[calcType].absentCount      += h;
					}
				}
				if(day.holiday2){
					var h = ((day.holiday2.range == teasp.constant.RANGE_ALL) ? 1 : 0.5);
					if(day.holiday2.type == teasp.constant.HOLIDAY_TYPE_PAID){       month[calcType].paidHolidayCount += h;
					}else if(day.holiday2.type == teasp.constant.HOLIDAY_TYPE_DAIQ){ month[calcType].daiqHolidayCount += h;
					}else if(day.holiday2.type == teasp.constant.HOLIDAY_TYPE_FREE){ month[calcType].absentCount      += h;
					}
				}
			}
			month[calcType].weekDayDayLegalFixTime   += dayCa.weekDayDayLegalFixTime;
			month[calcType].weekDayDayLegalExtTime   += dayCa.weekDayDayLegalExtTime;
			month[calcType].weekDayDayLegalOutTime   += dayCa.weekDayDayLegalOutTime;
			month[calcType].weekDayNightLegalFixTime += dayCa.weekDayNightLegalFixTime;
			month[calcType].weekDayNightLegalExtTime += dayCa.weekDayNightLegalExtTime;
			month[calcType].weekDayNightLegalOutTime += dayCa.weekDayNightLegalOutTime;
			month[calcType].weekEndDayLegalTime      += dayCa.weekEndDayLegalTime;
			month[calcType].weekEndDayLegalOutTime   += dayCa.weekEndDayLegalOutTime;
			month[calcType].weekEndNightLegalTime    += dayCa.weekEndNightLegalTime;
			month[calcType].weekEndNightLegalOutTime += dayCa.weekEndNightLegalOutTime;
			month[calcType].holidayDayTime           += dayCa.holidayDayTime;
			month[calcType].holidayNightTime         += dayCa.holidayNightTime;
			if(config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER && calcType == teasp.constant.C_DISC){
				month[calcType].minasiWorkWholeTime += (dayCa.minasiWorkWholeTime || 0);
			}
		}
		month[calcType].amountTime = month[calcType].workWholeTime - month[calcType].workHolidayTime - month.fixTime; // 過不足時間
		month[calcType].carryforwardTime = month[calcType].amountTime - month[calcType].settlementTime; // 繰越時間
		month[calcType].workFixedDay              = month.fixDays;
		month[calcType].workFixedTime             = month.fixTime;
		month[calcType].workHolidayCount          = month.workHolidays;
		month[calcType].workLegalHolidayCount     = month.workLegalHolidays;
		month[calcType].workPublicHolidayCount    = month.workPublicHolidays;
		month[calcType].workRealDay               = month.workDays;

		var limit36 = (month.config.variablePeriod > 3 ? 42 * 60 : 45 * 60);
		var legalTimeOfMonth = Math.floor((month.config.variablePeriod > 1 ? (40 * 60) : month.config.legalTimeOfWeek) * activeDays / 7);
		var fortyPerWeek = Math.floor((40 * 60) * activeDays / 7);
		month[calcType].workOverTime36 = month[calcType].workLegalOutOverTime + month[calcType].workChargeTime;
		month[calcType].quartWorkOverTime36  = month.quartWorkOverTime36  + month[calcType].workOverTime36; // 当四半期の超過時間
		month[calcType].totalWorkOverTime36  = month.totalWorkOverTime36  + month[calcType].workOverTime36;
		month[calcType].totalWorkOverCount36 = month.totalWorkOverCount36 + (month[calcType].workOverTime36 > limit36 ? 1 : 0);
		month[calcType].workOver40perWeek = (month[calcType].workRealTime > fortyPerWeek ? (month[calcType].workRealTime - fortyPerWeek) : 0);

		if(month[calcType].workOverTime36 > 3600){
			month[calcType].workOver60Time = month[calcType].workOverTime36 - 3600;
		}
		if(month[calcType].workOverTime36 > 2700){
			month[calcType].workOver45Time = month[calcType].workOverTime36 - 2700;
		}

		month[calcType].legalWorkTime = legalTimeOfMonth;
		month[calcType].workOffTime = month[calcType].restTime;
	}
	// 複数月のフレックスタイム制の場合
	// ・繰越時間を計算
	// ・清算月でまとめて法定時間内残業、法定時間外残業、法定時間外割増を計上する
	if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX && config.variablePeriod > 1){
		// 来月への繰越時間を計算（Verify画面用）
		month.carryforwardToNext = (month.carryforwardFromPrev || 0) + month.disc.amountTime - month.disc.settlementTime; // 当月清算時間を所定に含めない
		if(this.pouch.isSettlementMonth(month)){ // 清算月である
			var pi = month.periodInfo;
			var periodOverTime = Math.max(month.carryforwardToNext + month.disc.settlementTime, 0);
			for(var c = 0 ; c < calcTypes.length ; c++){
				var calcType = calcTypes[c];
				var periodRealWorkTimeWoLH = (pi.realWorkTimeWoLHPrev - pi.settlementTimePrev) + (month[calcType].workRealTime - month[calcType].workHolidayTime);
				var settlementTime = month[calcType].settlementTime;
				var periodLegalOutOverTime = Math.max(periodRealWorkTimeWoLH - month[calcType].settlementTime - Math.max(pi.fixTimeOfPeriod ,month.legalTimeOfPeriod), 0);
				var periodChargeTime       = Math.min(Math.max(periodRealWorkTimeWoLH - month[calcType].settlementTime - month.legalTimeOfPeriod, 0), Math.max(pi.fixTimeOfPeriod - month.legalTimeOfPeriod, 0));
				month[calcType].workLegalOverTime     = Math.max(month.carryforwardToNext - periodLegalOutOverTime, 0);
				month[calcType].workLegalOutOverTime  = periodLegalOutOverTime + month[calcType].settlementTime;
				month[calcType].workChargeTime        = periodChargeTime;
				month[calcType].workOverTime          = month[calcType].workLegalOverTime + month[calcType].workLegalOutOverTime;
				month[calcType].workOverTime36 = month[calcType].workLegalOutOverTime + month[calcType].workChargeTime;
				month[calcType].quartWorkOverTime36  = month.quartWorkOverTime36  + month[calcType].workOverTime36; // 当四半期の超過時間
				month[calcType].totalWorkOverTime36  = month.totalWorkOverTime36  + month[calcType].workOverTime36;
				month[calcType].totalWorkOverCount36 = month.totalWorkOverCount36 + (month[calcType].workOverTime36 > limit36 ? 1 : 0);
				month[calcType].workOver60Time = Math.max(month[calcType].workOverTime36 - 3600, 0);
				month[calcType].workOver45Time = Math.max(month[calcType].workOverTime36 - 2700, 0);
			}
		}else{ // 清算月でない
			for(var c = 0 ; c < calcTypes.length ; c++){
				var calcType = calcTypes[c];
				month[calcType].workLegalOverTime     = 0;
				month[calcType].workLegalOutOverTime  = month[calcType].settlementTime;
				month[calcType].workChargeTime        = 0;
				month[calcType].workOverTime          = month[calcType].workLegalOutOverTime;
				month[calcType].workOverTime36 = month[calcType].workLegalOutOverTime + month[calcType].workChargeTime;
				month[calcType].quartWorkOverTime36  = month.quartWorkOverTime36  + month[calcType].workOverTime36; // 当四半期の超過時間
				month[calcType].totalWorkOverTime36  = month.totalWorkOverTime36  + month[calcType].workOverTime36;
				month[calcType].totalWorkOverCount36 = month.totalWorkOverCount36 + (month[calcType].workOverTime36 > limit36 ? 1 : 0);
				month[calcType].workOver60Time = Math.max(month[calcType].workOverTime36 - 3600, 0);
				month[calcType].workOver45Time = Math.max(month[calcType].workOverTime36 - 2700, 0);
			}
		}
	}
	if(config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE  && config.variablePeriod != 0){
		var periodLeaglMax = month.legalTimeOfPeriod;
		var periodWorkLegalTime = (this.pouch.getMonthValueByKey('preWorkLegalTimeOfPeriod') || 0) + this.pouch.getMonthSubValueByKey('workLegalTime') - this.pouch.getMonthSubValueByKey('workChargeTime40H');
		month.overTimeInPeriod = Math.max(periodWorkLegalTime - periodLeaglMax, 0);
	}
	this.decorateEmpDays(common, config, days, merge);
	this.pouch.checkShiftChangeMonth();
};

/**
 * 日次情報のマージ.
 *
 * @param {Object} common 共通設定
 * @param {Object} config 勤怠設定
 * @param {Object} days 勤怠日次オブジェクト（日付キーによるマッピングテーブル）
 * @param {Array.<Object>} applys 勤怠申請オブジェクトリスト
 * @param {string} sd 開始日
 * @param {string} ed 終了日
 * @return {Object} 開始日を含む週の起算日～月度の末日までの日付リストと月度内のトータルの有休時間を返す
 * @see <a href="#mergeEmpDay">mergeEmpDay</a>
 */
teasp.logic.EmpTime.prototype.mergeEmpDays = function(common, config, days, applys, sd, ed){
	var startOfWeek = parseInt(config.initialDayOfWeek, 10); // 起算曜日を取得
	var amap        = this.getApplyDateMap(applys);               // 日付と申請情報のマッピングテーブル作成
	var holidayExcludeMap = this.getHolidayExcludeMap(applys);
	var edplus = teasp.util.date.addDays(ed, 7);
	var weekObjs    = teasp.logic.EmpTime.createWeekObjs(sd, edplus, startOfWeek, dojo.hitch(this.pouch, this.pouch.isAlive));   // 開始日～終了日の翌日の週次情報オブジェクト作成
	var dlst        = teasp.logic.EmpTime.getDateListByWeekObjs(weekObjs);       // 開始日を含む週の起算日～月度の末日までの日付リスト作成
	// 対象日初日の前日のオブジェクトを得る
	var yesterday = days[teasp.util.date.formatDate(teasp.util.date.addDays(teasp.util.date.parseDate(dlst[0]), -1))];
	// 月次残業申請を変数にセット
	this.pouch.setMonthlyOverTimeApplys(amap[teasp.constant.APPLY_TYPE_MONTHLYOVERTIME]);
	/*
	 * 日毎の情報をセット（月度の開始日を含む週の起算日～月度の末日まで）
	 */
	var legalHolidays = 0; // 法定休日の数
	var paidHolyTime = 0;
	var dlst2 = [];
	for(var key in days){
		dlst2.push(key);
	}
	dlst2 = dlst2.sort(function(a, b){
		return (a < b ? -1 : 1);
	});
	for(var i = 0 ; i < dlst2.length ; i++){
		var dkey = dlst2[i];
		if(!days[dkey]){
			continue;
		}
		var em = this.pouch.getEmpMonthByDate(dkey);
		var c = em.config;
		/*
		 * 日次情報のマージ
		 */
		var day = this.mergeEmpDay(days, dkey, (amap[dkey] || []), dlst2, c);
		if(!dlst.contains(dkey)){
			continue;
		}
		day.rack.holidayExcludes = holidayExcludeMap[dkey] || [];
		/*
		 * 所定出勤日数、法定休日数をカウント、週次情報を追加
		 */
		var weekObj = teasp.logic.EmpTime.getWeekObj(weekObjs, day.rack.key);
		if(day.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){ // 法定休日
			weekObj.legalHolidays++;
			if(weekObj.dkeys.length >= 7){
				legalHolidays++;
			}
		}else if(day.dayType != teasp.constant.DAY_TYPE_NORMAL){
			weekObj.lastHoliday = day.rack.key;
		}
		if(day.dayType != teasp.constant.DAY_TYPE_NORMAL){
			day.rack.isOrgHoliday = true;
		}
		if(yesterday && yesterday.endTime > 1440 && !c.extendDayType){
			// 前日の勤務が24:00を超えている場合にセットするフラグ。法定休日の自動判定では、この日を出勤日扱いして判定を行う。
			day.rack.legalWorked = true;
		}
		/*
		 * 出退時刻入力済み or 平日 or 前日の退社時刻が24時超え
		 */
		if(day.rack.worked || day.rack.legalWorked || day.dayType == teasp.constant.DAY_TYPE_NORMAL){
			weekObj.workOrFixDays++;
		}
		yesterday = day;
		if(sd <= dkey && dkey <= ed){
			paidHolyTime += (day.rack.paidHolyTime || 0);
		}
	}
	if(config.defaultLegalHoliday !== null){ // 優先される法定休日の曜日が設定されている
		for(i = 0 ; i < weekObjs.length ; i++){
			var weekObj = weekObjs[i];
			var lday = null;
			var consLday = null;
			var hlst = [];
			var wcnt = 0;
			var fixed = false;
			var dowf = null; // 変更前の workFlag
			var dodt = null; // 変更前の dayType
			for(var j = 0 ; j < weekObj.dkeys.length ; j++){
				var dkey = weekObj.dkeys[j];
				var day = days[dkey];
				if(day.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){ // 明示法定休日がある
					lday = null;
					consLday = day;
					break;
				}else if(day.dayType != teasp.constant.DAY_TYPE_NORMAL){
					hlst.push(day);
					if(!lday && day.defaultLegalHolidayFlag){
						lday = day;
					}else{
						if(day.rack.worked || day.rack.legalWorked){
							wcnt++;
						}
					}
				}
			}
			if(hlst.length > 0){
				// 法定休日の優先候補順に並べ替える
				// 1.優先法定休日である
				// 2.所定休日である
				// 3.（所定休日同士なら）日付の降順
				hlst = hlst.sort(function(a, b){
					if(a.defaultLegalHolidayFlag != b.defaultLegalHolidayFlag){
						return (a.defaultLegalHolidayFlag ? -1 : 1);
					}
					if(a.dayType != b.dayType){
						return (a.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY ? -1 : 1);
					}
					return teasp.util.date.compareDate(b.date, a.date);
				});
			}
			if(lday){ // 優先法定休日が設定されている
				if((lday.rack.worked || lday.rack.legalWorked) && hlst.length > wcnt){ // 優先法定休日に勤務かつ（出勤してない）所定休日がある
					for(j = 0 ; j < hlst.length ; j++){
						if(!hlst[j].rack.worked && !hlst[j].rack.legalWorked){
							lday = hlst[j];
							break;
						}
					}
				}
				if(this.isFixedMonth(this.pouch.getObj(), lday.date)){
					fixed = true;
					dowf = lday.workFlag;
					dodt = lday.dayType;
				}
				if(lday.dayType == teasp.constant.DAY_TYPE_NORMAL){
					lday.workFlag = true;
					lday.autoLH = true;
				}
				lday.dayType = teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
			}
			if(!consLday && !lday && config.autoLegalHoliday){ // 法定休日が未決かつ法定休日自動判定がオン
				// 動的に法定休日の判定をする（１週１休）
				if(hlst.length > 0){
					if(hlst.length > wcnt){
						for(j = 0 ; j < hlst.length ; j++){
							if(!hlst[j].rack.worked && !hlst[j].rack.legalWorked){ // 出勤してない非勤務日があればその日を暫定の法定休日にする
								lday = hlst[j];
								break;
							}
						}
					}
					if(!lday){ // 所定休日はすべて出勤しているので優先法定休日の出勤日を法定休日にする
						for(j = 0 ; j < hlst.length ; j++){
							if(hlst[j].defaultLegalHolidayFlag && !this.isFixedMonth(this.pouch.getObj(), hlst[j].date)){
								lday = hlst[j];
								break;
							}
						}
						if(!lday){ // 該当がなければ、最後の所定休日を法定休日にする
							if(!this.isFixedMonth(this.pouch.getObj(), hlst[0].date)){
								lday = hlst[0];
							}
						}
					}
					if(lday){
						if(this.isFixedMonth(this.pouch.getObj(), lday.date)){
							fixed = true;
							dowf = lday.workFlag;
							dodt = lday.dayType;
						}
						if(lday.dayType == teasp.constant.DAY_TYPE_NORMAL){
							lday.workFlag = true;
							lday.autoLH = true;
						}
						lday.dayType = teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
					}
				}
				if(weekObj.workOrFixDays >= 7 && !lday){ // 一週間すべて勤務日、または決まらない
					var dk = weekObj.dkeys[6];
					lday = days[dk]; // 一週間の最終日を法定休日にする
					if(lday){
						if(this.isFixedMonth(this.pouch.getObj(), dk)){
							fixed = true;
							dowf = lday.workFlag;
							dodt = lday.dayType;
						}
						var oldDayType = lday.dayType;
						lday.dayType = teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
						lday.workFlag = true;
						lday.autoLH = (oldDayType == teasp.constant.DAY_TYPE_NORMAL);
					}
				}
			}
			if(fixed){ // 判定した日が月次確定済みの場合、元の dayType, workFlag に戻す。
				lday.workFlag = dowf;
				lday.dayType = dodt;
			}
		}
	}else if(config.autoLegalHoliday){ // 法定休日自動判定がオン
		// 動的に法定休日の判定をする（１週１休）
		for(i = 0 ; i < weekObjs.length ; i++){
			var weekObj = weekObjs[i];
			/*
			 * 出勤日が7日間でなければ、判定なし。
			 * また、最終週の途中で月度が終わる場合も、翌月の勤務状況次第になるので判定はしない
			 * 週の途中で入社または退社した場合も判定しない
			 */
			if(weekObj.workOrFixDays < 6 || weekObjs[i].legalHolidays > 0 || !weekObj.liveWeekAll){
				continue;
			}
			var ldkey = weekObj.dkeys[6];
			if(weekObj.lastHoliday && !this.isFixedMonth(this.pouch.getObj(), weekObj.lastHoliday)){
				ldkey = weekObj.lastHoliday;
			}
			var day = days[ldkey];
			if(day && !this.isFixedMonth(this.pouch.getObj(), ldkey)){
				if(weekObj.workOrFixDays >= 7){
					day.legalHoliday = true;
					if(teasp.util.time.isValidRange(day.startTime, day.endTime)){
						day.dayType = teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
						day.workFlag = true;
						day.autoLH = true;
					}else if(day.rack.legalWorked){
						var oldDayType = day.dayType;
						day.dayType = teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
						day.autoLH = (oldDayType == teasp.constant.DAY_TYPE_NORMAL);
					}
				}
			}
		}
	}
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		if(!days[dkey]){
			continue;
		}
		/*
		 * 翌日の day オブジェクトを取得
		 */
		var nextDay = days[teasp.util.date.formatDate(teasp.util.date.addDays(dkey, 1))];
		days[dkey].rack.nextDayType = (nextDay ? (nextDay.legalHoliday ? teasp.constant.DAY_TYPE_LEGAL_HOLIDAY : nextDay.dayType) : teasp.constant.DAY_TYPE_NORMAL);
	}
	return { dlst: dlst, paidHolyTime: paidHolyTime, startDate: sd, endDate: ed };
};

/**
 * 所定出勤日または「勤怠規則は平日に準拠する」休日出勤日（遅刻・早退をカウントする日）
 */
teasp.logic.EmpTime.prototype.isNormalDay = function(day){
	return (day.dayType == teasp.constant.DAY_TYPE_NORMAL             // 平日
	|| ((day.workFlag || day.autoLH)
	&& (((day.rack || {}).validApplys || {}).kyushtu || []).length <= 0) // または自動判定で法定休日になった日
	|| this.pouch.isRegulateHoliday((day.rack || {}).key));               // または休日出勤の勤怠規則は平日に準拠する＝オン
};

/**
 * 所定出勤日（休日出勤は含めない）
 */
teasp.logic.EmpTime.prototype.isFixDay = function(day){
	return (day.dayType == teasp.constant.DAY_TYPE_NORMAL
	|| ((day.workFlag || day.autoLH)
	&& (((day.rack || {}).validApplys || {}).kyushtu || []).length <= 0));
};
/**
 * 所定出勤日（休日出勤は含めない）
 * @static
 * （dayType == teasp.constant.DAY_TYPE_NORMAL だけで平日と判定していた箇所で、自動判定で法定休日と判定された
 * 平日を考慮する必要がある場合、この関数を呼ぶように置き換える）
 */
teasp.logic.EmpTime.isFixDay = function(day){
	return (day.dayType == teasp.constant.DAY_TYPE_NORMAL || day.workFlag || day.autoLH);
};

/**
 * 出勤日（休日出勤を含める）
 */
teasp.logic.EmpTime.prototype.isWorkDay = function(day){
	return (day.dayType == teasp.constant.DAY_TYPE_NORMAL || day.workFlag || day.autoLH || (((day.rack || {}).validApplys || {}).kyushtu || []).length > 0);
};

/**
 * 対象期間の日次の労働時間仕分け.
 *
 * @param {Array.<Object>} months 勤怠月次オブジェクトのリスト
 * @param {Object} days 勤怠日次オブジェクト（日付キーによるマッピングテーブル）
 * @param {Object} common 共通設定オブジェクト
 * @param {Array.<string>} dlst 日付キーのリスト
 * @param {Object} periodMap 期間の労働時間、法定労働時間などの値を持つオブジェクト（※更新する）
 * @param {string} calcType 計算タイプ
 *     <ul>
 *     <li>teasp.constant.C_REAL・・実労働</li>
 *     <li>teasp.constant.C_DISC・・裁量</li>
 *     <li>teasp.constant.C_FREAL・・フレックスタイム制の場合、１日毎に実時間で残業表示</li>
 *     <li>teasp.constant.C_FDISC・・フレックスタイム制の場合、１日毎に裁量時間で残業表示</li>
 *     </ul>
 * @see <a href="#calculateEmpDay">calculateEmpDay</a>
 */
teasp.logic.EmpTime.prototype.calculateEmpDays = function(months, days, common, dlst, periodMap, calcType){
	/*
	 * 日毎の労働時間の仕分け
	 */
	var prevInfo = {};
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		var day = days[dkey];
		if(!day || !this.pouch.isAlive(dkey)){
			continue;
		}
		var month = this.getMonthByDate(months, dkey);
		var period = periodMap[month.monthEx];
		var config = month.config;
		if((calcType == teasp.constant.C_FREAL || calcType == teasp.constant.C_FDISC)
		&& config.workSystem != teasp.constant.WORK_SYSTEM_FLEX){
			continue;
		}
		// DB保存値の(WorkLegalTime + WorkLegalOverTime - WorkChargeTime)の積算
		period.dbWorkLegalVal += ((day.workLegalTime || 0) + (day.workLegalOverTime || 0) - (day.workChargeTime || 0));
		if(prevInfo.period && prevInfo.period != period && !month.resetFlag){
			if(config.workSystem == teasp.constant.WORK_SYSTEM_FIX // 固定労働時間制
			&& prevInfo.config.workSystem == teasp.constant.WORK_SYSTEM_FIX){ // TODO #8747検討事項。変形→固定の変更でも月またぎ週の割増計算をする場合は下の行のコメントをとる
//			&& (prevInfo.config.workSystem == teasp.constant.WORK_SYSTEM_FIX || prevInfo.config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE)){
				if(prevInfo.config.defaultPattern.useDiscretionary
				|| config.defaultPattern.useDiscretionary){ // 前月または今月は裁量労働
					period.workLegalTime = prevInfo.period.dbWorkLegalVal; // DB保存値の(WorkLegalTime + WorkLegalOverTime - WorkChargeTime)の積算
				}else{
					period.workLegalTime = prevInfo.period.workLegalTime;
				}
			}else if(config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE
			&& prevInfo.config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE){ // TODO #8747検討事項。固定→変形の変更でも月またぎ週の割増計算をする場合は下の行のコメントをとる
//			&& (prevInfo.config.workSystem == teasp.constant.WORK_SYSTEM_FIX || prevInfo.config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE)){
				period.workLegalTimeWeek = prevInfo.period.workLegalTimeWeek;
				if(config.variablePeriod == 0){
					period.workLegalTime = prevInfo.period.workLegalTime;
				}
			}
		}
		// 月度の初日に前月までの期間内の法定時間内労働時間をセット（変形労働時間制かつ変形期間が1ヶ月を超える場合）
		// 労働時間制と期間が同じ場合のみセットする。
		if(period.presetMonth.hasOwnProperty(dkey)){
			// TODO #8748 検討事項（期間を区切るならコメントを解除する）
//			if(prevInfo.config
//			&& config.workSystem     == prevInfo.config.workSystem
//			&& config.variablePeriod == prevInfo.config.variablePeriod){
				period.workTime      = 0;
				period.workLegalTime = period.presetMonth[dkey];
//			}else{
//				month.preWorkLegalTimeOfPeriod = 0;
//			}
		}
		// 変形労働制1ヶ月以上の場合、期の初日に8h以内の実労働時間の累計をリセット
		if(dkey == month.startDate
		&& config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE
		&& config.variablePeriod > 0
		&& month.periodInfo
		&& month.periodInfo.elapsedMonth == 1
		){
			period.workLegalTimeWeek = 0;
		}
		// 週単位の法定労働時間があるものは、下記日に週の労働時間をリセットと変形の場合は週の法定労働時間の計算を行う
		// ・週の起算日
		// ・入社日（月途中）= #9353で追加
		var entryDate = this.pouch.getEntryDate(); // 入社日
		if(period.presetWeek.hasOwnProperty(day.rack.weekOfDay)
		|| (entryDate && dkey == entryDate && month.startDate < dkey)){
			if(config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE){
				period.workLegalTimeWeek = 0;
				period.legalTimeWeek = this.pouch.getLegalTimeWeek(month, day.date);
				if(config.variablePeriod == 0){
					period.workLegalTime = 0;
				}
			}else{
				period.workLegalTime = 0;
			}
		}
		day.period = dojo.clone(period);
		this.calculateEmpDay(day, period, config, common, calcType);
		prevInfo.period = period;
		prevInfo.config = config;
	}
};

/**
 * 対象期間の日次情報の構築
 *
 * @param {Object} common 勤怠共通設定
 * @param {Object} config 勤怠設定
 * @param {Object} days 勤怠日次オブジェクト（日付キーによるマッピングテーブル）
 * @param {Object} merge 日付キーのリストを持つオブジェクト
 * @see <a href="#decorateEmpDay">decorateEmpDay</a>
 */
teasp.logic.EmpTime.prototype.decorateEmpDays = function(common, config, days, merge){
	var dlst = merge.dlst;
	var daiqZan = teasp.data.Pouch.getDaiqZan(
					this.pouch.getStocks(),
					dlst[dlst.length - 1],
					dlst[0],
					dlst[dlst.length - 1],
					this.pouch.isOldDate());
	var accLog = this.pouch.isInputAccessControl(); // 入退館管理を使用する
	this.pouch.clearDiverges();
	var dd = 0;
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		var day = days[dkey];
		if(!day){
			continue;
		}
		this.decorateEmpDay(common, config, day);
		dd += this.getDaiqCount(day);
		var o = this.getStockCount(day);
		if(o){
			for(var key in o){
				if(o.hasOwnProperty(key)){
					var z = teasp.data.Pouch.getStockZan(this.pouch.getStocks(), key, dkey);
					if(z.zan < 0){
						this.pouch.setStockLack(key, o[key], z.zan);
					}
				}
			}
		}
		if(accLog && merge.startDate <= dkey && dkey <= merge.endDate){
			var dw = this.pouch.getEmpDay(dkey);
			if(dw.isDivergeNoReason()){ // 乖離あり(理由なし)
				this.pouch.setDiverges({ date: dkey });
			}
		}
	}
	this.pouch.setDaiqLack(daiqZan.overSpend < 0 && dd > 0);
};

/**
 * 日次の情報を構築（１次）.<br/>
 *
 * <div style="margin-left:16px;margin-top:4px;">
 *     obj.days[日付] に追加する要素<br/>
 *     <table style="border-collapse:collapse;border:1px solid #7F8FB1;margin:4px;" border="1">
 *     <tr><td colspan="3">rack</td><td></td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td>key    </td><td>{string}  </td><td>日付('yyyy-MM-dd')                                                               </td></tr>
 *     <tr><td></td><td>todayDiff          </td><td>{number}  </td><td>=0:本日 =-1:過去  =1:未来                                                        </td></tr>
 *     <tr><td></td><td>weekOfDay          </td><td>{number}  </td><td>曜日(0-6)                                                                        </td></tr>
 *     <tr><td></td><td>allApplys          </td><td>{Object}  </td><td>全申請                                                                           </td></tr>
 *     <tr><td></td><td>validApplys        </td><td>{Object}  </td><td>有効な申請（仕分け済み）                                                         </td></tr>
 *     <tr><td></td><td>invalidApplys      </td><td>{Array.<Object>}</td><td>無効な申請リスト                                                                 </td></tr>
 *     <tr><td></td><td>exchagneDate       </td><td>{string}  </td><td>振替の場合、振替先（元）日付                                                     </td></tr>
 *     <tr><td></td><td>paidHolyTime       </td><td>{number}  </td><td>有休時間合計                                                                     </td></tr>
 *     <tr><td></td><td>paidRests          </td><td>{Array.<Object>}</td><td>有休時間リスト                                                                   </td></tr>
 *     <tr><td></td><td>paidRestTime       </td><td>{Array.<Object>}</td><td>時間単位有休合計時間                                                             </td></tr>
 *     <tr><td></td><td>excludes           </td><td>{Array.<Object>}</td><td>除外時間リスト                                                                   </td></tr>
 *     <tr><td></td><td>nextDayType        </td><td>{string}  </td><td>翌日のDayType                                                                    </td></tr>
 *     <tr><td></td><td>fixTime            </td><td>{number}  </td><td>所定労働時間                                                                     </td></tr>
 *     <tr><td></td><td>fixRests           </td><td>{Array.<Object>}</td><td>所定休憩時間リスト（実際にとった所定休憩時間のみ）                               </td></tr>
 *     <tr><td></td><td>freeRests          </td><td>{Array.<Object>}</td><td>私用休憩時間リスト                                                               </td></tr>
 *     <tr><td></td><td>awayTimes          </td><td>{Array.<Object>}</td><td>公用外出時間リスト                                                               </td></tr>
 *     <tr><td></td><td>worked             </td><td>{boolean} </td><td>出勤（出退時刻入力あり）                                                         </td></tr>
 *     <tr><td></td><td>plannedHolidayReal </td><td>{boolean} </td><td>有休計画付与日を行使したか                                                       </td></tr>
 *     <tr><td></td><td>shiftStartTime     </td><td>{number}  </td><td>シフト始業時刻（勤務パターン申請、休日申請で申請した始業時刻）                   </td></tr>
 *     <tr><td></td><td>shiftEndTime       </td><td>{number}  </td><td>シフト終業時刻（勤務パターン申請、休日申請で申請した終業時刻）                   </td></tr>
 *     <tr><td></td><td>fixStartTime       </td><td>{number}  </td><td>（半日休やシフトを加味した）始業時刻                                             </td></tr>
 *     <tr><td></td><td>fixEndTime         </td><td>{number}  </td><td>（半日休やシフトを加味した）終業時刻                                             </td></tr>
 *     <tr><td></td><td>calcEndTime        </td><td>{number}  </td><td>所定時間に達する時刻（裁量労働の場合のみ参照）                                   </td></tr>
 *     <tr><td></td><td>startTimeEx        </td><td>{number}  </td><td>出社時刻（裁量労働の場合、始業時刻と同じ）<br/>startTime==null なら startTimeExもnull</td></tr>
 *     <tr><td></td><td>endTimeEx          </td><td>{number}  </td><td>退社時刻（裁量労働の場合、終業時刻と同じ）<br/>endTime==null なら endTimeExもnull    </td></tr>
 *     <tr><td></td><td>holidayJoin        </td><td>{Object}  </td><td>休暇1と2の合成（表示用）                                                             </td></tr>
 *     <tr><td></td><td>flexFlag           </td><td>{boolean} </td><td>=0:フレックス制ではない  =1:フレックス制で非フレックス適用日  =2:フレックス制でフレックス適用日</td></tr>
 *     <tr><td></td><td>daiqReview         </td><td>{number}  </td><td>=1:代休可能残日数がないので見直しが必要である                                        </td></tr>
 *     </table>
 * </div>
 * <div style="margin-left:16px;margin-top:4px;">
 *     obj.days[日付] の要素の更新<br/>
 *     <table style="border-collapse:collapse;border:1px solid #7F8FB1;margin:4px;" border="1">
 *     <tr><td>dayType              </td><td>{string}  </td><td>日タイプ                  </td></tr>
 *     <tr><td>plannedHoliday       </td><td>{boolean} </td><td>有休計画付与日            </td></tr>
 *     <tr><td>timeTable            </td><td>{Array.<Object>}</td><td>タイムテーブル            </td></tr>
 *     <tr><td>pattern              </td><td>{Object}  </td><td>勤務パターンオブジェクト  </td></tr>
 *     <tr><td>pattern.restTimes    </td><td>{Array.<Object>}</td><td>勤務パターン休憩時間リスト</td></tr>
 *     <tr><td>holiday1             </td><td>{Object}  </td><td>休憩1オブジェクト         </td></tr>
 *     <tr><td>holiday2             </td><td>{Object}  </td><td>休憩2オブジェクト         </td></tr>
 *     </table>
 * </div>
 *
 * @param {Object} days 日付と日次情報のマッピングテーブル
 * @param {string} dkey 日付キー (yyyy-MM-dd)
 * @param {Array.<Object>} alst 日付に紐づく申請情報リスト
 * @param {Array.<string>} dlst 日付リスト
 * @param {Object} config 勤怠設定情報
 * @return {Object} 日次情報オブジェクト
 */
teasp.logic.EmpTime.prototype.mergeEmpDay = function(days, dkey, alst, dlst, config){
	var day = days[dkey];

	// 古い情報（があれば）を削除
	delete day.rack;
	delete day.period;
	delete day.real;
	delete day.disc;
	delete day.deco;
	delete day.legalHoliday;
	if(day.timeTable && day.timeTable.length > 0){
		for(var i = day.timeTable.length - 1 ; i >= 0 ; i--){
			if(day.timeTable[i].holidayId
			|| day.timeTable[i].type == teasp.constant.REST_PAY
			|| day.timeTable[i].type == teasp.constant.REST_UNPAY){
				day.timeTable.splice(i, 1);
			}
		}
	}

	day.rack = {};
	day.rack.key = dkey;
	if(day.rack.key > this.todayKey){
		day.rack.todayDiff = 1;  // 未来
	}else if(day.rack.key < this.todayKey){
		day.rack.todayDiff = -1; // 過去
	}else{
		day.rack.todayDiff = 0;  // 本日
	}
	// 労働時間制がフレックス制ならとりあえずフレックス適用日にフラグをセット（後で変更あり）
	day.rack.flexFlag = (config.workSystem == teasp.constant.WORK_SYSTEM_FLEX ? 2 : 0);
	/*
	 * 省略値の補完
	 */
	day.dayType = (day.dayType || teasp.constant.DAY_TYPE_NORMAL);
	/*
	 * 曜日を取得
	 */
	var d = teasp.util.date.parseDate(day.rack.key); // Date オブジェクトを得る
	day.rack.weekOfDay = d.getDay();
	/*
	 * 出勤日ではないの有休計画付与日がオンになっている場合、オフに変えておく
	 */
	if(day.plannedHoliday && !this.isFixDay(day)){
		day.plannedHoliday = false;
	}
	/*
	 * 月度確定後かどうかを dayFixed フラグにセット
	 */
	day.dayFixed = this.pouch.isEmpMonthFixedByDate(dkey);
	/*
	 * 出退時刻が値なしの場合、null に揃えておく
	 */
	if(typeof(day.startTime) != 'number'){
		day.startTime = null;
	}
	if(typeof(day.endTime  ) != 'number'){
		day.endTime   = null;
	}
	/*
	 * timeTableを文字列からオブジェクトに変換
	 */
	day.timeTable = teasp.util.extractTimes(day.timeTable);
	/*
	 * 有効な申請情報と無効な申請情報を抽出
	 */
	var na = [];   // 無効な申請リスト
	var va = this.getValidApplys(alst, na, dkey); // 仕訳済みの有効な申請情報
	day.rack.allApplys = alst.sort(function(a, b){
		return (a.applyTime < b.applyTime ? -1 : (a.applyTime > b.applyTime ? 1 : 0));
	});
	day.rack.validApplys   = va;
	day.rack.invalidApplys = na;  // 無効な申請リスト
	day.rack.warningApplys = [];  // 確定できない申請リスト
	var applyNotes = [];
	for(var i = 0 ; i < day.rack.allApplys.length ; i++){
		var a = day.rack.allApplys[i];
		if(teasp.logic.EmpTime.containApply(day.rack.validApplys, a)){
			if(a.note){
				applyNotes.push(a.note);
			}
		}
	}
	if(applyNotes.length > 0){
		day.rack.applyNotes = applyNotes.join('\r\n');
	}
	// AtkEmpDay__c.HolidayApplyId1__c, AtkEmpDay__c.HolidayApplyId2__c が実態と異なる可能性があるので補正
	if(day.applyId){
		var ha = null, hh1 = null, hh2 = null;
		for(var i = 0 ; i < day.rack.allApplys.length ; i++){
			var a = day.rack.allApplys[i];
			if(a.applyType == teasp.constant.APPLY_TYPE_HOLIDAY && !a.close){
				if(a.holiday.range == teasp.constant.RANGE_ALL){
					ha = a;
				}else if(a.holiday.range == teasp.constant.RANGE_AM){
					hh1 = a;
				}else{
					hh2 = a;
				}
			}
		}
		if(ha){
			if(!day.applyId.holidayApplyId1){
				day.applyId.holidayApplyId1 = ha.id;
				day.applyId.holidayApplyId2 = null;
			}
		}else{
			if(hh1){
				if(!day.applyId.holidayApplyId1 || day.applyId.holidayApplyId1 != hh1.id){
					day.applyId.holidayApplyId1 = hh1.id;
				}
				if(hh2){
					if(!day.applyId.holidayApplyId2 || day.applyId.holidayApplyId2 != hh2.id){
						day.applyId.holidayApplyId2 = hh2.id;
					}
				}else{
					day.applyId.holidayApplyId2 = null;
				}
			}else if(hh2){
				if(!day.applyId.holidayApplyId1 || day.applyId.holidayApplyId1 != hh2.id){
					day.applyId.holidayApplyId1 = hh2.id;
				}
				day.applyId.holidayApplyId2 = null;
			}
		}
	}
	var applyP = null;
	if(va.shiftSet){
		var p = va.shiftSet;
		if(!day.dayFixed || day.zanteiDayType){
			if(p.pattern && !day.dayFixed){
				day.pattern = p.pattern;
			}
			if(p.dayType !== null){
				day.dayType = parseInt(p.dayType, 10);
			}
		}
		day.rack.workPlace = p.workPlace;
		if(teasp.util.time.isValidRange(p.startTime, p.endTime)){
			applyP = p;
			day.rack.shiftStartTime = p.startTime;
			day.rack.shiftEndTime   = p.endTime;
		}
	}
	/*
	 * 振替申請（元）がある場合、振替先と dayType を入れ替える
	 */
	if(va.exchangeS || va.exchangeE){
		var sm = !this.pouch.isProhibitInputTimeUntilApproved();
		var xs = (va.exchangeS ? {
			dkey1   : va.exchangeS.startDate,
			dkey2   : va.exchangeS.exchangeDate,
			valid   : (sm || teasp.constant.STATUS_APPROVES.contains(va.exchangeS.status))
		} : null);
		var xe = (va.exchangeE ? {
			dkey1   : va.exchangeE.exchangeDate,
			dkey2   : va.exchangeE.originalStartDate,
			valid   : (sm || teasp.constant.STATUS_APPROVES.contains(va.exchangeE.status))
		} : null);
		var xer = teasp.logic.EmpTime.exchangeDateInfo(this.pouch, days, dkey, dlst, xe);
		if(xer && xer.valid && (!day.dayFixed || day.zanteiDayType)){
			day.dayType = xer.dayType;
		}
		var xsr = teasp.logic.EmpTime.exchangeDateInfo(this.pouch, days, dkey, dlst, xs);
		var xr = (xsr && xsr.valid ? xsr : (xer || xsr));
		if(xr){
			day.exchangeDate = xr.exchangeDate;
			if(!day.dayFixed || day.zanteiDayType){
				day.dayType = xr.dayType;
			}
			if(xr.orgDayType !== undefined){
				day.orgDayType = xr.orgDayType;
			}
			if(xr.interim){
				day.interim = xr.interim;
			}else if(xsr && xsr.interim){
				day.interim = xsr.interim;
			}
			if(!(va.exchangeS && va.exchangeE)){
				var exd = day.exchangeDate;
				if(va.exchangeS && va.exchangeS.exchangeDateReal && va.exchangeS.exchangeDateReal != day.exchangeDate){
					exd = va.exchangeS.exchangeDateReal;
				}
				var obj = this.pouch.getObj();
				var em1 = this.pouch.getEmpMonthByDate(dkey);
				var em2 = this.pouch.getEmpMonthByDate(day.exchangeDate);
				var dinf1 = teasp.logic.EmpTime.getDayInfo(dkey , em1, obj.cals[dkey] , obj.empTypePatterns);
				var dinf2 = teasp.logic.EmpTime.getDayInfo(exd  , em2, obj.cals[exd]  , obj.empTypePatterns);
				if((dinf1.dayType == teasp.constant.DAY_TYPE_NORMAL && dinf2.dayType == teasp.constant.DAY_TYPE_NORMAL)
				|| (dinf1.dayType != teasp.constant.DAY_TYPE_NORMAL && dinf2.dayType != teasp.constant.DAY_TYPE_NORMAL)){ // 平日同士または平日でない同士
					day.rack.invalidApplys.push({
						apply  : va.exchangeS,
						reason : teasp.constant.REASON_NG_EXCHANGE,
						keep   : true
					});
				}
			}
		}
	}
	/*
	 * dayに申請の勤務パターン情報をセット
	 */
	if(va.patternS || va.patternL || va.patternD){
		var p = (va.patternS || va.patternL);
		var pD = va.patternD;
		if(!day.dayFixed || day.zanteiDayType){ // 確定状態ではない
			if(p && p.pattern && !day.dayFixed){
				day.pattern   = p.pattern;
			}
			var zdayType = null;
			var pA = null;
			if(p){
				if(va.patternS && va.patternS.dayType){
					pA = va.patternS;
				}else if(va.patternL && va.patternL.dayType){
					pA = va.patternL;
				}
				if(pA){
					zdayType = pA.dayType;
				}
			}
			if(pD && (!pA || pA.applyTime < pD.applyTime)){
				zdayType = pD.dayType;
			}
			if(zdayType !== null){
				day.dayType = parseInt(zdayType, 10);
			}
		}
		if(p && teasp.util.time.isValidRange(p.startTime, p.endTime)){
			applyP = p;
			if(p.pattern
			&& p.pattern.useDiscretionary          // 裁量労働
			&& !p.pattern.workTimeChangesWithShift // かつシフトした勤務時間と所定勤務時間を連動させる
			&& (day.dayType == teasp.constant.DAY_TYPE_NORMAL  // 平日
			|| this.pouch.isRegulateHoliday(day.rack.key))    // または休日出勤の勤怠規則は平日に準拠する設定がオン
			){
				// 告知のみ。みなし時間は変わらない。
				day.notify = {
					startTime : p.startTime,
					endTime   : p.endTime
				};
			}else if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX
			&& p.pattern
			&& p.pattern.disableCoreTime
			){
				; // フレックスタイム制かつ勤務パターンがコアタイムなし
			}else{
				day.rack.shiftStartTime = p.startTime;
				day.rack.shiftEndTime   = p.endTime;
			}
		}
	}
	var dayType = day.dayType;
	if(this.isFixDay(day) && !day.plannedHoliday){ // 平日
		if(va.kyushtu.length > 0){ // 休日出勤申請がある
			if(!day.dayFixed){
				day.rack.invalidApplys.push({
					apply  : va.kyushtu[0],
					reason : teasp.constant.REASON_NG_KYUSHTU,
					keep   : false
				});
				va.kyushtu = [];
			}else{
				// 勤務確定後なら、有休計画付与日と判断する
				day.plannedHoliday = true;
			}
		}
	}else{ // 休日
		if(va.holidayAll || va.holidayAm || va.holidayPm){ // 休暇申請がある
			if(va.holidayAll && !va.holidayAll.holiday.displayDaysOnCalendar){
				day.rack.invalidApplys.push({
					apply  : va.holidayAll,
					reason : teasp.constant.REASON_NG_HOLIDAY,
					keep   : false
				});
				va.holidayAll = null;
			}
			if(va.holidayAm && !va.holidayAm.holiday.displayDaysOnCalendar){
				day.rack.invalidApplys.push({
					apply  : va.holidayAm,
					reason : teasp.constant.REASON_NG_HOLIDAY,
					keep   : false
				});
				va.holidayAm = null;
			}
			if(va.holidayPm && !va.holidayPm.holiday.displayDaysOnCalendar){
				day.rack.invalidApplys.push({
					apply  : va.holidayPm,
					reason : teasp.constant.REASON_NG_HOLIDAY,
					keep   : false
				});
				va.holidayPm = null;
			}
		}
		if(day.plannedHoliday){ // 有休計画付与日
			var ex = (va.exchangeS || va.exchangeE);
			if(ex){ // 振替申請がある
				day.rack.invalidApplys.push({
					apply  : ex,
					reason : teasp.constant.REASON_NG_EARLYEND,
					keep   : false
				});
			}
			var p = va.patternD;
			if(!p){
				p = ((va.patternS && va.patternS.dayType) ? va.patternS : va.patternL);
			}
			if(p && p.dayType == '1'){ // 勤務時間変更申請かつ非勤務日に変更
				day.rack.warningApplys.push({
					apply  : p,
					reason : teasp.constant.REASON_NG_DAYTYPE1,
					keep   : false
				});
			}
		}
		//----- ここから先は休日出勤申請がないと無効なもの（確定時に申請されてなければエラー）
		if(va.kyushtu.length <= 0){ // 休日出勤申請なし
			if(va.zangyo && va.zangyo.length > 0){      // 残業申請がある
				day.rack.warningApplys.push({
					apply  : va.zangyo[0],
					reason : teasp.constant.REASON_NG_ZANGYO,
					keep   : false
				});
			}
			if(va.earlyStart && va.earlyStart.length > 0){  // 早朝勤務申請がある
				day.rack.warningApplys.push({
					apply  : va.earlyStart[0],
					reason : teasp.constant.REASON_NG_EARLYSTART,
					keep   : false
				});
			}
			if(va.lateStart){   // 遅刻申請がある
				day.rack.warningApplys.push({
					apply  : va.lateStart,
					reason : teasp.constant.REASON_NG_LATESTART,
					keep   : false
				});
			}
			if(va.earlyEnd){    // 早退申請がある
				day.rack.warningApplys.push({
					apply  : va.earlyEnd,
					reason : teasp.constant.REASON_NG_EARLYEND,
					keep   : false
				});
			}
		}
	}
	/*
	 * 休日出勤の場合、shiftStartTime, shiftEndTime に申請の開始・終了時間をセット
	 * ※ 休日出勤の勤怠を平日扱いする場合は無視
	 */
	var changedRests = null;
	if(va.kyushtu.length > 0){
		if(!this.pouch.isRegulateHoliday(day.rack.key)
		&& !day.plannedHoliday
		&& teasp.util.time.isValidRange(va.kyushtu[0].startTime, va.kyushtu[0].endTime)){
			day.rack.shiftStartTime = va.kyushtu[0].startTime;
			day.rack.shiftEndTime   = va.kyushtu[0].endTime;
			if(va.kyushtu[0].timeTable){
				changedRests = teasp.util.extractTimes(va.kyushtu[0].timeTable);
			}
		}
		day.rack.fixStartTime = day.rack.shiftStartTime;
		day.rack.fixEndTime   = day.rack.shiftEndTime;
		var xapprove = teasp.constant.STATUS_APPROVES.contains(va.kyushtu[0].status);
		if(!xapprove && this.pouch.isProhibitInputTimeUntilApproved() && !day.interim){
			day.interim = { // 承認待ちで「承認されるまで時間入力を禁止」の場合、暫定の情報をセット。
			orgDayType : day.dayType,
			dayType    : day.dayType
			};
		}
	}
	/*
	 * 勤務パターン最終決定
	 */
	if(!day.pattern){
		day.pattern = config.defaultPattern;
	}else if(day.rack.flexFlag == 2){ // 労働時間制がフレックス制だが勤務パターンが設定されている場合は、非フレックス適用日とみなせる
		day.rack.flexFlag = 1;
	}
	// 日によって所定休憩時間を書き換えることがあるので、別インスタンスを作る
	day.pattern = dojo.clone(day.pattern);
	if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){ // フレックスタイム制の場合、コアタイムの有無を日毎にセット
		day.rack.useCoreTime = (day.pattern.disableCoreTime ? false : (day.pattern.id ? true : config.useCoreTime));
	}
	/*
	 * 所定休憩時間を得る
	 */
	var halfRestTimes = null;
	if(day.pattern.useHalfHolidayRestTime // 半休取得時の休憩時間＝オン
	&& !va.holidayAll
	&& !(va.holidayAm && va.holidayPm)
	&& (va.holidayAm || va.holidayPm)){
		// 半休を取っていたら半休時休憩時間を得る
		halfRestTimes = (va.holidayAm ? day.pattern.amHolidayRestTimes : day.pattern.pmHolidayRestTimes);
	}
	day.pattern.restTimes = changedRests || halfRestTimes || teasp.util.extractTimes(day.pattern.restTimes);

	day.patternOrg = day.pattern;
	var pattern = day.pattern = dojo.clone(day.patternOrg);
	if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX     // フレックスタイム制
	|| config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE){ // または変形労働時間制
		pattern.useDiscretionary = false; // 裁量労働フラグをオフに変える。
		if(day.notify){
			day.rack.shiftStartTime = day.notify.startTime;
			if(pattern.workTimeChangesWithShift){ // シフトした勤務時間と所定勤務時間を連動させる
				day.rack.shiftEndTime = day.notify.endTime;
			}else{
				day.rack.shiftEndTime = teasp.logic.EmpTime.getReachTime(day.rack.shiftStartTime, pattern.restTimes, pattern.standardFixTime);
			}
		}
	}else if(dayType != teasp.constant.DAY_TYPE_NORMAL
	&& day.rack.validApplys.kyushtu.length > 0
	&& !this.pouch.isRegulateHoliday(day.rack.key)    // 休日出勤の勤怠規則は平日に準拠する設定がオフ
	&& config.workSystem != teasp.constant.WORK_SYSTEM_MANAGER){ // 管理監督者ではない
		pattern.useDiscretionary = false; // 休日出勤の日は裁量扱いしないので、裁量労働フラグをオフに変える。
	}else if(config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){
		pattern.useDiscretionary = true; // 管理監督者の場合、裁量労働フラグをオンに変える
	}
	var shiftSt = ((day.notify && typeof(day.notify.startTime) == 'number') ? day.notify.startTime : day.rack.shiftStartTime);
	if(pattern.enableRestTimeShift // シフト始業時刻と所定休・半休を連動させる
	&& typeof(shiftSt) == 'number'
	&& pattern.stdStartTime != shiftSt){ // 勤務パターンの始業時刻とシフト始業時刻が一致しない
		var diff = shiftSt - pattern.stdStartTime;
		pattern.restTimes = teasp.util.extractTimes(pattern.restTimes);
		for(var i = pattern.restTimes.length - 1 ; i >= 0 ; i--){
			pattern.restTimes[i].from += diff;
			pattern.restTimes[i].to   += diff;
			if(pattern.restTimes[i].from < 0
			|| pattern.restTimes[i].from >= 2880
			|| pattern.restTimes[i].to < 0
			|| pattern.restTimes[i].to >= 2880){
				pattern.restTimes.splice(i, 1);
			}
		}
		if(pattern.useHalfHoliday){
			pattern.amHolidayStartTime += diff;
			pattern.amHolidayEndTime   += diff;
			pattern.pmHolidayStartTime += diff;
			pattern.pmHolidayEndTime   += diff;
			if(pattern.useHalfHolidayRestTime){ // 半休取得時の休憩時間を適用
				// 午前半休時休憩時間
				for(i = pattern.amHolidayRestTimes.length - 1 ; i >= 0 ; i--){
					pattern.amHolidayRestTimes[i].from += diff;
					pattern.amHolidayRestTimes[i].to   += diff;
					if(pattern.amHolidayRestTimes[i].from < 0
					|| pattern.amHolidayRestTimes[i].from >= 2880
					|| pattern.amHolidayRestTimes[i].to < 0
					|| pattern.amHolidayRestTimes[i].to >= 2880){
						pattern.amHolidayRestTimes.splice(i, 1);
					}
				}
				// 午後半休時休憩時間
				for(i = pattern.pmHolidayRestTimes.length - 1 ; i >= 0 ; i--){
					pattern.pmHolidayRestTimes[i].from += diff;
					pattern.pmHolidayRestTimes[i].to   += diff;
					if(pattern.pmHolidayRestTimes[i].from < 0
					|| pattern.pmHolidayRestTimes[i].from >= 2880
					|| pattern.pmHolidayRestTimes[i].to < 0
					|| pattern.pmHolidayRestTimes[i].to >= 2880){
						pattern.pmHolidayRestTimes.splice(i, 1);
					}
				}
			}
		}
		if(day.notify){
			pattern.stdStartTime += diff;
			pattern.stdEndTime   += diff;
		}
	}
	/*
	 * 開始時間から所定労働時間に達する時刻を得る
	 */
	var virEndTime = teasp.logic.EmpTime.getFixTimeSpan(pattern.stdStartTime, pattern.restTimes, pattern.standardFixTime);
	/*
	 * 定時の出社・退社時刻（遅刻・早退の閾値に利用）
	 */
	if(this.isNormalDay(day)){
		if(teasp.util.time.isValidRange(day.rack.shiftStartTime, day.rack.shiftEndTime)){
			day.rack.fixStartTime = day.rack.shiftStartTime;
			day.rack.fixEndTime   = day.rack.shiftEndTime;
		}else{
			day.rack.fixStartTime = pattern.stdStartTime;
			day.rack.fixEndTime   = pattern.stdEndTime;
		}
		if(pattern.useDiscretionary){
			if(config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){
				// #9878で拘束時間の終了時刻を所定労働時間に達したところに変えていたがこれは5.320以前の仕様と異なるためコメントアウト（V5-1028）
				// day.rack.fixEndTime = teasp.logic.EmpTime.getReachTime(day.rack.fixStartTime, pattern.restTimes, pattern.standardFixTime);
			}else if(day.notify && day.notify.startTime != day.rack.fixStartTime){
				day.rack.fixStartTimeOrg = day.rack.fixStartTime;
				day.rack.fixEndTimeOrg   = day.rack.fixEndTime;
				/*
				 * みなし時間帯をシフトの開始時刻に合わせてずらす
				 */
				var mt = this.getRealTime(day.rack.fixStartTime, day.rack.fixEndTime, pattern.restTimes);
				day.rack.fixStartTime = day.notify.startTime;
				day.rack.fixEndTime   = teasp.logic.EmpTime.getReachTime(day.rack.fixStartTime, pattern.restTimes, mt);
			}
			/*
			 * 裁量労働制の場合、終業時刻－始業時刻－休憩時間で得られる勤務時間が残業時間を
			 * 含むケースを考えて、始業時刻からの所定時間（１日の標準労働時間）に達する時刻を
			 * 定時退社時刻と判定する
			 */
			var wt = /** @type {Array.<Object>} */ [{ from: day.rack.fixStartTime, to: day.rack.fixEndTime }];
			var i = 0;
			while(i < pattern.restTimes.length) {
				wt = teasp.util.time.sliceTimes(wt, pattern.restTimes[i]);
				i++;
			}
			var t = 0;
			var et = 0;
			for(i = 0 ; i < wt.length ; i++){
				t += (wt[i].to - wt[i].from);
				if(t >= pattern.standardFixTime){
					et = wt[i].to - (t - pattern.standardFixTime);
					break;
				}
			}
			day.rack.calcEndTime = et;
		}
	}else if(!applyP && this.pouch.isRegulateHoliday(day.rack.key)){
		day.rack.fixStartTime = pattern.stdStartTime;
		day.rack.fixEndTime   = pattern.stdEndTime;
	}
	// 出退社時刻を別の変数にコピー（使っているのはスケジュール取込だけ）
	day.rack.startTimeEx = (typeof(day.startTime) == 'number' ? day.startTime : null);
	day.rack.endTimeEx   = (typeof(day.endTime)   == 'number' ? day.endTime   : null);
	/*
	 * dayに申請の休暇情報をセット
	 */
	day.rack.paidHolyTime = 0; // 有休時間（実労働時間を含まない、みなし労働時間）
	day.rack.holidayDeductionTime = 0; // 休暇控除時間
	day.rack.paidHolySpans = [];
	day.rack.freeHolySpans = [];
	day.rack.holyTime = 0; // 休暇時間（種類を問わない終日休、半休、時間単位休。遅刻・早退時間の計算用）
	day.rack.holySpans = [];
	day.rack.excludeHalf = [];
	day.rack.tempHolyTime = 0;

	var dw = this.pouch.getEmpDay(day.date);
	day.rack.flexHalfDayTime = dw.isFlexHalfDayTimeDay();

	if(!day.dayFixed){ // 確定状態ではない
		day.holiday1   = null;
		day.holiday2   = null;
		if(va.holidayAll){ // 終日休
			day.holiday1   = va.holidayAll.holiday;
		}else if(va.holidayAm || va.holidayPm){ // 午前休または午後休が申請されている
			if(!pattern.useHalfHoliday){ // 半日休が許可されてない勤務パターン
				if(va.holidayAm){
					day.rack.invalidApplys.push({  // 無効な申請リストに追加
						apply  : va.holidayAm,
						reason : teasp.constant.REASON_NOHALF,
						keep   : false
					});
					va.holidayAm = null;
				}
				if(va.holidayPm){
					day.rack.invalidApplys.push({  // 無効な申請リストに追加
						apply  : va.holidayPm,
						reason : teasp.constant.REASON_NOHALF,
						keep   : false
					});
					va.holidayPm = null;
				}
			}else{
				if(va.holidayAm && va.holidayPm){   // 午前休と午後休両方申請
					day.holiday1   = va.holidayAm.holiday;
					day.holiday2   = va.holidayPm.holiday;
				}else if(va.holidayAm){ // 午前休
					day.holiday1   = va.holidayAm.holiday;
				}else if(va.holidayPm){ // 午後休
					day.holiday1   = va.holidayPm.holiday;
				}
			}
		}
	}
	if(day.holiday1 && day.holiday1.range == teasp.constant.RANGE_ALL){ // 終日休
		day.rack.holyTime = pattern.standardFixTime;
		day.rack.holySpans.push({
			from : pattern.stdStartTime,
			to   : virEndTime
		});
		if(day.holiday1.type == teasp.constant.HOLIDAY_TYPE_PAID
		|| (config.daiqReckontoWorked && day.holiday1.type == teasp.constant.HOLIDAY_TYPE_DAIQ)){ // 有休
			if(dayType == teasp.constant.DAY_TYPE_NORMAL || !day.holiday1.displayDaysOnCalendar){ // 平日または休暇が暦日表示でない
				day.rack.paidHolyTime = pattern.standardFixTime; // １日の標準労働時間がみなし労働時間
				day.rack.paidHolySpans.push({
					from : pattern.stdStartTime,
					to   : virEndTime
				});
			}
		}else{ // それ以外を無給休暇と判断
			if(dayType == teasp.constant.DAY_TYPE_NORMAL || !day.holiday1.displayDaysOnCalendar){ // 平日または休暇が暦日表示でない
				day.rack.freeHolyTime = pattern.standardFixTime; // １日の標準労働時間がみなし労働時間
				day.rack.freeHolySpans.push({
					from : pattern.stdStartTime,
					to   : virEndTime
				});
			}
		}
		day.rack.holidayJoin = {
			flag    : 3,
			name    : day.holiday1.name,
			type    : day.holiday1.type,
			planned : (day.holiday1.plannedHoliday || false),
			displayDaysOnCalendar : day.holiday1.displayDaysOnCalendar
		};
	}else if(day.holiday1 && day.holiday2 && day.holiday1.range == teasp.constant.RANGE_AM && day.holiday2.range == teasp.constant.RANGE_PM){ // 午前休＋午後休
		day.rack.holyTime = pattern.standardFixTime;
		if(!day.rack.flexHalfDayTime){
			day.rack.holySpans.push({
				from : pattern.stdStartTime,
				to   : virEndTime
			});
		}
		if((day.holiday1.type == teasp.constant.HOLIDAY_TYPE_PAID || (config.daiqReckontoWorked && day.holiday1.type == teasp.constant.HOLIDAY_TYPE_DAIQ))
		&& (day.holiday2.type == teasp.constant.HOLIDAY_TYPE_PAID || (config.daiqReckontoWorked && day.holiday2.type == teasp.constant.HOLIDAY_TYPE_DAIQ))){ // 午前休・午後休とも有休
			day.rack.paidHolyTime = pattern.standardFixTime; // １日の標準労働時間がみなし労働時間
			if(!day.rack.flexHalfDayTime){
				day.rack.paidHolySpans.push({
					from : pattern.stdStartTime,
					to   : virEndTime
				});
			}
		}else if(day.holiday1.type == teasp.constant.HOLIDAY_TYPE_PAID || (config.daiqReckontoWorked && day.holiday1.type == teasp.constant.HOLIDAY_TYPE_DAIQ)){ // 午前休のみ有休
			if(!day.rack.flexHalfDayTime){
				day.rack.paidHolyTime = this.getRealTime(pattern.amHolidayStartTime, pattern.amHolidayEndTime, pattern.restTimes); // 午前休適用時間がみなし労働時間
				day.rack.paidHolySpans.push({
					from : pattern.amHolidayStartTime,
					to   : pattern.amHolidayEndTime
				});
				day.rack.freeHolyTime = this.getRealTime(pattern.pmHolidayStartTime, pattern.pmHolidayEndTime, pattern.restTimes); // 午後休適用時間が無給休暇
				day.rack.freeHolySpans.push({
					from : pattern.pmHolidayStartTime,
					to   : pattern.pmHolidayEndTime
				});
			}else{
				day.rack.paidHolyTime = Math.ceil(pattern.standardFixTime/2);
				day.rack.freeHolyTime = Math.floor(pattern.standardFixTime/2);
			}
		}else if(day.holiday2.type == teasp.constant.HOLIDAY_TYPE_PAID || (config.daiqReckontoWorked && day.holiday2.type == teasp.constant.HOLIDAY_TYPE_DAIQ)){ // 午後休のみ有休
			if(!day.rack.flexHalfDayTime){
				day.rack.freeHolyTime = this.getRealTime(pattern.amHolidayStartTime, pattern.amHolidayEndTime, pattern.restTimes); // 午前休適用時間が無給休暇
				day.rack.freeHolySpans.push({
					from : pattern.amHolidayStartTime,
					to   : pattern.amHolidayEndTime
				});
				day.rack.paidHolyTime = this.getRealTime(pattern.pmHolidayStartTime, pattern.pmHolidayEndTime, pattern.restTimes); // 午後休適用時間がみなし労働時間
				day.rack.paidHolySpans.push({
					from : pattern.pmHolidayStartTime,
					to   : pattern.pmHolidayEndTime
				});
			}else{
				day.rack.paidHolyTime = Math.ceil(pattern.standardFixTime/2);
				day.rack.freeHolyTime = Math.floor(pattern.standardFixTime/2);
			}
		}else{ // 午前休・午後休とも無給休暇
			day.rack.freeHolyTime = pattern.standardFixTime; // １日の標準労働時間が無給休暇
			if(!day.rack.flexHalfDayTime){
				day.rack.freeHolySpans.push({
					from : pattern.stdStartTime,
					to   : virEndTime
				});
			}
		}
		day.rack.holidayJoin = {
			flag    : 3,
			name    : day.holiday1.name + teasp.message.getLabel('tm10001560') + day.holiday2.name, // '，'
			type    : (day.holiday1.type <= day.holiday2.type ? day.holiday1.type : day.holiday2.type)
		};
	}else if(day.holiday1){
		if(day.holiday1.range == teasp.constant.RANGE_AM){ // 午前休
			var halft = this.getRealTime(pattern.amHolidayStartTime, pattern.amHolidayEndTime, pattern.restTimes); // 午前休の適用時間
			if(!day.rack.flexHalfDayTime){
				day.rack.holyTime = halft;
				day.rack.holySpans.push({
					from : pattern.amHolidayStartTime,
					to   : pattern.amHolidayEndTime
				});
				day.rack.excludeHalf.push({ from: 0, to: pattern.amHolidayEndTime });
			}else{
				day.rack.holyTime = Math.ceil(pattern.standardFixTime/2);
			}
			if(day.holiday1.type == teasp.constant.HOLIDAY_TYPE_PAID // 午前休の有休または（午前休の代休かつ「半日代休を勤務時間とみなす」がオン）
			|| (config.halfDaiqReckontoWorked && day.holiday1.type == teasp.constant.HOLIDAY_TYPE_DAIQ)){
				if(!day.rack.flexHalfDayTime){
					day.rack.paidHolyTime = halft; // 午前休適用時間がみなし労働時間
					day.rack.paidHolySpans.push({
						from : pattern.amHolidayStartTime,
						to   : pattern.amHolidayEndTime
					});
				}else{
					day.rack.paidHolyTime = Math.ceil(pattern.standardFixTime/2);
				}
			}else{
				if(!day.rack.flexHalfDayTime){
					day.rack.freeHolyTime = halft; // 午前休適用時間が無給休暇
					day.rack.freeHolySpans.push({
						from : pattern.amHolidayStartTime,
						to   : pattern.amHolidayEndTime
					});
				}else{
					day.rack.freeHolyTime = Math.ceil(pattern.standardFixTime/2);
				}
			}
			if((!config.halfDaiqReckontoWorked && day.holiday1.type == teasp.constant.HOLIDAY_TYPE_DAIQ)
			|| day.holiday1.type == teasp.constant.HOLIDAY_TYPE_FREE){
				day.rack.tempHolyTime = halft; // 午前休適用時間がみなし労働時間
			}
			day.rack.holidayJoin = {
				flag : 1,
				name : day.holiday1.name,
				type : day.holiday1.type
			};
			if(day.rack.fixStartTimeOrg){ // 裁量で勤務時間変更でシフトした場合
				var mt = this.getRealTime(day.rack.fixStartTime, day.rack.fixEndTime, pattern.restTimes); // みなし時間
//                day.rack.adjustHolyTime = halft; // みなし時間を半休分減算しているので、総労働時間の計算のときの補正用の数値を記憶する
				// みなし開始時刻に午前休の適用終了時刻～をセット（みなし開始時刻をずらした分だけずらす）。
				day.rack.fixStartTime2 = pattern.amHolidayEndTime + (day.rack.fixStartTime - day.rack.fixStartTimeOrg);
				// みなし終了時刻に（みなし時間から午前休の適用時間を引いた時間）に到達する時刻をセット
				day.rack.fixEndTime2 = teasp.logic.EmpTime.getReachTime(day.rack.fixStartTime2, pattern.restTimes, mt - halft);
			}
		}else{ // 午後休
			var halft = this.getRealTime(pattern.pmHolidayStartTime, pattern.pmHolidayEndTime, pattern.restTimes); // 午後休の適用時間
			if(!day.rack.flexHalfDayTime){
				day.rack.holyTime = halft;
				day.rack.holySpans.push({
					from : pattern.pmHolidayStartTime,
					to   : pattern.pmHolidayEndTime
				});
				day.rack.excludeHalf.push({ from: pattern.pmHolidayStartTime, to: 2880 });
			}else{
				day.rack.holyTime = Math.ceil(pattern.standardFixTime/2);
			}
			if(day.holiday1.type == teasp.constant.HOLIDAY_TYPE_PAID // 午後休の有休または（午後休の代休かつ「半日代休を勤務時間とみなす」がオン）
			|| (config.halfDaiqReckontoWorked && day.holiday1.type == teasp.constant.HOLIDAY_TYPE_DAIQ)){
				if(!day.rack.flexHalfDayTime){
					day.rack.paidHolyTime = halft; // 午後休適用時間がみなし労働時間
					day.rack.paidHolySpans.push({
						from : pattern.pmHolidayStartTime,
						to   : pattern.pmHolidayEndTime
					});
				}else{
					day.rack.paidHolyTime = Math.ceil(pattern.standardFixTime/2);
				}
			}else{
				if(!day.rack.flexHalfDayTime){
					day.rack.freeHolyTime = halft; // 午前休適用時間が無給休暇
					day.rack.freeHolySpans.push({
						from : pattern.pmHolidayStartTime,
						to   : pattern.pmHolidayEndTime
					});
				}else{
					day.rack.freeHolyTime = Math.ceil(pattern.standardFixTime/2);
				}
			}
			if((!config.halfDaiqReckontoWorked && day.holiday1.type == teasp.constant.HOLIDAY_TYPE_DAIQ)
			|| day.holiday1.type == teasp.constant.HOLIDAY_TYPE_FREE){
				day.rack.tempHolyTime = halft; // 午前休適用時間がみなし労働時間
			}
			day.rack.holidayJoin = {
				flag : 2,
				name : day.holiday1.name,
				type : day.holiday1.type
			};
			if(day.rack.fixStartTimeOrg){ // 裁量で勤務時間変更でシフトした場合
				var mt = this.getRealTime(day.rack.fixStartTime, day.rack.fixEndTime, pattern.restTimes); // みなし時間
//                day.rack.adjustHolyTime = halft; // みなし時間を半休分減算しているので、総労働時間の計算のときの補正用の数値を記憶する
				day.rack.fixStartTime2 = day.rack.fixStartTime;
				// みなし終了時刻に（みなし時間から午前休の適用時間を引いた時間）に到達する時刻をセット
				day.rack.fixEndTime2 = teasp.logic.EmpTime.getReachTime(day.rack.fixStartTime2, pattern.restTimes, mt - halft);
			}
		}
	}
	/*
	 * 有休計画付与日
	 */
	day.rack.plannedHolidayReal = false;
	if(day.plannedHoliday && day.startTime === null && day.endTime === null){ // 出退時刻が未入力の場合、有休取得日と判定
		day.rack.plannedHolidayReal = true;
		day.rack.paidHolyTime = pattern.standardFixTime; // １日の標準労働時間がみなし労働時間
		day.rack.holyTime = pattern.standardFixTime;
	}
	/*
	 * 時間単位休以外の休暇申請によって労働してないはずの時間帯のリストを作成
	 */
	var excludes = []; // 除外リスト
	if(va.holidayAll || (va.holidayAm && va.holidayPm) || day.rack.plannedHolidayReal){
		excludes.push({ from: 0, to: 2880, dayAll: true });

	}
	if(!day.rack.flexHalfDayTime){
		if(va.holidayAm){
			excludes.push({ from: 0, to: pattern.amHolidayEndTime });

		}else if(va.holidayPm){
			excludes.push({ from: pattern.pmHolidayStartTime, to: 2880 });
		}
	}
	day.rack.excludes = excludes;
	// timeTable から所定休憩時間、私用休憩時間を取り出す
	this.readTimeTable(day);
	/*
	 * 休憩時間リストに時間単位有休情報をセット
	 * 休暇、他の時間単位休とかぶってないかチェック
	 * ※かぶっていても有効とする（好ましくない）
	 */
	day.rack.paidRestTime = 0;
	var hourRests = [];
	var paidRests = [];
	var unpaidRests = [];
	var excludeTime = dojo.clone(excludes);
	if(day.startTime === null && day.endTime === null){
		dojo.forEach(pattern.restTimes, function(rest){
			excludeTime.push(rest);
		});
	}else{
		dojo.forEach(day.rack.fixRests.concat(day.rack.freeRests), function(rest){
			// type を補完する(#6720)
			rest.type = teasp.logic.EmpTime.isFixRest(rest, day.pattern.restTimes) ? teasp.constant.REST_FIX : teasp.constant.REST_FREE;
			excludeTime.push(rest);
		});
	}
	if(this.isWorkDay(day)){ // 出勤日
		for(i = 0 ; i < va.holidayTime.length ; i++){
			var h = va.holidayTime[i];
			var o = {
				from      : h.startTime,
				to        : h.endTime,
				type      : (h.holiday.type == teasp.constant.HOLIDAY_TYPE_FREE ? teasp.constant.REST_UNPAY : teasp.constant.REST_PAY),
				holidayId : h.holidayId
			};
			var tm = this.getRealTime(o.from, o.to, excludeTime);
/*
			if(tm <= 0 || (tm % 60) != 0){ // 正味時間なしor１時間単位でない
				day.rack.invalidApplys.push({  // 無効な申請リストに追加
					apply  : va.holidayTime,
					reason : (tm <= 0 ? teasp.constant.REASON_NOTIME : teasp.constant.REASON_60RULE),
					keep   : true
				});
			}
*/
			day.rack.holyTime += tm;
			day.rack.holySpans.push({
				from : o.from,
				to   : o.to
			});
			h._spendTime = tm;
			if(h.holiday.type == teasp.constant.HOLIDAY_TYPE_FREE){
				if(config.workSystem != teasp.constant.WORK_SYSTEM_FLEX){
					day.rack.paidHolyTime += tm;  // 無給の時間休は残業と相殺しない控除時間のため paidHolyTime に加算（#9147対応時に見直す）
				}
				day.rack.holidayDeductionTime += tm; // 休暇控除時間
				unpaidRests.push(o);
				// 本当は freeHolySpans に入れるべきだが、#9147の対応が済むまでは入れない（3063行目も同時に見直す）
//				day.rack.freeHolySpans.push({
//					from : o.from,
//					to   : o.to
//				});
			}else{
				day.rack.paidHolyTime += tm;
				if(h.holiday.yuqSpend){
					day.rack.paidRestTime += Math.ceil(tm / 60) * 60; // 年次有給休暇は1h単位に切上
				}else if(h.holiday.managed){
					day.rack.paidRestTime += Math.ceil(tm / 30) * 30; // 日数管理休暇は30分単位に切上
				}else{
					day.rack.paidRestTime += tm;
				}
				day.rack.paidHolySpans.push({
					from : o.from,
					to   : o.to
				});
				paidRests.push(o);
			}
			hourRests.push(o);
			day.timeTable.push(o);
			excludeTime.push(o);
		}
	}
	day.rack.hourRests = hourRests;
	day.rack.paidRests = paidRests;
	day.rack.unpaidRests = unpaidRests;

	/*
	 * 遅刻、早退の境界時間を得る
	 */
	day.rack.bdrStartTime = day.rack.fixStartTime;
	day.rack.bdrEndTime   = day.rack.fixEndTime;

	var normalDay = this.isNormalDay(day);

	if(day.rack.flexFlag == 2
	&& normalDay
	&& day.rack.useCoreTime
	&& !day.pattern.id){
		day.rack.bdrStartTime = config.coreStartTime;
		day.rack.bdrEndTime   = config.coreEndTime;
	}
	if(day.notify){
		day.rack.bdrStartTime = day.notify.startTime;
		day.rack.bdrEndTime   = day.notify.endTime;
	}
	// 遅刻補填フラグ
	day.rack.hotenLate = (va.lateStart // 遅刻申請あり
			&& teasp.constant.STATUS_FIX.contains(va.lateStart.status)
			&& va.lateStart.treatDeduct == 2
			&& !va.lateStart.ownReason);
	// 早退補填フラグ
	day.rack.hotenEarlyEnd = (va.earlyEnd // 早退申請あり
			&& teasp.constant.STATUS_FIX.contains(va.earlyEnd.status)
			&& va.earlyEnd.treatDeduct == 2
			&& !va.earlyEnd.ownReason);
	if(day.rack.flexFlag == 2 && !day.rack.useCoreTime){ // フレックスタイム制でコアタイムなしの場合、補填フラグは無効化
		day.rack.hotenLate     = false;
		day.rack.hotenEarlyEnd = false;
	}
	/*
	 * 定時出社・退社時刻が休暇時間、休憩時間とかぶっている場合、調整
	 */
	day.rack.orgBdrStartTime = day.rack.bdrStartTime;
	day.rack.orgBdrEndTime   = day.rack.bdrEndTime;
	if(teasp.util.time.isValidRange(day.rack.bdrStartTime, day.rack.bdrEndTime)){
		var ls = [], le = [];
		for(i = 0 ; i < excludeTime.length ; i++){
			var e = excludeTime[i];
			if(e.dayAll || (e.type && e.type != teasp.constant.REST_PAY && e.type != teasp.constant.REST_UNPAY && e.type != teasp.constant.REST_FIX)){
				continue;
			}
			ls.push(e);
			le.push(e);
		}
		var rests = pattern.restTimes || [];
		for(i = 0 ; i < rests.length ; i++){
			ls.push(rests[i]);
			le.push(rests[i]);
		}
		teasp.util.time.margeTimeSpans(ls);
		teasp.util.time.margeTimeSpans(le);
		ls = ls.sort(function(a, b){ return a.from - b.from; });
		le = le.sort(function(a, b){ return b.to   - a.to;   });
		for(i = 0 ; i < ls.length ; i++){
			var e = ls[i];
			if(e.from <= day.rack.bdrStartTime && day.rack.bdrStartTime < e.to){
				day.rack.bdrStartTime = e.to;
			}
		}
		for(i = 0 ; i < le.length ; i++){
			var e = le[i];
			if(e.from < day.rack.bdrEndTime && day.rack.bdrEndTime <= e.to){
				day.rack.bdrEndTime = e.from;
			}
		}
	}
	/*
	 * 所定労働時間をセット
	 */
	var actFixTime = this.getRealTime(day.rack.fixStartTime, day.rack.fixEndTime, pattern.restTimes); // シフト後の計算上の所定労働時間
	if(this.isFixDay(day)){ // 所定出勤日である
		if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){ // フレックスタイム制
			day.rack.fixTime = pattern.standardFixTime;
		}else if(config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){ // 管理監督者
			day.rack.fixTime = pattern.standardFixTime; // 所定労働時間＝設定値そのまま
		}else{
			day.rack.actFixTime = actFixTime; // シフト後の計算上の所定労働時間
			if(pattern.workTimeChangesWithShift){ // シフト時刻と所定勤務時間を連動させる
				if(pattern.useDiscretionary || (day.patternOrg && day.patternOrg.useDiscretionary)){ // 裁量労働
					var ft = day.rack.actFixTime;
					if(ft < pattern.standardFixTime){
						day.rack.fixTime = ft; // 実働時間が所定労働時間より短い場合のみ、所定労働時間を変更
					}else{
						day.rack.fixTime = pattern.standardFixTime;
					}
					// 法定休憩時間のチェック設定による所定休憩を反映させた所定労働時間を得る
					ft = teasp.logic.EmpTime.getAdjustFixTime({ from: day.rack.fixStartTime, to: day.rack.fixEndTime }
						, pattern
						, day.rack.fixTime // 計算上の所定労働時間
						, this.pouch.getRestTimeCheck()); // 法定休憩時間のチェックの設定
					if(ft != day.rack.fixTime){
						day.rack.fixTimeOrg = day.rack.fixTime; // 補正前の所定労働時間をキープ
					}
					day.rack.fixTime = ft;
				}else{
					if(!pattern.standardFixTime){ // 設定値の所定労働時間==0
						day.rack.fixTime = 0;
					}else{
						// 法定休憩時間のチェック設定による所定休憩を反映させた所定労働時間を得る
						var ft = teasp.logic.EmpTime.getAdjustFixTime({ from: day.rack.fixStartTime, to: day.rack.fixEndTime }
															, pattern
															, day.rack.actFixTime // 所定労働時間
															, this.pouch.getRestTimeCheck()); // 法定休憩時間のチェックの設定
						if(ft != day.rack.actFixTime){
							day.rack.fixTimeOrg = day.rack.actFixTime; // 補正前の所定労働時間をキープ
						}
						day.rack.fixTime = ft;
						if(config.workSystem == teasp.constant.WORK_SYSTEM_FIX // 固定労働時間制で所定が法定労働時間を超える場合
						&& day.rack.fixTime > config.legalTimeOfDay){
							day.rack.fixTime = config.legalTimeOfDay;
						}
					}
				}
			}else{
				day.rack.fixTime = pattern.standardFixTime; // 所定労働時間＝設定値そのまま
			}
		}
	}else{
		if(this.pouch.isRegulateHoliday(day.rack.key)){ // 休日出勤の勤怠規則は平日に準拠する＝オンなら、計算上の所定労働時間を得る（遅刻・早退・私用外出時間の計算用）
			day.rack.actFixTime = this.getRealTime(day.rack.fixStartTime, day.rack.fixEndTime, pattern.restTimes); // シフト後の計算上の所定労働時間
		}
		day.rack.fixTime = 0;
	}
	if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){ // フレックスタイム制の場合、コア時間を取得しておく
		if(day.rack.useCoreTime && this.isNormalDay(day)){
			var rests = dojo.clone(pattern.restTimes || []);
			if(day.rack.holyTime){ // 休暇を取っている場合
				rests = teasp.util.time.margeTimeSpans(rests.concat(day.rack.holySpans)); // 休暇と休憩時間をマージ
			}
			if(!pattern.id){
				day.rack.coreTime = this.getRealTime(config.coreStartTime, config.coreEndTime, rests); // コアタイム時間（休暇除去済み）
			}else{
				day.rack.coreTime = this.getRealTime(day.rack.fixStartTime, day.rack.fixEndTime, rests); // シフト後の計算上のコアタイム時間（休暇除去済み）
			}
		}else{
			day.rack.coreTime = 0;
		}
	}
	/*
	 * 出退時刻とも入力されている場合、出勤フラグをセット
	 * 平日以外の場合、休日出勤申請がない場合は、出退時刻が入力されていても出勤フラグはオフ
	 */
	if(this.isWorkDay(day)){
		day.rack.worked = teasp.util.time.isValidRange(day.startTime, day.endTime);
		if(!day.rack.worked && dayType == teasp.constant.DAY_TYPE_NORMAL && day.plannedHoliday && !day.dayFixed){
			day.rack.paidHolySpans.push({
				from : day.pattern.stdStartTime,
				to   : virEndTime
			});
		}
		if(this.isNormalDay(day)){  // または（休日出勤の勤怠規則は平日に準拠する＝オンかつ管理監督者でない）
			this.preHoten(day);
		}
	}else{
		day.rack.worked = false;
	}
	return day;
};

teasp.logic.EmpTime.exchangeDateInfo = function(pouch, days, dkey, dlst, xx){
	var day = days[dkey];
	if(xx && (day.rack.key != xx.dkey2 || !dlst.contains(xx.dkey1))){
		var res = {
			dayType      : day.dayType,
			valid        : xx.valid,
			exchangeDate : (day.rack.key != xx.dkey2 ? xx.dkey2 : xx.dkey1)
		};
		var xday = days[res.exchangeDate];
		if(xday){
			var obj = pouch.getObj();
			var em1 = pouch.getEmpMonthByDate(dkey);
			var em2 = pouch.getEmpMonthByDate(res.exchangeDate);
			var fx1 = ((em1 && em1.apply) ? teasp.constant.STATUS_FIX.contains(em1.apply.status) : false);
			var fx2 = ((em2 && em2.apply) ? teasp.constant.STATUS_FIX.contains(em2.apply.status) : false);
			if(fx1 && fx2){ // 振替対象日の月度が両方確定済みである
				res.dayType  = day.dbDayType;
			}else{
				var dinf = teasp.logic.EmpTime.getDayInfo(res.exchangeDate, em2, obj.cals[res.exchangeDate], obj.empTypePatterns);
				if(xx.valid){
					res.orgDayType = res.dayType;
					res.dayType    = dinf.dayType;
				}else{
					res.interim = { // 承認待ちで「承認されるまで時間入力を禁止」の場合、暫定の情報をセット。
						orgDayType : day.dayType,
						dayType    : dinf.dayType
					};
				}
			}
			return res;
		}
	}
	return null;
};

/**
 * 日次の労働時間計算・仕分け.<br/><br/>
 * calcType の計算タイプに従い、計算・仕分けを行う。dayに計算タイプ別のオブジェクトを追加、
 * 下記内容の要素を追加する。
 *
 * <div style="margin-left:16px;margin-top:4px;">
 *     obj.days[日付] に追加する要素<br/>
 *     <table style="border-collapse:collapse;border:1px solid #7F8FB1;margin:4px;" border="1">
 *     <tr><td colspan="2">real,disc,freal,fdisc</td><td>計算タイプ別のオブジェクト要素</td></tr>
 *     <tr><td>workRealTime         </td><td>{number}  </td><td>実労働時間                </td></tr>
 *     <tr><td>workWholeTime        </td><td>{number}  </td><td>総労働時間                </td></tr>
 *     <tr><td>workInFixedTime      </td><td>{number}  </td><td>所定内の労働時間          </td></tr>
 *     <tr><td>workLegalTime        </td><td>{number}  </td><td>法定時間内労働時間        </td></tr>
 *     <tr><td>workLegalOverTime    </td><td>{number}  </td><td>法定時間内残業時間        </td></tr>
 *     <tr><td>workLegalOutOverTime </td><td>{number}  </td><td>法定時間外労働時間        </td></tr>
 *     <tr><td>workOverTime         </td><td>{number}  </td><td>残業時間                  </td></tr>
 *     <tr><td>workChargeTime       </td><td>{number}  </td><td>法定時間外割増時間        </td></tr>
 *     <tr><td>workHolidayTime      </td><td>{number}  </td><td>法定休日労働時間          </td></tr>
 *     <tr><td>workNightTime        </td><td>{number}  </td><td>深夜労働時間              </td></tr>
 *     <tr><td>workInFixedSpan      </td><td>{Object}  </td><td>所定内労働時間帯          </td></tr>
 *     <tr><td>workLegalSpan        </td><td>{Object}  </td><td>法定時間内労働時間帯      </td></tr>
 *     <tr><td>workLegalOutOverSpan </td><td>{Object}  </td><td>法定時間外労働時間帯      </td></tr>
 *     <tr><td>workChargeSpan       </td><td>{Object}  </td><td>法定時間外割増労働時間帯  </td></tr>
 *     <tr><td>workHolidaySpan      </td><td>{Object}  </td><td>法定休日労働時間帯        </td></tr>
 *     <tr><td>workNightSpans       </td><td>{Array.<Object>}</td><td>深夜労働時間帯            </td></tr>
 *     <tr><td>lateTime             </td><td>{number}  </td><td>遅刻時間                  </td></tr>
 *     <tr><td>earlyTime            </td><td>{number}  </td><td>早退時間                  </td></tr>
 *     <tr><td>privateInnerTime     </td><td>{number}  </td><td>私用外出時間              </td></tr>
 *     <tr><td>lateLostTime         </td><td>{number}  </td><td>遅刻控除時間              </td></tr>
 *     <tr><td>earlyLostTime        </td><td>{number}  </td><td>早退控除時間              </td></tr>
 *     <tr><td>privateInnerLostTime </td><td>{number}  </td><td>私用外出控除時間          </td></tr>
 *     </table>
 * </div>
 *
 * @param {Object} day 日次情報オブジェクト
 * @param {Object} period 期間の労働時間、法定労働時間などの値を持つオブジェクト
 * @param {Object} config 勤怠設定情報
 * @param {Object} common 共通設定情報
 * @param {string} calcType 計算タイプ
 *     <table>
 *     <tr><td>teasp.constant.C_REAL</td><td>実時間で計算</td></tr>
 *     <tr><td>teasp.constant.C_DISC</td><td>裁量で計算</td></tr>
 *     <tr><td>teasp.constant.C_FREAL</td><td>フレックスタイム制かつ１日毎に実時間で残業表示用に計算</td></tr>
 *     <tr><td>teasp.constant.C_FDISC</td><td>フレックスタイム制かつ１日毎に裁量で残業表示用に計算</td></tr>
 *     </table>
 */
teasp.logic.EmpTime.prototype.calculateEmpDay = function(day, period, config, common, calcType){
	var i;
	var calc = {
		startTime                 : null, // 出社時刻
		endTime                   : null, // 退社時刻
		calcStartTime             : null, // 計算用の出社時刻
		calcEndTime               : null, // 計算用の退社時刻
		workSpan                  : [],   // 労働時間帯
		blankSpan                 : [],   // 労働時間にカウントしない時間帯
		skipSpan                  : [],   // 認められる時間帯の隙間
		workRealTime              : 0,    // 実労働時間
		workWholeTime             : 0,    // 総労働時間
		workInFixedTime           : 0,    // 所定内の労働時間
		workLegalTime             : 0,    // 法定時間内労働時間
		workLegalOverTime         : 0,    // 法定時間内残業時間
		workLegalOutOverTime      : 0,    // 法定時間外労働時間
		settlementTime            : 0,    // 当月清算時間
		workOverTime              : 0,    // 残業時間
		workChargeTime            : 0,    // 法定時間外割増時間
		workDayChargeTime         : 0,    // 法定時間外割増時間（日毎）
		workChargeTime40H         : 0,    // 法定時間外割増時間（週40Hオーバー分のみ。変形のみで使用）
		workHolidayTime           : 0,    // 法定休日労働時間
		workNightTime             : 0,    // 深夜労働時間
		workNightSpans            : [],   // 深夜労働時間帯
		workInFixedSpan           : null, // 所定内労働時間帯
		workLegalSpan             : null, // 法定時間内労働時間帯
		workLegalOverSpan         : [],   // 法定時間内残業時間帯
		workLegalOutOverSpan      : [],   // 法定時間外残業時間帯
		workChargeSpan            : [],   // 法定時間外割増労働時間帯
		workHolidaySpan           : [],   // 法定休日労働時間帯
		awaySpan                  : null, // 公用外出時間帯
		restTime                  : 0,    // 休憩時間
		awayTime                  : 0,    // 公用外出時間
		lateTime                  : 0,    // 遅刻時間
		earlyTime                 : 0,    // 早退時間
		privateInnerTime          : 0,    // 私用外出時間
		lateLostTime              : 0,    // 遅刻控除時間
		earlyLostTime             : 0,    // 早退控除時間
		privateInnerLostTime      : 0,    // 私用外出控除時間
		weekDayDayLegalFixTime    : 0,    // 平日日中法内所定
		weekDayDayLegalExtTime    : 0,    // 平日日中法内残業
		weekDayDayLegalOutTime    : 0,    // 平日日中法外
		weekDayNightLegalFixTime  : 0,    // 平日深夜法内所定
		weekDayNightLegalExtTime  : 0,    // 平日深夜法内残業
		weekDayNightLegalOutTime  : 0,    // 平日深夜法外
		weekEndDayLegalTime       : 0,    // 休日日中法内
		weekEndDayLegalOutTime    : 0,    // 休日日中法外
		weekEndNightLegalTime     : 0,    // 休日深夜法内
		weekEndNightLegalOutTime  : 0,    // 休日深夜法外
		holidayDayTime            : 0,    // 法定休日日中
		holidayNightTime          : 0,    // 法定休日深夜
		discReal                  : false,
		lateFlag                  : -1,
		earlyFlag                 : -1,
		hotenWork                 : 0,    // 遅刻・早退の補填労働時間
		hotenRest                 : 0     // 補填した時間帯にある休憩時間
	};
	/*
	 * 深夜時間帯抽出作業用のクローンを作成
	 */
	var nightWorkObjs = dojo.clone(common.nightTimes || []); // 深夜時間帯
	/*
	 * １日の法定労働時間を補正（変形労働時間制かつ所定労働時間が１日の法定労働時間より多い場合）
	 */
	var dayLegal = config.legalTimeOfDay;
	if(config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE && config.legalTimeOfDay < day.rack.fixTime){
		dayLegal = day.rack.fixTime;
	}
	var excludes = day.rack.excludes;
	calc.startTime = day.startTime;
	calc.endTime   = day.endTime;

	// 遅刻・早退の境界時刻を得る
	var fst = day.rack.bdrStartTime;
	var fet = day.rack.bdrEndTime;
	var fst0 = day.rack.orgBdrStartTime;
	var fet0 = day.rack.orgBdrEndTime;
	if(day.rack.flexFlag == 2){
		if(fst < config.coreStartTime){
			fst = config.coreStartTime;
		}
		if(fet > config.coreEndTime){
			fet = config.coreEndTime;
		}
	}
	var fet2 = null; // 所定に達する終業時刻（フレックスなら不要）
	if(typeof(fst) == 'number' && day.rack.flexFlag < 2){
		var wt = [{ from: fst0, to: 48*60 }];
		var rests = day.pattern.restTimes;
		var i = 0;
		while(i < rests.length) {
			wt = teasp.util.time.sliceTimes(wt, rests[i]);
			i++;
		}
		var ft = 0;
		var fixTime = (day.rack.fixTime || day.rack.actFixTime);
		for(i = 0 ; i < wt.length ; i++){
			var w = wt[i];
			ft += (w.to - w.from);
			if(fet2 === null && fixTime <= ft){ // 所定勤務時間に達した
				fet2 = w.to - (ft - fixTime);
			}
		}
		if(fet2 < fet0 && !rests.length && config.deductWithFixedTime){
			fet2 = fet0;
		}
	}
	if(fet2 === null){
		fet2 = fet0;
	}
	// 上の結果、所定に達する時刻が定時終業時刻より遅いが、退社時刻が所定に達する時刻より前の場合、
	// 所定に達する「始業時刻」を得ておく（始業時刻を前倒しにできることが確認できたら、後で前倒しにする）
	var fst2 = fst; // 所定に達する始業時刻
	if(typeof(fst) == 'number' && day.rack.flexFlag < 2
	&& typeof(calc.startTime) == 'number'
	&& typeof(calc.endTime) == 'number'
	&& fet0 < fet2
	&& calc.endTime < fet2
	){
		var _fst = teasp.logic.EmpTime.getReachTimeReverse(Math.max(fet0, calc.endTime), day.pattern.restTimes, (day.rack.fixTime || day.rack.actFixTime));
		if(_fst < fst2){
			fst2 = Math.max(_fst, calc.startTime);
		}
	}

	var normalDay = this.isFixDay(day)
				|| (this.pouch.isRegulateHoliday(day.rack.key)                  // または（休日出勤の勤怠規則は平日に準拠する＝オンかつ管理監督者でない）
				&& config.workSystem != teasp.constant.WORK_SYSTEM_MANAGER);

	// 遅刻 or 早退の判定（申請の有無に関わらず）
	var checkLE // 遅刻 or 早退判定をする日か
			= (!day.pattern.useDiscretionary                                      // 裁量労働ではない
			&& normalDay                                                          // 平日である,または休日出勤の勤怠規則は平日に準拠する設定
			&& (day.rack.flexFlag < 2 || day.rack.useCoreTime));                  // フレックスタイム制でないか非フレックス適用日またはコアタイムがある

	if(typeof(day.startTime) == 'number'){             // 出社時刻入力済みかつ
		calc.lateFlag = (checkLE && fst < day.startTime ? 1 : 0); // 定時始業時刻より出社が遅いなら 1、そうでなければ 0
	}
	if(typeof(day.endTime) == 'number'){               // 退社時刻入力済み
		calc.earlyFlag = (checkLE && day.endTime < fet ? 1 : 0);  // 定時終業時刻より退社が早いなら 1、そうでなければ 0
	}

	var outSpan = [];
	var fixSpan = [];

	var lateStart = day.rack.validApplys.lateStart; // 遅刻申請
	var earlyEnd  = day.rack.validApplys.earlyEnd;  // 早退申請

	var earlyStart = (day.rack.validApplys.earlyStart.length > 0 ? day.rack.validApplys.earlyStart[0] : null); // 早朝勤務申請
	var zangyo     = (day.rack.validApplys.zangyo.length     > 0 ? day.rack.validApplys.zangyo[0]     : null); // 残業申請

	var mixRests = day.rack.freeRests.concat(day.rack.fixRests); // 所定休憩と私用外出を合わせた配列を作成
	var honRests = teasp.util.time.includeRanges(teasp.util.time.margeTimeSpans(mixRests.concat(day.rack.hourRests)), [{ from: fst, to: fet2 }]); // 所定時間内の所定休憩と私用外出
	honRests = honRests.concat(teasp.util.time.excludeRanges(day.pattern.restTimes, [{ from: fst, to: fet2 }]));
	var simRests = teasp.util.time.includeRanges(mixRests, [{ from: fst, to: fet2 }]); // 所定時間内の所定休憩と私用外出
	simRests = simRests.concat(teasp.util.time.excludeRanges(day.pattern.restTimes, [{ from: fst, to: fet2 }]));
	var pubRests = teasp.util.time.margeTimeSpans(day.pattern.restTimes.concat(day.rack.hourRests));
	var extRests = teasp.util.time.margeTimeSpans(pubRests.concat(day.rack.excludeHalf));

	var defactoRest = 0;
	if((day.pattern.restTimes || []).length <= 0){
		var restraint = (fet0 - fst0); // 拘束時間
		var rcs = this.pouch.getRestTimeCheck(); // 法定休憩時間のチェック
		for(i = 0 ; i < rcs.length ; i++){
			if(rcs[i].check){
				if(rcs[i].workTime < restraint){ // 「終業時刻－始業時刻－（時間単位休）」と比較
					defactoRest = Math.max(defactoRest, rcs[i].restTime);
				}
			}
		}
	}

	var hoten = null; // 補填情報用

	if(typeof(calc.startTime) == 'number'
	&& calc.startTime > fst // 出社時刻が始業時刻より遅い
	&& day.rack.hotenLate){ // 遅刻補填
		calc.startTimeOrg = calc.startTime;
		var fstw = fst; // 所定の始業時刻
		var leto = Math.min(lateStart.endTime, fet);
		if(leto < calc.startTime){ // 遅刻申請の時刻＜実際の出社時刻の場合
			var latePlus = this.getRealTime(leto, calc.startTime, extRests); // 遅刻時間を得る
			fstw = teasp.logic.EmpTime.slideTime(fst, calc.endTime, pubRests, latePlus, false); // この遅刻時間を補填対象外とするため、始業時刻を調整
		}
		// 補填後の出社時刻を得る
		hoten = teasp.logic.EmpTime.complementTime(
				calc.startTime,
				calc.endTime,
				fstw,
				hoten,
				day.pattern.restTimes,
				honRests,
				simRests,
				defactoRest,
				false);
		calc.startTime = hoten.tm;
	}
	if(typeof(calc.endTime) == 'number'
	&& calc.endTime < fet // 退社時刻が終業時刻より早い
	&& day.rack.hotenEarlyEnd){ // 早退補填
		calc.endTimeOrg = calc.endTime;
		var fetw = fet; // 所定の終業時刻
		var est = Math.max(earlyEnd.startTime, fst);
		if(calc.endTime < est){ // 実際の退社時刻＜早退申請の時刻の場合
			var earlyPlus = this.getRealTime(calc.endTime, est, extRests); // 早退時間を得る
			fetw = teasp.logic.EmpTime.slideTime(calc.startTime, fet, pubRests, earlyPlus, true); // この早退時間を補填対象外とするため、終業時刻を調整
		}
		// 補填後の退社時刻を得る
		hoten = teasp.logic.EmpTime.complementTime(
				calc.startTime,
				calc.endTime,
				fetw,
				hoten,
				day.pattern.restTimes,
				honRests,
				simRests,
				defactoRest,
				true);
		calc.endTime = hoten.tm;
	}

	var earlyWorkBorderTime = ((config.useEarlyWorkFlag & 2) && day.rack.flexFlag ? this.pouch.getEarlyWorkBorderTime(day.rack.fixEndTime, config)  : config.earlyWorkBorderTime) || 0;
	var overTimeBorderTime  = ((config.useOverTimeFlag  & 2) && day.rack.flexFlag ? this.pouch.getOverTimeBorderTime(day.rack.fixStartTime, config) : config.overTimeBorderTime ) || 2880;

	var allow = {
		bst    : (normalDay && (config.useEarlyWorkFlag & 2) && earlyWorkBorderTime >= 0 ? earlyWorkBorderTime : -1), // 早朝勤務申請が必須になる時刻
		bet    : (normalDay && (config.useOverTimeFlag  & 2) && overTimeBorderTime  >= 0 ? overTimeBorderTime  : -1), // 残業申請が必須になる時刻
		st     : null,
		et     : null,
		xst    : null,
		xet    : null,
		zst    : null,
		zet    : null,
		stFlag : false,
		etFlag : false
	};
	allow.bst0 = allow.bst; // 早朝勤務申請が必須になる時刻
	allow.bet0 = allow.bet; // 残業申請が必須になる時刻
	if(day.notify && (allow.bst < 0 || day.notify.startTime < allow.bst)){
		if(!(config.useEarlyWorkFlag  & 8)){ // 「所定勤務時間に達するまで申請なしでも認める」がオフ
			allow.bst = day.notify.startTime;
		}
	}
	if(day.notify && (allow.bet < 0 || allow.bet < day.notify.endTime)){
		if(!(config.useOverTimeFlag  & 8)){ // 「所定勤務時間に達するまで申請なしでも認める」がオフ
			allow.bet = day.notify.endTime;
		}
	}
	allow.zst = allow.st = ((config.useEarlyWorkFlag & 2) ? (allow.bst >= 0 ? allow.bst : fst0) : 0);            // 申請なしで認められる開始時刻の限度（所定労働時間に達してなければオーバー可）
	allow.zet = allow.et = ((config.useOverTimeFlag  & 2) ? (allow.bet >= 0 ? allow.bet : fet0) : (48 * 60));    // 申請なしで認められる終了時刻の限度（所定労働時間に達してなければオーバー可）

	if((config.useEarlyWorkFlag & 2) && earlyStart && earlyStart.startTime < allow.st){ // 申請がある場合、認められる出社時刻は申請の開始時刻にする
		allow.st = allow.bst = earlyStart.startTime;
	}
	if((config.useOverTimeFlag & 2) && zangyo && allow.et < zangyo.endTime){ // 申請がある場合、認められる退社時刻は申請の終了時刻にする
		allow.et = allow.bet = zangyo.endTime;
	}
	if(day.rack.flexFlag == 2){
		var nst = Math.min(day.rack.fixStartTime, fst); // 標準の出社時刻かコアタイムの開始時刻の早い方
		var net = Math.max(day.rack.fixEndTime  , fet); // 標準の退社時刻かコアタイムの終了時刻の遅い方
		if(nst < allow.st){
			allow.st = allow.bst = nst;
		}
		if(allow.et < net){
			allow.et = allow.bet = net;
		}
	}else{
		if(fst < allow.st){ // 認められる出社時刻が定時始業時刻より後の場合は定時始業時刻とする
			allow.st = allow.bst = fst;
		}
		if(allow.et < fet){ // 認められる退社時刻が定時終業時刻より前の場合は定時終業時刻とする
			allow.et = allow.bet = fet;
		}
	}
	// 所定に達する「始業時刻」が定時の始業時刻より早く、認められる範囲内の場合は、
	// 始業時刻をずらす
	if(fst2 < fst && allow.st < fst){
		fst = Math.max(fst2, allow.st);
	}
	if(day.notify){ // 所定時間帯であっても勤務時間変更申請でシフトしていれば申請の時間帯以外は認められない
		if(allow.zst > day.notify.startTime){
			allow.zst = day.notify.startTime;
		}
		if(allow.zet < day.notify.endTime){
			allow.zet = day.notify.endTime;
		}
	}else if(day.pattern.useDiscretionary && calcType == teasp.constant.C_DISC){
		allow.zst = day.rack.fixStartTime;
		allow.zet = day.rack.fixEndTime;
	}else{
		if(allow.zst > day.rack.fixStartTime){
			allow.zst = day.rack.fixStartTime;
		}
		if(allow.zet < day.rack.fixEndTime){
			allow.zet = day.rack.fixEndTime;
		}
	}

	var blankZan = null, blankZanTime = 0;
	var blankEst = null, blankEstTime = 0;
	var skipZan = null;
	var skipEst = null;
	if(zangyo && allow.zet < zangyo.startTime){ // 残業申請ありかつ定時退社時刻～残業の開始時刻の間隔あり
		if(day.pattern.useDiscretionary && calcType == teasp.constant.C_DISC){
			skipZan = blankZan = [{
				from : allow.zet,
				to   : zangyo.startTime,
				type : teasp.constant.REST_FREE
			}];
			blankZanTime = teasp.logic.EmpTime.getSpanTime(blankZan); // 間隔時間（休憩とみなす）
		}else{
			var o = {
				from : Math.max(allow.zet       , (typeof(calc.startTime) == 'number' ? calc.startTime : 0    )),
				to   : Math.min(zangyo.startTime, (typeof(calc.endTime)   == 'number' ? calc.endTime   : 48*60)),
				type : teasp.constant.REST_FREE
			};
			if(o.from < o.to){
				skipZan = blankZan = [o];
				blankZanTime = teasp.logic.EmpTime.getSpanTime(blankZan); // 間隔時間（休憩とみなす）
			}
		}
	}
	if(earlyStart && allow.zst > earlyStart.endTime){ // 早朝勤務申請ありかつ早朝勤務の終了時刻～定時始業時刻の間隔あり
		if(day.pattern.useDiscretionary && calcType == teasp.constant.C_DISC){
			skipEst = blankEst = [{
				from : earlyStart.endTime,
				to   : allow.zst,
				type : teasp.constant.REST_FREE
			}];
			blankEstTime = teasp.logic.EmpTime.getSpanTime(blankEst); // 間隔時間（休憩とみなす）
		}else{
			var o = {
				from : Math.max(earlyStart.endTime, (typeof(calc.startTime) == 'number' ? calc.startTime : 0    )),
				to   : Math.min(allow.zst         , (typeof(calc.endTime)   == 'number' ? calc.endTime   : 48*60)),
				type : teasp.constant.REST_FREE
			};
			if(o.from < o.to){
				skipEst = blankEst = [o];
				blankEstTime = teasp.logic.EmpTime.getSpanTime(blankEst); // 間隔時間（休憩とみなす）
			}
		}
	}

	if(day.rack.worked // 出退時刻入力済み
	&& day.rack.flexFlag < 2 // 非フレックス日
	&& normalDay // 平日または休日出勤の勤怠規則は平日に準拠する設定
	){
		allow.stFlag = ((config.useEarlyWorkFlag & 8) && ((blankEstTime && calc.startTime < allow.zst) || (calc.startTime < allow.st))); // 「所定勤務時間に達するまで申請なしでも認める」がオンかつ認められる出社時刻より出社時刻の方が早い
		allow.etFlag = ((config.useOverTimeFlag  & 8) && ((blankZanTime && calc.endTime   > allow.zet) || (calc.endTime   > allow.et))); // 「所定勤務時間に達するまで申請なしでも認める」がオンかつ認められる退社時刻より退社時刻の方が遅い
		if(allow.stFlag || allow.etFlag){ // 認められる時刻より早くor遅く出退社している
			var ex = excludes.concat(day.rack.fixRests); // 所定休憩
			ex = ex.concat(day.rack.freeRests); // 私用休憩
			ex = ex.concat(day.rack.hourRests); // 時間単位休
			var rests = ex;
			var blankZanWork = null, blankEstWork = null;
			var bz = [].concat(blankZan || []);
			if(zangyo && zangyo.endTime < calc.endTime){
				bz.push({ from: Math.max(zangyo.endTime, calc.startTime), to: calc.endTime });
			}
			if(bz.length){
				blankZanWork = teasp.util.time.excludeRanges(bz, rests); // 定時退社時刻～残業の開始時刻のうち、働いた時間
				ex = ex.concat(bz); // 定時退社時刻～残業開始時刻
			}
			var be = [].concat(blankEst || []);
			if(earlyStart && calc.startTime < earlyStart.startTime){
				be.unshift({ from: calc.startTime, to: Math.min(earlyStart.startTime, calc.endTime) });
			}
			if(be.length){
				blankEstWork = teasp.util.time.excludeRanges(be, rests); // 早朝勤務の終了時刻～定時始業時刻のうち、働いた時間
				ex = ex.concat(be); // 早朝勤務終了時刻～定時出社時刻
			}
			if(blankZanWork){
				blankZanWork = blankZanWork.sort(function(a, b){
					return (a.to == a.to ? (a.from - b.from) : (a.to - b.to));
				});
			}
			if(blankEstWork){
				blankEstWork = blankEstWork.sort(function(a, b){
					return (a.to == a.to ? (a.from - b.from) : (a.to - b.to));
				});
			}
			var ft = 0;
			var padt = 0;
			if(allow.etFlag){ // 認められる時刻より遅く退社している
				var zo = {
					from : (calc.startTime < allow.st ? allow.st : calc.startTime),
					to   : calc.endTime
				};
				if(allow.bet0 >= 0 && allow.bet0 < zo.to){
					zo.to = allow.bet0;
				}
				var wtList = this.getSlicedList(day, [zo], ex, config, common);
				for(i = 0 ; i < wtList.length ; i++){
					var w = wtList[i];
					ft += (w.to - w.from);
					if(allow.xet === null && day.rack.fixTime <= ft){ // 所定勤務時間に達したところを暫定の認められる終了時刻とする
						allow.xet = w.to - (ft - day.rack.fixTime);
					}
				}
				var padEt = null;
				if(ft < day.rack.fixTime && blankZanWork){ // 所定勤務時間に達してないので、blankZanWork から労働時間に昇格させる
					var pt = (day.rack.fixTime - ft); // 達してない分
					var zw = new Array();
					for(i = 0 ; (i < blankZanWork.length && pt > 0) ; i++){
						var w = blankZanWork[i];
						if(allow.bet0 >= 0 && allow.bet0 < w.to){
							w.to = allow.bet0;
						}
						if(allow.bst0 >= 0 && w.from < allow.bst0){
							w.from = allow.bst0;
						}
						var t = (w.to - w.from);
						if(t <= 0){
							continue;
						}
						if(t <= pt){
							zw.push(w);
							pt -= t;
						}else{
							var ht = (t - pt);
							zw.push({ from: w.from, to: w.to - ht });
							pt -= (t - ht);
						}
					}
					if(zw.length){
						padt = teasp.logic.EmpTime.getSpanTime(zw); // 昇格した労働時間
						ex = teasp.util.time.excludeRanges(ex, zw);
						ft += padt;
						for(i = 0 ; i < zw.length ; i++){
							if(padEt === null || padEt < zw[i].to){
								padEt = zw[i].to; // 昇格労働時間の最後の時刻を得る
							}
						}
						if(skipZan){
							skipZan = teasp.util.time.excludeRanges(dojo.clone(skipZan), [{ from: skipZan[0].from, to: padEt }]);
						}
						blankZan = teasp.util.time.excludeRanges(blankZan, zw);
						blankZanTime = teasp.logic.EmpTime.getSpanTime(blankZan); // 間隔時間（休憩とみなす）
					}
				}
				var et0 = (wtList.length > 0 ? wtList[wtList.length - 1].to : calc.endTime); // 退社時刻
				if(allow.xet === null){
					allow.xet = (padEt !== null ? padEt : et0); // 所定勤務時間に達しなかったら、認められる終了時刻を退社時刻とする
				}
				if(padEt !== null && allow.xet < padEt){ // 昇格労働時間の最後の時刻の方が大きければ、その時刻を認められる終了時刻とする
					allow.xet = padEt;
				}else{
					if(allow.xet < allow.et){ // 終了時刻が残業申請の終了時刻より前なら、認められる終了時刻を残業申請の終了時刻とする
						allow.xet = allow.et;
					}
					if(allow.bet >= 0 && (allow.bet < allow.xet) && padEt === null){ // 残業申請が必須になる時刻より後ならその時刻にする
						allow.xet = allow.bet;
					}
					if(allow.xet > calc.endTime){ // 退社時刻を超えないようにする
						allow.xet = calc.endTime;
					}
				}
			}
			if(ft < day.rack.fixTime && allow.stFlag){ // 所定労働時間に達してないかつ認められる時刻より早く出社している
				var zo = {
					from : calc.startTime,
					to   : (allow.xet !== null ? allow.xet : (calc.endTime > allow.et ? allow.et : calc.endTime))
				};
				if(allow.bst0 >= 0 && zo.from < allow.bst0){
					zo.from = allow.bst0;
				}
				var wtList = this.getSlicedList(day, [zo], ex, config, common);
				ft = 0;
				for(i = wtList.length - 1 ; i >= 0 ; i--){
					var w = wtList[i];
					ft += (w.to - w.from);
					if(allow.xst === null && day.rack.fixTime <= ft){ // 所定勤務時間に達したところを暫定の認められる開始時刻とする
						allow.xst = w.from + (ft - day.rack.fixTime);
					}
				}
				var padSt = null;
				if(ft < day.rack.fixTime && blankEstWork){ // 所定勤務時間に達してないので、blankEstWork から労働時間に昇格させる
					var pt = (day.rack.fixTime - ft); // 達してない分
					pt -= padt; // すでに昇格させた分の時間は差し引いておく
					var zw = new Array();
					for(i = blankEstWork.length - 1 ; (i >= 0 && pt > 0) ; i--){
						var w = blankEstWork[i];
						if(allow.bet0 >= 0 && allow.bet0 < w.to){
							w.to = allow.bet0;
						}
						if(allow.bst0 >= 0 && w.from < allow.bst0){
							w.from = allow.bst0;
						}
						var t = (w.to - w.from);
						if(t <= 0){
							continue;
						}
						if(t <= pt){
							zw.push(w);
							pt -= t;
						}else{
							var ht = (t - pt);
							zw.push({ from: w.from + ht, to: w.to });
							pt -= (t - ht);
						}
					}
					if(zw.length){
						for(i = 0 ; i < zw.length ; i++){
							if(padSt === null || zw[i].from < padSt){
								padSt = zw[i].from; // 昇格労働時間の最初の時刻を得る
							}
						}
						if(skipEst){
							skipEst = teasp.util.time.excludeRanges(dojo.clone(skipEst), [{ from: padSt, to: skipEst[0].to }]);
						}
						blankEst = teasp.util.time.excludeRanges(blankEst, zw);
						blankEstTime = teasp.logic.EmpTime.getSpanTime(blankEst); // 間隔時間（休憩とみなす）
					}
				}
				var st0 = (wtList.length > 0 ? wtList[0].from : calc.startTime); // 出社時刻
				if(allow.xst === null){
					allow.xst = (padSt !== null ? padSt : st0); // 所定勤務時間に達しなかったら、認められる開始時刻を出社時刻とする
				}
				if(padSt !== null && padSt < allow.xst){ // 昇格労働時間の最初の時刻の方が小さければ、その時刻を認められる開始時刻とする
					allow.xst = padSt;
				}else{
					if(allow.xst > allow.st){ // 開始時刻が早朝勤務申請の開始時刻より前なら、認められる開始時刻を早朝勤務申請の開始時刻とする
						allow.xst = allow.st;
					}
					if(allow.bst >= 0 && (allow.xst < allow.bst) && padSt === null){  // 早朝勤務申請が必須になる時刻より前ならその時刻にする
						allow.xst = allow.bst;
					}
					if(allow.xst < calc.startTime){ // 出社時刻を超えないようにする
						allow.xst = calc.startTime;
					}
				}
			}
		}
	}
	var legalWholeTimeAdd = 0;
	var totalLos = 0;
	var notExclude = false;
	var hmns = null;
	var tmpRestInner = 0;
	var offsetFix = 0;
	var denyRestTime = 0; // 取ってない所定休憩時間
	var calcStartTimePreHoten = null, calcEndTimePreHoten = null;
	hoten = null;
	if(teasp.util.time.isInputTime(day.startTime, day.endTime)){ // 出退時刻どちらかが入力されている
		var blanks = [];
		/*
		 * 出社時刻、退社時刻を取得
		 */
		if(calcType == teasp.constant.C_REAL      // 計算タイプが実労働
		|| calcType == teasp.constant.C_FREAL
		|| !day.pattern.useDiscretionary          // または勤務パターンが裁量労働ではない
		|| (day.pattern.useDiscretionary && !normalDay && config.workSystem != teasp.constant.WORK_SYSTEM_MANAGER /* && !this.pouch.isNightChargeOnly()*/)){ // または（休日かつ休日出勤の勤怠は平日準拠でない）の場合
			calcStartTimePreHoten = calc.calcStartTime = day.startTime;
			calcEndTimePreHoten   = calc.calcEndTime   = day.endTime;
			excludes = excludes.concat(day.rack.fixRests);  // 所定休憩時間を除外リストへ追加
			excludes = excludes.concat(day.rack.freeRests); // 私用休憩時間を除外リストへ追加
			// 出社時刻が定時の始業時刻より早いかつ「早朝勤務は申請を必須とする」がオンの場合
			if(typeof(calc.calcStartTime) == 'number'
			&& (config.useEarlyWorkFlag & 2)
			&& calc.calcStartTime < fst){
				if(earlyStart){ // 早朝勤務申請あり
					if(earlyStart.endTime < allow.zst){ // 始業時刻と早朝勤務の終了時刻の間に隙間がある
						if(blankEst){
							blanks = blanks.concat(blankEst);
						}else{
							blanks.push({
								from : earlyStart.endTime,
								to   : allow.zst,
								type : teasp.constant.REST_FREE
							});
						}
					}
				}
				if(allow.xst !== null){
					calc.calcStartTime = allow.xst;
				}else{
					if(earlyStart && calc.calcStartTime < earlyStart.startTime && earlyStart.startTime < allow.st){ // 早朝勤務申請の申請時刻より早い出社時刻は調整
						calc.calcStartTime = earlyStart.startTime;
					}else if(calc.calcStartTime < allow.st){
						calc.calcStartTime = allow.st; // 申請がない場合は認められる開始時刻が出社時刻
					}
				}
			}else if(typeof(calc.calcStartTime) == 'number'
			&& calc.calcStartTime > fst // 出社時刻が始業時刻より遅い
			&& lateStart // 遅刻申請あり
			&& teasp.constant.STATUS_FIX.contains(lateStart.status)){ // 有効な申請
				// 申請の終了時刻より出社時刻が遅い
				calc.latePlus = (lateStart.endTime < fet && lateStart.endTime < calc.calcStartTime ? this.getRealTime(lateStart.endTime, Math.min(fet, calc.calcStartTime), extRests) : 0);
				if(day.rack.hotenLate){ // 遅刻補填
					var leto = Math.min(lateStart.endTime, fet);
					var latePlus = (leto < calc.calcStartTime ? this.getRealTime(leto, calc.calcStartTime, extRests) : 0);
					var fstw = fst; // 所定の始業時刻
					var st = calc.calcStartTime; // 出社時刻
					if(latePlus){ // 遅刻申請の時刻＜実際の出社時刻なので発生した遅刻時間
						tmpRestInner += latePlus;
						fstw = teasp.logic.EmpTime.slideTime(fst, calc.calcEndTime, pubRests, latePlus, false); // 補填対象外なので始業時刻調整
					}else if(calc.startTimeOrg){
						st = calc.startTimeOrg;
					}
					// 補填後の出社時刻を得る
					hoten = teasp.logic.EmpTime.complementTime(
							st,
							calc.endTime,
							fstw,
							hoten,
							day.pattern.restTimes,
							honRests,
							simRests,
							defactoRest,
							false);
					calc.calcStartTime = hoten.tm;
					calc.hotenWork += hoten.work;
					calc.hotenRest += hoten.rest;
				}
			}
			// 退社時刻が定時の終業時刻より遅いかつ「残業は申請を必須とする」がオンの場合
			if(typeof(calc.calcEndTime) == 'number'
			&& (config.useOverTimeFlag & 2)
			&& calc.calcEndTime > fet){
				if(zangyo){ // 残業申請あり
					if(allow.zet < zangyo.startTime){ // 終業時刻と残業の開始時刻の間に隙間がある
						if(blankZan){
							blanks = blanks.concat(blankZan);
						}else{
							blanks.push({
								from : allow.zet,
								to   : zangyo.startTime,
								type : teasp.constant.REST_FREE
							});
						}
					}
				}
				if(allow.xet !== null){
					calc.calcEndTime = allow.xet;
				}else{
					if(zangyo && calc.calcEndTime > zangyo.endTime && zangyo.endTime > allow.et){ // 残業申請の申請時刻より遅い退社時刻は調整
						calc.calcEndTime = zangyo.endTime;
					}else if(calc.calcEndTime > allow.et){
						calc.calcEndTime = allow.et; // 申請がない場合は認められる終了時刻が退社時刻
					}
				}
			}else if(typeof(calc.calcEndTime) == 'number'
			&& calc.calcEndTime < fet // 退社時刻が終業時刻より早い
			&& earlyEnd // 早退申請あり
			&& teasp.constant.STATUS_FIX.contains(earlyEnd.status)){ // 有効な申請
				calc.earlyPlus = (fst < earlyEnd.startTime && calc.calcEndTime < earlyEnd.startTime ? this.getRealTime(Math.max(fst, calc.calcEndTime), earlyEnd.startTime, extRests) : 0); // 申請の開始時刻より退社時刻が早い
				if(day.rack.hotenEarlyEnd){ // 早退補填
					var est = Math.max(earlyEnd.startTime, fst);
					var earlyPlus = (calc.calcEndTime < est ? this.getRealTime(calc.calcEndTime, est, extRests) : 0); // 申請の開始時刻より退社時刻が早い
					var fetw = fet; // 所定の終業時刻
					var et = calc.calcEndTime;
					if(earlyPlus){ // 実際の退社時刻＜早退申請の時刻なので発生した早退時間
						tmpRestInner += earlyPlus;
						fetw = teasp.logic.EmpTime.slideTime(calc.calcStartTime, fet, pubRests, earlyPlus, true); // 補填対象外なので終業時刻調整
					}else if(calc.endTimeOrg){
						et = calc.endTimeOrg;
					}
					// 補填後の退社時刻を得る
					hoten = teasp.logic.EmpTime.complementTime(
							calc.calcStartTime,
							et,
							fetw,
							hoten,
							day.pattern.restTimes,
							honRests,
							simRests,
							defactoRest,
							true);
					calc.calcEndTime = hoten.tm;
					calc.hotenWork += hoten.work;
					calc.hotenRest += hoten.rest;
				}
			}
		}else{ // 裁量労働かつ計算タイプが裁量労働の場合
			var ka = null;
			if(normalDay){ // 平日なら所定の始業・終業時刻
				if(config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){
					calc.calcStartTime = calc.startTime;
					calc.calcEndTime   = calc.endTime;
				}else{
					calc.calcStartTime = calc.startTime = (typeof(day.startTime) == 'number' ? day.rack.fixStartTime : null);
					calc.calcEndTime   = calc.endTime   = (typeof(day.endTime)   == 'number' ? day.rack.fixEndTime   : null);
				}
				calc.endTimeOrg = calc.startTimeOrg = null;
				notExclude = (calcType == teasp.constant.C_DISC && config.workSystem != teasp.constant.WORK_SYSTEM_MANAGER);
			}else{
				if(!this.pouch.isNightChargeOnly() || calcType != teasp.constant.C_DISC){
					ka = (day.rack.validApplys.kyushtu.length > 0 ? day.rack.validApplys.kyushtu[0] : null); // 休日出勤申請があれば、申告された時刻で
					calc.calcStartTime = calc.startTime = (typeof(day.startTime) == 'number' ? (ka ? ka.startTime : day.rack.fixStartTime) : null);
					calc.calcEndTime   = calc.endTime   = (typeof(day.endTime)   == 'number' ? (ka ? ka.endTime   : day.rack.fixEndTime  ) : null);
					calc.endTimeOrg = calc.startTimeOrg = null;
				}else{
					calc.discReal = true;
				}
			}
			// 半休取得時のみなしの出退社時刻をセット
			if(!ka
			&& typeof(day.rack.fixStartTime2) == 'number'
			&& typeof(day.rack.fixEndTime2)   == 'number'
			&& typeof(day.startTime) == 'number'
			&& typeof(day.endTime)   == 'number'
			){
				hmns = { from: day.rack.fixStartTime2, to: day.rack.fixEndTime2 };
			}
			excludes = excludes.concat(day.pattern.restTimes);  // 所定休憩時間を除外リストへ追加
			// 残業申請されている場合、申告された時間を労働時間に含める
			if(zangyo){
				if(day.rack.fixEndTime < zangyo.startTime){ // 終業時刻と残業の開始時刻の間に隙間がある
					if(blankZan){
						blanks = blanks.concat(blankZan);
					}else{
						blanks.push({
							from : day.rack.fixEndTime,
							to   : zangyo.startTime,
							type : teasp.constant.REST_FREE
						});
					}
				}
				if(typeof(day.endTime) == 'number' // 退社時刻入力済み
				&& calc.calcEndTime < zangyo.endTime && (!this.pouch.isNightChargeOnly() || calcType != teasp.constant.C_DISC)){
					calc.calcEndTime = calc.endTime = zangyo.endTime;
					calc.endTimeOrg = null;
				}
			}
			// 早朝勤務申請
			if(earlyStart){
				if(earlyStart.endTime < day.rack.fixStartTime){ // 始業時刻と早朝勤務の終了時刻の間に隙間がある
					if(blankEst){
						blanks = blanks.concat(blankEst);
					}else{
						blanks.push({
							from : earlyStart.endTime,
							to   : day.rack.fixStartTime,
							type : teasp.constant.REST_FREE
						});
					}
				}
				if(typeof(day.startTime) == 'number' // 出社時刻入力済み
				&& calc.calcStartTime > earlyStart.startTime && (!this.pouch.isNightChargeOnly() || calcType != teasp.constant.C_DISC)){
					calc.calcStartTime = calc.startTime = earlyStart.startTime;
					calc.startTimeOrg = null;
				}
			}
		}
		calc.blankSpan = blanks;
		if(skipZan){
			calc.skipSpan = calc.skipSpan.concat(skipZan);
		}
		if(skipEst){
			calc.skipSpan = calc.skipSpan.concat(skipEst);
		}

		var hotenWork = (calc.hotenWork || 0);
		// 未申請早朝勤務
		var svEstSpan = skipEst || [];
		if(calc.startTime < calc.calcStartTime){
			svEstSpan = svEstSpan.concat([{from:calc.startTime, to:calc.calcStartTime}]);
		}
		if(svEstSpan.length){
			calc.svEst = teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges(svEstSpan, excludes));
			if(hotenWork){
				var hw = Math.min(calc.svEst, hotenWork);
				calc.svEst -= hw;
				hotenWork -= hw;
			}
		}
		// 未申請残業
		var svZanSpan = skipZan || [];
		if(calc.calcEndTime < calc.endTime){
			svZanSpan = svZanSpan.concat([{from:calc.calcEndTime, to:calc.endTime}]);
		}
		if(svZanSpan.length){
			calc.svZan = teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges(svZanSpan, excludes));
			if(hotenWork){
				var hw = Math.min(calc.svZan, hotenWork);
				calc.svZan -= hw;
				hotenWork -= hw;
			}
		}

		if(blanks.length > 0){
			excludes = excludes.concat(blanks);
		}
		// 裁量労働の場合、ネット労働時間を補正前の出退社時刻で計算する
		if(typeof(calcStartTimePreHoten) == 'number' && typeof(calcEndTimePreHoten) == 'number'
		&& day.pattern.useDiscretionary && calcType == teasp.constant.C_REAL){
			var rests = teasp.util.time.margeTimeSpans(excludes.concat(day.rack.hourRests));
			var span = teasp.util.time.excludeRanges([{from: calcStartTimePreHoten, to: calcEndTimePreHoten}], rests);
			calc.workNetTime = teasp.logic.EmpTime.getSpanTime(teasp.util.time.includeRanges(span, [{ from: (allow.xst !== null ? allow.xst : allow.st), to: (allow.xet !== null ? allow.xet : allow.et) }])); // 裁量労働の場合のネット労働時間を得る
		}
		if(day.rack.worked){ // 出退時刻とも入力されている
			if(calc.calcStartTime > calc.calcEndTime){
				calc.calcEndTime = calc.calcStartTime;
			}
			// 労働時間帯（hmns（裁量労働かつ計算タイプが裁量労働の時の半休取得時のみなし時間）がセットされていればそちらを使う）
			calc.workSpan = [(hmns ? hmns : { from: calc.calcStartTime, to : calc.calcEndTime })];
			i = 0;
			while(i < calc.blankSpan.length) {
				calc.workSpan = teasp.util.time.sliceTimes(calc.workSpan, calc.blankSpan[i]);
				i++;
			}
		}
	}
	var fixedSpan = [];
	/*
	 * 労働時間を計算
	 */
	if(day.rack.worked || day.rack.paidHolyTime > 0){ // 出退時刻とも入力されているか、有休の時間帯がある
		/*
		 * 除外リストに時間単位休をマージ
		 */
		if(notExclude){
			excludes = day.pattern.restTimes;
			if(calc.blankSpan && calc.blankSpan.length > 0){
				excludes = excludes.concat(calc.blankSpan);
			}
		}else if(config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){
			excludes = teasp.util.time.margeTimeSpans(mixRests.concat(day.rack.hourRests));
			if(calc.blankSpan && calc.blankSpan.length > 0){
				excludes = excludes.concat(calc.blankSpan);
			}
		}else{
			excludes = excludes.concat(day.rack.hourRests);
		}
		/*
		 *
		 */
		var wtList = this.getSlicedList(day, [{ from: calc.calcStartTime, to: calc.calcEndTime }], excludes, config, common, notExclude);

		var ht = 0;
		if(day.rack.flexHalfDayTime){
			ht += day.rack.paidHolyTime;
		}
		for(i = 0 ; i < wtList.length ; i++){
			var w = wtList[i];
			if(w.holy){
				if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
					ht += teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([w],
							teasp.util.time.margeTimeSpans(day.rack.freeHolySpans.concat(day.rack.unpaidRests))));
				}else{
				// 半休取得時は無給半休の時間をhtに加算しないようにする（#9084）
				// ※ #9147対応時に半休に限らず freeHolySpans はすべて加算しないように見直す（1967-1974行目も同時に見直す）
				if(day.rack.holidayJoin && day.rack.holidayJoin.flag && day.rack.holidayJoin.flag != 3){
					ht += teasp.logic.EmpTime.getSpanTime(teasp.util.time.excludeRanges([w], day.rack.freeHolySpans));
				}else{
					ht += (w.to - w.from);
				}
				}
				fixedSpan.push({ from: w.from, to: w.to });
			}
		}
		var spanSt = (typeof(calc.calcStartTime) == 'number' ? calc.calcStartTime : day.rack.fixStartTime);
		calc.workInFixedTime = (day.rack.flexHalfDayTime || ht <= day.rack.fixTime ? ht : day.rack.fixTime);
		var dayWorkTime = 0;
		var fwt = 0;
		for(i = 0 ; i < wtList.length ; i++){
			var w = wtList[i];
			var t = (w.to - w.from);
			if(w.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){ // 法定休日である
				if(!w.holy){
					outSpan.push({ from: w.from, to: w.to });
				}
				if(day.workFlag || day.autoLH){ // 自動判定による法定休日
					fwt += t;     // 所定労働時間計算の調整用の変数に値をセット
				}
				calc.workHolidayTime += t; // 法定休日労働時間を加算
				w.lhoTime += t;
				if(t > 0){
					calc.workHolidaySpan.push({ from: (w.to - t), to: w.to });
				}
			}else{
				if(!w.holy){
					if(this.isFixDay(day)){
						var cs = Math.min(fst0, fst2);
						var ce = Math.max(fet0, fet2);
						if(day.pattern.useDiscretionary && calcType == teasp.constant.C_DISC){ // 裁量オンで裁量の計算をする場合
							cs = calc.calcStartTime;
							ce = calc.calcEndTime;
						}
						teasp.logic.EmpTime.entrySpan(fixSpan, outSpan, cs, ce, w);
					}else{
						outSpan.push({ from: w.from, to: w.to });
					}
				}
				var zanft = 0, // 総労働時間があと何分で所定労働時間に達するか
					zanlt = 0, // 実労働時間があと何分で法定労働時間に達するか
					zan50 = 0; // 実労働時間があと何分で週平均50H基準時間に達するか
				var chk50 = true;
				if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX   // フレックスタイム制
				&& calcType != teasp.constant.C_FREAL
				&& calcType != teasp.constant.C_FDISC){
					var tempFixTime = period.fixTime - period.paidHolyTime;
					zanft = Math.max((tempFixTime      - period.workTime     ), 0);
					zanlt = Math.max((period.legalTime - period.workLegalTime), 0);
					zan50 = Math.max((period.avg50week - period.workAvg50week), 0);
				}else{
					zanft = Math.max((day.rack.fixTime - (calc.workInFixedTime + fwt)), 0);
					zanlt = Math.max((dayLegal - calc.workLegalTime), 0);
					chk50 = false;
				}
				var ft = Math.min(t, zanft);  // t のうち所定時間内労働は何分か
				var lt = Math.min(t, zanlt);  // t のうち法定時間内実労働は何分か
				var t5 = (period.avg50week ? Math.min(t, zan50) : 0);  // t のうち週平均50H内労働は何分か
				var xt = t;
				if(chk50 && period.avg50week && t5 > 0 && !w.holy){
					period.workAvg50week += t5;
				}
				if(chk50 && period.avg50week && t5 < xt && !w.holy){
					var over50 = (xt - t5); // 週平均50H超過時間
					calc.settlementTime += over50;
					// 当月清算時間を赤表示する（＝1.25の時間＝所定労働に含めない）
					calc.workLegalOutOverTime += over50; // 法定時間外労働時間に加算
					if(calc.workLegalOutOverSpan.length <= 0){
						calc.workLegalOutOverSpan.push({ from: w.to - over50, to: w.to });
					}else{
						calc.workLegalOutOverSpan[0].to = w.to;
					}
					if(t5 < ft){
						ft = t5;
					}
					if(t5 < lt){
						lt = t5;
					}
					xt -= over50;
				}
				if(ft > 0){
					if(!w.holy){
						w.fixTime += ft;
						calc.workInFixedTime += ft; // 所定労働時間に加算
						dayWorkTime          += ft; // 所定実労働時間に加算
						period.workTime      += ft;
					}
					if(!calc.workInFixedSpan){
						calc.workInFixedSpan   = { from: w.from, to: w.from + ft };
					}else{
						calc.workInFixedSpan.to = w.from + ft;
					}
					if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX  // フレックスタイム制
					&& calcType != teasp.constant.C_FREAL
					&& calcType != teasp.constant.C_FDISC){
						if(period.legalTime < period.workTime){         // 所定労働時間が法定労働時間を超えている
							var pt = (period.workTime - period.legalTime);
							pt = (ft < pt ? ft : pt);
							if(!w.holy){
								calc.workChargeSpan.push({ from: (w.from + ft - pt), to: w.from + ft });
								calc.workChargeTime += pt;
							}
							xt -= pt;
						}
					}else if(config.workSystem == teasp.constant.WORK_SYSTEM_FIX){
						if(dayLegal < dayWorkTime){         // 所定内実労働時間が法定労働時間を超えている
							var pt = (dayWorkTime - dayLegal);
							pt = (ft < pt ? ft : pt);
							if(!w.holy){
								calc.workChargeSpan.push({ from: (w.from + ft - pt), to: w.from + ft });
								calc.workDayChargeTime += pt;
							}
							xt -= pt;
						}
					}
				}
				if(lt > 0){
					if(!w.holy){
						calc.workLegalTime   += lt; // 法定時間内労働時間に加算
						period.workLegalTime += lt;
						period.workLegalTimeWeek += lt;
						w.extTime += lt;
						if(!calc.workLegalSpan){
							calc.workLegalSpan = { from: spanSt, to: w.from + lt };
						}else{
							calc.workLegalSpan.to = w.from + lt;
						}
					}
					if(config.workSystem != teasp.constant.WORK_SYSTEM_FLEX){    // フレックスタイム制以外
						var llt = lt;
						if(period.legalTimeWeek && period.legalTimeWeek < period.workLegalTimeWeek){
							var pt = (period.workLegalTimeWeek - period.legalTimeWeek);
							pt = (lt < pt ? lt : pt);
							if(!w.holy){
								calc.workChargeSpan.push({ from: (w.from + lt - pt), to: w.from + lt });
								calc.workChargeTime += pt;
								calc.workChargeTime40H += pt;
								period.workLegalTime -= pt;
								llt -= pt;
							}
						}
						if(period.legalTime < period.workLegalTime){
							var pt = (period.workLegalTime - period.legalTime);
							pt = (llt < pt ? llt : pt);
							if(!w.holy){
								calc.workChargeSpan.push({ from: (w.from + llt - pt), to: w.from + llt });
								calc.workChargeTime += pt;
								if(config.variablePeriod == 0){
									calc.workChargeTime40H += pt;
								}
							}
						}
					}
				}
				if(lt < xt && !w.holy){
					calc.workLegalOutOverTime += (xt - lt); // 法定時間外労働時間に加算
					w.outTime += (xt - lt);
					if(calc.workLegalOutOverSpan.length <= 0){
						calc.workLegalOutOverSpan.push({ from: w.to - (xt - lt), to: w.to });
					}else if(calc.workLegalOutOverSpan[0].to == w.to){
						calc.workLegalOutOverSpan[0].from -= (xt - lt);
					}else{
						calc.workLegalOutOverSpan[0].to = w.to;
					}
				}
			}
			if(!w.holy){
				if(!day.pattern.igonreNightWork){
					calc.workNightTime += this.getSpanOnRanges(w, nightWorkObjs); // 深夜時間帯を抽出
				}
				calc.workRealTime   += t; // 実労働時間
				if(this.isFixDay(day)){
						if(w.night){
							calc.weekDayNightLegalFixTime += w.fixTime;
							calc.weekDayNightLegalExtTime += (w.extTime - w.fixTime);
							calc.weekDayNightLegalOutTime += w.outTime;
						}else{
							calc.weekDayDayLegalFixTime   += w.fixTime;
							calc.weekDayDayLegalExtTime   += (w.extTime - w.fixTime);
							calc.weekDayDayLegalOutTime   += w.outTime;
						}
				}else if(w.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY || w.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
					if(w.night){
						calc.weekEndNightLegalTime    += w.extTime;
						calc.weekEndNightLegalOutTime += w.outTime;
					}else{
						calc.weekEndDayLegalTime      += w.extTime;
						calc.weekEndDayLegalOutTime   += w.outTime;
					}
				}
				if(w.night){
					calc.holidayNightTime += w.lhoTime;
				}else{
					calc.holidayDayTime   += w.lhoTime;
				}
			}
		}
		/*
		 * 総労働時間は実労働時間＋有休時間－休暇控除時間
		 */
		var holidayDeductionTime = day.rack.holidayDeductionTime;
		if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
			holidayDeductionTime = 0;
		}
		calc.workWholeTime = calc.workRealTime + (notExclude ? (day.rack.adjustHolyTime || 0) : (day.rack.paidHolyTime - holidayDeductionTime));
		calc.wwt = calc.workWholeTime + (day.rack.tempHolyTime || 0) + holidayDeductionTime;
		/*
		 * 休憩時間は裁量労働計算の時は所定の休憩時間で固定
		 */
		if(day.pattern.useDiscretionary && calcType == teasp.constant.C_DISC){
			mixRests = day.pattern.restTimes;
		}
		var inner = { from: fst, to: fet2 };
		var restraint = 0;
		var deemRestTime = 0; // みなし所定休憩
		var fixRestInFixTime = 0; // 所定勤務時間内かつ出社－退社間の所定休憩時間
		var takeRestInFixTime = 0; // 所定勤務時間内かつ出社－退社間に実際に取った休憩時間
		if(day.rack.worked){
			var wo = [{ from: calc.calcStartTime, to: calc.calcEndTime }];
			// 労働と認められない時間帯を除く
			i = 0;
			while(i < calc.skipSpan.length) {
				wo = teasp.util.time.sliceTimes(wo, calc.skipSpan[i]);
				i++;
			}
			calc.restTime = 0;
			for(i = 0 ; i < wo.length ; i++){
				calc.restTime += teasp.util.time.rangeTime(wo[i], mixRests);
			}
			if(!day.rack.fixTime){
				restraint = (inner.to - inner.from) - teasp.util.time.rangeTime(inner, day.rack.hourRests); // 拘束時間を取得、時間単位休の時間帯は差し引く。
			}else{
				restraint = (fet0 - fst0) - teasp.util.time.rangeTime({ from: fst0, to: fet0 }, day.rack.hourRests); // 拘束時間を取得、時間単位休の時間帯は差し引く。
			}
			// 所定勤務時間内で、取ってない所定休憩の合計時間を得る（残業と控除の相殺をしない設定のとき必要）
			// ※ ここでの「取ってない所定休憩」とは{みなし所定休憩時間}から{所定時間内の設定の所定休憩を上限とする取得済みの所定休憩}を引いた時間のことを差す。
			// ※「みなし所定休憩」とは始業～終業の間、働かなくても良い（働かなくても所定労働時間に達する）時間のことを指す。
			//    (終業時刻－始業時刻)－(設定の所定労働時間)の計算で得られる
			//  (例) 始業:9:00、終業:17:45、所定休憩:12:00-13:00、所定労働時間:7:15 であれば、みなし所定休憩は1:30
			//       休憩を2:00取ったとすると、取ってない所定休憩=0:30
			//       休憩を0:15取ったとすると、取ってない所定休憩=1:15
			if(config.deductWithFixedTime){ // 残業と控除の相殺をしない設定
				deemRestTime = Math.max(0, (fet0 - fst0) - day.rack.fixTime); // 「みなし所定休憩」時間を得る(1)
				if(deemRestTime > 0){
					var rests = (day.pattern.restTimes || []); // 所定休憩
					if(fst0 < calc.calcStartTime){ // 遅刻した場合、始業～出社の間にある所定休憩を(1)から差し引く
						deemRestTime -= teasp.util.time.rangeTime({ from:fst0, to:calc.calcStartTime }, rests);
						if(hoten && hoten.lateRx){
							deemRestTime -= hoten.lateRx;
						}
					}
					if(calc.calcEndTime < fet0){ // 早退した場合、退社～終業の間にある所定休憩を(1)から差し引く
						deemRestTime -= teasp.util.time.rangeTime({ from:calc.calcEndTime, to:fet0 }, rests);
						if(hoten && hoten.earlyRx){
							deemRestTime -= hoten.earlyRx;
						}
					}
					if(deemRestTime > 0){
						// 所定勤務時間内での出社～退社の時間帯を得る(2)
						var ws = [{from:Math.max(fst0, calc.calcStartTime), to:Math.min(fet0, calc.calcEndTime)}];
						fixRestInFixTime  = teasp.logic.EmpTime.getSpanTime(teasp.util.time.includeRanges(ws, rests));            // (2)内の所定休憩→(3)
						takeRestInFixTime = teasp.logic.EmpTime.getSpanTime(teasp.util.time.includeRanges(ws, (mixRests || []))); // (2)内に取った休憩→(4)
						offsetFix = denyRestTime = Math.max(deemRestTime - Math.min(fixRestInFixTime, takeRestInFixTime), 0); // (1)－((3)と(4)の小さい方)＝(取ってない所定休憩)
					}
				}
				if(day.rack.hourRests.length){ // 時間単位休を取っている
					// 所定勤務時間内での出社～退社の時間帯を得る
					var ws = [{from:Math.max(fst0, calc.calcStartTime), to:Math.min(fet0, calc.calcEndTime)}];
					// 所定勤務時間内かつ出社～退社外の時間に取った時間単位休を得る
					var outHourRests = teasp.util.time.includeRanges([{from:fst0, to:fet0}], teasp.util.time.excludeRanges(day.rack.hourRests, ws));
					if(outHourRests.length){
						var r0 = teasp.logic.EmpTime.getSpanTime(teasp.util.time.includeRanges(outHourRests, (day.pattern.restTimes || []))); // 所定休憩
						var r1 = teasp.logic.EmpTime.getSpanTime(teasp.util.time.includeRanges(outHourRests, (mixRests || []))); // 実際の休憩
						if(r1 < r0){
							denyRestTime += (r0 - r1); // 出退社外の時間の時間単位休内の取ってない所定休憩の時間を加算する
						}
					}
				}
			}
		}
		// 所定休憩時間の計算
		// (1) 始業～終業の時間帯にある所定休憩の時間を取得
		var inner2 = { from: fst0, to: fet0 };
		var fr = teasp.util.time.rangeTime(inner2, (day.pattern.restTimes || []));
		var restCheck = false;
		var rcv = 0;
		// (2) 所定休憩の設定なしの場合に限り、勤務時間毎の所定休憩時間を取得
		if((day.pattern.restTimes || []).length <= 0){
			var rcs = this.pouch.getRestTimeCheck(); // 法定休憩時間のチェック
			for(i = 0 ; i < rcs.length ; i++){
				if(rcs[i].check){
					restCheck = true;
					if(rcs[i].workTime < restraint){ // 「終業時刻－始業時刻－（時間単位休）」と比較
						rcv = Math.max(rcv, rcs[i].restTime);
					}
				}
			}
			// 所定休憩の設定なしの場合は、取ってない所定休憩を、みなし所定休憩から実際に取った休憩時間を引いたもの
			if(deemRestTime > 0 && rcv > 0){
				offsetFix = denyRestTime = Math.max(deemRestTime - Math.min(takeRestInFixTime, rcv), 0);
			}
		}
		if(!restCheck){ // 法定休憩時間のチェック＝オフの場合、出社～退社の時間帯にある所定休憩時間を取得
			fr = teasp.util.time.rangeTime({ from: calc.calcStartTime, to: calc.calcEndTime }
							, teasp.util.time.includeRanges([inner2], (day.pattern.restTimes || [])));
		}
		// 始業～終業内（始業～所定時間に達するまでの）所定休憩時間(a)
		var orgRestInner = Math.max(rcv, fr); // 所定休憩時間← (1) と (2) の大きい方
		// 始業～終業内かつ出社～退社内の休憩時間と休憩時間(b)
		// (b)が(a)より多い場合、差分は「私用休憩」になる。
		var sumRestInner = teasp.util.time.rangeTime({ from: calc.calcStartTime, to: calc.calcEndTime }
						, teasp.util.time.includeRanges([inner2], mixRests)); // 全休憩時間（所定の始業時刻～所定に達する終業時刻の範囲）

		// 拘束の所定労働時間＜設定の所定労働時間の場合、控除されない休憩・遅刻・早退時間を得て tmpRestInner に格納（#6610）
		// （後で、暫定の境界時刻でカウントした残業時間のうち、この時間分を所定労働に変換するためにこの時間を得る）
		// 境界時刻～始業時刻の休憩時間（＝控除されない休憩時間）
		if(fst2 < inner2.from){
			tmpRestInner += teasp.util.time.rangeTime({ from: calc.calcStartTime, to: calc.calcEndTime }
			, teasp.util.time.includeRanges([{ from: fst2, to: inner2.from }], mixRests));
		}
		// 終業時刻～境界時刻の休憩時間（＝控除されない休憩時間）
		if(inner2.to < fet2){
			tmpRestInner += teasp.util.time.rangeTime({ from: calc.calcStartTime, to: calc.calcEndTime }
			, teasp.util.time.includeRanges([{ from: inner2.to, to: fet2 }], mixRests));
		}
		// 終業時刻～Min(境界時刻、出社時刻)（＝控除されない遅刻時間）
		if(fet0 < fet2 && fet0 < calc.calcStartTime){
			tmpRestInner += this.getRealTime(fet0, Math.min(fet2, calc.calcStartTime), day.pattern.restTimes);
		}
		// Max(境界時刻、退社時刻)～始業時刻（＝控除されない早退時間）
		if(fst2 < fst0 && calc.calcEndTime < fst0){
			tmpRestInner += this.getRealTime(Math.max(fst2, calc.calcEndTime), fst0, day.pattern.restTimes);
		}

		/*
		 * 遅刻・早退・私用外出の集計
		 */
		if(day.rack.worked                               // 出退打刻ともあり
		&& !day.pattern.useDiscretionary                 // 裁量労働ではない
		&& normalDay                                     // 平日である,または休日出勤の勤怠規則は平日に準拠する設定
		&& (!day.rack.flexFlag || day.rack.useCoreTime)  // フレックスタイム制でないか非フレックス適用日またはコアタイムがある
		){
			var fxTime = (day.rack.fixTime || day.pattern.standardFixTime); // 所定労働時間（休日出勤の所定労働時間は day.pattern.standardFixTime）
			var actFxTime = (day.rack.actFixTime || day.rack.fixTime);     // 計算上の所定労働時間
			var implicitRest = (day.rack.actFixTime > day.rack.fixTime) ? (day.rack.actFixTime - day.rack.fixTime) : 0; // 物理的な所定労働時間＞設定の所定労働時間の場合、差を得る
			var zanFxTime = fxTime - (day.rack.holyTime || 0);
			if(day.rack.holidayJoin && day.rack.holidayJoin.flag && day.rack.holidayJoin.flag != 3){ // 半休取得日
				var extSpans = dojo.clone(day.rack.holySpans).concat(day.pattern.restTimes || []);
				var halfSpans = teasp.util.time.excludeRanges([{from: day.rack.fixStartTime, to: day.rack.fixEndTime}], extSpans);
				actFxTime = teasp.logic.EmpTime.getSpanTime(halfSpans); // 半休取得後の所定労働時間
			}
			var lateTime = (calc.calcStartTime > fst ? this.getRealTime(fst, Math.min(fet, calc.calcStartTime), extRests) : 0);  // 出社時刻が始業時刻より遅い場合、差分を得る
			if(lateStart && teasp.constant.STATUS_FIX.contains(lateStart.status)){ // 遅刻申請ありかつ有効
				if(lateStart.ownReason && lateStart.treatDeduct){ // （自己都合かつ遅刻取扱いが０以外）または遅刻申請の時刻より遅い出社の場合、控除の対象
					calc.lateTime = lateTime;
				}else{
					if(calc.latePlus){
						calc.lateTime = calc.latePlus;
					}
					if(lateStart.treatDeduct < 2){ // 遅刻取り扱いが 0 or 1 の場合、取ってない所定休憩時間の値を調整する
						denyRestTime -= (lateTime - calc.lateTime);
					}
				}
			}else{
				calc.lateTime = lateTime;
			}
			if(calc.lateTime > actFxTime && !day.rack.flexFlag){ // 遅刻時間は計算上の所定労働時間を上限とする（フレックスタイム制以外）
				calc.lateTime = actFxTime;
			}else if(day.rack.coreTime && calc.lateTime > day.rack.coreTime){ // 遅刻時間はコア時間を上限とする（フレックスタイム制）
				calc.lateTime = day.rack.coreTime;
			}
			var earlyTime = (calc.calcEndTime < fet ? this.getRealTime(Math.max(fst, calc.calcEndTime), fet, extRests) : 0); // 退社時刻が終業時刻より早い場合、差分を得る
			if(earlyEnd && teasp.constant.STATUS_FIX.contains(earlyEnd.status)){ // 早退申請ありかつ有効
				if(earlyEnd.ownReason && earlyEnd.treatDeduct){ // （自己都合かつ早退取扱いが０以外）または早退申請の時刻より早い退社の場合、控除の対象
					calc.earlyTime = earlyTime;
				}else{
					if(calc.earlyPlus){
						calc.earlyTime = calc.earlyPlus;
					}
					if(earlyEnd.treatDeduct < 2){ // 早退取り扱いが 0 or 1、取ってない所定休憩時間の値を調整する
						denyRestTime -= (earlyTime - calc.earlyTime);
					}
				}
			}else{
				calc.earlyTime = earlyTime;
			}
			if(calc.earlyTime > actFxTime && !day.rack.flexFlag){ // 早退時間は計算上の所定労働時間を上限とする（フレックスタイム制以外）
				calc.earlyTime = actFxTime;
			}else if(day.rack.coreTime && calc.earlyTime > day.rack.coreTime){ // 早退時間はコア時間を上限とする（フレックスタイム制）
				calc.earlyTime = day.rack.coreTime;
			}
			if(sumRestInner > orgRestInner){ // 私用休憩があり、トータルの休憩時間が所定休憩時間を超えている
				calc.privateInnerTime = sumRestInner - orgRestInner;
			}
			if(config.deductWithFixedTime && fxTime){ // 残業と控除の相殺をしない設定
				calc.lateLostTime         = calc.lateTime;
				calc.earlyLostTime        = calc.earlyTime;
				calc.privateInnerLostTime = calc.privateInnerTime;
				if(day.rack.holidayJoin && day.rack.holidayJoin.flag && day.rack.holidayJoin.flag != 3 // 半休取得日
				&& (actFxTime - implicitRest) > zanFxTime){
					// 半休を取り、{拘束時間から半休適用時間を除いた時間}と、{所定労働時間から半休時間を除いた時間}とのギャップがある場合、
					// 遅刻・早退・私用外出は、{拘束時間から半休適用時間を除いた時間}を対象として計算して、
					// それぞれが控除になるかどうかは、労働時間が{所定労働時間から半休時間を除いた時間}に満たない分に対して行いたいので、
					// そうなるように、便宜上「取ってない所定休憩時間」にこのギャップ分を加算しておく。
					denyRestTime += (actFxTime - zanFxTime);
				}
				// 控除時間から取ってない所定休憩時間を差し引く
				if(denyRestTime > 0){
					if(this.pouch.isAdjustLateTimeEarlyTime()){ // 退社後または出社前に時間単位休や半休がある時、定時で所定勤務に達していれば遅刻・早退時間をカウントしない
						var t = Math.min(calc.privateInnerLostTime, denyRestTime);
						if(t > 0){
							calc.privateInnerLostTime -= t;
							denyRestTime -= t;
						}
						t = Math.min(calc.earlyLostTime, denyRestTime);
						if(t > 0){
							calc.earlyLostTime -= t;
							denyRestTime -= t;
						}
						t = Math.min(calc.lateLostTime, denyRestTime);
						if(t > 0){
							calc.lateLostTime -= t;
							denyRestTime -= t;
						}
					}else{
						var t = Math.min(calc.lateLostTime, denyRestTime);
						if(t > 0){
							calc.lateLostTime -= t;
							denyRestTime -= t;
						}
						t = Math.min(calc.earlyLostTime, denyRestTime);
						if(t > 0){
							calc.earlyLostTime -= t;
							denyRestTime -= t;
						}
						t = Math.min(calc.privateInnerLostTime, denyRestTime);
						if(t > 0){
							calc.privateInnerLostTime -= t;
							denyRestTime -= t;
						}
					}
				}
				if(config.workSystem != teasp.constant.WORK_SYSTEM_FLEX
				&& day.dayType == teasp.constant.DAY_TYPE_NORMAL){
					totalLos = calc.lateLostTime + calc.earlyLostTime + calc.privateInnerLostTime; // 控除合計(a)
					if(totalLos > 0){
						var los = (fxTime - calc.workWholeTime);    // 所定労働時間－総労働時間(b) = 不足分
						var add = (totalLos - (los > 0 ? los : 0)); // 控除合計から不足分を除いた時間(c)
						legalWholeTimeAdd += (add > 0 ? add : 0);   // 所定の不足分以外で控除した時間
					}
				}
			}else if(calc.wwt < fxTime){ // 総労働時間が所定労働時間に達してない場合
				var los = fxTime - calc.wwt;
				if(los > 0){
					calc.lateLostTime = Math.min(fxTime, (calc.lateTime < los ? calc.lateTime : los));
					los -= calc.lateLostTime;
				}
				if(los > 0){
					calc.privateInnerLostTime = Math.min(fxTime, (calc.privateInnerTime < los ? calc.privateInnerTime : los));
					los -= calc.privateInnerLostTime;
				}
				if(los > 0){
					calc.earlyLostTime = Math.min(fxTime, (calc.earlyTime < los ? calc.earlyTime : los));
					los -= calc.earlyLostTime;
				}
			}
		}
	}

	/*
	 * 法定時間内残業時間は（法定時間内労働時間＋有休時間）と所定内労働時間の差
	 */
	var legalWholeTime = 0;
	if(notExclude){
		legalWholeTime = (calc.workLegalTime + legalWholeTimeAdd);
	}else{
		legalWholeTime = (calc.workLegalTime + day.rack.paidHolyTime + legalWholeTimeAdd);
	}
	calc.workLegalOverTime = Math.min(calc.workWholeTime, (calc.workInFixedTime < legalWholeTime ? (legalWholeTime - calc.workInFixedTime) : 0));
	calc.workDayChargeTime -= legalWholeTimeAdd;
	if(calc.workDayChargeTime < 0){
		calc.workDayChargeTime = 0;
	}
	calc.workChargeTime += calc.workDayChargeTime;
	if(calc.workLegalOverTime > 0 && calc.workLegalSpan){
		calc.workLegalOverSpan.push(dojo.clone(calc.workLegalSpan));
		if(calc.workInFixedTime > 0 && calc.workInFixedSpan){
			calc.workLegalOverSpan[0].from = calc.workInFixedSpan.to;
		}
	}

	if(config.workSystem != teasp.constant.WORK_SYSTEM_FLEX && config.deductWithFixedTime){ // 残業と控除の相殺をしない設定
		var fxzan = day.rack.fixTime;
		var ff = teasp.logic.EmpTime.getSpanTime(fixSpan);
		if(!day.pattern.useDiscretionary || calcType != teasp.constant.C_DISC){ // 裁量以外
			if(denyRestTime > 0){
				offsetFix -= Math.min(denyRestTime, offsetFix);
			}
			if(ff < offsetFix){
				offsetFix = ff;
			}
			fxzan = Math.min(ff + tmpRestInner + offsetFix, fxzan - totalLos - day.rack.paidHolyTime - (day.rack.tempHolyTime || 0));
		}
		teasp.logic.EmpTime.adjustSpans(fixSpan, outSpan, fxzan, {from: (tmpRestInner ? 0 : fst0) ,to: (tmpRestInner ? 2880 : fet0)});
		fxzan = teasp.logic.EmpTime.getSpanTime(fixSpan);
		if(fixSpan.length > 0 || outSpan.length > 0){
			var ot = teasp.logic.EmpTime.getSpanTime(outSpan);
			var realt = teasp.logic.EmpTime.getSpanTime(fixSpan) + ot;
			realt -= calc.workHolidayTime;
			calc.workLegalOverTime = Math.max(0, (Math.min(dayLegal, realt) - fxzan));
		}
		if(calc.workHolidaySpan.length){ // 法定休日労働があればダブルカウントされないように除く
			outSpan = teasp.util.time.excludeRanges(outSpan, calc.workHolidaySpan);
			fixSpan = teasp.util.time.excludeRanges(fixSpan, calc.workHolidaySpan);
		}
		var newc = teasp.logic.EmpTime.recalcSapn(outSpan, fixSpan, calc.workLegalOverTime, calc.workLegalOutOverTime, calc.workChargeTime);
		calc.workInFixedSpan      = newc.workInFixedSpan;
		calc.workLegalOverSpan    = newc.workLegalOverSpan;
		calc.workLegalOutOverSpan = newc.workLegalOutOverSpan;
		calc.workChargeSpan       = newc.workChargeSpan;
	}
	// 所定内労働時間の再計算
	if(calc.workInFixedSpan){
		var tempSpan = day.rack.worked ? [calc.workInFixedSpan] : [];
		calc.workInFixedTime = teasp.logic.EmpTime.getSpanTime(
				teasp.util.time.excludeRanges(
					teasp.util.time.margeTimeSpans(tempSpan.concat(day.rack.paidHolySpans)),
					teasp.util.time.margeTimeSpans(mixRests.concat(day.rack.unpaidRests).concat(day.rack.worked ? [] : day.pattern.restTimes))
				));
	}else{
		calc.workInFixedTime = 0;
	}
	i = 0;
	while(i < calc.blankSpan.length) {
		calc.workLegalOverSpan    = teasp.util.time.sliceTimes(calc.workLegalOverSpan    , calc.blankSpan[i]);
		calc.workLegalOutOverSpan = teasp.util.time.sliceTimes(calc.workLegalOutOverSpan , calc.blankSpan[i]);
		calc.workChargeSpan       = teasp.util.time.sliceTimes(calc.workChargeSpan       , calc.blankSpan[i]);
		i++;
	}
	// 時間帯有休等を取った場合、その時間帯は所定労働時間に振り分けられているが、
	// 法定時間内残業、法定時間外残業の時間帯に含まれた状態になっている可能性が
	// あるため（ロジックの都合上）、ここで除外する。
	calc.workLegalOverSpan    = teasp.util.time.excludeRanges(calc.workLegalOverSpan   , fixedSpan);
	calc.workLegalOutOverSpan = teasp.util.time.excludeRanges(calc.workLegalOutOverSpan, fixedSpan);
	// 法定時間外残業時間の再計算
	if(calc.workLegalOutOverSpan){
		var spans = calc.workLegalOutOverSpan;
		calc.workLegalOutOverTime = 0;
		for(i = 0 ; i < spans.length ; i++){
			var t = (excludes && excludes.length > 0 ? teasp.util.time.rangeTime(spans[i], teasp.util.time.margeTimeSpans(excludes)) : 0);
			calc.workLegalOutOverTime += (spans[i].to - spans[i].from) - t;
		}
	}else{
		calc.workLegalOutOverTime = 0;
	}
	if(config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER){
		// 管理監督者は割増時間をカウントしないためクリア
		calc.workChargeTime       = 0;
		calc.workDayChargeTime    = 0;
		calc.workChargeSpan       = [];
	}else if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
		// フレックスタイム制は控除時間をクリアする(#7568)
		calc.lateLostTime         = 0;
		calc.privateInnerLostTime = 0;
		calc.earlyLostTime        = 0;
	}
	// 裏オプション
	// 出退社時刻の外に半休か時間単位休がある場合、
	// 遅刻・早退・私用外出時間が、始業～終業の実労働＋有休が所定に満たない分に釣り合うように調整する
	if(this.pouch.isAdjustLateTimeEarlyTime() // 退社後または出社前に時間単位休や半休がある時、定時で所定勤務に達していれば遅刻・早退時間をカウントしない
	&& (config.workSystem == teasp.constant.WORK_SYSTEM_FIX || config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE) // 固定または変形
	&& !day.pattern.useDiscretionary // 裁量ではない
	&& this.existPaidRestOutsideWork(day)){ // 出退社時刻の外に半休か時間単位休がある
		var workInFix = teasp.logic.EmpTime.getSpanTime(fixSpan);
		var zbuf = day.date + ' fxzan=' + teasp.util.time.timeValue(workInFix);
		for(var zz = 0 ; zz < fixSpan.length ; zz++){
			zbuf += (' ' + teasp.util.time.timeValue(fixSpan[zz].from) + '-' + teasp.util.time.timeValue(fixSpan[zz].to));
		}
		console.log(zbuf);
		var workLost = Math.max(day.rack.fixTime - (workInFix + day.rack.holyTime), 0); // 所定労働未達分(A)
		var ngt = calc.lateTime + calc.earlyTime + calc.privateInnerTime; // 遅刻、早退、私用外出の合計(B)
		if(workLost < ngt){ // (A)<(B)の場合、(A)==(B)になるまで、私用外出→早退→遅刻の順で減算する
			var nz = Math.min(calc.privateInnerTime, ngt - workLost);
			if(nz > 0){
				calc.privateInnerTime -= nz;
				if(calc.privateInnerLostTime > calc.privateInnerTime){ // 保険
					calc.privateInnerLostTime = calc.privateInnerTime;
				}
				ngt -= nz;
			}
			var ny = Math.min(calc.earlyTime, ngt - workLost);
			if(ny > 0){
				calc.earlyTime -= ny;
				if(calc.earlyLostTime > calc.earlyTime){ // 保険
					calc.earlyLostTime = calc.earlyTime;
				}
				ngt -= ny;
			}
			var nx = Math.min(calc.lateTime, ngt - workLost);
			if(nx > 0){
				calc.lateTime -= nx;
				if(calc.lateLostTime > calc.lateTime){ // 保険
					calc.lateLostTime = calc.lateTime;
				}
				ngt -= nx;
			}
		}
	}

	/*
	 * 残業時間
	 */
	calc.workOverTime = calc.workLegalOverTime + calc.workLegalOutOverTime;
	/*
	 * 出勤せず、休暇しか取ってない日は、残業のカウントをクリア
	 */
	if(!day.rack.worked && day.rack.paidHolySpans.length > 0){
		calc.workLegalOverTime    = 0;
		calc.workLegalOutOverTime = 0;
		calc.workOverTime         = 0;
		calc.workChargeTime       = 0;
		calc.workDayChargeTime    = 0;
		calc.workLegalOverSpan    = [];
		calc.workLegalOutOverSpan = [];
		calc.workChargeSpan       = [];
	}
	/*
	 * 公用外出時間
	 */
	calc.awayTime = teasp.logic.EmpTime.getSpanTime(day.rack.awayTimes || []);
	/*
	 * 深夜時間帯リストをマージ
	 */
	for(i = 0 ; i < nightWorkObjs.length ; i++){
		var o = nightWorkObjs[i].span;
		if(o){
			calc.workNightSpans.push(o);
		}
	}
	// 深夜労働の時間帯から休憩時間を除外
	if(calc.workNightSpans.length > 0 && calcType == teasp.constant.C_REAL){
		var spans = dojo.clone(calc.workNightSpans);
		var blanks = (mixRests || []).concat(calc.blankSpan || []);
		for(i = 0 ; i < blanks.length ; i++){
			spans = teasp.util.time.sliceTimes(spans, blanks[i]);
		}
		calc.realWorkNightSpans = spans;
	}
	if(calc.startTimeOrg){
		calc.startTime = calc.startTimeOrg;
	}
	if(calc.endTimeOrg){
		calc.endTime = calc.endTimeOrg;
	}
	// 裁量労働制の場合、実労働時間、実休憩時間は、補填分を除いておく
	if(day.pattern.useDiscretionary && calcType == teasp.constant.C_REAL){
		if(typeof(calc.workNetTime) == 'number'){
			calc.workRealTime = calc.workNetTime;
		}
		if(calc.restTime > 0){
			calc.restTime = Math.max(calc.restTime - (calc.hotenRest || 0), 0);
		}
	}
	// 変形労働制1ヶ月以上かつ旧計算ロジックオンの場合、追加割増労働時間がカウントされないようにする
	var xm = this.getMonthByDate(this.pouch.dataObj.months, day.date);
	if(this.pouch.isUseLegacyIrregularLogicUntil(xm) && config.variablePeriod > 0){
		calc.workChargeTime40H = calc.workChargeTime;
	}
	day[calcType] = this.calculateEmpDayRes(day, calc, period, config, common, calcType);
};

/**
 * 勤怠計算結果の補正
 */
teasp.logic.EmpTime.prototype.calculateEmpDayRes = function(day, calc, period, config, common, calcType){
	if(config.workSystem == teasp.constant.WORK_SYSTEM_MANAGER // 管理監督者
	&& calcType == teasp.constant.C_DISC){
		// 残業がカウントされていたら0にする
		// （半休取得時に残業をカウントする可能性があるため）
		if(calc.workOverTime > 0){
			calc.workWholeTime -= calc.workOverTime;
			calc.workRealTime  -= calc.workOverTime;
			if(calc.workWholeTime < 0){ calc.workWholeTime = 0; }
			if(calc.workRealTime  < 0){ calc.workRealTime = 0;  }
			calc.workOverTime = 0;
			calc.workLegalOutOverTime = 0;
			calc.workLegalOverTime = 0;
		}
		calc.workLegalOverSpan = [];
		calc.workLegalOutOverSpan = [];
		calc.workHolidaySpan = [];
		if(day.rack.worked && this.isFixDay(day)){
			calc.calcStartTime = calc.startTime = (typeof(day.startTime) == 'number' ? day.rack.fixStartTime : null);
			calc.calcEndTime   = calc.endTime   = (typeof(day.endTime)   == 'number' ? day.rack.fixEndTime   : null);
			calc.workInFixedSpan = { from:day.rack.fixStartTime, to:day.rack.fixEndTime };
			calc.workSpan = [
				{ from:day.rack.fixStartTime, to:day.rack.fixEndTime }
			];
			calc.minasiWorkWholeTime = day.pattern.standardFixTime;
		}
		// 法定休日労働がカウントされていたら0にする
		// （法定休日の自動判定オンの場合にカウントする可能性があるため）
		if(calc.workHolidayTime > 0){
			calc.workHolidayTime = 0;
		}
	}
	return calc;
};
/**
 * 管理監督者用に勤怠計算の値を補正（ベリファイ用）
 * 総労働時間、実労働時間、法定時間内労働、所定内労働について
 * 下記3つの値のうち一番小さい値をその日の値として採用する。
 * (a) day.disc のみなし時間
 * (b) day.real の実時間
 * (c) 当日の所定労働時間
 * ※所定労働時間中に法定休日にまたぐ可能性を考慮して(b)から法定労働時間を差し引いておく
 * @param {Array.<Object>} months 月次情報
 * @param {Array.<Object>} days 日次情報
 * @param {Object} common ※使用しない（差し込み対応用）
 * @param {Array.<string>} dlst 日付リスト
 * @param {Object} periodMap ※使用しない（差し込み対応用）
 */
teasp.logic.EmpTime.prototype.recalcDiscForManager = function(months, days, common, dlst, periodMap){
	for(var i = 0 ; i < dlst.length ; i++){
		var dkey = dlst[i];
		var day = days[dkey];
		if(!day || !this.pouch.isAlive(dkey)){
			continue;
		}
		var month = this.getMonthByDate(months, dkey);
		var config = month.config;
		if(config.workSystem != teasp.constant.WORK_SYSTEM_MANAGER){
			continue;
		}
		var ft = day.rack.fixTime || 0;
		var ht = day.real.workHolidayTime || 0;
		workWholeTime   = Math.min((day.real.workWholeTime   || 0) - ht, day.disc.workWholeTime   || 0);
		workRealTime    = Math.min((day.real.workRealTime    || 0) - ht, day.disc.workRealTime    || 0);
		workLegalTime   = Math.min((day.real.workLegalTime   || 0) - ht, day.disc.workLegalTime   || 0);
		workInFixedTime = Math.min((day.real.workInFixedTime || 0) - ht, day.disc.workInFixedTime || 0);
		day.disc.workRealTime    = Math.min(workRealTime   , ft);
		day.disc.workWholeTime   = day.disc.workRealTime + (day.rack.paidHolyTime || 0);
		day.disc.workLegalTime   = Math.min(workLegalTime  , ft);
		day.disc.workInFixedTime = Math.min(workInFixedTime, ft);
	}
};

/**
 * 日次の情報を構築（２次）.<br/>
 *
 * <div style="margin-left:16px;margin-top:4px;">
 *     obj.days[日付] に追加する要素<br/>
 *     <table style="border-collapse:collapse;border:1px solid #7F8FB1;margin:4px;" border="1">
 *     <tr><td colspan="4">deco</td><td></td></tr>
 *     <tr><td>&nbsp;&nbsp;</td><td colspan="3">ct</td><td></td></tr>
 *     <tr><td></td><td>&nbsp;&nbsp;</td><td>st    </td><td>{number}  </td><td>出社時刻の適正レベル(※)                    </td></tr>
 *     <tr><td></td><td></td><td>et                </td><td>{number}  </td><td>退社時刻の適正レベル(※)                    </td></tr>
 *     <tr><td></td><td></td><td>stan              </td><td>{string}  </td><td>出社時刻の警告                               </td></tr>
 *     <tr><td></td><td></td><td>etan              </td><td>{string}  </td><td>退社時刻の警告                               </td></tr>
 *     <tr><td></td><td></td><td>note              </td><td>{string}  </td><td>出退社時刻の警告                             </td></tr>
 *     <tr><td></td><td colspan="2">title          </td><td>{string}  </td><td>勤務状況に表示する文字列                     </td></tr>
 *     <tr><td></td><td colspan="2">iconClass      </td><td>{string}  </td><td>勤務状況のスタイルシートセレクタ（アイコン） </td></tr>
 *     </table>
 *     <br/>
 *     (※) 適正レベル
 *     <table style="border-collapse:collapse;border:1px solid #7F8FB1;margin:4px;" border="1">
 *     <tr><td>0 </td><td>未入力  </td></tr>
 *     <tr><td>-1</td><td>打刻なし</td></tr>
 *     <tr><td>-2</td><td>出社時刻の場合は入力時刻 &lt; 打刻、退社時刻の場合は入力時刻 &gt; 打刻</td></tr>
 *     <tr><td>-3</td><td>入力時刻 != 打刻（「打刻なしは備考必須にする」がオンの場合のみ発生）</td></tr>
 *     <tr><td>1 </td><td>適正(入力時刻 == 打刻)</td></tr>
 *     </table>
 * </div>
 *
 * @param {Object} common 勤怠共通設定
 * @param {Object} config 勤怠設定情報
 * @param {Object} day 日次情報オブジェクト
 */
teasp.logic.EmpTime.prototype.decorateEmpDay = function(common, config, day){
	var deco = {
		ct        : {
			st: 0,
			et: 0
		},
		title     : '',
		iconClass : '',
		restLack  : false
	};
	if(!this.pouch.isAlive(day.rack.key)){
		day.deco = deco;
		return;
	}

	var dr = day.rack.validApplys.direct;  // 直行・直帰申請
	var hw = (day.rack.validApplys.kyushtu.length > 0 ? day.rack.validApplys.kyushtu[0] : null); // 休日出勤申請
	var directFlag = ((dr && dr.directFlag) || (hw && hw.directFlag) || 0);
	var titles = [];

	// 出社時刻のチェック
	if(directFlag & 1){
		deco.ct.st = (typeof(day.startTime) != 'number' ? 0 : 2);
	}else{
		if(typeof(day.startTime) != 'number'){ // 未入力
			deco.ct.st = 0;
		}else if(typeof(day.pushStartTime) != 'number'){ // 打刻なし
			deco.ct.st = -1;
		}else if(day.startTime < day.pushStartTime){ // 入力時刻 < 打刻
			deco.ct.st = -2;
		}else if(common.commentIfNoPushTime && day.startTime != day.pushStartTime){ // 「打刻なしは備考必須にする」がオンの場合の入力時刻 != 打刻
			deco.ct.st = -3;
		}else{ // 入力時刻 = 打刻
			deco.ct.st = 1;
		}
	}
	// 退社時刻のチェック
	if(directFlag & 2){
		deco.ct.et = (typeof(day.endTime) != 'number' ? 0 : 2);
	}else{
		if(typeof(day.endTime) != 'number'){ // 未入力
			deco.ct.et = 0;
		}else if(typeof(day.pushEndTime) != 'number'){ // 打刻なし
			deco.ct.et = -1;
		}else if(day.endTime > day.pushEndTime){ // 入力時刻 > 打刻
			deco.ct.et = -2;
		}else if(common.commentIfNoPushTime && day.endTime != day.pushEndTime){ // 「打刻なしは備考必須にする」がオンの場合の入力時刻 != 打刻
			deco.ct.et = -3;
		}else{ // 入力時刻 = 打刻
			deco.ct.et = 1;
		}
	}
	if(deco.ct.st == -1){
		deco.ct.stan = teasp.message.getLabel('tm10001300'); // 打刻なし
	}else if(deco.ct.st < 0){
		deco.ct.stan = teasp.message.getLabel('tm10001310', teasp.util.time.timeValue(day.pushStartTime)); // 打刻 {0}
	}else if(deco.ct.st == 2){
		deco.ct.stan = teasp.message.getLabel('tm10001680', teasp.message.getLabel('tk10004680')); // (直行)
	}
	if(deco.ct.et == -1){
		deco.ct.etan = teasp.message.getLabel('tm10001300'); // 打刻なし
	}else if(deco.ct.et < 0){
		deco.ct.etan = teasp.message.getLabel('tm10001310', teasp.util.time.timeValue(day.pushEndTime)); // 打刻 {0}
	}else if(deco.ct.et == 2){
		deco.ct.etan = teasp.message.getLabel('tm10001680', teasp.message.getLabel('tk10004690')); // (直帰)
	}
	if(deco.ct.st == -1 && deco.ct.et == -1){
		deco.ct.note = teasp.message.getLabel('tm10001320'); // 出退打刻なし
	}else if(deco.ct.stan && deco.ct.etan){
		if(deco.ct.st != 2 && deco.ct.et != 2){
			deco.ct.note = teasp.message.getLabel('tm10001330', deco.ct.stan, deco.ct.etan); // 出社{0}、退社{1}
		}else if(deco.ct.st == 2 && deco.ct.et != 2){
			deco.ct.note = teasp.message.getLabel('tk10004680')                // 直行
					+ teasp.message.getLabel('tm10001570')                     // ・
					+ teasp.message.getLabel('tm10001350', deco.ct.etan);      // 退社{0}
		}else if(deco.ct.st != 2 && deco.ct.et == 2){
			deco.ct.note = teasp.message.getLabel('tm10001340', deco.ct.stan)  // 出社{0}
					+ teasp.message.getLabel('tm10001570')                     // ・
					+ teasp.message.getLabel('tk10004690');                    // 直帰
		}else{
			deco.ct.note = teasp.message.getLabel('tk10004670');               // 直行・直帰
		}
	}else if(deco.ct.stan){
		if(deco.ct.st == 2){
			deco.ct.note = teasp.message.getLabel('tk10004680');               // 直行
		}else{
			deco.ct.note = teasp.message.getLabel('tm10001340', deco.ct.stan); // 出社{0}
		}
	}else if(deco.ct.etan){
		if(deco.ct.et == 2){
			deco.ct.note = teasp.message.getLabel('tk10004690');               // 直帰
		}else{
			deco.ct.note = teasp.message.getLabel('tm10001350', deco.ct.etan); // 退社{0}
		}
	}
    if(typeof(day.startTime) == 'number' && typeof(day.endTime) == 'number' && day.startTime >= day.endTime){
    	deco.invalidTime = true;
    }

	var iconMap = {
		'pp_icon_shukkin' : 'wt-f01',
		'pp_icon_warn'    : 'wt-f02',
		'pp_icon_kekkin'  : 'wt-f03',
		'pp_icon_daiq'    : 'wt-f04',
		'pp_icon_yukyu'   : 'wt-f06',
		'pp_icon_caution' : 'wt-f07'
	};

	if(this.isFixDay(day)){ // 平日
		if(day.rack.plannedHolidayReal){
			titles.push(teasp.message.getLabel('tm10001360')); // 有休計画付与日
			if(day.rack.worked){ // 出退時刻が入力されている
				deco.iconClass = iconMap['pp_icon_shukkin'];
			}else if((deco.ct.st || deco.ct.et) && day.rack.todayDiff < 0){ // 出退時刻の片方が入力されていて、過去日
				deco.iconClass = iconMap['pp_icon_warn'];
			}else{ // 出退時刻が両方未入力なら有休
				deco.iconClass = iconMap['pp_icon_yukyu'];
			}
		}else if(!day.rack.holidayJoin || day.rack.holidayJoin.flag != 3){
			titles.push(teasp.message.getLabel('tm10001370')); // 通常出勤日
			if(day.rack.worked){ // 出退時刻が入力されている
				deco.iconClass = iconMap['pp_icon_shukkin'];
			}else if(day.rack.todayDiff < 0 && !deco.invalidTime){
				deco.iconClass = iconMap['pp_icon_warn'];
				titles.push(teasp.message.getLabel('tm10001380')); // \n出退時刻を入力してください
			}
		}else{
			titles.push(day.rack.holidayJoin.name);
			if(day.rack.holidayJoin.type == teasp.constant.HOLIDAY_TYPE_PAID){            // 有給
				deco.iconClass = iconMap['pp_icon_yukyu'];
			}else if(day.rack.holidayJoin.type == teasp.constant.HOLIDAY_TYPE_FREE){      // 無給
				deco.iconClass = iconMap['pp_icon_kekkin'];
			}else if(day.rack.holidayJoin.type == teasp.constant.HOLIDAY_TYPE_DAIQ){      // 代休
				deco.iconClass = iconMap['pp_icon_daiq'];
			}
		}
	}else{
		var h = (day.rack.validApplys.holidayAll || day.rack.validApplys.holidayAm || day.rack.validApplys.holidayPm);
		if(day.rack.validApplys.kyushtu.length > 0 || teasp.util.time.isInputTime(day.startTime, day.endTime)){
			titles.push(teasp.message.getLabel('tm10001390')); // 休日出勤
			if(day.rack.worked){
				deco.iconClass = iconMap['pp_icon_shukkin'];
			}else if(day.rack.todayDiff < 0){ // 出退時刻の片方が入力されていて、過去日
				deco.iconClass = iconMap['pp_icon_warn'];
			}
		}else if(h && h.holiday.displayDaysOnCalendar){
			titles.push(h.holiday.name);
			if(h.holiday.type == teasp.constant.HOLIDAY_TYPE_PAID){            // 有給
				deco.iconClass = iconMap['pp_icon_yukyu'];
			}else if(h.holiday.type == teasp.constant.HOLIDAY_TYPE_FREE){      // 無給
				deco.iconClass = iconMap['pp_icon_kekkin'];
			}else if(h.holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ){      // 代休
				deco.iconClass = iconMap['pp_icon_daiq'];
			}
		}else{
			if(day.dayType == teasp.constant.DAY_TYPE_NORMAL_HOLIDAY){
				titles.push(teasp.message.getLabel('fixHoliday_label')); // 所定休日
			}else if(day.dayType == teasp.constant.DAY_TYPE_LEGAL_HOLIDAY){
				titles.push(teasp.message.getLabel('legalHoliday_label')); // 法定休日
			}else if(day.dayType == teasp.constant.DAY_TYPE_PUBLIC_HOLIDAY){
				titles.push(teasp.message.getLabel('publicHoliday_label')); // 祝日
			}
		}
	}

	if(day.real.workRealTime > 0){
		// 法定休憩時間のチェック
		var rcs = this.pouch.getRestTimeCheck();
		if(rcs && is_array(rcs)){
			var wt = day.real.workRealTime; // ネット労働時間
			var rt = day.real.restTime;     // 休憩時間
			if(!day.pattern.useDiscretionary){ // 裁量労働以外は労働時間と休憩時間に補填分を含んでいるので差し引く
				wt -= (day.real.hotenWork || 0);
				rt -= (day.real.hotenRest || 0);
			}
			for(var i = 0 ; i < rcs.length ; i++){
				var rc = rcs[i];
				if(rc.check){
					if(wt > rc.workTime && rt < rc.restTime){
						deco.restLack = true;
					}
				}
			}
		}
	}

	var note = (day.note || '');
    var dnote = note;
	if(common.separateDailyNote){
		note += (day.rack.applyNotes || '');
	}

	var rigo = this.pouch.isRemarksRigorous();
    if((rigo && !dnote) || (!rigo && !note)){ // オプションがオンの時は dnote で、オプションがオフの時は note で備考入力の有無を判定
		var warn1 = null;
		if(common.commentIfNoPushTime){ // 打刻なしは備考必須にする
			if(deco.ct.st < 0 || deco.ct.et < 0){
				if(deco.ct.st >= -1 && deco.ct.et >= -1){
					warn1 = teasp.message.getLabel('tm10001400'); // 打刻できなかった理由
				}else{
					warn1 = teasp.message.getLabel('tm10001410'); // 打刻時刻と入力時刻が異なる理由
				}
			}
		}
		var warn2 = '';
		if(common.commentIfAbsence // 控除のある日は備考必須にする
		&& day.hasOwnProperty('real')
		&& (day.real.lateLostTime > 0 || day.real.earlyLostTime > 0 || day.real.privateInnerLostTime > 0)){
			if(day.real.lateLostTime > 0){
				warn2 += teasp.message.getLabel('tm10001420'); // 遅刻
			}
			if(day.real.earlyLostTime > 0){
				warn2 += (warn2 != '' ? teasp.message.getLabel('tm10001570') : '') + teasp.message.getLabel('tm10001430'); // 早退
			}
			if(day.real.privateInnerLostTime > 0){
				warn2 += (warn2 != '' ? teasp.message.getLabel('tm10001570') : '') + teasp.message.getLabel('tm10001440'); // 私用外出
			}
		}
		warn2 = (warn2 == '' ? null : warn2 + teasp.message.getLabel('tm10001450')); // 理由
		if(warn1 || warn2){
			deco.iconClass = iconMap['pp_icon_caution'];
			titles.push((warn2 || warn1) + teasp.message.getLabel('tm10001460')); // を備考に入力してください
		}
	}
    // 退社時刻が24時を超える場合、休日出勤日、翌日に延長勤務禁止＝オンの休暇を取ってないかチェック
    if(typeof(day.endTime) == 'number' && day.endTime > 1440){
//		var cd = this.pouch.getEmpDay(day.rack.key);
//		if(this.pouch.isProhibitAcrossNextDayOfHolidayWork() // 休日出勤時には24:00を超えた勤務を許さない
//		&& cd.isHoliday()
//		&& cd.isExistApply(teasp.constant.APPLY_KEY_KYUSHTU)
//		){
//			deco.prohibitOverNightWork = teasp.message.getLabel('tf10008440', teasp.util.date.formatDate(day.rack.key, 'M/d')); // {0} 休日出勤時には24:00以降の退社時刻を入力できません。
//			deco.iconClass = iconMap['pp_icon_caution'];
//			titles.push(teasp.message.getLabel('tf10008430')); // 休日出勤時には24:00以降の退社時刻を入力できません。
//		}else{
			var nd = this.pouch.getEmpDay(teasp.util.date.addDays(day.rack.key, 1));
			var h = nd.getProhibitOverNightWorkHoliday();
			if(h){
				deco.prohibitOverNightWork = teasp.message.getLabel('tf10008370', teasp.util.date.formatDate(day.rack.key, 'M/d'), h.name); // {0}翌日は{1}のため、24:00を超える勤務はできません。
				deco.iconClass = iconMap['pp_icon_caution'];
				titles.push(teasp.message.getLabel('tf10008360', h.name));
			}
//		}
    }
	// 出社・退社時間を含む休憩は入力できないようにする＝オン
	if(this.pouch.isProhibitBorderRestTime()
	&& teasp.logic.EmpTime.checkBorderRestTime(day.startTime, day.endTime, day.timeTable)){
		deco.prohibitOverNightWork = teasp.message.getLabel('tf10008410', teasp.util.date.formatDate(day.rack.key, 'M/d')); // {0} 休憩時間が出社時刻または退社時刻と重ならないようにしてください。
		deco.iconClass = iconMap['pp_icon_caution'];
		titles.push(teasp.message.getLabel('tf10008400')); // 休憩時間が出社時刻または退社時刻と重ならないようにしてください。
	}
    if(deco.invalidTime){
		deco.iconClass = iconMap['pp_icon_caution'];
		titles.push(teasp.message.getLabel('ci00001030' // {0}が不正です。
				, teasp.message.getLabel('startEndTime_label'))); // 出退社時刻
    }

	if(titles.length){
    	deco.title = titles.join('\n');
    }

	day.deco = deco;
};

/**
 * 期間情報を作成.
 *
 * @param {Array.<Object>} months 勤怠月度オブジェクトの配列
 * @return {Object} 期間情報
 */
teasp.logic.EmpTime.prototype.getPeriodMap = function(months){
	var ppmap = {};
	var pgmap = {};
	for(var i = 0 ; i < months.length ; i++){
		var month = months[i];
		var pp = this.pouch.getPeriodParam(month);
		ppmap[month.monthEx] = pp;
		month.legalTimeOfPeriod = pp.legalTimeOfPeriod;
		month.carryforwardTime = this.pouch.getCarryforwardTime(month.monthEx); // 繰越時間
		month.realWorkTimeWoLH = this.pouch.getRealWorkTimeWoLH(month.monthEx); // 実労働－法休
		month.amountTime       = this.pouch.getAmountTime(month.monthEx);       // 過不足時間
		month.settlementTime   = this.pouch.getSettlementTime(month.monthEx);   // 当月清算時間
		month.periodInfo = {
			startDateOfPeriod: pp.from,
			endDateOfPeriod: pp.to,
			legalTimeOfPeriod: pp.legalTimeOfPeriod,
			elapsedMonth: 1,
			numberOfMonths: 1,
			fixTimeOfPeriod: 0,
			remainFixTimeOfPeriod: 0,
			remainLegalTimeOfPeriod: 0,
			realWorkTimeWoLHPrev: 0,
			settlementTimePrev: 0,
			carryforwardFromPrev: 0
		};
		if(month.periodLen > 1){ // 複数月のフレックスタイム制
			var pg = pgmap[month.periodSd];
			if(!pg){
				pg = pgmap[month.periodSd] = {
					legalTimeOfPeriod: 0,
					fixTimeOfPeriod: 0,
					months: [],
					from: pp.from,
					to: pp.to
				};
			}
			if(month.startDate <= pg.to && pg.from <= month.endDate){
				pg.months.push(month);
			}
		}
	}
	// 複数月のフレックスタイム制の場合、下記の要素を計算する
	// legalTimeOfPeriod  清算期間の残りの法定労働時間（{清算期間の法定労働時間}－{前月までの実労働－法休ー当月清算時間}）
	// fixTimeOfPeriod    清算期間の残りの所定労働時間（{清算期間の所定労働時間}－{前月までの所定労働＋過不足時間ー当月清算時間}）
	// carryforwardFromPrev 前月までの繰越時間（Verify画面用）
	for(var pgkey in pgmap){
		var pg = pgmap[pgkey];
		if(!pg.months.length){
			continue;
		}
		var config = pg.months[0].config;
		// TODO #8748 検討事項
		// 変形でも期間を区切る時はIF文の内容を変える
		if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){
			var sd = pg.months[0].startDate;
			var ed = pg.months[pg.months.length - 1].endDate;
			if(pg.from < sd){
				pg.from = sd;
			}
			if(ed < pg.to){
				pg.to = ed;
			}
		}
		pg.legalTimeOfPeriod = Math.floor(teasp.util.date.daysInRange(pg.from, pg.to) * (config.variablePeriod > 1 ? 40*60 : config.legalTimeOfWeek) / 7);
		var missFlexPeriod = false;
		for(var i = 0 ; i < pg.months.length ; i++){
			var m = pg.months[i];
			pg.fixTimeOfPeriod += m.fixTime;
			m.missFlexPeriod = missFlexPeriod;
			if(this.pouch.isEmptyAmountTime(m.startDate)){
				missFlexPeriod = true;
			}
		}
		var fixTimeOfPeriod   = pg.fixTimeOfPeriod;
		if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){ // フレックスタイム制
			if(fixTimeOfPeriod > pg.legalTimeOfPeriod   // 所定労働時間＞法定労働時間
			&& config.flexLegalWorkTimeOption == '1'){  // 所定が法定を超える場合は所定→法定として扱う
				pg.legalTimeOfPeriod = fixTimeOfPeriod; // 所定労働時間→法定労働時間
			}
		}
		var legalTimeOfPeriod = pg.legalTimeOfPeriod;
		var carryforwardFromPrev = 0;
		var realWorkTimeWoLHPrev = 0;
		var settlementTimePrev   = 0;
		for(i = 0 ; i < pg.months.length ; i++){
			var m = pg.months[i];
			m.periodInfo.startDateOfPeriod       = this.pouch.getStartDateOfPeriod(month, pg.from);
			m.periodInfo.endDateOfPeriod         = this.pouch.getEndDateOfPeriod(month, pg.to);
			m.periodInfo.elapsedMonth            = this.pouch.getElapsedMonth(m, (i + 1));
			m.periodInfo.numberOfMonths          = this.pouch.getNumberOfMonths(m, pg.months.length);
			m.periodInfo.fixTimeOfPeriod         = this.pouch.getFixTimeOfPeriod(m, pg.fixTimeOfPeriod);
			m.periodInfo.legalTimeOfPeriod       = this.pouch.getLegalTimeOfPeriod(m, pg.legalTimeOfPeriod);
			m.periodInfo.remainFixTimeOfPeriod   = this.pouch.getRemainFixTimeOfPeriod(m, fixTimeOfPeriod);
			m.periodInfo.remainLegalTimeOfPeriod = this.pouch.getRemainLegalTimeOfPeriod(m, legalTimeOfPeriod);
			m.periodInfo.carryforwardFromPrev    = this.pouch.getCarryforwardFromPrev(m, carryforwardFromPrev);
			m.periodInfo.realWorkTimeWoLHPrev    = this.pouch.getRealWorkTimeWoLHPrev(m, realWorkTimeWoLHPrev);
			m.periodInfo.settlementTimePrev      = this.pouch.getSettlementTimePrev(m, settlementTimePrev);
			m.legalTimeOfPeriod    = m.periodInfo.legalTimeOfPeriod;
			m.fixTimeOfPeriod      = m.periodInfo.fixTimeOfPeriod;
			m.carryforwardFromPrev = m.periodInfo.carryforwardFromPrev;
			m.settlementTimePrev   = m.periodInfo.settlementTimePrev;
			legalTimeOfPeriod -= (m.realWorkTimeWoLH       - m.settlementTime);
			fixTimeOfPeriod   -= (m.fixTime + m.amountTime - m.settlementTime);
			if(legalTimeOfPeriod < 0){
				legalTimeOfPeriod = 0;
			}
			if(fixTimeOfPeriod < 0){
				fixTimeOfPeriod = 0;
			}
			carryforwardFromPrev += (m.amountTime - m.settlementTime);
			realWorkTimeWoLHPrev += m.realWorkTimeWoLH;
			settlementTimePrev   += m.settlementTime;
		}
	}
	var map = {};
	var ftk = null;
	for(var i = 0 ; i < months.length ; i++){
		var month = months[i];
		var config = month.config;
		var pp = ppmap[month.monthEx];
		/*
		 * 期間の法定労働時間、所定労働時間をセット
		 */
		var period = {
			fixTime                  : 0, // 期間内の所定労働時間（フレックスのみ）
			workTime                 : 0, // 期間内の労働時間（フレックスのみ）※このファンクション内では初期化しておくだけ
			legalTime                : 0, // 期間内の法定労働時間（固定、フレックス、変形労働）
			legalTimeWeek            : 0, // 一週間の法定労働時間（固定、フレックス、変形労働）
			workLegalTime            : 0, // 期間内の法定時間内実労働時間（固定、フレックス、変形労働）※このファンクション内では初期化しておくだけ
			workLegalTimeWeek        : 0, // 一週間内の法定時間内実労働時間（固定、フレックス、変形労働）※このファンクション内では初期化しておくだけ
			avg50week                : 0, // 週平均50H基準時間
			workAvg50week            : 0, // 週平均50H基準時間内労働時間（初期化しておくだけ）
			presetWeek               : {},
			presetMonth              : {},
			dbWorkLegalVal           : 0  // DB保存値の(WorkLegalTime + WorkLegalOverTime - WorkChargeTime)の積算
		};

		var sd = month.startDate;
		var sx = month._em.empType.configBase.initialDayOfWeek;

		var dlst = teasp.util.date.getDateList(month.startDate, month.endDate);
		for(var j = 0 ; j < dlst.length ; j++){
			var day = this.pouch.getObj().days[dlst[j]];
			if(day){
				this.pouch.setFixTimeMap(month, day.date, (day.dayType != teasp.constant.DAY_TYPE_LEGAL_HOLIDAY && day.rack && day.rack.fixTime) || 0);
			}
		}

		if(config.workSystem == teasp.constant.WORK_SYSTEM_FLEX){ // フレックスタイム制
			if(config.variablePeriod > 1){ // 清算期間が複数月
				period.avg50week = month.avg50week;            // 週平均50H基準時間
				period.legalTime = month.periodInfo.remainLegalTimeOfPeriod; // 清算期間の残りの法定労働時間
				period.fixTime   = month.periodInfo.remainFixTimeOfPeriod;   // 清算期間の残りの所定労働時間
			}else{
				period.legalTime = month.legalTime; // 月の所定労働時間
				if(config.flexFixOption == '1'){
					period.fixTime = config.flexFixMonthTime; // 一律固定
				}else if(pp.fixDays){
					period.fixTime = month.fixTime || 0;
				}
			}
			period.presetMonth[sd] = 0;

		}else if(config.workSystem == teasp.constant.WORK_SYSTEM_MUTATE && config.variablePeriod != 0){
			// １ヶ月以上の変形労働時間制の期間の法定労働時間
			period.legalTime = month.legalTimeOfPeriod;
			period.presetMonth[sd] = (config.variablePeriod > 1 ? (month.preWorkLegalTimeOfPeriod || 0) : 0);
			period.presetWeek[sx] = 0;
			if(config.variablePeriod == 1){
				month.legalTime = period.legalTime;
			}
//			var dlst = teasp.util.date.getDateList(month.startDate, month.endDate);
//			for(var j = 0 ; j < dlst.length ; j++){
//				var day = this.pouch.getObj().days[dlst[j]];
//				if(day){
//					this.pouch.setFixTimeMap(month, day.date, (day.rack && day.rack.fixTime));
//				}
//			}
			period.legalTimeWeek = this.pouch.getLegalTimeWeek(month, month.startDate);
		}else{
			// 固定時間制またはまたは管理監督者または１週間単位の変形労働時間制の週の法定労働時間
			period.legalTime = config.legalTimeOfWeek;
			period.presetWeek[sx] = 0;
		}
		/*
		 * 所定労働時間の方が多い場合、期間内の法定労働時間を補正
		 */
//        period.legalTimeReal = (period.legalTime < period.fixTime ? period.fixTime : period.legalTime);
		period.paidHolyTime = month.paidHolyTime || 0;
		map[month.monthEx] = period;
	}

	return map;
};

/**
 * 日付から勤怠月度オブジェクトを取得.
 *
 * @param {Array.<Object>|Object} months 勤怠月度オブジェクトの配列
 * @param {string} dkey 日付('yyyy-MM-dd')
 * @return {?Object} 勤怠月度オブジェクト
 */
teasp.logic.EmpTime.prototype.getMonthByDate = function(months, dkey){
	if(is_array(months)){
		for(var i = 0 ; i < months.length ; i++){
			var m = months[i];
			if(m.startDate <= dkey && dkey <= m.endDate){
				return m;
			}
		}
	}else{
		for(var key in months){
			if(months.hasOwnProperty(key)){
				var m = months[key];
				if(m.startDate <= dkey && dkey <= m.endDate){
					return m;
				}
			}
		}
	}
	return null;
};

/**
 * 休憩時間を差し引いた正味の時間を得る
 *
 * @param {number} t1 時刻１
 * @param {number} t2 時刻２
 * @param {Array.<Object>} rests 休憩時間（Object={from: {number}, to: {number} })
 * @return {number} 時間
 */
teasp.logic.EmpTime.prototype.getRealTime = function(t1, t2, rests){
	var st = (t1 < t2 ? t1 : t2);
	var et = (t1 < t2 ? t2 : t1);
	var restTime = teasp.util.time.rangeTime({ from: st, to: et }, rests);
	return (et - st - restTime);
};

/**
 * ０時～４８時の間で繰り返す時間帯のリストを取得
 *
 * @param {number} st 開始時間
 * @param {number} et 終了時間
 * @param {number} loopt 繰り返しの間隔
 * @return {Array.<Object>} 時間帯のリスト
 */
teasp.logic.EmpTime.prototype.getLoopSpans = function(st, et, loopt, maxt){
	var o = { from: st, to: et };
	var lst = [];
	var p = { from: o.from, to: o.to };
	while((p.to - loopt) > 0){
		p.from -= loopt;
		p.to   -= loopt;
	}
	do {
		lst.push({ from: (p.from < 0 ? 0 : p.from), to: (p.to < maxt ? p.to : maxt) });
		p.from += loopt;
		p.to   += loopt;
	}while(p.from < maxt);
	return lst;
};

/**
 * 時間帯Ａと時間帯Ｂの重複時間と重複時間帯の明細を取得
 *
 * @param {Object} span 時間帯Ａ
 * @param {Array.<Object>} ranges 時間帯Ｂ（複数）※メソッド内で更新。
 * @return 時間帯Ａと時間帯Ｂが重なる時間の合計。
 * ※ 時間帯Ｂのオブジェクト毎に重複時間と重複時間帯の明細の要素が追加される。
 */
teasp.logic.EmpTime.prototype.getSpanOnRanges = function(span, ranges){
	var t = 0;
	for(var j = 0 ; j < ranges.length ; j++){
		var range = ranges[j];
		if(span.from < range.to && range.from < span.to){ // 重複あり
			var o = {
				from : (span.from < range.from  ? range.from : span.from),
				to   : (range.to  < span.to     ? range.to   : span.to  )
			};
			if(!range.span){
				range.span = o;
				range.time = (o.to - o.from);
			}else{
				range.span.to = o.to;
				range.time += (o.to - o.from);
			}
			t += (o.to - o.from);
		}
	}
	return t;
};

/**
 * 労働時間帯のリストを得る
 *
 * @param {Object} day 日次情報オブジェクト
 * @param {Array.<Object>} spans 日次集計用オブジェクト
 * @param {Array.<Object>} excludes 休憩時間、休暇の時間帯のリスト
 * @param {Object} config 勤怠設定情報
 * @param {Object} common 共通設定情報
 * @param {boolean=} flag =trueの場合は有休の時間帯を考慮しない
 */
teasp.logic.EmpTime.prototype.getSlicedList = function(day, spans, excludes, config, common, flag){
	var wtList = [];
	/*
	 * 休憩時間、休暇を抜いた労働時間帯を抽出
	 */
	var wt = (flag ? [] : dojo.clone(day.rack.holySpans || [])); // paidHolySpans ではなく holySpans を労働時間に含める（ticket:5380#comment:16）
	var rests = ((day.startTime === null && day.endTime === null)
			? day.pattern.restTimes
            : day.rack.fixRests.concat(day.rack.freeRests));
	var i = 0;
	while(i < rests.length) {
		wt = teasp.util.time.sliceTimes(wt, rests[i]);
		i++;
	}
	// 「申請の時間帯以外の勤務は認めない」のオプション「所定勤務時間に達するまでは申請なしでも認める」がオンの場合、
	// 時間単位休を含めて所定勤務時間に達したところで労働時間のカウントをやめてしまうので、
	// 休憩自動挿入の判定用に労働時間を得たい場合は、時間単位休を除外して計算するように、day.ignorePaidHoly フラグを
	// オンにする。※ 通常の勤怠計算では、オンにしないこと。
	if(!day.ignorePaidHoly && !day.rack.flexHalfDayTime){
		for(i = 0 ; i < wt.length ; i++){
			wtList.push({
				from    : wt[i].from,
				to      : wt[i].to,
				dayType : teasp.constant.DAY_TYPE_NORMAL,
				night   : false,
				holy    : true,
				fixTime : 0,
				extTime : 0,
				outTime : 0,
				lhoTime : 0
			});
		}
	}
	if(day.rack.worked){
		/*
		 * 日またがりでどちらかが法定休日の場合、午前０時を境に日毎に計算する
		 */
		for(var sx = 0 ; sx < spans.length ; sx++){
			var sliceList = this.sliceRange(spans[sx].from, spans[sx].to, day.dayType, day.rack.nextDayType, day.pattern, common.nightTimes);
			for(var x = 0 ; x < sliceList.length ; x++){
				var dayType = sliceList[config.extendDayType ? 0 : x].dayType;
				var night   = sliceList[x].night;
				wt = sliceList[x].span;
				/*
				 * 休憩時間、休暇を抜いた労働時間帯を抽出
				 */
				i = 0;
				while(i < excludes.length) {
					wt = teasp.util.time.sliceTimes(wt, excludes[i]);
					i++;
				}
				for(i = 0 ; i < wt.length ; i++){
					wtList.push({
						from    : wt[i].from,
						to      : wt[i].to,
						dayType : dayType,
						night   : night,
						holy    : false,
						fixTime : 0,
						extTime : 0,
						outTime : 0,
						lhoTime : 0
					});
				}
			}
		}
	}
	/*
	 * 労働時間帯（有休含む）をソート
	 */
	wtList = wtList.sort(function(a, b){
		return (a.from - b.from);
	});
	return wtList;
};

/**
 * 出社～退社時刻を日タイプ、時間帯で仕分けして返す.<br/>
 *
 * @param {number} st 出社時刻
 * @param {number} et 退社時刻
 * @param {number} dayType0 本日の日タイプ
 * @param {number} dayType1 翌日の日タイプ
 * @param {Array.<Object>} nights 深夜時間帯オブジェクトの配列
 * @return 仕訳済みの時間帯オブジェクトの配列
 */
teasp.logic.EmpTime.prototype.sliceRange = function(st, et, dayType0, dayType1, pattern, nights){
	if(!teasp.util.time.isValidRange(st, et)){
		return [];
	}
	var map = {};
	var seq = 0;
	// 日付境界で分割
	if(et > 1440){
		map[seq++] = { dayType: dayType0, from: st  , to: 1440, night: false };
		if(dayType0 == teasp.constant.DAY_TYPE_NORMAL // 平日
		&& dayType0 != dayType1
		&& dayType1 != teasp.constant.DAY_TYPE_LEGAL_HOLIDAY
		&& 1440 < pattern.stdEndTime){
			// 所定の終業時刻が日をまたぐ場合、所定内の dayType は前日の dayType と同じにする
			if(pattern.stdEndTime < et){
				map[seq++] = { dayType: dayType0, from: 1440              , to: pattern.stdEndTime, night: false };
				map[seq++] = { dayType: dayType1, from: pattern.stdEndTime, to: et                , night: false };
			}else{
				map[seq++] = { dayType: dayType0, from: 1440, to: et  , night: false };
			}
		}else{
			map[seq++] = { dayType: dayType1, from: 1440, to: et  , night: false };
		}
	}else{
		map[seq++] = { dayType: dayType0, from: st  , to: et  , night: false };
	}
	// 深夜時間帯で分割
	for(var i = 0 ; i < nights.length ; i++){
		var night = nights[i];
		for(var k in map){
			var o = map[k];
			if(!o){
				continue;
			}
			if(night.from <= o.from && o.to <= night.to){
				o.night = true;
			}else if(night.from <= o.from && o.from < night.to && night.to < o.to){
				map[k] = null;
				map[seq++] = { dayType: o.dayType, from: o.from    , to: night.to  , night: true    };
				map[seq++] = { dayType: o.dayType, from: night.to  , to: o.to      , night: o.night };

			}else if(o.from < night.from && night.from < o.to && o.to <= night.to){
				map[k] = null;
				map[seq++] = { dayType: o.dayType, from: o.from    , to: night.from, night: o.night };
				map[seq++] = { dayType: o.dayType, from: night.from, to: o.to      , night: true    };

			}else if(o.from < night.from && night.to < o.to){
				map[k] = null;
				map[seq++] = { dayType: o.dayType, from: o.from    , to: night.from, night: o.night };
				map[seq++] = { dayType: o.dayType, from: night.from, to: night.to  , night: true    };
				map[seq++] = { dayType: o.dayType, from: night.to  , to: o.to      , night: o.night };
			}
		}
	}
	var lst = [];
	for(var k in map){
		var o = map[k];
		if(o){
			lst.push({
				dayType : o.dayType,
				night   : o.night,
				span    : [{
					from : o.from,
					to   : o.to
				}]
			});
		}
	}
	lst = lst.sort(function(a, b){
		return a.span[0].from - b.span[0].from;
	});
	return lst;
};

teasp.logic.EmpTime.recalcSapn = function(outSpan, fixSpan, workLegalOverTime, workLegalOutOverTime, workChargeTime){
	var newc = {
		workInFixedSpan      : null,
		workLegalOverSpan    : [],
		workLegalOutOverSpan : [],
		workChargeSpan       : []
	};
	outSpan = (outSpan || []);
	fixSpan = (fixSpan || []);
	for(var i = 0 ; i < outSpan.length ; i++){
		outSpan[i].flag = 2;
	}
	for(i = 0 ; i < fixSpan.length ; i++){
		fixSpan[i].flag = 1;
	}
	var mixSpan = outSpan.concat(fixSpan);
	mixSpan = mixSpan.sort(function(a, b){
		return (a.from != b.from ? (a.from - b.from) : (a.to - b.to));
	});
	var outIndex = 0;
	var fixIndex = 0;
	for(i = 0 ; i < mixSpan.length ; i++){
		if(mixSpan[i].flag == 2){
			if(i > 0 && mixSpan[i-1].flag != mixSpan[i].flag){
				outIndex++;
			}
			mixSpan[i].outIndex = outIndex;
		}else{
			if(i > 0 && mixSpan[i-1].flag != mixSpan[i].flag){
				fixIndex++;
			}
			mixSpan[i].fixIndex = fixIndex;
		}
	}
	if(fixSpan && fixSpan.length > 0){
		newc.workInFixedSpan = { from: fixSpan[0].from, to: fixSpan[fixSpan.length - 1].to };
	}
	var lot  = workLegalOverTime;
	var loot = workLegalOutOverTime;
	var ct   = workChargeTime;
	var lots  = [];
	var loots = [];
	var cts   = [];
	var chSpan = dojo.clone(fixSpan);
	var x = 0;
	i = 0;
	while(i < outSpan.length && lot > 0){
		var t = outSpan[i].to - outSpan[i].from;
		if(lots.length > 0 && lots[lots.length - 1].outIndex != outSpan[i].outIndex){
			x++;
		}
		if(x >= lots.length){
			lots.push({ from : outSpan[i].from, outIndex: outSpan[i].outIndex });
		}
		if(lot < t){
			lots[x].to = (outSpan[i].from + lot);
			chSpan.push({ from: outSpan[i].from, to: lots[x].to, flag: outSpan[i].flag });
			loots.push({ from : lots[x].to, to : outSpan[i].to, outIndex: outSpan[i].outIndex });
		}else{
			lots[x].to = outSpan[i].to;
			chSpan.push(outSpan[i]);
		}
		lot -= t;
		i++;
	}
	x = 0;
	while(i < outSpan.length){
		if(loots.length > 0 && loots[loots.length - 1].outIndex != outSpan[i].outIndex){
			x++;
		}
		if(x >= loots.length){
			loots.push({ from : outSpan[i].from, to : outSpan[i].to, outIndex: outSpan[i].outIndex });
		}
		loots[x].to = outSpan[i].to;
		i++;
	}
	chSpan = chSpan.sort(function(a, b){
		return (a.from != b.from ? (a.from - b.from) : (a.to - b.to));
	});
	x = 0;
	i = chSpan.length - 1;
	while(i >= 0 && ct > 0){
		var t = chSpan[i].to - chSpan[i].from;
		if(cts.length > 0 && cts[x].flag != chSpan[i].flag){
			x++;
		}
		if(x >= cts.length){
			cts.push({ to: chSpan[i].to, flag: chSpan[i].flag });
		}
		if(ct < t){
			cts[x].from = chSpan[i].to - ct;
		}else{
			cts[x].from = chSpan[i].from;
		}
		ct -= t;
		i--;
	}
	newc.workLegalOverSpan = lots;
	newc.workLegalOutOverSpan = loots;
	newc.workChargeSpan = cts;
	return newc;
};

/**
 * 申請情報を日付にマッピングする
 *
 * @param {Array.<Object>} applys 申請情報
 * @return マッピングを持つオブジェクト
 */
teasp.logic.EmpTime.prototype.getApplyDateMap = function(applys){
	var amap = {};
	for(var ii = 0 ; ii < applys.length ; ii++){
		var apply = applys[ii];
		if(!apply.startDate){ // 勤務確定の申請
			amap[apply.yearMonth] = apply;
			continue;
		}
		if(apply.applyType == teasp.constant.APPLY_TYPE_MONTHLYOVERTIME){ // 月次残業申請
			var molst = amap[teasp.constant.APPLY_TYPE_MONTHLYOVERTIME];
			if(!molst){
				molst = amap[teasp.constant.APPLY_TYPE_MONTHLYOVERTIME] = [];
			}
			molst.push(apply);
			continue;
		}
		if(!apply.endDate){ // startDate だけ値があり、endDate がなしなら endDate に startDate をセット
			apply.endDate = apply.startDate;
		}
		var ignoreExcludeDate = ((apply.holiday && apply.holiday.displayDaysOnCalendar) || false);
		var dlst = teasp.util.date.getDateList(apply.startDate, apply.endDate);
		var dates = [];
		var lc = 0;
		while(lc <= 1 && dates.length <= 0){
			for(var i = 0 ; i < dlst.length ; i++){
				var dkey = dlst[i];
				if(!ignoreExcludeDate && apply.excludeDate.contains(dkey)){
					continue;
				}
				if(!amap[dkey]){
					amap[dkey] = [];
				}
				amap[dkey].push(apply);
				dates.push(dkey);
			}
			ignoreExcludeDate = true;
			lc++;
		}
		if(apply.applyType == teasp.constant.APPLY_TYPE_EXCHANGE
		|| apply.applyType == teasp.constant.APPLY_TYPE_SHIFTCHANGE){ // 振替申請の場合は、振替先の日付にも申請情報をマッピング
			var dkey = apply.exchangeDate;
			if(!amap[dkey]){
				amap[dkey] = [];
			}
			amap[dkey].push(apply);
		}
	}
	return amap;
};

teasp.logic.EmpTime.prototype.getValidApplys = function(alst, na, dkey){
	return teasp.logic.EmpTime.getValidApplyMap(alst, na, dkey);
};

/**
 * １日の申請情報をタイプ別に仕分けする。
 * また、重複をチェックして無効な申請情報を抽出する。
 * 重複があった場合、先に見つかった方＝新しい方（申請日時が大きい方）を有効とする。
 *
 * @param {Array.<Object>} alst 申請情報のリスト
 * @param {Array.<Object>} na 無効な申請リスト（※本メソッド内でリスト更新）
 * @param {string} dkey 日付（'yyyy-MM-dd'）
 * @return 仕訳済みの申請リスト
 */
teasp.logic.EmpTime.getValidApplyMap = function(alst, na, dkey){
	var va = {
		patternS    : null,  // 有効な勤務時間変更申請
		patternL    : null,  // 有効な長期時間変更申請
		patternD    : null,  // 有効な勤務時間変更申請（勤務日・非勤務日変更のみ）
		exchangeS   : null,  // 有効な振替申請（元）
		exchangeE   : null,  // 有効な振替申請（先）
		kyushtu     : [],    // 有効な休日出勤申請
		holidayAll  : null,  // 有効な休暇申請（終日）
		holidayAm   : null,  // 有効な休暇申請（午前休）
		holidayPm   : null,  // 有効な休暇申請（午後休）
		holidayTime : [],    // 有効な休暇申請（時間休）
		zangyo      : [],    // 有効な残業申請
		earlyStart  : [],    // 有効な早朝勤務申請
		lateStart   : null,  // 有効な遅刻申請
		earlyEnd    : null,  // 有効な早退申請
		dailyFix    : null,  // 有効な日次確定
		shiftSet    : null,  // 有効なシフト設定
		shiftChange : null,  // 有効なシフト振替申請
		showApply   : null,  // ステータス表示用の申請
		reviseTime  : [],    // 有効な勤怠時刻修正申請
		waiting     : [],
		rejects     : {
			patternS    : null,  // 却下された勤務時間変更申請
			patternL    : null,  // 却下された長期時間変更申請
			patternD    : null,  // 却下された勤務時間変更申請（勤務日・非勤務日変更のみ）
			exchangeS   : null,  // 却下された振替申請（元）
			exchangeE   : null,  // 却下された振替申請（先）
			kyushtu     : [],    // 却下された休日出勤申請
			holidayAll  : null,  // 却下された休暇申請（終日）
			holidayAm   : null,  // 却下された休暇申請（午前休）
			holidayPm   : null,  // 却下された休暇申請（午後休）
			holidayTime : [],    // 却下された休暇申請（時間休）
			zangyo      : [],    // 却下された残業申請
			earlyStart  : [],    // 却下された早朝勤務申請
			lateStart   : null,  // 却下された遅刻申請
			earlyEnd    : null,  // 却下された早退申請
			reviseTime  : [],    // 却下された勤怠時刻修正申請
			shiftChange : null,  // 却下されたシフト振替申請
			dailyFix    : null
		},
		oldDailyFix : null
	};

	// 申請日時の降順でソート
	alst = alst.sort(function(a, b){
		return (a.applyTime < b.applyTime ? 1 : (a.applyTime > b.applyTime ? -1 : 0));
	});

	var lst = [];
	for(var i = 0 ; i < alst.length ; i++){
		var a = alst[i];
		if(teasp.constant.STATUS_REJECTS.contains(a.status) && a.close){ // 却下＆Close済み
			continue;
		}
		if(!va.oldDailyFix
		&& a.applyType == teasp.constant.APPLY_TYPE_DAILY
		&& (teasp.constant.STATUS_REJECTS.contains(a.status) || teasp.constant.STATUS_CANCELS.contains(a.status))
		){ // 取り消しまたは却下された１つめの日次確定
			va.oldDailyFix = a;
		}
		if(teasp.constant.STATUS_CANCELS.contains(a.status)){ // 取り消した申請
			continue;
		}
		if(teasp.constant.STATUS_FIX.contains(a.status)){  // 承認済み, 確定済み, 承認待ち, 承認中
			if(a.decree && a.applyType != teasp.constant.APPLY_TYPE_HOLIDAY){
				if(a.applyType == teasp.constant.APPLY_TYPE_PATTERNS){       // シフト設定（重複不可）
					if(!va.shiftSet){
						va.shiftSet = a;
						a.aliasKey = teasp.constant.APPLY_KEY_SHIFT;
					}
				}
			}else if(a.applyType == teasp.constant.APPLY_TYPE_DAILY){       // 日次確定（重複不可）
				if(!va.dailyFix){
					va.dailyFix = a;
				}else{
					na.push({
						apply  : a,
						reason : teasp.constant.REASON_DUPL,
						keep   : false
					});
				}
			}else if(a.applyType == teasp.constant.APPLY_TYPE_PATTERNS){       // 勤務時間変更申請（重複不可）
				if(a.pattern){
					if(!va.patternS){
						va.patternS = a;
					}else{
						na.push({
							apply  : a,
							reason : teasp.constant.REASON_DUPL,
							keep   : false
						});
					}
				}else{
					if(!va.patternD){
						va.patternD = a;
					}else{
						na.push({
							apply  : a,
							reason : teasp.constant.REASON_DUPL,
							keep   : false
						});
					}
				}
			}else if(a.applyType == teasp.constant.APPLY_TYPE_PATTERNL){ // 長期時間変更申請（重複不可）
				if(!va.patternL){
					va.patternL = a;
				}else{
					na.push({
						apply  : a,
						reason : teasp.constant.REASON_DUPL,
						keep   : false
					});
				}
			}else if(a.applyType == teasp.constant.APPLY_TYPE_EXCHANGE){ // 振替申請（重複不可）
				if(a.startDate == dkey){ // 振替元日付と対象日日付が同じなら振替元
					if(!va.exchangeS){
						va.exchangeS = a;
						va.exchangeS.exchangeDateReal = teasp.logic.EmpTime.getRealExchangeDate(dkey, alst);
					}else{
						na.push({
							apply  : a,
							reason : teasp.constant.REASON_DUPL,
							keep   : false
						});
					}
				}else{
					if(!va.exchangeE){
						va.exchangeE = a;
						va.exchangeE.exchangeDateReal = a.exchangeDate;
					}else{
						na.push({
							apply  : a,
							reason : teasp.constant.REASON_DUPL,
							keep   : false
						});
					}
				}
			}else if(a.applyType == teasp.constant.APPLY_TYPE_KYUSHTU){  // 休日出勤申請（重複可）
				va.kyushtu.push(a);
			}else if(a.applyType == teasp.constant.APPLY_TYPE_HOLIDAY){  // 休暇申請（「時間単位休」は重複可、それ以外は範囲違いのみ重複可）
				var h = a.holiday;
				if(h.range == teasp.constant.RANGE_TIME){ // 時間単位休
					va.holidayTime.push(a);
				}else if(h.range == teasp.constant.RANGE_ALL){ // 終日休
					if(!va.holidayAll){
						va.holidayAll = a;
					}else{
						na.push({
							apply  : a,
							reason : teasp.constant.REASON_RANGE_DUPL,
							keep   : false
						});
					}
				}else if(h.range == teasp.constant.RANGE_AM){ // 午前休
					if(!va.holidayAm){
						va.holidayAm = a;
					}else{
						na.push({
							apply  : a,
							reason : teasp.constant.REASON_RANGE_DUPL,
							keep   : false
						});
					}
				}else if(h.range == teasp.constant.RANGE_PM){ // 午後休
					if(!va.holidayPm){
						va.holidayPm = a;
					}else{
						na.push({
							apply  : a,
							reason : teasp.constant.REASON_RANGE_DUPL,
							keep   : false
						});
					}
				}
			}else if(a.applyType == teasp.constant.APPLY_TYPE_ZANGYO){    // 残業申請（重複可）
				va.zangyo.push(a);
			}else if(a.applyType == teasp.constant.APPLY_TYPE_EARLYSTART){ // 早朝勤務申請（重複可）
				va.earlyStart.push(a);
			}else if(a.applyType == teasp.constant.APPLY_TYPE_LATESTART){ // 遅刻申請（重複不可）
				if(!va.lateStart){
					va.lateStart = a;
				}else{
					na.push({
						apply  : a,
						reason : teasp.constant.REASON_DUPL,
						keep   : false
					});
				}
			}else if(a.applyType == teasp.constant.APPLY_TYPE_EARLYEND){ // 早退申請（重複不可）
				if(!va.earlyEnd){
					va.earlyEnd = a;
				}else{
					na.push({
						apply  : a,
						reason : teasp.constant.REASON_DUPL,
						keep   : false
					});
				}
			}else if(a.applyType == teasp.constant.APPLY_TYPE_DIRECT){ // 直行・直帰申請（重複不可）
				if(!va.direct){
					va.direct = a;
				}else{
					na.push({
						apply  : a,
						reason : teasp.constant.REASON_DUPL,
						keep   : false
					});
				}
			}else if(a.applyType == teasp.constant.APPLY_TYPE_REVISETIME){    // 勤怠時刻修正申請
				va.reviseTime.push(a);
			}else if(a.applyType == teasp.constant.APPLY_TYPE_SHIFTCHANGE){   // シフト振替申請
				if(!va.shiftChange){
					va.shiftChange = a;
				}else{
					na.push({
						apply  : a,
						reason : teasp.constant.REASON_DUPL,
						keep   : false
					});
				}
			}
		}else{
			lst.push(a);
			if(teasp.constant.STATUS_REJECTS.contains(a.status) && !a.close){ // 却下かつ申請取消していない申請
				if(a.applyType == teasp.constant.APPLY_TYPE_DAILY){          // 日次確定（重複不可）
					va.rejects.dailyFix = a;
				}else if(a.applyType == teasp.constant.APPLY_TYPE_PATTERNS){ // 勤務時間変更申請（重複不可）
					va.rejects.patternS = a;
				}else if(a.applyType == teasp.constant.APPLY_TYPE_PATTERNL){ // 長期時間変更申請（重複不可）
					va.rejects.patternL = a;
				}else if(a.applyType == teasp.constant.APPLY_TYPE_EXCHANGE){ // 振替申請（重複不可）
					if (a.startDate == dkey) { // 振替元日付と対象日日付が同じなら振替元
						va.rejects.exchangeS = a;
					}else{
						va.rejects.exchangeE = a;
					}
				}else if(a.applyType == teasp.constant.APPLY_TYPE_KYUSHTU){  // 休日出勤申請（重複可）
					va.rejects.kyushtu.push(a);
				}else if(a.applyType == teasp.constant.APPLY_TYPE_HOLIDAY){  // 休暇申請（「時間単位休」は重複可、それ以外は範囲違いのみ重複可）
					var h = a.holiday;
					if(h.range == teasp.constant.RANGE_TIME){ // 時間単位休
						va.rejects.holidayTime.push(a);
					}else if(h.range == teasp.constant.RANGE_ALL){ // 終日休
						va.rejects.holidayAll = a;
					}else if(h.range == teasp.constant.RANGE_AM){ // 午前休
						va.rejects.holidayAm = a;
					}else if(h.range == teasp.constant.RANGE_PM){ // 午後休
						va.rejects.holidayPm = a;
					}
				}else if(a.applyType == teasp.constant.APPLY_TYPE_ZANGYO){    // 残業申請（旧版では重複可）
					va.rejects.zangyo.push(a);
				}else if(a.applyType == teasp.constant.APPLY_TYPE_EARLYSTART){ // 早朝勤務申請（重複可）
					va.rejects.earlyStart.push(a);
				}else if(a.applyType == teasp.constant.APPLY_TYPE_LATESTART){ // 遅刻申請（重複不可）
					va.rejects.lateStart = a;
				}else if(a.applyType == teasp.constant.APPLY_TYPE_EARLYEND){ // 早退申請（重複不可）
					va.rejects.earlyEnd = a;
				}else if(a.applyType == teasp.constant.APPLY_TYPE_DIRECT){ // 直行・直帰申請（重複不可）
					va.rejects.direct = a;
				}else if(a.applyType == teasp.constant.APPLY_KEY_REVISETIME){ // 勤怠時刻修正申請
					va.rejects.reviseTime = a;
				}else if(a.applyType == teasp.constant.APPLY_TYPE_SHIFTCHANGE){ // 勤怠時刻修正申請
					va.rejects.shiftChange = a;
				}
			}
		}
	}
	/*
	 * ステータス表示用の申請
	 * 複数有効な申請がある場合、勤務表の申請欄にステータスを表示するための申請を選ぶ
	 * 有効な申請を申請日の降順でソートし、「却下」＞「承認待ち」＞「それ以外」の優先順で決める。
	 */
	for(var key in va){
		if(va.hasOwnProperty(key) && va[key] && (key != 'showApply') && (key != 'waiting') && (key != 'rejects')){
			if(is_array(va[key])){
				lst = lst.concat(va[key]);
			}else{
				lst.push(va[key]);
			}
		}
	}
	lst = lst.sort(function(a, b){
		return (a.applyTime < b.applyTime ? 1 : (a.applyTime > b.applyTime ? -1 : 0));
	});
	var dupKeys = ['zangyo', 'earlyStart', 'kyushtu'];
	for(i = 0 ; i < dupKeys.length ; i++){
		var key = dupKeys[i];
		if(va[key] && va[key].length > 1){
			va[key] = va[key].sort(function(a, b){
				if(a.afterFlag && !b.afterFlag){
					return -1;
				}else if(!a.afterFlag && b.afterFlag){
					return 1;
				}
				return (a.applyTime < b.applyTime ? 1 : (a.applyTime > b.applyTime ? -1 : 0));
			});
		}
	}
	for(i = 0 ; i < lst.length ; i++){
		var a = lst[i];
		if((a.decree && a.applyType != teasp.constant.APPLY_TYPE_HOLIDAY) || teasp.constant.STATUS_CANCELS.contains(a.status)){
			continue;
		}
		if((teasp.constant.STATUS_REJECTS.contains(a.status) && !a.close) // 却下後申請取消をしてないか、承認待ち
		|| a.status == teasp.constant.STATUS_WAIT){
			va.waiting.push(a); // 待ち状態（勤務確定できない）
		}
		if(!va.showApply){ // showApply が空の時はとりあえず取消以外の申請をセット
			va.showApply = a;
		}else if(!teasp.constant.STATUS_REJECTS.contains(va.showApply.status)){
			if(teasp.constant.STATUS_REJECTS.contains(a.status)){
				va.showApply = a;
			}else if(a.status == teasp.constant.STATUS_WAIT && va.showApply.status != teasp.constant.STATUS_WAIT){
				va.showApply = a;
			}
		}
	}
	return va;
};

/**
 * 週次オブジェクト作成
 *
 * @param {string} dkey 基準日の日付文字列 (yyyy-MM-dd)
 * @param {string} lastDkey 対象期間最終日の日付文字列 (yyyy-MM-dd)
 * @param {number} startOfWeek 週の起算日 (0-6)
 * @param {Function=} isAlive 日付が入社日前または退社後でないか判定する関数
 * @return {Array.<Object>} 週次オブジェクトの配列
 */
teasp.logic.EmpTime.createWeekObjs = function(dkey, lastDkey, startOfWeek, isAlive){
	var weekObjs = [];
	var d     = teasp.util.date.parseDate(dkey);
	var lastD = teasp.util.date.parseDate(lastDkey);
	var wn = d.getDay();
	if(startOfWeek != wn){
		d = teasp.util.date.addDays(d, startOfWeek - wn - (wn < startOfWeek ? 7 : 0));
	}
	var index = 0;
	while(teasp.util.date.compareDate(d, lastD) <= 0){
		weekObjs[index] = {
			legalHolidays   : 0,
			workOrFixDays   : 0,
			lastHoliday     : null,
			dkeys           : [],
			liveWeekAll     : true
		};
		var o = weekObjs[index];
		for(var i = 0 ; (i < 7 && teasp.util.date.compareDate(d, lastD) <= 0) ; i++){
			o.dkeys.push(teasp.util.date.formatDate(d));
			d = teasp.util.date.addDays(d, 1);
		}
		if(isAlive){
			var f = 0x7F;
			for(i = 0 ; i < o.dkeys.length ; i++){
				var k = o.dkeys[i];
				if(!isAlive(k)){ // 入社日より前、退社日より後
					var x = o.dkeys.indexOf(k);
					if(x >= 0){
						f &= ~(1 << x); // ビットをOFFにする
					}
				}
			}
			o.liveWeekAll = (f === 0x7F);
		}
		index++;
	}
	return weekObjs;
};

/**
 * 週次オブジェクトに週７日間すべて保持している週の数を数える
 *
 * @param {Array.<Object>} weekObjs 週次オブジェクトの配列
 * @return {number} 週７日間すべて保持している週の数
 */
teasp.logic.EmpTime.prototype.getCompleteWeekCnt = function(weekObjs){
	var cnt = 0;
	for(var i = 0 ; i < weekObjs.length ; i++){
		if(weekObjs[i].dkeys.length >= 7){
			cnt++;
		}
	}
	return cnt;
};

/**
 * 日付キーから週次オブジェクトを特定して返す
 *
 * @param {Array.<Object>} weekObjs 週次オブジェクトの配列
 * @param {string} dkey 日付文字列 (yyyy-MM-dd)
 * @return {Object} 週次オブジェクト
 */
teasp.logic.EmpTime.getWeekObj = function(weekObjs, dkey){
	for(var i = 0 ; i < weekObjs.length ; i++){
		if(weekObjs[i].dkeys.contains(dkey)){
			return weekObjs[i];
		}
	}
	return null;
};

/**
 * 週次オブジェクトで保持している全日付キーを配列にして返す
 *
 * @param {Array.<Object>} weekObjs 週次オブジェクトの配列
 * @return {Array.<string>} 日付キーの配列
 */
teasp.logic.EmpTime.getDateListByWeekObjs = function(weekObjs){
	var lst = [];
	for(var i = 0 ; i < weekObjs.length ; i++){
		lst = lst.concat(weekObjs[i].dkeys);
	}
	return lst;
};

/**
 * 休憩自動挿入判定用のネット労働時間を取得
 *
 * @param {Object} dataObj
 * @param {string} dkey
 * @param {number} st 出社時刻
 * @param {number} et 退社時刻
 * @param {Array.<Object>} 休憩時刻
 * @returns {Object} 労働時間と休憩時間
 *
 */
teasp.logic.EmpTime.getWorkAndRestTime = function(dataObj, dkey, st, et, rests){
	// 計算に必要な情報と計算結果を格納するオブジェクトを生成
	// このオブジェクトはこのメソッドの処理後に捨てるので、他に影響は与えない。
	var pouch = new teasp.data.Pouch();
	pouch.dataObj = dojo.clone(dataObj);
	var day = pouch.dataObj.days[dkey];
	if(day){
		day.startTime = st;
		day.endTime   = et;
		day.timeTable = rests;
		day.pattern = null;
		day.ignorePaidHoly = true; // 時間単位休を除外した労働時間を計算するためのフラグ。
								// 休憩自動挿入の判定用の労働時間を取得するため。
	}
	var empTime  = new teasp.logic.EmpTime(pouch);
	empTime.recalcEmpDay(dkey);

	var dayWrap = pouch.getEmpDay(dkey);
	var disc = dayWrap.getDiscretionaryLevel();
	var otrt = pouch.getOverTimeRequireTime(disc);  // 無申請残業時間の境界時間
	var ewrt = pouch.getEarlyWorkRequireTime(disc); // 無申請早朝勤務時間の境界時間
	var svz = dayWrap.getMissingOverTime(otrt);
	var sve = dayWrap.getMissingEarlyWork(ewrt);

	var o = {
		workTime : day.real.workRealTime, // ネット労働時間
		restTime : day.real.restTime,     // 休憩時間
		missingOverTimeApply : (svz > 0), // 残業申請
		missingOverTimeApplyExist : (svz > 0 && dayWrap.isExistApply(teasp.constant.APPLY_KEY_ZANGYO)), // 未申請勤務ありかつ残業申請はある
		missingEarlyWorkApply: (sve > 0), // 早朝勤務申請
		missingEarlyWorkApplyExist: (sve > 0 && dayWrap.isExistApply(teasp.constant.APPLY_KEY_EARLYSTART)), // 未申請勤務ありかつ早朝勤務申請はある
		missingLateStartApply: (pouch.isRequiredLateStartApply() && dayWrap.isMissingLateStartApply()), // 遅刻申請
		missingEarlyEndApply : (pouch.isRequiredEarlyEndApply()  && dayWrap.isMissingEarlyEndApply())   // 早退申請
	};
	if(!day.pattern.useDiscretionary){ // 裁量労働以外は労働時間と休憩時間に補填分を含んでいるので差し引く
		o.workTime -= (day.real.hotenWork || 0);
		o.restTime -= (day.real.hotenRest || 0);
	}
	return o;
};

/**
 * 指定した日だけ労働時間の再計算する
 * @param {string} dkey 日付 (yyyy-MM-dd)
 */
teasp.logic.EmpTime.prototype.recalcEmpDay = function(dkey){
	var obj = this.pouch.getObj();
	var common = obj.common;
	var config = obj.config;
	var months = obj.months;
	var days   = obj.days;
	var applys = obj.applys;
	var amap = this.getApplyDateMap(applys); // 日付と申請情報のマッピングテーブル作成
	/*
	 * 日次情報のマージ
	 */
	var dlst2 = [];
	for(var key in days){
		dlst2.push(key);
	}
	dlst2 = dlst2.sort(function(a, b){
		return (a < b ? -1 : 1);
	});
	var day = this.mergeEmpDay(days, dkey, (amap[dkey] || []), dlst2, config);
	/*
	 * 労働時間の再計算
	 */
	var periodMap = this.getPeriodMap(months);
	var month = this.getMonthByDate(months, dkey);
	config = month.config;
	var period = periodMap[month.monthEx];
	day.period = dojo.clone(period);
	this.calculateEmpDay(day, period, config, common, teasp.constant.C_REAL);
	this.calculateEmpDay(day, period, config, common, teasp.constant.C_DISC);
};

teasp.logic.EmpTime.prototype.getDaiqCount = function(day){
	if(!day || !day.rack.validApplys){
		return false;
	}
	var va = day.rack.validApplys;
	var cnt = 0;
	if(va.holidayAll
	&& va.holidayAll.holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ
	&& teasp.constant.STATUS_FIX.contains(va.holidayAll.status)){
		cnt++;
	}
	if(va.holidayAm
	&& va.holidayAm.holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ
	&& teasp.constant.STATUS_FIX.contains(va.holidayAm.status)){
		cnt += 0.5;
	}
	if(va.holidayPm
	&& va.holidayPm.holiday.type == teasp.constant.HOLIDAY_TYPE_DAIQ
	&& teasp.constant.STATUS_FIX.contains(va.holidayPm.status)){
		cnt += 0.5;
	}
	return cnt;
};

teasp.logic.EmpTime.prototype.getStockCount = function(day){
	if(!day || !day.rack.validApplys){
		return null;
	}
	var va = day.rack.validApplys;
	var o = {};
	if(va.holidayAll
	&& va.holidayAll.holiday.managed
	&& teasp.constant.STATUS_FIX.contains(va.holidayAll.status)){
		o[va.holidayAll.holiday.manageName] = {
			date: day.rack.key,
			days: 1,
			name: va.holidayAll.holiday.name
		};
	}
	if(va.holidayAm
	&& va.holidayAm.holiday.managed
	&& teasp.constant.STATUS_FIX.contains(va.holidayAm.status)){
		o[va.holidayAm.holiday.manageName] = {
			date: day.rack.key,
			days: 0.5,
			name: va.holidayAm.holiday.name
		};
	}
	if(va.holidayPm
	&& va.holidayPm.holiday.managed
	&& teasp.constant.STATUS_FIX.contains(va.holidayPm.status)){
		if(o[va.holidayPm.holiday.manageName]){
			var m = o[va.holidayPm.holiday.manageName];
			o[va.holidayPm.holiday.manageName] = {
				date: day.rack.key,
				days: 0.5 + m.days,
				name: m.name + ',' + va.holidayPm.holiday.name
			};
		}else{
			o[va.holidayPm.holiday.manageName] = {
				date: day.rack.key,
				days: 0.5,
				name: va.holidayPm.holiday.name
			};
		}
	}
	return o;
};

/**
 * 指定日付に適用される勤務パターンを返す.
 *
 * @static
 * @param {Array.<Object>} patterns 勤務パターンリスト
 * @param {Object} dt 日付
 * @return {Object} 勤務パターンオブジェクト
 */
teasp.logic.EmpTime.getPatternByDate = function(patterns, dt){
	for(var i = 0 ; i < patterns.length ; i++){
		var ep = patterns[i];
		if(ep.schedOption == '1'){ // 毎週Ｘ曜日
			var dw = '' + dt.getDay();
			if(ep.schedWeekly.indexOf(dw) >= 0){
				return ep;
			}
		}else if(ep.schedOption == '2'){ // 毎月Ｘ日
			var dd = parseInt(ep.schedMonthlyDate, 10);
			if(dd == 32){
				dd = teasp.util.date.getMonthEndDay(dt.getFullYear(), dt.getMonth() + 1); // その月の最終日
			}
			if(dd == dt.getDate()){
				return ep;
			}
		}else if(ep.schedOption == '3'){ // 毎月第ＮＸ曜日
			var ll = parseInt(ep.schedMonthlyLine, 10);
			var dl = Math.floor((dt.getDate() + 6) / 7); // 何週目か
			if(ll == 5){
				var lastd = teasp.util.date.getMonthEndDay(dt.getFullYear(), dt.getMonth() + 1); // その月の最終日
				ll = (lastd + 6) / 7; // 最終日の週は何週目か
			}
			var dw = '' + dt.getDay();
			if(dl == ll && ep.schedMonthlyWeek == dw){
				return ep;
			}
		}
	}
	return null;
};

/**
 * 日次の dayType, pattern, event, plannedHoliday を返す
 *
 * @static
 * @param {string} dkey ('yyyy-MM-dd')
 * @param {Object} em month オブジェクト
 * @param {Object} cal カレンダーオブジェクト
 * @param {Array.<Object>} empTypePatterns カレンダーオブジェクト
 * @return {Object} 日次オブジェクト（dayType, pattern, event, plannedHoliday 要素を格納）
 */
teasp.logic.EmpTime.getDayInfo = function(dkey, em, cal, empTypePatterns){
	// 日付オブジェクトを得る
	var d = teasp.util.date.parseDate(dkey);
	// dayType、plannedHoliday、event は Config、カレンダーとマージして決定
	var day = {
		dayType        : teasp.constant.DAY_TYPE_NORMAL,
		plannedHoliday : false
	};
	// 勤怠設定の繰り返し休日と国民の祝日で dayType をセット
	var ho = em.fixHolidays[dkey];
	day.dayType = (ho ? ho.dayType : teasp.constant.DAY_TYPE_NORMAL);
	if(em.config.defaultLegalHoliday !== null
	&& day.dayType != teasp.constant.DAY_TYPE_NORMAL
	&& d.getDay() == em.config.defaultLegalHoliday){
		day.defaultLegalHolidayFlag = true;
	}
	// 勤怠カレンダーとマージ
	// ★★★ day.event に部署のイベントをセットしてない。★★★
	// teasp.logic.EmpTime.prototype.mergeCalendar() の中でやっていることを
	// 本来はやるべきだが、この値はどこからも参照されないため、このままにする。
	if(cal){
		if(cal.type){
			day.dayType = (typeof(cal.type) == 'string' ? parseInt(cal.type, 10) : cal.type);
			day.plannedHoliday = cal.plannedHoliday;
		}
		if(cal.pattern){
			day.pattern = cal.pattern;
		}
		day.event = (ho && ho.title || '');
		day.event += (((day.event || '') != '' && cal.event) ? teasp.message.getLabel('tm10001470') : '') + (cal.event || ''); // ／
	}else{
		day.event = (ho && ho.title || '');
	}
	if(!day.pattern){
		// 勤務パターンの適用日で pattern を決定
		// ※他の要素については別ロジックで申請レコードとマージして決定する
		var p = teasp.logic.EmpTime.getPatternByDate(empTypePatterns, d);
		if(p){
			day.pattern = p.pattern;
		}
	}
	return day;
};

teasp.logic.EmpTime.getRealExchangeDate = function(dkey, alst){
	for(var i = 0 ; i < alst.length ; i++){
		var a = alst[i];
		if(a.applyType == teasp.constant.APPLY_TYPE_EXCHANGE
		&& teasp.constant.STATUS_FIX.contains(a.status)) { // 承認済み, 確定済み, 承認待ち, 承認中
			if(a.originalStartDate == dkey){
				return a.exchangeDate;
			}
		}
	}
	return null;
};

/**
 * 開始時刻から休憩時間を除いて所定時間に達する時刻を得る
 *
 * @static
 * @param {number} from 開始時刻
 * @param {Array.<Object>} rests 所定休憩時間
 * @param {number} fixTime 所定時間
 * @return {number|null} 時刻
 */
teasp.logic.EmpTime.getFixTimeSpan = function(from, rests, fixTime){
	var wt = [{ from: from, to: 2880 }];
	var i = 0;
	while(i < rests.length) {
		wt = teasp.util.time.sliceTimes(wt, rests[i]);
		i++;
	}
	var ox = [];
	var tt = 0;
	i = 0;
	while(tt < fixTime && i < wt.length){
		var t = (wt[i].to - wt[i].from);
		if(tt + t > fixTime){
			t = (fixTime - tt);
			wt[i].to = wt[i].from + t;
		}
		ox.push(wt[i]);
		tt += t;
		i++;
	}
	return (ox.length > 0 ? ox[ox.length - 1].to : null);
};

/**
 * 正味時間に到達する時刻を求める
 * （getFixTimeSpan に似ているが念のためわける）
 * @static
 * @param {number} from 開始時刻
 * @param {Array.<Object>} rests 休憩時刻{from:,to:}の配列
 * @param {number} ft 正味時間
 * @return {number} 時刻
 */
teasp.logic.EmpTime.getReachTime = function(from, rests, ft){
	var wt = [{ from: from, to: 2880 }];
	var i = 0;
	while(i < rests.length) {
		wt = teasp.util.time.sliceTimes(wt, rests[i]);
		i++;
	}
	var t = 0;
	var et = -1;
	for(i = 0 ; i < wt.length ; i++){
		t += (wt[i].to - wt[i].from);
		if(t >= ft){
			et = wt[i].to - (t - ft);
			break;
		}
	}
	return et;
};

teasp.logic.EmpTime.getReachTimeReverse = function(to, rests, ft){
	var wt = [{ from: 0, to: to }];
	var i = 0;
	while(i < rests.length) {
		wt = teasp.util.time.sliceTimes(wt, rests[i]);
		i++;
	}
	var t = 0;
	var st = -1;
	for(i = wt.length - 1 ; i >= 0 ; i--){
		t += (wt[i].to - wt[i].from);
		if(t >= ft){
			st = wt[i].from + (t - ft);
			break;
		}
	}
	return st;
};

/**
 * 申請オブジェクトのマップテーブルに含まれているかどうか
 *
 * @static
 * @param {Object} va 申請オブジェクトのマップテーブル
 * @param {Object} a 申請オブジェクト
 * @return {boolean} true:含まれる
 */
teasp.logic.EmpTime.containApply = function(va, a){
	for(var key in va){
		var oa = va[key];
		if(!oa){
			continue;
		}
		if(is_array(oa)){
			for(var j = 0 ; j < oa.length ; j++){
				if(a.id == oa[j].id){
					return true;
				}
			}
		}else if(a.id == oa.id){
			return true;
		}
	}
	return false;
};

/**
 * 開始時刻または終了時刻をずらす
 *
 * @static
 * @param {number} st 開始時刻
 * @param {number} et 終了時刻
 * @param {Array.<Object>} rests 休憩時間
 * @param {number} tm ずらす時間
 * @param {number} defaultVal
 * @param {boolean} flag false:開始時刻をずらす true:終了時刻をずらす
 * @return {number} ずらした時刻
 */
teasp.logic.EmpTime.slideTime = function(st, et, rests, tm, flag){
	/*
	 * 開始時刻(st)から休憩時間を除いて指定時間(tm)後の時刻を得る。
	 */
	var wt = [{ from: st, to: et }];
	var i = 0;
	while(i < rests.length) {
		wt = teasp.util.time.sliceTimes(wt, rests[i]);
		i++;
	}
	var pt = -1;
	var n = tm;
	if(!flag){
		for(i = 0 ; i < wt.length ; i++){
			var t = wt[i].to - wt[i].from;
			if(t >= n){
				pt = wt[i].from + n;
				break;
			}
			n -= t;
		}
	}else{
		for(i = wt.length - 1 ; i >= 0 ; i--){
			var t = wt[i].to - wt[i].from;
			if(t >= n){
				pt = wt[i].to - n;
				break;
			}
			n -= t;
		}
	}
	return (pt < 0 ? (flag ? et : st) : pt);
};
/**
 * 遅刻・早退申請の補填後の出社時刻・退社時刻を得る
 *
 * @param {number} st 出社時刻
 * @param {number} et 退社時刻
 * @param {number} ft flag=falseの場合は始業時刻、trueの場合は終業時刻(*)
 * @param {Object|null} hoten 先に補填を行っていた場合、補填情報
 * @param {Array.<Object>} fixRests 所定休憩
 * @param {Array.<Object>} realRests 入力休憩（時間単位有休含む）
 * @param {Array.<Object>} simRests （時間単位有休含まない）
 * @param {boolean} flag falseの場合は出社時刻の補填、trueの場合は退社時刻の補填
 * @returns {number} 補填後の出社時刻（flag==falseの場合）または退社時刻（flag==trueの場合）
 *
 * (*) 「自己都合でない」遅刻申請・早退申請でも、実際の出社時刻と申請の時刻に乖離があれば
 *      その差分を遅刻または早退としてカウントし、差分については補填しないので、
 *      引数の ft は差分を調整済みの値を渡すこと。
 */
teasp.logic.EmpTime.complementTime = function(st, et, ft, hoten, fixRests, realRests, simRests, defactoRest, flag){
	var realTime = function(t1, t2, rests){
		var st = (t1 < t2 ? t1 : t2);
		var et = (t1 < t2 ? t2 : t1);
		var restTime = teasp.util.time.rangeTime({ from: st, to: et }, rests);
		return (et - st - restTime);
	};

	var ta = realTime(st, et, simRests); // 労働時間(A)
	var tb = realTime(st, et, fixRests);  // 所定どおり休憩をとった場合の労働時間(B)
	if(defactoRest){
		tb -= defactoRest;
	}

	// (A)!=(B) の場合、取ってないか取りすぎた所定休憩があるが、遅刻または早退の時間帯にずらしたことにして補填するためにその時間を得る。
	var rx = (ta - tb); // プラスなら取ってない、マイナスなら取りすぎた、所定休憩時間(C)

	// 一部補填済みの場合、既にずらして取ったことにしているので、減算
	if(hoten){
		rx -= hoten.rx;
	}

	// 戻り値のオブジェクトを用意
	var res = {
		tm     : (!flag ? st : et),            // 補填後の時刻（デフォルト値をとりあえずセット）
		rx     : rx,                           // ずらして取ったことにした所定休憩時間
		work   : 0,                            // 補填で加算された労働時間
		rest   : 0,                            // 補填した時間帯内にある休憩時間
		lateRx : (flag ? 0 : rx),              // 遅刻の時間帯にずらして取得済みとみなす休憩時間
		earlyRx: (flag ? rx : 0),              // 早退の時間帯にずらして取得済みとみなす休憩時間
		ir     : teasp.logic.EmpTime.getIgnoreRests(st, et, rx, fixRests, simRests) // 補填範囲の所定休憩のうち、無視する範囲を得る（#5241）
	};
	realRests = teasp.util.time.excludeRanges(realRests, res.ir);
	var pt  = -1;

	if(!flag){
		var rt = realTime(ft, st, fixRests); // 遅刻時間帯の所定労働時間（全部補填した場合の時間）
		var ht = (rt - rx); // (C)を差し引いた時間が補填する時間になる
		if(ht < 0){
			res.rx += ht; // ずらして取ったことにできなかった所定休憩時間
		}
		if(ht <= 0){
			return res; // 補填はないので出社時刻をそのまま返す
		}
		// 補填後の出社時刻を計算（始業時刻を上限とする）
		var wt = [{ from: ft, to: st }];
		var i = 0;
		while(i < realRests.length) {
			wt = teasp.util.time.sliceTimes(wt, realRests[i]);
			i++;
		}
		for(i = wt.length - 1 ; i >= 0 ; i--){
			var t = wt[i].to - wt[i].from;
			if(t >= ht){
				pt = wt[i].to - ht;
				break;
			}
			ht -= t;
		}
	}else{
		var rt = realTime(et, ft, fixRests); // 早退時間帯の所定労働時間（全部補填した場合の時間）
		var ht = (rt - rx); // (C)を差し引いた時間が補填する時間になる
		if(ht < 0){
			res.rx += ht; // ずらして取ったことにできなかった所定休憩時間
		}
		if(ht <= 0){
			return res; // 補填はないので退社時刻をそのまま返す
		}
		// 補填後の退社時刻を計算（終業時刻を下限とする）
		var wt = [{ from: et, to: ft }];
		var i = 0;
		while(i < realRests.length) {
			wt = teasp.util.time.sliceTimes(wt, realRests[i]);
			i++;
		}
		for(i = 0 ; i < wt.length ; i++){
			var t = wt[i].to - wt[i].from;
			if(t >= ht){
				pt = wt[i].from + ht;
				break;
			}
			ht -= t;
		}
	}
	var t = (pt < 0 ? ft : pt);   // 補填後の時刻
	// 補填で加算された労働時間と、その時間帯にある休憩時間を返す
	if(!flag && t < st){
		res.work = realTime(t, st, realRests);
		res.rest = (st - t - res.work);
	}else if(flag && et < t){
		res.work = realTime(et, t, realRests);
		res.rest = (t - et - res.work);
	}
	res.tm  = t;

	return res;
};
/**
 * 法定休憩時間のチェックの設定を反映させた所定労働時間を得る
 *
 * @param {Object} fromTo 開始・終了時刻
 * @param {Object} pattern 勤務パターン
 * @param {number} fixTime 補正前の所定労働時間
 * @param {Array.<Object>} rcs 法定休憩時間のチェックの設定
 * @returns {number} 補正後の所定労働時間
 */
teasp.logic.EmpTime.getAdjustFixTime = function(fromTo, pattern, fixTime, rcs){
	// (1) 出社～退社の時間帯にある所定休憩の時間を取得
	var fr = teasp.util.time.rangeTime(fromTo, (pattern.restTimes || []));
	// (2) 勤務時間毎の所定休憩時間を取得
	var rcv = 0;
	if((pattern.restTimes || []).length <= 0){ // 所定休憩の設定なし
		for(var i = 0 ; i < rcs.length ; i++){
			if(rcs[i].check){
				if(rcs[i].workTime < fixTime){
					rcv = Math.max(rcv, rcs[i].restTime);
				}
			}
		}
	}
	var frx = Math.max(rcv, fr); // 所定休憩時間決定← (1) と (2) の大きい方
	var n = fromTo.to - fromTo.from - frx;
	if(fixTime < n){ // 所定休憩を引いた開始～終了の時間より補正前の所定労働時間が小さいならそのまま返す
		return fixTime;
	}
	return (frx > fr ? (fixTime - (frx - fr)) : fixTime); // 補正した所定労働時間
};

/**
 * fixSpan のどちらかへ outSpan へ w を追加する
 *
 * @param {Array.<Object>} fixSpan 所定労働の時間帯配列
 * @param {Array.<Object>} outSpan 所定外労働の時間帯配列
 * @param {number} st
 * @param {number} et
 * @param {Object} w {from:, to:}
 * @returns {number}
 */
teasp.logic.EmpTime.entrySpan = function(fixSpan, outSpan, st, et, w){
	var fs = null;
	var os = null;
	if(st == et || w.to <= st || et <= w.from){
		os = { from: w.from , to: w.to };
	}else if(w.from < st){
		os = { from: w.from , to: st   };
		fs = { from: st     , to: w.to };
	}else if(et < w.to){
		fs = { from: w.from , to: et   };
		os = { from: et     , to: w.to };
	}else{
		fs = { from: w.from , to: w.to };
	}
	if(fs){
		fixSpan.push(fs);
	}
	if(os){
		outSpan.push(os);
	}
};

teasp.logic.EmpTime.adjustSpans = function(fixSpan, outSpan, fix, range){
	var ft = teasp.logic.EmpTime.getSpanTime(fixSpan);
	var ot = teasp.logic.EmpTime.getSpanTime(outSpan);
	if(fix < ft){
		teasp.logic.EmpTime.adjustSpan(fixSpan, outSpan, ft - fix, range);
	}else if(ft < fix && outSpan.length > 0){
		var t = Math.min(fix - ft, ot);
		teasp.logic.EmpTime.adjustSpan(fixSpan, outSpan, t * (-1), range);
	}
};

/**
 * fixSpan, outSpan の分配調整
 *
 * @param {Array.<Object>} fixSpan 所定労働の時間帯配列
 * @param {Array.<Object>} outSpan 所定外労働の時間帯配列
 * @param {number} tm >0:fixSpan→outSpan, <0:outSpan->fixSpan
 */
teasp.logic.EmpTime.adjustSpan = function(fixSpan, outSpan, tm, range){
	var fixs = [].concat(fixSpan);
	var outs = [].concat(outSpan);
	if(tm > 0){
		var ft = teasp.logic.EmpTime.getSpanTime(fixs);
		var tt = Math.min(ft, tm);
		for(var i = fixs.length - 1 ; (i >= 0 && tt > 0) ; i--){
			var fs = fixs[i];
			var t = fs.to - fs.from;
			if(t <= tt){
				fixs.splice(i, 1);
				outs.push(fs);
				tt -= t;
			}else{
				var o = { to: fs.to };
				fs.to -= tt;
				o.from = fs.to;
				outs.push(o);
				tt = 0;
			}
		}
		outs = outs.sort(function(a, b){
			return a.from - b.from;
		});
	}else{
		tm = Math.abs(tm);
		var ot = teasp.logic.EmpTime.getSpanTime(outs);
		var tt = Math.min(ot, tm);
		var sp = [];
		var bt = (fixs.length > 0 ? fixs[0].from : -1);
		var outs1 = [];
		var outs2 = [];
		for(var i = 0 ; i < outs.length ; i++){
			var os = outs[i];
			if(bt >= 0 && os.from < bt){
				outs2.push(os);
			}else{
				outs1.push(os);
			}
		}
		for(i = 0 ; (i < outs1.length && tt > 0) ; i++){
			var os = outs1[i];
			var t = (Math.min(os.to, range.to) - os.from);
			if(t > 0){
				if(t <= tt){
					var te = Math.min(os.to, range.to);
					if(te == os.to){
						sp.push(i);
						fixs.push(os);
					}else{
						var o = { from: os.from, to: range.to };
						os.from = range.to;
						fixs.push(o);
					}
					tt -= t;
				}else{
					var o = { from: os.from };
					os.from += tt;
					o.to = os.from;
					fixs.push(o);
					tt = 0;
				}
			}
		}
		if(sp.length > 0){
			for(i = sp.length - 1 ; i >= 0 ; i--){
				outs1.splice(sp[i], 1);
			}
		}
		for(i = outs2.length - 1 ; (i >= 0 && tt > 0) ; i--){
			var os = outs2[i];
			var t = (os.to - Math.max(range.from, os.from));
			if(t > 0){
				if(t <= tt){
					var ts = Math.max(range.from, os.from);
					if(ts == os.from){
						outs2.splice(i, 1);
						fixs.push(os);
					}else{
						var o = { from: range.from, to: os.to };
						os.to = range.from;
						fixs.push(o);
					}
					tt -= t;
				}else{
					var o = { to: os.to };
					os.to -= tt;
					o.from = os.to;
					fixs.push(o);
					tt = 0;
				}
			}
		}
		fixs = fixs.sort(function(a, b){
			return a.from - b.from;
		});
		outs = outs1.concat(outs2);
		outs = outs.sort(function(a, b){
			return a.from - b.from;
		});
	}
	fixSpan.splice(0, fixSpan.length);
	outSpan.splice(0, outSpan.length);
	for(var i = 0 ; i < fixs.length ; i++){
		fixSpan.push(fixs[i]);
	}
	for(var i = 0 ; i < outs.length ; i++){
		outSpan.push(outs[i]);
	}
};

teasp.logic.EmpTime.getSpanTime = function(spans){
	var t = 0;
	for(var i = 0 ; i < spans.length ; i++){
		var s = spans[i];
		if(typeof(s.from) == 'number' && typeof(s.to) == 'number' && s.from < s.to){
			t += (s.to - s.from);
		}
	}
	return t;
};

/**
 * 指定の時間帯のうち時間単位休と重なっている時間を得る。
 * （※所定休憩を除いた時間帯を対象とする）
 *
 * @param {Object} day 時間単位休を含めた timeTable 値, pattern 値を持つオブジェクト
 * @param {number} st 開始時刻
 * @param {number} et 終了時刻
 * @returns {Number}
 */
teasp.logic.EmpTime.prototype.getHolidayTimeInRange = function(day, st, et){
	// 時間単位休の配列を得る
	var tt = day.timeTable || [];
	var hl = [];
	for(var i = 0 ; i < tt.length ; i++){
		if(tt[i].type == teasp.constant.REST_PAY){
			hl.push(tt[i]);
		}
	}
	if(hl.length <- 0){ // 時間単位休がないなら 0 を返す
		return 0;
	}
	// 所定休憩を除いた時間帯の配列を得る(a)
	var ranges = teasp.util.time.excludeRanges([{ from:st, to:et }], day.pattern.restTimes);
	// (a)の配列のうち、時間単位休と重なっている時間を得る
	var t = 0;
	for(i = 0 ; i < ranges.length ; i++){
		t += teasp.util.time.rangeTime(ranges[i], hl);
	}
	return t;
};

/**
 * timeTable から所定休憩時間、私用休憩時間を取り出し day に情報をセット
 *
 * @param {Object} day
 * @param {Array.<Object>=} ex
 */
teasp.logic.EmpTime.prototype.readTimeTable = function(day, ex){
	if(ex && ex.length){
		day.timeTable = teasp.logic.EmpTime.rebuildTimeTable(day.timeTable, ex);
	}
	day.rack.freeRests = [];
	day.rack.fixRests  = [];
	day.rack.awayTimes = [];
	for(var i = 0 ; i < day.timeTable.length ; i++){
		var t = day.timeTable[i];
		if(t.from === null || t.to === null){
			continue;
		}
		if(t.type == teasp.constant.REST_FREE
		|| t.type == teasp.constant.REST_FIX){
			if(teasp.logic.EmpTime.isFixRest(t, day.pattern.restTimes)){
				day.rack.fixRests.push(t);
			}else{
				day.rack.freeRests.push(t);
			}
		}else if(t.type == teasp.constant.AWAY){
			day.rack.awayTimes.push(t);
		}
	}
	if(day.rack.holySpans.length > 0){
		// 午前半休、午後半休を取得した場合、半休適用時間内にある所定休憩は、計算上カウントする。
		// もしなければ強制で入れる（終日休の場合もここをとおるが、害はない。時間単位休の中の
		// 所定休憩は削除できるが、この時点では、day.rack.paidHolySpans に時間単位休は含まれてない）。
		var fr1 = teasp.util.time.excludeRanges(day.rack.fixRests, day.rack.holySpans);
		var fr2 = teasp.util.time.includeRanges(day.rack.holySpans, day.pattern.restTimes);
		day.rack.fixRests  = fr1.concat(fr2);
		day.rack.freeRests = teasp.util.time.excludeRanges(day.rack.freeRests, day.rack.holySpans);
	}
	this.rebuildRestTimes(day);
};

/**
 * 休憩時間の配列を再構築する
 * 再出社打刻を行うと前の退社時刻～再出社時刻の間に無給休憩が挿入されるが、時間単位休申請がある場合、重複する状態となる（V5-995）。
 * その状態は勤怠計算では想定外であるため、計算処理を行う前に重複を除去する。
 * 対象: day.rack 下の fixRests, freeRests, timeTable
 * @param {Object} day
 */
teasp.logic.EmpTime.prototype.rebuildRestTimes = function(day){
	const va = day.rack.validApplys; // 申請情報
	var freeRests = day.rack.freeRests || []; // 再構築前の無給休憩
	const orgFreeRestTime = teasp.logic.EmpTime.getSpanTime(freeRests); // 再構築前の無給休憩時間合計
	if(!orgFreeRestTime){ // 無給休憩がない場合は不要のため終了
		return;
	}
	var fixRestsInApply = []; // 時間単位休の範囲に含まれる所定休憩を入れる変数
	// 無給休憩から時間単位休と重なる部分を除去
	for(var i = 0 ; i < va.holidayTime.length ; i++){
		var ht = va.holidayTime[i];
		const applyRanges = [{from:ht.startTime,to:ht.endTime}]; // 時間単位休の範囲
		if(freeRests.length){
			freeRests = teasp.util.time.excludeRanges(freeRests, applyRanges); // 無給休憩から時間単位休を除去
		}
		const fr = teasp.util.time.includeRanges(applyRanges, day.pattern.restTimes); // 時間単位休内に設定されている所定休憩を得る
		if(fr.length){
			fixRestsInApply = fixRestsInApply.concat(fr);
		}
	}
	const newFreeRestTime = teasp.logic.EmpTime.getSpanTime(freeRests); // 再構築後の無給休憩時間合計
	if(orgFreeRestTime == newFreeRestTime){ // 再構築前後で無給休憩時間が変わらなければ時間単位休との重複はなかったと判断して終了
		return;
	}

	// timeTable の値を再構築
	// 無給休憩の要素をいったん削除
	var timeTable = day.timeTable || []; // 再構築前のタイムテーブル
	for(var i = timeTable.length - 1 ; i >= 0 ; i--){
		if(!teasp.logic.EmpTime.isFixRest(timeTable[i], day.pattern.restTimes)){
			timeTable.splice(i, 1);
		}
	}
	// 時間単位休と重なる部分を除去した無給休憩をマージ
	for(var i = 0 ; i < freeRests.length ; i++){
		timeTable.push({
			from: freeRests[i].from,
			to  : freeRests[i].to,
			type: teasp.constant.REST_FREE
		});
	}
	// 時間単位休の範囲に含まれる所定休憩のうち、timeTable に含まれない部分を抽出してマージ
	fixRestsInApply = teasp.util.time.excludeRanges(fixRestsInApply, timeTable);
	const fixRests = day.rack.fixRests; // 再構築前の所定休憩
	if(fixRestsInApply.length){
		for(var i = 0 ; i < fixRestsInApply.length ; i++){
			const fria = fixRestsInApply[i];
			const rest = {
				from: fria.from,
				to  : fria.to,
				type: teasp.constant.REST_FIX
			};
			timeTable.push(rest);
			fixRests.push(rest);
		}
	}
	day.rack.freeRests = freeRests;
	day.rack.fixRests = fixRests;
	day.rack.timeTable = timeTable;
};

teasp.logic.EmpTime.isFixRest = function(rest, restTimes){
	var ts = restTimes || [];
	for(var i = 0 ; i < ts.length ; i++){
		if(ts[i].from <= rest.from && rest.to <= ts[i].to){
			return true;
		}
	}
	return false;
};

/**
 * 補填対象内に所定休憩(a)があり、補填対象外の所定時間内に私用休憩(b)がある場合、
 * (a) を (b) へずらしたことにする。
 * そのチェックを行い、該当がある場合は補填対象内の所定休憩の削除処理を行い、
 * day に持たせる情報を更新する。
 *
 * @param {Object} day
 */
teasp.logic.EmpTime.prototype.preHoten = function(day){
	var fst = day.rack.bdrStartTime;
	var fet = day.rack.bdrEndTime;
	var lateStart = day.rack.validApplys.lateStart; // 遅刻申請
	var earlyEnd  = day.rack.validApplys.earlyEnd;  // 早退申請

	var mixRests = day.rack.freeRests.concat(day.rack.fixRests); // 所定休憩と私用外出を合わせた配列を作成
	var honRests = teasp.util.time.includeRanges(teasp.util.time.margeTimeSpans(mixRests.concat(day.rack.hourRests)), [{ from: fst, to: fet }]); // 所定時間内の所定休憩と私用外出
	honRests = honRests.concat(teasp.util.time.excludeRanges(day.pattern.restTimes, [{ from: fst, to: fet }]));
	var simRests = teasp.util.time.includeRanges(mixRests, [{ from: fst, to: fet }]); // 所定時間内の所定休憩と私用外出
	simRests = simRests.concat(teasp.util.time.excludeRanges(day.pattern.restTimes, [{ from: fst, to: fet }]));
	var pubRests = teasp.util.time.margeTimeSpans(day.pattern.restTimes.concat(day.rack.hourRests));
	var extRests = teasp.util.time.margeTimeSpans(pubRests.concat(day.rack.excludeHalf));

	var defactoRest = 0;
	if((day.pattern.restTimes || []).length <= 0){
		var restraint = (fet - fst); // 拘束時間
		var rcs = this.pouch.getRestTimeCheck(); // 法定休憩時間のチェック
		for(var i = 0 ; i < rcs.length ; i++){
			if(rcs[i].check){
				if(rcs[i].workTime < restraint){ // 「終業時刻－始業時刻－（時間単位休）」と比較
					defactoRest = Math.max(defactoRest, rcs[i].restTime);
				}
			}
		}
	}

	var st = day.startTime; // 出社時刻
	var et = day.endTime;   // 退社時刻

	var hoten = null; // 補填情報用

	if(typeof(st) == 'number'
	&& st > fst // 出社時刻が始業時刻より遅い
	&& lateStart // 遅刻申請あり
	&& teasp.constant.STATUS_FIX.contains(lateStart.status)){ // 有効な申請
		// 申請の終了時刻より出社時刻が遅い
		var leto = Math.min(lateStart.endTime, fet);
		var latePlus = (leto < st ? this.getRealTime(leto, st, extRests) : 0);
		if(day.rack.hotenLate){ // 遅刻補填
			var fstw = fst; // 所定の始業時刻
			if(latePlus){ // 遅刻申請の時刻＜実際の出社時刻なので発生した遅刻時間
				fstw = teasp.logic.EmpTime.slideTime(fst, et, pubRests, latePlus, false); // 補填対象外なので始業時刻調整
			}
			// 補填後の出社時刻を得る
			hoten = teasp.logic.EmpTime.complementTime(
					st,
					et,
					fstw,
					hoten,
					day.pattern.restTimes,
					honRests,
					simRests,
					defactoRest,
					false);
			st = hoten.tm;
			if(hoten.ir.length){ // 削除するべき所定休憩がある
				this.readTimeTable(day, hoten.ir);
			}
		}
	}
	if(typeof(et) == 'number'
	&& et < fet // 退社時刻が終業時刻より早い
	&& earlyEnd // 早退申請あり
	&& teasp.constant.STATUS_FIX.contains(earlyEnd.status)){ // 有効な申請
		var est = Math.max(earlyEnd.startTime, fst);
		var earlyPlus = (et < est ? this.getRealTime(et, est, extRests) : 0); // 申請の開始時刻より退社時刻が早い
		if(day.rack.hotenEarlyEnd){ // 早退補填
			var fetw = fet; // 所定の終業時刻
			if(earlyPlus){ // 実際の退社時刻＜早退申請の時刻なので発生した早退時間
				fetw = teasp.logic.EmpTime.slideTime(st, fet, pubRests, earlyPlus, true); // 補填対象外なので終業時刻調整
			}
			// 補填後の退社時刻を得る
			hoten = teasp.logic.EmpTime.complementTime(
					st,
					et,
					fetw,
					hoten,
					day.pattern.restTimes,
					honRests,
					simRests,
					defactoRest,
					true);
			et = hoten.tm;
			if(hoten.ir.length){ // 削除するべき所定休憩がある
				this.readTimeTable(day, hoten.ir);
			}
		}
	}
};
/**
 * timeTable 変数から所定休憩を削除して、timeTable 変数の再構築をする。
 *
 * @param {Array.<Object>} timeTable
 * @param {Array.<Object>} ex
 */
teasp.logic.EmpTime.rebuildTimeTable = function(timeTable, ex){
	var fixRests = [];
	var others = [];
	// timeTable から所定休憩を抽出
	for(var i = 0 ; i < timeTable.length ; i++){
		var t = timeTable[i];
		if(t.from !== null && t.to !== null && t.type == teasp.constant.REST_FIX){
			fixRests.push(t);
		}else{
			others.push(t);
		}
	}
	// fixRests から ex を削除
	fixRests = teasp.util.time.excludeRanges(fixRests, ex);
	// 新しい timeTable を作成する
	var tt = others;
	for(var i = 0 ; i < fixRests.length ; i++){
		var o = fixRests[i];
		tt.push({
			from: o.from,
			to  : o.to,
			type: teasp.constant.REST_FIX
		});
	}
	return tt;
};

/**
 * 補填対象範囲内にある所定休憩のうち、削除対象を得る
 *
 * @param {number} st 出社時刻
 * @param {number} et 退社時刻
 * @param {number} rx マイナスの場合、所定休憩を削除する
 * @param {Array.<Object>} fixRests
 * @param {Array.<Object>} realRests
 * @returns {Array.<Object>}
 */
teasp.logic.EmpTime.getIgnoreRests = function(st, et, rx, fixRests, realRests){
	var ex = [];
	if(rx >= 0){
		// rx >= 0 の場合、勤務時間内で所定休憩を返上していることを意味する。
		// その場合は補填対象範囲の所定休憩を削る必要はないので、空を返す。
		return ex;
	}
	// 出社～退社の範囲内の所定休憩のリストを得る
	var os = teasp.util.time.excludeRanges(fixRests, [{ from: st, to: et }]);
	// rx < 0 の場合、(所定外の)休憩を取っている。補填対象範囲内の所定休憩を
	// そこへずらしたことにしたいので、rx の分だけ補填対象範囲内の所定休憩を削除する
	var t = Math.abs(rx);
	var i = os.length - 1;
	while(t > 0 && i >= 0){
		var o = os[i];
		var n = o.to - o.from;
		if(t < n){
			ex.push({ from: o.from + (n - t), to: o.to });
		}else{
			ex.push(o);
		}
		t -= n;
		i--;
	}
	return ex; // 補填対象範囲内にある所定休憩のうち、削除対象にする時間帯
};

/**
 * 裁量労働の場合にいったん実時間で出した法定時間外割増をみなし時間に訂正する
 * （calculateEmpDays() の処理後に呼ばれること）
 * @param {Object} day
 * @param {boolean} useDiscretionary trueなら裁量労働制
 */
teasp.logic.EmpTime.prototype.correctDiscChargeTime = function(day, useDiscretionary){
	if(!day || !day.pattern || (!day.pattern.useDiscretionary && !useDiscretionary)){ // 裁量労働でなければ不要
		return;
	}
	var ot = day.real.workChargeTime || 0; // 実時間の法定時間外割増（これを訂正する）
	var dt = day.disc.workChargeTime || 0; // みなしの法定時間外割増
	if(ot == dt){ // 法定時間外割増が実時間・みなしとも同じなら不要（未入力の場合もここ）
		return;
	}
	var os = day.real.workChargeSpan || []; // 実時間の法定時間外割増時間帯（これを訂正する）
	var ns = new Array();
	if(ot > dt){ // 法定時間外割増が実時間の方がみなしより大きい→削る
		var zt = dt;
		for(var i = os.length - 1 ; i >= 0 ; i--){
			var s = os[i];
			var t = s.to - s.from;
			if(zt <= t){
				ns.push({
					from: s.to - zt,
					to  : s.to
				});
				break;
			}else{
				ns.push(s);
			}
			zt -= t;
		}
	}else{ // 法定時間外割増がみなしの方が実時間より大きい→実時間に追加する
		var los = dojo.clone(day.real.workLegalOverSpan || []);
		los = los.sort(function(a, b){
			return a.to - b.to;
		});
		var rngs = 48*60;
		if(los.length > 0){
			rngs = los[0].from;
		}
		if(day.real.workInFixedSpan && day.real.workInFixedSpan.from < rngs){
			rngs = day.real.workInFixedSpan.from;
		}
		var rnge = (los.length > 0 ? los[los.length - 1].to : day.real.endTime);
		var it = 0;
		for(var i = 0 ; i < os.length ; i++){
			var s = os[i];
			it += (s.to - s.from);
			if(rnge > s.from){
				rnge = s.from;
			}
		}
		zt = (dt - it); // 不足分
		var rs = new Array();
		var wt = [{ from: rngs, to: rnge }];
		// 休憩を除外
		var tt = day.timeTable || [];
		for(var i = 0 ; i < tt.length ; i++){
			var t = tt[i];
			if(typeof(t.from) != 'number' || typeof(t.to) != 'number'){
				continue;
			}
			if(t.type == teasp.constant.REST_FREE
			|| t.type == teasp.constant.REST_FIX
			|| t.type == teasp.constant.REST_PAY
			|| t.type == teasp.constant.REST_UNPAY){
				rs.push(t);
			}
		}
		i = 0;
		while(i < rs.length) {
			wt = teasp.util.time.sliceTimes(wt, rs[i]);
			i++;
		}
		for(var i = wt.length - 1 ; i >= 0 ; i--){
			var s = wt[i];
			var t = s.to - s.from;
			if(zt <= t){
				ns.push({
					from: s.to - zt,
					to  : s.to
				});
				break;
			}else{
				ns.push(s);
			}
			zt -= t;
		}
		if(os.length){
			ns = ns.concat(os);
		}
	}
	ns = ns.sort(function(a, b){
		return a.from - b.from;
	});
	day.real.workChargeTime = dt;
	day.real.workChargeSpan = ns;
};

/**
 * TimeTable配列のオブジェクトの type が一致する要素の配列を作って返す
 *
 * @param {Array.<Object>|string|null} timeTable
 * @param {number|Array.<number>} type
 * @param {number=} flag 要素に値がセットされていることを保証する(bit1=on:from, bit2=on:to)
 * @return {Array.<Object>}
 */
teasp.logic.EmpTime.filterTimeTable = function(timeTable, type, flag){
	var tt = (timeTable && typeof(timeTable) == 'string' ? dojo.fromJson(timeTable) : timeTable) || [];
	var n = flag || 0;
	var res = [];
	var types = (dojo.isArray(type) ? type : [type]);
	for(var i = 0 ; i < tt.length ; i++){
		if(types.indexOf(tt[i].type) >= 0
		&& (!(n & 1) || typeof(tt[i].from) == 'number')
		&& (!(n & 2) || typeof(tt[i].to)   == 'number')){
			res.push(tt[i]);
		}
	}
	return res;
};

/**
 * 休憩と出社・退社時刻が接するかチェック
 * @parma {*} st
 * @parma {*} et
 * @parma {Array.<Object>|string|null} timeTable
 * @return {boolean} true:NG
 */
teasp.logic.EmpTime.checkBorderRestTime = function(st, et, timeTable){
	var tt = (timeTable && typeof(timeTable) == 'string' ? dojo.fromJson(timeTable) : timeTable) || [];
	for(var i = 0 ; i < tt.length ; i++){
		var t = tt[i];
		if((t.type == teasp.constant.REST_FIX || t.type == teasp.constant.REST_FREE)
		&& typeof(t.from) == 'number' && typeof(t.to) == 'number'){
			if((typeof(st) == 'number' && t.from <= st && st <  t.to)
			|| (typeof(et) == 'number' && t.from <  et && et <= t.to)){
				return true;
			}
		}
	}
	return false;
};

/**
 * 出社・退社時刻が休憩時間に含まれる場合、調整する
 * @param {Object} inp
 * @param {number} bit1=ON:fromを調整、bit2=ON:toを調整
 * @returns {Object}
 */
teasp.logic.EmpTime.adjustInputTime = function(inp, adjust){
	var rests = teasp.logic.EmpTime.filterTimeTable(inp.rests, [teasp.constant.REST_FIX, teasp.constant.REST_FREE], 3);
	rests = rests.sort(function(a, b){
		return (a.from == b.from ? (a.from - b.from) : (a.to - b.to));
	});
	// 開始時刻と休憩が重なっていたら、休憩の終了時刻にずらす
	if((adjust & 1) && typeof(inp.from) == 'number'){
		for(var i = 0 ; i < rests.length ; i++){
			var rest = rests[i];
			if(rest.from <= inp.from && inp.from < rest.to){
				inp.from = rest.to;
			}
		}
	}
	// 終了時刻と休憩が重なっていたら、休憩の開始時刻にずらす
	if((adjust & 2) && typeof(inp.to) == 'number'){
		for(var i = rests.length - 1 ; i >= 0 ; i--){
			var rest = rests[i];
			if(rest.from < inp.to && inp.to <= rest.to){
				inp.to = rest.from;
			}
		}
	}
	return inp;
};

/**
 * 下記のどちらかに該当すれば、true を返す
 * ・出社時刻より前に半休や時間単位休がある
 * ・退社時刻より後に半休や時間単位休がある
 * ※ 出退社時刻のどちらか未入力なら false を返す
 * @param {Object} day
 * @returns {Boolean}
 */
teasp.logic.EmpTime.prototype.existPaidRestOutsideWork = function(day){
	var st = day.startTime;
	var et = day.endTime;
	if(typeof(st) == 'number' && typeof(et) == 'number'){
		var holySpans = day.rack.holySpans || [];
		for(var i = 0 ; i < holySpans.length ; i++){
			var h = holySpans[i];
			if(h.from < st || et < h.to){
				return true;
			}
		}
	}
	return false;
};
/**
 * 期間内に休日がある休暇申請を日付でマッピングしたオブジェクトを返す
 * @param {Array.<Object>} applys
 * @returns {Object}
 */
teasp.logic.EmpTime.prototype.getHolidayExcludeMap = function(applys){
	var amap = {};
	for(var i = 0 ; i < applys.length ; i++){
		var apply = applys[i];
		if(!apply.holiday
		|| !teasp.constant.STATUS_FIX.contains(apply.status)
		|| apply.holiday.displayDaysOnCalendar
		|| apply.excludeDate.length == 0){
			continue;
		}
		var dlst = teasp.util.date.getDateList(apply.startDate, apply.endDate);
		for(var j = 0 ; j < dlst.length ; j++){
			var dkey = dlst[j];
			if(apply.excludeDate.contains(dkey)){
				if(!amap[dkey]){
					amap[dkey] = [];
				}
				amap[dkey].push(apply);
			}
		}
	}
	return amap;
};
