function validateStep() {
	var isValid = true; // 不正な入力項目がひとつも無いかどうか
	var validParams = {
		fileIsSet: true,
		fileIsJpeg: true,

		amountIsNotEmpty: true,
		amountIsNumeric: true,

		receiptIssuerIsNotEmpty: true,
		receiptTitleIsNotEmpty: true,
		receiptDateIsNotEmpty: true,
		receiptDateIsNotInFuture: true,
	};

	// 画像
	if (!$('#image_src1').length ) {
		validParams.fileIsSet = false;
		isValid = false;
	}
	else if (!isJpeg($('#image_src1').data('filename'))) {
		validParams.fileIsJpeg = false;
		isValid = false;
	}

	if (parseInt(params.regType)==1) {
		// 金額
		var amount = removeComma($('#amount').val());
		if (amount==null || amount.replace(/\s+/g, "")=='' ) {
			validParams.amountIsNotEmpty = false;
			isValid = false;
		}
		else if (isNaN(amount)) {
			validParams.amountIsNumeric = false;
			isValid = false;
		}

		// 発行者（店名）
		const receiptIssuerIsEmpty = $('#receipt_issuer').val()==null || $('#receipt_issuer').val().replace(/\s+/g, "")=='';
		if (settings.useScannerStorage && receiptIssuerIsEmpty) {
			validParams.receiptIssuerIsNotEmpty = false;
			isValid = false;
		}
/*
		// 摘要
		if ($('#receipt_title').val()==null || $('#receipt_title').val().replace(/\s+/g, "")=='') {
			validParams.receiptTitleIsNotEmpty = false;
			ret = false;
		}
*/
		// 利用日
		if ($('#receipt_date').val()==null || $('#receipt_date').val().replace(/\s+/g, "")=='') {
			validParams.receiptDateIsNotEmpty = false;
			isValid = false;
		}
		else if (isInFuture($('#receipt_date').val())) {
			validParams.receiptDateIsNotInFuture = false;
			isValid = false;
		}
	}

	if (!isValid) {
		//var errorMsg = "以下、ご確認ください。<br/>"
		var errorMsg = ""
		if (!validParams.fileIsSet) {
			errorMsg += "画像が設定されていません。<br/>";
		}
		if (!validParams.fileIsJpeg) {
			errorMsg += "画像フォーマットをJPEGにしてください。<br/>";
		}

		if (!validParams.amountIsNotEmpty) {
			errorMsg += "金額が入力されていません。<br/>";
		}
		if (!validParams.amountIsNumeric) {
			errorMsg += "金額には半角数字以外の入力はできません。<br/>";
		}

		if (!validParams.receiptIssuerIsNotEmpty) {
			errorMsg += "発行者（店名）が入力されていません。<br/>";
		}
		if (!validParams.receiptTitleIsNotEmpty) {
			errorMsg += "摘要が入力されていません。<br/>";
		}
		if (!validParams.receiptDateIsNotEmpty) {
			errorMsg += "利用日が入力されていません。<br/>";
		}
		if (!validParams.receiptDateIsNotInFuture) {
			errorMsg += "利用日が未来の日になっています。<br/>";
		}

		showHtmlErrorMessage(errorMsg,null);
	}

	return isValid;
}

function isJpeg(fileName) {
	if (!fileName) return false;

	var fileTypes = fileName.split(".");
	var len = fileTypes.length;
	if (len === 0) return false;

	var ext = fileTypes[len - 1].toLowerCase();
	if (ext === "jpg" || ext === "jpeg") {
		return true;
	}
	else {
		return false;
	}
}

function isInFuture(date) {
	if (date=='' || date==null) return false;

	var aDate   = dateToNum(new Date(date));
	var nowDate = dateToNum(new Date()); // today
	if (aDate > nowDate) return true;
	else return false;
}

function isTooOld(date) {
	if (date=='' || date==null) return false;

	// 2ヶ月以上古いかどうか
	var aDate = new Date(date);
	var nowDate = new Date(); // today
	// getMonth()-2で年をまたいで昨年になったとしても大丈夫。ちゃんとyearが1年下がる。
	var twoMonthsAgo = new Date(nowDate.getFullYear(), nowDate.getMonth()-2, nowDate.getDate());
	if (aDate.getTime()<twoMonthsAgo.getTime()) return true;
	else return false;
}

function removeComma(amount) {
	if (amount=="" || amount==null) return amount;

	var ta = amount.match(/\d/g);
	var ts= ta.join("");
	return ts;
	//return parseInt(ts,10);
}

function dateToNum(date) {
	// 日付を数値にして返す
	return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}
