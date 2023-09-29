import React from 'react';

import { get, isEmpty } from 'lodash';

import { CustomHint } from '../../../../../../domain/models/exp/CustomHint';
import {
  ExpenseType,
  ExpenseTypeList,
} from '../../../../../../domain/models/exp/ExpenseType';
import { EISearchObj } from '../../../../../../domain/models/exp/ExtendedItem';
import { Record } from '../../../../../../domain/models/exp/Record';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import LabelWithHint from '../../../../fields/LabelWithHint';
import SelectField from '../../../../fields/SelectField';
import TextField from '../../../../fields/TextField';
import ExtendedItems from '../ExtendedItem';
import General from '../General';
import RecordDate from '../RecordDate';
import Summary from '../Summary';

import './index.scss';

const ROOT = 'ts-expenses-child-record-item';

export type expTypeDisplay = {
  text: string;
  value: string;
};

export type ChildRecordItemProps = {
  expTypeList: ExpenseTypeList;
  expTypesDisplay: Array<expTypeDisplay>;
  recordItemIdx: number;
  handleClickDeleteBtn: (arg0: number) => void;
  onChangeChildDateForFC: (arg0: string) => void;
  onChangeChildDateOrTypeForBC: (arg0: {
    expTypeId?: string;
    recordDate?: string;
  }) => void;
  onChangeChildExpTypeForFC: (arg0: string) => void;
};
type Props = {
  baseCurrency: any;
  baseCurrencyCode: string;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint: CustomHint;
  errors: { recordDate?: string; records?: Array<any> };
  expRecord: Record;
  foreignCurrency: any;
  isFinanceApproval?: boolean;
  recordIdx: number;
  selectedCompanyId: string;
  touched: { recordDate?: string; records?: Array<any> };
  onChangeEditingExpReport: (arg0: string, arg1: any, arg2?: any) => void;
  onClickLookupEISearch: (item: EISearchObj) => void;
} & ChildRecordItemProps;

type State = {
  expTypeDescription: string;
};
export default class ChildRecordItem extends React.Component<Props, State> {
  state = {
    expTypeDescription: '',
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.expTypeList !== this.props.expTypeList) {
      const expTypeId = get(nextProps.expRecord, 'items.1.expTypeId', '');
      const expType =
        nextProps.expTypeList.find((x) => x.id === expTypeId) ||
        ({} as ExpenseType);
      const expTypeDescription = expType.description || '';
      this.setState({ expTypeDescription });
    }
    if (
      this.props.recordItemIdx !== nextProps.recordItemIdx &&
      !isEmpty(nextProps.expTypeList)
    ) {
      const { expRecord, recordItemIdx, expTypeList } = nextProps;
      const expType =
        (recordItemIdx &&
          expTypeList.find(
            (x) => x.id === expRecord.items[recordItemIdx].expTypeId
          )) ||
        ({} as ExpenseType);
      this.setState({
        expTypeDescription: expType.description,
      });
    }
  }

  render() {
    const {
      expRecord,
      errors,
      touched,
      recordIdx,
      recordItemIdx,
      expTypesDisplay,
      isFinanceApproval,
      customHint,
    } = this.props;

    const targetRecord = `records.${recordIdx}.items.${recordItemIdx}`;
    const recordErrors = get(errors, `records.${recordIdx}`);
    const expTypeError = get(errors, `${targetRecord}.expTypeId`);

    // if no item is selected, show empty only with title
    if (!recordItemIdx) {
      return (
        <section className={`${ROOT}-header`}>
          <div className={`${ROOT}-nav-title`}>
            <span>{msg().Exp_Lbl_Detail}</span>
          </div>
        </section>
      );
    }

    const targetItem = expRecord.items[recordItemIdx];

    const expenseTypeDescription = this.state.expTypeDescription && (
      <div className={`${ROOT}-contents__expense-type-description`}>
        {this.state.expTypeDescription}
      </div>
    );

    const expenseType = get(targetItem, 'expTypeEditable') ? (
      <>
        <div className={`${ROOT}-expense-type`}>
          <LabelWithHint
            text={msg().Exp_Clbl_ExpenseType}
            hintMsg={customHint.recordExpenseType}
            isRequired
          />
          <SelectField
            className={`${ROOT}-expense-type ts-select-input`}
            onChange={(e) => {
              const expType =
                this.props.expTypeList.find((x) => x.id === e.target.value) ||
                ({} as ExpenseType);
              this.setState({
                expTypeDescription: expType.description,
              });
              if (targetItem.useForeignCurrency) {
                this.props.onChangeChildExpTypeForFC(e.target.value);
              } else {
                this.props.onChangeChildDateOrTypeForBC({
                  expTypeId: e.target.value,
                  recordDate: targetItem.recordDate,
                });
              }
            }}
            options={expTypesDisplay}
            value={targetItem.expTypeId}
          />
          {expTypeError && (
            <div className="input-feedback">{msg()[expTypeError]}</div>
          )}
        </div>
      </>
    ) : (
      <>
        <TextField
          className={`${ROOT}-expense-type`}
          value={targetItem.expTypeName}
          label={msg().Exp_Clbl_ExpenseType}
          isRequired
          disabled
        />
      </>
    );

    return (
      <div className={`${ROOT}  slds`}>
        <section className={`${ROOT}-header`}>
          <div className={`${ROOT}-nav-title`}>
            <span>{msg().Exp_Lbl_Detail}</span>
          </div>
          {!isFinanceApproval && (
            <Button
              type="destructive"
              onClick={() => this.props.handleClickDeleteBtn(recordItemIdx)}
              disabled={expRecord.items.length <= 2}
            >
              {msg().Com_Btn_Delete}
            </Button>
          )}
        </section>

        <section className={`${ROOT}-content`}>
          <RecordDate
            recordDate={targetItem.recordDate}
            targetRecord={targetRecord}
            hintMsg={customHint.recordDate}
            onChangeRecordDate={(recordDate) => {
              if (targetItem.useForeignCurrency) {
                this.props.onChangeChildDateForFC(recordDate);
              } else {
                this.props.onChangeChildDateOrTypeForBC({
                  expTypeId: targetItem.expTypeId,
                  recordDate,
                });
              }
            }}
            readOnly={false}
            errors={errors}
          />

          {expenseType}
          {expenseTypeDescription}

          <General
            expRecord={expRecord}
            targetRecord={`records.${recordIdx}`}
            recordItemIdx={recordItemIdx}
            onChangeEditingExpReport={this.props.onChangeEditingExpReport}
            readOnly={false}
            errors={recordErrors}
            touched={touched}
            baseCurrencyCode={this.props.baseCurrencyCode}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
            baseCurrencyDecimal={this.props.baseCurrencyDecimal}
            baseCurrency={this.props.baseCurrency}
            foreignCurrency={this.props.foreignCurrency}
            selectedCompanyId={this.props.selectedCompanyId}
          />

          <ExtendedItems
            recordItem={targetItem}
            onClickLookupEISearch={this.props.onClickLookupEISearch}
            onChangeEditingExpReport={this.props.onChangeEditingExpReport}
            readOnly={false}
            targetRecordItem={`records.${recordIdx}.items.${recordItemIdx}`}
            errors={errors}
            touched={touched}
          />

          <Summary
            value={targetItem.remarks}
            hintMsg={customHint.recordSummary}
            onChangeEditingExpReport={this.props.onChangeEditingExpReport}
            readOnly={false}
            targetRecord={`records.${recordIdx}.items.${recordItemIdx}`}
            errors={this.props.errors}
            touched={this.props.touched}
          />
        </section>
      </div>
    );
  }
}
