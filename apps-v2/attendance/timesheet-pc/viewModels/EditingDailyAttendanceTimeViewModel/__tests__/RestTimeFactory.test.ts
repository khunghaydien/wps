import { RestTimeFactory } from '../RestTimeFactory';

jest.mock('nanoid', () => ({
  __esModule: true,
  default: () => 'id',
}));

describe('RestTimeFactory', () => {
  describe('create()', () => {
    it('should create with empty argument', () => {
      expect(RestTimeFactory.create()).toEqual({
        id: 'id',
        startTime: null,
        endTime: null,
        restReason: null,
      });
    });
    it('should create with argument', () => {
      expect(
        RestTimeFactory.create({
          id: 'oldId',
          startTime: 0,
          endTime: 0,
          restReason: {
            id: 'REST_REASON_ID',
            name: 'お昼休み',
            code: '001',
          },
        })
      ).toEqual({
        id: 'oldId',
        startTime: 0,
        endTime: 0,
        restReason: {
          id: 'REST_REASON_ID',
          name: 'お昼休み',
          code: '001',
        },
      });
    });
    it('should create without id', () => {
      expect(
        RestTimeFactory.create({
          startTime: 0,
          endTime: 0,
          restReason: {
            id: 'REST_REASON_ID',
            name: 'お昼休み',
            code: '001',
          },
        })
      ).toEqual({
        id: 'id',
        startTime: 0,
        endTime: 0,
        restReason: {
          id: 'REST_REASON_ID',
          name: 'お昼休み',
          code: '001',
        },
      });
    });
  });
});
