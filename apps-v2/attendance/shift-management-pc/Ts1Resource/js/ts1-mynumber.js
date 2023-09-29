function initBindingEvents() {
	// タイプ選択（STEP0）
	$(".but_reg").on("click touchleave", function(e){
		params.regType = $(this).attr('id').slice(-1);
		switch (parseInt(params.regType)) {
		case 4:
			$(".step_number").text("4");
			$("#confirmation_msg").html(nl2br(attributes.msgToConfirmForOutsider));
			break;
		case 3:
			$(".step_number").text("2");
			$("#confirmation_msg").html(nl2br(attributes.msgToConfirmForOutsider));
			break;
		default:
			// 本人、扶養家族のステップ数は、switch_screenで設定される。
			//$(".step_number").text("2");
			$("#confirmation_msg").html(nl2br(attributes.msgToConfirm));
			break;
		}
		//params.currentStep = 0;
		params.nextStep = 1;
		params.isNoteConfirmed = false;
		//prepAndSend(this, false, false); // 第２、第３パラメータはダミー
		switch_screen(false);
		return false;
	});

	$("#note_confirm_button").on("click touchleave", function(e){
		params.isNoteConfirmed = true;
		switch_screen(false);
		return false;
	});
/*
	$(".outsider_name_block").on("click touchleave", function(e){
		if ($(".outsider_name").prop('disabled')) {
			alert("画像選択後に入力・修正してください。");
			return false;
		}
		return true;
	});

	$("#mynumber_block").on("click touchleave", function(e){
		if ($("#mynumber").prop('disabled')) {
			alert("画像選択後に入力・修正してください。");
			return false;
		}
		return true;
	});
*/
	$("#dependant_name").on("change", function(e){
		for (var i=0; i<attributes.dependants.length; i++) {
			if (attributes.dependants[i].name===$(this).val()) {
				attributes.dependantIndex = i;
				break;
			}
		}

		if (attributes.dependantIndex<0 || attributes.dependants.length<=attributes.dependantIndex) {
			alert(teasp.message.getLabel('em10002420')); // 一致する家族名がありません。（致命的エラー）// あり得ないはず
		}
		else {
			$("#relationship").text(teasp.dialog.ChangeEmp.prototype.getDispListValue( 'Relation__c', attributes.dependants[attributes.dependantIndex].relationship ));
			$("#insurance_type").text((attributes.dependants[attributes.dependantIndex].insType==3)?teasp.message.getLabel('em10001150'):teasp.message.getLabel('em10001160'));
/*
			if (attributes.dependants[attributes.dependantIndex].number!=undefined) {
				$('#mynumber').val(attributes.dependants[attributes.dependantIndex].number);
			}
*/
			if ( ( !attributes.isPhotoIdRequiredEmployee && params.regType == 1 ) ||
				 ( !attributes.isPhotoIdRequiredDependent && params.regType == 2 && attributes.dependants[attributes.dependantIndex].insType != 3 ) ||
				 ( !attributes.isPhotoIdRequiredDependentNo3 && params.regType == 2 && attributes.dependants[attributes.dependantIndex].insType == 3 ) ) {
				// 本人確認資料添付なし
				$(".step_number").text("1");
				$("#send_and_finish_but_on_step1").show();
				$("#send_and_goforward_but_on_step1").hide();
			}
			else {
				// 本人確認資料添付あり
				$(".step_number").text("2");
				$("#send_and_finish_but_on_step1").hide();
				$("#send_and_goforward_but_on_step1").show();
			}

			// OCR済みの名前と照合
			if (params.ocredLastName && params.ocredFirstName) {
				if (!isOcredNameCorrect(params.ocredLastName, params.ocredFirstName)) {
					//alert("OCRの名前と一致してません。"); // デバッグ
					//params.nameUnmatched = true;
				}
				else {
					// 三角マーク消す（OCRモーダル上とメイン画面上）
					//params.nameUnmatched = false;
				}
			}
		}
	});

	$(".send_and_goforward_but").on("click touchleave", function(e){
		if (validateStep()) {
			params.nextStep = parseInt($(this).attr('id').slice(-1)) + 1;
			prepAndSend(this, false, false);
		}
		else {
			//showErrorMessage("未入力があります。",null);
		}
		//switch_screen(true);
		return false;
	});

	$(".goforward_but").on("click touchleave", function(e){
		params.nextStep = parseInt($(this).attr('id').slice(-1)) + 1;
		switch_screen(false);
		return false;
	});

	$(".gobackward_but").on("click touchleave", function(e){
		params.nextStep = parseInt($(this).attr('id').slice(-1)) - 1;
		switch_screen(false);
		return false;
	});

	$(".send_and_finish_but").on("click touchleave", function(e){
		if (validateStep()) {
			params.nextStep = 5;
			prepAndSend(this, false, true);
		}
		else {
			//showErrorMessage("未入力があります。",null);
		}
		//switch_screen(true);
		return false;
	});

	$(".finish_but").on("click touchleave", function(e){
		params.nextStep = 5;
		prepAndSend(this, true, true);
		//switch_screen(false);
		return false;
	});

	$(".gostart_but").on("click touchleave", function(e){
		params.nextStep = 0;
		switch_screen(false);
		return false;
	});

	// 画像取得処理
	$(".attach_image, .reattach_mynumber_image, .reattach_image").on("click touchleave", function(e){
		//if(!useFlag) return;

		//$("#image_file2").click();

		var currentId = $(this).attr('id');
		var stepNum = currentId.slice(-1);
		if (stepNum==1 && params.isOcrAvailable) {
			$("#image_file1").val(''); // クリア（IEでは効かないらしいが関係ない）
		}

		$("#image_file"+currentId.slice(-1)).click();

		return false;
	});
/*
	$('#mynumber').on("change", function(e) {
		handleButtonValidity(1);
	});
*/
	$(".image_file").on("change", function(e){
		//loadingView(true);

		var files = $(this).prop("files");
		var length = files.length;

		if (!length) {
			return false;
		}

		if (!files[0].type.match(/image/)) {
			alert(teasp.message.getLabel('em10002430')); //画像ファイルではありません。
			return false;
		}

		//$("#image_area2").empty();

		var currentId = $(this).attr('id');
		var imageNum = currentId.slice(-1);
		var imageName = files[0].name;

		//$("#image_area"+imageNum).empty();
		//if (imageNum==1) $("#image_area_on_modal"+imageNum).empty();

		console.log("file size:"+files[0].size);
		/*
		if (3*1000*1000<files[0].size) {
			alert("画像サイズが3MBを超えているため登録できません。");
		}
		else
		*/
		if (window.FileReader) {
			// 画像表示

			// 画像データの条件
			// ファイルサイズ：3MB以下
			// 解像度：3M pixel 〜 8M pixel
			// ファイルサイズについて：3MB以上のものはユーザーに通知して、画像が大きすぎることを伝える。
			// 解像度について：3M pixel未満のものはユーザーに通知して、解像度が低すぎることを伝える。
			// 			  8M pixelより大きいものは、サイズ調整をする。

			var fr = new FileReader;

			fr.onload = function() { // file is loaded
				var img = new Image;

				img.onload = function() {
					//resizeAndDisplayImage($(document).width(), 0, 90, files[0], imageNum);
					resizeAndDisplayImage(1200, 0, 0.9, files[0], imageNum);

					/*
					if (img.width * img.height< 3000000) {
						alert("画像の解像度が低すぎます。300万〜800万ピクセルの画像を選択してください。");
					}
					else {
						var sizeRatio = (img.width * img.height) / 8000000;
						if (1<sizeRatio) {
							// ピクセル数が8Mを超える場合、resizeする。
							var sqrtSizeRatio = Math.sqrt(sizeRatio);
							var newWidth = Math.floor(img.width/sqrtSizeRatio);
							var newHeight = Math.floor(img.height/sqrtSizeRatio);
							var quality = Math.floor(100/sizeRatio);
							console.log("sizeRatio:"+sizeRatio+", width:"+newWidth+" height:"+newHeight+" quality:"+quality);
							resizeAndDisplayImage(newWidth, 0, 80, files[0], imageNum);
						}
						else {
							//resizeAndDisplayImage($(document).width(), 0, 80, files[0], imageNum);
							//resizeAndDisplayImage(img.width, 0, 80, files[0], imageNum);

							if (imageNum==1) {
								if (params.isOcrAvailable) {
									displayImageFile(0, files[0]);
									open_modal();
								}
								else {
									displayImageFile(imageNum, files[0]);
									$('.outsider_name').prop('disabled', false);
									$('#mynumber').prop('disabled', false);
								}
							}
							else {
								displayImageFile(imageNum, files[0]);
							}
						}
					}
					*/
				};
				img.src = fr.result; // is the data URL because called with readAsDataURL
			};

			fr.readAsDataURL(files[0]);
			//buttonEnable(true);
		}
		else {
			alert(teasp.message.getLabel('em10002440')); // ファイル読み込み未対応のブラウザです。
		}
		//loadingView(false);
	});
}

