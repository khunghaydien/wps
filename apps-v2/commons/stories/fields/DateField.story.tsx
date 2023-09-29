import React from 'react';

import moment from 'moment';

import { action } from '@storybook/addon-actions';

import DateField from '../../components/fields/DateField';

interface State {
  value: string;
}

class LocaleSelect extends React.Component {
  state: State;
  constructor(props) {
    super(props);

    this.state = { value: 'en' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    moment.locale(e.target.value);
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <select value={this.state.value} onChange={this.handleChange}>
        <option>en</option>
        <option>ja</option>
      </select>
    );
  }
}

class DateFieldContainer extends React.Component {
  state: State;
  constructor(props) {
    super(props);

    this.state = {
      value: '2017-03-01',
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    action('onChange')(value);
    this.setState({
      value,
    });
  }

  render() {
    return <DateField onChange={this.onChange} value={this.state.value} />;
  }
}

export default {
  title: 'commons/fields',
  parameters: {
    info: { propTables: [DateField], inline: true, source: true },
  },
};

export const DataFieldHasInitialValue = () => {
  const defaultValue = '2017-03-01';
  return (
    <div>
      <DateField value={defaultValue} onChange={action('onChange')} />
      <LocaleSelect />
    </div>
  );
};

DataFieldHasInitialValue.storyName = 'DateField - 初期値あり';

export const DataFieldHasNoInitialValue = () => (
  <div>
    <DateField onChange={action('onChange')} />
    <LocaleSelect />
  </div>
);

export const DataFieldSpecifySelectableLowerLimit = () => (
  <div>
    <DateField minDate={'2017-09-15' as any} onChange={action('onChange')} />
  </div>
);
DataFieldSpecifySelectableLowerLimit.storyName =
  'DateField - 選択可能な下限の指定あり （日付：YYYY-MM-DD形式）';

export const DataFieldSpecifySelectableDaysLowerLimit = () => (
  <div>
    <DateField minDays={-1} onChange={action('onChange')} />
  </div>
);

DataFieldSpecifySelectableDaysLowerLimit.storyName =
  'DateField - 選択可能な下限の指定あり （日数）';

export const DataFieldSpecifyHigherLimit = () => (
  <div>
    <DateField maxDate={'2017-09-15' as any} onChange={action('onChange')} />
  </div>
);
DataFieldSpecifyHigherLimit.storyName =
  'DateField - 選択可能な上限の指定あり （日付：YYYY-MM-DD形式）';

export const DataFieldSpecifyHigherDaysLimit = () => (
  <div>
    <DateField maxDays={7} onChange={action('onChange')} />
  </div>
);

DataFieldSpecifyHigherDaysLimit.storyName =
  'DateField - 選択可能な上限の指定あり （日数）';

export const DataFieldDisabled = () => (
  <div>
    <DateField disabled onChange={action('onChange')} />
  </div>
);

DataFieldDisabled.storyName = 'DateField - disabled';

export const DataFieldWithContainer = () => <DateFieldContainer />;

DataFieldWithContainer.storyName = 'DateField - with Container';

DataFieldWithContainer.parameters = {
  info: {
    text: `
  Containerでvalueを管理した際のサンプル
  `,
    propTables: false,
    inline: true,
    source: true,
  },
};
