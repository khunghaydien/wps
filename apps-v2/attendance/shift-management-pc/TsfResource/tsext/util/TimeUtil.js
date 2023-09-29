define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string"
], function(declare, lang, array, str){
	return new (declare("tsext.util.TimeUtil", null, {
		/**
		 * 配列1要素毎の from-to の時間(分)の合計を返す
		 * @return {number}
		 */
		spanTime: function(rs){
			var t = 0;
			for(var i = 0 ; i < rs.length ; i++){
				var r = rs[i];
				if(typeof(r.from)=='number' && typeof(r.to)=='number' && r.from<r.to){
					t += (r.to-r.from);
				}
			}
			return t;
		},
		/**
		 * 重複時間の取得
		 * @param {{from:{number}, to:{number}}}         a  時間の範囲(a)
		 * @param {Array.<{from:{number}, to:{number}}>} bs 時間の範囲の配列(b)
		 * @return {number} (a) の時間の範囲と (b) の時間の範囲の重なる部分の時間の合計を返す。単位=分。
		 */
		overlapTime: function(a, bs){
			var t = 0;
			for(var i = 0 ; i < bs.length ; i++){
				var b = bs[i];
				if(typeof(b.from)!='number' || typeof(b.to)!='number'){
					continue;
				}
				if(a.from<b.from && b.to<a.to){								t += (b.to-b.from);
				}else if(a.from>b.from && a.to<b.to){						t += (a.to-a.from);
				}else if((a.from<=b.from && a.to<=b.to) && b.from<a.to){	t += (a.to-b.from);
				}else if((a.from>=b.from && a.to>=b.to) && a.from<b.to){	t += (b.to-a.from);
				}
			}
			return t;
		},
		/**
		 * 時間帯リストを時間帯同志が重ならないようにマージする
		 * @param {Array.<{from:{number}, to:{number}}>} rs 処理前の時間帯リスト
		 * @return {Array.<{from:{number}, to:{number}}>} マージ後の時間帯リスト
		 */
		mergeRanges: function(rs){
			var ra = dojo.clone(rs);
			ra = ra.sort(function(a, b){
				if(a.from!=b.from){		return a.from-b.from;
				}else if(a.to!=b.to){	return a.to-b.to;
				}
				return 0;
			});
			var rb = [];
			for(var i = 0 ; i < ra.length ; i++){
				var r = ra[i];
				if(rb.length<=0){						rb.push(r);
				}else if(rb[rb.length-1].to<r.from){	rb.push(r);
				}else if(rb[rb.length-1].from>r.to){	rb.push(r);
				}else if(rb[rb.length-1].to<r.to){		rb[rb.length-1].to=r.to;
				}
			}
			return rb;
		},
		/**
		 * 時間範囲が別の時間範囲にかぶらないように分割する
		 * @param {{from:{number}, to:{number}}} x 時間範囲
		 * @param {{from:{number}, to:{number}}} y 時間範囲
		 * @return {Array.<{from:{number}, to:{number}}>} 分割された時間範囲の配列
		 */
		sliceRange: function(a, b) {
			if(typeof(b.from)!='number' || typeof(b.to)!='number'){
				return [{from:a.from,to:a.to}];
			}
			if(a.from<b.from && a.to>b.to){																			return [{from:a.from,to:b.from},{from:b.to,to:a.to}];
			}else if((a.from<b.from  && a.to==b.to) || (a.from<b.from && a.to<b.to   && a.to>b.from)){				return [{from:a.from,to:b.from}];
			}else if((a.from==b.from && a.to>b.to ) || (a.from>b.from && a.from<b.to && a.to>b.to)){				return [{from:b.to	,to:a.to}];
			}else if((a.from<b.from  && a.to<b.to && a.to==b.from) || (a.from<b.from && a.to<b.to && a.to<b.from)){	return [{from:a.from,to:a.to}];
			}else if((a.from>b.from  && a.to>b.to && a.from==b.to) || (a.from>b.from && a.from>b.to)){				return [{from:a.from,to:a.to}];
			}
			return [];
		},
		/**
		 * 時間範囲が別の時間範囲にかぶらないように分割する
		 * @param {Array.<{from:{number}, to:{number}}>}  ra 時間範囲
		 * @param {{from:{number}, to:{number}}}          ex 時間範囲
		 * @return {Array.<{from:{number}, to:{number}}>} 分割された時間範囲の配列
		 */
		sliceRanges: function(ra, ex) {
			var rb = [];
			for(var i = 0 ; i < ra.length ; i++) {
				var rs = this.sliceRange(ra[i], ex);
				if(rb.length <= 0){
					rb = rs;
				}else{
					for(var j = 0 ; j < rs.length ; j++){
						rb.push(rs[j]);
					}
				}
			}
			return rb;
		},
		/**
		 * 時間帯を排斥時間帯リストを含まない複数の時間帯に分解する
		 * @param {Array.<{from:{number}, to:{number}}>} ra 時間帯
		 * @param {Array.<{from:{number}, to:{number}}>} ex 排斥時間帯リスト
		 * @return {Array.<{from:{number}, to:{number}}>}
		 */
		excludeRanges: function(ra, ex){
			var rb = (ra ? dojo.clone(ra) : []);
			if(rb.length > 0){
				for(var i = 0 ; i < ex.length ; i++){
					rb = this.sliceRanges(rb, ex[i]);
				}
			}
			return rb;
		},
		/**
		 * 時間帯Aのうち時間帯Bに含まれている時間帯だけを抽出
		 * @param {Array.<{from:{number}, to:{number}}>} ra 時間帯A
		 * @param {Array.<{from:{number}, to:{number}}>} rb 時間帯B
		 * @param {number=} mt 最大時間（省略時は 48*60）
		 * @return {Array.<{from:{number}, to:{number}}>}
		 */
		includeRanges: function(ra, rb, mt){
			var mtm = (mt || 48*60);
			rb = rb.sort(function(a, b){ return a.from-b.from; });
			var ex = [];
			var bt = 0;
			for(var i = 0 ; i < rb.length ; i++){
				var o = rb[i];
				if(bt < o.from){
					ex.push({from:bt,to:o.from});
				}
				bt = o.to;
			}
			if(bt>=0 && bt<mtm){
				ex.push({from:bt,to:mtm});
			}
			return this.excludeRanges(ra, ex);
		}
	}))();
});
