import * as React from 'react';

import { EditHistoryItem } from '../../../../domain/models/exp/FinanceApproval';
import { JCT_NUMBER_INVOICE_MSG_KEY } from '@apps/domain/models/exp/JCTNo';

import DateUtil from '../../../utils/DateUtil';

import msg from '../../../languages';
import FixedHeaderTable, {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
} from '../../FixedHeaderTable';

import './index.scss';

const ROOT = 'ts-expenses-edit-history-table';

type Props = {
  isEllipsis?: boolean;
  modificationList: EditHistoryItem[];
};

const getFormattedValueForField = (fieldName: string, value: string) => {
  switch (fieldName) {
    case msg().Exp_Clbl_JCTInvoice:
      const msgKey = JCT_NUMBER_INVOICE_MSG_KEY[value];
      return msgKey ? msg()[msgKey] : value;
    default:
      return value;
  }
};

export default class EditHistoryTable extends React.Component<Props> {
  renderRow() {
    const CELL_CLASS = `${ROOT}__cell ${ROOT}__column`;
    const rows = this.props.modificationList.map<
      React.ReactElement<typeof BodyRow>
    >((history, idx) => {
      return (
        <BodyRow key={idx}>
          <BodyCell className={`${CELL_CLASS}-date`}>
            {DateUtil.formatYMDhhmm(history.modifiedDateTime)}
          </BodyCell>
          <BodyCell className={`${CELL_CLASS}-user`}>
            {history.modifiedByEmployeeName}
          </BodyCell>
          <BodyCell className={`${CELL_CLASS}-target`}>
            {history.recordSummary}
          </BodyCell>
          <BodyCell className={`${CELL_CLASS}-field`}>
            {history.fieldName}
          </BodyCell>
          <BodyCell className={`${CELL_CLASS}-old-value`}>
            {getFormattedValueForField(history.fieldName, history.oldValue)}
          </BodyCell>
          <BodyCell className={`${CELL_CLASS}-new-value`}>
            {getFormattedValueForField(history.fieldName, history.newValue)}
          </BodyCell>
        </BodyRow>
      );
    });
    return rows;
  }

  render() {
    return (
      <div className={ROOT}>
        <FixedHeaderTable
          scrollableClass={`${ROOT}__scrollable`}
          className={this.props.isEllipsis && `${ROOT}--is-ellipsis`}
        >
          <HeaderRow>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-date`}>
              {msg().Exp_Lbl_Time}
            </HeaderCell>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-user`}>
              {msg().Exp_Lbl_ModifiedBy}
            </HeaderCell>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-target`}>
              {msg().Exp_Lbl_Target}
            </HeaderCell>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-field`}>
              {msg().Exp_Lbl_FieldName}
            </HeaderCell>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-old-value`}>
              {msg().Exp_Lbl_OriginalFieldValue}
            </HeaderCell>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-new-value`}>
              {msg().Exp_Lbl_NewFieldValue}
            </HeaderCell>
          </HeaderRow>
          {this.renderRow()}
        </FixedHeaderTable>
      </div>
    );
  }
}
