import React from 'react';

import {
  Combobox as SFCombobox,
  IconSettings,
} from '@salesforce/design-system-react';
import comboboxFilterAndLimit from '@salesforce/design-system-react/components/combobox/filter';

// TODO specify type for Selection
type Selection = any;

type Props = {
  disabled: boolean;
  action?: (string) => Function;
  onSelect?: (Selection) => void;
  options: Array<any>;
  placeholder?: string;
  selection?: Array<Selection>;
  limit?: number;
  'data-testid': string;
};

type State = {
  inputValue: string;
  selection: Selection;
};

class Combobox extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      selection: props.selection || [],
    };
  }

  static getDerivedStateFromProps(props) {
    const newProps = { selection: props.selection };
    if (props.inputValue) {
      Object.assign(newProps, { inputValue: props.inputValue });
    }
    return newProps;
  }

  render() {
    return (
      // eslint-disable-next-line no-underscore-dangle
      <IconSettings iconPath={(window as Window).__icon_path__}>
        <SFCombobox
          disabled={this.props.disabled}
          events={{
            onChange: (event, { value }) => {
              if (this.props.action) {
                this.props.action('onChange')(event, value);
              } else if (console) {
                console.log('onChange', event, value);
              }
              this.setState({ inputValue: value });
            },
            onRequestRemoveSelectedOption: (event, data) => {
              this.setState({
                inputValue: '',
                selection: data.selection,
              });
              this.props.onSelect(data.selection);
            },
            onSubmit: (event, { value }) => {
              if (this.props.action) {
                this.props.action('onChange')(event, value);
              } else if (console) {
                console.log('onChange', event, value);
              }
              this.setState((prevState) => ({
                inputValue: '',
                selection: prevState.selection,
              }));
            },
            onSelect: (event, data) => {
              if (this.props.action) {
                this.props.action('onSelect')(
                  event,
                  ...Object.keys(data).map((key) => data[key])
                );
              } else if (console) {
                console.log('onSelect', event, data);
              }
              if (data.selection.length > 5) {
                return false;
              } else {
                this.setState({
                  inputValue: '',
                  selection: data.selection,
                });
                return this.props.onSelect(data.selection);
              }
            },
          }}
          labels={{
            placeholder: this.props.placeholder,
          }}
          menuItemVisibleLength={5}
          multiple
          options={comboboxFilterAndLimit({
            inputValue: this.state.inputValue,
            options: this.props.options,
            limit: this.props.limit || this.props.options.length,
            selection: this.state.selection,
          })}
          selection={this.state.selection}
          value={this.state.inputValue}
        />
      </IconSettings>
    );
  }
}

export default Combobox;