function resizeAndDisplayImage(width, height, quality, imageFile, imageNum) {
	new Compressor(imageFile, {
		quality: quality,
		success(result) {
			// リサイズ後のファイルサイズチェック
			console.log("リサイズ後のファイルサイズ：" + result.size + "bytes, width:"+ width + " height:" + height);
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
				if (imageNum==1) {
					if (params.isOcrAvailable) {
						displayImageData2(imageNum, imageFile.name, reader.result);
						upload_image_to_ocr();
					}
					else {
						displayImageData2(imageNum, imageFile.name, reader.result);
						$('.outsider_name').prop('disabled', false);
						$('.outsider_name').removeClass('red_ph');
						$('input#outsider_last_name').attr('placeholder',teasp.message.getLabel('em10002180')); // 氏名（姓）
						$('input#outsider_first_name').attr('placeholder',teasp.message.getLabel('em10002190')); // 氏名（名）
						$('#mynumber').prop('disabled', false);
						$('input#mynumber').removeClass('red_ph');
						$('input#mynumber').attr('placeholder',teasp.message.getLabel('em10002410')); // 12桁のマイナンバー
					}
				}
				else {
					displayImageData2(imageNum, imageFile.name, reader.result);
				}
			};
			reader.readAsDataURL(result);
		},
		width:width,
		height: 0,
		mimeType: 'image/jpeg',
		error(err) {
			console.log(err);
		},
	});
}

