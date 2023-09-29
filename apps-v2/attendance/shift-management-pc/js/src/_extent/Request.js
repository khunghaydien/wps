/*
 *
 */
tsq.QueryObj.prototype.buildForm = function(){
	this.destroy();
    var qform = dojo.byId('queryForm');
    var inp = dojo.create('input', { type: 'button', value: 'ダウンロード', style: 'margin-top:20px;' }, qform);
    dojo.connect(inp, 'onclick', this, function(){
        teasp.manager.dialogOpen('BusyWait');

        var soql = "select"
            + "  Id"
            + ", Name"
            + ", Owner.Name"
            + ", Summary__c"
            + ", Status__c"
            + ", Detail__c"
            + ", Usecase__c"
            + ", Ticket__c"
            + ", Version__c"
            + ", ReleaseDate__c"
            + ", DueDate__c"
            + ", RequestDate__c"
            + ", RequestAccount1__r.Name"
            + ", RequestAccount2__r.Name"
            + ", RequestAccount3__r.Name"
            + ", AccountMemo__c"
            + ", Importance1__c"
            + ", Importance2__c"
            + ", Importance3__c"
            + ", Opportunity1Id__r.Name"
            + ", Opportunity2Id__r.Name"
            + ", Opportunity3Id__r.Name"
            + ", CreatedDate"
            + ", CreatedBy.Name"
            + ", LastModifiedDate"
            + ", LastModifiedBy.Name"
            + " from Request__c";
        this.search(soql, true);
    });
};

tsq.QueryObj.prototype.buildData = function(records){
    var value = '';
    for(var i = 0 ; i < records.length ; i++){
        var record = records[i];
        value += '"' + record.Id + '"'
        + ',"' + record.Name                       + '"'
        + ',"' + record.Owner.Name                 + '"'
        + ',"' + (record.Summary__c         || '') + '"'
        + ',"' + record.Status__c                  + '"'
        + ',"' + (record.Detail__c          || '') + '"'
        + ',"' + (record.Usecase__c         || '') + '"'
        + ',"' + (record.Ticket__c          || '') + '"'
        + ',"' + (record.Version__c         || '') + '"'
        + ',"' + teasp.util.date.formatDate(record.RequestDate__c) + '"'
        + ',"' + teasp.util.date.formatDate(record.DueDate__c)     + '"'
        + ',"' + teasp.util.date.formatDate(record.ReleaseDate__c) + '"'
        + ',"' + (record.RequestAccount1__r ? record.RequestAccount1__r.Name : '') + '"'
        + ',"' + (record.RequestAccount2__r ? record.RequestAccount2__r.Name : '') + '"'
        + ',"' + (record.RequestAccount3__r ? record.RequestAccount3__r.Name : '') + '"'
        + ',"' + (record.AccountMemo__c     || '') + '"'
        + ',"' + (record.Importance1__c     || '') + '"'
        + ',"' + (record.Importance2__c     || '') + '"'
        + ',"' + (record.Importance3__c     || '') + '"'
        + ',"' + (record.Opportunity1Id__r ? record.Opportunity1Id__r.Name : '') + '"'
        + ',"' + (record.Opportunity2Id__r ? record.Opportunity2Id__r.Name : '') + '"'
        + ',"' + (record.Opportunity3Id__r ? record.Opportunity3Id__r.Name : '') + '"'
        + ',"' + teasp.util.date.formatDateTime(record.CreatedDate)      + '"'
        + ',"' + record.CreatedBy.Name                                   + '"'
        + ',"' + teasp.util.date.formatDateTime(record.LastModifiedDate) + '"'
        + ',"' + record.LastModifiedBy.Name                              + '"'
        + '\r\n';
    }
    var heads = '"Id"'
        + ',"Name"'
        + ',"Owner"'
        + ',"Summary"'
        + ',"Status"'
        + ',"Detail"'
        + ',"Usecase"'
        + ',"Ticket"'
        + ',"Version"'
        + ',"RequestDate"'
        + ',"DueDate"'
        + ',"ReleaseDate"'
        + ',"RequestAccount1"'
        + ',"RequestAccount2"'
        + ',"RequestAccount3"'
        + ',"AccountMemo"'
        + ',"Importance1"'
        + ',"Importance2"'
        + ',"Importance3"'
        + ',"Opportunity1Id"'
        + ',"Opportunity2Id"'
        + ',"Opportunity3Id"'
        + ',"CreatedDate"'
        + ',"CreatedBy"'
        + ',"LastModifiedDate"'
        + ',"LastModifiedBy"';
    this.inputDownload(heads, value, 'request.csv');
};

