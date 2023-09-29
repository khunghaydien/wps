function initBindingEvents() {

	$(".send_and_finish_but").on("click touchleave", function(e){
		params.regType = "1";
		if (validateStep()) {
			params.nextStep = 2;
			prepAndSend(false, true);
		}

		return false;
	});

	$("#send_to_input_service_and_finish_but ").on("click touchleave", function(e){
		params.regType = "2";
		if (validateStep()) {
			params.nextStep = 2;
			prepAndSend(false, true);
		}

		return false;
	});

	$(".gostart_but").on("click touchleave", function(e){
		params.nextStep = 1;
		switch_screen();
		return false;
	});

	// 画像取得処理
	$(".attach_image, .reattach_image").on("click touchleave", function(e){
		var currentId = $(this).attr('id');
		var stepNum = currentId.slice(-1);
		if (stepNum==1 && settings.enableOcr) {
			$("#image_file1").val(''); // クリア（IEでは効かないらしいが関係ない）
		}

		$("#image_file"+currentId.slice(-1)).click();

		return false;
	});

	$("#issuer_search_but").on("click touchleave", function(e){
		search_for_issuer();
		return false;
	});

	$("input#receipt_issuer").blur(function () {
		updateStyleOnInput($("input#receipt_issuer"));
	}).focus(function() {
		$(this).css('text-align','start');
	});
	$("input#receipt_telnum").blur(function () {
		updateStyleOnInput($("input#receipt_telnum"));
	}).focus(function() {
		$(this).css('text-align','start');
	});
	$("input#receipt_telnum").keyup(function () {
   		if ($(this).val()) {
			$('#issuer_search_but').prop('disabled', false);
   		}
   		else {
			$('#issuer_search_but').prop('disabled', true);
   		}
	});
	$("input#receipt_title").blur(function () {
		updateStyleOnInput($("input#receipt_title"));
	}).focus(function() {
		$(this).css('text-align','start');
	});
	$("input#amount").blur(function () {
		updateStyleOnInput($("input#amount"));
	}).focus(function() {
		if ($(this).val()!=null && $(this).val()!="") {
			var ts = removeComma($(this).val());
			$(this).val(parseInt(ts,10));
		}

		$(this).css('text-align','start');
	});

	$(".image_file").on("change", function(e){
		var files = $(this).prop("files");
		var length = files.length;

		if (!length) {
			return false;
		}

		if (!files[0].type.match(/image/)) {
			alert("画像ファイルではありません。");
			return false;
		}

		var currentId = $(this).attr('id');
		var imageNum = currentId.slice(-1);
		var imageName = files[0].name;

		// 画像データの条件
		// ファイルサイズ：3MB以下
		// 解像度：3M pixel 〜 8M pixel
		// ファイルサイズについて：3MB以上のものはリサイズしてみる。
		// 解像度について：3M pixel未満のものはとりあえずOCRエンジンに送る。
		// 			  8M pixelより大きいものはリサイズしてみる。

		console.log("file size:"+files[0].size);
		if (!window.FileReader) {
			alert("ファイル読み込み未対応のブラウザです。");
		}
		else {
			var options = {canvas:true};
			// Orientationの設定
			loadImage.parseMetaData(files[0], function (data) {
				if (data.exif) {
					options.orientation = data.exif.get('Orientation'); 
				}
			});
			loadImage(
				files[0],
				function (img) { // canvas
					var maxSize = 1*1000*1000; // 1MB（base64で）

					var type = 'image/jpeg';  
					// canvas から DataURL で画像を出力  
					var dataurl = img.toDataURL(type);  

					// 非圧縮ファイルを保持しておく。
					var fr = new FileReader();
					fr.onload = function(e) {
						$('#original_image_src').remove();
						var img_src = $('<img />').attr({src:e.target.result, id:'original_image_src', 'data-filename':files[0].name, 'data-filetype':files[0].type });
						$('#image_input_area').append(img_src);

						if (dataurl.length<=maxSize) { // base64のサイズで判断
							console.log("image data size "+dataurl.length+" is smaller than or equal to "+maxSize+" bytes");
							// ファイルサイズがmaxSizeバイト以下の場合。
							var sizeRatio = (img.width * img.height) / 7000000; // 8000000だとエンジン側でエラーになってしまった。
							console.log("img width:"+img.width + " height:"+ img.height + " volume:" + sizeRatio);
							// ピクセル数が8Mを超える場合、8M以下になるようリサイズしてみる。
							//（ピクセル数を落としているのにファイルサイズが大きくなることがある...）
							if (1.0<sizeRatio) {
								console.log("resizing image data");
								var sqrtSizeRatio = Math.sqrt(sizeRatio);
								var newWidth = Math.floor(img.width/sqrtSizeRatio);
								var newHeight = Math.floor(img.height/sqrtSizeRatio);
								//var quality = Math.floor(100.0/sizeRatio);
								var quality = 0.9;
								console.log("sizeRatio:"+sizeRatio+", width:"+newWidth+" height:"+newHeight+" quality:"+quality);
								resizeAndDisplayImage(newWidth, 0, quality, files[0], imageNum);
							}
							else {
								console.log("using original image data");
								//var imageUrl = (window.URL ? URL : webkitURL).createObjectURL( blob );
								if (!isJpeg(files[0].name)) {
									alert("画像フォーマットをJPEGにしてください。");
									return false;
								}
								setImageData(imageNum, files[0].name, dataurl);
							}
						}
						else {
							console.log("image data size "+dataurl.length+" is bigger than "+maxSize+" bytes, resizing image data");
							// ファイルサイズがmaxSizeバイトを超える場合、決め打ちでリサイズしてみる。
							resizeAndDisplayImage(1200, 0, 0.9, files[0], imageNum);
						}
					}
					fr.readAsDataURL(files[0]);

				},
				options // Options
			);
		}
	});
}

