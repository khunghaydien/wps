import React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import '../../../commons/styles/modal-transition-slideleft.css';

import FractionGrantDialogContainer from '../../containers/ManagedLeaveManagementContainer/FractionGrantDialogContainer/FractionGrantDialogContainer';
import GrantSuccessMessageContainer from '@apps/admin-pc/containers/ManagedLeaveManagementContainer/FractionGrantDialogContainer/GrantSuccessMessageContainer';

import DetailPaneContainer from '../../containers/ManagedLeaveManagementContainer/DetailPaneContainer';
import ListPaneContainer from '../../containers/ManagedLeaveManagementContainer/ListPaneContainer';
import UpdateDialogContainer from '../../containers/ManagedLeaveManagementContainer/UpdateDialogContainer';

import './index.scss';

const ROOT = 'admin-pc-managed-leave-management';

export type Props = {
  isDetailVisible: boolean;
};

export default class ManagedLeaveManagement extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__list-pane`}>
          <ListPaneContainer />
        </div>

        <ReactCSSTransitionGroup
          classNames="ts-modal-transition-slideleft"
          timeout={{ enter: 200, exit: 200 }}
        >
          <div>
            {this.props.isDetailVisible ? (
              <div className={`${ROOT}__detail-pane`}>
                {/* @ts-ignore */}
                <DetailPaneContainer />
              </div>
            ) : null}
          </div>
        </ReactCSSTransitionGroup>
        <GrantSuccessMessageContainer />
        {/* @ts-ignore */}
        <UpdateDialogContainer />
        <FractionGrantDialogContainer />
      </div>
    );
  }
}
