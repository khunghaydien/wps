import userBlankIcon from '../../../../commons/images/photo_Blank.png';

let requestCounter = 0;

/**
 * Generate mocked request item.
 * @param {Object} [objectToOverride={}] Object to override on generated request item.
 * @returns {Object} Generated request item.
 * @example
 * // Add mock-up for monthly attendance request
 * requestList.push(generateMockRequest({
 *   requestDate: '2017-10-01',
 *   targetMonth: '2017-09-01',
 * }))
 */
// eslint-disable-next-line import/prefer-default-export
export const generateMockRequest = (objectToOverride = {}) => {
  requestCounter += 1;

  return {
    requestId: `AnonymousRequest${requestCounter}`,
    employeeName: 'テスト 社員',
    photoUrl: userBlankIcon,
    departmentName: 'テスト 部署',
    requestDate: null,
    ...objectToOverride,
  };
};
