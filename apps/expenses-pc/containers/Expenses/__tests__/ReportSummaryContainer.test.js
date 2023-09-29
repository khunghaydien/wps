// @flow
import React from 'react';
import { Provider } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';

import '@testing-library/jest-dom/extend-expect';
import { act, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import GlobalContainer from '../../../../commons/containers/GlobalContainer';

import { actions as expReportActions } from '../../../../domain/modules/exp/report';
import { actions as reportIdListActions } from '../../../modules/entities/reportIdList';

import '../../../action-dispatchers/__tests__/mocks/mockWindowObj';
import vendorDetail from '../../../action-dispatchers/__tests__/mocks/vendorDetail.mock';
import vendorList from '../../../action-dispatchers/__tests__/mocks/vendorList.mock';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import BaseCurrencyContainer from '../BaseCurrencyContainer';
import DialogContainer from '../DialogContainer';
import ExpensesContainer from '../ExpensesContainer';
import ForeignCurrencyContainer from '../ForeignCurrencyContainer';
import FormContainer from '../FormContainer';
import RecordItemContainer from '../RecordItemContainer';
import RecordListContainer from '../RecordListContainer';
import ReportListContainer from '../ReportListContainer';
import ReportSummaryContainer from '../ReportSummaryContainer';
import RouteFormContainer from '../RouteFormContainer';
import SuggestContainer from '../SuggestContainer';
import {
  costCenterRecentList,
  jobRecentList,
  reportList,
  reportWithEIValue,
} from './mocks/mock';
import createStore from './store';
import state from './store/state';

const mockIntersectionObserver = class {
  /* eslint-disable */
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeEach(() => {
  ApiMock.reset();
  window.IntersectionObserver = mockIntersectionObserver;
  const path = {
    job: '/job/recently-used/list',
    costCenter: '/cost-center/recently-used/list',
    vendor: '/exp/vendor/recently-used/list',
  };
  const api = {
    param1: {
      employeeBaseId: 'a0W0o000015j11dEAA',
      targetDate: '2020-06-01',
    },
    param2: {
      employeeBaseId: 'a0W0o000015j11dEAA',
    },
    param3: {
      employeeBaseId: 'a0W0o000015j11dEAA',
      isPersonalVendor: true,
    },
  };
  const response = { records: [] };
  ApiMock.setDummyResponse(path.costCenter, api.param1, response);
  ApiMock.setDummyResponse(path.job, api.param1, response);
  ApiMock.setDummyResponse(path.vendor, api.param2, response);
  ApiMock.setDummyResponse(path.vendor, api.param3, response);
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

const triggerReportTypeChange = (mountComponent, targetReportType) => {
  const dropdownToggleSelector =
    '.commons-fields-dropdown-searchable__toggle-field';
  const dropdownListSelector =
    'Select.commons-fields-dropdown-searchable__search-field';

  mountComponent.find(dropdownToggleSelector).simulate('click');
  mountComponent
    .find(dropdownListSelector)
    .instance()
    .selectOption(targetReportType);
  mountComponent.update();
  return mountComponent;
};

const generatePendingReport = (store) => ({
  ...store.getState().ui.expenses.selectedExpReport,
  reportId: 'a0w0o00000UAZmkAAH',
  reportNo: 'exp00000042',
  requestDate: '2020-07-29',
  requestId: 'a0u0o00000pPiurAAC',
  status: 'Pending',
});

describe('report summary', () => {
  it('report summary renders', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    expect(
      expenseForm.exists('.ts-expenses__form-report-summary')
    ).toBeTruthy();
  });
});

describe('report summary toggle', () => {
  it('summary pannel open', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    expect(
      expenseForm.exists('.ts-expenses__form-report-summary__form--open')
    ).toBeTruthy();
  });

  it('summary pannel close when click toggle', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    const toggle = expenseForm.find(
      '[testId="ts-expenses__form-report-summary__header-open-toggle"]'
    );
    toggle.simulate('click');
    expect(
      expenseForm.exists('.ts-expenses__form-report-summary__form--close')
    ).toBeTruthy();
  });
});

describe('report summary cost center', () => {
  const costCenterInputFieldSelector = `[data-testid="ts-expenses__form-report-summary__form__cost-center-input"]`;
  const costCenterSearchSelector = `[data-testid="ts-expenses__form-report-summary__form__cost-center-open-dialog"]`;
  const coseCenterClearSelector = `[data-testid="ts-expenses__form-report-summary__form__cost-center-clear"]`;

  it('saved cost center displays', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    expect(
      expenseForm.find(costCenterInputFieldSelector).at(0).props().value
    ).toEqual('ANOTHER_COST_CENTER - Another Cost Center L0');
  });

  it('cost center search dialog open', async () => {
    const store = createStore();
    const mockNullCCReport = {
      ...store.getState().ui.expenses.selectedExpReport,
      costCenterName: null,
      costCenterCode: null,
    };
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockNullCCReport,
        reportTypeList,
      },
    });
    const expenseForm = renderComponent(store);
    const api = {
      path: '/cost-center/recently-used/list',
      param: {
        employeeBaseId: 'a0W0o000015j11dEAA',
        targetDate: '2020-06-01',
      },
    };
    ApiMock.setDummyResponse(api.path, api.param, {
      records: costCenterRecentList,
    });

    await act(() =>
      expenseForm.find(costCenterSearchSelector).at(0).simulate('click')
    );
    await act(() => expenseForm.update());
    expect(expenseForm.exists('.ts-modal')).toBeTruthy();
    const firstItem = expenseForm.find('.commons-fixed-header-table-body-cell');

    firstItem.simulate('click');
    expenseForm.update();
    expect(
      expenseForm.find(costCenterInputFieldSelector).at(0).props().value
    ).toEqual(
      `${costCenterRecentList[0].code} - ${costCenterRecentList[0].name}`
    );
    expect(expenseForm.exists(coseCenterClearSelector)).toBeTruthy();
  });

  it('cost center is cleaned', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    expenseForm.find(coseCenterClearSelector).at(0).simulate('click');
    expect(
      expenseForm.find(costCenterInputFieldSelector).at(0).props().value
    ).toEqual('');
  });
});

