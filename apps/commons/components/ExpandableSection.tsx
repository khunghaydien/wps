import React from 'react';

import classNames from 'classnames';
import uuidV4 from 'uuid/v4';

import SLDSSwitchIcon from '@salesforce-ux/design-system/assets/icons/utility/switch.svg';

import './ExpandableSection.scss';

const ROOT = 'commons-expandable-section';

type Props = {
  expanded?: boolean;
  summary?: React.ReactNode | ((arg0) => void);
  summaryLevel?: number | string;
  containerClassName?: string;
  className?: string;
  onToggle?: () => void;
  children?: React.ReactNode;
};

type State = {
  expanded: boolean;
  id: string;
};

export default class ExpandableSection extends React.Component<Props, State> {
  static defaultProps = {
    summaryLevel: 3,
  };

  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
    this.state = {
      id: uuidV4(),
      expanded: !!props.expanded,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.expanded !== nextProps.expanded) {
      this.setState({
        expanded: nextProps.expanded,
      });
    }
  }

  onToggle() {
    this.setState((prevState) => ({ expanded: !prevState.expanded }));

    if (this.props.onToggle) {
      this.props.onToggle();
    }
  }

  render() {
    const Summary = `h${this.props.summaryLevel}`;

    return (
      <section
        className={classNames(
          ROOT,
          {
            [`${ROOT}--expanded`]: this.state.expanded,
          },
          this.props.containerClassName
        )}
      >
        <div className={`${ROOT}__summary`}>
          {/* @ts-ignore */}
          <Summary className={`${ROOT}__summary-heading`}>
            <button
              type="button"
              className={`${ROOT}__summary-action`}
              aria-controls={this.state.id}
              aria-expanded={this.state.expanded}
              onClick={this.onToggle}
            >
              <>
                <SLDSSwitchIcon
                  className={`slds-button__icon slds-button__icon--left ${ROOT}__summary-action-icon`}
                  aria-hidden="true"
                />
                {typeof this.props.summary === 'function'
                  ? this.props.summary(this.state.expanded)
                  : this.props.summary}
              </>
            </button>
          </Summary>
        </div>
        <div
          id={this.state.id}
          className={classNames(
            `${ROOT}__content`,
            'slds-accordion__content',
            this.props.className
          )}
          aria-hidden={this.state.expanded}
        >
          {this.props.children}
        </div>
      </section>
    );
  }
}
