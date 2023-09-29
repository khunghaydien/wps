export type ExtendedItem = {
  id: string;
  value: string;
  name: string;
  categoryType: string;
};

export const CategoryType = {
  ProjectBaseInfo: 'ProjectBaseInfo',
  ProjectOperation: 'ProjectOperation',
  ProjectFinancials: 'ProjectFinancials',
  ProjectPlanningOptions: 'ProjectPlanningOptions',
  ProjectNotificationSetting: 'ProjectNotificationSetting',
};
