import * as React from 'react';

import displayName from '../../../commons/concerns/displayName';

import IconButton from '../../../commons/components/buttons/IconButton';
import TextField from '../../../commons/components/fields/TextField';
import Form from '../../../commons/components/Form';
import btnSearch from '../../../commons/images/btnSearchVia.png';
import msg from '../../../commons/languages';
import { compose } from '../../../commons/utils/FnUtil';

const ROOT = 'admin-pc-expense-type-search-form';

export type Props = Readonly<{
  search: (
    arg0: Readonly<{
      name?: string;
      code?: string;
      parentExpenseTypeGroupName?: string;
      parentExpenseTypeGroupCode?: string;
    }>
  ) => void;
}>;

type InternalProps = Readonly<{
  expName?: string;
  expCode?: string;
  expGroupName?: string;
  expGroupCode?: string;
  updateValue: (key: string) => (value: string) => void;
  search: () => void;
}>;

const shouldComponentUpdate =
  (condition: (props: any) => boolean) =>
  (WrappedComponent: React.ComponentType<any>) => {
    return class extends React.Component<Props> {
      shouldComponentUpdate() {
        return condition(this.props);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };

const withSearchable = (WrappedComponent: React.ComponentType<any>) => {
  type State = {
    expName?: string;
    expCode?: string;
    expGroupName?: string;
    expGroupCode?: string;
  };

  return class extends React.PureComponent<Props, State> {
    state = {
      expName: '',
      expCode: '',
      expGroupName: '',
      expGroupCode: '',
    };

    updateValue = (key: string) => (value: string) =>
      this.setState({
        [key]: value,
      });

    search = () =>
      this.props.search({
        name: this.state.expName,
        code: this.state.expCode,
        parentExpenseTypeGroupName: this.state.expGroupName,
        parentExpenseTypeGroupCode: this.state.expGroupCode,
      });

    render() {
      return (
        <WrappedComponent
          {...(this.props as Record<string, any>)}
          {...this.state}
          updateValue={this.updateValue}
          search={this.search}
        />
      );
    }
  };
};

type controlState = {
  onChange: Function;
  onKeyDown: Function;
  label: string;
  value?: string;
};
const Control = ({ onChange, onKeyDown, label, value }: controlState) => {
  return (
    <div className={`${ROOT}__control`}>
      <div className={`${ROOT}__label`}>{label}</div>
      <div className={`${ROOT}__input`}>
        <TextField
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(e, text: string) => {
            if (e.key === 'Enter') {
              onKeyDown(text);
            }
          }}
          value={value}
          placeholder={msg().Admin_Lbl_Search}
        />
      </div>
    </div>
  );
};

class ExpSearchHeader extends React.PureComponent<InternalProps> {
  render() {
    return (
      <Form className={ROOT} onSubmit={() => this.props.search()}>
        <Control
          onChange={this.props.updateValue('expCode')}
          onKeyDown={() => this.props.search()}
          value={this.props.expCode}
          label={msg().Admin_Lbl_ExpenseTypeCode}
        />
        <Control
          onChange={this.props.updateValue('expName')}
          onKeyDown={() => this.props.search()}
          value={this.props.expName}
          label={msg().Admin_Lbl_ExpenseTypeName}
        />
        <Control
          onChange={this.props.updateValue('expGroupCode')}
          onKeyDown={() => this.props.search()}
          value={this.props.expGroupCode}
          label={msg().Admin_Lbl_ExpenseTypeGroupCode}
        />
        <Control
          onChange={this.props.updateValue('expGroupName')}
          onKeyDown={() => this.props.search()}
          value={this.props.expGroupName}
          label={msg().Admin_Lbl_ExpenseTypeGroupName}
        />
        <IconButton
          src={btnSearch}
          className={`${ROOT}__search-button`}
          onClick={() => this.props.search()}
        />
      </Form>
    );
  }
}

export default compose(
  displayName('ExpSearchFormView'),
  shouldComponentUpdate(() => false),
  withSearchable
)(ExpSearchHeader) as React.ComponentType<Record<string, any>>;
