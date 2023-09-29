import React from 'react';

import msg from '../../../languages';
import DateField from '../../fields/DateField';

const ROOT = 'commons-grid-filters-date-filter';

type Props = {
  value: string;
  onChange: (arg0: string) => void;
};

export default class DateFilter extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <DateField
          value={this.props.value}
          onChange={this.props.onChange}
          placeholder={msg().Com_Lbl_Search}
        />
      </div>
    );
  }
}
