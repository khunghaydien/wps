import Api from '@commons/api';

export default {
  fetch: (param?: { empId?: string }) =>
    Api.invoke({
      path: '/personal-setting/get',
      param: param || {},
    }),

  updateApprover: (param: { approverBase01Id?: string | null | undefined }) =>
    Api.invoke({
      path: '/personal-setting/update',
      param,
    }),
};
