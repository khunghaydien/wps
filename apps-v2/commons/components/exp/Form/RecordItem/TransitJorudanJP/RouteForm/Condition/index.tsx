import React from 'react';

import { StationInfo } from '../../../../../../../../domain/models/exp/jorudan/Station';

import './index.scss';

const ROOT = 'ts-route-form__condition';

type Props = {
  className?: string;
  error: string;
  inputType: string;
  placeholder: string;
  readOnly: boolean;
  // components
  suggest: any;
  targetDate: string;
  title: string;
  value: string;
  onChange: (arg0: StationInfo) => void;
  onChangeTmp: (arg0: string, arg1: boolean) => void;
};

export default class Condition extends React.Component<Props> {
  render() {
    const SuggestContainer = this.props.suggest;

    return (
      <div className={ROOT}>
        <div className={`${ROOT}-key`}>{this.props.title}</div>
        <div className={`${ROOT}-value`}>
          <SuggestContainer
            inputType={this.props.inputType}
            placeholder={this.props.placeholder}
            readOnly={this.props.readOnly}
            onClickSuggestionItem={this.props.onChange}
            onChangeInput={this.props.onChangeTmp}
            error={this.props.error}
            value={this.props.value}
            targetDate={this.props.targetDate}
            className={this.props.className}
          />
        </div>
      </div>
    );
  }
}
