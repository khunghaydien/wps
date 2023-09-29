import * as React from 'react';

import classNames from 'classnames';

import Select from '../../../atoms/Fields/Select';
import RefreshButton from '../Buttons/RefreshButton';
import Navigation from '../Navigation';
import PagingHeader from '../PagingHeader';

import './MonthlyHeader.scss';

const ROOT = 'mobile-app-components-molecules-commons-headers-monthly-header';

type Props = Readonly<{
  className?: string;
  title: React.ReactNode;
  currentYearMonth: string;
  yearMonthOptions: Array<{
    value: string;
    label: string;
  }>;
  disabledPrevDate?: boolean;
  disabledNextDate?: boolean;
  onChangeMonth: (arg0: React.SyntheticEvent<HTMLSelectElement>) => void;
  onClickRefresh: (arg0: React.SyntheticEvent<Element>) => void;
  onClickPrevMonth?: () => void;
  onClickNextMonth?: () => void;
  children?: React.ReactNode;
}>;

export default class MonthlyHeader extends React.PureComponent<Props> {
  render() {
    const navActions = [
      <RefreshButton
        className={`${ROOT}__refresh`}
        onClick={this.props.onClickRefresh}
      />,
    ];
    const className = classNames(ROOT, this.props.className);
    return (
      <div className={className}>
        <Navigation title={this.props.title} actions={navActions} />
        <PagingHeader
          className={`${ROOT}__paging`}
          prevButtonLabel=""
          nextButtonLabel=""
          disabledPrevButton={this.props.disabledPrevDate}
          disabledNextButton={this.props.disabledNextDate}
          onClickPrev={this.props.onClickPrevMonth}
          onClickNext={this.props.onClickNextMonth}
        >
          <Select
            className={`${ROOT}__select-field`}
            value={this.props.currentYearMonth}
            options={this.props.yearMonthOptions}
            onChange={this.props.onChangeMonth}
          />
        </PagingHeader>
        {this.props.children}
      </div>
    );
  }
}