function toBlob(dataUrl, dataType) {
	// DataURL のデータ部分を抜き出し、Base64からバイナリに変換  
	var bin = atob(dataUrl.split(',')[1]);  
	// 空の Uint8Array ビューを作る  
	var buffer = new Uint8Array(bin.length);  
	// Uint8Array ビューに 1 バイトずつ値を埋める  
	for (var i = 0; i < bin.length; i++) {  
  		buffer[i] = bin.charCodeAt(i);  
	}  
	// Uint8Array ビューのバッファーを抜き出し、それを元に Blob を作る  
	return new Blob([buffer.buffer], {type: dataType});
}

function updateStyleOnInput(inputEle) {
	if (inputEle.val()==null || inputEle.val()=="") {
		//inputEle.css('text-align','center');
		inputEle.css('text-align','start');
		if (inputEle.is($('input#receipt_telnum'))) {
			$('#issuer_search_but').prop('disabled', true);
		}
	}
	else if (inputEle.is($("input#amount"))) {
		var num = inputEle.val();
		//$(this).val(num.toLocaleString());
		var tNum = String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' );
		inputEle.val(tNum);
		inputEle.css('text-align','end');
	}
	else {
		inputEle.css('text-align','start');
		if (inputEle.is($('input#receipt_telnum'))) {
			var ts = removeComma($('input#receipt_telnum').val()); // この関数は数字だけにしてくれる
			$('input#receipt_telnum').val(ts);
			$('#issuer_search_but').prop('disabled', false);
		}
	}
}

