import React from 'react';

import msg from '@apps/commons/languages';
import FormatUtil from '@apps/commons/utils/FormatUtil';

import GridColumn from '@psa/components/FinanceGrid/GridColumn';

export type Props = {
  activityData: any;
  currencyDecimal: number;
  currencySymbol: string;
};

export const ROOT = 'ts-psa__finance-activity-grid';

const ActivityEAC = (props: Props) => {
  const { activityData, currencyDecimal } = props;

  return (
    <div className={`${ROOT}`}>
      {activityData &&
        activityData.map((act) => {
          const actRow = (
            <GridColumn
              items={[
                {
                  value: '',
                  background: '#eaf3fe',
                },
              ]}
              width="100%"
            />
          );
          return (
            <>
              <div
                style={{ display: 'flex' }}
                className={`${ROOT}__activity-title-row`}
              >
                {actRow}
              </div>
              {act.roles &&
                act.roles.map((role) => {
                  return (
                    <div className={`${ROOT}__activity-title-row`}>
                      <GridColumn
                        items={[
                          {
                            value: FormatUtil.formatNumber(
                              role.totalPlannedAmt,
                              currencyDecimal
                            ),
                            background:
                              'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #FFFFFF',
                          },
                          {
                            value: `${role.totalPlannedHours} ${
                              msg().Psa_Lbl_FinanceHours
                            }`,
                            background:
                              'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #FFFFFF',
                          },
                          {
                            value: FormatUtil.formatNumber(
                              role.totalActualAmt,
                              currencyDecimal
                            ),
                            background: '#ffffff',
                          },
                          {
                            value: `${role.totalActualHours} ${
                              msg().Psa_Lbl_FinanceHours
                            }`,
                            background: '#ffffff',
                          },
                        ]}
                        width="100%"
                      />
                    </div>
                  );
                })}
            </>
          );
        })}
    </div>
  );
};

export default ActivityEAC;