describe('report summary job', () => {
  const jobInputFieldSelector = `[data-testid="ts-expenses__form-report-summary__form__job-input"]`;
  const jobSearchSelector = `[data-testid="ts-expenses__form-report-summary__form__job-open-dialog"]`;
  const jobClearSelector = `[data-testid="ts-expenses__form-report-summary__form__job-clear"]`;

  it('saved job displays', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    expect(expenseForm.find(jobInputFieldSelector).at(0).props().value).toEqual(
      'EXPENSE_JOB - Expense Job'
    );
  });

  it('job search dialog open', async () => {
    const store = createStore();
    const mockNullJobReport = {
      ...store.getState().ui.expenses.selectedExpReport,
      jobId: null,
      jobCode: null,
      jobName: null,
    };
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockNullJobReport,
        reportTypeList,
      },
    });
    const expenseForm = renderComponent(store);

    const api = {
      path: '/job/recently-used/list',
      param: {
        employeeBaseId: 'a0W0o000015j11dEAA',
        targetDate: '2020-06-01',
      },
    };
    ApiMock.setDummyResponse(api.path, api.param, { records: jobRecentList });

    await act(() =>
      expenseForm.find(jobSearchSelector).at(0).props().onClick()
    );
    await act(() => expenseForm.update());
    expect(expenseForm.exists('.ts-modal')).toBeTruthy();
    const firstItem = expenseForm.find('.commons-fixed-header-table-body-cell');

    firstItem.simulate('click');
    expenseForm.update();
    expect(expenseForm.find(jobInputFieldSelector).at(0).props().value).toEqual(
      `${jobRecentList[0].code} - ${jobRecentList[0].name}`
    );
    expect(expenseForm.exists(jobClearSelector)).toBeTruthy();
  });

  it('job is cleared', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    expect(expenseForm.find(jobInputFieldSelector).at(0).props().value).toEqual(
      'EXPENSE_JOB - Expense Job'
    );

    expenseForm.find(jobClearSelector).at(0).simulate('click');
    expenseForm.update();
    expect(expenseForm.find(jobInputFieldSelector).at(0).props().value).toEqual(
      ''
    );
  });
});

