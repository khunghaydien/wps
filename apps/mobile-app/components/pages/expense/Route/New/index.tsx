import React from 'react';

import { Form, FormikErrors, FormikTouched } from 'formik';
import { cloneDeep, get, isEmpty } from 'lodash';
import moment from 'moment';

import msg from '../../../../../../commons/languages';
import { ErrorInfo } from '../../../../../../commons/utils/AppPermissionUtil';
import LikeInputButtonField from '../../../../molecules/commons/Fields/LikeInputButtonField';
import SFDateField from '../../../../molecules/commons/Fields/SFDateField';
import Navigation from '../../../../molecules/commons/Navigation';
import WrapperWithPermission from '../../../../organisms/commons/WrapperWithPermission';

import { CustomHint } from '../../../../../../domain/models/exp/CustomHint';
import { ExpenseTypeList } from '../../../../../../domain/models/exp/ExpenseType';
import { MAX_LENGTH_VIA_LIST } from '../../../../../../domain/models/exp/Record';

import { UI_TYPE } from '../../../../../modules/expense/pages/routeFormPage';

import Button from '../../../../atoms/Button';
import IconButton from '../../../../atoms/IconButton';
import TextButton from '../../../../atoms/TextButton';
import SearchStationField from '../../../../molecules/expense/SearchStationField';
import RouteOptions from './RouteOptions';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-route-form';

type RouteOriginArrivalValues = {
  category: string;
  company: string;
  name: string;
};

export type RouteFormValues = {
  arrival: RouteOriginArrivalValues;
  targetDate: string;
  expenseType: string;
  expenseTypeId: string;
  origin: RouteOriginArrivalValues;
  viaList: Array<any>;
  option: {
    routeSort: string;
    highwayBus: string;
    seatPreference: string;
    useChargedExpress: string;
    useExReservation: string;
  };
};

type RouteFormErrors = {
  targetDate: string;
  arrival: string;
  origin: string;
};

type Props = {
  status: any;
  values: RouteFormValues;
  errors: FormikErrors<RouteFormErrors>;
  touched: FormikTouched<RouteFormValues>;
  expenseTypeList: ExpenseTypeList;
  hasPermissionError: ErrorInfo | null;
  setStatus: (arg0: any) => void;
  setFieldValue: (key: string, value: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: Record<string, unknown> | boolean,
    arg2?: boolean
  ) => void;
  getStationSuggestion: (value: string, targetDate?: string) => void;
  handleSubmit: () => void;
  onClickBack: () => void;
  type: string;
  language: string;
  // Custom Hint
  activeHints: Array<string>;
  customHints: CustomHint;
  onClickHint: (arg0: string) => void;
  onClickSearchExpType: (routeFormValue: RouteFormValues) => void;
};

export default class RoutePage extends React.Component<Props> {
  onDeleteVia = (index: number) => {
    const viaList = [...this.props.values.viaList];
    const status = this.props.status || {};
    const viaListStatus = status.viaList || [];
    viaList.splice(index, 1);
    viaListStatus.splice(index, 1);
    this.props.setFieldValue('viaList', viaList);
    this.props.setStatus(status);
  };

  onClickReverseRoute = () => {
    const origin = this.props.values.origin;
    const arrival = this.props.values.arrival;
    const viaList = cloneDeep(this.props.values.viaList);
    this.props.setFieldValue('arrival', origin);
    this.props.setFieldValue('origin', arrival);
    if (!isEmpty(viaList)) {
      viaList.reverse();
      this.props.setFieldValue('viaList', viaList);
    }
  };

  getCustomHintProps = (fieldName: string, disabled?: boolean) => ({
    hintMsg: !disabled ? this.props.customHints[fieldName] : '',
    isShowHint: this.props.activeHints.includes(fieldName),
    onClickHint: () => this.props.onClickHint(fieldName),
  });

  handleDateChange = (e: any, data: any) => {
    const formattedDate = moment(data.date).format('YYYY-MM-DD');
    this.props.setFieldValue('targetDate', formattedDate);
    this.props.setFieldTouched('targetDate', true, false);
  };

  setFormikFieldValue(key: string) {
    return (value: any) => {
      this.props.setFieldValue(key, value);
    };
  }

  setValueForKey = (key: string) => {
    return (e: any) => {
      this.props.setFieldValue(key, e.target.value);
      this.props.setFieldTouched(key, true, false);
    };
  };

  addViaList = () => {
    const viaList = [...this.props.values.viaList, ''];
    this.props.setFieldValue('viaList', viaList);
  };

  searchRouteWithDate = (value: string) => {
    return this.props.getStationSuggestion(value, this.props.values.targetDate);
  };

