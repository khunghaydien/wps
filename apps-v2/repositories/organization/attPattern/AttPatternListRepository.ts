import Api from '@apps/commons/api';

export const ORDER_TYPE = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type Order = keyof typeof ORDER_TYPE;

export type SortOrder = {
  field: string;
  order: Order;
};

export type SearchCondition = {
  companyId: string;
  targetDate: string;
  codes: string[];
  name: string;
  workSystem: string;
  withoutCore: boolean;
  isSearchCodeForPartialMatch: boolean;
};

export type SearchQuery = {
  condition: SearchCondition;
  sortOrder: SortOrder;
  chunkSize: number;
};

export type PatternSearchQuery = SearchQuery & {
  offsetCode: string;
};

export default {
  /**
   * Execute to search pattern's offset codes
   */
  searchOffsetCodes: async (
    param: SearchQuery
  ): Promise<{
    total: number;
    offsetCodes: string[];
    hasMoreRecords: boolean;
  }> => {
    return await Api.invoke({
      path: '/att/pattern/offset-codes/search',
      param,
    });
  },
  /**
   * Execute to search patterns
   */
  searchPatterns: async (
    param: PatternSearchQuery
  ): Promise<{ records: [] }> => {
    return await Api.invoke({
      path: '/att/pattern/search',
      param,
    });
  },
};
