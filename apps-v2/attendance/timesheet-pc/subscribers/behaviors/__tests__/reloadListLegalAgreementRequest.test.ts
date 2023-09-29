import configureMockStore from 'redux-mock-store';

import behavior from '../reloadListLegalAgreementRequest';
import UseCases from '@attendance/timesheet-pc/UseCases';

jest.mock('@attendance/timesheet-pc/UseCases');

const createStore = configureMockStore();

const defaultState = {
  common: {
    app: {
      error: null,
    },
    userSetting: {
      employeeId: 'employeeId',
    },
  },
};

type Input = Parameters<ReturnType<typeof behavior>>[0];

beforeEach(() => {
  jest.clearAllMocks();
});

it.each`
  useLegalAgreementMonthlyRequest | useLegalAgreementYearlyRequest
  ${false}                        | ${true}
  ${true}                         | ${false}
  ${true}                         | ${true}
`('should do.', async (workingType) => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)({
    employeeId: 'employeeId',
    timesheet: {
      endDate: '2022-02-28',
      workingTypeList: [workingType],
    },
  } as unknown as Input);

  // Assert
  expect(UseCases().fetchListLegalAgreementRequest).toHaveBeenCalledTimes(1);
  expect(UseCases().fetchListLegalAgreementRequest).toHaveBeenCalledWith({
    employeeId: 'employeeId',
    targetDate: '2022-02-28',
  });
  expect(store.getActions()).toMatchSnapshot();
});

it('should not do.', async () => {
  // Arrange
  const store = createStore(defaultState);

  // Act
  await behavior(store)({
    employeeId: 'employeeId',
    timesheet: {
      endDate: '2022-02-28',
      workingTypeList: [
        {
          useLegalAgreementMonthlyRequest: false,
          useLegalAgreementYearlyRequest: false,
        },
      ],
    },
  } as unknown as Input);

  // Assert
  expect(UseCases().fetchListLegalAgreementRequest).toHaveBeenCalledTimes(0);
  expect(store.getActions()).toMatchSnapshot();
});
