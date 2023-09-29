import React from 'react';

import msg from '../../../languages';
import TextField from '../../fields/TextField';

type Props = {
  value: string;
  onChange: (arg0: string) => void;
};

export default class TextFilter extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange = (_e: any, value: string) => {
    this.props.onChange(value);
  };

  render() {
    return (
      <TextField
        value={this.props.value}
        onChange={this.onChange}
        placeholder={msg().Com_Lbl_Search}
      />
    );
  }
}
