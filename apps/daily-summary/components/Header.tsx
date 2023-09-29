import React from 'react';

import styled from 'styled-components';

import msg from '../../commons/languages';
import {
  ArrowLeftButton,
  ArrowRightButton,
  DatePicker,
  Text,
} from '../../core';

type Props = Readonly<{
  targetDate: string | null | undefined;
  onClickPrev: () => void;
  onClickNext: () => void;
  onSelectDate: (value: Date) => void;
}>;

const S = {
  Wrapper: styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  `,
  Navigation: styled.div`
    display: inline-flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
  `,
  TextDate: styled(Text)`
    margin: 0 28px;
  `,
  DatePickerWrapper: styled.div`
    width: 160px;
    margin: 0 6px;
  `,
};

const Header = ({
  targetDate,
  onClickPrev,
  onClickNext,
  onSelectDate,
}: Props) => {
  // React-datepicker returns moment, Convert to Date and then callback
  const onChange = React.useCallback(
    (date: null | Date) => {
      if (date) {
        onSelectDate(date);
      }
    },
    [onSelectDate]
  );

  const locale = window.empInfo && window.empInfo.locale;

  const value = React.useMemo(() => {
    return targetDate
      ? new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          weekday: 'short',
        }).format(new Date(targetDate))
      : '';
  }, [targetDate, locale]);

  const selected = React.useMemo(
    () => (targetDate ? new Date(targetDate) : new Date()),
    [targetDate]
  );

  return (
    <S.Wrapper>
      <Text bold size="xxl" color="dialogTitle">
        {msg().Cal_Lbl_DailySummary}
      </Text>
      <S.Navigation>
        <ArrowLeftButton onClick={onClickPrev} />
        <S.DatePickerWrapper>
          <DatePicker
            value={value}
            selected={selected}
            onChange={onChange}
            placeholderText={
              value
              /*
               * 入力欄が空欄のときにカレンダーで対象日と同じ日付が選択された場合に、
               * 入力欄が更新されず対象日が分からなくなるので、
               * 空欄の場合は対象日が表示されるようにplaceholderを設定している
               * https://teamspiritdev.atlassian.net/browse/WPB-352
               */
            }
          />
        </S.DatePickerWrapper>
        <ArrowRightButton onClick={onClickNext} />
      </S.Navigation>
    </S.Wrapper>
  );
};

export default Header;
