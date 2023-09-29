import * as React from 'react';

import { $Shape } from 'utility-types';

export type ClosableProps = {
  isOpened?: boolean;
  onClickCloseButton?: () => void;
};

type Props = $Shape<ClosableProps>;

type State = {
  isOpening: boolean;
};

/**
 * Manage state of open/close
 */
const closable = <T extends Props>(
  WrappedComponent: React.ComponentType<T>
) => {
  return class Closable extends React.PureComponent<T, State> {
    static getDerivedStateFromProps(nextProps: Props, _state: State): State {
      const opened =
        nextProps.isOpened === undefined || nextProps.isOpened === null
          ? true
          : nextProps.isOpened;
      return {
        isOpening: opened || false,
      };
    }

    constructor(props: Props) {
      // @ts-ignore
      super();
      this.onClickCloseButton = this.onClickCloseButton.bind(this);
      this.state = (
        this.constructor as typeof Closable
      ).getDerivedStateFromProps(props, this.state);
    }

    onClickCloseButton() {
      this.setState({
        isOpening: false,
      });
      if (this.props.onClickCloseButton) {
        this.props.onClickCloseButton();
      }
    }

    render() {
      return this.state.isOpening ? (
        <WrappedComponent
          {...this.props}
          onClickCloseButton={this.onClickCloseButton}
        />
      ) : null;
    }
  };
};

export default closable;