describe('report summary vendor', () => {
  let expenseForm;
  const vendorNameSelector = `[data-testid="ts-expenses__form-report-summary__form__vendor-input"]`;
  const selectBtnSelector = `[data-testid="ts-expenses__form-report-summary__form__vendor-open-dialog"]`;
  const clearBtnSelector = `[data-testid="ts-expenses__form-report-summary__form__vendor-clear"]`;

  it('if report type use vendor, should show select vendor button', () => {
    const store = createStore();
    expenseForm = renderComponent(store);
    // change to report type with vendor
    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'Vendor E',
      value: 'a0v0o00000pm6BRAAY',
    });

    // Assert
    const hasSelectButton = expenseForm.exists(selectBtnSelector);
    expect(hasSelectButton).toBeTruthy();
  });

  it('click the select button, should open vendor search dialog', async () => {
    const api = {
      path: '/exp/vendor/recently-used/list',
      param: { employeeBaseId: 'a0W0o000015j11dEAA', isPersonalVendor: false },
      response: vendorList,
    };
    ApiMock.setDummyResponse(api.path, api.param, api.response);
    const selectButton = expenseForm.find(selectBtnSelector);
    await selectButton.at(0).props().onClick();
    expenseForm.update();

    // Assert
    const isDialogOpen = expenseForm.exists(
      '.commons-fixed-header-table-body-row'
    );
    expect(isDialogOpen).toBeTruthy();
  });

  it('select vendor item from dialog, vendor field in report summary should be updated', () => {
    const vendorDialog = expenseForm.find('.ts-expenses-modal-vendor-dialog');
    const firstItem = vendorDialog
      .find('.commons-fixed-header-table-body-row')
      .first();
    firstItem.simulate('click');
    expenseForm.update();

    // Assert
    const vendorField = expenseForm.find(vendorNameSelector);
    const hasClearBtn = expenseForm.exists(clearBtnSelector);
    expect(vendorField.at(0).props().value).toEqual(
      `${vendorList.records[0].code} - ${vendorList.records[0].name}`
    );
    expect(hasClearBtn).toBeTruthy();
  });

  it('click vendor view detail, will open vendor detail modal', () => {
    const api = {
      path: '/exp/vendor/search',
      param: { id: 'id01' },
      response: vendorDetail,
    };
    ApiMock.setDummyResponse(api.path, api.param, api.response);
    const viewBtn = expenseForm.find(
      '.ts-expenses__form-report-summary__form__vendor-btn--viewDetail'
    );
    viewBtn.hostNodes().simulate('click'); // hostNodes to resolve the issue that multiple nodes are found
    expenseForm.update();

    // Assert
    const isModalOpen = expenseForm.exists(
      '.ts-expenses-vendor-detail-wrapper'
    );
    expect(isModalOpen).toBeTruthy();
  });

  it('click clear btn, vendor is cleared', () => {
    const clearBtn = expenseForm.find(clearBtnSelector);
    clearBtn.hostNodes().simulate('click');
    expenseForm.update();

    // Assert
    const vendorField = expenseForm.find(vendorNameSelector);
    expect(vendorField.at(0).props().value).toEqual('');
  });
});

describe('report type', () => {
  const reportTypeSelector =
    '.ts-expenses__form-report-summary__form__report-type-input-selection';
  const costCenterInputFieldSelector =
    '[data-testid="ts-expenses__form-report-summary__form__cost-center-input"]';
  const eiText =
    '[data-testid="ts-expenses__form-report-summary__form__text-1"]';
  const eiSelect =
    '[data-testid="ts-expenses__form-report-summary__form__select-10"]';
  const eiDate =
    '[data-testid="ts-expenses__form-report-summary__form__ei-date-20"]';
  const eiLookUp =
    '[data-testid="ts-expenses__form-report-summary__form-lookup-30"]';

  it('saved report type display', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    expect(expenseForm.find(reportTypeSelector).text()).toEqual('report 1');
  });

  it("report type updates when it's changed", () => {
    const store = createStore();
    let expenseForm = renderComponent(store);

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'Minimum Report',
      value: 'a0v0o00000nmi9TAAQ',
    });

    expect(expenseForm.find(reportTypeSelector).text()).toEqual(
      'Minimum Report'
    );
  });

  it('cost center field hides switching to report type without cc', () => {
    const store = createStore();
    let expenseForm = renderComponent(store);
    const costCenterInputSelector =
      '.ts-expenses__form-report-summary__form__cost-center-input';

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'Minimum Report',
      value: 'a0v0o00000nmi9TAAQ',
    });

    expect(expenseForm.exists(costCenterInputSelector)).toBeFalsy();
  });

  it('report type changes update CC as default setting', () => {
    const store = createStore();
    let expenseForm = renderComponent(store);
    expect(
      expenseForm.find(costCenterInputFieldSelector).at(0).props().value
    ).toEqual('ANOTHER_COST_CENTER - Another Cost Center L0');

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'CostCenter In Both',
      value: 'a0v0o00000nmi9QAAQ',
    });

    expect(expenseForm.find(reportTypeSelector).text()).toEqual(
      'CostCenter In Both'
    );
    expect(
      expenseForm.find(costCenterInputFieldSelector).at(0).props().value
    ).toEqual('DEFAULT_COST_CENTER - Default Cost Center L0');
  });

  it('report type changes remains manually changed CC', () => {
    const store = createStore();
    const mockManuallyChangedCCReport = {
      ...store.getState().ui.expenses.selectedExpReport,
      costCenterName: 'test cost center manually',
      costCenterCode: 'test demo id',
      isCostCenterChangedManually: true,
    };
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockManuallyChangedCCReport,
        reportTypeList,
      },
    });
    let expenseForm = renderComponent(store);

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'CostCenter In Both',
      value: 'a0v0o00000nmi9QAAQ',
    });

    expect(expenseForm.find(reportTypeSelector).text()).toEqual(
      'CostCenter In Both'
    );
    expect(
      expenseForm.find(costCenterInputFieldSelector).at(0).props().value
    ).toEqual('test demo id - test cost center manually');
  });

  // TODO add default job test case
  // it('report type changes update job', () => {});

  it('report type changes update extended item display', () => {
    const store = createStore();
    let expenseForm = renderComponent(store);
    expect(expenseForm.exists(eiText)).toBeFalsy();
    expect(expenseForm.exists(eiSelect)).toBeFalsy();
    expect(expenseForm.exists(eiLookUp)).toBeFalsy();
    expect(expenseForm.exists(eiDate)).toBeFalsy();

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'Minimum Report',
      value: 'a0v0o00000nmi9TAAQ',
    });

    expect(expenseForm.exists(eiText)).toBeTruthy();
    expect(expenseForm.exists(eiSelect)).toBeTruthy();
    expect(expenseForm.exists(eiLookUp)).toBeTruthy();
    expect(expenseForm.exists(eiDate)).toBeTruthy();
  });
});

