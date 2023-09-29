import Api from '../../commons/api';

export default {
  updateIsOpenByDefault: (isOpen: boolean) =>
    Api.invoke({
      path: '/planner/track-summary-setting/update',
      param: { isTimeTrackSummaryOpenByDefault: isOpen },
    }),
};
