import { parse, startOfToday } from 'date-fns';

import {
  detectDefaultHistory,
  OrganizationHierarchyHistory,
} from '../OrganizationHierarchy';

jest.mock('date-fns', () => {
  const originalModule = jest.requireActual('date-fns');
  return {
    __esModule: true,
    ...originalModule,
    startOfToday: jest.fn(),
  };
});

describe('detectDefaultHistory()', () => {
  const historyList = [
    {
      validDateFrom: '2023-01-01',
      validDateTo: '2023-12-31',
    },
    {
      validDateFrom: '2022-01-01',
      validDateTo: '2022-12-31',
    },
    {
      validDateFrom: '2021-01-01',
      validDateTo: '2021-12-31',
    },
  ] as OrganizationHierarchyHistory[];

  describe('Length is 0', () => {
    it('returns null', () => expect(detectDefaultHistory([])).toBe(null));
  });

  describe('In range(minimum boundary)', () => {
    const mockToday = parse('2022-01-01');
    (startOfToday as jest.Mock).mockReturnValue(mockToday);
    const result = detectDefaultHistory(historyList);
    it('returns matched one', () => expect(result).toBe(historyList[1]));
  });

  describe('In range(maximum boundary)', () => {
    const mockToday = parse('2022-12-31');
    (startOfToday as jest.Mock).mockReturnValue(mockToday);
    const result = detectDefaultHistory(historyList);
    it('returns matched one', () => expect(result).toBe(historyList[1]));
  });

  describe('Out of range - Past', () => {
    const mockToday = parse('2019-12-31');
    (startOfToday as jest.Mock).mockReturnValue(mockToday);
    const result = detectDefaultHistory(historyList);
    it('returns oldest one', () => expect(result).toBe(historyList[2]));
  });

  describe('Out of range - Future', () => {
    const mockToday = parse('2025-01-01');
    (startOfToday as jest.Mock).mockReturnValue(mockToday);
    const result = detectDefaultHistory(historyList);
    it('returns newest one', () => expect(result).toBe(historyList[0]));
  });
});
