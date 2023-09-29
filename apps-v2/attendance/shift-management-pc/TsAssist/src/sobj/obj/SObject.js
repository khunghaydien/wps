/**
 * SObjectクラス
 */
export class SObject {
    constructor(obj){
        this.obj = obj;
        this._key = this.obj.name.toLowerCase();
        this._define = null;

    }
    static getNoNameObjs(){
        return [
            'acceptedeventrelation','accountcontactrole','accountfeed','accounthistory','accountpartner','accountshare','actionlinkgrouptemplate','actionlinktemplate','activityhistory','aggregateresult','announcement','apexemailnotification','apexlog','apextestqueueitem','apextestresult','apextestresultlimits','apextestrunresult','apextestsuite','assetfeed','assethistory','assetrelationship','assetrelationshipfeed','assetrelationshiphistory','assetshare','assistantrecommendationshare','asyncapexjob','atkcardstatementtrail__share','atkimportbatch__share','attachedcontentdocument','auradefinition','auradefinitionbundle','auradefinitionbundleinfo','auradefinitioninfo',
            'authconfig','authconfigproviders','authprovider','authsession','backgroundoperationresult','brandingset','brandingsetproperty','campaignfeed','campaignhistory','campaignmemberstatus','campaignshare','case','casechangeevent','casecomment','casecontactrole','casefeed','casehistory','caseshare','casesolution','casestatus','caseteammember','caseteamtemplatemember','caseteamtemplaterecord','categorydata','categorynode','categorynodelocalization','chatteractivity','chatterconversation','chatterconversationmember','chatterextension','chatterextensionlocalization','chattermessage','clientbrowser','collaborationgroupfeed','collaborationgroupmember',
            'collaborationgroupmemberrequest','collaborationgrouprecord','collaborationinvitation','combinedattachment','contactfeed','contacthistory','contactshare','contentasset','contentbody','contentdistributionview','contentdocument','contentdocumentfeed','contentdocumenthistory','contentdocumentlink','contentfolderitem','contentfolderlink','contentfoldermember','contenthubrepository','contentversion','contentversionhistory','contentworkspacedoc','contentworkspacemember','contractcontactrole','contractfeed','contracthistory','contractstatus','corswhitelistentry','crontrigger','csptrustedsite','custombrand','custombrandasset',
            'customobjectuserlicensemetrics','custompermission','custompermissiondependency','dashboard','dashboardcomponentfeed','dashboardfeed','datastatistics','datatype','datacloudaddress','declinedeventrelation','directmessagefeed','directmessagemember','documentattachmentmap','domain','domainsite','duplicaterule','emailcapture','emaildomainkey','emailmessage','emailmessagerelation','emailservicesaddress','emailservicesfunction','emailstatus','embeddedservicedetail','entitydefinition','entitysubscription','event','eventfeed','eventlogfile','eventrelation','externalattendance__share',
            'externaldatasource','externaldatauserauth','externaleventmappingshare','externalicexpense__share','externalsocialaccount','feedattachment','feedcomment','feeditem','feedlike','feedpollchoice','feedpollvote','feedrevision','feedtrackedchange','fielddefinition','fieldhistoryarchive','fieldpermissions','flexqueueitem','flowinterviewshare','folderedcontentdocument','goalfeed','goalhistory','goalshare','grantedbylicense','groupmember','idea','ideacomment','idpeventlog','knowledgeableuser','leadfeed','leadhistory','leadshare',
            'leadstatus','listviewchart','listviewchartinstance','logingeo','loginhistory','loginip','lookedupfromactivity','macrohistory','macroshare','matchingrule','matchingruleitem','metricdatalinkhistory','metricfeed','metrichistory','metricshare','mobileapplicationdetail','namedcredential','note','noteandattachment','oauthtoken','objectpermissions','openactivity','opportunitycompetitor','opportunitycontactrole','opportunityfeed','opportunityfieldhistory','opportunityhistory','opportunitypartner','opportunityshare','opportunitystage','orderfeed',
            'orderhistory','orderitem','orderitemchangeevent','orderitemfeed','orderitemhistory','ordershare','orglifecyclenotification','orgwideemailaddress','ownedcontentdocument','packagelicense','partner','partnerrole','period','permissionsetassignment','permissionsetlicense','permissionsetlicenseassign','picklistvalueinfo','platformaction','platformcachepartition','platformcachepartitiontype','pricebook2history','processinstance','processinstancehistory','processinstancenode','processinstancestep','processinstanceworkitem','product2feed','product2history','profileskillendorsementfeed','profileskillendorsementhistory','profileskillfeed',
            'profileskillhistory','profileskillshare','profileskilluserfeed','profileskilluserhistory','queuesobject','quicktexthistory','quicktextshare','recordtypelocalization','relationshipdomain','relationshipinfo','reportfeed','sosdeployment','sossessionfeed','sossessionhistory','sossessionshare','spsamlattributes','samlssoconfig','scontrollocalization','searchlayout','searchpromotionrule','securitycustombaseline','sessionpermsetactivation','setupaudittrail','setupentityaccess','sitedetail','sitefeed','sitehistory','socialpersonahistory','socialpostfeed','socialposthistory','socialpostshare',
            'solution','solutionfeed','solutionhistory','solutionstatus','stamp','stampassignment','stamplocalization','streamingchannelshare','task','taskfeed','taskpriority','taskstatus','tenantsecret','tenantusageentitlement','testsuitemembership','thirdpartyaccountlink','todaygoalshare','topicassignment','topicfeed','topiclocalization','twofactorinfo','twofactormethodsinfo','twofactortempcode','undecidedeventrelation','userappinfo','userappmenucustomization','userappmenucustomizationshare','userentityaccess','userfeed','userfieldaccess','userlistview','userlistviewcriterion',
            'userlogin','userpackagelicense','userpreference','userprovisioningconfig','userprovisioningrequestshare','userrecordaccess','usershare','verificationhistory','visualforceaccessmetrics','vote','weblinklocalization','workaccess','workaccessshare','workbadge','workbadgedefinitionfeed','workbadgedefinitionhistory','workbadgedefinitionshare','workcoachingfeed','workcoachinghistory','workcoachingshare','workfeedbackhistory','workfeedbackquestionhistory','workfeedbackquestionsethistory','workfeedbackquestionsetshare','workfeedbackquestionshare','workfeedbackrequestfeed','workfeedbackrequesthistory','workfeedbackrequestshare','workfeedbackshare','workfeedbacktemplateshare','workorder','workorderfeed',
            'workorderhistory','workorderlineitem','workorderlineitemfeed','workorderlineitemhistory','workorderlineitemstatus','workordershare','workorderstatus','workperformancecyclefeed','workperformancecyclehistory','workperformancecycleshare','workreward','workrewardfundfeed','workrewardfundhistory','workrewardfundshare','workrewardfundtypefeed','workrewardfundtypehistory','workrewardfundtypeshare','workrewardhistory','workrewardshare','workthanks','workthanksshare'
        ];
    }
    get name(){
        return this.obj.name;
    }
    get label(){
        return this.obj.label;
    }
    get keyPrefix(){
        return this.obj.keyPrefix;
    }
    get key(){
        return this._key;
    }
    get define(){
        return this._define;
    }
    set define(obj){
        this._define = obj;
        this.sortFields();
        this.markDuplicate();
    }
    get fields(){
        return this._define.fields || [];
    }
    get childRelationships(){
        return this._define.childRelationships || [];
    }
    get hash(){
        return '#!sobj-search:' + this.obj.name.toLowerCase();
    }
    get isCustom(){
        return this.obj.isCustom;
    }
    get isQueryable(){
        return this.obj.isQueryable;
    }
    /**
     * フィールド配列をソート
     */
    sortFields(){
        const bfld = {
            id               : 1,
            name             : 2,
            createddate      : 3,
            createdbyid      : 4,
            lastmodifieddate : 5,
            lastmodifiedbyid : 6,
            systemmodstamp   : 7,
            isdeleted        : 8,
            ownerid          : 9
        };
        this._define.fields = this._define.fields.sort(function(a, b){
            var x = bfld[a.name.toLowerCase()];
            var y = bfld[b.name.toLowerCase()];
            if(x && y){
                return x - y;
            }else if(x){
                return -1;
            }else if(y){
                return 1;
            }else{
                if(a.isCustom && !b.isCustom){
                    return 1;
                }else if(!a.isCustom && b.isCustom){
                    return -1;
                }
                return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
            }
        });
    }
    /**
     * フィールド配列の中でローカル名が重複しているものがあれば、名前空間なしの方に無視フラグをつける
     */
    markDuplicate(){
        const fmap = {};
        this.fields.forEach(function(field){
            const key = field.localName.toLowerCase();
            const other = fmap[key];
            if(other){
                if(other.name.length < field.name.length){
                    other._ignore = true;
                }else{
                    field._ignore = true;
                }
            }else{
                fmap[key] = field;
            }
        });
    }
    /**
     * SOQL用のカンマ区切りのフィールド名を返す
     * @return {Array.<string>}
     */
    getSoqlFieldNames(flag){
        const soqlFields = this.fields.filter(field => !field._ignore && field.typeName != 'BASE64' && (!flag || field.isCreateable));
        const names = [];
        soqlFields.forEach((field) => {
            names.push(field.name);
            if(field.typeName == 'REFERENCE' && field.relationshipName && !flag){
                const referenceTo = (field.referenceTo || []);
                const refs = referenceTo.filter(name => SObject.getNoNameObjs().indexOf(name.toLowerCase()) < 0);
                if(referenceTo.length == refs.length){
                    names.push(field.relationshipName + '.Name');
                }
            }
        });
        return names;
    }
    getSoqlFieldLabelNames(flag){
        const soqlFields = this.fields.filter(field => !field._ignore && field.typeName != 'BASE64');
        const labels = [];
        const names = [];
        soqlFields.forEach((field) => {
            names.push(field.name);
            labels.push(field.label);
            if(field.typeName == 'REFERENCE' && field.relationshipName){
                const referenceTo = (field.referenceTo || []);
                const refs = referenceTo.filter(name => SObject.getNoNameObjs().indexOf(name.toLowerCase()) < 0);
                if(referenceTo.length == refs.length){
                    names.push(field.relationshipName + '.Name');
                    if(flag){
                        labels.push((field.label.endsWith('ID') ? field.label.substring(0, field.label.length - 2) : field.label) + '.名前');
                    }else{
                        labels.push('');
                    }
                }
            }
        });
        return { names: names, labels: labels };
    }
    isReferenceField(name){
        const fields = this.fields.filter(field => (!field._ignore && field.name == name));
        return (fields.length && ['REFERENCE','ID'].indexOf(fields[0].typeName) >= 0);
    }
    getFieldByName(name){
        const fields = this.fields.filter(field => (!field._ignore && field.name == name));
        return (fields.length ? fields[0] : null);
    }
}