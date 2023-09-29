import * as React from 'react';

import classNames from 'classnames';

import Errors from '../../../atoms/Errors';
import Input from '../../../atoms/Fields/Input';
import {
  InputProps,
  mapPropsToInputProps,
} from '../../../atoms/Fields/InputProps';
import { IconSetType } from '../../../atoms/Icon/IconSet';
import Label from '../../../atoms/Label';

const ROOT = 'mobile-app-molecules-commons-number-field';

type Props = Readonly<
  InputProps & {
    className?: string;
    emphasis?: boolean;
    errors?: string[];
    icon?: IconSetType;
    label: string;
    testId?: string;
  }
>;

export default class NumberField extends React.PureComponent<Props> {
  render() {
    const errors = this.props.errors || [];
    const hasErrors = errors.length > 0;
    return (
      <div className={classNames(ROOT, this.props.className)}>
        <Label
          className={`${ROOT}__label`}
          text={this.props.label}
          marked={this.props.required}
          emphasis={this.props.emphasis}
        >
          <Input
            {...mapPropsToInputProps(this.props)}
            error={hasErrors}
            icon={this.props.icon}
            testId={this.props.testId}
            type="number"
          />
        </Label>
        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
