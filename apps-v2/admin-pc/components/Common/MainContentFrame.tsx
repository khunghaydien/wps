import React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import './MainContentFrame.scss';

const ROOT = 'admin-pc-common-main-content-frame';

export type Props = {
  ListPane: React.ReactNode;
  DetailPane: React.ReactNode;
  Dialogs: React.ReactNode[];
  isDetailVisible: boolean;
};

export default class MainContentFrame extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__list-pane`}>{this.props.ListPane}</div>

        <ReactCSSTransitionGroup
          classNames="ts-modal-transition-slideleft"
          timeout={{ enter: 200, exit: 200 }}
        >
          <div>
            {this.props.isDetailVisible ? (
              <div className={`${ROOT}__detail-pane`}>
                {this.props.DetailPane}
              </div>
            ) : null}
          </div>
        </ReactCSSTransitionGroup>

        {this.props.Dialogs}
      </div>
    );
  }
}
