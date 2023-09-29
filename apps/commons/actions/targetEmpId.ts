export const SET_TARGET_EMP_ID = 'SET_TARGET_EMP_ID';

export function setTargetEmpId(targetEmpId) {
  return {
    type: SET_TARGET_EMP_ID,
    payload: targetEmpId,
  };
}
