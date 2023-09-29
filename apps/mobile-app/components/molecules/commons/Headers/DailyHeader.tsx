import * as React from 'react';

import classNames from 'classnames';

import DateSelect from '../Fields/DateSelect';
import Navigation from '../Navigation';
import PagingHeader from '../PagingHeader';

import './DailyHeader.scss';

const ROOT = 'mobile-app-components-molecules-commons-headers-daily-header';

type Props = Readonly<{
  className?: string;
  title: string;
  currentDate: string;
  backButtonLabel?: string;
  actions?: React.ReactElement<any>[];
  disabledPrevDate?: boolean;
  disabledNextDate?: boolean;
  onChangeDate?: (date: string) => void;
  onClickBackMonth?: () => void;
  onClickPrevDate?: () => void;
  onClickNextDate?: () => void;
  children?: React.ReactNode;
}>;

export default class DailyHeader extends React.PureComponent<Props> {
  render() {
    return (
      <div className={classNames(ROOT, this.props.className)}>
        <Navigation
          title={this.props.title}
          backButtonLabel={this.props.backButtonLabel}
          onClickBack={this.props.onClickBackMonth}
          actions={this.props.actions}
        />
        <PagingHeader
          className={`${ROOT}__paging`}
          prevButtonLabel=""
          nextButtonLabel=""
          disabledPrevButton={this.props.disabledPrevDate}
          disabledNextButton={this.props.disabledNextDate}
          onClickPrev={this.props.onClickPrevDate}
          onClickNext={this.props.onClickNextDate}
        >
          <DateSelect
            className={`${ROOT}__date-field`}
            onChange={this.props.onChangeDate}
            value={this.props.currentDate}
            disabled={!this.props.onChangeDate}
          />
          {this.props.children}
        </PagingHeader>
      </div>
    );
  }
}
