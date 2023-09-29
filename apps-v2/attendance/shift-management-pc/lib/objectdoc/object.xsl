<?xml version="1.0" encoding="UTF-8"?>
<!--
 Salesforce カスタムオブジェクト定義XMLを表示用のXHTMLに変換するXSLT
 xmlns:sf の定義を忘れると動作しないので注意

 パラメタ
    filename    カスタムオブジェクト定義のファイル名 (ex. ComEmp___c.object)
 -->
<xsl:stylesheet version="1.0"
       xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
       xmlns:sf="http://soap.sforce.com/2006/04/metadata">
	<xsl:param name="filename" />
	<xsl:output method="html"/>
	<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
	<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
	<xsl:variable name="objectname" select="substring-before($filename, '.object')" />
	<!--
	 カスタムオブジェクト定義にマッチするテンプレート
	 <CustomObject>〜</CustomObject>をテンプレートの中身で置換えます。
	 -->
	<xsl:template match="/sf:CustomObject">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
			<head>
				<title>カスタムオブジェクト定義 -- <xsl:value-of select="$objectname" /></title>
				<meta charset="UFT-8" />
				<link rel="stylesheet" type="text/css" href="objectdoc.css"/>
			</head>
			<body>
				<!-- カスタムオブジェクト名 -->
				<h1><span class="objectname"><xsl:value-of select="$objectname" /></span> -- <span class="objectlabel"><xsl:value-of select="sf:label" /></span></h1>
				<div class="description"><xsl:value-of select="sf:description" /></div>
 				<table class="customObject">
					<!-- テーブルヘッダ -->
					<tr class="header">
						<th class="formula">API名</th>
						<th class="label">表示名</th>
						<th class="type">型</th>
						<th class="formula">数式/選択肢/初期値</th>
						<th class="description">説明</th>
						<th class="inlineHelpText">ヘルプ</th>
						<th class="required">必須</th>
						<th class="externalId">外部</th>
						<th class="unique">一意</th>
					</tr>
					<!--
					 name項目
			     <sf:nameField>〜</sf:nameField>について以下のテンプレートの中身を出力します。
					-->
					<tr class="nameField" id="name">
						<td class="fullName">name</td>
						<td><xsl:value-of select="sf:nameField/sf:label" /></td>
						<td class="type">
							<xsl:choose>
								<xsl:when test="sf:nameField/sf:type='Text'">
									テキスト
								</xsl:when>
								<xsl:when test="sf:nameField/sf:type='AutoNumber'">
									一連番号
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="sf:nameField/sf:type" />
								</xsl:otherwise>
							</xsl:choose>
						</td>
						<td></td>
						<td class="description"><xsl:value-of select="sf:nameField/sf:description" /></td>
						<td class="inlineHelpText"><xsl:value-of select="sf:nameField/sf:inlineHelpText" /></td>
						<td class="required"><xsl:if test="sf:nameField/sf:required='true'">◯</xsl:if></td>
						<td class="externalId"><xsl:if test="sf:nameField/sf:externalId='true'">◯</xsl:if></td>
						<td class="unique"><xsl:if test="sf:nameField/sf:unique='true'">◯</xsl:if></td>
					</tr>
					<!--
					   ユーザー定義項目
					   <fields>〜</fields>の要素毎に以下のテンプレートの中身を出力します。
					  -->
					<xsl:for-each select="sf:fields">
						<xsl:sort select="sf:fullName" data-type="text" order="ascending"/>
						<tr>
							<xsl:attribute name="id"><xsl:value-of select="sf:fullName" /></xsl:attribute>
							<xsl:attribute name="class"><xsl:if test="starts-with(sf:label, '(Deprecated)') or starts-with(sf:label, '(削除予定)')">deprecated </xsl:if><xsl:value-of select="sf:type" /> fields</xsl:attribute>
							<!-- API名 -->
							<td class="fullName"><xsl:value-of select="sf:fullName" /></td>
							<!-- 表示名 -->
							<td class="label"><xsl:value-of select="sf:label" /></td>
							<!-- タイプ 毎の分岐-->
							<td class="type">
								<xsl:choose>
									<!-- タイプ.連番 -->
									<xsl:when test="sf:type='AutoNumber'">
										<span class="type" colspan="2">一連番号</span>
									</xsl:when>
									<!-- タイプ.テキスト -->
									<xsl:when test="sf:type='Text'">
										<span class="type">テキスト</span>
										<xsl:call-template name="textOption" />
									</xsl:when>
									<!-- タイプ.テキスト領域 -->
									<xsl:when test="sf:type='TextArea'">
										<span class="type" colspan="2">ロングテキスト</span>
										<xsl:call-template name="textOption" />
									</xsl:when>
									<!-- タイプ.ロングテキスト領域 -->
									<xsl:when test="sf:type='LongTextArea'">
										<span class="type">ロングテキスト</span>
										<xsl:call-template name="textOption" />
									</xsl:when>
									<!-- タイプ.暗号化テキスト -->
									<xsl:when test="sf:type='EncryptedText'">
										<span class="type">暗号化テキスト</span>
										<xsl:call-template name="textOption" />
									</xsl:when>
									<!-- タイプ.Email -->
									<xsl:when test="sf:type='Email'">
										<span class="type">Email</span>
										<xsl:call-template name="textOption" />
									</xsl:when>
									<!-- タイプ.電話番号 -->
									<xsl:when test="sf:type='Phone'">
										<span class="type">電話番号</span>
										<xsl:call-template name="textOption" />
									</xsl:when>
									<!-- タイプ.Url -->
									<xsl:when test="sf:type='Url'">
										<span class="type">Url</span>
										<xsl:call-template name="textOption" />
									</xsl:when>
									<!-- タイプ.Html -->
									<xsl:when test="sf:type='Html'">
										<span class="type">Html</span>
										<xsl:call-template name="textOption" />
									</xsl:when>
									<!-- タイプ.選択肢 -->
									<xsl:when test="sf:type='Picklist'">
										<span class="type">選択</span>
										<xsl:call-template name="picklistOption" />
									</xsl:when>
									<!-- タイプ.複数選択肢 -->
									<xsl:when test="sf:type='MultiselectPicklist'">
										<span class="type">複数選択</span>
										<xsl:call-template name="picklistOption" />
									</xsl:when>
									<!-- タイプ.日付 -->
									<xsl:when test="sf:type='Date'">
										<span class="type">日付</span>
									</xsl:when>
									<!-- タイプ.日付時刻 -->
									<xsl:when test="sf:type='DateTime'">
										<span class="type">日付時刻</span>
									</xsl:when>
									<!-- タイプ.チェックボックス -->
									<xsl:when test="sf:type='Checkbox'">
										<span class="type">チェックボックス</span>
									</xsl:when>
									<!-- タイプ.通貨 -->
									<xsl:when test="sf:type='Currency'">
										<span class="type">通貨</span>
										<xsl:call-template name="numberOption" />
									</xsl:when>
									<!-- タイプ.数値 -->
									<xsl:when test="sf:type='Number'">
										<span class="type">数値</span>
										<xsl:call-template name="numberOption" />
									</xsl:when>
									<!-- タイプ.パーセント -->
									<xsl:when test="sf:type='Percent'">
										<span class="type">パーセント</span>
										<xsl:call-template name="numberOption" />
									</xsl:when>
									<!-- タイプ.主従関係 -->
									<xsl:when test="sf:type='MasterDetail'">
										<span class="type">主従</span>
										<xsl:call-template name="referenceOption" />
									</xsl:when>
									<!-- タイプ.参照関係 -->
									<xsl:when test="sf:type='Lookup'">
										<span class="type">参照</span>
										<xsl:call-template name="referenceOption" />
									</xsl:when>
									<!-- タイプ.その他 -->
									<xsl:otherwise>
										<td class="type"><xsl:value-of select="sf:type" /></td>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:if test="sf:formula"><span class="formulaMark">[数式]</span></xsl:if>
							</td>
							<!-- 数式/選択肢/初期値 -->
							<td class="formula">
								<xsl:choose>
									<!-- 数式 -->
									<xsl:when test="sf:formula">
										<div class="formula"><xsl:value-of select="sf:formula" /></div>
									</xsl:when>
									<!-- 選択肢 -->
									<xsl:when test="sf:picklist">
										<xsl:call-template name="picklistValues" />
									</xsl:when>
									<!-- 初期値 -->
									<xsl:when test="sf:defaultValue">
										<div class="defaultValue"><xsl:value-of select="sf:defaultValue" /></div>
									</xsl:when>
								</xsl:choose>
							</td>
							<!-- 説明 -->
							<td class="description"><xsl:value-of select="sf:description" /></td>
							<!-- ヘルプテキスト -->
							<td class="inlineHelpText"><xsl:value-of select="sf:inlineHelpText" /></td>
							<!-- 必須 -->
							<td class="required"><xsl:if test="sf:required='true'">◯</xsl:if></td>
							<!-- 外部ID -->
							<td class="externalId"><xsl:if test="sf:externalId='true'">◯</xsl:if></td>
							<!-- 重複なし -->
							<td class="unique"><xsl:if test="sf:unique='true'">◯</xsl:if></td>
						</tr>
					</xsl:for-each>
				</table>
			</body>
		</html>
	</xsl:template>
	<!--
	  主従/参照関係のオプション表示
	  カレントノードは fields
	 -->
	<xsl:template name="referenceOption">
		<xsl:choose>
			<xsl:when test="ends-with(sf:referenceTo, '__c')">
			  <span class="typeOption">(<a><xsl:attribute name="href">./<xsl:value-of select="sf:referenceTo" />.html</xsl:attribute><xsl:value-of select="substring-before(sf:referenceTo, '__c')" /></a>)</span>
			</xsl:when>
			<xsl:otherwise>
			  <span class="typeOption">(<a><xsl:attribute name="href">https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_<xsl:value-of select="translate(sf:referenceTo, $uppercase, $smallcase)" />.htm</xsl:attribute><xsl:value-of select="sf:referenceTo" /></a>)</span>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!--
	  テキスト/ロングテキスト (領域も含む)のオプション表示
	  カレントノードは fields
	 -->
	<xsl:template name="textOption">
		<xsl:if test="sf:length">
			<span class="typeOption">(<span class="length"><xsl:value-of select="sf:length" /></span>)</span>
		</xsl:if>
	</xsl:template>
	<!--
	  数値/通貨のオプション表示
	  カレントノードは fields
	 -->
	<xsl:template name="numberOption">
		<span class="typeOption">(<span class="precision"><xsl:value-of select="sf:precision" /></span>,<span class="scale"><xsl:value-of select="sf:scale" /></span>)</span>
	</xsl:template>
	<!--
	  選択肢のオプション表示
	  カレントノードは fields
	 -->
	<xsl:template name="picklistOption">
		<xsl:if test="sf:valueSet/sf:valueSetName">
			<span class="typeOption">(<span class="globalPicklist" colspan="2"><a><xsl:attribute name="href">../globalvalues/<xsl:value-of select="sf:valueSet/sf:valueSetName" />.html</xsl:attribute><xsl:value-of select="sf:valueSet/sf:valueSetName" /></a></span>)</span>
		</xsl:if>
	</xsl:template>
	<!--
	  選択肢リストの表示
	  カレントノードは fields
	 -->
	<xsl:template name="picklistValues">
		<xsl:for-each select="sf:picklist/sf:picklistValues">
			<div>
				<xsl:attribute name="class">picklistValue<xsl:if test="sf:default='true'"> defaultPicklistValue</xsl:if></xsl:attribute>
				<xsl:value-of select="sf:fullName" />
			</div>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
