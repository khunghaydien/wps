import Api from '../../commons/api';

import adapter from '@apps/repositories/adapters';

import { MobileSetting } from '@attendance/domain/models/MobileSetting';

export default {
  /**
   * Execute to get an entity
   */
  fetch: async (targetDate?: string): Promise<MobileSetting> => {
    const response = await Api.invoke({
      path: '/att/mobile-setting/get',
      param: { targetDate },
    });
    return { ...adapter.fromRemote<MobileSetting>(response) };
  },
};
