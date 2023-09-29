import React, { ChangeEvent, useEffect, useState } from 'react';
// @ts-ignore
import { RouterHistory } from 'react-router-dom';

import classNames from 'classnames';
import { Form } from 'formik';
import get from 'lodash/get';

import RouteMap from '@commons/components/exp/Form/RecordItem/TransitJorudanJP/RouteMap';
import usePrevious from '@commons/hooks/usePrevious';
import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';
import FormatUtil from '@commons/utils/FormatUtil';
import { updateValues } from '@commons/utils/FormikUtils';
import TextUtil from '@commons/utils/TextUtil';
import Alert from '@mobile/components/molecules/commons/Alert';
import Dialog from '@mobile/components/molecules/commons/Dialog';
import LikeInputButtonField from '@mobile/components/molecules/commons/Fields/LikeInputButtonField';
import SearchButtonField from '@mobile/components/molecules/commons/Fields/SearchButtonField';
import SelectField from '@mobile/components/molecules/commons/Fields/SelectField';
import SFDateField from '@mobile/components/molecules/commons/Fields/SFDateField';
import TextField from '@mobile/components/molecules/commons/Fields/TextField';
import Navigation from '@mobile/components/molecules/commons/Navigation';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import { ExpenseType } from '@apps/domain/models/exp/ExpenseType';
import {
  ExtendItemInfo,
  getExtendedItemArray,
} from '@apps/domain/models/exp/ExtendedItem';
import { RoundingType } from '@apps/domain/models/exp/foreign-currency/Currency';
import {
  isUseJctNo,
  JCT_REGISTRATION_NUMBER_USAGE,
} from '@apps/domain/models/exp/JCTNo';
import { isShowPaymentMethodField } from '@apps/domain/models/exp/PaymentMethod';
import { Record, RouteInfo } from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';
import { calculateTax, ExpTaxTypeList } from '@apps/domain/models/exp/TaxType';

import { PaymentMethodOptionList } from '@mobile/modules/expense/ui/paymentMethodOption';

import Button from '@mobile/components/atoms/Button';
import IconButton from '@mobile/components/atoms/IconButton';
import Label from '@mobile/components/atoms/Label';
import RadioButtonGroup from '@mobile/components/atoms/RadioButtonGroup';
import Wrapper from '@mobile/components/atoms/Wrapper';
import JorudanAmountSummary from '@mobile/components/molecules/expense/JorudanAmountSummary';
import CloneCalendarDialog, {
  CALENDAR_CLONE,
} from '@mobile/components/organisms/expense/CloneCalendarDialog';
import CloneNumberDialog, {
  NUMBER_CLONE,
} from '@mobile/components/organisms/expense/CloneNumberDialog';
import FooterOptionsModal, {
  FOOTER_MODAL,
} from '@mobile/components/organisms/expense/FooterOptionsModal';

import RecordInvoice from '../../../Record/New/General/Invoice';
import initFareTypeConfig from './fareConfig';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-route-list-item';

type Props = {
  language: string;
  report: Report;
  recordId?: string;
  readOnly: boolean; // edit / view mode
  isUnderApprovedPreRequest: boolean;
  reportDiscarded?: boolean;
  reportClaimed?: boolean;
  isSubmitted: boolean;
  values: Record;
  errors: Record;
  touched: Record;
  status: any;
  history: RouterHistory;
  paymentMethodOptionList: PaymentMethodOptionList;
  selectedExpType: ExpenseType;
  useJctRegistrationNumber: boolean;
  onClickChangeRouteBtn: (
    date: string,
    expenseTypeId: string,
    expenseType: string,
    paymentMethodId: string | null,
    routeInfo?: RouteInfo
  ) => void;
  setFieldValue: (key: string, value: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: { [key: string]: unknown } | boolean,
    arg2?: boolean
  ) => void;
  setValues: (value: any) => void;
  setTouched: (value: any) => void;
  handleSubmit: () => void;
  onClickBackButton: (arg0: Record) => void;
  onClickDeleteButton: () => void;
  onClickEditButton: () => void;
  taxList: ExpTaxTypeList;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  taxRoundingSetting: RoundingType;
  saveFormValues: (arg0: Record) => void;
  onClickSearchCustomEI: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string,
    arg4: boolean
  ) => void;
  // Custom Hint
  activeHints: Array<string>;
  customHints: CustomHint;
  onClickHint: (arg0: string) => void;
  onClickSearchCostCenter: (arg0: string) => void;
  onClickSearchJob: (arg0: string) => void;
  onClickCloneRecord: (cloneTimes?: number, targetDates?: string[]) => void;
  removeInactivePaymentMethod: (selectedPaymentMethodId: string) => void;
};

