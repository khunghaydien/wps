import React from 'react';

import msg from '../../../languages';
import SelectField from '../../fields/SelectField';

type Props = {
  value: string;
  options: Array<string | { text: string; value: any }>;
  onChange: (arg0: string) => void;
};

export default class DateFilter extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e: React.SyntheticEvent<HTMLSelectElement>) {
    this.props.onChange(e.currentTarget.value);
  }

  render() {
    const options = this.props.options.map((text) =>
      typeof text === 'string' ? { text, value: text } : text
    );
    options.unshift({ value: '', text: msg().Com_Sel_All });

    return (
      <SelectField
        options={options}
        value={this.props.value}
        onChange={this.onChange}
      />
    );
  }
}
