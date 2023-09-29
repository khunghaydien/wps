function sendFormStep1(ocrFlag, reregFlag, toComplete) {
  console.log("sending form for step 1...");

  //var dependantName = $('#dependant_name').val();
  var outsiderFirstName = $("#outsider_first_name").val();
  var outsiderLastName = $("#outsider_last_name").val();
  var outsiderEmail = $("#outsider_email").val();
  var myNumber = $("#mynumber").val();
  var zipCode = $("#zipcode").val();
  var pref = $("#pref").val();
  var addr1 = $("#addr1").val();
  var addr2 = $("#addr2").val();
  var comments = $("#comments").val();
  var targetId = null;
  //var regId = attributes.regId;

  var nameUnmatched = false;

  if (params.regType == 1) {
    targetId = attributes.accountId;
  } else if (params.regType == 2) {
    targetId = attributes.dependants[attributes.dependantIndex].accountId;
  } else if (params.regType == 3 || params.regType == 4) {
    targetId = attributes.paymentRecipientId;
  }
  /* 画像取得 */
  var imageFile = null;
  var imageFileName = "";
  var imageFile2 = null;
  var imageFileName2 = "";

  //imageFile = $('#image_file1')[0].files[0];
  if (ocrFlag) {
    //imageFile = $("#image_src_on_modal1").attr('src'); // resizeCanvasで生成されたもの（たぶんbase64になってる）
    //imageFileName = $('#image_file1')[0].files[0].name;
    imageFile = $("#image_src1").attr("src"); // resizeCanvasで生成されたもの（たぶんbase64になってる）
    imageFileName = $("#image_src1").data("filename");
  } else {
    if (params.isOcrAvailable) {
      if (!isOcredNameCorrect(params.ocredLastName, params.ocredFirstName))
        nameUnmatched = true;
    }

    imageFile = $("#image_src1").attr("src"); // resizeCanvasで生成されたもの（たぶんbase64になってる）
    imageFileName = $("#image_src1").data("filename");
    imageFile2 = $("#image_src5").attr("src") || null; // resizeCanvasで生成されたもの（たぶんbase64になってる）
    imageFileName2 = $("#image_src5").data("filename") || "";
    //imageFIleName = params.myNumPhotoFileName;
  }
  //imageFileName = $('#image_file1')[0].files[0].name;

  var req = {
    ocrFlag: ocrFlag,
    reregFlag: reregFlag,
    stepNum: "1",
    regType: params.regType,
    regId: attributes.regId,
    isChangeMyNumber: params.initMyNumber != myNumber,
    myNumberId: attributes.myNumberId,
    targetId: targetId,
    regFirstName: outsiderFirstName,
    regLastName: outsiderLastName,
    email: outsiderEmail,
    myNumber: myNumber,
    zipCode: zipCode,
    pref: pref,
    addr1: addr1,
    addr2: addr2,
    comments: comments,
    imageFileName: imageFileName,
    imageFile: imageFile,
    imageFileName2: imageFileName2,
    imageFile2: imageFile2,
    nameUnmatched: nameUnmatched,
    toComplete: toComplete
  };

  loadingView(true);

  sendFormData1(
    req.ocrFlag,
    req.reregFlag,
    req.stepNum,
    req.regType,
    req.regId,
    req.isChangeMyNumber,
    req.myNumberId,
    req.targetId,
    req.regFirstName,
    req.regLastName,
    req.email,
    req.myNumber,
    req.zipCode,
    req.pref,
    req.addr1,
    req.addr2,
    req.comments,
    req.imageFileName,
    req.imageFile,
    req.imageFileName2,
    req.imageFile2,
    req.nameUnmatched,
    req.toComplete
  );
}

