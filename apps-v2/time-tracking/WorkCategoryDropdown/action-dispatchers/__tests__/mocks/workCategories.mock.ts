import { WorkCategory } from '../../../../../domain/models/time-tracking/WorkCategory';

// eslint-disable-next-line import/prefer-default-export
export const workCategories: { workCategoryList: readonly WorkCategory[] } = {
  workCategoryList: [
    {
      id: '1',
      code: 'A1',
      name: 'WC1',
    },
    {
      id: '2',
      code: 'B2',
      name: 'WC2',
    },
    {
      id: '3',
      code: 'C3',
      name: 'WC3',
    },
  ],
};
