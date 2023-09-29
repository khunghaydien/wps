import React from 'react';

import DateFilter from '../../../../../commons/components/Grid/filters/DateFilter';
import FieldGroupFrame from '../../../../../commons/components/Grid/filters/FieldGroupFrame';
import SelectFilter from '../../../../../commons/components/Grid/filters/SelectFilter';

type Props = {
  periodValue: string;
  requestTypeValue: string;
  requestTypeOptions: Array<string | { text: string; value: any }>;
  onChangePeriodValue: (arg0: string) => void;
  onChangeRequestTypeValue: (arg0: string) => void;
};

export default class RequestTypeAndPeriodFilter extends React.Component<Props> {
  render() {
    return (
      <FieldGroupFrame>
        <DateFilter
          value={this.props.periodValue}
          onChange={this.props.onChangePeriodValue}
        />
        <SelectFilter
          options={this.props.requestTypeOptions}
          value={this.props.requestTypeValue}
          onChange={this.props.onChangeRequestTypeValue}
        />
      </FieldGroupFrame>
    );
  }
}