function resultHandlerStep1(result) {
  //loadingView(false);

  //alert(result.result);
  //return false;

  if (result.ocrFlag) {
    params.ocrErrorCode = result.statusCode;
    if (result.result == "OK") {
      // 0, -301:デジットチェックエラー
      //params.ocrErrorCode = -301;
      var ocrName = result.ocrName;
      var ss = ocrName.split("/");
      if (ss.length == 2) {
        params.ocredLastName = ss[0];
        params.ocredFirstName = ss[1];
      } else {
        params.ocredLastName = ss[0];
        params.ocredFirstName = "";
      }
      /*
			if (params.regType==1 || params.regType==2) { // 本人 or 扶養家族
				if (!isOcredNameCorrect(params.ocredLastName, params.ocredFirstName)) {
					params.ocredNameUnmatched = true;
					alert("名前が一致しません。"); // デバッグ
				}
				else {
					params.ocredNameUnmatched = false;
				}
			}
*/
      if (params.regType == 2) {
        // 扶養家族の場合、名前が一致する家族を選択した状態にする
        var dependantName = params.ocredLastName + " " + params.ocredFirstName;
        for (var i = 0; i < attributes.dependants.length; i++) {
          if (attributes.dependants[i].name === dependantName) {
            $("#dependant_name")
              .val(dependantName)
              .change();
            break;
          }
        }
      }

      $("#mynumber").val(result.ocrMyNumber);
    } else {
      // -2:OCR処理に失敗、-30:入力ピクセルサイズオーバー、-201:仕様どおりのフォーマットでない、それ以外（1またはHTTP ステータスコード）
      console.log("result=" + result.result + " " + result.msg);
      showHtmlErrorMessage(result.msg, null);

      params.ocredLastName = "";
      params.ocredFirstName = "";
      $("#mynumber").val("");
    }

    if (params.regType == 3 || params.regType == 4) {
      $("#outsider_last_name").val(params.ocredLastName);
      $("#outsider_first_name").val(params.ocredFirstName);
    }

    $(".outsider_name").prop("disabled", false);
    $(".outsider_name").removeClass("red_ph");
    $("input#outsider_last_name").attr(
      "placeholder",
      teasp.message.getLabel("em10002180")
    ); // 氏名（姓）
    $("input#outsider_first_name").attr(
      "placeholder",
      teasp.message.getLabel("em10002190")
    ); // 氏名（名）
    $("#mynumber").prop("disabled", false);
    $("input#mynumber").removeClass("red_ph");
    $("input#mynumber").attr(
      "placeholder",
      teasp.message.getLabel("em10002410")
    ); // 12桁のマイナンバー

    $("#ocr_error_text").html("");
    if (params.ocrErrorCode != 0) {
      var noteMsg = "";
      switch (params.ocrErrorCode) {
        case -2:
          noteMsg = noteMsg + teasp.message.getLabel("em10002470") + "<br/>"; // OCR処理に失敗しました。
          break;
        case -30:
          noteMsg = noteMsg + teasp.message.getLabel("em10002480") + "<br/>"; // 画像ピクセルサイズが大きすぎます。
          break;
        case -101:
          noteMsg = noteMsg + teasp.message.getLabel("em10002490") + "<br/>"; // 画像フォーマットが認識できません。
          break;
        case -201:
          noteMsg = noteMsg + teasp.message.getLabel("em10002500") + "<br/>"; // 書式が認識できません。
          break;
        case -301:
          noteMsg = noteMsg + teasp.message.getLabel("em10002510") + "<br/>"; // 検査用数値と一致していません。
          break;
        default:
          noteMsg = noteMsg + teasp.message.getLabel("em10002520") + "<br/>"; // その他のエラーが発生しました。
      }
      $("#ocr_error_text").html(noteMsg);
      $("#ocr_note_card").show();
    } else {
      $("#ocr_note_card").hide();
    }

    // 画像設定、個人番号が空でない時に「送信」ボタンを有効にする。
    //handleButtonValidity(1);
    //alert(params.ocrErrorCode); // デバッグ
  } else {
    if (result.result == "OK") {
      attributes.regId = result.regId;
      attributes.myNumberId = result.myNumberId;
      attributes.paymentRecipientId = result.targetId;
      // 外部者の場合
      if (
        (params.regType == 3 || params.regType == 4) &&
        result.isAlreadyRegistered
      ) {
        // 再登録確認ダイアログ表示
        $("#confirmed_but").on("click.rereg touchleave.rereg", function(e) {
          sendFormStep1(false, true, result.toComplete);
          $(this).off(".rereg");
          $("#confirm_modal").modal("hide");
          return false;
        });
        $("#confirm_cancel_but").on("click.rereg touchleave.rereg", function(
          e
        ) {
          $(this).off(".rereg");
          $("#confirmed_but").off(".rereg");
          return true; // trueを返してデフォルトの処理へ
        });
        $("#confirm_modal").modal({ backdrop: "static", keyboard: false });
      } else {
        //showInfoMessage("登録しました。", function () {switch_screen(false);});
        switch_screen(false);
      }

      //switch_screen(false);
    } else {
      console.log("result=" + result.result + " " + result.msg);
      showHtmlErrorMessage(result.msg, null);
    }
  }

  return false;
}

