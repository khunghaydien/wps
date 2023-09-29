import React from 'react';

import msg from '@apps/commons/languages';

import TitleColumn from '@psa/components/FinanceGrid/TitleColumn';

export type Props = {
  activityData: any;
  onRoleClick: (id: string) => void;
};

export const ROOT = 'ts-psa__finance-activity-title';

const ActivityTitle = (props: Props) => {
  const { activityData } = props;

  return (
    <div className={`${ROOT}`}>
      {activityData &&
        activityData.map((act) => {
          const actTitle = (
            <TitleColumn
              title={act.activityTitle}
              fontWeight={'700'}
              background={'#eaf3fe'}
              items={[
                {
                  name: '',
                },
              ]}
              mergedRows={1}
            />
          );
          const roleTitle =
            act.roles &&
            act.roles.map((role) => {
              return (
                <TitleColumn
                  title={role.roleTitle}
                  fontWeight={'400'}
                  items={[
                    {
                      name: msg().Psa_Lbl_FinancePlan,
                      mergedRows: 2,
                      background: '#eeeeee',
                    },
                    { name: msg().Psa_Lbl_FinanceActual, mergedRows: 2 },
                  ]}
                  mergedRows={4}
                  onClick={() => props.onRoleClick(role.roleId)}
                >
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    <p
                      style={{
                        fontWeight: 700,
                        color: '#333333',
                      }}
                    >
                      {role.roleTitle}
                    </p>
                    <p
                      style={
                        role.assigneeName
                          ? {
                              color: '#333333',
                            }
                          : {
                              color: '#999999',
                            }
                      }
                    >
                      {role.assigneeName || msg().Psa_Lbl_ToBeAssigned}
                    </p>
                    <p>{msg().Psa_Lbl_ViewDetails}</p>
                  </div>
                </TitleColumn>
              );
            });
          return (
            <>
              {actTitle}
              {roleTitle}
            </>
          );
        })}
    </div>
  );
};

export default ActivityTitle;
