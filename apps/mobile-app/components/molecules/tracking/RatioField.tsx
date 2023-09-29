import * as React from 'react';

import displayName from '../../../../commons/concerns/displayName';

import { compose } from '../../../../commons/utils/FnUtil';

import Input from '../../atoms/Fields/Input';

type Props = Readonly<{
  testId?: string;
  className?: string;
  placeholder?: string;
  value: number;
  disabled?: boolean;
  readOnly?: boolean;
  onBlur: (value: number) => void;
}>;

const withState = (WrappedComponent) => {
  type State = {
    prevValue: number;
    value: string;
  };

  return class extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Props, state: State) {
      if (state && state.prevValue !== props.value) {
        return {
          prevValue: props.value,
          value: props.value.toString(),
        };
      } else {
        return state;
      }
    }

    constructor(props: Props) {
      super(props);

      this.state = {
        prevValue: props.value,
        value: props.value.toString(),
      };

      this.onChange = this.onChange.bind(this);
      this.onBlur = this.onBlur.bind(this);
    }

    onChange(e: React.SyntheticEvent<any>): void {
      e.preventDefault();
      e.stopPropagation();

      this.setState({
        value: ((e.target as HTMLInputElement).value || '').substring(0, 3),
      });
    }

    onBlur(e: React.SyntheticEvent<any>): void {
      e.preventDefault();
      e.stopPropagation();

      let value = parseInt((e.target as HTMLInputElement).value);
      if (value > 100) {
        value = 100;
      }
      if (value < 0) {
        value = 0;
      }
      this.setState({
        value: value.toString(),
      });
      this.props.onBlur(value);
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onChange={this.onChange}
          onBlur={this.onBlur}
        />
      );
    }
  };
};

type PresentationProps = Readonly<
  Props & {
    value: string;
    onChange: (e: React.SyntheticEvent<any>) => void;
    onBlur: (e: React.SyntheticEvent<any>) => void;
  }
>;

const Presentation = class extends React.PureComponent<PresentationProps> {
  render() {
    return (
      <Input
        type="number"
        testId={this.props.testId}
        className={this.props.className}
        maxLength={3}
        min={0}
        max={100}
        placeholder={this.props.placeholder}
        disabled={this.props.disabled}
        readOnly={this.props.readOnly}
        value={this.props.value}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
      />
    );
  }
};

export default compose(withState, displayName('RatioField'))(Presentation);
