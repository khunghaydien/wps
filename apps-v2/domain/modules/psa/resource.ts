import {
  catchApiError,
  catchBusinessError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import msg from '../../../commons/languages';
import { showErrorToast } from '@apps/commons/modules/toast';

import { ResourceSelectionFilterParam } from '../../models/psa/Request';
import {
  AssignmentDetailList,
  AssignmentDetailSearchQuery,
  getAssignmentDetailList,
  getResourceIdList,
  getResourceList,
  getResourceListByIds,
  initialAssignmentDetailList,
  initialResourceIdList,
  initialStateResource,
  initialViewAllResourceList,
  Resource,
  ResourceIdList,
  ResourceIdListSearchQuery,
  ResourceList,
  ResourceListSearchQuery,
  ResourceSearchQuery,
  ViewAllResourceList,
} from '../../models/psa/Resource';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/PSA/RESOURCE/LIST_SUCCESS',
  LIST_VIEW_ALL_RESOURCE_SUCCESS:
    'MODULES/ENTITIES/PSA/RESOURCE/LIST_VIEW_ALL_RESOURCE_SUCCESS',
  SET_SUCCESS: 'MODULES/ENTITIES/PSA/RESOURCE/SET_SUCCESS',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/RESOURCE/INIT_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/ENTITIES/PSA/RESOURCE/CLEAR_SUCCESS',
  SET_VIEW_ALL_RESOURCE_PAGE_DATA_SUCCESS:
    'MODULES/ENTITIES/PSA/RESOURCE/SET_VIEW_ALL_RESOURCE_PAGE_DATA_SUCCESS',
  SET_VIEW_ALL_RESOURCE_PAGINATION_SUCCESS:
    'MODULES/ENTITIES/PSA/RESOURCE/SET_VIEW_ALL_RESOURCE_PAGINATION_SUCCESS',
  SET_ID_LIST_SUCCESS: 'MODULES/ENTITIES/PSA/RESOURCE/SET_ID_LIST_SUCCESS',
  SET_PAGE_SUCCESS: 'MODULES/ENTITIES/PSA/RESOURCE/SET_PAGE_SUCCESS',
  SET_ASSIGNMENT_DETAIL_LIST_SUCCESS:
    'MODULES/ENTITIES/PSA/RESOURCE/SET_ASSIGNMENT_DETAIL_LIST_SUCCESS',
  APPEND_ASSIGNMENT_DETAIL_LIST:
    'MODULES/ENTITIES/PSA/RESOURCE/APPEND_ASSIGNMENT_DETAIL_LIST_TO_RESOURCE_LIST',
};

export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];
export const MAX_RECORD_NUM = 1000;
export const MAX_PAGE_NUM = MAX_RECORD_NUM / PAGE_SIZE;

const listSuccess = (body: ResourceList) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: body,
});
const listViewAllResourceSuccess = (body: any) => ({
  type: ACTIONS.LIST_VIEW_ALL_RESOURCE_SUCCESS,
  payload: body.resources,
});
const setSuccess = (resourceIndex: string) => ({
  type: ACTIONS.SET_SUCCESS,
  payload: resourceIndex,
});

const clearSuccess = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
  payload: [],
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

const setViewAllResourcePageDataSuccess = (body: any) => ({
  type: ACTIONS.SET_VIEW_ALL_RESOURCE_PAGE_DATA_SUCCESS,
  payload: body,
});

const setViewAllResourcePaginationSuccess = (body: ViewAllResourceList) => ({
  type: ACTIONS.SET_VIEW_ALL_RESOURCE_PAGINATION_SUCCESS,
  payload: body,
});

const setResourceIdListSuccess = (body: ResourceIdList) => ({
  type: ACTIONS.SET_ID_LIST_SUCCESS,
  payload: body,
});
const setAssignmentDetailListSuccess = (body: AssignmentDetailList) => ({
  type: ACTIONS.SET_ASSIGNMENT_DETAIL_LIST_SUCCESS,
  payload: body,
});

