<?xml version="1.0" encoding="UTF-8"?>
<!--
 Salesforce グローバル選択肢定義XMLを表示用のXHTMLに変換するXSLT

 パラメタ
    filename    グローバル選択肢定義のファイル名 (ex. ComLanguage.globalValueSet)
 -->
<xsl:stylesheet version="1.0"
       xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
       xmlns:sf="http://soap.sforce.com/2006/04/metadata">
	<xsl:param name="filename" />
	<xsl:output method="html"/>
	<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
	<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
	<xsl:variable name="objectname" select="substring-before($filename, '.globalValueSet')" />
	<!--
	 グローバル選択肢定義にマッチするテンプレート
	 <GlobalValueSet>〜</GlobalValueSet>をテンプレートの中身で置換えます。
	 -->
	<xsl:template match="/sf:GlobalValueSet">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
			<head>
				<title>グローバル選択肢定義 -- <xsl:value-of select="$objectname" /></title>
				<meta charset="UFT-8" />
				<link rel="stylesheet" type="text/css" href="objectdoc.css"/>
			</head>
			<body>
				<!-- グローバル選択肢名 -->
				<h1><span class="objectname"><xsl:value-of select="$objectname" /></span> -- <span class="objectlabel"><xsl:value-of select="sf:masterLabel" /></span></h1>
				<div class="description"><xsl:value-of select="sf:description" /></div>
 				<table class="globalValueSet">
					<!-- テーブルヘッダ -->
					<tr class="header">
						<th class="fullName">API名</th>
						<th class="default">初期</th>
					</tr>
					<!--
					   グローバル選択肢項目
					   <customValue>〜</customValue>の要素毎に以下のテンプレートの中身を出力します。
					  -->
					<xsl:for-each select="sf:customValue">
						<tr>
							<xsl:attribute name="id"><xsl:value-of select="sf:fullName" /></xsl:attribute>
							<!-- 重複なし -->
							<td class="fullName"><xsl:value-of select="sf:fullName" /></td>
							<td class="default"><xsl:if test="sf:default='true'">◯</xsl:if></td>
						</tr>
					</xsl:for-each>
				</table>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
