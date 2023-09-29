import * as React from 'react';

import classNames from 'classnames';

const ROOT = 'mobile-app-atoms-utils-detect-overflow;';

type State = {
  isOverflowed: boolean;
};

export type Props = Readonly<{
  className?: string;
  children: React.FunctionComponent<State>;
}>;

export default class DetectOverflow extends React.Component<Props, State> {
  containerRef: { current: null | HTMLDivElement };

  constructor(props: Props) {
    super(props);

    this.containerRef = React.createRef();

    this.state = {
      isOverflowed: false,
    };
  }

  componentDidUpdate() {
    if (this.containerRef.current !== null) {
      const element = this.containerRef.current;
      const isOverflowed =
        element.offsetHeight < element.scrollHeight ||
        element.offsetWidth < element.scrollWidth;

      // NOTE
      // Be careful so as not to infinite loop if you would rewrite this code.
      if (this.state.isOverflowed !== isOverflowed) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          isOverflowed,
        });
      }
    }
  }

  render() {
    const className = classNames(ROOT, this.props.className);
    const Children = this.props.children;
    return (
      <div
        ref={this.containerRef}
        className={className}
        style={{ position: 'relative' }}
      >
        <Children {...this.state} />
      </div>
    );
  }
}
