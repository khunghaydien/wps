import { NAMESPACE_PREFIX } from '@apps/commons/api';

const LOCATION_MAP = {
  'accounting-csv-pc': {
    // NOTE: このパスは計上仕訳の CSV 出力で使用するが local 環境では動かせないので null をセットする
    //       ref. GENIE-2026
    local: null,
    vfp: 'AccountingCsv',
  },
  'accounting-fb-pc': {
    // NOTE: このパスはFBデータ出力で使用するが local 環境では動かせないので null をセットする
    //       ref. GENIE-2068
    local: null,
    vfp: 'AccountingFBData',
  },
  'custom-request-pc': {
    local: 'custom-request-pc/index.html',
    vfp: 'CustomRequest',
  },
  'expenses-pc': {
    local: 'expenses-pc/index.html',
    vfp: 'Expenses',
  },
  'requests-pc': {
    local: 'requests-pc/index.html',
    vfp: 'Requests',
  },
  'timesheet-pc': {
    local: 'timesheet-pc/index.html',
    vfp: 'TimeAttendance',
  },
  'timesheet-pc-summary': {
    local: 'timesheet-pc-summary/index.html',
    vfp: 'TimesheetSummary',
  },
  'timesheet-pc-leave': {
    local: 'timesheet-pc-leave/index.html',
    vfp: 'TimesheetLeave',
  },
  'test-api': {
    local: 'test-api/index.html',
    vfp: '',
  },
  'database-tool-pc': {
    local: 'database-tool-pc/index.html',
    vfp: 'DatabaseTool',
  },
  'resource-pc-schedule': {
    local: 'resource-pc-schedule/index.html',
    vfp: 'ResourceSchedule',
  },
  'timestamp-mobile': {
    local: 'mobile-app/attendance/timestamp',
    vfp: 'TimestampMobile',
  },
} as const;

type AppId = keyof typeof LOCATION_MAP;

type QueryMap = {
  [key: string]: string;
};

export default class UrlUtil {
  // URLクエリを分割して格納したObjectを返す
  static getUrlQuery(): QueryMap | null {
    // TODO Return empty hash if no queries given
    let obj = null;
    const queryString = window.location.search.substring(1);
    if (queryString && queryString.length > 0) {
      obj = {};
      const pairs = queryString.split('&');
      for (const pair of pairs) {
        const elements = pair.split('=');
        const paramName = decodeURIComponent(elements[0]);
        const paramValue = decodeURIComponent(elements[1]);
        obj[paramName] = paramValue;
      }
    }

    return obj;
  }

  /**
   * Return relative url to the app whose ID is the specified one.
   * @param {string} appId Identifier of the app.
   * @param {Object} [param] Query parameters. Must be a hash.
   * @returns {?string} Relative url to the app.
   *     Return null if the app can't be found, or can't be opened current environment.
   */
  static appUrl(appId: AppId, param: QueryMap = {}): string | null {
    const queryString = new URLSearchParams(param).toString();

    // ローカル・LEX・Classic それぞれの環境で遷移方法が異なる
    if (UrlUtil.isLocal()) {
      if (!LOCATION_MAP[appId].local) {
        return null;
      }
      return `/${LOCATION_MAP[appId].local}?${queryString}`;
    }
    if (UrlUtil.isLex()) {
      return `/apex/${NAMESPACE_PREFIX}${LOCATION_MAP[appId].vfp}?${queryString}`;
    }
    // Classic 環境
    return `./${NAMESPACE_PREFIX}${LOCATION_MAP[appId].vfp}?${queryString}`;
  }

  /**
   * Go the app whose ID is the specified one if it avails.
   * @param {string} appId Identifier of the app.
   * @param {Object} [param] Query parameters. Must be a hash.
   */
  static navigateTo(
    appId: AppId,
    param: QueryMap = {},
    isRedirect = false
  ): void {
    const appUrl = UrlUtil.appUrl(appId, param);

    if (!appUrl) {
      // ローカル環境で動かない場合は処理を中断
      return;
    }
    if (UrlUtil.isLex()) {
      // Salesforce1 navigation
      window.sforce.one.navigateToURL(appUrl, isRedirect);
    }

    location.href = appUrl;
  }

  /**
   * Open a new window with URL parameters (optional).
   * @param {string} appId Identifier of the app.
   * @param {?Object} [param] Query parameters. Must be a hash.
   * @returns {?Window} Window object if the app were opened. Otherwise returns null.
   */
  static openApp(appId: AppId, param: QueryMap = {}): Window | null {
    const appUrl = UrlUtil.appUrl(appId, param);

    if (appUrl) {
      return window.open(appUrl);
    }

    return null;
  }

  /**
   * Check that page is opened.
   * @returns
   */
  static isOpened(appId: AppId): boolean {
    const location = LOCATION_MAP[appId];
    if (UrlUtil.isLocal()) {
      return window.location.pathname === `/${location.local}`;
    } else {
      return (
        window.location.pathname === `/apex/${location.vfp}` ||
        window.location.pathname ===
          `/apex/${NAMESPACE_PREFIX}${location.vfp}` ||
        (location.local.includes('mobile-app') &&
          window.location.pathname ===
            `/${location.local.replace('mobile-app', 'apex')}`)
      );
    }
  }

  static isLex(): boolean {
    // ref. http://salesforce.stackexchange.com/questions/44148/salesforce1-navigatetourl-method
    return typeof window.sforce !== 'undefined' && window.sforce !== null;
  }

  /**
   * ローカル環境かどうかの判定
   * 現在は「URL に `.html` が含まれるかどうか」という簡易的な判定になっている
   */
  static isLocal(): boolean {
    return (
      window.location.href.split('.')[1] === 'html' ||
      window.location.href.split('.')[0].includes('mobile-app')
    );
  }

  /**
   * @returns instance url of current window if using localhost
   */
  static getInstanceUrl(): string {
    return UrlUtil.isLocal() ? window.localStorage.jsforce0_instance_url : '';
  }
}
