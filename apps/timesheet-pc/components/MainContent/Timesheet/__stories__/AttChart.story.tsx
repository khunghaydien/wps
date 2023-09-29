import React from 'react';

import PropTypes from 'prop-types';

import AttRecordModel from '../../../../models/AttRecord';

import AttChart from '../AttChart';
import { actualWorkingPeriods } from './mock-data/graphParams';

const AddGauge = (props) => {
  const units = [];
  for (let i = 0; i <= 24 * 2; i += 2) {
    units.push(
      <span style={{ flex: '0 0 40px', textAlign: 'center' }}>{i % 24}</span>
    );
  }
  return (
    <div>
      <div style={{ display: 'flex' }}>{units}</div>
      {props.children}
    </div>
  );
};
AddGauge.propTypes = { children: PropTypes.node.isRequired };

export default {
  title: 'timesheet-pc/MainContent/Timesheet',
};

export const _AttChart = () => (
  <AddGauge>
    <AttChart
      dayType={AttRecordModel.DAY_TYPE.WORKDAY}
      actualWorkingPeriodList={actualWorkingPeriods}
    />
    <AttChart
      dayType={AttRecordModel.DAY_TYPE.HOLIDAY}
      actualWorkingPeriodList={actualWorkingPeriods}
    />
    <AttChart
      dayType={AttRecordModel.DAY_TYPE.LEGAL_HOLIDAY}
      actualWorkingPeriodList={actualWorkingPeriods}
    />
  </AddGauge>
);

_AttChart.storyName = 'AttChart';
_AttChart.parameters = {
  info: { propTables: [AttChart], inline: true, source: true },
};
