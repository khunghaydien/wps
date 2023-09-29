import React from 'react';

import _ from 'lodash';

import { Record, RouteInfo } from '../../../../../../domain/models/exp/Record';
import { Report } from '../../../../../../domain/models/exp/Report';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import Highlight from '../../../Highlight';
import Amount from './Amount';
import RouteMap from './RouteMap';

type Props = {
  baseCurrencySymbol: string;
  // Formik
  errors: { recordDate?: string };
  // ui states
  expPreRecord?: Record;
  expRecord: Record;
  expReport: Report;
  isHighlightDiff?: boolean;
  isHighlightNewRecord?: boolean;
  readOnly: boolean;
  // components
  routeForm: any;
  suggest: any;
  targetRecord: string;
  touched: { recordDate?: string };
  // event handlers
  onChangeEditingExpReport: (arg0: string, arg1: any) => void;
  onClickResetRouteInfoButton: () => void;
  resetRouteForm: (arg0?: RouteInfo) => void;
};

const ROOT = 'ts-expenses-requests__contents__form__transit';

export default class TransitJorudanJP extends React.Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.resetRouteForm(this.props.expRecord.routeInfo);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (!_.isEqual(this.props.targetRecord, nextProps.targetRecord)) {
      nextProps.resetRouteForm(nextProps.expRecord.routeInfo);
    }
  }

  isHighlight = (propertyName: string): boolean => {
    const { isHighlightDiff, isHighlightNewRecord, expPreRecord, expRecord } =
      this.props;
    if (!_.isNil(expPreRecord)) {
      return (
        isHighlightDiff &&
        (isHighlightNewRecord ||
          !_.isEqual(expPreRecord[propertyName], expRecord[propertyName]))
      );
    }
    return false;
  };

  render() {
    const {
      expRecord,
      expPreRecord,
      isHighlightDiff,
      readOnly,
      baseCurrencySymbol,
      targetRecord,
      isHighlightNewRecord,
      onChangeEditingExpReport,
    } = this.props;

    const RouteFormContainer = this.props.routeForm;
    return (
      <div className={`${ROOT} ts-text-field-container`}>
        <div className="key">{msg().Com_Lbl_Route}</div>
        <RouteFormContainer
          targetDate={expRecord.recordDate}
          targetRecord={targetRecord}
          readOnly={readOnly}
          routeInfo={expRecord.routeInfo}
          onChangeEditingExpReport={onChangeEditingExpReport}
          errors={this.props.errors}
          touched={this.props.touched}
          suggest={this.props.suggest}
          expRecord={this.props.expRecord}
          expReport={this.props.expReport}
          expPreRecord={expPreRecord}
          isHighlightDiff={isHighlightDiff}
          isHighlightNewRecord={isHighlightNewRecord}
        />
        {expRecord.routeInfo && expRecord.routeInfo.selectedRoute && (
          <Amount
            amount={expRecord.items[0].amount}
            baseCurrencySymbol={baseCurrencySymbol}
            isHighlight={isHighlightNewRecord || this.isHighlight('amount')}
          />
        )}
        <Highlight
          highlight={isHighlightNewRecord || this.isHighlight('routeInfo')}
        >
          <RouteMap
            routeInfo={expRecord.routeInfo}
            baseCurrencySymbol={baseCurrencySymbol}
          />
        </Highlight>
        {expRecord.routeInfo && expRecord.routeInfo.selectedRoute && !readOnly && (
          <Button
            type="text"
            className={`${ROOT}-route-reset`}
            data-testid={`${ROOT}-route-reset`}
            onClick={this.props.onClickResetRouteInfoButton}
          >
            {msg().Exp_Lbl_RouteInfoResetButton}
          </Button>
        )}
      </div>
    );
  }
}
