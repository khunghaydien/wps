import * as React from 'react';

import displayName from '../../../commons/concerns/displayName';

import IconButton from '../../../commons/components/buttons/IconButton';
import TextField from '../../../commons/components/fields/TextField';
import Form from '../../../commons/components/Form';
import btnSearch from '../../../commons/images/btnSearchVia.png';
import msg from '../../../commons/languages';
import { compose } from '../../../commons/utils/FnUtil';

const ROOT = 'admin-pc-skillset-search-form';

export type Props = Readonly<{
  search: (
    arg0: Readonly<{
      name?: string;
      code?: string;
      categoryName?: string;
    }>
  ) => void;
}>;

type InternalProps = Readonly<{
  skillName?: string;
  skillCode?: string;
  skillCategory?: string;
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
    skillName?: string;
    skillCode?: string;
    skillCategory?: string;
  };

  return class extends React.PureComponent<Props, State> {
    state = {
      skillName: '',
      skillCode: '',
      skillCategory: '',
    };

    updateValue = (key: string) => (value: string) =>
      this.setState({
        [key]: value,
      });

    search = () =>
      this.props.search({
        name: this.state.skillName,
        code: this.state.skillCode,
        categoryName: this.state.skillCategory,
      });

    render() {
      return (
        <WrappedComponent
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
  autoFocus?: boolean;
};
const Control = ({
  onChange,
  onKeyDown,
  label,
  value,
  autoFocus = false,
}: controlState) => {
  return (
    <div className={`${ROOT}__control`}>
      <div className={`${ROOT}__label`}>{label}</div>
      <div className={`${ROOT}__input`}>
        <TextField
          onChange={(_e, test: string) => onChange(test)}
          onKeyDown={(e, text: string) => {
            if (e.key === 'Enter') {
              onKeyDown(text);
            }
          }}
          value={value}
          autoFocus={autoFocus}
          placeholder={msg().Admin_Lbl_Search}
        />
      </div>
    </div>
  );
};

class SkillsetSearchHeader extends React.PureComponent<InternalProps> {
  render() {
    return (
      <Form className={ROOT} onSubmit={() => this.props.search()}>
        <Control
          onChange={this.props.updateValue('skillCategory')}
          onKeyDown={() => this.props.search()}
          value={this.props.skillCategory}
          label={msg().Psa_Lbl_SkillsetCategory}
        />
        <Control
          onChange={this.props.updateValue('skillCode')}
          onKeyDown={() => this.props.search()}
          value={this.props.skillCode}
          label={msg().Psa_Lbl_SkillsetCode}
          autoFocus
        />
        <Control
          onChange={this.props.updateValue('skillName')}
          onKeyDown={() => this.props.search()}
          value={this.props.skillName}
          label={msg().Psa_Lbl_SkillsetName}
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
  displayName('SkillsetSearchFormView'),
  shouldComponentUpdate(() => false),
  withSearchable
)(SkillsetSearchHeader) as React.ComponentType<Record<string, any>>;