  clickSearchExpType = (): void => {
    const { values, onClickSearchExpType } = this.props;
    onClickSearchExpType(values);
  };

  renderError = (key: string) => {
    const error = get(this.props.errors, key);
    const touched = get(this.props.touched, key);
    const status = get(this.props.status, key);

    if (error && touched) {
      return [msg()[error]];
    } else if (status) {
      return [status];
    } else {
      return [];
    }
  };

  render() {
    const isDisabled = this.props.values.targetDate === '';
    const hasBackBtn = [UI_TYPE.ADD, UI_TYPE.REPORT].includes(this.props.type);

    return (
      <WrapperWithPermission
        className={ROOT}
        hasPermissionError={this.props.hasPermissionError}
      >
        <Navigation
          backButtonLabel={msg().Com_Lbl_Back}
          onClickBack={hasBackBtn ? this.props.onClickBack : undefined}
          title={msg().Exp_Btn_Transit}
        />
        <Form className="main-content">
          <section className={`${ROOT}__date`}>
            <SFDateField
              required
              label={msg().Exp_Clbl_Date}
              value={this.props.values.targetDate}
              onChange={this.handleDateChange}
              errors={this.renderError('targetDate')}
              {...this.getCustomHintProps('recordDate')}
            />
          </section>

          <section className={`${ROOT}__expense-type`}>
            <LikeInputButtonField
              required
              disabled={isDisabled}
              label={msg().Exp_Clbl_ExpenseType}
              onClick={this.clickSearchExpType}
              placeholder={msg().Exp_Lbl_ExpenseTypeSelect}
              errors={this.renderError('expenseType')}
              type="button"
              value={this.props.values.expenseType}
              {...this.getCustomHintProps('recordExpenseType')}
            />
          </section>

          <div className={`${ROOT}__trip-container`}>
            <div className={`${ROOT}__route-container`}>
              <section className={`${ROOT}__origin`}>
                <SearchStationField
                  disabled={isDisabled}
                  label={msg().Exp_Lbl_DepartFrom}
                  initialValue={this.props.values.origin}
                  errors={this.renderError('origin.name')}
                  setFormikFieldValue={this.setFormikFieldValue('origin')}
                  searchRoute={this.searchRouteWithDate}
                />
              </section>

              <section className={`${ROOT}__via`}>
                {this.props.values.viaList &&
                  this.props.values.viaList.map((viaItem, index) => {
                    return (
                      <div
                        key={`via${this.props.values.viaList.length}${index}`}
                        className={`${ROOT}__via-station`}
                      >
                        <SearchStationField
                          disabled={isDisabled}
                          label={msg().Exp_Lbl_Via}
                          initialValue={get(
                            this.props.values,
                            `viaList.${index}`
                          )}
                          errors={this.renderError(`viaList.${index}.name`)}
                          setFormikFieldValue={this.setFormikFieldValue(
                            `viaList.${index}`
                          )}
                          searchRoute={this.searchRouteWithDate}
                        />
                        <IconButton
                          className={`${ROOT}__via-delete`}
                          icon="close-copy"
                          onClick={() => this.onDeleteVia(index)}
                        />
                      </div>
                    );
                  })}
                {this.props.values.viaList.length < MAX_LENGTH_VIA_LIST && (
                  <TextButton
                    disabled={isDisabled}
                    onClick={this.addViaList}
                    type="button"
                  >
                    {msg().Exp_Lbl_AddViaButton}
                  </TextButton>
                )}
              </section>

              <section className={`${ROOT}__arrival`}>
                <SearchStationField
                  disabled={isDisabled}
                  label={msg().Exp_Lbl_Destination}
                  initialValue={this.props.values.arrival}
                  errors={this.renderError('arrival.name')}
                  setFormikFieldValue={this.setFormikFieldValue('arrival')}
                  searchRoute={this.searchRouteWithDate}
                />
              </section>
            </div>
            <div className={`${ROOT}__route-reversal-container`}>
              <IconButton
                className={`${ROOT}__reversal-icon`}
                icon="sort-copy"
                onClick={this.onClickReverseRoute}
                disabled={isDisabled}
              />
            </div>
          </div>

          <section className={`${ROOT}__search-button`}>
            <Button
              priority="primary"
              variant="neutral"
              type="submit"
              onClick={this.props.handleSubmit}
            >
              {msg().Exp_Btn_RouteSearch}
            </Button>
          </section>

          <RouteOptions
            values={this.props.values}
            setValueForKey={this.setValueForKey}
          />
        </Form>
      </WrapperWithPermission>
    );
  }
}
