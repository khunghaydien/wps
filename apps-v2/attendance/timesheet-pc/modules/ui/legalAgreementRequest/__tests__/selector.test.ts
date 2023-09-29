import { targetRequest, targetState } from '../selector';
import requestState from './mocks/requestState';

describe('selector', () => {
  test('should return the request you are editing', () => {
    // Arrange
    const expectState = requestState.requests.monthlyRequest;
    // @ts-ignore Act
    const actual = targetState(requestState);
    // Assert
    expect(actual).toEqual(expectState);
  });
  test('should return the information in the editing request ', () => {
    // Arrange
    const expectRequest = requestState.requests.monthlyRequest.request;
    // @ts-ignore Act
    const actual = targetRequest(requestState);
    // Assert
    expect(actual).toEqual(expectRequest);
  });
  test('should be null If the requestTypeCode is invalid', () => {
    // Arrange
    requestState.editing.requestType = null;
    const expectState = requestState.requests.monthlyRequest;
    // @ts-ignore Act
    const actual = targetState(requestState);
    // Assert
    expect(actual).toEqual(expectState);
  });
});
