import * as React from 'react';

type Props = {
  config: {
    key: string;
    isRequired: boolean;
  };
  disabled: boolean;
  tmpEditRecord: Record<string, any>;
  // false positive
  // eslint-disable-next-line react/no-unused-prop-types
  tmpEditRecordBase: Record<string, any>;
  onChangeDetailItem: (arg0: string, arg1: any) => void;
};

type Methods<T> = {
  checkReceiveProps: (arg0: T, arg1: T) => boolean;
  getDefaultValue: (arg0: T) => any;
};

export default <InputProps extends Props>(methods: Methods<InputProps>) =>
  (Component: React.ComponentType<any>) => {
    return class extends React.Component<InputProps> {
      checkReceiveProps: Methods<InputProps>['checkReceiveProps'];
      getDefaultValue: Methods<InputProps>['getDefaultValue'];

      constructor(props: InputProps) {
        super(props);
        this.checkReceiveProps = methods.checkReceiveProps.bind(this);
        this.getDefaultValue = methods.getDefaultValue.bind(this);
      }

      componentDidMount() {
        this.setDefault(this.props);
      }

      UNSAFE_componentWillReceiveProps(nextProps: InputProps) {
        if (this.checkReceiveProps(this.props, nextProps)) {
          this.setDefault(nextProps);
        }
      }

      setDefault(props: InputProps) {
        this.props.onChangeDetailItem(
          props.config.key,
          this.getDefaultValue(props)
        );
      }

      render() {
        return <Component {...this.props} />;
      }
    };
  };
