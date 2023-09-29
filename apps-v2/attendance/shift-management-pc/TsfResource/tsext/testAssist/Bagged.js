define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/string",
	"tsext/testAssist/Current",
	"tsext/testAssist/Constant",
	"tsext/util/Util"
], function(declare, lang, array, str, Current, Constant, Util){
	return declare("tsext.testAssist.Bagged", null, {
		/**
		 * @constructor
		 * @param {tsext.testAssist.Distributor} distributor
		 */
		constructor : function(distributor){
			this.distributor = distributor;
			this.index = 0;
			this.subIndex = 0;
			this.innerLoopNext = null;
		},
		setLoopNext: function(func){
			this.innerLoopNext = func;
		},
		getDistributor: function(){
			return this.distributor;
		},
		outputLog : function(log, args){
			var obj = {
				index: this.index,
				timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
				message: str.substitute(log || '', args || [])
			};
			this.distributor.addLog(obj);
		},
		stayResult: function(resultObj, mode){
			var obj = resultObj || {result:0};
			obj.index = this.index;
			obj.timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
			if(mode){
				obj.mode = mode;
			}
			if(obj.mode && obj.mode == Constant.OPE_SKIP){
				obj.message = Constant.LOG_SKIP;
			}else if(!obj.result && !obj.errorLevel){
				obj.message = Constant.LOG_OK;
			}else{
				obj.message = obj.message || '';
			}
			this.distributor.pushResult(obj);
			return this;
		},
		doneResult: function(resultObj){
			if(this.stopped()){
				return;
			}
			this.innerLoopNext(this.stayResult(resultObj, Constant.OPE_DONE));
		},
		doneSkip: function(resultObj){
			this.innerLoopNext(this.stayResult(resultObj, Constant.OPE_SKIP));
		},
		loopNext: function(){
			this.innerLoopNext(this);
		},
		stopped: function(){
			if(!this.distributor.canContinue(this)){
				this.distributor.finish(false);
				return true;
			}
			return false;
		},
		getIndex:		function(){ return this.index; },
		setIndex:		function(index){ this.index = index; },
		getSubIndex:	function(){ return this.subIndex; },
		resetIndex:		function(){ this.index = 0;    return this; },
		resetSubIndex:	function(){ this.subIndex = 0; return this; },
		next:			function(){ this.index++;    return this; },
		nextSub:		function(){ this.subIndex++; return this; }
	});
});