describe('extended item', () => {
  const reportTypeSelector =
    '.ts-expenses__form-report-summary__form__report-type-input-selection';
  const eiText =
    'textarea[data-testid="ts-expenses__form-report-summary__form__text-1"]';
  const eiSelect =
    '[data-testid="ts-expenses__form-report-summary__form__select-10"]';
  const eiDate =
    '[data-testid="ts-expenses__form-report-summary__form__ei-date-20"]';
  const eiLookUp =
    '[data-testid="ts-expenses__form-report-summary__form-lookup-30"]';
  const jobInputFieldSelector = `[data-testid="ts-expenses__form-report-summary__form__job-input"]`;

  it('extended item displays with default value', async () => {
    const store = createStore();
    let expenseForm = renderComponent(store);

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'Minimum Report',
      value: 'a0v0o00000nmi9TAAQ',
    });

    expect(expenseForm.exists(eiText)).toBeTruthy();
    expect(expenseForm.find(eiText).instance().value).toEqual(
      '--Default 02 Text --'
    );
    expect(expenseForm.exists(eiSelect)).toBeTruthy();
    expect(
      expenseForm
        .find(
          '[data-testid="ts-expenses__form-report-summary__form__select-10"] select'
        )
        .props().value
    ).toBe('');
    expect(expenseForm.exists(eiLookUp)).toBeTruthy();
    expect(expenseForm.find(eiLookUp).text()).toEqual('Select');
    expect(expenseForm.exists(eiDate)).toBeTruthy();
  }, 30000);

  it('extended item takeover value', async () => {
    const store = createStore();
    let expenseForm = renderComponent(store);

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'Job In Both',
      value: 'a0v0o00000nmi9LAAQ',
    });

    expect(expenseForm.find(jobInputFieldSelector).at(0).props().value).toEqual(
      'EXPENSE_JOB - Expense Job'
    );
    expect(expenseForm.find(reportTypeSelector).text()).toEqual('Job In Both');
    expect(expenseForm.find(eiText).instance().value).toEqual(
      '--Default 02 Text --'
    );

    expenseForm
      .find(eiText)
      .simulate('change', { target: { value: 'text changed' } });
    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'Minimum Report',
      value: 'a0v0o00000nmi9TAAQ',
    });

    expect(expenseForm.find(reportTypeSelector).text()).toEqual(
      'Minimum Report'
    );
    expect(expenseForm.find(eiText).instance().value).toEqual('text changed');
    expect(
      expenseForm.exists(
        '.ts-expenses__form-report-summary__form__job-input-field'
      )
    ).toBeFalsy();
  });

  it('lookup ei can clear', () => {
    const store = createStore();
    const mockEIReport = reportWithEIValue;
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockEIReport,
        reportTypeList,
      },
    });
    const expenseForm = renderComponent(store);
    expect(expenseForm.find(eiLookUp).text()).toEqual(
      'Custom-0-Option-0 - Custom-0custom option0 L0'
    );

    expenseForm
      .find(
        'button.ts-expenses__form-report-summary__form__ei-lookup-input-btn--clear'
      )
      .simulate('click');

    expect(expenseForm.find(eiLookUp).text()).toEqual('Select');
  });

  it('lookup ei can select', async () => {
    const store = createStore();
    const mockEIReport = reportWithEIValue;
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockEIReport,
        reportTypeList,
      },
    });
    const api = {
      path: '/extended-item-custom-option/recently-used/list',
      param: {
        activeOnly: true,
        employeeBaseId: 'a0W0o000015j11dEAA',
        extendedItemCustomId: 'a0a0o00000YhidpAAB',
        extendedItemLookupId: 'a0b0o00000OrsnXAAR',
      },
    };
    ApiMock.mockImplement(api.path, [
      [api.param, { records: [], hasMore: false }],
    ]);
    const expenseForm = renderComponent(store);
    expect(
      expenseForm
        .find(
          '[data-testid="ts-expenses__form-report-summary__form-lookup-31"]'
        )
        .text()
    ).toEqual('Select');
    const searchButton = expenseForm.find(
      '[data-testid="ts-expenses__form-report-summary__form-lookup-31"] Button button'
    );

    await searchButton.props().onClick();
    expenseForm.update();

    expect(ApiMock.invoke).toHaveBeenCalledWith(api);
    expect(
      expenseForm.exists('.ts-expenses-modal-lookup-dialog__dialog-frame')
    ).toBeTruthy();
  });

  it('ei required', async () => {
    const store = createStore();
    let expenseForm = renderComponent(store);

    // switch to report type with compulsory extended item
    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'Job In Both',
      value: 'a0v0o00000nmi9LAAQ',
    });

    // check compulsory icon
    const textComponent2 = expenseForm
      .find('.ts-expenses__form-report-summary__form.slds-grid div.slds-col')
      .at(1);
    expect(textComponent2.exists('.is-required')).toBeTruthy();
    expect(textComponent2.find('.is-required').text().trim()).toEqual('*');
    expect(textComponent2.find('textarea').text()).toEqual(
      '--Default 02 Text --'
    );
  });
});

