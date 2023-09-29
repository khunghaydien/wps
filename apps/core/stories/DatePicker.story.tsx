import React from 'react';

import moment from 'moment';

import { action } from '@storybook/addon-actions';

import { DatePicker } from '../index';

export default {
  title: 'core/DatePicker',
};

export const HasIcon = () => (
  <>
    locale: <LocaleSelect />
    <DatePicker
      showYearDropdown
      dateFormatCalendar="MMMM"
      onChange={action('onChange')}
    />
  </>
);

HasIcon.storyName = 'has icon';

export const HasNoIcon = () => (
  <>
    locale: <LocaleSelect />
    <DatePicker
      showsIcon={false}
      showYearDropdown
      dateFormatCalendar="MMMM"
      onChange={action('onChange')}
    />
  </>
);

HasNoIcon.storyName = 'has no icon';

const LocaleSelect = () => {
  const [locale, setLocale] = React.useState('en');

  React.useEffect(() => {
    moment.locale(locale);
  }, [locale]);

  const onChange = React.useCallback((e) => {
    setLocale(e.target.value);
  }, []);

  return (
    <select value={locale} onChange={onChange}>
      <option>en</option>
      <option>ja</option>
    </select>
  );
};
