/**
 * サーバ通信
 */
export class Remoting {
    static request(cmd, cmdParam){
        return new Promise((resolve, reject) => {
            console.log(cmdParam);
            const req = (typeof(cmdParam) == 'object' ? JSON.stringify(cmdParam) : cmdParam);
            Visualforce.remoting.Manager.invokeAction(cmd, req,
                (result, event) => {
                    if(event.status && result.result != 'NG'){
                        console.log(result);
                        resolve(result);
                    }else{
                        console.log(event);
                        reject(event);
                    }
                },
                { escape : false }
            );
        });
    }
}