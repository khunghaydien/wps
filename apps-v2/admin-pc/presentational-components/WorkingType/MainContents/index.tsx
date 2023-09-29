import React from 'react';
import { CSSTransition as ReactCSSTransitionGroup } from 'react-transition-group';

import _ from 'lodash';

import fieldType from '../../../constants/fieldType';

import '../../../../commons/styles/modal-transition-slideleft.css';
import msg from '../../../../commons/languages';

import * as ConfigUtil from '../../../utils/ConfigUtil';

import DetailContainer from '../../../containers/WorkingTypeContainer/DetailContainer';
import ListContainer from '../../../containers/WorkingTypeContainer/ListContainer';

import './index.scss';

const ROOT = 'admin-pc-contents';

type Props = {
  commonActions: any;
  configList: any;
  editRecord: any;
  tmpEditRecord: any;
  title: string;
  useFunction: any;
  isShowDetail: any;
};
/**
 * 設定画面の基礎クラス
 */
export default class MainContents extends React.Component<Props> {
  /**
   * 画面構成に必要な値をsalesforceobjectからconfigファイルを元に取得する
   */
  UNSAFE_componentWillMount() {
    const param = this.getAllConfigList()
      .filter((item) => {
        return item.type === fieldType.FIELD_SELECT && !_.isNil(item.path);
      })
      .map((item) => {
        return { key: item.props, path: item.path };
      });
    if (param.length > 0) {
      this.props.commonActions.getSFObjFieldValues(param);
    }
  }

  getAllConfigList() {
    const { base, history } = this.props.configList;
    return ConfigUtil.flatten(base, history);
  }

  renderDetailPane() {
    const title =
      this.props.editRecord.id !== '' ? msg().Com_Btn_Edit : msg().Com_Btn_New;
    const workSystem = this.props.tmpEditRecord.workSystem;
    return (
      <DetailContainer
        title={title}
        workSystem={workSystem}
        useFunction={this.props.useFunction}
      />
    );
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
            {/* FIXME: 3項演算子より良い方法がないか考える */}
            {!this.props.isShowDetail ? null : (
              <div className={`${ROOT}-detail`}>{this.renderDetailPane()}</div>
            )}
          </div>
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
