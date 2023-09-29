import React from 'react';
import AnimateHeight from 'react-animate-height';

import classNames from 'classnames';
import uuid from 'uuid/v1';

import Button from '../../commons/components/buttons/Button';
import imgIconArrowDown from '../../commons/images/iconArrowDown.png';

import './Collapse.scss';

const ROOT = 'approvals-pc-collapse';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  headingLevel: number;
  header: Record<string, any> | Array<any>;
  title: string;
};

type State = {
  isOpen: boolean;
  collapseId?: string;
};

export default class Collapse extends React.Component<Props, State> {
  static defaultProps = {
    isOpen: false,
    headingLevel: 3,
    header: null,
    title: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      collapseId: `${ROOT}-${uuid()}`,
    };

    this.onClickToggle = this.onClickToggle.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      this.state = {
        isOpen: nextProps.isOpen,
      };
    }
  }

  onClickToggle() {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  }

  render() {
    const height = this.state.isOpen ? 'auto' : 0;

    const Heading: any = `h${this.props.headingLevel}`;

    const buttonClass = classNames(`${ROOT}__toggle`, {
      [`${ROOT}__toggle--is-open`]: this.state.isOpen,
    });
    return (
      <section className={`${ROOT}`}>
        <header className={`${ROOT}__header`}>
          <>
            <Button
              type="default"
              className={buttonClass}
              onClick={this.onClickToggle}
              aria-expanded={this.state.isOpen}
              aria-controls={this.state.collapseId}
            >
              <img src={imgIconArrowDown} alt="toggle" />
            </Button>

            <Heading>{this.props.title}</Heading>

            {this.props.header}
          </>
        </header>
        <AnimateHeight height={height}>
          <div id={this.state.collapseId} className={`${ROOT}__panel`}>
            {this.props.children}
          </div>
        </AnimateHeight>
      </section>
    );
  }
}
