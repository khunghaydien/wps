import TimeUtil from '../TimeUtil';

describe('toMinutes() のテスト', () => {
  describe('正常系', () => {
    test('0(1桁)', () => {
      expect(TimeUtil.toMinutes('0:0')).toBe(0);
    });
    test('0(2桁)', () => {
      expect(TimeUtil.toMinutes('00:00')).toBe(0);
    });
    test('時間(1桁)', () => {
      expect(TimeUtil.toMinutes('01:00')).toBe(60);
    });
    test('時間(2桁)', () => {
      expect(TimeUtil.toMinutes('11:00')).toBe(660);
    });
    test('分(1桁)', () => {
      expect(TimeUtil.toMinutes('00:01')).toBe(1);
    });
    test('分(2桁)', () => {
      expect(TimeUtil.toMinutes('00:23')).toBe(23);
    });
    test('分(3桁)', () => {
      expect(TimeUtil.toMinutes('111:23')).toBe(6683);
    });
  });

  describe('おかしな時刻が入力されたケース', () => {
    test('コロンなし', () => {
      expect(TimeUtil.toMinutes('1211')).toBe('');
    });
    test('アルファベット混じり', () => {
      expect(TimeUtil.toMinutes('a1:00')).toBe('');
    });
    test('マイナス値(時)', () => {
      expect(TimeUtil.toMinutes('-1:00')).toBe(60);
    });
    test('マイナス値(分)', () => {
      expect(TimeUtil.toMinutes('2:-10')).toBe(130);
    });
  });

  describe('Receive number value', () => {
    test('it should return a received value', () => {
      expect(TimeUtil.toMinutes(500)).toBe(500);
    });
  });

  describe('Receive null or undefined value', () => {
    test("it should return '' for null", () => {
      expect(TimeUtil.toMinutes(null)).toBe('');
    });
    test("it should return '' for undefined", () => {
      expect(TimeUtil.toMinutes(undefined)).toBe('');
    });
  });
});

describe('parseMinutes()', () => {
  describe('normal system', () => {
    test('0(a digit)', () => {
      expect(TimeUtil.parseMinutes('0:0')).toBe(0);
    });
    test('0(two digits)', () => {
      expect(TimeUtil.parseMinutes('00:00')).toBe(0);
    });
    test('hours(a digit)', () => {
      expect(TimeUtil.parseMinutes('01:00')).toBe(60);
    });
    test('hours(two digits)', () => {
      expect(TimeUtil.parseMinutes('11:00')).toBe(660);
    });
    test('minutes(a digit)', () => {
      expect(TimeUtil.parseMinutes('00:01')).toBe(1);
    });
    test('minutes(two digits)', () => {
      expect(TimeUtil.parseMinutes('00:23')).toBe(23);
    });
    test('minutes(three digits)', () => {
      expect(TimeUtil.parseMinutes('111:23')).toBe(6683);
    });
  });

  describe('Receive an invalid input', () => {
    test('No colon', () => {
      expect(TimeUtil.parseMinutes('1211')).toBe(null);
    });
    test('Including an alphabet', () => {
      expect(TimeUtil.parseMinutes('a1:00')).toBe(null);
    });
    test('Including a minus char at hour part', () => {
      expect(TimeUtil.parseMinutes('-1:00')).toBe(60);
    });
    test('Including a minus char at minute part', () => {
      expect(TimeUtil.parseMinutes('2:-10')).toBe(130);
    });
  });

  describe('Receive number value', () => {
    test('it should return a received value', () => {
      expect(TimeUtil.parseMinutes(500)).toBe(500);
    });
  });

  describe('Receive null or undefined value', () => {
    test("it should return '' for null", () => {
      expect(TimeUtil.parseMinutes(null)).toBe(null);
    });
    test("it should return '' for undefined", () => {
      expect(TimeUtil.parseMinutes(undefined)).toBe(null);
    });
  });
});

