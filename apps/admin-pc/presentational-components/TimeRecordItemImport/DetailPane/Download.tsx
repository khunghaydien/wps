import * as React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import { IconButton, Icons } from '@apps/core';
import { Color } from '@apps/core/styles';

import './Download.scss';

const ROOT = 'admin-pc-time-record-item-import-detail-pane-download';

export type Props = Readonly<{
  actedAt: string;
  actor: string;
  status: string;
  count: number;
  successCount: number;
  failureCount: number;
  canDownload: boolean;
  onClickDownload: () => void;
  onClickRefresh: () => void;
}>;

export default class Download extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <HorizontalLayout>
          <HorizontalLayout.Label>
            {msg().Admin_Lbl_ExecutedAt}
          </HorizontalLayout.Label>
          <HorizontalLayout.Body>
            {this.props.actedAt
              ? DateUtil.formatYMDhhmm(this.props.actedAt)
              : ''}
          </HorizontalLayout.Body>
        </HorizontalLayout>
        <HorizontalLayout>
          <HorizontalLayout.Label>
            {msg().Admin_Lbl_Status}
          </HorizontalLayout.Label>
          <HorizontalLayout.Body>
            {msg()[`Batch_Lbl_${this.props.status}`]}
          </HorizontalLayout.Body>
        </HorizontalLayout>
        <HorizontalLayout>
          <HorizontalLayout.Label>
            {msg().Admin_Lbl_Actor}
          </HorizontalLayout.Label>
          <HorizontalLayout.Body>{this.props.actor}</HorizontalLayout.Body>
        </HorizontalLayout>
        <HorizontalLayout className={`${ROOT}__log-layout`}>
          <HorizontalLayout.Label>{msg().Admin_Lbl_Log}</HorizontalLayout.Label>
          <HorizontalLayout.Body>
            <div>
              {this.props.canDownload ? (
                <Button onClick={this.props.onClickDownload}>
                  {msg().Admin_Lbl_Download}
                </Button>
              ) : (
                <IconButton
                  icon={Icons.Refresh}
                  color={Color.accent}
                  onClick={this.props.onClickRefresh}
                />
              )}
            </div>
            <HorizontalLayout className={`${ROOT}__log-result`}>
              <HorizontalLayout.Label>
                {msg().Admin_Lbl_CountAppliedNumber}
              </HorizontalLayout.Label>
              <HorizontalLayout.Body>{this.props.count}</HorizontalLayout.Body>
            </HorizontalLayout>
            <HorizontalLayout>
              <HorizontalLayout.Label>
                {msg().Admin_Lbl_CountAppliedSuccessNumber}
              </HorizontalLayout.Label>
              <HorizontalLayout.Body>
                {this.props.successCount}
              </HorizontalLayout.Body>
            </HorizontalLayout>
            <HorizontalLayout>
              <HorizontalLayout.Label>
                {msg().Admin_Lbl_CountAppliedErrorNumber}
              </HorizontalLayout.Label>
              <HorizontalLayout.Body>
                {this.props.failureCount}
              </HorizontalLayout.Body>
            </HorizontalLayout>
          </HorizontalLayout.Body>
        </HorizontalLayout>
      </div>
    );
  }
}