describe('navigation', () => {
  const reportSummarySelector = '.ts-expenses__form-report-summary';
  const reportListSelector = '.ts-expenses__reports-list';
  const api = {
    path: '/exp/report-type/search',
    param: {
      companyId: 'a0N0o00000bAGYfEAO',
      empId: 'a0W0o000015j11dEAA',
      endDate: '2024-05-31',
      startDate: '2021-01-01',
      usedIn: '',
      withExpTypeName: false,
      active: null,
      id: undefined,
      includeLinkedExpenseTypeIds: undefined,
      active: null,
    },
  };

  it('back to report list panel clicking back to list', () => {
    const store = createStore();
    const expReport = store.getState().ui.expenses.selectedExpReport;
    const formProps = generateFormProps(expReport);
    const expense = mount(
      <Provider store={store}>
        <ExpensesContainer>
          <ReportListContainer />
          <FormContainer {...formProps} />
        </ExpensesContainer>
      </Provider>
    );
    const backButtonSelector =
      'button.ts-finance-approval-sub-header-pager__back-btn';
    expect(expense.exists(reportSummarySelector)).toBeTruthy();

    ApiMock.setDummyResponse(api.path, api.param, { records: [] });
    expense.find(backButtonSelector).simulate('click');

    expect(expense.exists(reportListSelector)).toBeTruthy();
    expect(expense.exists(reportSummarySelector)).toBeFalsy();
  });

  it('open confirm dialog clicking close for an editted report', () => {
    const store = createStore();
    const expReport = store.getState().ui.expenses.selectedExpReport;
    const formProps = generateFormProps(expReport);
    const expense = mount(
      <Provider store={store}>
        <GlobalContainer>
          <ExpensesContainer>
            <ReportListContainer />
            <FormContainer {...formProps} />
          </ExpensesContainer>
        </GlobalContainer>
      </Provider>
    );
    const remarkSelector =
      'textarea[data-testid="ts-expenses__form-report-summary__form__remarks"]';
    const confirmDialogSelector = '.commons-dialogs-confirm-dialog';
    const confirmButtonSelector =
      'button[id="commons-dialogs-confirm-dialog__ok-button"]';
    const backButtonSelector =
      'button.ts-finance-approval-sub-header-pager__back-btn';

    expense
      .find(remarkSelector)
      .simulate('change', { target: { value: 'test remark' } });

    expect(expense.exists(reportSummarySelector)).toBeTruthy();
    ApiMock.setDummyResponse(api.path, api.param, { records: [] });
    expense.find(backButtonSelector).simulate('click');
    expense.update();
    expect(expense.exists(confirmDialogSelector)).toBeTruthy();

    expense.find(confirmButtonSelector).simulate('click');

    expect(expense.exists(reportListSelector)).toBeTruthy();
    expect(expense.exists(reportSummarySelector)).toBeFalsy();
  });
});