function initPlugIns() {
	// JPOSTAL
	$('#zipcode').jpostal({
		postcode : [
			'#zipcode'
		],
		address : {
			'#pref'  : '%3',
			'#addr1'  : '%4%5'
		}
	});
}

function initScreens() {
	if (params.isUnsupportedAndroid) {
		$('#instruction_step0').hide();
		$('#regtype_selection_panel').hide();
		$('#android_msg').text(params.msgForAndroid);
		$('#android_msg_panel').show();
		$('#init_error_msg_panel').hide();
		//$('#reg_step0 .title-bar').text('');
	}
	else if (params.isInitError) {
		$('#instruction_step0').hide();
		$('#regtype_selection_panel').hide();
		$('#android_msg_panel').hide();

		$('#init_error_msg').html(params.msgForInitError);
		$('#init_error_msg_panel').show();
	}
	else {

		// 本人の名前
		$("p.employee_name").text(attributes.employeeName);

		if (attributes.dependants.length==0) {
			//$("#reg_type2").prop("disabled", true);
			$("#reg_dependant_para").hide();
		}
		else {
			//$("#reg_type2").prop("disabled", false);
			$("#reg_dependant_para").show();
			// 家族selectの生成
			for (var i=0; i<attributes.dependants.length; i++) {
				$("#dependant_name").append($("<option>").val(attributes.dependants[i].name).text(attributes.dependants[i].name));
			}
			$("#relationship").text(attributes.dependants[attributes.dependantIndex].relationship);
			$("#insurance_type").text((attributes.dependants[attributes.dependantIndex].insType==3)?teasp.message.getLabel('em10001150'):teasp.message.getLabel('em10001160'));
		}

		// 支払調書受取人の権限があるか
		if ( attributes.IsAccessPaymentRecipient == false ||
			 attributes.IsAccessPaymentRecipientMyNumber == false ) {
			$("#reg_payment_para").hide();
			$("#reg_paymentAgent_para").hide();
		}
		else {
			$("#reg_payment_para").show();
			$("#reg_paymentAgent_para").show();
		}

		$('#android_msg_panel').hide();
		$('#init_error_msg_panel').hide();

				$('.outsider_name').prop('disabled', true);
				$('#mynumber').prop('disabled', true);
	}

	$("#reg_step0").show();
	adjust_cancel_button();
}

