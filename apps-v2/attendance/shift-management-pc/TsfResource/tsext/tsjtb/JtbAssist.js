define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"tsext/util/Util"
], function(declare, array, Util) {
	return {
		getFunctionCodeType: function(fc){
			if(['JL','NH','JE', 'SF', 'JN', 'HD', 'JW', 'DA','AA','RA'].indexOf(fc) >= 0){ return 1;
			}else if(['BH','GT','RT','HR','DB','AB','RB'].indexOf(fc) >= 0){ return 2;
			}else if(['DC','AC','RC'].indexOf(fc) >= 0){ return 3;
			}else if(['DD','AD','RD'].indexOf(fc) >= 0){ return 4;
			}
			return 0;
		},
		getServiceName: function(fc){ // 実績データの個別設定1
			if(fc == 'JL'){							return 'JAL ONLINE';
			}else if(fc == 'NH'){					return 'ANA@desk';
			}else if(fc == 'JE'){					return 'JR Express';
			}else if(fc == 'BH'){					return 'るるぶトラベル';
			}else if(['DA', 'DB', 'DC', 'DD'].indexOf(fc) >= 0){	return '代理店発注';
			}else if(['AA', 'AB', 'AC', 'AD'].indexOf(fc) >= 0){	return '海外オンライン';
			}else if(['RA', 'RB', 'RC', 'RD'].indexOf(fc) >= 0){	return 'ダイナミックパッケージ';
			}else if(fc == 'GT'){					return 'GTA';
			}else if(fc == 'SF'){ return 'SF Biz';
			}else if(fc == 'JN'){ return 'JR ビジネスえきねっと';
			}else if(fc == 'HR'){ return 'HRS';
			}else if(fc == 'HD'){ return 'AIRDO';
			}else if(fc == 'JW'){ return 'JR e5489コーポレートサービス';
			}else{
				return '';
			}
		},
		getServiceNameValues: function(){ // 実績データの個別設定1選択候補
			return [
				{ value:'JAL ONLINE'			, name:'JAL ONLINE' },
				{ value:'ANA@desk'				, name:'ANA@desk' },
				{ value:'JR Express'			, name:'JR Express' },
				{ value:'SF Biz', name:'SF Biz' },
				{ value:'JR ビジネスえきねっと', name: 'JR ビジネスえきねっと' },
				{ value:'るるぶトラベル'		, name:'るるぶトラベル' },
				{ value:'HRS'		, name:'HRS' },
				{ value:'AIRDO'		, name:'AIRDO' },
				{ value:'JR e5489コーポレートサービス'		, name:'JR e5489コーポレートサービス' },
				{ value:'代理店発注'			, name:'代理店発注' },
				{ value:'海外オンライン'		, name:'海外オンライン' },
				{ value:'ダイナミックパッケージ', name:'ダイナミックパッケージ' },
				{ value:'GTA'					, name:'GTA' }
			];
		},
		getFunctionCodeValues: function(dataType){
			var base = [
				{ value:'JL', name:'JL: 日本航空(JAL)' },
				{ value:'NH', name:'NH: 全日空(ANA)' },
				{ value:'JE', name:'JE: JR Express' },
				{ value:'SF', name:'SF: スターフライヤー' },
				{ value:'JN', name:'JN: JR ビジネスえきねっと' },
				{ value:'HD', name:'HD: AIRDO' },
				{ value:'JW', name:'JW: JR e5489コーポレートサービス' },
				{ value:'BH', name:'BH: るるぶトラベル' },
				{ value:'HR', name:'HR: HRS' },
				{ value:'GT', name:'GT: GTA' },
				{ value:'RT', name:'RT: 他ホテル予約' }
			];

			if(dataType === 'reserve') {
				return base.concat(
					[
						{ value:'DA', name:'DA: 代理店発注(交通機関)' },
						{ value:'DB', name:'DB: 代理店発注(宿泊)' },
						{ value:'DC', name:'DC: 代理店発注(レンタカー)' },
						{ value:'DD', name:'DD: 代理店発注(その他)' },
						{ value:'AA', name:'AA: 海外オンライン(交通機関)' },
						{ value:'AB', name:'AB: 海外オンライン(宿泊)' },
						{ value:'AC', name:'AC: 海外オンライン(レンタカー)' },
						{ value:'AD', name:'AD: 海外オンライン(その他)' },
						{ value:'RA', name:'RA: ダイナミックパッケージ(交通機関)' },
						{ value:'RB', name:'RB: ダイナミックパッケージ(宿泊)' },
						{ value:'RC', name:'RC: ダイナミックパッケージ(レンタカー)' },
						{ value:'RD', name:'RD: ダイナミックパッケージ(その他)' },
					]
				);
			} else if(dataType === 'actual') {
				return base.concat(
					[
						{ value:'DT', name:'DT: 代理店発注'},
						{ value:'AD', name: 'AD: 海外オンライン'},
						{ value:'DP', name: 'DP: ダイナミックパッケージ'}
					]
				);
			} else {
				return base;
			}
		},
		getTransportNameValues: function(fc){ // 実績データの個別設定2
			var values = [];
			array.forEach([
				{ fc:'JL,DA,AA,RA'      , name: 'JAL' },
				{ fc:'NH,DA,AA,RA'      , name: 'ANA' },
				{ fc:'JE,JN,JW,DA,AA,RA'      , name: 'JR' },
				{ fc:'HD,DA,AA,RA'      , name: 'AIRDO' },
				{ fc:'SF,DA,AA,RA'      , name: 'ｽﾀｰﾌﾗｲﾔｰ' },
				{ fc:'BH,GT,RT,HR,DB,AB,RB', name: '〇〇ホテル' },
				{ fc:'BH,GT,RT,HR,DB,AB,RB', name: '△△ホテル' },
				{ fc:'BH,GT,RT,HR,DB,AB,RB', name: '××ホテル' },
				{ fc:'DC,AC,RC'         , name: 'ニッポンレンタカー' },
				{ fc:'DC,AC,RC'         , name: 'オリックスレンタカー' },
				{ fc:'DC,AC,RC'         , name: '日産レンタカー' },
				{ fc:'DC,AC,RC'         , name: 'トヨタレンタカー' },
				{ fc:'DC,AC,RC'         , name: 'タイムズカーレンタル' },
				{ fc:'DC,AC,RC'         , name: 'バジェットレンタカー' },
				{ fc:'DD,AD,RD'         , name: '空港使用料' }
			], function(o){
				if(o.fc.indexOf(fc) >= 0){
					values.push(o);
				}
			});
			return values;
		},
		getFlightNameValues: function(fc){ // 実績データの個別設定6
			var values = [];
			array.forEach([
				{ fc:'JL,DA,AA,RA', name:'JALXX便' },
				{ fc:'NH,DA,AA,RA', name:'ANAXX便' },
				{ fc:'HD,DA,AA,RA', name:'AIRDOXX便' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'のぞみXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'ひかりXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'こだまXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'みずほXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'さくらXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'つばめXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'はやぶさXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'はやてXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'やまびこXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'なすのXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'こまちXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'つばさXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'ときXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'たにがわXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'かがやきXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'はくたかXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'あさまXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'つるぎXX号' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'片道乗車券' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'往復乗車券' },
				{ fc:'JE,JN,JW,DA,AA,RA', name:'自由席特急券' },
				{ fc:'BH,GT,RT,HR,DB,AB,RB', name: '〇〇ホテル' },
				{ fc:'BH,GT,RT,HR,DB,AB,RB', name: '△△ホテル' },
				{ fc:'BH,GT,RT,HR,DB,AB,RB', name: '××ホテル' }
			], function(o){
				if(o.fc.indexOf(fc) >= 0){
					values.push(o);
				}
			});
			return values;
		},
		getPlaceValues: function(fc){
			var values = [];
			array.forEach([
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'東京羽田' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'東京成田' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'大阪伊丹' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'大阪関西' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'名古屋中部' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'福岡' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'札幌千歳' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'広島' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'仙台' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'旭川' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'函館' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'釧路' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'女満別' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'帯広' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'奥尻' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'丘珠' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'青森' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'秋田' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'福島' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'山形' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'花巻' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'三沢' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'新潟' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'松本' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'小松金沢' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'南紀白浜' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'但馬' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'神戸' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'出雲' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'隠岐' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'岡山' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'山口宇部' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'高知' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'松山' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'高松' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'徳島' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'北九州' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'宮崎' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'熊本' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'長崎' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'大分' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'鹿児島' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'奄美大島' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'喜界島' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'屋久島' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'沖永良部' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'与論' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'徳之島' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'種子島' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'粟国' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'波照間' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'石垣' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'北大東' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'南大東' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'宮古' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'与那国' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'沖縄' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'多良間' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA', name:'久米島' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'東京' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新大阪' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'名古屋' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新横浜' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'京都' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新神戸' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'広島' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'博多' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'品川' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'小田原' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'熱海' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'三島' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新富士' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'静岡' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'掛川' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'浜松' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'豊島' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'三河安城' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'岐阜羽島' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'米原' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'西明石' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'姫路' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'相生' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'岡山' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新倉敷' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'福山' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新尾道' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'三原' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'東広島' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新岩国' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'徳山' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新山口' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'厚狭' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新下関' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'小倉' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'上野' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'大宮' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'小山' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'宇都宮' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'那須塩原' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新白河' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'郡山' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'福島' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'白石蔵王' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'仙台' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'古川' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'くりこま高原' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'一ノ関' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'水沢江刺' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'北上' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新花巻' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'盛岡' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'いわて沼宮内' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'二戸' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'八戸' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'七戸十和田' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新青森' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'奥津軽いまべつ' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'木古内' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新函館北斗' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'雫石' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'田沢湖' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'角館' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'大曲' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'秋田' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'熊谷' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'本庄早稲田' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'高崎' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'上毛高原' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'越後湯沢' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'浦佐' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'長岡' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'燕三条' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新潟' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'米沢' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'高畠' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'赤湯' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'かみのやま温泉' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'山形' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'天童' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'さくらんぼ東根' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'村山' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'大石田' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新庄' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'安中榛名' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'軽井沢' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'佐久平' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'上田' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'長野' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'飯山' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'上越妙高' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'糸魚川' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'黒部宇奈月温泉' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'富山' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新高岡' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'金沢' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'博多南' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新鳥栖' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'筑後船小屋' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新大牟田' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新玉名' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'熊本' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新八代' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'新水俣' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'出水' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'川内' },
				{ fc:'JE,JN,JW,DA,AA,RA'   , name:'鹿児島中央' },
				{ fc:'HR,AB'   , name:'アメリカ' }
			], function(o){
				if(['BH','GT','RT','HR','DB','AB','RB','DC','AC','RC'].indexOf(fc) >= 0
				|| o.fc.indexOf(fc) >= 0){
					values.push(o);
				}
			});
			return values;
		},
		getTimeValues: function(){
			var times = [];
			for(var i = 0 ; i <= (24*60) ; i += 15){
				times.push({ name:Util.formatTime(i) });
			}
			return times;
		},
		getAmountValues: function(){
			var amounts = [];
			for(var i = 1000 ; i <= 50000 ; i += 1000){
				amounts.push({ name:Util.formatMoney(i) });
			}
			return amounts;
		},
		getNumberValues: function(){
			var nums = [];
			for(var i = 1 ; i <= 10 ; i++){
				nums.push({ name:('' + i) });
			}
			return nums;
		},
		getClassNameValues: function(fc){ // 実績データの個別設定7
			var values = [];
			array.forEach([
				{ fc:'JL,SF,NH,HD,DA,AA,RA'    , name:'普通席' },
				{ fc:'NH,DA,AA,RA'       , name:'プレミアムクラス' },
				{ fc:'JL,SF,DA,AA,RA'       , name:'クラスJ' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA'    , name:'エコノミークラス' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA'    , name:'ビジネスクラス' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA'    , name:'ファーストクラス' },
				{ fc:'JE,JN,JW,DA,AA,RA'       , name:'自由席' },
				{ fc:'JE,JN,JW,DA,AA,RA'       , name:'普通指定席' },
				{ fc:'JE,JN,JW,DA,AA,RA'       , name:'グリーン指定席' },
				{ fc:'BH,GT,RT,HR,DB,AB,RB' , name:'1泊朝食' },
				{ fc:'BH,GT,RT,HR,DB,AB,RB' , name:'1泊食事無' },
				{ fc:'DC,AC,RC'          , name:'Aクラス' },
				{ fc:'DC,AC,RC'          , name:'Bクラス' }
			], function(o){
				if(o.fc.indexOf(fc) >= 0){
					values.push(o);
				}
			});
			return values;
		},
		getFareTypeValues: function(fc){ // 実績データの個別設定5
			var values = [];
			array.forEach([
				{ fc:'JE,DA,AA,RA'      , name: 'EX-IC' },
				{ fc:'JE,DA,AA,RA'      , name: 'EX予約' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA'   , name: '往復割引' },
				{ fc:'JL,SF,NH,HD,DA,AA,RA'   , name: '特割' },
				{ fc:'BH,GT,RT,DB,AB,RB', name: '割引' },
				{ fc:'HR', name: 'シングル'}
			], function(o){
				if(o.fc.indexOf(fc) >= 0){
					values.push(o);
				}
			});
			return values;
		},
		getDisplayStatusValues: function(){
			return [
				{ name: 'E発券' },
				{ name: '取消待中' },
				{ name: '取消済' },
				{ name: '予約済' },
				{ name: '空席待' },
				{ name: '実発券済' },
				{ name: '要再発券' },
				{ name: '予約' },
				{ name: '購入' },
				{ name: '取消' },
				{ name: '受取' },
				{ name: '出１' },
				{ name: '出1' },
				{ name: '出２' },
				{ name: '出2' },
				{ name: '出場' },
				{ name: '入場' },
				{ name: '払戻' },
				{ name: 'OK' },
				{ name: 'なし' },
				{ name: 'NEW' },
				{ name: 'REF' },
				{ name: 'CNL' },
				{ name: 'CHG' },
				{ name: 'CXL' },
				{ name: '0' },
				{ name: '1' },
				{ name: '2' },
				{ name: '3' },
				{ name: '4' },
				{ name: '5' },
				{ name: '6' },
				{ name: '7' },
				{ name: '8' },
				{ name: '9' },
				{ name: '40' },
				{ name: '80' },
				{ name: '予約OK'},
				{ name: '最終確認済み'},
				{ name: '取消/払戻手数料'},
				{ name: '回答済み'}
			];
		}
	};
});