function resizeAndDisplayImage(width, height, quality, imageFile, imageNum) {
	new Compressor(imageFile, {
		quality: quality,
		success(result) {
			// リサイズ後のファイルサイズチェック
			console.log("リサイズ後のファイルサイズ：" + result.size + "bytes, width:"+ width + " height:"+height);
			if (result.size > 3*1000*1000) {
				alert(teasp.message.getLabel('em10002450')); // 画像サイズが3MBを超えているため登録できません。
				return false;
			}
			
			if (!isJpeg(imageFile.name)) {
				alert(teasp.message.getLabel('em10002460')); // 画像フォーマットをJPEGにしてください。
				return false;
			}
			var reader= new FileReader();
			reader.onloadend= function(){
				console.log(reader.result);
				setImageData(imageNum, imageFile.name, reader.result);
			};
			reader.readAsDataURL(result);
		},
		width:width,
		height: 0,
		mimeType: 'image/jpeg',
		error(err) {},
	});
}

function initScreens() {
	(settings.useExtService)? $('#ext_service_credit').show():$('#ext_service_credit').hide();

	if (params.isInitError) {
		$('#init_error_title').html(params.titleForInitError);
		$('#init_error_msg').html(params.msgForInitError);
		$('#init_error_screen').show();
		adjust_send_button();
	}
	else {
		(settings.enableIssuerSearch)? $('#receipt_telnum_group').show():$('#receipt_telnum_group').hide();

		switch_screen();
	}
}

function clearScreens() {

	// screen1
	
	$('#ocr_note_card').hide();
	$('#ocr_error_text').html('');

	$('#receiptexif_msg').hide();

	$('.image_frame').show();
	$('.reattach_image').hide();
	$('.under_image_button_group').hide();

	$('#receipt_issuer').val("");
	$('#receipt_telnum').val("");
	$('#receipt_title').val("");
	$('#amount').val("");
	$('#receipt_date').val("");
	updateStyleOnInput($('#receipt_issuer'));
	updateStyleOnInput($('#receipt_telnum'));
	updateStyleOnInput($('#receipt_title'));
	updateStyleOnInput($('#amount'));

	$('#comments').val("");

	$('#image_file1').val("");
	$('#image_area1').empty();

	$('#receipt_issuer').prop('disabled', true);
	$('#receipt_telnum').prop('disabled', true);
	$('#issuer_search_but').prop('disabled', true);
	$('#receipt_title').prop('disabled', true);
	$('#amount').prop('disabled', true);
	$('#amount_unit_label').addClass('amount_unit_label_disabled');
	$('#receipt_date').prop('disabled', true);

	$('#receipt_date').hide();
	$('#receipt_date_dummy').show();
	$('#receipt_date_dummy').prop('disabled', true);

	$('input#receipt_issuer').addClass('red_ph');
	$('input#receipt_issuer').attr('placeholder','（発行者(店名)）');
	$('input#receipt_telnum').addClass('red_ph');
	$('input#receipt_telnum').attr('placeholder','（電話番号）');
	$('input#receipt_title').addClass('red_ph');
	$('input#receipt_title').attr('placeholder','（摘要）');
	$('input#amount').addClass('red_ph');
	$('input#amount').attr('placeholder','（金額）');
	$('input#receipt_date').addClass('red_ph');
	$('input#receipt_date').attr('placeholder','（利用日）');
}

function switch_screen() {
    $(".reg_screen").hide();
    switch (parseInt(params.nextStep)) {
    case 1:
    	if (params.currentStep==2) params.init();
    	clearScreens();
    	if (settings.enableInputSupport) {
    		$('#send_to_input_service_and_finish_but').show();
    	}
    	else {
    		$('#send_to_input_service_and_finish_but').hide();
    	}
	break;
    }
    params.currentStep = params.nextStep;
    
    $("#reg_step"+params.currentStep).fadeIn();
    adjust_send_button();
}

function prepAndSend(isEmptyData, toComplete) {
    //e.preventDefault();
    if(!window.FormData){
        alert("サポート外のブラウザです。");
        return;
    }

    var stepNum = params.currentStep;
    //if (params.currentStep===0) stepNum = 0; // 最初のトップ画面だけ特別。（Logicの仕様変更への急遽対応のため）

    switch (stepNum) {
    //case 0:
    //    sendFormStep0();
    //    break;
    case 1:
        sendFormStep1(false, toComplete);
        break;
    }
}

