teasp.Tsf.receiptExifLogic = {
    /**
     * 画像情報は電帳法スキャナー保存要件に満たしているかをチェック
     */
    isSatisfyScannerStorageRequirement: function(imageWidth, imageHeight, imageBitsPerSample, imageColorType){
        var isShortSideValid = null;
        var isLongSideValid = null;
        var IsGradationValid = null;
        var isColorTypeValid = null;

        // 判定を実施
        if(imageWidth && imageHeight){
            var longSide = Math.max(imageWidth, imageHeight);
            var shortside = Math.min(imageWidth, imageHeight);
            isShortSideValid = shortside >= teasp.constant.SHORTSIDE_LOWERLIMIT;
            isLongSideValid = longSide >= teasp.constant.LONGSIDE_LOWERLIMIT;
        }
        if(imageBitsPerSample){
            IsGradationValid = imageBitsPerSample >= teasp.constant.BITSPERSAMPLE_LOWERLIMIT;
        }

        if(imageColorType){
            isColorTypeValid = imageColorType == teasp.constant.COLORTYPE_LIMIT;
        }

        return {
            isShortSideValid : isShortSideValid,
            isLongSideValid : isLongSideValid,
            IsGradationValid : IsGradationValid,
            isColorTypeValid : isColorTypeValid};
    },
    getExifFromBase64: function(base64) {
        try{
            var tags = ExifReader.load(_base64ToArrayBuffer(base64));
            return {
                bitsPerSample: tags['Bits Per Sample'].value,
                imageHeight: tags['Image Height'].value,
                imageWidth: tags['Image Width'].value,
                colorType: tags['Color Components'].value > 1 ? 'Color' : 'GrayScale'
            };
        } catch(err) {
            return {};
        }
    }
}
function _base64ToArrayBuffer(base64) {
	var binary_string = window.atob(base64);
	var len = binary_string.length;
	var bytes = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}