define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/check8661/EmpTypeAgent",
	"tsext/check8661/EmpMonths",
	"tsext/check8661/EmpYuqs",
	"tsext/check8661/Const",
	"tsext/util/Util"
], function(declare, lang, array, str, EmpTypeAgent, EmpMonths, EmpYuqs, Const, Util){
	return declare("tsext.check8661.Emp", null, {
		constructor : function(o){
			o.CreatedDate	   = Util.formatDateTime(o.CreatedDate);
			o.LastModifiedDate = Util.formatDateTime(o.LastModifiedDate);
			o.EntryDate__c	   = Util.formatDate(o.EntryDate__c);
			o.EndDate__c	   = Util.formatDate(o.EndDate__c);
			this.obj = o;
			this.historyRanges = EmpTypeAgent.getHistoryRanges(this.obj.EmpTypeHistory__c, this.obj.EmpTypeId__c);
		},
		reset: function(){
			this.months   = new EmpMonths();
			this.yuqs     = new EmpYuqs();
		},
		getId: function(){
			return this.obj.Id;
		},
		getEmpCode: function(){
			return this.obj.EmpCode__c || null;
		},
		getName: function(){
			return this.obj.Name;
		},
		getDeptCode   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.DeptCode__c) || ''; },
		getDeptName   : function(){ return (this.obj.DeptId__r && this.obj.DeptId__r.Name) || ''; },
		getEntryDate  : function(){ return this.obj.EntryDate__c || ''; },
		getEndDate    : function(){ return this.obj.EndDate__c || ''; },
		getEmpTypeName: function(){ return (this.obj.EmpTypeId__r && this.obj.EmpTypeId__r.Name) || ''; },
		isTarget: function(){
			var empType = EmpTypeAgent.getEmpTypeById(this.obj.EmpTypeId__c);
			if(empType && empType.isTarget()){
				return true;
			}
			var hrs = this.historyRanges;
			for(var i = 0 ; i < hrs.length ; i++){
				var hr = hrs[i];
				if(hr.et && hr.et.Id){
					empType = EmpTypeAgent.getEmpTypeById(hr.et.Id);
					if(empType && empType.isTarget()){
						return true;
					}
				}
			}
			return false;
		},
		addEmpYuq: function(yuq){
			this.yuqs.addEmpYuq(yuq);
		},
		addEmpYuqDetail: function(detail){
			this.yuqs.addEmpYuqDetail(detail);
		},
		buildYuqs: function(){
			this.yuqs.build();
		},
		addEmpMonth: function(month){
			this.months.addEmpMonth(month);
		},
		getEmpMonth: function(yearMonth, subNo){
			return this.months.getEmpMonth(yearMonth, subNo);
		},
		/**
		 * 自動付与が行われた時の勤務体系を取得する（AtkEmpMonth__c.YuqLog__cから）
		 *
		 * @param {tsext.check8661.EmpYuq} yuq
		 * @return {tsext.check8661.EmpType|null} 勤務体系クラスのインスタンスを返す。見つからなければnull
		 */
		getEmpTypeAtAutoFuyo: function(yuq){
			var month = this.months.getEmpMonthByEmpYuqId(yuq.getId());
			if(month){
				return EmpTypeAgent.getEmpTypeById(month.getEmpTypeId());
			}
			return null;
		},
		/**
		 * 自動付与が行われた時の勤務体系を取得する（付与日の前月または当月のどちらかから）
		 *
		 * @param {tsext.check8661.EmpYuq} yuq
		 * @return {tsext.check8661.EmpType|null} 勤務体系クラスのインスタンスを返す。見つからなければnull
		 */
		getEmpTypeAtAutoFuyo2: function(yuq){
			var tgtMonths = this.getMonthAndBeforeByDate(yuq.getStartDate());
			for(var i = 0 ; i < tgtMonths.length ; i++){
				var tgtMonth = tgtMonths[i];
				var month = this.getEmpMonth(tgtMonth.ym, tgtMonth.subNo);
				if(month){
					return EmpTypeAgent.getEmpTypeById(month.getEmpTypeId());
				}
			}
			// 勤怠月次が存在しない場合
			if(tgtMonths.length && tgtMonths[0].empType && tgtMonths[0].empType.Id){
				return EmpTypeAgent.getEmpTypeById(tgtMonths[0].empType.Id);
			}
			return null;
		},
		/**
		 * 指定日を含む月とその前月の情報を得る
		 *
		 * @param {string} dt (YYYY-MM-DD)
		 * @return {Array.<{Object}>} 月情報（ym,subNo要素を持つオブジェクトの配列）
		 */
		getMonthAndBeforeByDate: function(dt){
			var tgtMonths = [];
			if(dt){
				var months = EmpTypeAgent.getMonths1YearsAround(this.historyRanges, dt);
				for(var i = 0 ; i < months.length ; i++){
					var month = months[i];
					if(month.sd <= dt && dt <= month.ed){
						if(i > 0){
							tgtMonths.push(months[i - 1]); // 付与日前月
						}
						tgtMonths.push(months[i]); // 付与日当月
					}
				}
			}
			return tgtMonths;
		},
		getProvideByElapsed: function(empType, dt){
			if(empType && dt){
				return empType.getProvideByElapsed(this.getEntryDate(), dt);
			}
			return '';
		},
		getErrorLines: function(){
			if(!this.yuqs.getSize() || !this.isTarget()){
				return [];
			}
			var borderDt = moment(Const.BORDER_DATE, 'YYYY-MM-DD');
			var lines = [];
			var bs = [];
			bs.push(Util.escapeCsv(this.getEmpCode())    );
			bs.push(Util.escapeCsv(this.getName())       );
			bs.push(Util.escapeCsv(this.getDeptCode())   );
			bs.push(Util.escapeCsv(this.getDeptName())   );
			bs.push(Util.escapeCsv(this.getEmpTypeName()));
			bs.push(Util.escapeCsv(this.getEntryDate())  );
			var list = this.yuqs.getOutputList();
			var cnt = 0;
			for(var i = 0 ; i < list.length ; i++){
				var obj = list[i];
				var yuq = obj.yuq;
				var pmEmpType = this.getEmpTypeAtAutoFuyo(yuq);       // 付与時の勤務体系
				if(!pmEmpType){ // 付与時の勤務体系みつからず＝自動付与ではない
					continue;
				}
				var createdDt = moment(yuq.getCreatedDate(), 'YYYY-MM-DD HH:mm:ss');
				if(createdDt.isBefore(borderDt)){ // 生成日時が境界日より前
					continue;
				}
				var provideDays = yuq.getProvideDays();
				var properProvide = this.getProvideByElapsed(pmEmpType, yuq.getStartDate()); // 適正付与日数
				if(provideDays.days == properProvide){ // 適正な付与日数である
					continue;
				}
				var elapsed = Util.getElapsedDays(this.getEntryDate(), yuq.getStartDate());  // 継続勤務日数
				var line = lang.clone(bs);
				line.push(Util.escapeCsv(yuq.getSubject())      );         // 事柄
				line.push(Util.escapeCsv(yuq.getStartDate())    );         // 有効開始日
				line.push(Util.escapeCsv(yuq.getLimitDate())    );         // 失効日
				line.push(Util.escapeCsv(provideDays.days)      );         // 付与日数
				line.push(properProvide                         );         // 適正付与日数
				line.push(Util.escapeCsv(yuq.getCreatedDate())  );         // 生成日時
				line.push(Util.getElapsedString(elapsed)        );         // 有効開始日時点の継続勤務日数
				line.push(Util.escapeCsv(pmEmpType.getName())   );         // 付与時の勤務体系
				lines.push(line.join(','));
				cnt++;
			}
			if(!cnt){
				return [];
			}
			return lines;
		},
		getYuqDetailCsv: function(){
			if(!this.yuqs.getSize()){
				return '';
			}
			var borderDt = moment(Const.BORDER_DATE, 'YYYY-MM-DD');
			var lines = [];
			var bs = [];
			bs.push(Util.escapeCsv(this.getEmpCode())    );
			bs.push(Util.escapeCsv(this.getName())       );
			bs.push(Util.escapeCsv(this.getDeptCode())   );
			bs.push(Util.escapeCsv(this.getDeptName())   );
			bs.push(Util.escapeCsv(this.getEmpTypeName()));
			bs.push(Util.escapeCsv(this.getEntryDate())  );
			bs.push(Util.escapeCsv(this.getEndDate())    );
			if(!this.yuqs.getSize()){
				lines.push(bs.join(','));
			}
			var list = this.yuqs.getOutputList();
			for(var i = 0 ; i < list.length ; i++){
				var obj = list[i];
				var yuq = obj.yuq;
				var createdDt = moment(yuq.getCreatedDate(), 'YYYY-MM-DD HH:mm:ss');
				var line = lang.clone(bs);
				var provideDays = yuq.getProvideDays();
				var yd = (obj.time ? yuq.yd.clone(obj.time) : null);
				var spendDays = {
					days:  yd ? yd.getDays()  : '',
					hours: yd ? yd.getHours() : ''
				};
				var remainDays     = yuq.getProvideRemain();
				var disconnectDays = yuq.getDisconnectDays();
				line.push(Util.escapeCsv(yuq.getCategory())      );         // 分類（付与／消化）
				line.push(Util.escapeCsv(yuq.getBaseTimeH())     );         // 基準時間
				line.push(Util.escapeCsv(provideDays.days)       );         // 付与日数
				line.push(Util.escapeCsv(provideDays.hours)      );         // 付与時間
				line.push(Util.escapeCsv(spendDays.days)         );         // 消化日数
				line.push(Util.escapeCsv(spendDays.hours)        );         // 消化時間
				line.push(Util.escapeCsv(remainDays.days)        );         // 残日数
				line.push(Util.escapeCsv(remainDays.hours)       );         // 残時間
				line.push(Util.escapeCsv(yuq.isExpired() ? '失効' : ''));  // 失効
				line.push(Util.escapeCsv(yuq.getStartDate())     );         // 有効開始日
				line.push(Util.escapeCsv(yuq.getLimitDate())     );         // 失効日
				line.push(Util.escapeCsv(yuq.getDate())          );         // 消化日
				line.push(Util.escapeCsv(yuq.getFork())          );         // 分割
				line.push(Util.escapeCsv(yuq.getEmpApplyName())  );         // 付与/消化要因
				line.push(Util.escapeCsv(yuq.getSubject())       );         // 事柄
				line.push(Util.escapeCsv(yuq.getCreatedDate())   );         // 生成日時
				line.push(this.isTarget()                        );         // 調査対象
				if(yuq.isProvide() && yuq.isAutoFlag()){ // 定期付与である
					var elapsed = Util.getElapsedDays(this.getEntryDate(), yuq.getStartDate());  // 継続勤務日数
					var pmEmpType = this.getEmpTypeAtAutoFuyo(yuq); // 付与時の勤務体系
					if(!pmEmpType){
						pmEmpType = this.getEmpTypeAtAutoFuyo2(yuq); // 付与日の前月または当月の勤務体系を得る
					}
					var properProvide = this.getProvideByElapsed(pmEmpType, yuq.getStartDate()); // 適正付与日数
					var judge = '';
					if(pmEmpType && provideDays.days != properProvide){
						if(!this.isTarget() || createdDt.isBefore(borderDt)){
							judge = '△';
						}else{
							judge = '×';
						}
					}
					line.push('"' + properProvide                                    + '"');     // 適正付与日数
					line.push('"' + judge                                            + '"');     // 不具合影響の有無
					line.push('"' + Util.getElapsedString(elapsed)                   + '"');     // 有効開始日時点の継続勤務日数
					line.push('"' + (pmEmpType ? pmEmpType.getName() : '')           + '"');     // 付与時の勤務体系
					line.push('"' + (pmEmpType ? pmEmpType.isYuqProvideAuto()  : '') + '"');
					line.push('"' + (pmEmpType ? pmEmpType.getYuqProvideType() : '') + '"');
					line.push('"' + (pmEmpType ? pmEmpType.getYuqProvideDate() : '') + '"');
					line.push('"' + (pmEmpType ? pmEmpType.getYuqProvideDays() : '') + '"');     // 付与日数設定
				}else{
					line.push('""');
					line.push('""');
					line.push('""');
					line.push('""');
					line.push('""');
				}
				lines.push(line.join(','));
			}
			return lines.join('\n') + '\n';
		},
		getEmpCsv: function(){
			var lst = [];
			lst.push(this.obj.Id                          );
			lst.push(Util.escapeCsv(this.getEmpCode())    );
			lst.push(Util.escapeCsv(this.getName())       );
			lst.push(this.obj.CreatedDate                 );
			lst.push(this.obj.LastModifiedDate            );
			lst.push(Util.escapeCsv(this.getDeptCode())   );
			lst.push(Util.escapeCsv(this.getDeptName())   );
			lst.push(this.obj.EmpTypeId__c                );
			lst.push(Util.escapeCsv(this.getEmpTypeName()));
			lst.push(Util.escapeCsv(this.getEntryDate())  );
			lst.push(Util.escapeCsv(this.getEndDate())    );
			lst.push(this.isTarget()                      );
			return lst.join(',') + '\n';
		},
		getYuqCsv: function(){
			if(!this.yuqs.getSize()){
				return '';
			}
			var line = [];
			var provideDays    = this.yuqs.getProvideDays();
			var spendDays      = this.yuqs.getSpendDays();
			var expiredDays    = this.yuqs.getExpiredDays();
			var remainDays     = this.yuqs.getRemainDays();
			var disconnectDays = this.yuqs.getDisconnectDays();
			line.push(Util.escapeCsv(this.getEmpCode())    );
			line.push(Util.escapeCsv(this.getName())       );
			line.push(Util.escapeCsv(this.getDeptCode())   );
			line.push(Util.escapeCsv(this.getDeptName())   );
			line.push(Util.escapeCsv(this.getEmpTypeName()));
			line.push(Util.escapeCsv(this.getEntryDate())  );
			line.push(Util.escapeCsv(this.getEndDate())    );
			line.push(Util.escapeCsv(provideDays.days)     ); // 付与数(D)
			line.push(Util.escapeCsv(provideDays.hours)    ); // 付与数(H)
			line.push(Util.escapeCsv(spendDays.days)       ); // 消化数(D)
			line.push(Util.escapeCsv(spendDays.hours)      ); // 消化数(H)
			line.push(Util.escapeCsv(expiredDays.days)     ); // 失効数(D)
			line.push(Util.escapeCsv(expiredDays.hours)    ); // 失効数(H)
			line.push(Util.escapeCsv(remainDays.days)      ); // 残日数(D)
			line.push(Util.escapeCsv(remainDays.hours)     ); // 残日数(H)
			return line.join(',') + '\n';
		},
		getEmpMonthCsv: function(){
			var months = this.months.getEmpMonths();
			if(!months.length){
				return '';
			}
			var lines = [];
			var bs = [];
			bs.push(Util.escapeCsv(this.getEmpCode())    );
			bs.push(Util.escapeCsv(this.getName())       );
			bs.push(Util.escapeCsv(this.getDeptCode())   );
			bs.push(Util.escapeCsv(this.getDeptName())   );
			bs.push(Util.escapeCsv(this.getEmpTypeName()));
			bs.push(Util.escapeCsv(this.getEntryDate())  );
			bs.push(Util.escapeCsv(this.getEndDate())    );
			for(var i = 0 ; i < months.length ; i++){
				var month = months[i];
				var line = lang.clone(bs);
				line.push(Util.escapeCsv(month.getYearMonth())   );      // 月度
				line.push(Util.escapeCsv(month.getSubNo())       );      // サブNo
				line.push(Util.escapeCsv(month.getEmpTypeId())   );      // 勤務体系ID
				line.push(Util.escapeCsv(month.getEmpTypeName()) );      // 勤務体系名
				line.push(Util.escapeCsv(month.getStartDate())   );      // 開始日
				line.push(Util.escapeCsv(month.getEndDate())     );      // 終了日
				line.push(Util.escapeCsv(month.getStatus())      );      // ステータス
				line.push(Util.escapeCsv(month.getCreatedDate()) );      // 生成日時
				line.push(Util.escapeCsv(month.getLastModifiedDate()));  // 最終更新日時
				line.push(Util.escapeCsv(month.getOrgYuqLog())   );      // 有休ログ
				lines.push(line.join(','));
			}
			return lines.join('\n') + '\n';
		}
	});
});
