// note: AP = Accounting Period

import React from 'react';

import classNames from 'classnames';
import { find, get, isEmpty } from 'lodash';

import { AccountingPeriodList } from '../../../../../../../../domain/models/exp/AccountingPeriod';
import { CustomHint } from '../../../../../../../../domain/models/exp/CustomHint';
import {
  Report,
  status,
} from '../../../../../../../../domain/models/exp/Report';

import DateUtil from '../../../../../../../utils/DateUtil';

import msg from '../../../../../../../languages';
import DateField from '../../../../../../fields/DateField';
import LabelWithHint from '../../../../../../fields/LabelWithHint';
import TextAreaField from '../../../../../../fields/TextAreaField';
import MultiColumnsGrid from '../../../../../../MultiColumnsGrid';
import Tooltip from '../../../../../../Tooltip';

type Props = {
  // HOC props
  accountingPeriodActive: AccountingPeriodList;
  accountingPeriodAll: AccountingPeriodList;
  accountingPeriodIdOriginallySelected: string;
  accountingPeriodInactive: AccountingPeriodList;
  customHint: CustomHint;
  // ui states
  errors: {
    accountingDate: string;
    accountingPeriodId: string;
    subject: string;
  };
  expReport: Report;
  isActiveReport: boolean;
  isFinanceApproval: boolean;
  readOnly: boolean;
  touched: {
    accountingDate: string;
    accountingPeriodId: string;
    records?: Array<any>;
    subject: string;
  };
  onChangeAccountingPeriod: () => void;
};

const ROOT = 'ts-expenses__form-report-summary__form';
// this class is only used in expense request (not in expense report)
export default class AccountingPeriodAndRecordDate extends React.Component<Props> {
  buildOptionList(accountingPeriodId: string) {
    const { accountingPeriodActive, accountingPeriodAll } = this.props;
    let accountingPeriodList = accountingPeriodAll;

    if (!this.props.readOnly) {
      const originalAp = accountingPeriodAll.filter(
        (apActive) => apActive.id === accountingPeriodId
      );
      const isOriginalApActive = get(originalAp, '0.active', true);
      accountingPeriodList = isOriginalApActive
        ? accountingPeriodActive
        : [
            // to display selected accounting period even if it is inactive
            ...originalAp,
            ...accountingPeriodActive,
          ];
    }

    const optionLists = accountingPeriodList.map((ap) => {
      const isInactive = !ap.active;
      return (
        <option key={ap.id} value={ap.id} disabled={isInactive}>
          {isInactive && msg().Exp_Lbl_Inactive.concat(' - ')}
          {`${DateUtil.dateFormat(ap.validDateFrom)} - ${DateUtil.dateFormat(
            ap.validDateTo
          )}`}
        </option>
      );
    });

    // Need to add this to show empty accountingPeriod option when no value is selected.
    optionLists.unshift(
      <option key="default-blank-option" value="" style={{ display: 'none' }} />
    );

    return optionLists;
  }

  buildSelectedValue() {
    const selectedAccountingPeriod = find(this.props.accountingPeriodActive, {
      id: this.props.expReport.accountingPeriodId,
    });

    let accountingPeriodId = get(selectedAccountingPeriod, 'id', '');
    let recordDate = get(selectedAccountingPeriod, 'recordingDate', '');
    let displayInfo = isEmpty(selectedAccountingPeriod)
      ? ''
      : `${DateUtil.dateFormat(
          selectedAccountingPeriod.validDateFrom
        )} - ${DateUtil.dateFormat(selectedAccountingPeriod.validDateTo)}`;

    // if accounting period is inactive, still display information in FA and report in Expense
    // add prefix 'Inactive - ' to FA approved report
    if (isEmpty(selectedAccountingPeriod)) {
      const selectedInactiveAccountingPeriod = find(
        this.props.accountingPeriodInactive,
        {
          id: this.props.accountingPeriodIdOriginallySelected,
        }
      ) || { validDateFrom: '', validDateTo: '' };
      accountingPeriodId = get(selectedInactiveAccountingPeriod, 'id', '');
      recordDate = get(selectedInactiveAccountingPeriod, 'recordingDate', '');
      const preFix =
        this.props.isFinanceApproval &&
        this.props.expReport.status === status.APPROVED
          ? msg().Exp_Lbl_Inactive.concat(' - ')
          : '';
      displayInfo = `${preFix}${DateUtil.dateFormat(
        selectedInactiveAccountingPeriod.validDateFrom
      )} - ${DateUtil.dateFormat(
        selectedInactiveAccountingPeriod.validDateTo
      )}`;
    }

    return [accountingPeriodId, recordDate, displayInfo];
  }

  render() {
    const [accountingPeriodId, recordDate, displayInfo] =
      this.buildSelectedValue();
    const {
      errors,
      touched,
      customHint,
      readOnly,
      isFinanceApproval,
      accountingPeriodInactive,
    } = this.props;
    const isDisabledAP = readOnly || isFinanceApproval;
    const isSelectedApInactive =
      !isDisabledAP &&
      !isEmpty(
        accountingPeriodInactive.find(
          (apActive) => apActive.id === accountingPeriodId
        )
      );
    const errMessage = !isSelectedApInactive
      ? msg()[errors.accountingPeriodId]
      : msg().Exp_Err_AccountingPeriodInactiveReselect;

    const apComponent = isDisabledAP ? (
      <TextAreaField
        resize="none"
        autosize
        maxRows={1}
        isRequired
        value={displayInfo || ''}
        disabled
      />
    ) : (
      <>
        <select
          data-testid={`${ROOT}__ap`}
          onChange={this.props.onChangeAccountingPeriod}
          className={classNames(`${ROOT}__select ts-select-input`, {
            inFinance: isFinanceApproval,
          })}
          disabled={isDisabledAP}
          value={accountingPeriodId}
        >
          {this.buildOptionList(accountingPeriodId)}
        </select>
        {((errors.accountingPeriodId && touched.accountingPeriodId) ||
          isSelectedApInactive) && (
          <div className="input-feedback">{errMessage}</div>
        )}
      </>
    );

    return (
      <React.Fragment>
        <MultiColumnsGrid alignments={['top', 'top']} sizeList={[6, 6]}>
          <div className="ts-text-field-container">
            <LabelWithHint
              text={msg().Exp_Clbl_AccountingPeriod}
              hintMsg={
                (!readOnly && customHint.reportHeaderAccountingPeriod) || ''
              }
              isRequired
            />
            {isFinanceApproval && !readOnly ? (
              <Tooltip
                align="top"
                content={msg().Exp_Msg_AccountingPeriodInfoForFinanceApproval}
              >
                <div>{apComponent}</div>
              </Tooltip>
            ) : (
              apComponent
            )}
          </div>
          <div className="ts-text-field-container">
            <LabelWithHint
              text={msg().Exp_Clbl_RecordDate}
              hintMsg=""
              isRequired
            />
            <DateField value={recordDate} disabled />
            {errors.accountingDate && touched.accountingDate && (
              <div className="input-feedback">
                {msg()[errors.accountingDate]}
              </div>
            )}
          </div>
        </MultiColumnsGrid>
      </React.Fragment>
    );
  }
}
