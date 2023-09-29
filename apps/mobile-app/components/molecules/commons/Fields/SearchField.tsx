import React from 'react';

import Errors from '../../../atoms/Errors';
import Input from '../../../atoms/Fields/Input';
import Label from '../../../atoms/Label';

const ROOT = 'mobile-app-molecules-commons-field-search-field';

type Props = Readonly<{
  placeHolder: string;
  iconClick?: () => void;
  errors?: string[];
  required?: boolean;
  onChange: (arg0: React.SyntheticEvent<any>) => void;
  label?: string;
  value: string;
  isHideKeyboard?: boolean;
}>;

export default class SearchField extends React.Component<Props> {
  render() {
    const errors = this.props.errors || [];
    const hasErrors = errors.length > 0;

    return (
      <div className={ROOT}>
        <Label
          className={`${ROOT}__label`}
          text={this.props.label || ''}
          marked={this.props.required}
        >
          <Input
            error={hasErrors}
            type="text"
            className={`${ROOT}__input`}
            icon="search"
            onChange={this.props.onChange}
            value={this.props.value}
            iconClick={this.props.iconClick}
            placeholder={this.props.placeHolder}
            isHideKeyboard={this.props.isHideKeyboard}
          />
        </Label>
        {hasErrors ? <Errors messages={errors} /> : null}
      </div>
    );
  }
}