describe('file attachment', () => {
  const attachementSelector =
    '.ts-expenses__form-report-summary__actions__attach';
  const addFileSelector =
    '.ts-expenses__form-report-summary__actions__add_file';

  it("file attachment displays according to report type's usesage of file attachment", () => {
    const store = createStore();
    let expenseForm = renderComponent(store);
    expect(expenseForm.exists(attachementSelector)).toBeFalsy();

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'FileAttachment',
      value: 'a0v0o00000nmvTFAAY',
    });

    expect(expenseForm.exists(attachementSelector)).toBeTruthy();
  });

  it('open receipt library dialog and click add file, receipt library dialog displays', async () => {
    const receiptLibrarySelector =
      '.ts-expenses-modal-receipt-library__dialog-frame';
    const store = createStore();
    let expenseForm = renderComponent(store);

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'FileAttachment',
      value: 'a0v0o00000nmvTFAAY',
    });
    expenseForm.find(attachementSelector).simulate('click');
    expenseForm.update();
    expenseForm.find(addFileSelector).simulate('click');

    ApiMock.setDummyResponse(
      '/exp/receipt/list',
      { type: 'Receipt', withOcrInfo: false },
      {
        files: [
          {
            contentDocumentId: '0690o00000D6iPkAAJ',
            contentVersionId: '0680o00000DR5aRAAT',
            createdDate: '28-05-2020 23:22:44',
            fileExtension: 'pdf',
            fileType: 'PDF',
            ocrInfo: null,
            title: 'Receipt_dummyPDF',
          },
        ],
      }
    );

    expect(ApiMock.invoke).toHaveBeenCalledWith({
      path: '/exp/receipt/list',
      param: { type: 'Receipt', withOcrInfo: false },
    });
    expect(expenseForm.exists(receiptLibrarySelector)).toBeTruthy();
  });

  it('clear selected attachment', () => {
    const attachedFileSelector =
      '.ts-expenses__form-report-summary__actions__attached_item-name';
    const clearAttachmentSelector =
      '.ts-expenses__form-report-summary__actions__item_delete';
    const attachmentCountSelector =
      '.ts-expenses__form-report-summary__actions__attach-count';
    const store = createStore();
    const mockAttachmentReport = {
      ...store.getState().ui.expenses.selectedExpReport,
      attachedFileList: [
        {
          attachedFileVerId: '0680o00000E8Ll7AAF',
          attachedFileName: 'Receipt_ConsentLetter',
          attachedFileId: '0690o00000DjhM9AAJ',
          attachedFileExtension: 'pdf',
          attachedFileDataType: 'PDF',
          attachedFileCreatedDate: '06-07-2020 06:01:04',
        },
      ],
      useFileAttachment: true,
      expReportTypeName: 'FileAttachment',
      expReportTypeId: 'a0v0o00000nmvTFAAY',
    };
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockAttachmentReport,
        reportTypeList,
      },
    });
    const expenseForm = renderComponent(store);

    // display attachement count
    expect(expenseForm.exists(attachmentCountSelector)).toBeTruthy();
    expect(expenseForm.find(attachmentCountSelector).text()).toEqual('1');

    expenseForm.find(attachementSelector).simulate('click');
    expenseForm.update();

    // display attached file name
    expect(expenseForm.exists(attachedFileSelector)).toBeTruthy();
    expect(expenseForm.find(attachedFileSelector).text()).toEqual(
      'ConsentLetter.pdf'
    );

    expenseForm.find(clearAttachmentSelector).children().props().onClick();
    expenseForm.update();

    // clear attached file
    expect(expenseForm.exists(attachmentCountSelector)).toBeFalsy();
    expect(expenseForm.exists(attachedFileSelector)).toBeFalsy();
  });
});