function upload_image_to_ocr() {
	sendFormStep1(true, false);
}

function setImageData(imageNum, fileName, fileData) {
	if (imageNum==1) {
			
		// 領収書EXIF判定を画面表示
		if (settings.useScannerStorage) {
			var exifTags = getExif();
			displayExifValidateResult(exifTags);
		}

		if (settings.enableOcr) {
			displayImageData(imageNum, fileName, fileData);
			upload_image_to_ocr();
		}
		else {
			displayImageData(imageNum, fileName, fileData);
			$('#receipt_issuer').prop('disabled', false);
			$('input#receipt_issuer').removeClass('red_ph');
			$('input#receipt_issuer').attr('placeholder','（発行者(店名)）');
			$('#receipt_telnum').prop('disabled', false);
			$('input#receipt_telnum').removeClass('red_ph');
			$('input#receipt_telnum').attr('placeholder','（電話番号）');
			$('#issuer_search_but').prop('disabled', false);
			$('#receipt_title').prop('disabled', false);
			$('input#receipt_title').removeClass('red_ph');
			$('input#receipt_title').attr('placeholder','（摘要）');
			$('#amount').prop('disabled', false);
			$('input#amount').removeClass('red_ph');
			$('input#amount').attr('placeholder','（金額）');
			$('#amount_unit_label').removeClass('amount_unit_label_disabled');
			$('#receipt_date').prop('disabled', false);
			$('input#receipt_date').removeClass('red_ph');
			$('input#receipt_date').attr('placeholder','（利用日）');

			$('input#receipt_date').show();
			$('input#receipt_date_dummy').hide();
		}
	}
	else {
		displayImageData(imageNum, fileName, fileData);
	}
}

function displayImageData(imageNum, fileName, imageData) {
	var img_src = $('<img />').attr({src:imageData,  name:'image_src'+imageNum, id:'image_src'+imageNum, width:'100%', 'data-filename':fileName});
	$('#image_area'+imageNum).empty();
	$('#image_area'+imageNum).append(img_src);
	$('#image_frame'+imageNum).hide();
	$('#reattach_image'+imageNum).show();
	$('.under_image_button_group').show();
}

function displayImageFile(imageNum, file) {
	var fr = new FileReader();
	fr.onload = function() {
		console.log("data url'ed file size:"+fr.result.length);
         		var rawBytes = new Uint8Array(fr.result);
		console.log("data url'ed file size2:"+rawBytes.length);
		//displayImageData(imageNum, fileRdr.result);
		var imageUrl = (window.URL ? URL : webkitURL).createObjectURL( file );
		displayImageData(imageNum, file.name, imageUrl);
		//displayImageData2(imageNum, file.type, fileRdr.result.split(',')[1]);
		upload_image_to_ocr();
	}
	//fr.readAsDataURL(file);
	fr.readAsArrayBuffer(file);
}

function adjust_send_button() {
    if (params.currentStep==2 || params.isInitError) $('#send_and_finish_but_on_step1').hide();
    else $('#send_and_finish_but_on_step1').show();
}

