/* eslint-disable react/jsx-key */
import React from 'react';

import moment from 'moment';

import msg from '@apps/commons/languages';
import FormatUtil from '@apps/commons/utils/FormatUtil';

import GridColumn from '@psa/components/FinanceGrid/GridColumn';

import './index.scss';

export type Props = {
  activityData: any;
  currencyDecimal: number;
  currencySymbol: string;
  addedCols: Array<any>;
  setActiveCellId?: (cellId) => void;
  activeCellId?: string;
  updatePosition?: (
    posX,
    posY,
    offsetLeft,
    offsetTop,
    width,
    height,
    noteId,
    summaryInfo,
    detailInfo
  ) => void;
};

export const ROOT = 'ts-psa__finance-activity-grid';

const ActivityGrid = (props: Props) => {
  const { activityData, currencyDecimal, addedCols } = props;

  const today = moment();

  return (
    <div className={`${ROOT}`}>
      {activityData &&
        activityData.concat(addedCols).map((act) => {
          const actRow =
            act.roles &&
            act.roles[0].intervals.map(() => {
              return (
                <GridColumn
                  items={[
                    {
                      value: '',
                      background: '#eaf3fe',
                    },
                  ]}
                />
              );
            });
          return (
            <>
              <div className={`${ROOT}__activity-title-row`}>{actRow}</div>
              {act.roles &&
                act.roles.map((role) => {
                  return (
                    <div className={`${ROOT}__activity-title-row`}>
                      {role.intervals.concat(addedCols).map((interval) => {
                        const endDate = moment(interval.endDate, 'DD/MM/YYYY');
                        const colClass = today.isAfter(endDate)
                          ? '#eeeeee'
                          : '#ffffff';
                        const shadedColor = today.isAfter(endDate)
                          ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #EEEEEE'
                          : 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #FFFFFF';

                        let formattedPlannedAmount = FormatUtil.formatNumber(
                          interval.plannedAmt,
                          currencyDecimal
                        );
                        let plannedHours = `${interval.plannedHours} ${
                          msg().Psa_Lbl_FinanceHours
                        }`;
                        let formattedActualAmount = FormatUtil.formatNumber(
                          interval.actualAmt,
                          currencyDecimal
                        );
                        let formattedActualHours = `${interval.actualHours} ${
                          msg().Psa_Lbl_FinanceHours
                        }`;

                        if (interval === '-') {
                          formattedPlannedAmount = '';
                          plannedHours = '';
                          formattedActualAmount = '';
                          formattedActualHours = '';
                        }
                        return (
                          <GridColumn
                            setActiveCellId={props.setActiveCellId}
                            activeCellId={props.activeCellId}
                            updatePosition={props.updatePosition}
                            items={[
                              {
                                id: interval.breakdownId + '_PlannedAmt',
                                value: formattedPlannedAmount,
                                background: shadedColor,
                                noteId: interval.plannedAmtNoteId,
                                detailInfo: {
                                  breakdownId: interval.breakdownId,
                                  fieldType: 'PlannedAmt',
                                  isActivity: true,
                                  activityId: act.activityId,
                                  roleId: role.roleId,
                                },
                              },
                              {
                                id: interval.breakdownId + '_PlannedTime',
                                value: plannedHours,
                                background: shadedColor,
                                noteId: interval.plannedHoursNoteId,
                                detailInfo: {
                                  breakdownId: interval.breakdownId,
                                  fieldType: 'PlannedTime',
                                  isActivity: true,
                                  activityId: act.activityId,
                                  roleId: role.roleId,
                                },
                              },
                              {
                                id: interval.breakdownId + '_ActualAmt',
                                value: formattedActualAmount,
                                background: colClass,
                                noteId: interval.actualAmtNoteId,
                                detailInfo: {
                                  breakdownId: interval.breakdownId,
                                  fieldType: 'ActualAmt',
                                  isActivity: true,
                                  activityId: act.activityId,
                                  roleId: role.roleId,
                                },
                              },
                              {
                                id: interval.breakdownId + '_ActualTime',
                                value: formattedActualHours,
                                background: colClass,
                                noteId: interval.actualHoursNoteId,
                                detailInfo: {
                                  breakdownId: interval.breakdownId,
                                  fieldType: 'ActualTime',
                                  isActivity: true,
                                  activityId: act.activityId,
                                  roleId: role.roleId,
                                },
                              },
                            ]}
                          />
                        );
                      })}
                    </div>
                  );
                })}
            </>
          );
        })}
    </div>
  );
};

export default ActivityGrid;