describe('actions', () => {
  const actionListToggleSelector =
    'button.ts-expenses__form-report-summary__actions__toggle';
  const reportSummarySelector = '.ts-expenses__form-report-summary';
  const reportListSelector = '.ts-expenses__reports-list';

  it('save report summary', async () => {
    const store = createStore();
    store.dispatch({
      type: 'MODULES/MODE/REPORT_EDIT',
      payload: 'REPORT_EDIT',
    });
    const param = cloneDeep(store.getState().ui.expenses.selectedExpReport);
    param.empId = 'a0W0o000015j11dEAA';
    delete param.records;
    const api = {
      path: '/exp/report/save',
      param,
    };
    ApiMock.setDummyResponse(api.path, api.param);
    const expenseForm = renderComponent(store);
    const saveButton = expenseForm.find(
      'button.ts-expenses__form-report-summary__actions__save'
    );

    await act(() => saveButton.props().onClick());

    expect(ApiMock.invoke).toHaveBeenCalledWith(api);
  }, 30000);

  it('close report', async () => {
    const api = {
      path: '/exp/report-type/search',
      param: {
        companyId: 'a0N0o00000bAGYfEAO',
        empId: 'a0W0o000015j11dEAA',
        endDate: '2024-05-31',
        startDate: '2021-01-01',
        usedIn: '',
        withExpTypeName: false,
        active: null,
        id: undefined,
        includeLinkedExpenseTypeIds: undefined,
        active: null,
      },
    };
    const store = createStore();
    const expReport = store.getState().ui.expenses.selectedExpReport;
    const formProps = generateFormProps(expReport);
    const expense = mount(
      <Provider store={store}>
        <ExpensesContainer>
          <ReportListContainer />
          <FormContainer {...formProps} />
        </ExpensesContainer>
      </Provider>
    );
    const closeButtonSelector =
      'button.ts-expenses__form-report-summary__actions__close';
    expect(expense.exists(reportSummarySelector)).toBeTruthy();

    ApiMock.setDummyResponse(api.path, api.param, { records: [] });
    expense.find(closeButtonSelector).simulate('click');

    expect(expense.exists(reportListSelector)).toBeTruthy();
    expect(expense.exists('.ts-expenses__form')).toBeFalsy();
  });

  it('clone', async () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    const cloneButtonSeletor =
      'button.ts-expenses__form-report-summary__actions__clone';

    const mockClonedReportInfo = cloneDeep(reportList[0]);
    mockClonedReportInfo.subject = 'Copy of report with CC and job';
    mockClonedReportInfo.reportId = 'mockid';
    const mockClonedReport = cloneDeep(
      store.getState().ui.expenses.selectedExpReport
    );
    mockClonedReport.subject = 'Copy of report with CC and job';
    mockClonedReport.reportId = 'mockid';

    reportIdListActions.list = jest.fn().mockResolvedValue({
      type: 'MODULES/ENTITIES/REPORT_ID_LIST/LIST_SUCCESS',
      payload: {
        totalSize: 1,
        reportIdList: ['a0w0o00000UAZmkAAH', 'mockid'],
      },
    });
    expReportActions.list = jest.fn().mockResolvedValue({
      type: 'MODULES/ENTITIES/EXP/REPORT/LIST_SUCCESS',
      payload: {
        reports: [mockClonedReportInfo, ...reportList],
      },
    });
    expReportActions.get = jest.fn().mockResolvedValue({
      type: 'MODULES/ENTITIES/EXP/REPORT/GET_SUCCESS',
      payload: { ...mockClonedReport },
    });
    const api = {
      path: '/exp/report/clone',
      param: { empId: 'a0W0o000015j11dEAA', reportId: 'a0w0o00000UAQqwAAH' },
    };
    ApiMock.setDummyResponse(api.path, api.param, { reportId: 'mockid' });

    expenseForm.find(actionListToggleSelector).simulate('click');

    expect(expenseForm.exists(cloneButtonSeletor)).toBeTruthy();
    await act(() => expenseForm.find(cloneButtonSeletor).simulate('click'));
    await act(() => expenseForm.update());
    expect(ApiMock.invoke).toHaveBeenCalledWith(api);
    // TODO issue with process with jest function inside Promise
    // expect(
    //   expenseForm
    //     .find('textarea.ts-expenses__form-report-summary__header-input')
    //     .text()
    // ).toEqual('Copy of report with CC and job');
  }, 30000);

  it('print', async () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    const printButtonSelector =
      'button.ts-expenses__form-report-summary__actions__print';
    global.open = jest.fn();
    expenseForm.find(actionListToggleSelector).simulate('click');
    expect(expenseForm.exists(printButtonSelector)).toBeTruthy();

    expenseForm.find(printButtonSelector).simulate('click');
    expect(global.open).toBeCalled();
  }, 30000);

  it('submit call attendance check first and display approval dialog', async () => {
    const store = createStore();
    ApiMock.setDummyResponse(
      '/att/working-days/check',
      { empId: 'a0W0o000015j11dEAA', targetDates: ['2020-06-01'] },
      { records: [{}] }
    );
    ApiMock.setDummyResponse(
      '/exp/report/fix-file',
      { reportId: 'a0w0o00000UAQqwAAH' },
      {
        isSuccess: true,
        result: {},
      }
    );
    const expenseForm = renderComponent(store);
    const submitButton = expenseForm.find(
      'button.ts-expenses__form-report-summary__actions__submit'
    );

    await act(() => submitButton.props().onClick());
    await act(() => expenseForm.update());

    expect(ApiMock.invoke).toHaveBeenCalled();
    expect(
      expenseForm.exists('.ts-expenses-modal-approval__dialog-frame')
    ).toBeTruthy();
  }, 30000);

  it('request submit', async () => {
    const store = createStore();
    store.dispatch({
      type: 'MODULES/DIALOG/ACTIVE_DIALOG/APPROVAL',
      payload: 'APPROVAL',
    });
    const expenseForm = renderComponent(store);
    const api = {
      path: '/exp/request/report/submit',
      param: {
        reportId: 'a0w0o00000UAQqwAAH',
        comment: '',
        empId: 'a0W0o000015j11dEAA',
      },
    };
    const requestButton = expenseForm.find(
      '[data-testid="ts-expenses-modal-approval-main"]'
    );

    await act(() => requestButton.at(0).simulate('click'));

    ApiMock.setDummyResponse(api.path, api.param, {
      isSuccess: true,
      result: {},
    });
    expect(ApiMock.invoke).toHaveBeenCalledWith(api);
  }, 30000);

  it('recall', async () => {
    const store = createStore();
    const mockPendingReport = generatePendingReport(store);
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockPendingReport,
        reportTypeList,
      },
    });
    store.dispatch({
      type: 'MODULES/DIALOG/ACTIVE_DIALOG/CANCEL_REQUEST',
      payload: 'CANCEL',
    });
    const expenseForm = renderComponent(store);
    const recallButton = expenseForm.find(
      '[data-testid="ts-expenses-modal-approval-main"]'
    );
    expect(
      expenseForm.exists('[data-testid="ts-expenses-modal-approval-main"]')
    ).toBeTruthy();

    await act(() => recallButton.at(0).simulate('click'));

    ApiMock.setDummyResponse(
      '/exp/request/report/cancel-request',
      { requestId: 'a0u0o00000pPiurAAC', comment: '' },
      { isSuccess: true, result: {} }
    );
    expect(ApiMock.invoke).toHaveBeenCalled();
  }, 30000);

  it('approval history', async () => {
    const store = createStore();
    const mockPendingReport = generatePendingReport(store);
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockPendingReport,
        reportTypeList,
      },
    });
    const expenseForm = renderComponent(store);

    expenseForm.find(actionListToggleSelector).simulate('click');
    const ahButton = expenseForm.find(
      'button.ts-expenses__form-report-summary__actions__approval-history'
    );
    ahButton.simulate('click');

    expect(ApiMock.invoke).toHaveBeenCalledWith({
      path: '/exp/request/history/get',
      param: { requestId: 'a0u0o00000pPiurAAC' },
    });
  }, 30000);

  it('edit history', async () => {
    const store = createStore();
    const mockPendingReport = generatePendingReport(store);
    const reportTypeList = state.entities.exp.expenseReportType.list.active;
    store.dispatch({
      type: 'MODULES/UI/EXPENSES/SELECTED_EXP_REPORT/SELECT',
      payload: {
        target: mockPendingReport,
        reportTypeList,
      },
    });
    const expenseForm = renderComponent(store);

    expenseForm.find(actionListToggleSelector).simulate('click');
    const ehButton = expenseForm.find(
      'button.ts-expenses__form-report-summary__actions__edit-history'
    );
    ehButton.simulate('click');

    expect(ApiMock.invoke).toHaveBeenCalledWith({
      path: '/exp/finance-approval/report/history/get',
      param: { requestId: 'a0u0o00000pPiurAAC' },
    });
  });

  it('delete', async () => {
    const store = createStore();
    const expReport = store.getState().ui.expenses.selectedExpReport;
    const formProps = generateFormProps(expReport);
    const expense = mount(
      <Provider store={store}>
        <GlobalContainer>
          <ExpensesContainer>
            <ReportListContainer />
            <FormContainer {...formProps} />
          </ExpensesContainer>
        </GlobalContainer>
      </Provider>
    );
    const deleteButtonSelector =
      'button.ts-expenses__form-report-summary__actions__delete';
    const confirmDialogSelector = '.commons-dialogs-confirm-dialog';
    const confirmButton =
      'button[id="commons-dialogs-confirm-dialog__ok-button"]';

    expense.find(actionListToggleSelector).simulate('click');
    expect(expense.exists(deleteButtonSelector)).toBeTruthy();
    expense.find(deleteButtonSelector).simulate('click');
    expense.update();

    expect(expense.exists(confirmDialogSelector)).toBeTruthy();
    ApiMock.setDummyResponse(
      '/exp/report/delete',
      { reportId: 'a0w0o00000UAZmkAAH' },
      { isSuccess: true, result: {} }
    );
    reportIdListActions.list = jest.fn().mockResolvedValue({
      type: 'MODULES/ENTITIES/REPORT_ID_LIST/LIST_SUCCESS',
      payload: {
        totalSize: 1,
        reportIdList: ['a0w0o00000UAZmkAAH'],
      },
    });
    expReportActions.list = jest.fn().mockResolvedValue({
      type: 'MODULES/ENTITIES/EXP/REPORT/LIST_SUCCESS',
      payload: {
        reports: reportList,
      },
    });

    await act(() => expense.find(confirmButton).simulate('click'));

    await act(() => expense.update());
    expect(ApiMock.invoke).toHaveBeenCalledWith({
      path: '/exp/report/delete',
      param: { reportId: 'a0w0o00000UAQqwAAH' },
    });
    expect(expense.exists(reportSummarySelector)).toBeFalsy();
  }, 30000);
});

