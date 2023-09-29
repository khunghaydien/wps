import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import employees from '../../../../../repositories/__tests__/mocks/response/employee-search';

import * as assignment from '../assignment';

// import RepositoryMock from '../../../../mocks/RepositoryMock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const runReducer = (state, action) => {
  const reducer = assignment.default;
  const store = mockStore(state);
  store.dispatch(action);
  const actions = store.getActions();

  let newState = state;
  for (const a of actions) {
    newState = reducer(newState, a);
  }

  return newState;
};

describe('assignment', () => {
  /** FIXME
   moduleNameMapper で Repository が適切にmockにならないのでテストができない。
   describe('searchEmployees()', () => {
    let state;
    beforeEach(() => {
      RepositoryMock.mockResetAll();
      RepositoryMock.search.mockImplementation(() =>
        Promise.resolve(employees.records)
      );
       const initialState = {
        foundEmployees: [],
        candidates: [],
        stagedEmployees: [],
        validDateFrom: '',
        validDateThrough: '',
        isOpeningNewAssignment: false,
        isOpeningEmployeeSelection: false,
      };
      state = runReducer(
        initialState,
        assignment.searchEmployees('2018-01-01')({})
      );
    });
     test('should call search API', () => {
      expect(RepositoryMock.search).toBeCalled();
    });
     test('should set found employees', () => {
      expect(state.foundEmployees).toEqual(employees.records);
    });
  });
  * */

  describe('selectCandidates()', () => {
    const initialState = {
      foundEmployees: employees.records.map((_) => ({
        ..._,
        isSelected: true,
      })),
      candidates: [],
      stagedEmployees: [],
      validDateFrom: '',
      validDateThrough: '',
      isOpeningNewAssignment: false,
      isOpeningEmployeeSelection: false,
    };
    const state = runReducer(
      initialState,
      // @ts-ignore
      assignment.selectCandidates(initialState.foundEmployees)
    );

    test('should move selected employees to canidates', () => {
      expect(state.foundEmployees).toEqual([]);
      expect(state.candidates).toEqual(
        employees.records.map((_) => ({ ..._, isSelected: false }))
      );
      expect(state.stagedEmployees).toEqual([]);
    });

    test('should only update required state', () => {
      expect(state.validDateFrom).toEqual('');
      expect(state.validDateThrough).toEqual('');
      expect(state.isOpeningNewAssignment).toBeFalsy();
      expect(state.isOpeningEmployeeSelection).toBeFalsy();
    });
  });

  describe('deleteACandidate()', () => {
    const initialState = {
      foundEmployees: [],
      candidates: employees.records,
      stagedEmployees: [],
      validDateFrom: '',
      validDateThrough: '',
      isOpeningNewAssignment: false,
      isOpeningEmployeeSelection: false,
    };
    const state = runReducer(
      initialState,
      // @ts-ignore
      assignment.deleteACandidate(employees.records[1])
    );

    test('shoudl move a selected candidate to found employees', () => {
      expect(state.foundEmployees).toEqual([employees.records[1]]);
      expect(state.candidates).toEqual([employees.records[0]]);
      expect(state.stagedEmployees).toEqual([]);
    });

    test('should only update required state', () => {
      expect(state.validDateFrom).toEqual('');
      expect(state.validDateThrough).toEqual('');
      expect(state.isOpeningNewAssignment).toBeFalsy();
      expect(state.isOpeningEmployeeSelection).toBeFalsy();
    });
  });

  describe('decideCandidates()', () => {
    const initialState = {
      foundEmployees: [],
      candidates: employees.records,
      stagedEmployees: [],
      validDateFrom: '',
      validDateThrough: '',
      isOpeningNewAssignment: false,
      isOpeningEmployeeSelection: false,
    };
    const state = runReducer(
      initialState,
      // @ts-ignore
      assignment.decideCandidates(employees.records)
    );

    test('shoudl move candidates to staged employees', () => {
      expect(state.foundEmployees).toEqual([]);
      expect(state.candidates).toEqual([]);
      expect(state.stagedEmployees).toEqual(employees.records);
    });

    test('should only update required state', () => {
      expect(state.validDateFrom).toEqual('');
      expect(state.validDateThrough).toEqual('');
      expect(state.isOpeningNewAssignment).toBeFalsy();
      expect(state.isOpeningEmployeeSelection).toBeFalsy();
    });
  });

  describe('openEmployeeSelection()', () => {
    const initialState = {
      foundEmployees: [],
      candidates: [],
      stagedEmployees: employees.records.map((_) => ({
        ..._,
        isSelected: false,
      })),
      validDateFrom: '',
      validDateThrough: '',
      isOpeningNewAssignment: false,
      isOpeningEmployeeSelection: false,
    };
    const state = runReducer(
      initialState,
      // @ts-ignore
      assignment.openEmployeeSelection(initialState.stagedEmployees)
    );

    test('should open employee selection view', () => {
      expect(state.isOpeningEmployeeSelection).toBeTruthy();
    });

    test('should copy staged employees to candidates', () => {
      expect(state.candidates).toEqual(state.stagedEmployees);
    });
  });

  describe('cancelEmployeeSelection()', () => {
    const initialState = {
      foundEmployees: employees.records,
      candidates: employees.records,
      stagedEmployees: employees.records,
      validDateFrom: '2018-01-01',
      validDateThrough: '2019-01-01',
      isOpeningNewAssignment: false,
      isOpeningEmployeeSelection: true,
    };
    const state = runReducer(
      initialState,
      assignment.cancelEmployeeSelection()
    );

    test('should close employee selection view', () => {
      expect(state.isOpeningEmployeeSelection).toBeFalsy();
    });
    test('should make found employees be empty', () => {
      expect(state.foundEmployees).toEqual([]);
    });
    test('should make candidates be empty ', () => {
      expect(state.candidates).toEqual([]);
    });
    test('should not make staged employees be empty ', () => {
      expect(state.stagedEmployees).toEqual(employees.records);
    });
    test('should not make validDateThrough be empty ', () => {
      expect(state.validDateThrough).toEqual('2019-01-01');
    });
    test('should not make validDateFrom be empty ', () => {
      expect(state.validDateFrom).toEqual('2018-01-01');
    });
  });

  describe('openNewAssignment()', () => {
    const initialState = {
      foundEmployees: employees.records,
      candidates: employees.records,
      stagedEmployees: employees.records,
      validDateFrom: '',
      validDateThrough: '',
      isOpeningNewAssignment: false,
      isOpeningEmployeeSelection: false,
    };
    const state = runReducer(initialState, assignment.openNewAssignment());

    test('should open new assignment view', () => {
      expect(state.isOpeningEmployeeSelection).toBeFalsy();
    });
  });

  describe('cancelNewAssignment()', () => {
    const initialState = {
      foundEmployees: employees.records,
      candidates: employees.records,
      stagedEmployees: employees.records,
      validDateFrom: '2018-01-01',
      validDateThrough: '2020-01-01',
      isOpeningNewAssignment: false,
      isOpeningEmployeeSelection: false,
    };
    const state = runReducer(initialState, assignment.cancelNewAssignment());

    test('should close new assignment view', () => {
      expect(state.isOpeningEmployeeSelection).toBeFalsy();
    });
    test('should make found employees be empty', () => {
      expect(state.foundEmployees).toEqual([]);
    });
    test('should make candidates be empty ', () => {
      expect(state.candidates).toEqual([]);
    });
    test('should make staged employees be empty ', () => {
      expect(state.stagedEmployees).toEqual([]);
    });
    test('should make validDateThrough be empty ', () => {
      expect(state.validDateThrough).toEqual('');
    });
    test('should make validDateFrom be empty ', () => {
      expect(state.validDateFrom).toEqual('');
    });
  });
});
