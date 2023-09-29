import defaultPermission from '@apps/domain/models/access-control/Permission';

import configureStore from '../../../../store/configureStore';

const state = {
  common: {
    accessControl: {
      permission: {
        ...defaultPermission,
      },
    },
  },
  entities: {
    summary: {
      targetDate: '2019-7-20',
      content: {
        useRequest: true,
        targetDate: '2019-7-20',
        startDate: '2019-7-16',
        endDate: '2019-8-15',
        request: {
          status: 'NotRequested',
          approverName: 'TeamSpirit',
        },
        taskSummaryRecords: [
          {
            jobName: 'R06(19/07)_WSP_Entire',
            workCategoryName: 'Design',
            workTimeRatio: 62.0,
            workTime: 5829,
            isEditLocked: false,
          },
          {
            jobName: 'R06(19/07)_WSP_Entire',
            workCategoryName: 'Meeting&Others',
            workTimeRatio: 23.0,
            workTime: 2160,
            isEditLocked: false,
          },
          {
            jobName: '（PD-Common）Others',
            workCategoryName: undefined,
            workTimeRatio: 12.3,
            workTime: 990,
            isEditLocked: false,
          },
          {
            jobName: '（PD-Common）Recruting',
            workCategoryName: undefined,
            workTimeRatio: 2.1,
            workTime: 210,
            isEditLocked: false,
          },
          {
            jobName: '（PD-Common）Meeting',
            workCategoryName: 'ミーティング他',
            workTimeRatio: 0.1,
            workTime: 30,
            isEditLocked: false,
          },
        ],
      },
    },
  },
  userSetting: {
    photoUrl:
      'https://www.guidedogs.org/wp-content/uploads/2015/05/Dog-Im-Not.jpg',
  },
};

// @ts-ignore
export const store = configureStore({ initialState: state });

export const emptyDataStore = configureStore({
  initialState: {
    ...state,
    entities: {
      ...state.entities,
      summary: {
        targetDate: '2019-7-20',
        // @ts-ignore
        content: {
          ...state.entities.summary.content,
          taskSummaryRecords: [],
        },
      },
    },
  },
});

export const manyDataStore = configureStore({
  initialState: {
    ...state,
    entities: {
      ...state.entities,
      summary: {
        targetDate: state.entities.summary.targetDate,
        content: {
          ...state.entities.summary.content,
          // @ts-ignore
          taskSummaryRecords: [
            ...state.entities.summary.content.taskSummaryRecords,
            ...state.entities.summary.content.taskSummaryRecords,
            ...state.entities.summary.content.taskSummaryRecords,
            ...state.entities.summary.content.taskSummaryRecords,
          ],
        },
      },
    },
  },
});

export const longDataStore = configureStore({
  initialState: {
    ...state,
    entities: {
      ...state.entities,
      summary: {
        targetDate: '2019-7-20',
        content: {
          ...state.entities.summary.content,
          taskSummaryRecords: [
            // @ts-ignore
            {
              jobName:
                'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee',
              workCategoryName: 'Design',
              workTimeRatio: 50.0,
              workTime: 5829,
              isEditLocked: false,
            },
            // @ts-ignore
            {
              jobName: 'R06(19/07)_WSP_Entire',
              workCategoryName: 'Meeting&Others',
              workTimeRatio: 50.0,
              workTime: 2160,
              isEditLocked: false,
            },
          ],
        },
      },
    },
  },
});

export const requestedDataStore = configureStore({
  initialState: {
    ...state,
    entities: {
      ...state.entities,
      summary: {
        targetDate: state.entities.summary.targetDate,
        content: {
          ...state.entities.summary.content,
          // @ts-ignore
          request: {
            ...state.entities.summary.content.request,
            status: 'Pending',
          },
        },
      },
    },
  },
});
