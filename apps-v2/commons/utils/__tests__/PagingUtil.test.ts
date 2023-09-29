import * as PagingUtil from '../PagingUtil';

const records = `abcdefghijklmnopqrstuvwxyz`.split('');

describe('PagingUtil', () => {
  describe('getMaxPage()', () => {
    test('1 record and limit per page is 10.', () => {
      expect(PagingUtil.getMaxPage(1, 10)).toEqual(1);
    });
    test('9 record and limit per page is 10.', () => {
      expect(PagingUtil.getMaxPage(9, 10)).toEqual(1);
    });

    test('10 record and limit per page is 10.', () => {
      expect(PagingUtil.getMaxPage(10, 10)).toEqual(1);
    });

    test('11 records and limit per page is 10.', () => {
      expect(PagingUtil.getMaxPage(11, 10)).toEqual(2);
    });
  });

  describe('roundPage()', () => {
    test('zero', () => {
      expect(PagingUtil.roundPage(0, 1, 10)).toEqual(0);
    });
    test('simple', () => {
      expect(PagingUtil.roundPage(26, 1, 10)).toEqual(1);
    });
    test('last', () => {
      expect(PagingUtil.roundPage(26, 3, 10)).toEqual(3);
    });
    test('over', () => {
      expect(PagingUtil.roundPage(26, 4, 10)).toEqual(3);
    });
  });

  describe('getRecordStartNumber()', () => {
    test('1st page and limit per page is 12', () => {
      expect(PagingUtil.getRecordStartNumber(1, 12)).toEqual(1);
    });

    test('2nd page and limit per page is 12', () => {
      expect(PagingUtil.getRecordStartNumber(2, 12)).toEqual(13);
    });
  });

  describe('getRecordEndNumber()', () => {
    test('1st page and limit per page is 12', () => {
      expect(PagingUtil.getRecordEndNumber(1, 12)).toEqual(12);
    });

    test('2nd page and limit per page is 12', () => {
      expect(PagingUtil.getRecordEndNumber(2, 12)).toEqual(24);
    });
  });

  describe('getRecordsEachPage', () => {
    test('zero', () => {
      expect(
        PagingUtil.getRecordsEachPage([], { current: 1, limitPerPage: 10 })
      ).toEqual([]);
    });
    test('simple', () => {
      expect(
        PagingUtil.getRecordsEachPage(records, { current: 1, limitPerPage: 10 })
      ).toEqual('abcdefghij'.split(''));
    });
    test('last', () => {
      expect(
        PagingUtil.getRecordsEachPage(records, { current: 3, limitPerPage: 10 })
      ).toEqual('uvwxyz'.split(''));
    });
    test('over', () => {
      expect(
        PagingUtil.getRecordsEachPage(records, { current: 4, limitPerPage: 10 })
      ).toEqual([]);
    });
  });
});
