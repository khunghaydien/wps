import React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import '../../../../commons/styles/modal-transition-slideleft.css';

import * as ConfigUtil from '../../../utils/ConfigUtil';

import DetailContainer from '../../../containers/AttendanceFeatureSettingContainer/DetailContainer';
import ListContainer from '../../../containers/AttendanceFeatureSettingContainer/ListContainer';

import './index.scss';

const ROOT = 'admin-pc-contents';

type Props = {
  configList: any;
  editRecord: any;
  title: string;
  useFunction: any;
  isShowDetail: any;
};
/**
 * 設定画面の基礎クラス
 */
export default class MainContents extends React.Component<Props> {
  getAllConfigList() {
    const { base, history } = this.props.configList;
    return ConfigUtil.flatten(base, history);
  }

  renderDetailPane() {
    return <DetailContainer useFunction={this.props.useFunction} />;
  }

  render() {
    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}-list`}>
          <ListContainer
            title={this.props.title}
            useFunction={this.props.useFunction}
          />
        </div>
        <ReactCSSTransitionGroup
          classNames="ts-modal-transition-slideleft"
          timeout={{ enter: 200, exit: 200 }}
        >
          <div>
            {this.props.isShowDetail ? (
              <div className={`${ROOT}-detail`}>{this.renderDetailPane()}</div>
            ) : null}
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
