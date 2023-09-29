import * as React from 'react';

import Errors from '../../../atoms/Errors';
import Input from '../../../atoms/Fields/Input';
import {
  InputProps,
  mapPropsToInputProps,
} from '../../../atoms/Fields/InputProps';
import { IconSetType } from '../../../atoms/Icon/IconSet';
import LabelWithHint from '../../../atoms/LabelWithHint';

const ROOT = 'mobile-app-molecules-commons-text-field';

type Props = Readonly<
  InputProps & {
    className?: string;
    emphasis?: boolean;
    errors?: string[];
    icon?: IconSetType;
    label: string;
    testId?: string;
    // Custom Hint
    hintMsg?: string;
    isShowHint?: boolean;
    onClickHint?: () => void;
  }
>;

export default class TextField extends React.PureComponent<Props> {
  render() {
    const errors = this.props.errors || [];
    const hasErrors = errors.length > 0;
    return (
      <div className={ROOT}>
        <LabelWithHint
          className={`${ROOT}__label`}
          text={this.props.label}
          marked={this.props.required}
          emphasis={this.props.emphasis}
          hintMsg={this.props.hintMsg}
          isShowHint={this.props.isShowHint}
          onClickHint={this.props.onClickHint}
        />
        <Input
          {...mapPropsToInputProps(this.props)}
          error={hasErrors}
          icon={this.props.icon}
          testId={this.props.testId}
          type="text"
        />
        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
