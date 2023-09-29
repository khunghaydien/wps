import React from 'react';

import styled from 'styled-components';

import SelectField from '@apps/commons/components/fields/SelectField';
import TextField from '@apps/commons/components/fields/TextField';
import msg from '@apps/commons/languages';
import Tooltip from '@commons/components/Tooltip';

import { AttOpsRecordAggregateSetting } from '@apps/admin-pc/models/attendance/AttOpsRecordAggregateSetting';

import './index.scss';

const ROOT = 'admin-pc-att-ops-record-aggregate-setting';

const S = {
  Span: styled.span`
    color: #000;
  `,
  Table: styled.table`
    width: 100%;
    border-collapse: collapse;
    & td,
    th {
      padding: 3;
      padding: 5px;
      border: 0px solid;
    }
  `,
};
type Props = {
  disabled: boolean;
  searchAttOpsRecord: AttOpsRecordAggregateSetting[];
  tempOpsRecordAggregate: AttOpsRecordAggregateSetting[];
  changeRecordfetatureByIndex: (
    index: number,
    key: keyof AttOpsRecordAggregateSetting,
    value: string
  ) => void;
  sfObjFieldValues: any;
  tmpEditRecordHistoryId: string;
};

const formatDestination = (index: number) => {
  return msg().Admin_Lbl_AggregateItem + index.toString().padStart(3, '0');
};

const formatDestinationTitle = (index) => {
  return `AggregateField${index.toString().padStart(3, '0')}__c`;
};

const OpsRecordAggregateList: React.FC<Props> = ({
  disabled,
  searchAttOpsRecord,
  tempOpsRecordAggregate,
  tmpEditRecordHistoryId,
  changeRecordfetatureByIndex,
  sfObjFieldValues,
}) => {
  const list = [];

  for (let i = 1; i <= 100; i++) {
    list.push({
      labelName: null,
      fieldName: null,
      extensionFrequencyLimit: formatDestination(i),
      disabled,
    });
  }

  const fieldNameOptions = [{ text: msg().Admin_Lbl_PleaseSelect, value: '' }];
  searchAttOpsRecord.forEach((config) => {
    fieldNameOptions.push({
      text: config.fieldName + '：' + config.label,
      value: config.fieldName,
    });
  });
  const aggregateTypeOptions = [];
  sfObjFieldValues.aggregateType.forEach((config) => {
    aggregateTypeOptions.push({
      text: msg()[config.label],
      value: config.value,
    });
  });

  return (
    <div>
      <S.Table>
        <tr>
          <th>{msg().Admin_Lbl_AggregateTo}</th>
          <th>
            <div className={`${ROOT}__tooltip`}>
              <div>{msg().Admin_Lbl_AggregateFrom}</div>
              <Tooltip
                align="top left"
                content={msg().Admin_Help_OpsRecordAggregateItem}
                className={`${ROOT}__icon_help`}
              >
                <div aria-label={msg().Admin_Help_OpsRecordAggregateItem}>
                  &nbsp;
                </div>
              </Tooltip>
            </div>
          </th>
          <th>{msg().Admin_Lbl_AggregateType}</th>
          <th>{msg().Admin_Lbl_Description}</th>
        </tr>
        {list.map((_, index) => {
          return (
            <>
              <tr>
                <td
                  style={{ width: '92px', minWidth: '92px', maxWidth: '92px' }}
                >
                  <S.Span title={formatDestinationTitle(index + 1)}>
                    {formatDestination(index + 1)}
                  </S.Span>
                </td>
                <td style={{ minWidth: '300px' }}>
                  <SelectField
                    onChange={(e) => {
                      changeRecordfetatureByIndex(
                        index,
                        'fieldName',
                        e.target.value
                      );
                    }}
                    options={fieldNameOptions}
                    value={
                      tempOpsRecordAggregate?.length > 0
                        ? tempOpsRecordAggregate[index]?.fieldName
                        : null
                    }
                    disabled={disabled}
                  />
                </td>
                <td style={{ minWidth: '138px' }}>
                  <SelectField
                    onChange={(e) => {
                      changeRecordfetatureByIndex(
                        index,
                        'aggregateType',
                        e.target.value
                      );
                    }}
                    options={aggregateTypeOptions}
                    value={
                      tempOpsRecordAggregate?.length > 0
                        ? tempOpsRecordAggregate[index]?.aggregateType
                        : null
                    }
                    disabled={disabled}
                  />
                </td>
                <td style={{ minWidth: '138px' }}>
                  {disabled ? (
                    <TextField
                      key={
                        tempOpsRecordAggregate?.length > 0
                          ? tempOpsRecordAggregate[index]?.label
                          : null
                      }
                      disabled={disabled}
                      maxLength={80}
                      value={
                        tempOpsRecordAggregate?.length > 0
                          ? tempOpsRecordAggregate[index]?.label
                          : null
                      }
                      onChange={(e) => {
                        changeRecordfetatureByIndex(
                          index,
                          'label',
                          e.target.value
                        );
                      }}
                    />
                  ) : (
                    <TextField
                      key={tmpEditRecordHistoryId}
                      disabled={disabled}
                      maxLength={80}
                      value={
                        tempOpsRecordAggregate?.length > 0
                          ? tempOpsRecordAggregate[index]?.label
                          : null
                      }
                      onChange={(e) => {
                        changeRecordfetatureByIndex(
                          index,
                          'label',
                          e.target.value
                        );
                      }}
                    />
                  )}
                </td>
              </tr>
            </>
          );
        })}
      </S.Table>
    </div>
  );
};

export default OpsRecordAggregateList;