const setPageSuccess = (pageNum: number) => ({
  type: ACTIONS.SET_PAGE_SUCCESS,
  payload: pageNum,
});

const appendAssignmentDetailList = (list: AssignmentDetailList) => ({
  type: ACTIONS.APPEND_ASSIGNMENT_DETAIL_LIST,
  payload: list,
});

export const actions = {
  list:
    (searchQuery: ResourceSearchQuery | ResourceSelectionFilterParam) =>
    (dispatch: AppDispatch): void | any =>
      getResourceList(searchQuery)
        .then((res: ResourceList) => dispatch(listSuccess(res)))
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        }),
  setList:
    (resList: ResourceList) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(listSuccess(resList)),
  set:
    (resourceIndex: string) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setSuccess(resourceIndex)),

  setPage:
    (pageNum: number) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setPageSuccess(pageNum)),

  clear:
    () =>
    (dispatch: AppDispatch): void | any =>
      dispatch(clearSuccess()),

  idList:
    (searchQuery: ResourceIdListSearchQuery) =>
    (dispatch: AppDispatch): void | any =>
      getResourceIdList(searchQuery)
        .then((res) => dispatch(setResourceIdListSuccess(res)))
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        }),
  setViewAllResourcePagination:
    (paginationData: ViewAllResourceList) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setViewAllResourcePaginationSuccess(paginationData)),
  getByIdList:
    (searchQuery: ResourceListSearchQuery) =>
    async (
      dispatch: AppDispatch
      // @ts-ignore
    ): void | any => {
      dispatch(loadingStart());
      const chunkSize = 10;
      let finalRes = [];
      try {
        for (let i = 0; i < searchQuery.ids.length; i += chunkSize) {
          const res: any = await getResourceListByIds({
            ...searchQuery,
            ids: searchQuery.ids.slice(i, i + chunkSize),
          });
          finalRes = finalRes.concat(res.resources);
        }
      } catch (err) {
        if (
          (err && err.errorCode === 'APEX_ERROR') ||
          (err && err.errorCode === 'ILLEGAL_STATE')
        ) {
          dispatch(
            catchBusinessError(
              msg().Psa_Err_Unexpected,
              msg().Psa_Err_DataLimitExceed,
              msg().Psa_Err_TooManyResults
            )
          );
        } else {
          dispatch(
            catchBusinessError(msg().Psa_Err_Unexpected, err.message, '')
          );
        }
        dispatch(loadingEnd());
      }
      await dispatch(listViewAllResourceSuccess({ resources: finalRes }));
      await dispatch(
        setViewAllResourcePageDataSuccess({ resources: finalRes })
      );
      dispatch(loadingEnd());
    },
  getAssignmentDetailList:
    (searchQuery: AssignmentDetailSearchQuery, resourceName: string) =>
    (dispatch: AppDispatch): void | any =>
      getAssignmentDetailList(searchQuery)
        .then((res) => {
          const assignments = res.assignments;
          for (let i = 0; i < assignments.length; i++) {
            let resultArray;
            if (assignments[i].offset < 0) {
              const sliceWindow = assignments[i].offset * -1;
              resultArray =
                assignments[i].bookedTimePerDay &&
                assignments[i].bookedTimePerDay.slice(sliceWindow);
            } else {
              const prependArray = new Array(assignments[i].offset).fill(-1);
              resultArray = prependArray.concat(
                assignments[i].bookedTimePerDay
              );
            }
            assignments[i].bookedTimePerDay = resultArray;
          }
          if (res.nonProject && res.nonProject.bookedTimePerDay) {
            const bookedTimePerDay = res.nonProject.bookedTimePerDay;
            if (bookedTimePerDay.reduce((a, b) => a + b, 0) > 0) {
              const nonProjectBookingDetail = {
                projectTitle: msg().Psa_Lbl_NonProjectHours,
                activityTitle: '',
                projectCode: '',
                projectJobCode: '',
                roleId: '',
                roleTitle: msg().Cal_Lbl_Planner,
                status: '-',
                startDate: searchQuery.startDate,
                endDate: searchQuery.endDate,
                bookedTimePerDay,
                offset: 0,
              };
              assignments.unshift(nonProjectBookingDetail);
            }
          }
          const ret = {
            employeeBaseId: searchQuery.id,
            assignments,
          };
          if (ret.assignments.length === 0) {
            window.empInfo.language !== 'ja'
              ? dispatch(
                  showErrorToast(
                    `${msg().Psa_Msg_ErrorNoAssignmentDetail} ${resourceName}`
                  )
                )
              : dispatch(
                  showErrorToast(
                    `${resourceName} ${msg().Psa_Msg_ErrorNoAssignmentDetail}`
                  )
                );
          }
          dispatch(appendAssignmentDetailList(ret));
          dispatch(setAssignmentDetailListSuccess(ret));
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: false }));
        }),
  setAssignmentDetailList:
    (assignmentDetailList: AssignmentDetailList) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(setAssignmentDetailListSuccess(assignmentDetailList)),
  initialize:
    () =>
    (dispatch: AppDispatch): Promise<ResourceList> =>
      dispatch(initialize()),
};

