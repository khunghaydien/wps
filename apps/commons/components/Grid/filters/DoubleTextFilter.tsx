import React from 'react';

import msg from '../../../languages';
import TextField from '../../fields/TextField';
import FieldGroupFrame from './FieldGroupFrame';

type Props = {
  firstValue: string;
  secondValue: string;
  onChangeFirstValue: (arg0: string) => void;
  onChangeSecondValue: (arg0: string) => void;
};

export default class DoubleTextFilter extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onChangeFirstValue = this.onChangeFirstValue.bind(this);
    this.onChangeSecondValue = this.onChangeSecondValue.bind(this);
  }

  onChangeFirstValue = (_e: any, value: string) => {
    this.props.onChangeFirstValue(value);
  };

  onChangeSecondValue = (_e: any, value: string) => {
    this.props.onChangeSecondValue(value);
  };

  render() {
    return (
      <FieldGroupFrame>
        <TextField
          value={this.props.firstValue}
          onChange={this.onChangeFirstValue}
          placeholder={msg().Com_Lbl_Search}
        />
        <TextField
          value={this.props.secondValue}
          onChange={this.onChangeSecondValue}
          placeholder={msg().Com_Lbl_Search}
        />
      </FieldGroupFrame>
    );
  }
}