function clearScreens() {

	// screen1
	$('p.employee_name').text("");

	$('#ocr_note_card').hide();
	$('#ocr_error_text').html('');

	//$('#send_and_finish_but_on_step1').prop('disabled', true);
	//$('#send_and_goforward_but_on_step1').prop('disabled', true);
	//$('#send_and_finish_but_on_step2').prop('disabled', true);
	//$('#send_and_goforward_but_on_step2').prop('disabled', true);
	//$('#send_and_goforward_but_on_step3').prop('disabled', true);
	//$('#send_and_goforward_but_on_step4').prop('disabled', true);

	$('.image_frame').show();
	$('.reattach_mynumber_image').hide();
	$('.reattach_image').hide();

	$('select#dependant_name option').remove();

	$('#relationship').text("");
	$('#insurance_type').text("");

	$('.outsider_name').val("");

	$('#outsider_email').val("");

	$('#mynumber').val("");

	$('#zipcode').val("");
	$('#pref').val("北海道");
	$('#addr1').val("");
	$('#addr2').val("");
	$('#comments').val("");

	// OCR modal
	$("#image_area_on_modal1").empty();
	$("#ocr_next_button").text("OCRで読取る");

	$('#image_file1').val("");
	$('#image_file2').val("");
	$('#image_file3').val("");
	$('#image_file4').val("");
	$('#image_file5').val("");
	$('#image_file6').val("");

	$("#image_area1").empty();
	$("#image_area2").empty();
	$("#image_area3").empty();
	$("#image_area4").empty();
	$("#image_area5").empty();
	$("#image_area6").empty();

	// 氏名、マイナンバーフィールドを無効にしておく。
	$('.outsider_name').prop('disabled', true);
	$('#mynumber').prop('disabled', true);

	$('input.outsider_name').addClass('red_ph');
	$('input.outsider_name').attr('placeholder',teasp.message.getLabel('em10002070')); // 画像から自動取得
	$('input#mynumber').addClass('red_ph');
	$('input#mynumber').attr('placeholder',teasp.message.getLabel('em10002070')); // 画像から自動取得

	$('#finish_but_on_step2').parent().show();
}

function switch_screen(fake) {
	if (fake) {
		loadingView(true);
		setTimeout( function() {
			switch_screen2()
			loadingView(false);
		}, 3000 );
	}
	else {
		switch_screen2();
	}
}

function switch_screen2() {
	$(".reg_screen").hide();
	switch (parseInt(params.nextStep)) {
	case 0:
		params.init();
		clearScreens();
		//initScreens();
		break;
	case 1:
		if (!params.isNoteConfirmed) {
			$("#reg_confirmation").fadeIn();
			adjust_cancel_button();
			return;
		}

		if (params.regType==3 || params.regType==4) {
			// step_numberは、initBindingEventsの中で設定済み
			$("#send_and_finish_but_on_step1").hide();
			$("#send_and_goforward_but_on_step1").show();
		}
		else if ( ( !attributes.isPhotoIdRequiredEmployee && params.regType == 1 ) ||
				  ( !attributes.isPhotoIdRequiredDependent && params.regType == 2 && attributes.dependants[attributes.dependantIndex].insType != 3 ) ||
				  ( !attributes.isPhotoIdRequiredDependentNo3 && params.regType == 2 && attributes.dependants[attributes.dependantIndex].insType == 3 ) ) {
			// 本人確認資料添付なし
			$(".step_number").text("1");
			$("#send_and_finish_but_on_step1").show();
			$("#send_and_goforward_but_on_step1").hide();
		}
		else {
			// 本人確認資料添付あり
			$(".step_number").text("2");
			$("#send_and_finish_but_on_step1").hide();
			$("#send_and_goforward_but_on_step1").show();
		}

		params.initMyNumber = $( "input#mynumber" ).val();
		adjust_mynumber_form();
		break;
	case 2:
		switch (parseInt(params.regType)) {
		case 4:
			$("#send_and_finish_but_on_step2").hide();
			$("#send_and_goforward_but_on_step2").show();
			break;
		default:
			$("#send_and_finish_but_on_step2").show();
			$("#send_and_goforward_but_on_step2").hide();
		}
		$("#send_and_finish_but_on_step2").addClass('radius_right');

		break;
	}

	if(attributes.emSystemActive == true) {
		//EM の場合は二枚目の画像添付ができないように入力項目を表示しない
		$(".image_attachment_section2").hide();
	}

	params.currentStep = params.nextStep;

	if (params.nextStep==0) {
		loadSettings();
	}
	else {
		$("#reg_step"+params.currentStep).fadeIn();
	adjust_cancel_button();
	}
}