const initialState = {
  resourceList: [],
  resource: initialStateResource,
  viewAllResourceList: initialViewAllResourceList,
  resourceIdList: initialResourceIdList,
  assignmentDetailList: initialAssignmentDetailList,
};

type State = {
  resourceList: ResourceList;
  resource: Resource;
  viewAllResourceList: ViewAllResourceList;
  resourceIdList: ResourceIdList;
  assignmentDetailList: AssignmentDetailList;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.INIT_SUCCESS:
      return initialState;
    case ACTIONS.LIST_SUCCESS:
    case ACTIONS.LIST_VIEW_ALL_RESOURCE_SUCCESS:
      return {
        ...state,
        resourceList: action.payload.map((e) => {
          return { ...e, hasAssignment: true };
        }),
      };
    case ACTIONS.SET_SUCCESS:
      return {
        ...state,
        resource: state.resourceList[action.payload],
      };
    case ACTIONS.CLEAR_SUCCESS:
      return {
        ...state,
        resource: initialStateResource,
      };
    case ACTIONS.SET_VIEW_ALL_RESOURCE_PAGE_DATA_SUCCESS:
      return {
        ...state,
        viewAllResourceList: {
          ...state.viewAllResourceList,
          pageData: action.payload,
        },
      };
    case ACTIONS.SET_VIEW_ALL_RESOURCE_PAGINATION_SUCCESS:
      return {
        ...state,
        viewAllResourceList: {
          ...state.viewAllResourceList,
          totalRecords: action.payload.totalRecords,
          totalPages: action.payload.totalPages,
          pageNum: action.payload.pageNum,
          pageSize: action.payload.pageSize,
        },
      };
    case ACTIONS.SET_PAGE_SUCCESS:
      return {
        ...state,
        viewAllResourceList: {
          ...state.viewAllResourceList,
          pageNum: action.payload,
        },
      };
    case ACTIONS.SET_ID_LIST_SUCCESS:
      return {
        ...state,
        resourceIdList: action.payload,
      };
    case ACTIONS.SET_ASSIGNMENT_DETAIL_LIST_SUCCESS:
      return {
        ...state,
        assignmentDetailList: action.payload,
      };
    case ACTIONS.APPEND_ASSIGNMENT_DETAIL_LIST:
      return {
        ...state,
        resourceList: state.resourceList.map((e) => {
          if (e.id === action.payload.employeeBaseId) {
            return {
              ...e,
              hasAssignment: !(action.payload.assignments.length === 0),
            };
          } else {
            return e;
          }
        }),
      };
    default:
      return state;
  }
};
