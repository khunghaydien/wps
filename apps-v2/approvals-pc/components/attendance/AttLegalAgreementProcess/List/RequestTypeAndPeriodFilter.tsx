import React from 'react';

import FieldGroupFrame from '@commons/components/Grid/filters/FieldGroupFrame';
import SelectFilter from '@commons/components/Grid/filters/SelectFilter';

type Props = {
  targetMonthValue: string;
  targetMonthOptions: Array<string | { text: string; value: any }>;
  requestTypeValue: string;
  requestTypeOptions: Array<string | { text: string; value: any }>;
  onChangeTargetMonthValue: (arg0: string) => void;
  onChangeRequestTypeValue: (arg0: string) => void;
};

export default class RequestTypeAndPeriodFilter extends React.Component<Props> {
  render() {
    return (
      <FieldGroupFrame>
        <SelectFilter
          options={this.props.targetMonthOptions}
          value={this.props.targetMonthValue}
          onChange={this.props.onChangeTargetMonthValue}
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
