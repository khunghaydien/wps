teasp.provide('teasp.verify.VerData');
/**
 *
 */
teasp.verify.VerData = function(dataObj, flag){
    this.empId = dataObj.params.empId;
    this.month = dataObj.params.month;
    this.subNo = dataObj.params.subNo;
    this.date  = dataObj.params.date;
    this.pouch = new teasp.data.Pouch();
    if(flag){
        this.pouch.dataObj = dataObj;
    }
};

teasp.verify.VerData.prototype.setErrorId = function(errorId){
    this.errorId = errorId;
};

/**
 *
 */
teasp.verify.VerData.prototype.loadEmpMonth = function(onSuccess, onFailure){
    teasp.manager.request(
        'loadEmpMonthPrint',
        {
            target : "empMonth",
            empId  : this.empId,
            month  : this.month,
            subNo  : this.subNo,
            date   : this.date,
            mode   : "read"
        },
        this.pouch,
        { hideBusy : true },
        this,
        onSuccess,
        onFailure
    );
};

/**
 *
 */
teasp.verify.VerData.prototype.downloadSample = function(onSuccess, onFailure){
    var commands = [];
    var monthId = this.getMonthId();
    if(monthId){
        commands.push(teasp.verify.VerEmpMonth.getRequest({ monthId: monthId }));
        commands.push(teasp.verify.VerEmpDays.getRequest({ monthId: monthId }));
    }
    commands.push({ funcName : 'loadEmpMonthPrint', params : [(this.empId || ''), (this.month || ''), 'read', null, (this.subNo || '')] });

    var results = { empMonth: [], empDays: [] };
    var head = 'var sampleData = ';

    teasp.action.contact.remoteMethods(
        commands,
        { errorAreaId: this.errorId, nowait: true },
        function(result, index){
            if(monthId && index == 0){
                results.empMonth = (result.records || []);
            }else if(monthId && index == 1){
                results.empDays  = (result.records || []);
            }else{
                results.loadData = result;
                var data = dojo.toJson(results) + '\r\n;';
                var name = teasp.util.date.formatDateTime(new Date(), 'N14', true);
                teasp.verify.VerData.inputDownload(
                    head,
                    data,
                    'file' + name + '.txt'
                );
                onSuccess();
            }
        },
        onFailure,
        this
    );
};

teasp.verify.VerData.prototype.getDataObj = function(){
    return this.pouch.dataObj;
};

teasp.verify.VerData.prototype.getEmpId = function(){
    var dataObj = this.getDataObj();
    return dataObj.targetEmp.id;
};

teasp.verify.VerData.prototype.getMonthId = function(){
    var dataObj = this.getDataObj();
    return dataObj.month.id;
};

teasp.verify.VerData.prototype.getMonthSummary = function(){
    var monSum = this.pouch.getMonthSummary();
    var emLastDate = this.pouch.getEmpMonthLastDate();
    var yr = this.pouch.getDspYuqRemain(emLastDate, true);
    return {
        monSum    : monSum,
        yuqRemain : yr
    };
};

/**
* データをサーバへ書き込み、ＣＳＶダウンロードを呼び出す
*
* @param {string} head
* @param {string} value
* @param {string} fname
* @param {boolean} nowait
*/
teasp.verify.VerData.inputDownload = function(head, value, fname, nowait) {
    var key = '' + (new Date()).getTime();
    var values = teasp.util.splitByLength(value, 30000);
    var valot = [];
    var cnt = Math.ceil(values.length / 9);
    var x = 0;
    for (var i = 0; i < cnt; i++) {
        valot[i] = [];
        for (var j = 0; j < 9; j++) {
            var k = (x * 9) + j;
            if (k < values.length) {
                valot[i].push(values[k]);
            }
        }
        x++;
    }
    var reqs = [];
    i = 0;
    do {
        reqs.push({
            funcName : 'inputData',
            params : {
                key : key,
                head : (i == 0 ? head : null),
                values : valot[i],
                order : (i + 1)
            }
        });
        i++;
    } while (i < valot.length);

    teasp.verify.VerData.contact(reqs, function(result, index) {
        if (reqs.length <= (index + 1)) {
            teasp.downloadHref(teasp.getPageUrl('extCsvView') + '?key=' + key + (fname ? '&fname=' + fname : ''));
        }
    }, null, (nowait || false));
};

teasp.verify.VerData.contact = function(req, onSuccess, onFailure, nowait){
    teasp.action.contact.remoteMethods(
        (is_array(req) ? req : [req]),
        {
            errorAreaId : null,
            nowait      : (nowait || false)
        },
        onSuccess,
        onFailure,
        this
    );
};

