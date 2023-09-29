import * as React from 'react';

import isEqual from 'lodash/isEqual';

import {
  Button,
  Dropdown as SFDropdown,
  DropdownTrigger,
  IconSettings,
} from '@salesforce/design-system-react';

import './Dropdown.scss';

const ROOT = 'commons-fields-dropdown';

/* eslint-disable react/no-unused-prop-types */
// NOTE eslint の flowtype プラグインが正しく未使用propsを追えないので、
// disableにしている

export type Option<T> = {
  // dom attribute
  id?: string;
  className?: string;

  // option type
  type: 'header' | 'item' | 'divider' | 'html';

  // content
  label?: string;
  value?: T;

  // divider
  divider?: 'top' | 'bottom';

  // icon
  leftIcon?: {
    name: string;
    category: string;
  };
  rightIcon?: {
    name: string;
    category: string;
  };

  // misc
  href?: string;
};

export type Props<T> = {
  label?: string;
  value?: T;
  disabled?: boolean;
  className?: string;
  options: Option<T>[];
  menuStyle?: string;
  onSelect?: (option: Option<T>) => void;
  'data-testid'?: string;
};

/* eslint-enable react/no-unused-prop-types */

const withStyle =
  <T extends Record<string, unknown>>(
    WrappedComponent: React.ComponentType<Props<T>>
  ) =>
  (props: Props<T>): React.ReactElement<unknown> =>
    (
      <WrappedComponent
        {...props}
        className={`${ROOT} ${props.className || ''}`}
      />
    );

const withState = <T extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<Props<T>>
): React.ComponentType<Props<T>> => {
  type PropsT = Props<T>;
  type State = { label?: string; value?: T };

  return class DropdownContainer extends React.Component<PropsT, State> {
    constructor(props: PropsT) {
      super(props);

      this.onSelect = this.onSelect.bind(this);
      this.findSelectedOption = this.findSelectedOption.bind(this);

      const option = this.findSelectedOption(props);
      this.state = {
        label: option.label,
        value: option.value,
      };
    }

    UNSAFE_componentWillReceiveProps(nextProps: PropsT) {
      if (nextProps.label !== this.props.label) {
        this.setState({
          label: nextProps.label,
        });
      }

      const isValueChanged = nextProps.value !== this.props.value;
      const isOptionsChanged =
        nextProps.options !== this.props.options &&
        !isEqual(nextProps.options, this.props.value);
      if (isValueChanged || isOptionsChanged) {
        const option = this.findSelectedOption(nextProps);
        this.setState({
          label: option.label,
          value: option.value,
        });
      }
    }

    onSelect(option: Option<T>): void {
      this.setState({
        label: this.props.label === '' ? '' : option.label,
        value: option.value,
      });

      if (this.props.onSelect) {
        this.props.onSelect(option);
      }
    }

    findSelectedOption({ options, label, value }: Props<T>) {
      const os = options || [];
      return (
        os.find((o) => o.value === value) ||
        ({ type: 'item', label } as Option<T>)
      );
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          onSelect={this.onSelect}
        />
      );
    }
  };
};

export const DropdownPresentation = <T extends Record<string, unknown>>({
  label,
  value,
  onSelect,
  options,
  className,
  disabled,
  menuStyle,
  'data-testid': testid,
}: Props<T>): React.ReactElement<'div'> => (
  <div className={className} data-testid={testid}>
    <IconSettings iconPath={window.__icon_path__}>
      <SFDropdown
        id={className}
        align="left"
        options={options}
        value={value}
        onSelect={onSelect}
        disabled={disabled}
        className={className}
        menuPosition="overflowBoundaryElement"
        menuStyle={menuStyle}
      >
        <DropdownTrigger>
          <Button
            iconCategory="utility"
            iconName="down"
            iconPosition="right"
            label={label}
            disabled={disabled}
            className={label ? '' : 'empty-content'}
          />
        </DropdownTrigger>
      </SFDropdown>
    </IconSettings>
  </div>
);

const compose =
  <T extends Record<string, unknown>>(...fns: Function[]) =>
  (name: string, presentation: React.ComponentType<Props<T>>) => {
    const container = fns.reduceRight(
      (prevFn: Function, nextFn: Function) =>
        (arg: React.ComponentType<Props<T>>) =>
          nextFn(prevFn(arg)),
      (value) => value
    );
    const component = container(presentation);
    component.displayName = name;

    return component;
  };

export default compose(withStyle, withState)('Dropdown', DropdownPresentation);
