import Api from '../../../commons/api';

export default {
  /**
   * Execute to get employee's base record.
   */
  fetchCompanies: async (): Promise<any> => {
    const result: any = await Api.invoke({
      path: '/company/search',
      param: {},
    });
    return result;
  },
};