describe('supportFormat(value) のテスト', () => {
  describe('1,2桁の数字の場合 e.g. 12 → 12:00', () => {
    test('1桁の数字が「時」として評価されること', () => {
      expect(TimeUtil.supportFormat('1')).toBe('01:00');
    });
    test('2桁の数字が「時」として評価されること', () => {
      expect(TimeUtil.supportFormat('12')).toBe('12:00');
    });
    test('2バイト文字の数字でも評価されること', () => {
      expect(TimeUtil.supportFormat('１２')).toBe('12:00');
    });
  });

  describe('3〜4桁の数字の場合 e.g. 1234 → 12:34', () => {
    test('3桁目以上が「時」端数が「分」として評価されること（3桁）', () => {
      expect(TimeUtil.supportFormat('123')).toBe('01:23');
    });
    test('3桁目以上が「時」端数が「分」として評価されること（4桁）', () => {
      expect(TimeUtil.supportFormat('1234')).toBe('12:34');
    });
    test('「分」の部分が60以上の場合、「時」の桁上りに反映されること', () => {
      expect(TimeUtil.supportFormat('1260')).toBe('13:00');
    });
    test('2バイト文字の数字でも評価されること', () => {
      expect(TimeUtil.supportFormat('１２３４')).toBe('12:34');
    });
  });

  describe('5桁以上の数字の場合 e.g. 12345 → 12:34', () => {
    test('先頭4文字が評価されること', () => {
      expect(TimeUtil.supportFormat('12345')).toBe('12:34');
    });
  });

  describe('「nn:nn」形式の場合 e.g. 12:34 → 12:34', () => {
    test('HH:mm形式のまま出力されること', () => {
      expect(TimeUtil.supportFormat('12:34')).toBe('12:34');
    });
    test('「分」が60以上であれば、「時」の桁上がりとして評価されること', () => {
      expect(TimeUtil.supportFormat('12:120')).toBe('14:00');
    });
    test('2バイト文字でも評価されること', () => {
      expect(TimeUtil.supportFormat('１２：３４５')).toBe('17:45');
    });
    test('引数の「分」が空文字列であれば、0分として解釈されること', () => {
      expect(TimeUtil.supportFormat('12:')).toBe('12:00');
    });
    test('引数の「時」が空文字列は異常値であるため、空文字列が返却されること', () => {
      expect(TimeUtil.supportFormat(':30')).toBe('');
    });
  });

  describe('「nn.nn」形式の場合 e.g. 12.5 → 12:30', () => {
    test('小数部分が「分」の係数として評価されること', () => {
      expect(TimeUtil.supportFormat('12.5')).toBe('12:30');
    });
    test('計算結果が四捨五入されること（.508 → 30.48分）', () => {
      expect(TimeUtil.supportFormat('12.508')).toBe('12:30');
    });
    test('計算結果が四捨五入されること（.509 → 30.54分）', () => {
      expect(TimeUtil.supportFormat('12.509')).toBe('12:31');
    });
    test('2バイト文字でも評価されること', () => {
      expect(TimeUtil.supportFormat('１２．５')).toBe('12:30');
    });
    test('引数の「分」が空文字列であれば、0分として解釈されること', () => {
      expect(TimeUtil.supportFormat('12.')).toBe('12:00');
    });
    test('引数の「時」が空文字列は異常値であるため、空文字列が返却されること', () => {
      expect(TimeUtil.supportFormat('.5')).toBe('');
    });
  });

  describe('数値の0に該当し「00:00」として評価されるべき値', () => {
    test('0', () => {
      expect(TimeUtil.supportFormat('0')).toBe('00:00');
    });
    test('000', () => {
      expect(TimeUtil.supportFormat('000')).toBe('00:00');
    });
    test('00000', () => {
      expect(TimeUtil.supportFormat('00000')).toBe('00:00');
    });
    test('０００００', () => {
      expect(TimeUtil.supportFormat('０００００')).toBe('00:00');
    });
    test('0.00', () => {
      expect(TimeUtil.supportFormat('0.00')).toBe('00:00');
    });
  });

  describe('48時以上の値は対象外なので、空文字列が返却される', () => {
    describe('1,2桁の数字', () => {
      test('対応内・最大値', () => {
        expect(TimeUtil.supportFormat('47')).toBe('47:00');
      });
      test('対応外・最小値', () => {
        expect(TimeUtil.supportFormat('48')).toBe('');
      });
    });
    describe('3,4桁の数字', () => {
      test('対応内・最大値', () => {
        expect(TimeUtil.supportFormat('4759')).toBe('47:59');
      });
      test('対応外・最小値', () => {
        expect(TimeUtil.supportFormat('4760')).toBe('');
      });
    });
    describe('5桁以上の数', () => {
      test('対応内・最大値', () => {
        expect(TimeUtil.supportFormat('47599')).toBe('47:59');
      });
      test('対応外・最小値', () => {
        expect(TimeUtil.supportFormat('47600')).toBe('');
      });
    });
    describe('「nn:nn」形式', () => {
      test('対応内・最大値', () => {
        expect(TimeUtil.supportFormat('46:119')).toBe('47:59');
      });
      test('対応外・最小値', () => {
        expect(TimeUtil.supportFormat('46:120')).toBe('');
      });
    });
    describe('「nn.nn」形式', () => {
      test('対応内・最大値', () => {
        expect(TimeUtil.supportFormat('47.991')).toBe('47:59');
      });
      test('対応外・最小値', () => {
        expect(TimeUtil.supportFormat('47.992')).toBe('');
      });
    });
  });

  describe('その他の異常値', () => {
    test('""', () => {
      expect(TimeUtil.supportFormat('')).toBe('');
    });
    test('":"', () => {
      expect(TimeUtil.supportFormat(':')).toBe('');
    });
    test('"."', () => {
      expect(TimeUtil.supportFormat('.')).toBe('');
    });
    test('" "', () => {
      expect(TimeUtil.supportFormat(' ')).toBe('');
    });
    test('"a:00"', () => {
      expect(TimeUtil.supportFormat('a:00')).toBe('');
    });
    test('"あ:00"', () => {
      expect(TimeUtil.supportFormat('あ:00')).toBe('');
    });
    test('"安:00"', () => {
      expect(TimeUtil.supportFormat('安:00')).toBe('');
    });
    test('"11:1a"', () => {
      expect(TimeUtil.supportFormat('11:1a')).toBe('');
    });
  });
});

describe('calcDurationMinutes()のテスト', () => {
  describe('正常系', () => {
    test('1時間未満', () => {
      const duration = TimeUtil.calcDurationMinutes(
        '2014-10-10T04:50:40Z',
        '2014-10-10T04:55:40Z'
      );
      expect(duration).toBe(5);
    });
    test('1時間以上', () => {
      const duration = TimeUtil.calcDurationMinutes(
        '2014-10-10T04:50:40Z',
        '2014-10-10T05:50:40Z'
      );
      expect(duration).toBe(60);
    });
    test('同一時刻', () => {
      const duration = TimeUtil.calcDurationMinutes(
        '2014-10-10T04:50:40Z',
        '2014-10-10T04:50:40Z'
      );
      expect(duration).toBe(0);
    });
  });
});
