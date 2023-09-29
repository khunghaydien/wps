import React from 'react';

import { MAX_LENGTH_VIA_LIST } from '../../../../../../../../domain/models/exp/Record';

import msg from '../../../../../../../languages';
import Button from '../../../../../../buttons/Button';

import './index.scss';

const ROOT = 'ts-route-form';

type Props = {
  readOnly: boolean;
  tmpViaList: Array<string>;
  onClickAddViaButton: () => void;
};

export default class AddViaButton extends React.Component<Props> {
  render() {
    if (
      this.props.readOnly ||
      this.props.tmpViaList.length >= MAX_LENGTH_VIA_LIST
    ) {
      return null;
    }

    return (
      <Button
        type="text"
        className={`${ROOT}-add-via-button`}
        onClick={this.props.onClickAddViaButton}
        disabled={this.props.readOnly}
      >
        {msg().Exp_Lbl_AddViaButton}
      </Button>
    );
  }
}