// helper method to improve readability
const format = (value: string | number, currencySymbol: string) =>
  `${currencySymbol}${FormatUtil.convertToIntegerString(value)}`;

const buildOptionList = (picklist: any) => {
  const optionList = picklist.map((pick) => ({
    value: pick.value || '',
    label: pick.label,
  }));
  return [{ value: '', label: msg().Exp_Lbl_PleaseSelect }, ...optionList];
};

const DELETE = 'delete';

type Modal =
  | ''
  | typeof FOOTER_MODAL
  | typeof CALENDAR_CLONE
  | typeof NUMBER_CLONE
  | typeof DELETE;

const RouteListItem = (props: Props) => {
  const [modal, setModal] = useState<Modal>('');
  const [alert, setAlert] = useState('');

  const {
    isSubmitted,
    values,
    recordId,
    report,
    readOnly,
    baseCurrencySymbol,
    isUnderApprovedPreRequest,
    paymentMethodOptionList,
    reportDiscarded,
    reportClaimed,
    selectedExpType,
    onClickCloneRecord,
  } = props;

  const alertMsg = TextUtil.template(
    msg().Exp_Lbl_EditInfoofRouteRecord,
    msg().Exp_Clbl_Date,
    msg().Exp_Clbl_ExpenseType
  );

  const prevReadOnly = usePrevious(readOnly);
  useEffect(() => {
    let msg = '';
    if (!readOnly && prevReadOnly) {
      msg = alertMsg;
    }
    setAlert(msg);
  }, [readOnly]);

  const onChangeUpdateValues = (updateObj: any) => {
    const { values, touched } = updateValues(
      props.values,
      props.touched,
      updateObj
    );
    props.setValues(values);
    props.setTouched(touched);
  };

  const onSearchJob = () => {
    props.setFieldValue('items.0.jobName', values.items[0].jobName);
    props.saveFormValues(values);
    props.onClickSearchJob(values.recordDate);
  };

  const onSearchCostCenter = () => {
    props.setFieldValue(
      'items.0.costCenterName',
      values.items[0].costCenterName
    );
    props.saveFormValues(values);
    props.onClickSearchCostCenter(values.recordDate);
  };

  const onClickChangeRouteBtn = () => {
    const { recordDate, routeInfo, items, paymentMethodId } = values;
    props.saveFormValues(values); // save tmp edited values
    props.onClickChangeRouteBtn(
      recordDate,
      items[0].expTypeId,
      items[0].expTypeName,
      paymentMethodId,
      routeInfo
    );
  };

  const getCustomHintProps = (fieldName: string) => ({
    hintMsg: !isReadOnly ? props.customHints[fieldName] : '',
    isShowHint: props.activeHints.includes(fieldName),
    onClickHint: () => props.onClickHint(fieldName),
  });

  const getCustomHintforEI = (id: string, info: ExtendItemInfo) => ({
    hintMsg: !props.recordId ? info.description : '',
    isShowHint: props.activeHints.includes(id),
    onClickHint: () => props.onClickHint(id),
  });

  const setError = (field: string) => {
    const errors = get(props.errors, field);
    const isFieldTouched = get(props.touched, field);
    return errors && isFieldTouched ? [errors] : [];
  };

  const setValueForKey = (key: string) => (e: any) => {
    props.setFieldValue(key, e.target.value);
    props.setFieldTouched(key, true, false);
  };

  const handleRoundTripChange = (e: any) => {
    const route = get(values, 'routeInfo.selectedRoute');
    const amount = e.target.value === '0' ? route.cost : route.roundTripCost;

    props.setFieldValue('routeInfo.roundTrip', e.target.value);
    props.setFieldTouched('routeInfo.roundTrip', true, false);
    props.setFieldValue('items[0].amount', amount);
    props.setFieldValue('amount', amount);

    const tax = props.taxList[0];
    const taxRes = calculateTax(
      tax.rate,
      amount,
      props.baseCurrencyDecimal,
      props.taxRoundingSetting
    );
    props.setFieldValue('withoutTax', taxRes.amountWithoutTax);
    props.setFieldValue('items[0].withoutTax', taxRes.amountWithoutTax);
    props.setFieldValue('items[0].gstVat', taxRes.gstVat);
  };

  const handlePaymentMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { removeInactivePaymentMethod, setFieldValue } = props;
    const { value } = e.target;
    removeInactivePaymentMethod(values.paymentMethodId);
    setFieldValue('paymentMethodId', value || null);
  };

  if (!values) {
    return null;
  }

  const isNewRecord = !recordId;
  const isReadOnly = !isNewRecord && readOnly;
  const fareType = initFareTypeConfig();
  const route = values.routeInfo && values.routeInfo.selectedRoute;

  const actionBtn = (
    <IconButton
      className={`${ROOT}__actions-btn`}
      key="more"
      size="small"
      icon="threedots_vertical"
      onClick={() => setModal(FOOTER_MODAL)}
    />
  );

  let navigationActions = [];
  if (isNewRecord) {
    navigationActions = [];
  } else if (reportDiscarded || reportClaimed || isUnderApprovedPreRequest) {
    navigationActions = [];
  } else if (readOnly) {
    navigationActions = [actionBtn];
  }

  const { jobId, costCenterHistoryId } = report;
  let { jobName, costCenterName } = report;
  if (values.items[0].jobId) {
    jobName = values.items[0].jobName;
  }
  if (values.items[0].costCenterHistoryId) {
    costCenterName = values.items[0].costCenterName;
  }

  const isEditExisting = !isNewRecord && !readOnly;
  const backLabel = isEditExisting ? msg().Com_Btn_Cancel : msg().Com_Lbl_Back;

  const onClickCloneByDate = () => {
    setModal(CALENDAR_CLONE);
  };

  const onClickCloneByNumber = () => {
    setModal(NUMBER_CLONE);
  };

  const onClickDelete = () => {
    setModal(DELETE);
  };

  const closeModal = () => {
    setModal('');
  };

  const onChangeJctRegistrationNo = (value: string) => {
    const updateValues = {
      'items.0.jctRegistrationNumber': value,
    };
    onChangeUpdateValues(updateValues);
  };

  const onChangeSelectedJctInvoiceOption = (optionValue: string) => {
    const updateValues = {
      'items.0.jctInvoiceOption': optionValue,
    };
    onChangeUpdateValues(updateValues);
  };

  const roundTrip = get(values, 'routeInfo.roundTrip');
  const jctRegistrationNumberUsage = get(
    selectedExpType,
    'jctRegistrationNumberUsage',
    JCT_REGISTRATION_NUMBER_USAGE.NotUsed
  );
  const isShowJctRegistrationNumber = get(
    selectedExpType,
    'displayJctNumberInput',
    false
  );
  const isShowRecordInvoice =
    props.useJctRegistrationNumber && isUseJctNo(jctRegistrationNumberUsage);

  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Exp_Lbl_Records}
        backButtonLabel={backLabel}
        onClickBack={() => {
          props.onClickBackButton(values);
        }}
        actions={navigationActions}
      />
      <Form
        className={classNames('main-content', {
          'read-only-bg': readOnly,
        })}
      >
        {!!alert && <Alert variant="attention" message={[alert]} />}
        <section className={`${ROOT}__date`}>
          <TextField
            required
            disabled
            label={msg().Exp_Clbl_Date}
            value={DateUtil.dateFormat(values.recordDate)}
          />
        </section>

        <section className={`${ROOT}__exp-type`}>
          <TextField
            required
            disabled
            label={msg().Exp_Clbl_ExpenseType}
            value={values.items[0].expTypeName || ''}
          />
        </section>

        {isShowPaymentMethodField(paymentMethodOptionList, values) && (
          <section>
            <SelectField
              required
              disabled={isReadOnly}
              label={msg().Exp_Clbl_PaymentMethod}
              options={paymentMethodOptionList}
              onChange={handlePaymentMethodChange}
              value={values.paymentMethodId}
              {...getCustomHintProps('recordPaymentMethod')}
            />
          </section>
        )}

        <section className={`${ROOT}__fare-type`}>
          <RadioButtonGroup
            disabled={isReadOnly}
            required
            label={fareType.labels}
            options={fareType.options}
            value={String(+roundTrip)}
            onChange={handleRoundTripChange}
          />
        </section>

        <section className={`${ROOT}__amount`}>
          <Label text={msg().Exp_Clbl_Amount} />
          <p className={`${ROOT}__amount-text`}>
            {format(values.items[0].amount, baseCurrencySymbol)}
          </p>
        </section>

        <section className={`${ROOT}__route-map`}>
          <Label text={msg().Com_Lbl_Route} />
          <JorudanAmountSummary
            route={route}
            isRoundTrip={roundTrip && roundTrip !== '0'}
            baseCurrencySymbol={baseCurrencySymbol}
          />
          <RouteMap
            routeInfo={values.routeInfo}
            baseCurrencySymbol={baseCurrencySymbol}
            mobile
          />
          {isEditExisting && (
            <Button
              className={`${ROOT}__route-map-change`}
              onClick={onClickChangeRouteBtn}
              priority="primary"
              variant="neutral"
            >
              {msg().Exp_Btn_ChangeRoute}
            </Button>
          )}
        </section>

        {isShowRecordInvoice && (
          <section className={`${ROOT}__jct-invoice`}>
            <RecordInvoice
              {...getCustomHintProps('recordInvoice')}
              jctRegistrationNumberUsage={jctRegistrationNumberUsage}
              disabled={isReadOnly}
              recordJctNumber={values.items[0].jctRegistrationNumber}
              onChangeJctNumber={onChangeJctRegistrationNo}
              onChangeRadio={onChangeSelectedJctInvoiceOption}
              optionValue={values.items[0].jctInvoiceOption}
              isShowJctRegistrationNumber={isShowJctRegistrationNumber}
            />
          </section>
        )}

        {costCenterHistoryId && (
          <section>
            <LikeInputButtonField
              required
              disabled={isReadOnly}
              errors={setError('items.0.costCenterName')}
              onClick={() => onSearchCostCenter()}
              value={costCenterName || ''}
              label={msg().Exp_Clbl_CostCenter}
              {...getCustomHintProps('recordCostCenter')}
            />
          </section>
        )}

        {jobId && (
          <section>
            <LikeInputButtonField
              required
              disabled={isReadOnly}
              errors={setError('items.0.jobName')}
              onClick={() => onSearchJob()}
              value={jobName || ''}
              label={msg().Exp_Lbl_Job}
              {...getCustomHintProps('recordJob')}
            />
          </section>
        )}

        {getExtendedItemArray(values.items[0], true)
          .filter((i) => i.id)
          .map(({ id, info, index }) => {
            if (!info) {
              return null;
            }

            let $field;
            switch (info.inputType) {
              case 'Text':
                $field = (
                  <section className={`${ROOT}__input`} key={id}>
                    <TextField
                      required={info.isRequired}
                      disabled={isReadOnly}
                      label={info.name}
                      errors={setError(`items.0.extendedItemText${index}Value`)}
                      onChange={(e: any) => {
                        const val = e.target.value;
                        onChangeUpdateValues({
                          [`items.0.extendedItemText${index}Value`]: val,
                          [`items.0.extendedItemText${index}Id`]: id,
                        });
                      }}
                      value={
                        values.items[0][`extendedItemText${index}Value`] || ''
                      }
                      {...getCustomHintforEI(id, info)}
                    />
                  </section>
                );
                break;

              case 'Picklist':
                $field = (
                  <section key={id} className={`${ROOT}__input`}>
                    <SelectField
                      disabled={isReadOnly}
                      errors={setError(
                        `items.0.extendedItemPicklist${index}Value`
                      )}
                      required={info.isRequired}
                      label={info.name}
                      options={buildOptionList(info.picklist)}
                      onChange={setValueForKey(
                        `items.0.extendedItemPicklist${index}Value`
                      )}
                      value={
                        values.items[0][`extendedItemPicklist${index}Value`] ||
                        ''
                      }
                      {...getCustomHintforEI(id, info)}
                    />
                  </section>
                );
                break;

              case 'Lookup':
                $field = (
                  <section key={id} className={`${ROOT}__input`}>
                    <SearchButtonField
                      placeholder={msg().Admin_Lbl_Search}
                      required={info.isRequired}
                      errors={setError(
                        `items.0.extendedItemLookup${index}Value`
                      )}
                      disabled={isReadOnly}
                      onClick={() => {
                        props.saveFormValues(values);
                        props.onClickSearchCustomEI(
                          id,
                          info.extendedItemCustomId,
                          info.name,
                          index,
                          isEditExisting
                        );
                      }}
                      onClickDeleteButton={() => {
                        onChangeUpdateValues({
                          [`items.0.extendedItemLookup${index}Value`]: null,
                          [`items.0.extendedItemLookup${index}SelectedOptionName`]:
                            null,
                        });
                      }}
                      value={
                        values.items[0][
                          `extendedItemLookup${index}SelectedOptionName`
                        ] || ''
                      }
                      label={info.name}
                      {...getCustomHintforEI(id, info)}
                    />
                  </section>
                );
                break;

              case 'Date':
                const onChangeDateFieldValue = (date?: Date) => {
                  const updateValue = (date && DateUtil.fromDate(date)) || '';
                  onChangeUpdateValues({
                    [`items.0.extendedItemDate${index}Value`]: updateValue,
                    [`items.0.extendedItemDate${index}Id`]: id,
                  });
                };

                $field = (
                  <section key={id} className={`${ROOT}__input`}>
                    <SFDateField
                      key={id}
                      required={info.isRequired}
                      disabled={isReadOnly}
                      label={info.name}
                      errors={setError(`items.0.extendedItemDate${index}Value`)}
                      onChange={(e, { date }) => {
                        onChangeDateFieldValue(date);
                      }}
                      value={
                        values.items[0][`extendedItemDate${index}Value`] || ''
                      }
                      useRemoveValueButton
                      onClickRemoveValueButton={() => onChangeDateFieldValue()}
                      {...getCustomHintforEI(id, info)}
                    />
                  </section>
                );
                break;

              default:
                $field = null;
            }

            return $field;
          })}

        <section className={`${ROOT}__summary`}>
          <TextField
            label={msg().Exp_Clbl_Summary}
            value={values.items[0].remarks}
            disabled={isReadOnly}
            onChange={setValueForKey('items[0].remarks')}
            {...getCustomHintProps('recordSummary')}
          />
        </section>
      </Form>
      {!isNewRecord &&
        !reportDiscarded &&
        !reportClaimed &&
        !isUnderApprovedPreRequest &&
        readOnly && (
          <div className={`${ROOT}__actions`}>
            <Button
              onClick={props.onClickEditButton}
              priority="secondary"
              variant="neutral"
              disabled={props.isSubmitted}
            >
              {msg().Com_Btn_Edit}
            </Button>
          </div>
        )}

      {!reportDiscarded &&
        !reportClaimed &&
        !isUnderApprovedPreRequest &&
        !readOnly && (
          <div className={`${ROOT}__actions`}>
            <Button
              onClick={props.handleSubmit}
              priority="primary"
              variant="neutral"
              disabled={props.isSubmitted}
            >
              {msg().Com_Btn_Save}
            </Button>
          </div>
        )}

      {modal === FOOTER_MODAL && (
        <FooterOptionsModal
          title={msg().Exp_Btn_More}
          menuItems={[
            {
              label: msg().Exp_Lbl_Clone,
              disabled: isSubmitted,
              action: onClickCloneByDate,
            },
            {
              label: msg().Exp_Lbl_CloneOneTime,
              disabled: isSubmitted,
              action: () => onClickCloneRecord(1),
            },
            {
              label: msg().Exp_Lbl_CloneMultiple,
              disabled: isSubmitted,
              action: onClickCloneByNumber,
            },
            {
              label: msg().Com_Btn_Delete,
              disabled: isSubmitted,
              action: onClickDelete,
            },
          ]}
          closeModal={closeModal}
        />
      )}
      <CloneCalendarDialog
        isOpen={modal === CALENDAR_CLONE}
        defaultDate={values.recordDate}
        language={props.language}
        closeDialog={closeModal}
        onClickClone={(dates) => onClickCloneRecord(null, dates)}
      />
      <CloneNumberDialog
        isOpen={modal === NUMBER_CLONE}
        closeDialog={closeModal}
        onClickClone={(number) => onClickCloneRecord(number)}
      />
      <Dialog
        isOpened={modal === DELETE}
        title={msg().Exp_Msg_ConfirmDelete}
        content={<div>{msg().Exp_Msg_ConfirmDeleteSelectedRecords}</div>}
        leftButtonLabel={msg().Com_Btn_Cancel}
        rightButtonLabel={msg().Com_Btn_Delete}
        onClickLeftButton={closeModal}
        onClickRightButton={props.onClickDeleteButton}
        onClickCloseButton={closeModal}
      />
    </Wrapper>
  );
};

export default RouteListItem;
