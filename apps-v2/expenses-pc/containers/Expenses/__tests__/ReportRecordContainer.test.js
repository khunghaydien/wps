// @flow
import React from 'react';
import { Provider } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';

import '@testing-library/jest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import '../../../action-dispatchers/__tests__/mocks/mockWindowObj';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import BaseCurrencyContainer from '../BaseCurrencyContainer';
import DialogContainer from '../DialogContainer';
import ForeignCurrencyContainer from '../ForeignCurrencyContainer';
import FormContainer from '../FormContainer';
import RecordItemContainer from '../RecordItemContainer';
import RecordListContainer from '../RecordListContainer';
import ReportSummaryContainer from '../ReportSummaryContainer';
import RouteFormContainer from '../RouteFormContainer';
import SuggestContainer from '../SuggestContainer';
import {
  mockTaxType1Jun,
  mockTaxType3Jun,
  mockTaxType10Jun,
} from './mocks/taxTypes';
import createStore from './store';
import state from './store/state';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

beforeEach(() => {
  ApiMock.reset();
  const api = {
    param: {
      employeeBaseId: 'a0W0o000015j11dEAA',
      targetDate: '2020-06-01',
      companyId: 'a0N0o00000bAGYfEAO',
    },
  };
  ApiMock.setDummyResponse('/cost-center/recently-used/list', api.param, {
    records: [],
  });
  ApiMock.setDummyResponse('/job/recently-used/list', api.param, {
    records: [],
  });
});

afterEach(cleanup);

const generateFormProps = (expReport) => ({
  recordList: RecordListContainer,
  recordItem: RecordItemContainer,
  reportSummary: ReportSummaryContainer,
  baseCurrency: BaseCurrencyContainer,
  foreignCurrency: ForeignCurrencyContainer,
  routeForm: RouteFormContainer,
  dialog: DialogContainer,
  suggest: SuggestContainer,
  disabled: false,
  mode: 'REPORT_SELECT',
  labelObject: jest.fn(),
  isReadOnlyApexPage: false,
  values: {
    report: {
      ...expReport,
    },
    ui: {
      isVendorRequired: false,
      isCostCenterRequired: false,
      isJobRequired: false,
      selectedAccountingPeriod: {},
      checkboxes: [],
      recordIdx: -1,
      recalc: false,
      saveMode: false,
    },
  },
});

const renderComponent = (store) => {
  const expReport = store.getState().ui.expenses.selectedExpReport;
  const formProps = generateFormProps(expReport);
  return mount(
    <Provider store={store}>
      <FormContainer {...formProps} />
    </Provider>
  );
};

// TODO complete record test cases EXP-4838

// describe('report record actions', () => {
//   it('record manually create', () => {});

//   it('link record from mobile', () => {});

//   it('create record from receipt', () => {});

//   it('create record from IC card transaction', () => {});

//   it('record single clone', () => {});

//   it('record multiple clone', () => {});

//   it('record clone to certain date', () => {});

//   it('record delete', () => {});
// });

// describe('report record navigation', () => {
//   it('record detail panel display', () => {});

//   it('record detail cancel editting', () => {});
// });

// describe('report record editting', () => {
//   it('record price change update report summary', () => {});

//   it('add record with foreign currency, price in record and report summary updated with base currency and foreign currency information', () => {});

//   it('record with multiple fixed amount selection, change amount, update price accordingly', () => {});
// });

const recordItemSelector = '.ts-expenses__form-records__list__item';

describe('report summary changes affect record', () => {
  const recordCostCenterSelector =
    '.ts-expenses__form-records__list__item__cost-center';
  const recordJobSelector = '.ts-expenses__form-records__list__item__job';
  const reportCostCenterSelector = `[data-testid="ts-expenses__form-report-summary__form__cost-center-input"]`;

  it('default cost center and job in record display as report summary chosed', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    const reportSummaryCC =
      store.getState().ui.expenses.selectedExpReport.costCenterName;
    const reportSummaryJob =
      store.getState().ui.expenses.selectedExpReport.jobName;
    const recordItem = expenseForm.find(recordItemSelector);
    expect(expenseForm.exists(recordItemSelector)).toBeTruthy();
    expect(recordItem.find(recordCostCenterSelector).text()).toEqual(
      reportSummaryCC
    );
    expect(recordItem.find(recordJobSelector).text()).toEqual(reportSummaryJob);
  });

  it("no cost center or job in record when report type doesn't use one", () => {
    const store = createStore();

    const mockNullJobCCReport = {
      ...store.getState().ui.expenses.selectedExpReport,
      jobId: null,
      jobCode: null,
      jobName: null,
      costCenterName: null,
      costCenterCode: null,
      expReportTypeName: 'Minimum Report',
      expReportTypeId: 'a0v0o00000nmi9TAAQ',
    };
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockNullJobCCReport,
        reportTypeList,
      },
    });
    const expenseForm = renderComponent(store);

    expect(expenseForm.exists(recordCostCenterSelector)).toBeFalsy();
    expect(expenseForm.exists(recordJobSelector)).toBeFalsy();
  });

  it('record changes cost center manually and remain the same even report summary changes cost center', async () => {
    const store = createStore();

    const recordDetail = cloneDeep(
      store.getState().ui.expenses.selectedExpReport.records[0].items[0]
    );
    const mockReport = cloneDeep(
      store.getState().ui.expenses.selectedExpReport
    );
    Object.assign(recordDetail, {
      costCenterName: 'mock record cc name',
      costCenterCode: 'mock record cc code',
      costCenterHistoryId: 'mock record cc histry id',
    });
    mockReport.records[0].items[0] = recordDetail;
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockReport,
        reportTypeList,
      },
    });
    const expenseForm = renderComponent(store);

    const recordItem = expenseForm.find(recordItemSelector);
    expect(
      expenseForm.find(reportCostCenterSelector).at(0).props().value
    ).toEqual('ANOTHER_COST_CENTER - Another Cost Center L0');
    expect(recordItem.find(recordCostCenterSelector).text()).toEqual(
      'mock record cc name'
    );

    // TODO change report type with default cost center, save ; test cost center record name remains same
    expenseForm
      .find('.commons-fields-dropdown-searchable__toggle-field')
      .simulate('click');

    expenseForm.update();
    expenseForm
      .find('Select.commons-fields-dropdown-searchable__search-field')
      .instance()
      .selectOption({
        label: 'CostCenter In Both',
        value: 'a0v0o00000nmi9QAAQ',
      });
  });
});