function adjust_cancel_button() {
	if (params.currentStep==0 || params.currentStep==5) $('#cancel_but').hide();
	else $('#cancel_but').show();
}

function adjust_mynumber_form() {
	//$('#mynumber').val("");

	switch (parseInt(params.regType)) {
	case 1:
		$('.employee_form').show();
		$('.dependant_form').hide();
		$('.outsider_form').hide();

		// マイナンバーの設定
/*
		if (attributes.employeeNumber || attributes.employeeNumber!=="") {
			$('#mynumber').val(attributes.employeeNumber);
		}
*/
		break;
	case 2:
		$('.employee_form').hide();
		$('.dependant_form').show();
		$('.outsider_form').hide();
/*
		if (attributes.dependants[attributes.dependantIndex].number!=undefined) {
			$('#mynumber').val(attributes.dependants[attributes.dependantIndex].number);
		}
*/
		break;
	case 3:
	case 4:
		$('.employee_form').hide();
		$('.dependant_form').hide();
		$('.outsider_form').show();
		break;
	}
}

function prepAndSend(buttonObj, isEmptyData, toComplete) {
	//e.preventDefault();
	if(!window.FormData){
		alert("サポート外のブラウザです。");
		return;
	}

	//var stepNum = parseInt($(buttonObj).attr('id').slice(-1));
	var stepNum = params.currentStep;
	//if (params.currentStep===0) stepNum = 0; // 最初のトップ画面だけ特別。（Logicの仕様変更への急遽対応のため）

	switch (stepNum) {
	//case 0:
	//	sendFormStep0();
	//	break;
	case 1:
		if ((params.regType==1 && (attributes.employeeNumber && 0<attributes.employeeNumber.length))
		|| (params.regType==2 && (attributes.dependants[attributes.dependantIndex].number && 0<attributes.dependants[attributes.dependantIndex].number.length))) {
		$("#confirmed_but").on("click.rereg touchleave.rereg", function(e){
			sendFormStep1(false, false, toComplete);
			$( this ).off(".rereg");
			$("#confirm_cancel_but").off(".rereg");
			$('#confirm_modal').modal('hide');
			return false;
		});
		$("#confirm_cancel_but").on("click.rereg touchleave.rereg", function(e){
			//params.currentStep = stepNum; // currentStepは、次のステップが代入されていたけど、これで戻す。
			$( this ).off(".rereg");
			$("#confirmed_but").off(".rereg");
			return true; // trueを返してデフォルトの処理へ
		});
		$('#confirm_modal').modal({backdrop: 'static', keyboard: false});
		}
		else {
			sendFormStep1(false, false, toComplete);
		}
		break;
	case 2:
		sendFormStep2(isEmptyData, toComplete);
		break;
	case 3:
		sendFormStep3(isEmptyData, toComplete);
		break;
	case 4:
		sendFormStep4(isEmptyData, toComplete);
		break;
	}
}


function open_modal() {
	params.ocrModalStep = 1;
	$('#ocr_next_button').text("OCRで読取る");
	$('#ocr_textdata_box').hide();
	$('#ocr_error_box').hide();
	$('#ocr_preview_box').show();

	$('#ocr_modal').modal({backdrop: 'static', keyboard: false});
}

function ocr_next() {
	switch (parseInt(params.ocrModalStep)) {
	case 1: // OCRで読取る
		upload_image_to_ocr();
		break;
	case 2: // 適用
		close_modal(false);
		break;
	}
}

function upload_image_to_ocr() {
	sendFormStep1(true, false, false);
}

