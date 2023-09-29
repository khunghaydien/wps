import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { Formik } from 'formik';
import _ from 'lodash';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import schema from '../../../schema/expenses/RouteFormSchema';
import { pushHistoryWithPrePage } from '@mobile/concerns/routingHistory';

import AppPermissionUtil from '../../../../commons/utils/AppPermissionUtil';

import { RECORD_TYPE } from '../../../../domain/models/exp/Record';
import { StationInfo } from '@apps/domain/models/exp/jorudan/Station';

import { State } from '../../../modules';
import {
  actions as routeOptionActions,
  defaultRouteOptionSetting,
} from '../../../modules/expense/pages/defaultRouteOptions';
import {
  actions as routeFormPageActions,
  UI_TYPE,
} from '../../../modules/expense/pages/routeFormPage';
import { actions as customHintUIActions } from '../../../modules/expense/ui/customHint/list';
import { actions as formValueAction } from '../../../modules/expense/ui/general/formValues';

import { getCustomHints } from '../../../action-dispatchers/expense/CustomHint';
import {
  getExpenseTypeById,
  getJorudanExpenseType,
} from '../../../action-dispatchers/expense/ExpenseType';
import { clearRouteResults } from '../../../action-dispatchers/expense/RouteSearch';
import {
  getStationSuggestion,
  searchStations,
} from '../../../action-dispatchers/expense/StationSearch';
import { getTaxTypeList } from '../../../action-dispatchers/expense/TaxType';

import NewRoutePage from '../../../components/pages/expense/Route/New';

type OwnProps = RouteComponentProps & {
  type?: string;
  recordId?: string;
  reportId?: string;
};

const RouteFormContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const activeHints = useSelector(
    (state: State) => state.expense.ui.customHint.list
  );
  const customHints = useSelector(
    (state: State) => state.expense.entities.customHint
  );
  const routeFormParams = useSelector(
    (state: State) => state.expense.pages.routeFormPage
  );
  const defaultRouteOptions = useSelector(
    (state: State) => state.expense.pages.defaultRouteOptions
  );
  const expenseTypeList = useSelector(
    (state: State) => state.expense.entities.expenseTypeList.records
  );
  const formValues = useSelector(
    (state: State) => state.expense.ui.general.formValues
  );
  const userSetting = useSelector((state: State) => state.userSetting);

  const { useExpense, employeeId, currencyId } = userSetting;

  const hasPermissionError = AppPermissionUtil.checkPermissionError(
    useExpense,
    employeeId,
    currencyId
  );

  useEffect(() => {
    if (isEmpty(customHints)) {
      dispatch(getCustomHints(userSetting.companyId));
    }
    if (defaultRouteOptions === null) {
      dispatch(routeOptionActions.search(userSetting.companyId));
    }
    if (ownProps.type === UI_TYPE.ADD) {
      const targetDate = get(formValues, 'recordDate', '');
      const expReportTypeId = get(formValues, 'reportTypeId');
      dispatch(
        getJorudanExpenseType(
          userSetting.companyId,
          targetDate,
          expReportTypeId
        )
      );
    }
  }, []);

  const onClickPushHistory = () => {
    const { history, reportId } = ownProps;
    let target = get(history, 'location.state.target');
    target = reportId ? 'report' : target;

    if (ownProps.type === UI_TYPE.ADD) {
      pushHistoryWithPrePage(history, '/expense/report/route/list', { target });
    } else if (ownProps.type === UI_TYPE.REPORT) {
      pushHistoryWithPrePage(
        history,
        `/expense/report/route/list/edit/${ownProps.recordId}/${ownProps.reportId}`,
        { target }
      );
    } else {
      pushHistoryWithPrePage(history, '/expense/route/list', { target });
    }
  };

  const onClickBack = () => {
    const { recordId, reportId } = ownProps;
    let target = get(ownProps.history, 'location.state.target');
    target = ownProps.reportId ? 'report' : target;

    if (ownProps.type === UI_TYPE.REPORT) {
      // from existing jorudan record under report
      ownProps.history.push(
        `/expense/record/jorudan-detail/${recordId}/${reportId}`,
        { target }
      );
    } else {
      // from add new jorudan to report
      dispatch(formValueAction.clear());
      ownProps.history.push(`/expense/report/detail/${formValues.reportId}`);
    }
  };

  const onClickSearchExpType = (routeFormValue) => {
    let target = get(ownProps.history, 'location.state.target');
    target = ownProps.reportId ? 'report' : target;
    // save form values to persist it when navigating back from expense type page
    dispatch(routeFormPageActions.save(routeFormValue));
    const path = `/expense/expense-type/list/${RECORD_TYPE.TransitJorudanJP}`;
    pushHistoryWithPrePage(ownProps.history, path, {
      target,
      recordId: ownProps.recordId,
    });
  };

  const generateInitialValues = () => {
    const routeOptions = defaultRouteOptions || defaultRouteOptionSetting;

    const initExpenseTypeId = get(formValues, 'items.0.expTypeId', '');
    const initReportId = get(formValues, 'reportId', '');
    const initRecordDate = get(formValues, 'recordDate', '');
    const initPaymentMethodId = get(formValues, 'paymentMethodId', null);

    return {
      empId: userSetting.employeeId,
      arrival: routeFormParams.arrival || {
        category: '',
        company: '',
        name: '',
      },
      targetDate: routeFormParams.targetDate || initRecordDate,
      expenseType: routeFormParams.expenseType || '',
      expenseTypeId: routeFormParams.expenseTypeId || initExpenseTypeId,
      option: routeFormParams.option || {
        routeSort: routeOptions.jorudanRouteSort,
        highwayBus: routeOptions.jorudanHighwayBus,
        seatPreference: routeOptions.jorudanSeatPreference,
        useChargedExpress: routeOptions.jorudanUseChargedExpress,
        useExReservation: routeOptions.jorudanUseExReservation,
        excludeCommuterRoute: true,
      },
      origin: routeFormParams.origin || {
        category: '',
        company: '',
        name: '',
      },
      paymentMethodId: routeFormParams.paymentMethodId || initPaymentMethodId,
      viaList: routeFormParams.viaList || [],
      reportId: initReportId,
    };
  };

  const handleSubmit = (values, { setValues, setStatus }) => {
    // reset custom errors for search result
    setStatus({});
    // make sure empty via is excluded.
    const filteredViaList = values.viaList.filter((via: StationInfo) =>
      via ? via.name : via
    );
    values.viaList = filteredViaList;

    // search stations with new param
    // @ts-ignore
    dispatch(searchStations(values)).then((result) => {
      setValues(result.param);
      if (isEmpty(result.errors)) {
        const { expenseTypeId, targetDate } = result.param;
        const recordExpType = get(formValues, 'items.0.expTypeId');
        const recordDate = get(formValues, 'recordDate');
        const isExpTypeChanged = recordExpType !== expenseTypeId;
        const isDateChanged = recordDate !== targetDate;
        const isUpdateTax =
          !!expenseTypeId && (isDateChanged || isExpTypeChanged);
        if (isUpdateTax) {
          dispatch(getTaxTypeList(expenseTypeId, targetDate));
        }
        dispatch(getExpenseTypeById(expenseTypeId, 'REPORT'));
        dispatch(routeFormPageActions.save(result.param));
        dispatch(clearRouteResults());
        onClickPushHistory();
      } else {
        setStatus(result.errors);
      }
    });
  };

  const Actions = bindActionCreators(
    {
      onClickHint: customHintUIActions.set,
      getStationSuggestion,
    },
    dispatch
  );

  return (
    <Formik
      enableReinitialize
      initialValues={generateInitialValues()}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {(props) => {
        return (
          <NewRoutePage
            language={userSetting.language}
            expenseTypeList={expenseTypeList}
            hasPermissionError={hasPermissionError}
            type={ownProps.type}
            status={props.status}
            values={props.values}
            errors={props.errors}
            touched={props.touched}
            setStatus={props.setStatus}
            setFieldValue={props.setFieldValue}
            setFieldTouched={props.setFieldTouched}
            handleSubmit={props.handleSubmit}
            getStationSuggestion={Actions.getStationSuggestion}
            onClickBack={onClickBack}
            activeHints={activeHints}
            customHints={customHints}
            onClickHint={Actions.onClickHint}
            onClickSearchExpType={onClickSearchExpType}
          />
        );
      }}
    </Formik>
  );
};

export default RouteFormContainer;
