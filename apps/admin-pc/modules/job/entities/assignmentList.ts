import { catchApiError, withLoading } from '../../../../commons/actions/app';

import JobAssignRepository from '../../../../repositories/JobAssignRepository';

import { JobAssignment } from '../../../../domain/models/organization/JobAssignment';

import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import { actions as assignmentListUIActions } from '../ui/assignmentList';
// State
type State = JobAssignment[];

// Action
const ACTIONS = {
  SET: 'ADMIN/JOB/ENTITIES/JOB_ASSIGNMENT_LIST/SET',
  CLEAR: 'ADMIN/JOB/ENTITIES/JOB_ASSIGNMENT_LIST/CLEAR',
};

/* foundEmployees */
type SetJobAssignmentByJob = {
  type: 'ADMIN/JOB/ENTITIES/JOB_ASSIGNMENT_LIST/SET';
  payload: JobAssignment[];
};

type ClearJobAssignmentList = {
  type: 'ADMIN/JOB/ENTITIES/JOB_ASSIGNMENT_LIST/CLEAR';
};

type Action = SetJobAssignmentByJob | ClearJobAssignmentList;

export const setJobAssignmentList = (
  jobAssignList: JobAssignment[]
): SetJobAssignmentByJob => ({
  // @ts-ignore
  type: ACTIONS.SET,
  payload: jobAssignList,
});

export const clearJobAssignmentList = (): ClearJobAssignmentList => ({
  // @ts-ignore
  type: ACTIONS.CLEAR,
});

export const searchByJob = (jobId: string) => (dispatch: AppDispatch) => {
  dispatch(assignmentListUIActions.clear());
  dispatch(clearJobAssignmentList());
  return dispatch(
    withLoading(() =>
      JobAssignRepository.search({
        jobId,
      }).then((jobAssignList) => {
        dispatch(setJobAssignmentList(jobAssignList));
      })
    )
  ).catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
};

// Reducer

const initialState: State = [];

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.SET: {
      return (action as SetJobAssignmentByJob).payload;
    }

    case ACTIONS.CLEAR: {
      return initialState;
    }

    default:
      return state;
  }
};
