export default class LangUtil {
  /**
   * Get language from salesforce settings
   */
  static getLang() {
    return window.empInfo && window.empInfo.language;
  }

  /**
   * Salesforceから取得したLangをRFCに合わせて変換する
   */
  static convertSfLang(lang) {
    return lang.replace('_', '-');
  }
}
