import * as React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { $Shape } from 'utility-types';

import './PageTransition.scss';

export type Props = $Shape<{
  readonly transitionKey: string;
  readonly children: React.ReactNode;
}>;

export default class PageTransition extends React.Component<Props> {
  render() {
    const { transitionKey, children } = this.props;
    return (
      <TransitionGroup>
        <CSSTransition
          key={transitionKey}
          classNames="page-transition"
          timeout={1000}
          mountOnEnter
          unmountOnExit
          appear
        >
          <div>{children}</div>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
