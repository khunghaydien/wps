function sendFormStep1(ocrFlag, toComplete) {
	console.log("sending form for step 1...");

	var receiptIssuer = $('#receipt_issuer').val();
	var receiptTelNum = $('#receipt_telnum').val();
	var receiptTitle = $('#receipt_title').val();
	
	var amount = $('#amount').val();
	// カンマ削除
	if (amount!=null && amount!="") {
		var ts = removeComma($('#amount').val());
		amount = parseInt(ts,10);
	}

	var receiptDate = $('#receipt_date').val();
	
	// Flagの生成
	var modifiedIssuerFlag = false;
	var modifiedTelNumFlag = false;
	var modifiedTitleFlag = false;
	var modifiedAmountFlag = false;
	var modifiedDateFlag = false;

	// 金額、日付、電話番号のみ確認。OCR結果が空（またはスペース、タブのみ）の場合は除外
	if (params.ocrReceiptTelNum!=null && params.ocrReceiptTelNum.replace(/\s+/g, "")!="") {
		modifiedTelNumFlag = (receiptTelNum===params.ocrReceiptTelNum)?false:true;
	}
	if (params.ocrReceiptIssuer!=null && params.ocrReceiptIssuer.replace(/\s+/g, "")!="") {
		modifiedIssuerFlag = (receiptIssuer===params.ocrReceiptIssuer)?false:true;
	}
	if (params.ocrAmount!=null && params.ocrAmount.replace(/\s+/g, "")!="") {
		modifiedAmountFlag = (amount===parseInt(params.ocrAmount, 10))?false:true;
	}
	if (params.ocrReceiptDate!=null && params.ocrReceiptDate.replace(/\s+/g, "")!="") {
		modifiedDateFlag = (receiptDate===params.ocrReceiptDate)?false:true;
	}

	var imageFile = $("#image_src1").attr('src'); // resizeCanvasで生成されたもの（たぶんbase64になってる）
	console.log("imageFile size "+imageFile.length);
	var imageFileName = $("#image_src1").data('filename');
	
	var req = {
		ocrFlag: ocrFlag,
		regType: params.regType,
		stepNum: "1",
		ocrReceiptIssuer: params.ocrReceiptIssuer,
		receiptIssuer: receiptIssuer,
		receiptTelNum: receiptTelNum,
		receiptTitle: receiptTitle,
		amount: amount,
		receiptDate: receiptDate,
		modifiedIssuerFlag: modifiedIssuerFlag,
		modifiedTelNumFlag: modifiedTelNumFlag,
		modifiedTitleFlag: modifiedTitleFlag,
		modifiedAmountFlag: modifiedAmountFlag,
		modifiedDateFlag: modifiedDateFlag,
		imageFileName: imageFileName,
		imageFile: imageFile,
		toComplete: toComplete,
		exif: '{}'
	};

	/* 画像取得 */
	
	if(ocrFlag == false){
		var exifTags = getExif();
		// 領収書登録時のみリクエストにEXIF情報を送る
		req.exif = JSON.stringify(exifTags);
	}
	
	loadingView(true);

	sendFormData1(req.ocrFlag, 
					req.regType, 
					req.stepNum, 
					req.ocrReceiptIssuer, 
					req.receiptIssuer, 
					req.receiptTelNum, 
					req.receiptTitle, 
					req.amount, 
					req.receiptDate, 
					req.modifiedIssuerFlag, 
					req.modifiedTelNumFlag, 
					req.modifiedTitleFlag, 
					req.modifiedAmountFlag, 
					req.modifiedDateFlag, 
					req.imageFileName, 
					req.imageFile, 
					req.toComplete, 
					req.exif);
}

/**
 * 画像対象からExif情報を取得する
 */
