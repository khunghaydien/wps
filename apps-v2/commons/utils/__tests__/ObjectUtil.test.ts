import ObjectUtil from '../ObjectUtil';

const dummyObject = {
  name: 'My name',
  age: null,
  address: {
    country: 'Japan',
    prefecture: null,
  },
};

describe('getOrDefault() のテスト', () => {
  describe('object がネストしないケース', () => {
    test('key が存在するケース', () => {
      expect(ObjectUtil.getOrDefault(dummyObject, 'name', '')).toBe('My name');
    });

    test('key が存在しないケース', () => {
      expect(
        ObjectUtil.getOrDefault(dummyObject, 'phoneNumber', '000-0000-0000')
      ).toBe('000-0000-0000');
    });

    test('key は存在するが値が null のケース', () => {
      expect(ObjectUtil.getOrDefault(dummyObject, 'age', '30')).toBe('30');
    });
  });

  describe('object がネストするケース', () => {
    test('key が存在するケース', () => {
      expect(ObjectUtil.getOrDefault(dummyObject, 'address.country', '')).toBe(
        'Japan'
      );
    });

    test('key が存在しないケース', () => {
      expect(
        ObjectUtil.getOrDefault(dummyObject, 'address.city', 'Chuo-ku')
      ).toBe('Chuo-ku');
    });

    test('key は存在するが値が null のケース', () => {
      expect(
        ObjectUtil.getOrDefault(dummyObject, 'address.prefecture', 'Tokyo')
      ).toBe('Tokyo');
    });
  });
});

describe('getOrEmpty() のテスト', () => {
  describe('object がネストしないケース', () => {
    test('key が存在するケース', () => {
      expect(ObjectUtil.getOrEmpty(dummyObject, 'name')).toBe('My name');
    });

    test('key が存在しないケース', () => {
      expect(ObjectUtil.getOrEmpty(dummyObject, 'phoneNumber')).toBe('');
    });

    test('key は存在するが値が null のケース', () => {
      expect(ObjectUtil.getOrEmpty(dummyObject, 'age')).toBe('');
    });
  });

  describe('object がネストするケース', () => {
    test('key が存在するケース', () => {
      expect(ObjectUtil.getOrEmpty(dummyObject, 'address.country')).toBe(
        'Japan'
      );
    });

    test('key が存在しないケース', () => {
      expect(ObjectUtil.getOrEmpty(dummyObject, 'address.city')).toBe('');
    });

    test('key は存在するが値が null のケース', () => {
      expect(ObjectUtil.getOrEmpty(dummyObject, 'address.prefecture')).toBe('');
    });
  });
});