describe('tax type selection on record date change', () => {
  let expenseForm;
  const selectorTaxRate = 'select[data-testid="ts-expenses-taxRateArea"]';
  const store = createStore();
  const path = {
    job: '/job/recently-used/list',
    costCenter: '/cost-center/recently-used/list',
  };

  const response = { records: [] };

  beforeEach(() => {
    ApiMock.setDummyResponse(
      '/exp/tax-type/list',
      {
        expTypeId: 'a150o00000B4IExAAN',
        targetDate: '2020-06-01',
      },
      {
        taxTypes: mockTaxType1Jun,
      }
    );
    const param1 = {
      employeeBaseId: 'a0W0o000015j11dEAA',
      targetDate: '2020-06-01',
      companyId: 'a0N0o00000bAGYfEAO',
    };
    const param2 = {
      employeeBaseId: 'a0W0o000015j11dEAA',
      targetDate: '',
      companyId: 'a0N0o00000bAGYfEAO',
    };
    ApiMock.setDummyResponse(path.job, param1, response);
    ApiMock.setDummyResponse(path.costCenter, param1, response);
    ApiMock.setDummyResponse(path.job, param2, response);
    ApiMock.setDummyResponse(path.costCenter, param2, response);

    expenseForm = renderComponent(store);

    // Open Record
    expenseForm
      .find('.ts-expenses__form-records__list__item')
      .first()
      .simulate('click');
  });

  afterEach(cleanup);

  it('previous tax type valid on new date', async () => {
    ApiMock.setDummyResponse(
      '/exp/tax-type/list',
      {
        expTypeId: 'a150o00000B4IExAAN',
        targetDate: '2020-06-03',
      },
      {
        taxTypes: mockTaxType3Jun,
      }
    );
    const param1 = {
      employeeBaseId: 'a0W0o000015j11dEAA',
      targetDate: '2020-06-03',
      companyId: 'a0N0o00000bAGYfEAO',
    };
    const param2 = {
      employeeBaseId: 'a0W0o000015j11dEAA',
      targetDate: '',
      companyId: 'a0N0o00000bAGYfEAO',
    };
    ApiMock.setDummyResponse(path.job, param1, response);
    ApiMock.setDummyResponse(path.costCenter, param1, response);
    ApiMock.setDummyResponse(path.job, param2, response);
    ApiMock.setDummyResponse(path.costCenter, param2, response);

    // Open Popover
    expenseForm.find('.ts-record-date input').simulate('click');

    // Change Date
    expenseForm.find('div[aria-label="day-3"]').first().simulate('click');

    // 100ms wait for formik to update∏
    await delay(100);
    expenseForm.update();

    // assert that current is selected
    expect(expenseForm.find(selectorTaxRate).props().value).toBe(1);
  });

  it('previous tax type not valid on new date', async () => {
    ApiMock.setDummyResponse(
      '/exp/tax-type/list',
      {
        expTypeId: 'a150o00000B4IExAAN',
        targetDate: '2020-06-10',
      },
      {
        taxTypes: mockTaxType10Jun,
      }
    );
    const param1 = {
      employeeBaseId: 'a0W0o000015j11dEAA',
      targetDate: '2020-06-10',
      companyId: 'a0N0o00000bAGYfEAO',
    };
    const param2 = {
      employeeBaseId: 'a0W0o000015j11dEAA',
      targetDate: '',
      companyId: 'a0N0o00000bAGYfEAO',
    };
    ApiMock.setDummyResponse(path.job, param1, response);
    ApiMock.setDummyResponse(path.costCenter, param1, response);
    ApiMock.setDummyResponse(path.job, param2, response);
    ApiMock.setDummyResponse(path.costCenter, param2, response);

    // Open Popover
    expenseForm.find('.ts-record-date input').simulate('click');

    // Change Date
    expenseForm.find('div[aria-label="day-10"]').first().simulate('click');

    // 100ms wait for formik to update
    await delay(100);
    expenseForm.update();

    // assert that first is selected
    expect(expenseForm.find(selectorTaxRate).props().value).toBe(0);
  });
});
