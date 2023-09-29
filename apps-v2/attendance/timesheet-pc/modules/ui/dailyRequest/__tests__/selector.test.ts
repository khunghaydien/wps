import { targetRequest, targetState } from '../selector';
import dailyRequestState from './mocks/dailyRequestState';

describe('selector', () => {
  test('should return the request you are editing', () => {
    // Arrange
    const expectState = dailyRequestState.requests.leaveRequest;
    // @ts-ignore Act
    const actual = targetState(dailyRequestState);
    // Assert
    expect(actual).toEqual(expectState);
  });
  test('should return the information in the editing request ', () => {
    // Arrange
    const expectRequest = dailyRequestState.requests.leaveRequest.request;
    // @ts-ignore Act
    const actual = targetRequest(dailyRequestState);
    // Assert
    expect(actual).toEqual(expectRequest);
  });
  test('should be null If the requestTypeCode is invalid', () => {
    // Arrange
    dailyRequestState.editing.requestTypeCode = '';
    const expectState = dailyRequestState.requests.leaveRequest;
    // @ts-ignore Act
    const actual = targetState(dailyRequestState);
    // Assert
    expect(actual).toEqual(expectState);
  });
});
