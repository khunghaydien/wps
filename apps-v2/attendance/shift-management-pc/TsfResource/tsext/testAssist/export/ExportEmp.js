define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/export/ExportObj",
	"tsext/testAssist/HistoryRange",
	"tsext/testAssist/export/ExportVirMonth",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, ExportObj, HistoryRange, ExportVirMonth, Constant, Util){
	// 勤怠社員
	return declare("tsext.testAssist.ExportEmp", ExportObj, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.ExportManager} manager
		 * @param {Object} obj
		 * @param {tsext.testAssist.ExportObjs=} parent
		 */
		constructor: function(manager, obj, parent){
			this.obj.EntryDate__c = Util.formatDate(this.obj.EntryDate__c);
			this.obj.EndDate__c = Util.formatDate(this.obj.EndDate__c);
			this.obj.DeptStartDate__c = Util.formatDate(this.obj.DeptStartDate__c);
			this.obj.NextYuqProvideDate__c = Util.formatDate(this.obj.NextYuqProvideDate__c);
			this.empTypeHistory = (this.obj.EmpTypeHistory__c && Util.fromJson(this.obj.EmpTypeHistory__c)) || null;
			this.empMonths = [];       // 勤怠月次
			this.historyRanges = [];   // 勤務体系履歴
			this.virMonths = [];       // 月次情報（勤怠月次がなくても最小日付～最大日付の範囲の月次オブジェクトを作成）
			this.minDate = null;       // 最小日付
			this.maxDate = null;       // 最大日付
			this.clearCollect();
		},
		clearCollect: function(){
			array.forEach(this.empMonths, function(empMonth){ empMonth.clearCollect();});
			this.empApplys = [];       // 勤怠申請
			this.empYuqs = [];         // 勤怠有休
			this.empStockMap = {};     // 勤怠積休
		},
		getEmpCode: function(){
			return this.obj.EmpCode__c || '';
		},
		getRealName: function(){
			if(this.manager.isHideEmpName()){
				return this.getEmpCode() || this.getId();
			}
			return this.obj.Name;
		},
		getEmpCodeAndName: function(){
			var empCode = this.getEmpCode();
			return (empCode ? empCode + '  ' : '') + this.obj.Name;
		},
		addEmpMonth: function(empMonth){
			this.empMonths.push(empMonth);
		},
		addEmpApply: function(empApply){
			this.empApplys.push(empApply);
		},
		addEmpYuq: function(empYuq){
			this.empYuqs.push(empYuq);
		},
		addEmpYuqDetail: function(empYuqDetail){
			var empYuq = this.getEmpYuqById(empYuqDetail.getEmpYuqId());
			if(empYuq){
				empYuq.addDetail(empYuqDetail);
			}
		},
		getEmpYuqById: function(id){
			for(var i = 0 ; i < this.empYuqs.length ; i++){
				var empYuq = this.empYuqs[i];
				if(empYuq.getId() == id){
					return empYuq;
				}
			}
			return null;
		},
		addEmpStock: function(empStock){
			var stocks = this.empStockMap[empStock.getType()];
			if(!stocks){
				stocks = this.empStockMap[empStock.getType()] = [];
			}
			stocks.push(empStock);
		},
		addEmpStockDetail: function(empStockDetail){
			var empStock = this.getEmpStockById(empStockDetail.getConsumedByStockId());
			if(empStock){
				empStock.addDetail(empStockDetail);
			}
		},
		getEmpStockById: function(id){
			for(var key in this.empStockMap){
				var stocks = this.empStockMap[key];
				for(var i = 0 ; i < stocks.length ; i++){
					var empStock = stocks[i];
					if(empStock.getId() == id){
						return empStock;
					}
				}
			}
			return null;
		},
		sortEmpMonths: function(){
			this.empMonths = this.empMonths.sort(function(a, b){
				return (a.getStartDate() < b.getStartDate() ? -1 : 1);
			});
		},
		sortEmpDays: function(){
			for(var i = 0 ; i < this.empMonths.length ; i++){
				this.empMonths[i].sortEmpDays();
			}
		},
		sortEmpYuqs: function(){
			this.empYuqs = this.empYuqs.sort(function(a, b){
				return a.compare(b);
			});
		},
		sortEmpStocks: function(){
			for(var key in this.empStockMap){
				var stocks = this.empStockMap[key];
				console.log('key=' + key + ' --------------');
				for(var i = 0 ; i < stocks.length ; i++){
					var stock = stocks[i];
					console.log((stock.isProvide() ? 'P' : ' ') + ',' + (stock.isLostFlag() ? 'L' : ' ') + ',' + stock.getId() + ',' + (stock.isLostFlag() ? stock.getMinusStockId() : ''));
				}
				stocks = stocks.sort(function(a, b){
					return a.compare(b);
				});
			}
		},
		searchDateRange: function(){
			var mind = null, maxd = null;
			for(var i = 0 ; i < this.empMonths.length ; i++){
				var empMonth = this.empMonths[i];
				if(!mind || mind > empMonth.getStartDate()){ mind = empMonth.getStartDate(); }
				if(!maxd || maxd < empMonth.getEndDate()  ){ maxd = empMonth.getEndDate();   }
			}
			for(var i = 0 ; i < this.empApplys.length ; i++){
				var empApply = this.empApplys[i];
				var sd = empApply.getStartDate(), ed = empApply.getEndDate();
				if(empApply.getApplyType() == '振替申請'){
					if(sd > empApply.getOriginalStartDate()){ sd = empApply.getOriginalStartDate(); }
					if(sd > empApply.getExchangeDate()     ){ sd = empApply.getExchangeDate();      }
					if(ed < empApply.getOriginalStartDate()){ ed = empApply.getOriginalStartDate(); }
					if(ed < empApply.getExchangeDate()     ){ ed = empApply.getExchangeDate();      }
				}
				if(!mind || mind > sd){ mind = sd; }
				if(!maxd || maxd < ed){ maxd = ed; }
			}
			var sd = this.manager.getTargetStartDate();
			var ed = this.manager.getTargetEndDate();
			if(!mind || mind > sd){ mind = sd; }
			if(!maxd || maxd < ed){ maxd = ed; }
			return {minDate:mind, maxDate:maxd};
		},
		/**
		 * 仮想月度を作成する。
		 * ※ 必要なデータ（勤務体系）が読み込まれてから行う。
		 */
		buildEmp: function(){
			this.historyRanges = this.buildHistoryRanges();
			var dateRange = this.searchDateRange();
			this.virMonths = this.buildVirMonths(dateRange.minDate, dateRange.maxDate);
			this.mergeVirMonths();
		},
		/**
		 * 勤務体系履歴を解析
		 * ※ tsext.empView.Emp の getHistoryRanges() と同じ
		 */
		buildHistoryRanges: function(){
			var eths = [];
			dojo.forEach(this.empTypeHistory, function(eth){
				if(eth.date && eth.empTypeId && this.manager.getEmpTypeById(eth.empTypeId)){
					eths.push(eth);
				}
			}, this);
			eths = eths.sort(function(a, b){
				return (a.date < b.date ? -1 : 1);
			});
			var hists = [];
			var xd = null;
			dojo.forEach(eths, function(eth){
				var hist = {
					sd: xd,
					ed: moment(eth.date, 'YYYY-MM-DD').add(-1, 'd').format('YYYY-MM-DD'),
					empType: this.manager.getEmpTypeById(eth.empTypeId)
				};
				hists.push(hist);
				xd = eth.date;
			}, this);
			hists.push({
				sd: xd,
				ed: null,
				empType: this.manager.getEmpTypeById(this.getEmpTypeId())
			});
			var hrs = [];
			var prevHr = null;
			dojo.forEach(hists, function(hist){
				var hr = new HistoryRange({
					sd: hist.sd,
					ed: hist.ed,
					et: hist.empType,
					prevHr: prevHr
				});
				prevHr = hr;
				hrs.push(hr);
			}, this);
			return hrs;
		},
		/**
		 * 仮想月度を作成
		 * ※ tsext.empView.Emp の buildVirMonths() と同じ
		 */
		buildVirMonths: function(sd, ed){
			var YMD = 'YYYY-MM-DD';
			var d  = moment(sd, YMD).add(-12, 'M').format(YMD);
			var ld = moment(ed, YMD).add(2  , 'M').format(YMD);
			var hrs = this.historyRanges || [];
			var ymMap = {};
			var vms = [];
			var serialNo = 0;
			var prevInid = null;
			while(d <= ld){
				var hr = null;
				for(var i = 0 ; i < hrs.length ; i++){
					if(hrs[i].contains(d)){
						hr = hrs[i];
						break;
					}
				}
				var ym = hr.getYearMonth(d);
				var sn = ymMap[ym] || 0;
				ymMap[ym] = sn + 1;
				var vm = {
					ym       : ym,
					subNo    : sn,
					sd       : hr.getStartDate(ym),
					ed       : hr.getEndDate(ym),
					empType  : hr.getEmpType(),
					inid     : hr.getInitialDate(),
					serialNo : ++serialNo
				};
				var yms = vm.empType.getYmListOfYear(vm.ym);
				vm.changeSd = (vm.ym == yms[0] || vm.inid != prevInid); // 起算月または起算日変更した最初の月
				vm.changeEt = (hr.getStartDate() == hr.getStartDate(ym)); // 勤務体系変更後の最初の月
				prevInid = vm.inid;
				vms.push(vm);
				d = moment(vm.ed, YMD).add(1, 'd').format(YMD);
			}
			var virMonths = [];
			for(var i = 0 ; i < vms.length ; i++){
				virMonths.push(new ExportVirMonth(this.manager, vms[i]));
			}
			return virMonths;
		},
		/**
		 * 仮想月度の情報に勤怠月次を紐づけ
		 */
		mergeVirMonths: function(){
			for(var i = 0 ; i < this.virMonths.length ; i++){
				var virMonth = this.virMonths[i];
				var empMonth = this.getEmpMonthByDate(virMonth.getStartDate());
				if(empMonth){
					virMonth.setEmpMonth(empMonth);
				}
				virMonth.setEmpApplys(this.empApplys);
			}
		},
		/**
		 * 仮想月度配列の最初の月～最後の月の基本情報を返す
		 * @returns {Object}
		 */
		getFullRange: function(){
			var v1 = this.virMonths[0];
			var v2 = this.virMonths[this.virMonths.length - 1];
			return {
				from: {
					sd: v1.getStartDate(),
					ed: v1.getEndDate(),
					ym: v1.getYearMonth(1)
				},
				to: {
					sd: v2.getStartDate(),
					ed: v2.getEndDate(),
					ym: v2.getYearMonth(1)
				}
			};
		},
		/**
		 * 月度の配列を返す
		 * 勤怠月次が存在する月度と引数で指定された範囲にかかる月度を含める
		 * @param {Object=} 範囲
		 * @returns {Array.<Object>}
		 */
		 getEmpMonthYmList: function(defaultRange){
			var ymList = [];
			for(var i = 0 ; i < this.virMonths.length ; i++){
				var virMonth = this.virMonths[i];
				var em = virMonth.getEmpMonth();
				var hit = (defaultRange && virMonth.getStartDate() <= defaultRange.ed && defaultRange.sd <= virMonth.getEndDate());
				if(em || hit){
					ymList.push({
						sd: virMonth.getStartDate(),
						ed: virMonth.getEndDate(),
						ym: virMonth.getYearMonth(1),
						empMonthId: (em ? em.getId() : null),
						target: hit
					});
				}
			}
			return ymList;
		},
		getEmpMonthById: function(id){
			var ids = [];
			for(var i = 0 ; i < this.empMonths.length ; i++){
				if(this.empMonths[i].getId() == id){
					return this.empMonths[i];
				}
			}
			return null;
		},
		getEmpTypeId: function(){
			return this.obj.EmpTypeId__c;
		},
		/**
		 * 社員、社員の勤務体系履歴、勤怠月次に紐づくすべての勤務体系IDを返す
		 * @returns {Array.<string>}
		 */
		getEmpTypeIds: function(){
			var ids = [];
			ids.push(this.obj.EmpTypeId__c);
			var eths = this.empTypeHistory || [];
			for(var i = 0 ; i < eths.length ; i++){
				var eth = eths[i];
				if(eth.date && eth.empTypeId){
					Util.mergeList(ids, eth.empTypeId);
				}
			}
			for(var i = 0 ; i < this.empMonths.length ; i++){
				Util.mergeList(ids, this.empMonths[i].getEmpTypeId());
			}
			return ids;
		},
		getConfigIds: function(){
			var ids = [];
			for(var i = 0 ; i < this.empMonths.length ; i++){
				Util.mergeList(ids, this.empMonths[i].getConfigId());
			}
			return ids;
		},
		getPatternIds: function(){
			var ids = [];
			for(var i = 0 ; i < this.empMonths.length ; i++){
				Util.mergeList(ids, this.empMonths[i].getPatternIds());
			}
			for(var i = 0 ; i < this.empApplys.length ; i++){
				Util.mergeList(ids, this.empApplys[i].getPatternId());
			}
			return ids;
		},
		getHolidayIds: function(){
			var ids = [];
			for(var i = 0 ; i < this.empMonths.length ; i++){
				Util.mergeList(ids, this.empMonths[i].getHolidayIds());
			}
			for(var i = 0 ; i < this.empApplys.length ; i++){
				Util.mergeList(ids, this.empApplys[i].getHolidayId());
			}
			return ids;
		},
		getEmpMonthByDate: function(d){
			for(var i = 0 ; i < this.empMonths.length ; i++){
				var empMonth = this.empMonths[i];
				if(empMonth.getStartDate() <= d && d <= empMonth.getEndDate()){
					return empMonth;
				}
			}
			return null;
		},
		getVirMonthByDate: function(d){
			for(var i = 0 ; i < this.virMonths.length ; i++){
				var virMonth = this.virMonths[i];
				if(virMonth.getStartDate() <= d && d <= virMonth.getEndDate()){
					return virMonth;
				}
			}
			return null;
		},
		getVirMonthsByDate: function(sd, ed){
			var virMonths = [];
			for(var i = 0 ; i < this.virMonths.length ; i++){
				var virMonth = this.virMonths[i];
				if(virMonth.getStartDate() <= ed && sd <= virMonth.getEndDate()){
					virMonths.push(virMonth);
				}
			}
			return virMonths;
		},
		getProvideEmpYuqs: function(){
			var empYuqs = [];
			for(var i = 0 ; i < this.empYuqs.length ; i++){
				var empYuq = this.empYuqs[i];
				if(empYuq.isProvide()){
					empYuqs.push(empYuq);
				}
			}
			return empYuqs;
		},
		getFirstEmpType: function(virMonths){
			return (this.manager.isRangeAll() // 全期間
				?　this.historyRanges[0].getEmpType() // 勤務体系履歴の最初の勤務体系
				: virMonths[0].getEmpType() // 期間内の最初の月の勤務体系
			);
		},
		/**
		 * 勤務表読み込みのCSV作成
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {{virMonth:{tsext.testAssist.ExportVirMonth},loaded:{boolean}}} curLoad 
		 * @param {string} d (yyyy-MM-dd)
		 * @returns {Array.<string>}
		 */
		outputExportLoadMonth: function(lst, visit, curLoad, d){
			var virMonth = this.getVirMonthByDate(d);
			if(curLoad.virMonth.isSameMonth(virMonth) && curLoad.loaded){
				return;
			}
			curLoad.virMonth = virMonth;
			curLoad.loaded = true;
			this.L(lst, [
				Constant.KEY_LOAD, // 読込
				Constant.KEY_SHEET, // 勤務表
				'',
				this.getName(), // 社員名
				virMonth.getYearMonth(1) // 月度
			]);
			return lst;
		},
		/**
		 * 社員をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmpType} empType
		 * @param {Array.<tsext.testAssist.ExportVirMonth>} virMonths
		 * @returns {Array.<string>}
		 */
		 outputExportEmp: function(lst, visit, empType, virMonths){
			var heads = [Constant.KEY_SETTING, Constant.KEY_EMP]; // 設定,社員
			this.L(lst, [Constant.OPTION_NEW, this.getName()], heads); // 新規,{社員名}
			this.outputExportEmpImpl({
				lst   : lst,
				head  : heads.concat(''),
				org   : this.parent.getDefaultEmp(),
				seize : []
			}, empType.getName());
			this.L(lst, [Constant.OPTION_END], heads); // 終了
			this.outputExportChangeEmpType(lst, visit, virMonths); // 勤務体系変更
			this.outputExportLeaveGrant(lst, visit, virMonths); // 休暇付与
			return lst;
		},
		/**
		 * 社員設定をエクスポート
		 * @param {Object} cpx
		 * @param {string} empTypeName 勤務体系名
		 * @returns {Array.<string>}
		 */
		 outputExportEmpImpl: function(cpx, empTypeName){
			// this.P(cpx, Constant.SET_EMP_CODE            , 'EmpCode__c'                                              ); // 社員コード（都合で無視）
			this.O(cpx, Constant.SET_EMPTYPE_NAME           , empTypeName                                                ); // 勤務体系
			this.P(cpx, Constant.SET_ENTRY_DATE             , 'EntryDate__c'                                             ); // 入社日
			this.P(cpx, Constant.SET_END_DATE               , 'EndDate__c'                                               ); // 退社日
			this.P(cpx, Constant.SET_NEXT_PROVIDE_DATE      , 'NextYuqProvideDate__c'                                    ); // 次回有休付与日
			this.P(cpx, Constant.SET_ACCESS_CONTROL         , 'InputAccessControlFlag__c', 'formatBoolean'              ); // 入退館管理
			this.P(cpx, Constant.SET_TS_ADMIN               , 'IsAdmin__c'                                               ); // 管理機能の使用
			this.P(cpx, Constant.SET_TS_ALL_EDIT            , 'IsAllEditor__c'                                           ); // 全社員のデータ編集
			this.P(cpx, Constant.SET_TS_ALL_READ            , 'IsAllReader__c'                                           ); // 全社員のデータ参照
			this.P(cpx, Constant.SET_TS_EXP_ADMIN           , 'IsExpAdmin__c'                                            ); // 経費管理機能の使用
			this.P(cpx, Constant.SET_TS_JOB_ADMIN           , 'IsJobAdmin__c'                                            ); // ジョブ管理機能の使用
			return cpx.lst;
		},
		/**
		 * 社員の勤務体系変更をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {Array.<tsext.testAssist.ExportVirMonth>} virMonths
		 * @returns {Array.<string>}
		 */
		 outputExportChangeEmpType: function(lst, visit, virMonths){
			// 勤務体系変更
			var hrs = this.historyRanges || [];
			var vsd = virMonths[0].getStartDate();
			var ved = virMonths[virMonths.length - 1].getEndDate();
			var isRangeAll = this.manager.isRangeAll();
			// 対象期間内（vsd～ved）に切替日がある場合のみ出力
			for(var h = 0 ; h < hrs.length ; h++){
				var hr = hrs[h];
				var sd = hr.getStartDate();
				if(!sd){
					continue;
				}
				if(isRangeAll || (vsd < sd && sd <= ved)){
					this.L(lst, [
						Constant.KEY_SETTING, // 設定
						Constant.KEY_EMP_CET, // 勤務体系変更
						'',
						this.getName(),				// {社員名}
						hr.getEmpType().getName(),	// {勤務体系名}
						sd							// {切替日}
					]);
				}
			}
			return lst;
		},
		/**
		 * 社員の設定変更をエクスポート
		 * ※勤務体系の直接変更（=現在のUIではできない）のみ行える
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {tsext.testAssist.ExportEmpType} empType
		 * @returns {Array.<string>}
		 */
		 outputExportEmpChange: function(lst, visit, empType){
			var heads = [Constant.KEY_SETTING, Constant.KEY_EMP]; // 設定,社員
			this.L(lst, [Constant.OPTION_CHANGE, this.getName()], heads); // 変更,{社員名}
			this.L(lst, ['', Constant.SET_EMPTYPE_NAME.name, empType.getName()], heads); // 勤務体系,{勤務体系名}
			this.L(lst, [Constant.OPTION_END], heads); // 終了
			return lst;
		},
		/**
		 * 社員の休暇付与をエクスポート
		 * @param {Array.<string>} lst 
		 * @param {tsext.testAssist.ExportVisitor} visit 
		 * @param {Array.<tsext.testAssist.ExportVirMonth>} virMonths
		 * @returns {Array.<string>}
		 */
		 outputExportLeaveGrant: function(lst, visit, virMonths){
			// 年次有給休暇付与
			for(var i = 0 ; i < this.empYuqs.length ; i++){
				var empYuq = this.empYuqs[i];
				if(empYuq.isProvide()){
					var pv = empYuq.getProvideValue();
					this.L(lst, [
						Constant.KEY_SETTING, // 設定
						Constant.KEY_LEAVE_GRANT, // 休暇付与
						'',
						this.getName(), // 社員名
						Constant.YUQ_NAME, // 年次有給休暇
						pv.days, // 付与日数
						pv.hmm, // 付与時間
						empYuq.getStartDate(), // 有効開始日
						empYuq.getLimitDate(), // 失効日
						empYuq.getSubject() // 説明
					]);
				}else if(empYuq.isLostFlag()){
					var minusYuq = empYuq.getMinusYuq();
					var sv = empYuq.getSpendValue();
					if(minusYuq){
						this.L(lst, [
							Constant.KEY_SETTING, // 設定
							Constant.KEY_LEAVE_REMOVE, // 休暇剥奪
							'',
							this.getName(), // 社員名
							Constant.YUQ_NAME, // 年次有給休暇
							sv.days, // マイナス日数
							sv.hmm, // マイナス時間
							minusYuq.getStartDate(), // 有効開始日
							minusYuq.getLimitDate(), // 失効日
							minusYuq.getSubject() // 説明
						]);
					}
				}
			}
			// 日数管理休暇付与
			for(var key in this.empStockMap){
				if(!this.empStockMap.hasOwnProperty(key) || key == '代休'){
					continue;
				}
				var stocks = this.empStockMap[key];
				var cnt = 0;
				for(var i = 0 ; i < stocks.length ; i++){
					var empStock = stocks[i];
					if(empStock.isProvide()){
						var pv = empStock.getProvideValue();
						this.L(lst, [
							Constant.KEY_SETTING, // 設定
							Constant.KEY_LEAVE_GRANT, // 休暇付与
							'',
							this.getName(), // 社員名
							empStock.getType(), // 日数管理休暇管理名
							pv.days, // 付与日数
							pv.hmm, // 付与時間
							empStock.getStartDate(), // 有効開始日
							empStock.getLimitDate(), // 失効日
							empStock.getName() // 説明
						]);
					}else if(empStock.isLostFlag()){
						var minusStock = empStock.getMinusStock();
						if(minusStock){
							var sv = empStock.getSpendValue();
							this.L(lst, [
								Constant.KEY_SETTING, // 設定
								Constant.KEY_LEAVE_REMOVE, // 休暇剥奪
								'',
								this.getName(), // 社員名
								empStock.getType(), // 日数管理休暇管理名
								sv.days, // マイナス日数
								sv.hmm, // マイナス時間
								minusStock.getStartDate(), // 有効開始日
								minusStock.getLimitDate(), // 失効日
								minusStock.getName() // 説明
							]);
						}
					}
				}
			}
			return lst;
		}
	});
});
