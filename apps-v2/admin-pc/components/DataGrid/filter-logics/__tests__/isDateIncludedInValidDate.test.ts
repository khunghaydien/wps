import isDateIncludedInValidDate from '../isDateIncludedInValidDate';

describe("validDate: { from: '2018-10-01', through: '2018-10-31' }", () => {
  const row = {
    validDate: {
      from: '2018-10-01',
      through: '2018-10-31',
    },
  };

  describe('(from) 2018/9/30', () => {
    test('Returns false', () => {
      const filterTerm = '2018/9/30';
      expect(isDateIncludedInValidDate(row, { filterTerm })).toBe(false);
    });
  });

  describe('(from) 2018-09-30', () => {
    test('Returns false', () => {
      const filterTerm = '2018-09-30';
      expect(isDateIncludedInValidDate(row, { filterTerm })).toBe(false);
    });
  });

  describe('(from) 2018/10/1', () => {
    test('Returns true', () => {
      const filterTerm = '2018/10/1';
      expect(isDateIncludedInValidDate(row, { filterTerm })).toBe(true);
    });
  });

  describe('(from) 2018-10-01', () => {
    test('Returns true', () => {
      const filterTerm = '2018-10-01';
      expect(isDateIncludedInValidDate(row, { filterTerm })).toBe(true);
    });
  });

  describe('(to) 2018/10/31', () => {
    test('Returns true', () => {
      const filterTerm = '2018/10/31';
      expect(isDateIncludedInValidDate(row, { filterTerm })).toBe(true);
    });
  });

  describe('(to) 2018-10-31', () => {
    test('Returns true', () => {
      const filterTerm = '2018-10-31';
      expect(isDateIncludedInValidDate(row, { filterTerm })).toBe(true);
    });
  });

  describe('(to) 2018/11/1', () => {
    test('Returns false', () => {
      const filterTerm = '2018/11/1';
      expect(isDateIncludedInValidDate(row, { filterTerm })).toBe(false);
    });
  });

  describe('(to) 2018-11-01', () => {
    test('Returns false', () => {
      const filterTerm = '2018-11-01';
      expect(isDateIncludedInValidDate(row, { filterTerm })).toBe(false);
    });
  });
});
