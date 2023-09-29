import * as React from 'react';

import { $Shape } from 'utility-types';

type ClickEventHandler = (event: React.SyntheticEvent<Element>) => void;

export type ClickableProps = Readonly<{
  onClick?: ClickEventHandler;
}>;

export default <T extends $Shape<ClickableProps>>(
  WrappedComponent: React.ComponentType<T>
) => {
  return class extends React.PureComponent<T> {
    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event: React.SyntheticEvent<Element>): void {
      event.preventDefault();
      event.stopPropagation();

      if (this.props.onClick) {
        this.props.onClick(event);
      }
    }

    render() {
      return <WrappedComponent {...this.props} onClick={this.handleClick} />;
    }
  };
};
