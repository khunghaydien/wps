import React from 'react';

import imgPartsArrowNarrow from '../../images/partsArrowNarrow.png';
import msg from '../../languages';
import Button from '../buttons/Button';
import SelectField from './SelectField';

import './PeriodPicker.scss';

const ROOT = 'commons-fields-period-picker';

type Props = {
  currentButtonLabel: string;
  selectValue: string;
  selectOptions: Array<{ text: string; value: string }>;
  onClickCurrentButton: () => void;
  onClickNextButton: () => void;
  onClickPrevButton: () => void;
  onChangeSelect: (
    value: string,
    event: React.SyntheticEvent<HTMLSelectElement>
  ) => void;
  disabledPrevButton?: boolean;
  disabledNextButton?: boolean;
};

export default class PeriodPicker extends React.Component<Props> {
  static defaultProps = {
    disabledPrevButton: false,
    disabledNextButton: false,
  };

  constructor(props: Props) {
    super(props);

    this.onChangeSelect = this.onChangeSelect.bind(this);
  }

  onChangeSelect = (e: React.SyntheticEvent<HTMLSelectElement>) => {
    this.props.onChangeSelect(e.currentTarget.value, e);
  };

  render() {
    return (
      <span className={`${ROOT}`}>
        <div className={`${ROOT}__month-select`}>
          <SelectField
            className={`${ROOT}__select`}
            options={this.props.selectOptions}
            value={this.props.selectValue}
            onChange={this.onChangeSelect}
          />
        </div>
        <Button
          className={`${ROOT}__button ${ROOT}__button--prev`}
          type="default"
          onClick={this.props.onClickPrevButton}
          disabled={this.props.disabledPrevButton}
        >
          <img
            className={`${ROOT}__button-icon--next`}
            src={imgPartsArrowNarrow}
            alt={msg().Com_Lbl_PrevButton}
          />
        </Button>
        <Button
          className={`${ROOT}__button ${ROOT}__button--current`}
          type="default"
          onClick={this.props.onClickCurrentButton}
        >
          {this.props.currentButtonLabel}
        </Button>
        <Button
          className={`${ROOT}__button ${ROOT}__button--next`}
          type="default"
          onClick={this.props.onClickNextButton}
          disabled={this.props.disabledNextButton}
        >
          <img src={imgPartsArrowNarrow} alt={msg().Com_Lbl_NextButton} />
        </Button>
      </span>
    );
  }
}
