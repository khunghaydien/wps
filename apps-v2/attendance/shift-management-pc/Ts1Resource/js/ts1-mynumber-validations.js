function validateStep() {
  switch (parseInt(params.currentStep)) {
    case 1:
      return validateStep1();
      break;
    default:
      return validateOtherStep();
      break;
  }
}

function validateStep1() {
  var ret = true;
  var validParams = {
    fileIsSet: true,
    fileIsJpeg: true,
    myNumIsNotEmpty: true,
    myNumIsNumeric: true,
    myNumIsHealthy: true,
    myNumIs12Digits: true,

    // 外部者のみ
    firstNameIsNotEmpty: true,
    lastNameIsNotEmpty: true,
    emailIsHealthy: true,

    zipcodeIsNotEmpty: true,
    prefIsNotEmpty: true,
    addr1IsNotEmpty: true,
    addr2IsNotEmpty: true
  };

  // 画像
  if (!$("#image_src1").length) {
    validParams.fileIsSet = false;
    ret = false;
  } else if (!isJpeg($("#image_src1").data("filename"))) {
    validParams.fileIsJpeg = false;
    ret = false;
  }

  // 個人番号
  var myNumber = $("#mynumber").val();
  if (myNumber == "" || myNumber == null) {
    validParams.myNumIsNotEmpty = false;
    ret = false;
  } else if (isNaN(myNumber)) {
    validParams.myNumIsNumeric = false;
    ret = false;
  } else if (!is12Digits(myNumber)) {
    validParams.myNumIs12Digits = false;
    ret = false;
  } else if (!isMyNumberHealthy(myNumber)) {
    validParams.myNumIsHealthy = false;
    ret = false;
  }

  // 外部者のみ
  if (params.regType == 3 || params.regType == 4) {
    // 名前（姓）
    if (
      $("#outsider_last_name").val() == "" ||
      $("#outsider_last_name").val() == null
    ) {
      validParams.lastNameIsNotEmpty = false;
      ret = false;
    }

    // 名前（名）
    if (
      $("#outsider_first_name").val() == "" ||
      $("#outsider_first_name").val() == null
    ) {
      validParams.firstNameIsNotEmpty = false;
      ret = false;
    }

    // メールアドレス
    if (
      $("#outsider_email").val() != "" &&
      $("#outsider_email").val() != null &&
      !validateEmail($("#outsider_email").val())
    ) {
      validParams.emailIsHealthy = false;
      ret = false;
    }

    // 郵便番号
    if ($("#zipcode").val() == "" || $("#zipcode").val() == null) {
      validParams.zipcodeIsNotEmpty = false;
      ret = false;
    }

    // 都道府県
    if ($("#pref").val() == "" || $("#pref").val() == null) {
      validParams.prefIsNotEmpty = false;
      ret = false;
    }

    // 市区郡
    if ($("#addr1").val() == "" || $("#addr1").val() == null) {
      validParams.addr1IsNotEmpty = false;
      ret = false;
    }

    // 町名・番地
    if ($("#addr2").val() == "" || $("#addr2").val() == null) {
      validParams.addr2IsNotEmpty = false;
      ret = false;
    }
  }

  if (!ret) {
    var errorMsg = teasp.message.getLabel("em10002530") + "<br/>"; // 以下、ご確認ください。
    if (!validParams.fileIsSet) {
      errorMsg += teasp.message.getLabel("em10004690") + "<br/>"; // マイナンバー記載画像(番号記載面)が設定されていません。
    }
    if (!validParams.fileIsJpeg) {
      errorMsg += teasp.message.getLabel("em10002460") + "<br/>"; // 画像フォーマットをJPEGにしてください。
    }

    if (!validParams.myNumIsNotEmpty) {
      errorMsg += teasp.message.getLabel("em10002550") + "<br/>"; // マイナンバーが入力されていません。
    }
    if (!validParams.myNumIsNumeric) {
      errorMsg += teasp.message.getLabel("em10002560") + "<br/>"; // 半角数字以外の入力はできません。
    }
    if (!validParams.myNumIs12Digits) {
      errorMsg += teasp.message.getLabel("em10002570") + "<br/>"; // 12桁以外の入力はできません。
    }
    if (!validParams.myNumIsHealthy) {
      errorMsg += teasp.message.getLabel("em10002580") + "<br/>"; // 検査用数値と一致していません。入力内容を確認してください。
    }

    if (!validParams.lastNameIsNotEmpty) {
      errorMsg += teasp.message.getLabel("em10002590") + "<br/>"; // 姓が入力されていません。
    }
    if (!validParams.firstNameIsNotEmpty) {
      errorMsg += teasp.message.getLabel("em10002600") + "<br/>"; // 名が入力されていません。
    }
    if (!validParams.emailIsHealthy) {
      errorMsg += teasp.message.getLabel("em10002620") + "<br/>"; // メールアドレスの書式が正しくありません。入力内容を確認してください。
    }
    if (!validParams.zipcodeIsNotEmpty) {
      errorMsg += teasp.message.getLabel("em10002630") + "<br/>"; // 郵便番号が入力されていません。
    }
    if (!validParams.prefIsNotEmpty) {
      errorMsg += teasp.message.getLabel("em10002640") + "<br/>"; // 都道府県が入力されていません。
    }
    if (!validParams.addr1IsNotEmpty) {
      errorMsg += teasp.message.getLabel("em10002650") + "<br/>"; // 市区郡が入力されていません。
    }
    if (!validParams.addr2IsNotEmpty) {
      errorMsg += teasp.message.getLabel("em10002660") + "<br/>"; // 町名・番地が入力されていません。
    }
    showHtmlErrorMessage(errorMsg, null);
  }

  return ret;
}

