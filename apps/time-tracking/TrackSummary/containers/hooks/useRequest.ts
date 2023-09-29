import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '../../modules';

import Request, { Options } from '../../action-dispatchers/Request';

const useRequest = (
  options?: Options & { defaultEmpId?: string | null | undefined }
) => {
  const { defaultEmpId, ...restOptions } = options || {};
  const employeeId = useSelector<State, string>(
    (state) => state.entities.user.id
  );
  const dispatch = useDispatch();

  return useMemo(
    () => Request(dispatch, employeeId || defaultEmpId, restOptions),
    [dispatch, employeeId]
  );
};

export default useRequest;
