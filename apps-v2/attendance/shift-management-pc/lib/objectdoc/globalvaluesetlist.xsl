<?xml version="1.0" encoding="UTF-8"?>
<!--
 Salesforce グローバル選択肢の一覧を性意するXSLT
 ant タスクが生成した以下の形のXMLファイルを処理する
   <globalValueSets>
     <globalValueSet>{グローバル選択肢名}.globalValueSet</globalValueSet>
   </globalValueSets>
 -->
<xsl:stylesheet version="1.0"
       xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
       xmlns:sf="http://soap.sforce.com/2006/04/metadata">
	<!--
	 グローバル選択肢一覧にマッチするテンプレート
	 <CustomObject>〜</CustomObject>をテンプレートの中身で置換えます。
	 -->
	<xsl:template match="/globalValueSets">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja" lang="ja">
			<head>
				<title>グローバル選択肢一覧</title>
				<meta charset="UFT-8" />
				<link rel="stylesheet" type="text/css" href="objectdoc.css"/>
			</head>
			<body>
				<!-- グローバル選択肢名 -->
				<h1>グローバル選択肢一覧</h1>
				<table class="globalValueSetList">
					<tr class="header">
						<th class="fullName">グローバルバリュー名</th>
						<th class="label">表示名</th>
						<th class="description">説明</th>
					</tr>
					<xsl:for-each select="globalValueSet">
						<xsl:variable name="objectname" select="substring-after(substring-before(@href, '.globalValueSet'), 'globalValueSets/')" />
						<tr class="object">
							<xsl:attribute name="id"><xsl:value-of select="$objectname" /></xsl:attribute>
							<td class="fullName"><a><xsl:attribute name="href">./<xsl:value-of select="$objectname" />.html</xsl:attribute><xsl:value-of select="$objectname" /></a></td>
							<td class="label"><xsl:value-of select="document(@href)/sf:globalValueSet/sf:masterLabel" /></td>
							<td class="description"><xsl:value-of select="document(@href)/sf:globalValueSet/sf:description" /></td>
						</tr>
					</xsl:for-each>
				</table>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
