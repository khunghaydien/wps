import {
  deleteProject,
  getProject,
  getProjectList,
  initialStateProject,
  initialStateProjectList,
  PageInfo,
  Project,
  ProjectListFilterState,
  saveProject,
} from '../../models/psa/Project';

import { AppDispatch } from '../../../psa-pc/action-dispatchers/AppThunk';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT/LIST_SUCCESS',
  LIST_UPDATE: 'MODULES/ENTITIES/PSA/PROJECT/LIST_UPDATE',
  GET_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT/GET_SUCCESS',
  SAVE_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT/SAVE_SUCCESS',
  SAVE: 'MODULES/UI/PSA/PROJECT/SAVE',
  DELETE: 'MODULES/UI/PSA/PROJECT/DELETE',
  INIT_SUCCESS: 'MODULES/ENTITIES/PSA/PROJECT/INIT_SUCCESS',
  DELETE_LOCAL: 'MODULES/UI/PSA/PROJECT/DELETE_LOCAL',
};

export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];
export const MAX_RECORD_NUM = 1000;
export const MAX_PAGE_NUM = MAX_RECORD_NUM / PAGE_SIZE;

const listSuccess = (body: PageInfo) => ({
  type: ACTIONS.LIST_SUCCESS,
  payload: body,
});

const getSuccess = (body: Project) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const saveSuccess = (body: Project) => ({
  type: ACTIONS.SAVE_SUCCESS,
  payload: body,
});

const initialize: any = () => ({
  type: ACTIONS.INIT_SUCCESS,
  payload: [],
});

const deleteLocal = (projectId: string) => ({
  type: ACTIONS.DELETE_LOCAL,
  payload: projectId,
});

export const actions = {
  list:
    (
      companyId: string,
      pageNum: number,
      filterQuery?: ProjectListFilterState,
      pageSize = PAGE_SIZE
    ) =>
    (dispatch: AppDispatch): void | any =>
      getProjectList(companyId, pageSize, pageNum, filterQuery)
        .then((res: PageInfo) => dispatch(listSuccess(res)))
        .catch((err) => {
          throw err;
        }),

  initialize:
    () =>
    (dispatch: AppDispatch): Promise<PageInfo> =>
      dispatch(initialize()),

  get:
    (projectId: string) =>
    (dispatch: AppDispatch): void | any =>
      getProject(projectId)
        .then((res: any) => {
          const project = res.project;
          if (res.finance) {
            project.contractType = res.finance.contractType;
            project.contractAmount = res.finance.contractAmount;
            project.planningCycle = res.finance.planningCycle;
            project.targetMargin = res.finance.targetMargin;
          }
          return dispatch(getSuccess(project));
        })
        .catch((err) => {
          throw err;
        }),

  save:
    (project: Project) =>
    (dispatch: AppDispatch): void | any =>
      saveProject(project)
        .then((res: Project) => {
          project.projectId = res.projectId;
          dispatch(saveSuccess(project));
          return res;
        })
        .catch((err) => {
          throw err;
        }),

  saveSelectedProject:
    (project: Project) =>
    (dispatch: AppDispatch): void | any =>
      dispatch(saveSuccess(project)),

  delete:
    (projectId: string) =>
    (dispatch: AppDispatch): void | any =>
      deleteProject(projectId)
        .then(() => {
          dispatch(deleteLocal(projectId));
        })
        .catch((err) => {
          throw err;
        }),
};

const initialState = {
  ...initialStateProjectList,
  project: initialStateProject,
};

type State = PageInfo & {
  project: Project;
};

export default (state: State = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SAVE_SUCCESS:
      return {
        ...state,
        project: action.payload,
      };
    case ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        projectList: action.payload,
      };
    case ACTIONS.DELETE_LOCAL:
      const pageData = state.pageData.filter(
        (e) => action.payload !== e.projectId
      );
      return { ...state, pageData: pageData };
    default:
      return state;
  }
};