function validateOtherStep() {
  var ret = true;
  var validParams = {
    fileIsSet: true,
    fileIsJpeg: true
  };

  if (!$("#image_src" + params.currentStep).length) {
    validParams.fileIsSet = false;
    ret = false;
  }
  /*
	else if (!isJpeg($('#image_src'+params.currentStep).data('filename'))) {
		validParams.fileIsJpeg = false;
		ret = false;
	}
*/

  if (!ret) {
    var errorMsg = teasp.message.getLabel("em10002530") + "<br/>"; // 以下、ご確認ください。
    if (!validParams.fileIsSet) {
      var label;
      switch (params.currentStep) {
        case 2:
          label = teasp.message.getLabel("em10004700") + "<br/>"; // 本人確認画像(表面)が設定されていません。
          break;
        default:
          label = teasp.message.getLabel("em10002540") + "<br/>"; // 画像が設定されていません。
          break;
      }
      errorMsg += label;
    }
    if (!validParams.fileIsJpeg) {
      errorMsg += teasp.message.getLabel("em10002460") + "<br/>"; // 画像フォーマットをJPEGにしてください。
    }
    showHtmlErrorMessage(errorMsg, null);
  }

  return ret;
}

function isMyNumberHealthy(myNumber) {
  var totalDigit = 0;
  for (var i = 0; i < myNumber.length - 1; i++) {
    var val = parseInt(myNumber.substr(i, 1));
    var digit = 12 - (i + 1);
    if (11 >= digit && 7 <= digit) {
      totalDigit += val * (digit - 5);
    } else {
      totalDigit += val * (digit + 1);
    }
  }
  var digitMod = totalDigit % 11;
  var checkDigit = 0;
  if (digitMod > 1) {
    checkDigit = 11 - digitMod;
  }

  if (checkDigit != parseInt(myNumber.substr(myNumber.length - 1, 1))) {
    return false;
  }
  return true;
}

function is12Digits(myNumber) {
  if (myNumber.length == 12) return true;
  return false;
}

function isJpeg(fileName) {
  if (!fileName) return false;

  var fileTypes = fileName.split(".");
  var len = fileTypes.length;
  if (len === 0) return false;

  var ext = fileTypes[len - 1].toLowerCase();
  if (ext === "jpg" || ext === "jpeg") {
    return true;
  } else {
    return false;
  }
}

function validateEmail(email) {
  if (email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    //var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; // support unicode
    return re.test(email);
  } else return false;
}

function handleButtonValidity(stepNum) {
  switch (stepNum) {
    case 1:
      if ($("#mynumber").val().length && $("#image_src1").length) {
        $("#send_and_finish_but_on_step1").prop("disabled", false);
        $("#send_and_goforward_but_on_step1").prop("disabled", false);
      } else {
        $("#send_and_finish_but_on_step1").prop("disabled", true);
        $("#send_and_goforward_but_on_step1").prop("disabled", true);
      }
      break;
    case 2:
      if ($("#image_src2").length) {
        $("#send_and_finish_but_on_step2").prop("disabled", false);
        $("#send_and_goforward_but_on_step2").prop("disabled", false);
      } else {
        $("#send_and_finish_but_on_step2").prop("disabled", true);
        $("#send_and_goforward_but_on_step2").prop("disabled", true);
      }
      break;
    case 3:
      if ($("#image_src3").length) {
        $("#send_and_goforward_but_on_step3").prop("disabled", false);
      } else {
        $("#send_and_goforward_but_on_step3").prop("disabled", true);
      }
      break;
    case 4:
      if ($("#image_src4").length) {
        $("#send_and_goforward_but_on_step4").prop("disabled", false);
      } else {
        $("#send_and_goforward_but_on_step4").prop("disabled", true);
      }
      break;
  }
}
