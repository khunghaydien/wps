import {
  LegalAgreementRequest,
  STATUS,
} from '@attendance/domain/models/LegalAgreementRequest';

import getRequestSummary, { ORDER_OF_STATUS } from '../getRequestSummary';

it('should check all Status expect NotRequested', () => {
  expect(ORDER_OF_STATUS.length).toBe(Object.keys(STATUS).length - 1);
});

it.each([null, undefined])('should be return [%s]', (arg) => {
  expect(
    getRequestSummary(arg as unknown as LegalAgreementRequest[])
  ).toBeNull();
});

it('should return NotRequested', () => {
  expect(getRequestSummary([])).toEqual({
    status: STATUS.NOT_REQUESTED,
  });
});

it.each`
  idx0  | idx1  | resultIdx
  ${-1} | ${0}  | ${0}
  ${0}  | ${-1} | ${0}
`('should return state by order', ({ idx0, idx1, resultIdx }) => {
  // Arrange
  const requests = [
    {
      status: ORDER_OF_STATUS.at(idx0),
    },
    {
      status: ORDER_OF_STATUS.at(idx1),
    },
  ] as unknown as LegalAgreementRequest[];

  // Act
  const status = getRequestSummary(requests);

  // Assert
  expect(status).toEqual({ status: ORDER_OF_STATUS.at(resultIdx) });
});