function getExif() {
	var imageElm = $("#original_image_src").attr('src').split(',')[1];
	return teasp.Tsf.receiptExifLogic.getExifFromBase64(imageElm);
}
function resultHandlerStep1(result) {

	if (result.ocrFlag) {
		params.ocrErrorCode = result.statusCode;
		if (result.result == 'OK') {
			// 0

			$('#receipt_issuer').val(result.ocrReceiptIssuer);
			$('#receipt_telnum').val(result.ocrReceiptTelNum);
			$('#receipt_title').val(result.ocrReceiptTitle);
			$('#amount').val(result.ocrAmount);
			// 日付が解析できず'0002-11-30'が返った時は空欄にする
			var date = (result.ocrReceiptDate == '0002-11-30' ? '' : result.ocrReceiptDate);
			$('#receipt_date').val(date);

		} else {
			// -2:OCR処理に失敗、-30:入力ピクセルサイズオーバーなど、それ以外（1またはHTTP ステータスコード）
			console.log("result=" + result.result + " " + result.msg);
			showHtmlErrorMessage("通信に失敗しました。<br/>"+result.msg, null);

			$('#receipt_issuer').val('');
			$('#receipt_telnum').val('');
			$('#receipt_title').val('');
			$('#amount').val('');
			$('#receipt_date').val('');
		}

		params.ocrReceiptIssuer = $('#receipt_issuer').val();
		params.ocrReceiptTelNum = $('#receipt_telnum').val();
		params.ocrReceiptTitle = $('#receipt_title').val();
		params.ocrAmount = $('#amount').val();
		params.ocrReceiptDate = $('#receipt_date').val();

		updateStyleOnInput($('#receipt_issuer'));
		updateStyleOnInput($('#receipt_telnum'));
		updateStyleOnInput($('#receipt_title'));
		updateStyleOnInput($('#amount'));

		$('#receipt_issuer').prop('disabled', false);
		$('input#receipt_issuer').removeClass('red_ph');
		$('input#receipt_issuer').attr('placeholder','（発行者(店名)）');
		$('#receipt_telnum').prop('disabled', false);
		$('input#receipt_telnum').removeClass('red_ph');
		$('input#receipt_telnum').attr('placeholder','（電話番号）');
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

		$('#ocr_error_text').html('');
		if (params.ocrErrorCode!=0) {
			var noteMsg = "";
			switch (params.ocrErrorCode) {
			case -2:
				noteMsg = noteMsg + "OCR処理に失敗しました。<br/>";
				break;
			case -10:
				noteMsg = noteMsg + "メモリの取得に失敗しました。<br/>";
				break;
			case -11:
				noteMsg = noteMsg + "ライブラリの読込に失敗しました。<br/>";
				break;
			case -12:
				noteMsg = noteMsg + "予期せぬエラーが発生しました。<br/>";
				break;
			case -30:
				noteMsg = noteMsg + "画像ピクセルサイズが大きすぎます。<br/>";
				break;
			case -101:
				noteMsg = noteMsg + "画像フォーマットが認識できません。<br/>";
				break;
			default:
				noteMsg = noteMsg + "その他のエラーが発生しました。<br/>";
			}
			$('#ocr_error_text').html(noteMsg);
			$('#ocr_note_card').show();
		}
		else if (isInFuture(params.ocrReceiptDate)) {
			var noteMsg = "日付が未来の日になっています。<br/>";
			$('#ocr_error_text').html(noteMsg);
			$('#ocr_note_card').show();
		}
		else if (isTooOld(params.ocrReceiptDate)) {
			var noteMsg = "日付が2ヶ月よりも前の日になっています。<br/>";
			$('#ocr_error_text').html(noteMsg);
			$('#ocr_note_card').show();
		}
		else {
			$('#ocr_note_card').hide();
		}
	}
	else {

		if (result.result == 'OK') {
			try {
					var attachment = new sforce.SObject("Attachment");
					var imageElm = $("#original_image_src");
					attachment.Name = imageElm.data('filename');
					attachment.ContentType = imageElm.data('filetype');
					attachment.ParentId = result.cardStatementLineId;
					attachment.body = imageElm.attr('src').split(',')[1];
					
					var attachCreateResult = sforce.connection.create([attachment]);
					
					if (!attachCreateResult[0].getBoolean("success")) {
						throw "登録に失敗しました。<br/>" + attachCreateResult[0].errors.toString();
					}
					switch_screen();
				
			} catch(error) {
				try {
					// 添付ファイル登録失敗時にカード明細を削除する
					sforce.connection.deleteIds([result.cardStatementLineId]);
					console.log("カード明細が削除されました。");
					showHtmlErrorMessage(error)
				} catch (apiError) {
					console.log("カード明細が削除されませんでした。");
					showHtmlErrorMessage(apiError.faultstring)
				}
			}

   		}
   		else {
			console.log("result=" + result.result + " " + result.msg);
			showHtmlErrorMessage("登録に失敗しました。<br/>"+result.msg, null);
		}
	}

	return false;
}

function search_for_issuer() {
	console.log("search for issuer...");

	var receiptTelNum = $('#receipt_telnum').val();

	loadingView(true);

	searchForIssuer(receiptTelNum);
}

function resultHandlerIssuerSearch(result) {

	if (result && result.result == 'OK') {
		if (result.issuer) {
			params.ocrReceiptIssuer = result.issuer; // ocrReceiptIssuerとして保存
			$('#receipt_issuer').val(result.issuer);
		}
		else {
			showHtmlInfoMessage("見つかりませんでした。", null);
		}
	}
	else {
		if (result) console.log("result=" + result.result + " " + result.statusCode);
		if (result.msg && result.msg!="") {
			showHtmlErrorMessage(result.msg, null);
		}
		else {
			showHtmlErrorMessage("検索に失敗しました。", null);
		}
	}

	return false;
}