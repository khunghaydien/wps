/***** バインド部分 *****/
$(function(){
	
	$("#import_camera").on("click touchleave", function(e){
		if(!useFlag) return;
		
		$("#image_file").removeAttr("multiple");
		$("#image_file").click();
		return false;
	});
	$("#import_file").on("click touchleave", function(e){
		if(!useFlag) return;
		
		$("#image_file").attr("multiple", "multiple");
		$("#image_file").click();
		return false;
	});
	
	$("#image_file").on("change", function(e){
		loadingView(true);
		
		var files = $(this).prop("files");
		var length = files.length;
		
		// ファイル数制限
		if(length > 10){
			$("#message_area").text("選択できるファイル数は10ファイルまでです。");
			loadingView(false);
			return false;
		}
		
		// 事前チェック
		for(i=0; i < length; i++){
			if(!files[i].type.match("image.*")){
				$("#message_area").text(files[i].name + "は画像ファイルではありません");
				loadingView(false);
				return false;
			}

		}

		clear();
		
		if(window.FileReader){
			// 画像表示
			for(i=0; i < length; i++){
				// ウィンドウ幅に縮小して登録する。
				var file = canvasResize(files[i],
						{
				            width: $(document).width(),
				            height: 0,
				            crop: false,
				            quality: 100,
				            callback: function(data, width, height){
								// リサイズ後のファイルサイズチェック
								console.log("リサイズ後のファイルサイズ：" + data.length);
								if(data.length > 3*1000*1000){
									$("#message_area").text("サイズが3MBを超えているため登録できません。");
									$("#select_menu").toggle();
									loadingView(false);
									buttonEnable(false);
									return false;
								}

								var img_src = $("<img>").attr({"src":data, "name":"image_src"});
								$("#receipt_image_area").append(img_src);
								$("#receipt_image_area").append("<p>");
				            }
						});

				$("#receipt_image_area").append(
					$("<input>").attr(
								{"type":"hidden", "name":"file_name"}
							).val(escape(files[i].name)));
			}
			$("#select_menu").toggle();
			buttonEnable(true);
		} else{
			$("#message_area").text("ファイル読み込み未対応のブラウザです。");
		}
		loadingView(false);
	});

	/* 登録ボタン */
    $(".regist-button").on("click", function(e){
    	
    	console.log("登録します。");
    	
    	e.preventDefault();
    	if(!window.FormData){
    		alert("サポート外のブラウザです。");
    		return;
    	}
    	
    	loadingView(true);
    	
    	buttonEnable(false);
    	
    	// TODO 登録処理
    	/*
    	 * jsファイル内だとVFRemote.jsでエラーが発生するので、
    	 * とりあえずTs1RegistrationView.pageに記述する。
    	 */
    	registReceipt();

    	loadingView(false);
	});
    
    /* クリアボタン */
    $(".clear-button").on("click", function(e){
    	e.preventDefault();
    	clear();
		$("#select_menu").toggle();
		buttonEnable(false);
    });

	$(window).on("resize", function(){
		$("#image_src").attr("width",$(document).width());
	});

});

/**
 * ボタンの有効/無効切替。
 * 画面下部のボタンは表示/非表示を切り替える。
 * @param flag true:有効 false:無効
 */
function buttonEnable(flag){
	if(flag){
		$("#regist_button").removeAttr("disabled");
		$(".clear-button").removeAttr("disabled");
		$("#button_area").css("display", "");
	} else{
		$("#regist_button").attr("disabled", "true");
		$(".clear-button").attr("disabled", "true");
		$("#button_area").css("display", "none");
	}
}

function clear(){
	$("#receipt_image_area").empty();
	$("#message_area").text("");
}

// TODO TS1上だと機能しない
function loadingView(flag) {
/*
	  $('#loading-view').remove();
	  if(!flag) return;
	  $('<div id="loading-view" />').appendTo('#ts1-area');
*/
}
