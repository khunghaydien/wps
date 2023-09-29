import * as React from 'react';

import TextField from '../../../../commons/components/fields/TextField';
import msg from '../../../../commons/languages/index';

import { Column } from '../DataGridColumn';

import './TextFieldFilter.scss';

const ROOT = 'admin-pc-data-grid-text-field-filter';

type Props = {
  onChange: (arg0: { filterTerm: string; column: Column }) => void;
  column: Column;
};

type State = {
  value: string;
};

type PresentationProps = {
  onTextFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & State &
  Props;

const withState = (WrappedComponent: React.ComponentType<PresentationProps>) =>
  class TextFieldFilterContainer extends React.Component<Props, State> {
    constructor(_props: Props) {
      // @ts-ignore
      super();

      this.handleOnChange = this.handleOnChange.bind(this);

      this.state = {
        value: '',
      };
    }

    handleOnChange(event: React.ChangeEvent<any>) {
      const value = event.target.value;
      this.setState({ value: event.target.value });
      this.props.onChange({ filterTerm: value, column: this.props.column });
    }

    render() {
      const inputKey = `header-filter-${this.props.column.key}`;
      return (
        <WrappedComponent
          key={inputKey}
          {...this.props}
          {...this.state}
          onTextFieldChange={this.handleOnChange}
        />
      );
    }
  };

const TextFieldFilterPresentation = ({
  value,
  onTextFieldChange,
  ..._props
}: PresentationProps) => (
  <div id={ROOT} className={ROOT}>
    <TextField
      onChange={onTextFieldChange}
      value={value}
      placeholder={msg().Admin_Lbl_Search}
    />
  </div>
);

const Component = withState(TextFieldFilterPresentation);
// @ts-ignore
Component.displayName = 'TextFieldFilter';

export default Component;