describe('link custom request', () => {
  const customRequestSelector =
    'button.ts-expenses__form-report-summary__actions-custom-request__select-btn';

  it('link custom request displays if a report type uses Custom Request Link', () => {
    const store = createStore();
    const expenseForm = renderComponent(store);
    expect(expenseForm.exists(customRequestSelector)).toBeTruthy();
  });

  it("link custom request hides when switch to a report type doesn't use Custom Request Link", () => {
    const store = createStore();
    let expenseForm = renderComponent(store);

    expenseForm = triggerReportTypeChange(expenseForm, {
      label: 'Vendor E',
      value: 'a0v0o00000pm6BRAAY',
    });

    expect(expenseForm.exists(customRequestSelector)).toBeFalsy();
  });

  it('open custom request dialog clicking button', async () => {
    const store = createStore();
    const expenseForm = renderComponent(store);

    // TODO replace mockReturnValue with jest fn
    // Note keep test case with mockReturnValue last due to overwrites behavior. Refer to ApiMock.js
    ApiMock.mockReturnValue({
      '/general-request/record-type/list': { records: [] },
      '/employee/search': { records: [] },
      '/general-request/search': { records: [] },
    });
    expenseForm.find(customRequestSelector).simulate('click');
    await act(() => expenseForm.update());

    expect(
      expenseForm.exists('.ts-expenses-modal-custom-request__dialog-frame')
    ).toBeTruthy();

    // TODO select custom request and test open request
  });
});
