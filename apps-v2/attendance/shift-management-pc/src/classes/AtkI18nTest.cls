@isTest
private class AtkI18nTest {
	private static testMethod void testSetLocale() {
		AtkI18n.setlocale('en');
		system.debug(LoggingLevel.INFO, AtkI18n.getMessage('tk10000250'));
	}

	private static testMethod void testGetMessage() {
		AtkI18n.setlocale('ja');
		system.debug(LoggingLevel.INFO, AtkI18n.getMessage('tk10000250'));
		system.debug(LoggingLevel.INFO, AtkI18n.getMessage('en', 'tk10000250'));
		system.debug(LoggingLevel.INFO, AtkI18n.getMessage('tm11010010',new List<String>{'abc'}));
		system.debug(LoggingLevel.INFO, AtkI18n.getMessage('en', 'tm11010010',new List<String>{'abc'}));
		AtkI18n.setlocale('en');
		system.debug(LoggingLevel.INFO, AtkI18n.getMessage('tk10000250'));
		system.debug(LoggingLevel.INFO, AtkI18n.getMessage('ja', 'tk10000250'));
		system.debug(LoggingLevel.INFO, AtkI18n.getMessage('tm11010010',new List<String>{'abc'}));
		system.debug(LoggingLevel.INFO, AtkI18n.getMessage('ja', 'tm11010010',new List<String>{'abc'}));
	}
}