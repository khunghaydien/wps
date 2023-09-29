import * as React from 'react';

import classNames from 'classnames';

import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';

import Errors from '@mobile/components/atoms/Errors';
import Input from '@mobile/components/atoms/Fields/Input';
import {
  InputProps,
  mapPropsToInputProps,
} from '@mobile/components/atoms/Fields/InputProps';
import { IconSetType } from '@mobile/components/atoms/Icon/IconSet';
import Label from '@mobile/components/atoms/Label';
import RestReason from '@mobile/components/molecules/attendance/RestReasonField';

import './OtherRestTime.scss';

const ROOT = 'mobile-app-molecules-attendance-other-rest-time';

type Props = Readonly<
  InputProps & {
    className?: string;
    emphasis?: boolean;
    errors?: string[];
    icon?: IconSetType;
    label: string;
    testId?: string;
    restTimeReasons?: RestTimeReason[];
    otherRestReason: {
      value: RestTimeReason | null;
      readOnly?: boolean;
      required?: boolean;
      errors?: string[];
      onChange?: (arg0: RestTimeReason | null) => void;
    };
    enabledRestReason: boolean;
  }
>;

export default class OtherRestTime extends React.PureComponent<Props> {
  render() {
    const errors = this.props.errors || [];
    const hasErrors = errors.length > 0;
    return (
      <div
        className={classNames(ROOT, this.props.className, {
          [`${ROOT}--enabled-rest-reason`]: this.props.enabledRestReason,
        })}
      >
        <Label
          className={`${ROOT}__label`}
          text={this.props.label}
          marked={this.props.required}
          emphasis={this.props.emphasis}
        >
          <div className={`${ROOT}__container`}>
            <Input
              className={`${ROOT}__input`}
              {...mapPropsToInputProps(this.props)}
              error={hasErrors}
              icon={this.props.icon}
              testId={this.props.testId}
              type="number"
            />
            {this.props.enabledRestReason && (
              <div className={`${ROOT}__rest-reason`}>
                <RestReason
                  error={hasErrors}
                  value={this.props.otherRestReason?.value}
                  restTimeReasons={this.props.restTimeReasons}
                  onUpdateReason={this.props.otherRestReason?.onChange}
                  readOnly={this.props.readOnly}
                />
              </div>
            )}
          </div>
        </Label>
        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
