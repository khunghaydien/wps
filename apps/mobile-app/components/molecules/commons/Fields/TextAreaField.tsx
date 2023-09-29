import * as React from 'react';

import classNames from 'classnames';

import Errors from '../../../atoms/Errors';
import TextArea from '../../../atoms/Fields/TextArea';
import {
  mapPropsToTextAreaProps,
  TextAreaProps,
} from '../../../atoms/Fields/TextAreaProps';
import Label from '../../../atoms/Label';

const ROOT = 'mobile-app-molecules-commons-text-field';

type Props = Readonly<
  TextAreaProps & {
    className?: string;
    emphasis?: boolean;
    errors?: string[];
    label: string;
    testId?: string;
  }
>;

export default class TextField extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);

    const errors = this.props.errors || [];
    const hasErrors = errors.length > 0;
    return (
      <div className={className}>
        <Label
          className={`${ROOT}__label`}
          text={this.props.label}
          marked={this.props.required}
          emphasis={this.props.emphasis}
        >
          <TextArea
            {...mapPropsToTextAreaProps(this.props)}
            error={hasErrors}
            testId={this.props.testId}
          />
        </Label>
        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
