import React from 'react';

// import msg from '../../../commons/languages';
// import Button from '../buttons/Button';
import TextField, { TEXT_MAX_LENGTH } from './TextField';

import './DropdownDateRange.scss';

const ROOT = 'commons-fields-dropdown-date';

type Props = {
  onClickUpdateText: (value: string) => void;
  selectedStringValues?: string;
  maxLength?: number;
};

type State = {
  error: string;
};

class DropDownTextField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: '',
    };
  }

  updateStartAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onClickUpdateText(e.target.value);
  };

  clearError = () => {
    this.setState({
      error: '',
    });
  };

  render() {
    const { error } = this.state;
    const { selectedStringValues, maxLength } = this.props;

    return (
      <div className={`${ROOT}`}>
        <span className={`${ROOT}__input1`}>
          <TextField
            value={selectedStringValues || ''}
            onChange={this.updateStartAmount}
            maxLength={maxLength || TEXT_MAX_LENGTH}
          />
        </span>

        {error && <p className={`${ROOT}__error`}>{error}</p>}

        {/* <div className={`${ROOT}__date-buttons`}>
         <Button onClick={this.updateResult}>{msg().Com_Btn_Update}</Button>
         <Button onClick={this.closeDropdown} type="outline-default">
           {msg().Com_Btn_Close}
         </Button>
        </div> */}
      </div>
    );
  }
}

export default DropDownTextField;
