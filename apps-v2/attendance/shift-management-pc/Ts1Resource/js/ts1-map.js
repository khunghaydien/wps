/**
 * TS1用Map関連
 */

var ts1 = ts1 || {};

/**
 * コンストラクタ
 */
ts1.Map = function(){
	this.param = {};
};

/**
 * パラメータをセットする。
 * @param key
 * @param value
 */
ts1.Map.prototype.addParam = function(key, value){
	this.param[key] = value;
};

ts1.Map.prototype.getParam = function(key){
	return this.param[key];
};

// TODO パラメータ見直し
/**
 * 地図描画用パラメータをセットする。
 * @param mapArea 地図描画領域のID
 * @param lat 緯度
 * @param lng 経度
 * @param address 住所出力先ID
 * @param msgArea メッセージ出力先ID
 * @param formattedAddress URLエンコード済みアドレス出力先ID
 */
ts1.Map.prototype.setMapParam = function(mapArea, lat, lng, address, msgArea, formattedAddress){
	this.param["map_area"] = mapArea;
	this.param["latitude"] = lat;
	this.param["longitude"] = lng;
	this.param["address"] = address;
	this.param["message_area"] = msgArea;
	this.param["formatted_address"] = formattedAddress;
};

/**
 * 地図表示
 */
ts1.Map.prototype.draw = function(){
	var $mapArea = $("#" + this.param["map_area"]);
	var $latitude = $("#" + this.param["latitude"]);
	var $longitude = $("#" + this.param["longitude"]);
	var $address = $("#" + this.param["address"]);
	var $messageArea = $("#" + this.param["message_area"]);
	var $formattedAddress = $("#" + this.param["formatted_address"]);
	
    // GPS に対応しているかチェック
    if (!navigator.geolocation) {
        $messageArea.text("GPSに対応したブラウザでお試しください");
        return false;
    }
    $messageArea.text("GPSデータを取得します...");
    
    // GPS取得開始
    navigator.geolocation.getCurrentPosition(function(pos) {
    	$latitude.text(pos.coords.latitude);
    	$longitude.text(pos.coords.longitude);

        // GPS 取得成功
        // google map 初期化
        var gmap = new google.maps.Map($mapArea.get(0), {
            center: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 16,
            streetViewControl: false,
            scrollwheel: false,
            mapTypeControl:false
        });

        // 現在位置にピンをたてる
        var currentPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
//        var currentMarker = new google.maps.Marker({
//            position: currentPos
//        });
//        currentMarker.setMap(gmap);

        var marker = new google.maps.Marker({
            position: currentPos
        });
		$latitude.val(marker.getPosition().lat());
		$longitude.val(marker.getPosition().lng());
        marker.setMap(gmap);
		geocode();

        // 誤差を円で描く
/*
        new google.maps.Circle({
            map: gmap,
            center: currentPos,
            radius: pos.coords.accuracy, // 単位はメートル
            strokeColor: '#0088ff',
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: '#0088ff',
            fillOpacity: 0.2
        });
*/
        // 現在地にスクロールさせる
        gmap.panTo(currentPos);
        
        // ドラッグイベント取得
        google.maps.event.addListener(gmap, "drag", function(event){
        	// マーカーを中心に表示する。
        	var newPos = gmap.getCenter();
			if (marker){marker.setMap(null)};
			marker = new google.maps.Marker({
				position: newPos,
				draggable: false,
				map: gmap
			});
			marker.setMap(gmap);
			$latitude.val(marker.getPosition().lat());
			$longitude.val(marker.getPosition().lng());
			
//			geocode();
        });

        // ドラッグ終了
        google.maps.event.addListener(gmap, "dragend", function(event){
        	// マーカーを中心に表示する。
        	var newPos = gmap.getCenter();
			if (marker){marker.setMap(null)};
			marker = new google.maps.Marker({
				position: newPos,
				draggable: false,
				map: gmap
			});
			marker.setMap(gmap);
			$latitude.val(marker.getPosition().lat());
			$longitude.val(marker.getPosition().lng());
			
			geocode();
        });

			//マーカードラッグイベントの登録 → 使われてない？
			google.maps.event.addListener(marker,'dragend', function(event) {
				console.log("marker drag event");
				$latitude.val(marker.getPosition().lat());
				$longitude.val(marker.getPosition().lng());
				geocode();
			});

		// クリックした箇所の地名表示
		function geocode(){
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'location': marker.getPosition()}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK && results[0]){
						var formattedAddress = results[0].formatted_address;
						$formattedAddress.val(formattedAddress);
						$address.text(formattedAddress.replace(/^日本, /, '')
								.replace(/^〒[\d]{3}-[\d]{4} /, ''));
					}else{
						$address.text("Geocode 取得に失敗しました");
						console.log("Geocode 取得に失敗しました reason: " + status);
						return false;
					}
			});
		}
		
	}, function() {
		// GPS 取得失敗
		console.log("現在値取得失敗");
		$messageArea.text('GPSデータを取得できませんでした');
		return false;
	});
    
    return true;
};

/**
 * 指定したポイントにマーカーを立てて表示する。
 * @param mapAreaId 描画領域ID
 * @param lat 緯度
 * @param lng 経度
 */
ts1.Map.prototype.setPoint = function(mapAreaId, lat, lng){
	var $mapArea = $(getId(mapAreaId));
	
	var pos = new google.maps.LatLng(lat, lng);
	var map = new google.maps.Map($mapArea.get(0), {
		center: pos,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 16,
        streetViewControl: false,
        scrollwheel: false,
        mapTypeControl:false
	});
	
	var marker = new google.maps.Marker({position:pos});
	marker.setMap(map);
	map.panTo(pos);
};

/**
 * 目的地選択ダイアログでの検索
 * @param address 入力したキーワード
 * @returns {Boolean}
 */
ts1.Map.prototype.searchAddress = function(address){
	if(!address || address.length == 0 || $.trim(address) == 0){
		return false;
	}

	var $mapArea = $("#" + this.param["map_area"]);
	var $lat = $("#" + this.param["latitude"]);
	var $lng = $("#" + this.param["longitude"]);
	var $address = $("#" + this.param["address"]);
	var $formattedAddress = $("#" + this.param["formatted_address"]);

	var geocoder = new google.maps.Geocoder();

	var mapOptions = {
		zoom : 16,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		// マウスホイールによるズーム操作を無効
		scrollwheel : false
	};

	var map = new google.maps.Map($mapArea.get(0), mapOptions);

	geocoder.geocode({
		'address' : address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			// 変換した緯度・経度情報を地図の中心に表示
			var pos = results[0].geometry.location;
			map.setCenter(pos);

			var marker = new google.maps.Marker({
				map : map,
				position : pos
			});
			
			$lat.val(pos.lat());
			$lng.val(pos.lng());
			// 画面表示用
			var formattedAddress = results[0].formatted_address;
			$formattedAddress.val(formattedAddress);
			// 郵便番号が出る場合もあるので削除
			$address.text(formattedAddress.replace(/^日本, /, '')
					.replace(/^〒[\d]{3}-[\d]{4} /, ''));

		} else {
			console.log('Geocode was not successful for the following reason:'+ status);
			return false;
		}

	});
	
	return true;
};