function upload_image_to_ocr_dummy() {
	$("#fade").show();
	$("#loader").show();
	setTimeout( function() {
		$('#fade').delay(2000).fadeOut();
		$('#loader').delay(2000).fadeOut();
		$('#ocr_preview_box').delay(2000).fadeOut('fast', function(){
			//$('#ocr_name').text(attributes.employeeName);
			switch (parseInt(params.regType)) {
			case 1:
				$('#ocr_name').text(attributes.employeeName);
				$('#ocr_mynumber').text(attributes.employeeNumber);
				break;
			case 2:
				$('#ocr_name').text(attributes.dependants[attributes.dependantIndex].name);
				$('#ocr_mynumber').text(attributes.dependants[attributes.dependantIndex].number);
				break;
			case 3:
				attributes.outsiderIndex = 0;
				$('#ocr_name').text(attributes.outsiders[attributes.outsiderIndex].name);
				$('#ocr_mynumber').text(attributes.outsiders[attributes.outsiderIndex].number);
				break;
			case 4:
				attributes.outsiderIndex = 1;
				$('#ocr_name').text(attributes.outsiders[attributes.outsiderIndex].name);
				$('#ocr_mynumber').text(attributes.outsiders[attributes.outsiderIndex].number);
				break;
			}
			$("#ocr_next_button").text("適用");

			$('#ocr_textdata_box').fadeIn('fast');
			params.ocrModalStep = 2;
		});
	}, 300 );
}

function close_modal(error) {
	if (!error) {
			var nameStr = $('#ocr_name').text();
			var ss = nameStr.split(" ");
	if (ss.length==2) {
		params.ocredLastName = ss[0];
		params.ocredFirstName = ss[1];
	}
	else {
		params.ocredLastName = $('#ocr_name').text();
		params.ocredFirstName = "";
	}

		if (params.regType==3 || params.regType==4) {
/*
			var nameStr = $('#ocr_name').text();
			var ss = nameStr.split("/");
		if (ss.length==2) {
			$('#outsider_last_name').val(ss[0]);
			$('#outsider_first_name').val(ss[1]);
		}
		else {
			$('#outsider_last_name').val($('#ocr_name').text());
			$('#outsider_first_name').val("");
		}
*/
		$('#outsider_last_name').val(params.ocredLastName);
		$('#outsider_first_name').val(params.ocredFirstName);
		}
		$('#mynumber').val($('#ocr_mynumber').text());

		var imageNum = 1;
		var data = $("#image_src_on_modal"+imageNum).attr('src');

		//displayImageData(imageNum, data);
		displayImageData2(imageNum, $('#image_file1')[0].files[0].name, data);

	$('.outsider_name').prop('disabled', false);
	$('.outsider_name').removeClass('red_ph');
	$('input#outsider_last_name').attr('placeholder',teasp.message.getLabel('em10002180')); // 氏名（姓）
	$('input#outsider_first_name').attr('placeholder',teasp.message.getLabel('em10002190')); // 氏名（名）
	$('#mynumber').prop('disabled', false);
	$('input#mynumber').removeClass('red_ph');
	$('input#mynumber').attr('placeholder',teasp.message.getLabel('em10002410')); // 12桁のマイナンバー
	}
	$('#ocr_modal').modal('hide');
	params.ocrModalStep = 0;
}

function displayImageData(imageNum, data) {
	if (imageNum==0) { // OCRダイアログ上
		var img_src = $("<img>").attr({"src":data, "name":"image_src_on_modal1", "id":"image_src_on_modal1", "width":"70%"});
		$("#image_area_on_modal1").empty();
		$("#image_area_on_modal1").append(img_src);
		//$("#image_area_on_modal1").append("<p>");
		return;
	}
	var img_src = $("<img>").attr({"src":data, "name":"image_src"+imageNum, "id":"image_src"+imageNum, "width":"100%"});
	$("#image_area"+imageNum).empty();
	$("#image_area"+imageNum).append(img_src);
	//$("#image_area"+imageNum).append("<p>");

	//$("#image_notset_text"+imageNum).hide();
	//$('#attach_image'+imageNum).hide();
	$('#image_frame'+imageNum).hide();
	$('#reattach_image'+imageNum).show();
}

