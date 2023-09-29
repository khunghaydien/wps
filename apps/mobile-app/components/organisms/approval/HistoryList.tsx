import React from 'react';

import classNames from 'classnames';
import { head, slice } from 'lodash';

import msg from '../../../../commons/languages';

import { ApprovalHistory } from '../../../../domain/models/approval/request/History';

import Icon from '../../atoms/Icon';
import TextButton from '../../atoms/TextButton';
import HistoryListItem from '../../molecules/approval/HistoryListItem';

import './HistoryList.scss';

const ROOT = 'mobile-app-organisms-approval-history-list';

type State = {
  isHistoryClose: boolean;
};

type Props = {
  className?: string;
  historyList: ApprovalHistory[];
};

export default class HistoryList extends React.PureComponent<Props, State> {
  state = { isHistoryClose: true };

  onClickToggleHistoryButton = () => {
    this.setState((prevState) => ({
      isHistoryClose: !prevState.isHistoryClose,
    }));
  };

  render() {
    const { historyList } = this.props;
    const { isHistoryClose } = this.state;
    const className = classNames(ROOT, this.props.className);
    const first = head(historyList);
    const other = slice(historyList, 1);
    const isShowSeeMore = other && other.length > 0;

    return (
      <div className={className}>
        {first && (
          <HistoryListItem
            className={`${ROOT}__item`}
            key={first.id}
            history={first}
          />
        )}
        {isShowSeeMore && (
          <React.Fragment>
            {!isHistoryClose &&
              other.map((history) => (
                <HistoryListItem
                  className={`${ROOT}__item`}
                  key={history.id}
                  history={history}
                />
              ))}
            <TextButton onClick={this.onClickToggleHistoryButton}>
              <div className={`${ROOT}__read-more`}>
                <div>
                  <Icon type={isHistoryClose ? 'chevrondown' : 'chevronup'} />
                </div>
                {isHistoryClose
                  ? msg().Appr_Btn_ReadMore
                  : msg().Appr_Btn_Close}
              </div>
            </TextButton>
          </React.Fragment>
        )}
      </div>
    );
  }
}
