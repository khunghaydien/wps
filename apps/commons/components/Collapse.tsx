import * as React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import BtnDetailClose from '../images/btnDetailClose.png';
import BtnDetailOpen from '../images/btnDetailOpen.png';
import IconButton from './buttons/IconButton';

import './Collapse.scss';

const ROOT = 'ts-collapse';

type Props = Readonly<{
  children: React.ReactElement<any>;
  closeIcon?: string;
  openIcon?: string;
  header: string;
  isCollapsed: boolean;
  summary?: React.ReactNode;
  btnSrcType?: 'default' | 'svg';
}>;

type State = {
  isCollapsed: boolean;
};

export default class Collapse extends React.Component<Props, State> {
  static get defaultProps() {
    return {
      isCollapsed: false,
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      isCollapsed: this.props.isCollapsed,
    };

    this.onClickToggle = this.onClickToggle.bind(this);
    this.onKeypressToggle = this.onKeypressToggle.bind(this);
  }

  onClickToggle() {
    this.toggleCollapse();
  }

  onKeypressToggle(e: React.KeyboardEvent<HTMLAnchorElement>) {
    if (e.key === 'Enter') {
      this.toggleCollapse();
    }
  }

  toggleCollapse() {
    this.setState((prevState) => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  }

  renderChildren() {
    if (this.state.isCollapsed) {
      return null;
    } else {
      return <div className={`${ROOT}__children`}>{this.props.children}</div>;
    }
  }

  render() {
    const closeIcon = this.props.closeIcon || BtnDetailClose;
    const openIcon = this.props.openIcon || BtnDetailOpen;
    const btnImage = this.state.isCollapsed ? openIcon : closeIcon;

    return (
      <div className={ROOT}>
        <div className={`${ROOT}__header`}>
          <IconButton
            onClick={this.onClickToggle}
            src={btnImage}
            className={`${ROOT}__header-button`}
            alt="collapse"
            srcType={this.props.btnSrcType}
          />
          <a
            onClick={this.onClickToggle}
            onKeyPress={this.onKeypressToggle}
            className={`${ROOT}__header-anchor`}
          >
            {this.props.header}
          </a>

          <div className={`${ROOT}__summary`}>{this.props.summary}</div>
        </div>

        <ReactCSSTransitionGroup
          classNames={ROOT}
          timeout={{ enter: 300, exit: 300 }}
        >
          <div>{this.renderChildren()}</div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