function displayImageData2(imageNum, fileName, data) {
	if (imageNum==0) { // OCRダイアログ上
		//var img_src = $("<img />").attr({"src":data, "name":"image_src_on_modal1", "id":"image_src_on_modal1", "width":"70%"});
		var img_src = $("<img />").attr({src:data,  name:"image_src_on_modal1", id:"image_src_on_modal1", width:"70%", "data-filename":fileName});
		$("#image_area_on_modal1").empty();
		$("#image_area_on_modal1").append(img_src);
		//$("#image_area_on_modal1").append("<p>");
		return;
	}
	//var img_src = $("<img>").attr({"src":data, "name":"image_src"+imageNum, "id":"image_src"+imageNum, "width":"100%"});
	var img_src = $("<img />").attr({src:data,  name:"image_src"+imageNum, id:"image_src"+imageNum, width:"100%", "data-filename":fileName});
	$("#image_area"+imageNum).empty();
	$("#image_area"+imageNum).append(img_src);
	//$("#image_area"+imageNum).append("<p>");

	//$("#image_notset_text"+imageNum).hide();
	//$('#attach_image'+imageNum).hide();
	$('#image_frame'+imageNum).hide();
	$('#reattach_image'+imageNum).show();
}

function displayImageData3(imageNum, type, data) {
	if (imageNum==0) { // OCRダイアログ上
		//var img_src = $("<img />").attr({"src":data, "name":"image_src_on_modal1", "id":"image_src_on_modal1", "width":"70%"});
		var img_src = $("<img />").attr({src: "data:" + type + ";base64," + data,  name:"image_src_on_modal1", id:"image_src_on_modal1", width:"70%"})
		$("#image_area_on_modal1").empty();
		$("#image_area_on_modal1").append(img_src);
		//$("#image_area_on_modal1").append("<p>");
		return;
	}
	//var img_src = $("<img>").attr({"src":data, "name":"image_src"+imageNum, "id":"image_src"+imageNum, "width":"100%"});
	var img_src = $("<img />").attr({src: "data:" + type + ";base64," + data,  name:"image_src"+imageNum, id:"image_src"+imageNum, width:"100%"})
	$("#image_area"+imageNum).empty();
	$("#image_area"+imageNum).append(img_src);
	//$("#image_area"+imageNum).append("<p>");

	//$("#image_notset_text"+imageNum).hide();
	//$('#attach_image'+imageNum).hide();
	$('#image_frame'+imageNum).hide();
	$('#reattach_image'+imageNum).show();
}

function displayImageFile(imageNum, file) {
	var fileRdr = new FileReader();
	fileRdr.onload = function() {
		//displayImageData(imageNum, fileRdr.result);
		displayImageData2(imageNum, file.name, fileRdr.result);
		//displayImageData2(imageNum, file.type, fileRdr.result.split(',')[1]);
	}
	fileRdr.readAsDataURL(file);
}

function loadingView(flag) {
	$('#loading-view').remove();
	if(!flag) return;
	$('<div id="loading-view" />').appendTo('#ts1-area');
}
function showErrorMessage(msg, func) {
	//$('#error_message').text(msg);
	//$('#error_message_box').show();

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
	//$('#error_message').text(msg);
	//$('#error_message_box').show();

	$('#info_modal_title').text(teasp.message.getLabel('tf10005010')); // エラー
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
	//$('#info_message').text(msg);
	//$('#info_message_box').show();

	$('#info_modal_title').text(teasp.message.getLabel('tm20004700')); // 情報
	$('#info_modal_body').text(msg);
	$('#info_modal_close_but').on('click.info touchleave.info', function(e){
		if (func) func();
		$( this ).off( ".info" );
		$('#info_modal').modal('hide');
		return false;
	});

	$('#info_modal').modal({backdrop: 'static', keyboard: false});
}

function isOcredNameCorrect(lastName, firstName) {
	if (!lastName || !firstName) return false;
	var ocredName = lastName+ " "+firstName;

	if (params.regType==1 && attributes.employeeName===ocredName) return true;
	else if (params.regType==2 && attributes.dependants[attributes.dependantIndex].name===ocredName) return true;
	else if ( ( params.regType == 3 || params.regType == 4 ) && ( $('#outsider_last_name').val() + " " + $('#outsider_first_name').val() ) ===ocredName) return true;

	return false;
}

function nl2br(str) {
	if (str) return str.replace(/[\n\r]/g, "<br />");
	else return str;
}