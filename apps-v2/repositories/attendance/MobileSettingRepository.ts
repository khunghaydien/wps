import Api from '../../commons/api';

import { MobileSetting } from '@apps/domain/models/attendance/MobileSetting';

import adapter from '../adapters';

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
