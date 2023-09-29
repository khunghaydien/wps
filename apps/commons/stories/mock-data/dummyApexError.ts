import ApexError from '../../errors/ApexError';

// @ts-ignore
export default new ApexError({
  statusCode: 400,
  data: [
    {
      path: '/api/timesheet/get',
      param: {
        year: 2018,
        month: 9,
      },
    },
  ],
  action: 'RemoteApiController',
  message: 'Unpredicable Error',
  where: '....',
});
