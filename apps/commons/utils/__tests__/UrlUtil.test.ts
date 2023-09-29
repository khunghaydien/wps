import UrlUtil from '../UrlUtil';

jest.mock('@apps/commons/api', () => ({
  __esModule: true,
  NAMESPACE_PREFIX: 'PREFIX__',
}));

Object.defineProperty(window, 'location', {
  value: {
    href: '',
    search: '',
    pathname: '',
  },
  writable: true,
});
Object.defineProperty(window, 'localStorage', {
  value: {
    jsforce0_instance_url: '',
  },
  writable: true,
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('getUrlQuery', () => {
  it.each`
    param                        | expected
    ${''}                        | ${null}
    ${'key1=param1'}             | ${{ key1: 'param1' }}
    ${'key1=param1&key2=param2'} | ${{ key1: 'param1', key2: 'param2' }}
  `('should be $expected if param is $param', ({ param, expected }) => {
    window.location.search = `?${param}`;
    const result = UrlUtil.getUrlQuery();
    expect(result).toEqual(expected);
  });
});

describe('appUrl', () => {
  const param = {
    key1: 'param1',
    key2: 'param2',
  };
  it.each`
    env          | appId                  | param        | expected
    ${'local'}   | ${'accounting-csv-pc'} | ${undefined} | ${null}
    ${'local'}   | ${'accounting-csv-pc'} | ${param}     | ${null}
    ${'local'}   | ${'timesheet-pc'}      | ${undefined} | ${`/timesheet-pc/index.html?`}
    ${'local'}   | ${'timesheet-pc'}      | ${param}     | ${`/timesheet-pc/index.html?key1=param1&key2=param2`}
    ${'lex'}     | ${'timesheet-pc'}      | ${undefined} | ${`/apex/PREFIX__TimeAttendance?`}
    ${'lex'}     | ${'timesheet-pc'}      | ${param}     | ${`/apex/PREFIX__TimeAttendance?key1=param1&key2=param2`}
    ${'classic'} | ${'timesheet-pc'}      | ${undefined} | ${`./PREFIX__TimeAttendance?`}
    ${'classic'} | ${'timesheet-pc'}      | ${param}     | ${`./PREFIX__TimeAttendance?key1=param1&key2=param2`}
  `(
    'should be $expected if env is $env and [appId=$appId, param=$param]',
    ({ env, appId, param, expected }) => {
      const isLocal = jest.spyOn(UrlUtil, 'isLocal');
      const isLex = jest.spyOn(UrlUtil, 'isLex');
      if (env === 'local') {
        isLocal.mockReturnValue(true);
        isLex.mockReturnValue(false);
      } else if (env === 'lex') {
        isLocal.mockReturnValue(false);
        isLex.mockReturnValue(true);
      } else {
        isLocal.mockReturnValue(false);
        isLex.mockReturnValue(false);
      }
      const result = UrlUtil.appUrl(appId, param);
      expect(result).toBe(expected);
    }
  );
});

describe('navigateTo', () => {
  beforeEach(() => {
    window.sforce = {
      one: {
        navigateToURL: jest.fn(),
      },
    };
    window.location.href = 'href';
  });
  it('should not execute if appUrl is null', () => {
    const appUrl = jest.spyOn(UrlUtil, 'appUrl').mockReturnValue(null);
    UrlUtil.navigateTo('timesheet-pc', { key1: 'param1' });
    expect(appUrl).toBeCalledTimes(1);
    expect(appUrl).toBeCalledWith('timesheet-pc', { key1: 'param1' });
    expect(window.sforce.one.navigateToURL).toBeCalledTimes(0);
    expect(window.location.href).toBe('href');
  });
  it('should execute navigateToURL if lex is true', () => {
    const appUrl = jest.spyOn(UrlUtil, 'appUrl').mockReturnValue('new url');
    jest.spyOn(UrlUtil, 'isLex').mockReturnValue(true);
    UrlUtil.navigateTo('timesheet-pc', { key1: 'param1' });
    expect(appUrl).toBeCalledTimes(1);
    expect(appUrl).toBeCalledWith('timesheet-pc', { key1: 'param1' });
    expect(window.sforce.one.navigateToURL).toBeCalledTimes(1);
    expect(window.sforce.one.navigateToURL).toBeCalledWith('new url', false);
    expect(window.location.href).toBe('new url');
  });
  it('should change href if lex is false', () => {
    const appUrl = jest.spyOn(UrlUtil, 'appUrl').mockReturnValue('new url');
    jest.spyOn(UrlUtil, 'isLex').mockReturnValue(false);
    UrlUtil.navigateTo('timesheet-pc', { key1: 'param1' });
    expect(appUrl).toBeCalledTimes(1);
    expect(appUrl).toBeCalledWith('timesheet-pc', { key1: 'param1' });
    expect(window.sforce.one.navigateToURL).toBeCalledTimes(0);
    expect(window.location.href).toBe('new url');
  });
  it('should use arguments', () => {
    jest.spyOn(UrlUtil, 'appUrl').mockReturnValue('new url');
    jest.spyOn(UrlUtil, 'isLex').mockReturnValue(true);
    UrlUtil.navigateTo('timesheet-pc', { key1: 'param1' }, true);
    expect(window.sforce.one.navigateToURL).toBeCalledTimes(1);
    expect(window.sforce.one.navigateToURL).toBeCalledWith('new url', true);
    expect(window.location.href).toBe('new url');
  });
});

describe('openApp', () => {
  window.open = jest.fn();
  it('should not execute if appUrl is null', () => {
    const appUrl = jest.spyOn(UrlUtil, 'appUrl').mockReturnValue(null);
    const result = UrlUtil.openApp('timesheet-pc', { key1: 'param1' });
    expect(result).toBe(null);
    expect(appUrl).toBeCalledTimes(1);
    expect(appUrl).toBeCalledWith('timesheet-pc', { key1: 'param1' });
    expect(window.open).toBeCalledTimes(0);
  });
  it('should execute open', () => {
    (window.open as jest.Mock).mockReturnValue('called');
    const appUrl = jest.spyOn(UrlUtil, 'appUrl').mockReturnValue('new url');
    const result = UrlUtil.openApp('timesheet-pc', { key1: 'param1' });
    expect(result).toBe('called');
    expect(appUrl).toBeCalledTimes(1);
    expect(appUrl).toBeCalledWith('timesheet-pc', { key1: 'param1' });
    expect(window.open).toBeCalledTimes(1);
    expect(window.open).toBeCalledWith('new url');
  });
});

describe('isOpened', () => {
  describe.each`
    key                   | pathname                                  | local    | other
    ${'timestamp-mobile'} | ${''}                                     | ${false} | ${false}
    ${'timestamp-mobile'} | ${'/apex/TimestampMobile'}                | ${false} | ${true}
    ${'timestamp-mobile'} | ${'/apex/PREFIX__TimestampMobile'}        | ${false} | ${true}
    ${'timestamp-mobile'} | ${'/mobile-app/attendance/timestamp'}     | ${true}  | ${false}
    ${'timestamp-mobile'} | ${'/apex/attendance/timestamp'}           | ${false} | ${true}
    ${'timestamp-mobile'} | ${'/lightning/n/TimestampMobile'}         | ${false} | ${false}
    ${'timestamp-mobile'} | ${'/lightning/n/PREFIX__TimestampMobile'} | ${false} | ${false}
    ${'timesheet-pc'}     | ${'/timesheet-pc/index.html'}             | ${true}  | ${false}
    ${'timesheet-pc'}     | ${'/apex/TimeAttendance'}                 | ${false} | ${true}
  `('key=$key, pathname=$pathname', ({ key, pathname, local, other }) => {
    it(`should be ${local} result if isLocal is true`, () => {
      window.location.pathname = pathname;
      jest.spyOn(UrlUtil, 'isLocal').mockReturnValue(true);
      expect(UrlUtil.isOpened(key)).toBe(local);
    });
    it(`should be ${other} result if isLocal is false`, () => {
      window.location.pathname = pathname;
      jest.spyOn(UrlUtil, 'isLocal').mockReturnValue(false);
      expect(UrlUtil.isOpened(key)).toBe(other);
    });
  });
});

describe('isLex', () => {
  it.each`
    sforce       | expected
    ${undefined} | ${false}
    ${null}      | ${false}
    ${'sforce'}  | ${true}
  `('should be $expected if sforce is $sforce', ({ sforce, expected }) => {
    window.sforce = sforce;
    expect(UrlUtil.isLex()).toBe(expected);
  });
});

describe('isLocal', () => {
  it.each`
    href                                             | expected
    ${''}                                            | ${false}
    ${'https://example.com/apex/page'}               | ${false}
    ${'https://example.com/apex/nm__page'}           | ${false}
    ${'https://example.com/lightning/n/nm__page'}    | ${false}
    ${'https://example.com:3000/index.html'}         | ${false}
    ${'https://localhost:3000/mobile-app/hoge/hoge'} | ${true}
    ${'https://localhost:3000/index.html'}           | ${true}
  `('should be $expected if href is $href', ({ href, expected }) => {
    window.location.href = href;
    expect(UrlUtil.isLocal()).toBe(expected);
  });
});

describe('getInstanceUrl', () => {
  // @ts-ignore
  window.localStorage = {
    jsforce0_instance_url: 'jsforce',
  };
  it('should return string if env is local', () => {
    jest.spyOn(UrlUtil, 'isLocal').mockReturnValue(true);
    expect(UrlUtil.getInstanceUrl()).toBe('jsforce');
  });
  it("should return '' if env is not local", () => {
    jest.spyOn(UrlUtil, 'isLocal').mockReturnValue(false);
    expect(UrlUtil.getInstanceUrl()).toBe('');
  });
});
