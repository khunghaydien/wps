import {SObject}  from "./obj/SObject.js?v=XVERSIONX";
import {Remoting} from "../_common/Remoting.js?v=XVERSIONX";
/**
 * SObjectマネージャクラス
 */
export class SObjManager {
    constructor(){
        this.sObjects = [];
    }
    getAll(){
        return this.sObjects;
    }
    getByName(name){
        const key = name.toLowerCase();
        for(let i = 0 ; i < this.sObjects.length ; i++){
            const sObject = this.sObjects[i];
            if(sObject.key == key){
                return sObject;
            }
        }
        return null;
    }
    getByPrefix(name){
        const key = name.substring(0, 3);
        for(let i = 0 ; i < this.sObjects.length ; i++){
            const sObject = this.sObjects[i];
            if(sObject.keyPrefix == key){
                return sObject;
            }
        }
        return null;
    }
    ready(){
        return new Promise((resolve, reject) => {
            if(this.sObjects.length){
                resolve();
            }else{
                this.fetchSObjectList().then(() => {
                    resolve();
                }, (errobj) => {
                    reject(errobj);
                });
            }
        });
    }
    fetchSObjectList(){
        return new Promise((resolve, reject) => {
            Remoting.request(tsCONST.API_REMOTE_ACTION, {action:'SObjectList'}).then(
                (result) => {
                    for(let key in result.sObjects){
                        this.sObjects.push(new SObject(result.sObjects[key]));
                    }
                    this.sObjects = this.sObjects.sort(function(a, b){
                        return (a.name < b.name ? -1 : 1);
                    });
                    resolve();
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    fetchSObjectDefine(key){
        return Remoting.request(tsCONST.API_REMOTE_ACTION, {action:'SObject',key:key});
    }
    fetchRecordById(sObject, id){
        const searchParam = {
            sObject: sObject,
            where: `id = '${id}'`,
            offset: 0,
            limit: 1,
            allRows: true
        };
        return new Promise((resolve, reject) => {
            if(!sObject.define){
                this.fetchSObjectDefine(sObject.key).then((obj) => {
                    sObject.define = obj;
                    this.fetchRecordBySoql(searchParam, resolve, reject);
                }).catch((event) => {
                    reject(event);
                });
            }else{
                this.fetchRecordBySoql(searchParam, resolve, reject);
            }
        });
    }
    /**
     * SOQLを作成する
     * @param {Object} searchParam 
     * @param {boolean=} countOnly 
     * @returns 
     */
    getSoql(searchParam, countOnly){
        let soql = 'select '
            + (countOnly ? 'Count()' : searchParam.sObject.getSoqlFieldNames().join(','))
            + ' from '
            + searchParam.sObject.name;
        if(searchParam.nextId){
            soql += ` where ID > '${searchParam.nextId}'`;
            if(searchParam.where){
                soql += ` and (${searchParam.where})`;
            }
        }else if(searchParam.where){
            soql += ` where ${searchParam.where}`;
        }
        if(!countOnly && searchParam.orderBy){
            soql += ` order by ${searchParam.orderBy}`;
        }
        if(countOnly && searchParam.allRows){
            soql += ' ALL ROWS';
        }
        return soql;
    }
    /**
     * 検索（STEP1=件数カウント）
     * @param {Object} searchParam 
     * @returns {Promise}
     */
     fetchRecordBySoqlStart(searchParam){
        return new Promise((resolve, reject) => {
            Remoting.request(tsCONST.API_REMOTE_ACTION, { action:'getCountQuery', soql:this.getSoql(searchParam, true) }).then(
                (result) => {
                    searchParam.dataSize = result.count;
                    if(!result.count){
                        resolve();
                    }else{
                        this.fetchRecordBySoql(searchParam, resolve, reject);
                    }
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    fetchRecordCount(searchParam){
        return new Promise((resolve, reject) => {
            Remoting.request(tsCONST.API_REMOTE_ACTION, { action:'getCountQuery', soql:this.getSoql(searchParam, true) }).then(
                (result) => {
                    resolve(result.count);
                },
                (event) => {
                    reject(event);
                }
            );
        });
    }
    /**
     * 検索（STEP2=レコード読み込み）
     * @param {Object} searchParam 
     * @param {Object} resolve
     * @param {Object} reject
     */
    fetchRecordBySoql(searchParam, resolve, reject){
        const soql = this.getSoql(searchParam);
        const req = {
            soql: soql,
            limit: searchParam.limit,
            offset: searchParam.offset,
            allRows: searchParam.allRows
        };
        Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
            (result) => {
                resolve(this.convertRecords(searchParam, result.records));
            },
            (event) => {
                reject(event);
            }
        );
    }
    fetchRecordLoopStart(searchParam){
        searchParam.orderBy = 'ID';
        const records = [];
        return new Promise((resolve, reject) => {
            this.fetchRecordLoop(searchParam, records, resolve, reject);
        });
    }
    fetchRecordLoop(searchParam, records, resolve, reject){
        const soql = this.getSoql(searchParam);
        const req = {
            soql: soql,
            limit: 100,
            offset: 0,
            allRows: searchParam.allRows
        };
        Remoting.request(tsCONST.API_REMOTE_ACTION, req).then(
            (result) => {
                if(!result.records.length){
                    resolve(records);
                }else{
                    this.convertRecords(searchParam, result.records).forEach((record) => { records.push(record); });
                    searchParam.nextId = records[records.length - 1].Id;
                    this.fetchRecordLoop(searchParam, records, resolve, reject);
                }
            },
            (event) => {
                reject(event);
            }
        );
    }
    /**
     * レコード変換
     * DATE型とDATETIME型の値を YYYY-MM-DD, YYYY-MM-DD hh:mm:ss に変換
     * @param {Object} searchParam 
     * @param {Array.<Object>} records 
     * @returns {Array.<Object>}
     */
    convertRecords(searchParam, records){
        const dateFields     = searchParam.sObject.fields.filter(field => (field.typeName == 'DATE'));
        const dateTimeFields = searchParam.sObject.fields.filter(field => (field.typeName == 'DATETIME'));
        records.forEach((record) => {
            dateFields.forEach((field) => {
                let v = record[field.name];
                if(v && typeof(v) == 'number'){
                    record[field.name] = moment(v).format('YYYY-MM-DD');
                }
            });
            dateTimeFields.forEach((field) => {
                let v = record[field.name];
                if(v && typeof(v) == 'number'){
                    record[field.name] = moment(v).format('YYYY-MM-DD HH:mm:ss');
                }
            });
        });
        return records;
    }
    fetchDefineLoopStart(keys){
        return new Promise((resolve, reject) => {
            this.fetchDefineLoop(keys, 0, resolve, reject);
        });
    }
    fetchDefineLoop(keys, index, resolve, reject){
        Remoting.request(tsCONST.API_REMOTE_ACTION, {action:'SObject',key:keys[index]}).then(
            (obj) => {
                const so = this.getByName(keys[index]);
                if(so){
                    so.define = obj;
                }
                if((index + 1) >= keys.length){
                    resolve();
                }else{
                    this.fetchDefineLoop(keys, index + 1, resolve, reject);
                }
            },
            (event) => {
                reject(event);
            }
        );
    }
}