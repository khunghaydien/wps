if(typeof(teasp) == 'object' && !teasp.resolved['8117'] && teasp.logic && teasp.logic.EmpTime){
teasp.logic.EmpTime.prototype.mergeEmpDays = function(common, config, days, applys, sd, ed){
	var startOfWeek = parseInt(config.initialDayOfWeek, 10); // 起算曜日を取得
	var amap        = this.getApplyDateMap(applys);               // 日付と申請情報のマッピングテーブル作成
	var edplus = teasp.util.date.addDays(ed, 7);
	var weekObjs    = teasp.logic.EmpTime.createWeekObjs(sd, edplus, startOfWeek, dojo.hitch(this.pouch, this.pouch.isAlive));   // 開始日～終了日の翌日の週次情報オブジェクト作成
	var dlst        = teasp.logic.EmpTime.getDateListByWeekObjs(weekObjs);       // 開始日を含む週の起算日～月度の末日までの日付リスト作成
	// 対象日初日の前日のオブジェクトを得る
	var yesterday = days[teasp.util.date.formatDate(teasp.util.date.addDays(teasp.util.date.parseDate(dlst[0]), -1))];
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
		/*
		 * 日次情報のマージ
		 */
		var day = this.mergeEmpDay(days, dkey, (amap[dkey] || []), dlst2, config);
		if(!dlst.contains(dkey)){
			continue;
		}
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
		if(yesterday && yesterday.endTime > 1440 && !config.extendDayType){
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
				//-------------------------------------------------
				var x = -1;
				for(j = 0 ; j < hlst.length ; j++){
					if(x >= 0){
						lday = hlst[j];
						if(lday.dayType == teasp.constant.DAY_TYPE_NORMAL){
							lday.workFlag = true;
							lday.autoLH = true;
						}
						lday.dayType = teasp.constant.DAY_TYPE_LEGAL_HOLIDAY;
						break;
					}
					if(hlst[j].rack.key == lday.rack.key){
						x = j;
					}
				}
				//-------------------------------------------------
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
}