function sendFormStep2(isEmptyData, toComplete) {
  console.log("sending form for step 2...");

  var req = {
    stepNum: "2",
    regType: params.regType,
    regId: attributes.regId,
    myNumberId: attributes.myNumberId,
    imageFileName: null,
    imageFile: null,
    imageFileName2: null,
    imageFile2: null,
    toComplete: toComplete
  };

  if (!isEmptyData) {
    /* 画像取得 */
    var imageFile = $("#image_src2").attr("src"); // resizeCanvasで生成されたもの（たぶんbase64になってる）
    var imageFileName = $("#image_src2").data("filename");
    var imageFile2 = $("#image_src6").attr("src") || null; // resizeCanvasで生成されたもの（たぶんbase64になってる）
    var imageFileName2 = $("#image_src6").data("filename") || "";
    //var imageFileName = $('#image_file2')[0].files[0].name;

    req.imageFileName = imageFileName;
    req.imageFile = imageFile;
    req.imageFileName2 = imageFileName2;
    req.imageFile2 = imageFile2;
  }

  loadingView(true);

  sendFormData2(
    req.stepNum,
    req.regType,
    req.regId,
    req.myNumberId,
    req.imageFileName,
    req.imageFile,
    req.imageFileName2,
    req.imageFile2,
    req.toComplete
  );
}
function resultHandlerStep2(result) {
  //loadingView(false);

  //alert("2: "+result.result);

  if (result.result == "OK") {
    //showInfoMessage("登録しました。", function () {switch_screen(false);});
    switch_screen(false);
  } else {
    console.log("result=" + result.result + " " + result.msg);
    showHtmlErrorMessage(result.msg, null);
  }

  return false;
}

function sendFormStep3(isEmptyData, toComplete) {
  console.log("sending form for step 3...");

  var req = {
    stepNum: "3",
    regType: params.regType,
    regId: attributes.regId,
    myNumberId: attributes.myNumberId,
    imageFileName: null,
    imageFile: null,
    toComplete: toComplete
  };

  if (!isEmptyData) {
    /* 画像取得 */
    var imageFile = $("#image_src3").attr("src"); // resizeCanvasで生成されたもの（たぶんbase64になってる）
    var imageFileName = $("#image_src3").data("filename");
    //var imageFileName = $('#image_file3')[0].files[0].name;

    req.imageFileName = imageFileName;
    req.imageFile = imageFile;
  }

  loadingView(true);

  sendFormData2(
    req.stepNum,
    req.regType,
    req.regId,
    req.myNumberId,
    req.imageFileName,
    req.imageFile,
    null,
    null,
    req.toComplete
  );
}
function resultHandlerStep3(result) {
  //loadingView(false);

  //alert("3: "+result.result);

  if (result.result == "OK") {
    //showInfoMessage("登録しました。", function () {switch_screen(false);});
    switch_screen(false);
  } else {
    console.log("result=" + result.result + " " + result.msg);
    showHtmlErrorMessage(result.msg, null);
  }

  return false;
}

function sendFormStep4(isEmptyData, toComplete) {
  console.log("sending form for step 4...");

  var req = {
    stepNum: "4",
    regType: params.regType,
    regId: attributes.regId,
    myNumberId: attributes.myNumberId,
    imageFileName: null,
    imageFile: null,
    toComplete: toComplete
  };

  if (!isEmptyData) {
    /* 画像取得 */
    var imageFile = $("#image_src4").attr("src"); // resizeCanvasで生成されたもの（たぶんbase64になってる）
    var imageFileName = $("#image_src4").data("filename");
    //var imageFileName = $('#image_file4')[0].files[0].name;

    req.imageFileName = imageFileName;
    req.imageFile = imageFile;
  }

  loadingView(true);
  sendFormData2(
    req.stepNum,
    req.regType,
    req.regId,
    req.myNumberId,
    req.imageFileName,
    req.imageFile,
    null,
    null,
    req.toComplete
  );
}
function resultHandlerStep4(result) {
  //loadingView(false);

  //alert("4: "+result.result);

  if (result.result == "OK") {
    //showInfoMessage("登録しました。", function () {switch_screen(false);});
    switch_screen(false);
  } else {
    console.log("result=" + result.result + " " + result.msg);
    showHtmlErrorMessage(result.msg, null);
  }

  return false;
}
