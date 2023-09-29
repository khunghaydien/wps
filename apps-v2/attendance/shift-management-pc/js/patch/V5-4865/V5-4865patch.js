if(typeof(teasp) == 'object' && (!teasp.resolved || !teasp.resolved['V5-4865']) && teasp.Tsf && teasp.Tsf.FormExpPrint){
    teasp.Tsf.FormExpPrint.isImage = function(attach){
        if(/^image/i.test(attach.ContentType)){
            return true;
        }
        if (attach.ContentDocument) {
            const imageTypes = ['JPG','JPEG','JPE','PNG','GIF'];
            if (imageTypes.indexOf(attach.ContentDocument.FileType) !== -1){
                return true;
            }
        }
        return false;
    };
}