import React, { useCallback, useEffect, useMemo, useState } from 'react';

import HorizontalLayout from '@apps/commons/components/fields/layouts/HorizontalLayout';
import TextField from '@apps/commons/components/fields/TextField';
import Tooltip from '@apps/commons/components/Tooltip';
import iconAttentions from '@apps/commons/images/iconAttention.png';
import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

export default function OvertimeWork(props) {
  const { config, tmpEditRecord, workSystem } = props;
  const [showBlank, setShowBlank] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const [showWaring, setIsShowWarning] = useState('none');

  useEffect(() => {
    if (config.key.indexOf('Warning') !== -1) {
      setShowBlank(true);
    } else {
      setShowBlank(false);
    }
  }, [config.key]);

  useEffect(() => {
    if (config.key.indexOf('Count') !== -1) {
      setShowCount(true);
    } else {
      setShowCount(false);
    }
  }, [config.key]);

  const modifiedYearlyStandardHours = {
    monthlyOvertimeLimit: 42,
    monthlyOvertimeWarning1: 42,
    monthlyOvertimeWarning2: 42,
    yearlyOvertimeLimit: 320,
    yearlyOvertimeWarning1: 320,
    yearlyOvertimeWarning2: 320,
    multiMonthOvertimeLimit: 80,
    multiMonthOvertimeWarning1: 80,
    multiMonthOvertimeWarning2: 80,
    specialMonthlyOvertimeLimit: 100,
    specialMonthlyOvertimeWarning1: 100,
    specialMonthlyOvertimeWarning2: 100,
    specialYearlyOvertimeLimit: 720,
    specialYearlyOvertimeWarning1: 720,
    specialYearlyOvertimeWarning2: 720,
    specialMultiMonthOvertimeLimit: 80,
    specialMultiMonthOvertimeWarning1: 80,
    specialMultiMonthOvertimeWarning2: 80,
    specialExtensionCountLimit: 6,
    specialExtensionCountWarning1: 6,
    specialExtensionCountWarning2: 6,
  };

  const othersStandardHours = {
    monthlyOvertimeLimit: 45,
    monthlyOvertimeWarning1: 45,
    monthlyOvertimeWarning2: 45,
    yearlyOvertimeLimit: 360,
    yearlyOvertimeWarning1: 360,
    yearlyOvertimeWarning2: 360,
    multiMonthOvertimeLimit: 80,
    multiMonthOvertimeWarning1: 80,
    multiMonthOvertimeWarning2: 80,
    specialMonthlyOvertimeLimit: 100,
    specialMonthlyOvertimeWarning1: 100,
    specialMonthlyOvertimeWarning2: 100,
    specialYearlyOvertimeLimit: 720,
    specialYearlyOvertimeWarning1: 720,
    specialYearlyOvertimeWarning2: 720,
    specialMultiMonthOvertimeLimit: 80,
    specialMultiMonthOvertimeWarning1: 80,
    specialMultiMonthOvertimeWarning2: 80,
    specialExtensionCountLimit: 6,
    specialExtensionCountWarning1: 6,
    specialExtensionCountWarning2: 6,
  };

  const compareInputTimeWithStandardTime = useCallback(
    (key) => {
      if (workSystem === 'ModifiedYearly' || workSystem === '') {
        if (tmpEditRecord[key] > modifiedYearlyStandardHours[key]) {
          setIsShowWarning('');
        } else {
          setIsShowWarning('none');
        }
      } else if (workSystem === 'Others') {
        if (tmpEditRecord[key] > othersStandardHours[key]) {
          setIsShowWarning('');
        } else {
          setIsShowWarning('none');
        }
      }
    },
    [workSystem, tmpEditRecord]
  );

  const isShowImgAlert = useMemo(() => {
    if (workSystem === 'ModifiedYearly' || workSystem === '') {
      if (config.key.indexOf('Count') === -1) {
        return TextUtil.template(
          msg().Admin_Lbl_OverStandardHoursLimit,
          msg()[config.msgkey],
          modifiedYearlyStandardHours[config.key]
        );
      } else {
        return TextUtil.template(
          msg().Admin_Lbl_OverStandardCountLimit,
          msg()[config.msgkey],
          othersStandardHours[config.key]
        );
      }
    } else if (workSystem === 'Others') {
      if (config.key.indexOf('Count') === -1) {
        return TextUtil.template(
          msg().Admin_Lbl_OverStandardHoursLimit,
          msg()[config.msgkey],
          othersStandardHours[config.key]
        );
      } else {
        return TextUtil.template(
          msg().Admin_Lbl_OverStandardCountLimit,
          msg()[config.msgkey],
          othersStandardHours[config.key]
        );
      }
    }
    return null;
  }, [config.key, workSystem, config.msgkey]);

  useEffect(() => {
    compareInputTimeWithStandardTime(config.key);
  }, [config.key]);

  return (
    <HorizontalLayout>
      {showBlank && (
        <HorizontalLayout.Label cols={4}>
          &nbsp;&nbsp;{msg()[config.msgkey]}
        </HorizontalLayout.Label>
      )}
      {!showBlank && (
        <HorizontalLayout.Label cols={4}>
          {msg()[config.msgkey]}
        </HorizontalLayout.Label>
      )}
      <HorizontalLayout.Body cols={30}>
        <div className="slds-grid slds-grid--vertical-align-center">
          <div className="slds-grow">
            <TextField
              key={config.key}
              id="overtimeWork"
              type="number"
              min="0"
              step="1"
              value={
                !tmpEditRecord[config.key] ? '' : tmpEditRecord[config.key]
              }
              onChange={(e) =>
                props.onChangeDetailItem(config.key, e.target.value, 'numeric')
              }
              onBlur={() => {
                compareInputTimeWithStandardTime(config.key);
              }}
            />
          </div>
          {!showCount && (
            <div style={{ margin: '0 0 0 8px' }}>{msg().Com_Lbl_Hours}</div>
          )}
          {showCount && (
            <div style={{ margin: '0 0 0 8px' }}>{msg().Admin_Lbl_Counts}</div>
          )}
          <div>
            <Tooltip align="right" content={isShowImgAlert}>
              <img
                style={{
                  width: '20px',
                  height: '20px',
                  margin: '0 0 0 8px',
                  display: showWaring,
                }}
                src={iconAttentions}
                alt={isShowImgAlert}
              />
            </Tooltip>
          </div>
        </div>
      </HorizontalLayout.Body>
    </HorizontalLayout>
  );
}