function loadingView(flag) {
	$('#loading-view').remove();
	if(!flag) return;
	$('<div id="loading-view" />').appendTo('#ts1-area');
}
function showErrorMessage(msg, func) {

	$('#info_modal_title').text('エラー');
	$('#info_modal_body').text(msg);
	$('#info_modal_close_but').on('click.err touchleave.err', function(e){
		if (func) func();
		$( this ).off(".err");
		$('#info_modal').modal('hide');
		return false;
	});
	$('#info_modal').modal({backdrop: 'static', keyboard: false});
}
function showHtmlErrorMessage(msg, func) {

	$('#info_modal_title').text('エラー');
	$('#info_modal_body').html(msg);
	$('#info_modal_close_but').on('click.err touchleave.err', function(e){
		if (func) func();
		$( this ).off(".err");
		$('#info_modal').modal('hide');
		return false;
	});
	$('#info_modal').modal({backdrop: 'static', keyboard: false});
}
function showInfoMessage(msg, func) {

	$('#info_modal_title').text('情報');
	$('#info_modal_body').text(msg);
	$('#info_modal_close_but').on('click.info touchleave.info', function(e){
		if (func) func();
		$( this ).off( ".info" );
		$('#info_modal').modal('hide');
		return false;
	});

	$('#info_modal').modal({backdrop: 'static', keyboard: false});
}
function showHtmlInfoMessage(msg, func) {

	$('#info_modal_title').text('情報');
	$('#info_modal_body').html(msg);
	$('#info_modal_close_but').on('click.info touchleave.info', function(e){
		if (func) func();
		$( this ).off( ".info" );
		$('#info_modal').modal('hide');
		return false;
	});

	$('#info_modal').modal({backdrop: 'static', keyboard: false});
}

function nl2br(str) {
	if (str) return str.replace(/[\n\r]/g, "<br />");
	else return str;
}

/* 
* 判定結果の画面表示
* nullの場合："未判定"
*/
function displayExifValidateResult(exiftags) {

	// EXIF情報を取得
	let imageWidth = exiftags.imageWidth;
	let imageHeight = exiftags.imageHeight;
	let imageBitsPerSample = exiftags.bitsPerSample;
	let imageColorType = exiftags.colorType;

	// 判定を実施
	let checkResult = teasp.Tsf.receiptExifLogic.isSatisfyScannerStorageRequirement(imageWidth,imageHeight,imageBitsPerSample,imageColorType);

	let isShortSideValid = checkResult.isShortSideValid;
	let isLongSideValid = checkResult.isLongSideValid;
	let IsGradationValid = checkResult.IsGradationValid;
	let isColorTypeValid = checkResult.isColorTypeValid;

	// エラーメッセージの配列
	let messageStr = '';
	// 未判定のとき
	if(isShortSideValid == null && isLongSideValid == null && IsGradationValid == null && isColorTypeValid == null){
		messageStr = '<span style="color: navy">' + teasp.message.getLabel('ex00001110') + '</span>'
		// 判定OKのとき
	} else if(isShortSideValid && isLongSideValid && IsGradationValid && isColorTypeValid){
		messageStr = '<span>' + teasp.message.getLabel('ex00001100') + '</span>'
		// 判定NGのとき
	} else {
		let messages = [];
		
		if(!isShortSideValid){
			messages.push('<li>' + teasp.message.getLabel('ex00001060') + '</li>');
		}
		if(!isLongSideValid){
			messages.push('<li>' + teasp.message.getLabel('ex00001050') + '</li>');
		}
		if(!IsGradationValid){
			messages.push('<li>' + teasp.message.getLabel('ex00001070') + '</li>');
		}
		if(!isColorTypeValid){
			messages.push('<li>' + teasp.message.getLabel('ex00001080') + '</li>');
		}
		let errorReasons = '<ul style="color: navy">' + messages.join('\n') + '</ul>';
		
		messageStr = 
		'<p style="color: navy">' + teasp.message.getLabel('ex00001040') + '</p>'
		+ errorReasons
		+ '<p style="color: navy">' + teasp.message.getLabel('ex00001090') + '</p>';
	}

	console.log('横幅：' + imageWidth + ' 縦幅：' + imageHeight + ' ビット深度：' + imageBitsPerSample + ' カラータイプ：' + imageColorType);
	let errorMessageArea = dojo.byId('receiptexif_msg');
	errorMessageArea.innerHTML = '';
	dojo.create("div", { id: 'exifError', innerHTML: messageStr }, errorMessageArea);
	$('#receiptexif_msg').show();
}