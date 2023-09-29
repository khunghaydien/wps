// @ts-nocheck
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import snapshotDiff from 'snapshot-diff';

import * as ConfigUtil from '../utils/ConfigUtil';

import * as editActions from '../Edit';
import * as configLists from './mocks/configList';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('admin-pc/action-dispatchers/Edit.js', () => {
  describe('checkIsRequiredFieldFilled()', () => {
    // Arrange
    const functionTypeList = {};
    const baseValueGetter = () => null;
    const historyValueGetter = () => null;
    test('return false', () => {
      // Arrange
      const store = mockStore();
      const configList = configLists.require;
      const record = {};

      // Run
      const result = store.dispatch(
        editActions.checkIsRequiredFieldFilled(
          configList,
          record,
          functionTypeList,
          baseValueGetter,
          historyValueGetter
        )
      );
      const actions = store.getActions();

      // Assert
      expect(result).toEqual(false);
      expect(snapshotDiff([], actions)).toMatchSnapshot();
    });
    test('return true', () => {
      // Arrange
      const store = mockStore();
      const configList = configLists.simple;
      const record = {
        key: 'abc',
      };

      // Run
      const result = store.dispatch(
        editActions.checkIsRequiredFieldFilled(
          configList,
          record,
          functionTypeList,
          baseValueGetter,
          historyValueGetter
        )
      );
      const actions = store.getActions();

      expect(result).toEqual(true);
      expect(actions).toEqual([]);
    });
  });

  describe('showDetail()', () => {
    // Arrange
    const companyId = 'companyId';

    test("do't have history", async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: [],
        history: [],
      };
      const record = {
        id: 'abc',
      };
      const service = { searchHistory: jest.fn() };

      // Run
      await store.dispatch(
        editActions.showDetail(configList, record, service, companyId)
      );
      const actions = store.getActions();

      // Assert
      expect(service.searchHistory).not.toHaveBeenCalled();
      expect(snapshotDiff([], actions)).toMatchSnapshot();
    });

    test('have history', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: [],
        history: configLists.hasAction,
      };
      const record = {
        id: 'abc',
        historyId: 'def',
      };
      const history = {
        id: 'def',
        validDateFrom: '2020-01-01',
      };
      const service = {
        searchHistory: jest.fn().mockReturnValue([history]),
        actionName: jest.fn(),
      };

      // Run
      await store.dispatch(
        editActions.showDetail(configList, record, service, companyId)
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.searchHistory).toHaveBeenCalledWith({
        baseId: record.id,
      });
      expect(service.actionName).toHaveBeenCalledWith({
        companyId,
        targetDate: history.validDateFrom,
      });
    });

    test('execute with insteadMethod', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: configLists.hasAction,
      };
      const record = {
        id: 'abc',
        historyId: 'def',
      };
      const service = {
        searchHistory: jest.fn(),
      };
      const insteadMethod = jest.fn();

      // Run
      await store.dispatch(
        editActions.showDetail(
          configList,
          record,
          service,
          companyId,
          insteadMethod
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(insteadMethod).toHaveBeenCalledWith(record);
    });
  });

  test('hideDetail()', async () => {
    // Arrange
    const store = mockStore();

    // Run
    store.dispatch(editActions.hideDetail());
    const actions = store.getActions();

    // Assert
    expect(snapshotDiff([], actions)).toMatchSnapshot();
  });

  describe('create()', () => {
    // Arrange
    const functionTypeList = {};
    const baseValueGetter = () => null;
    const historyValueGetter = () => null;
    const companyId = 'companyId';

    test("do't execute", async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: configLists.require,
        history: [],
      };
      const orgRecord = {};
      const edtRecord = {};
      const service = { create: jest.fn() };
      const insteadMethod = jest.fn();

      // Run
      await store.dispatch(
        editActions.create(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId,
          insteadMethod
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.create).not.toHaveBeenCalled();
      expect(insteadMethod).not.toHaveBeenCalled();
    });

    test('execute with servise', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: configLists.require,
        history: [],
      };
      const orgRecord = {};
      const edtRecord = {
        key: 'abc',
      };
      const service = { create: jest.fn() };

      // Run
      await store.dispatch(
        editActions.create(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.create).toHaveBeenCalledWith(edtRecord, companyId);
    });

    test('execute with insteadMethod', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: configLists.require,
        history: [],
      };
      const orgRecord = {};
      const edtRecord = {
        key: 'abc',
      };
      const service = { create: jest.fn() };
      const insteadMethod = jest.fn();

      // Run
      await store.dispatch(
        editActions.create(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId,
          insteadMethod
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.create).not.toHaveBeenCalled();
      expect(insteadMethod).toHaveBeenCalledWith();
    });
  });

  describe('appendHistory()', () => {
    // Arrange
    const functionTypeList = {};
    const baseValueGetter = () => null;
    const historyValueGetter = () => null;
    const companyId = 'companyId';

    test("do't execute", async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: [],
        history: configLists.require,
      };
      const orgRecord = {};
      const edtRecord = {};
      const service = {
        createHistory: jest.fn(),
        searchHistory: jest.fn(),
        search: jest.fn(),
      };
      const insteadMethod = jest.fn();

      // Run
      await store.dispatch(
        editActions.appendHistory(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId,
          insteadMethod
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.createHistory).not.toHaveBeenCalled();
      expect(service.searchHistory).not.toHaveBeenCalled();
      expect(service.search).not.toHaveBeenCalled();
      expect(insteadMethod).not.toHaveBeenCalled();
    });

    test('execute with servise', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: [],
        history: configLists.simpleHistory,
      };
      const orgRecord = {};
      const edtRecord = {
        key: 'key',
        baseId: 'baseId',
        validDateFrom: '2020-01-01',
      };
      const service = {
        createHistory: jest.fn(),
        searchHistory: jest.fn().mockReturnValue([
          {
            ...edtRecord,
          },
        ]),
        search: jest.fn(),
      };

      // Run
      await store.dispatch(
        editActions.appendHistory(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.createHistory).toHaveBeenCalledWith(edtRecord, companyId);
      expect(service.searchHistory).toHaveBeenCalledWith({
        baseId: edtRecord.baseId,
      });
      expect(service.search).toHaveBeenCalledWith({ companyId });
    });

    test('execute with insteadMethod', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: [],
        history: configLists.simpleHistory,
      };
      const orgRecord = {};
      const edtRecord = {
        key: 'key',
        baseId: 'baseId',
        validDateFrom: '2020-01-01',
      };
      const service = {
        createHistory: jest.fn(),
        searchHistory: jest.fn().mockReturnValue([
          {
            ...edtRecord,
          },
        ]),
        search: jest.fn(),
      };
      const insteadMethod = jest.fn();

      // Run
      await store.dispatch(
        editActions.appendHistory(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId,
          insteadMethod
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.createHistory).not.toHaveBeenCalled();
      expect(service.searchHistory).toHaveBeenCalledWith({
        baseId: edtRecord.baseId,
      });
      expect(service.search).toHaveBeenCalledWith({ companyId });
      expect(insteadMethod).toHaveBeenCalledWith();
    });
  });

  describe('updateBase()', () => {
    // Arrange
    const functionTypeList = {};
    const baseValueGetter = () => null;
    const historyValueGetter = () => null;
    const companyId = 'companyId';

    test("do't execute", async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: configLists.require,
      };
      const orgRecord = {};
      const edtRecord = {};
      const service = { update: jest.fn() };
      const insteadMethod = jest.fn();

      // Run
      await store.dispatch(
        editActions.updateBase(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId,
          insteadMethod
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.update).not.toHaveBeenCalled();
      expect(insteadMethod).not.toHaveBeenCalled();
    });

    test('execute with servise', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: configLists.require,
      };
      const orgRecord = {};
      const edtRecord = {
        key: 'abc',
      };
      const service = { update: jest.fn() };

      // Run
      await store.dispatch(
        editActions.updateBase(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.update).toHaveBeenCalledWith(edtRecord, companyId);
    });

    test('execute with insteadMethod', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: configLists.require,
      };
      const edtRecord = {
        key: 'abc',
      };
      const orgRecord = {};
      const service = { update: jest.fn() };
      const insteadMethod = jest.fn();

      // Run
      await store.dispatch(
        editActions.updateBase(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId,
          insteadMethod
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.update).not.toHaveBeenCalled();
      expect(insteadMethod).toHaveBeenCalledWith();
    });
  });

  describe('updateHistory()', () => {
    // Arrange
    const functionTypeList = {};
    const baseValueGetter = () => null;
    const historyValueGetter = () => null;
    const companyId = 'companyId';

    test("do't execute", async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: [],
        history: configLists.require,
      };
      const orgRecord = {};
      const edtRecord = {};
      const service = { update: jest.fn() };
      const insteadMethod = jest.fn();

      // Run
      await store.dispatch(
        editActions.updateHistory(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId,
          insteadMethod
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.update).not.toHaveBeenCalled();
      expect(insteadMethod).not.toHaveBeenCalled();
    });

    test('execute with servise', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: [],
        history: configLists.require,
      };
      const orgRecord = {};
      const edtRecord = {
        key: 'abc',
      };
      const service = { updateHistory: jest.fn() };

      // Run
      await store.dispatch(
        editActions.updateHistory(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.updateHistory).toHaveBeenCalledWith(edtRecord, companyId);
    });

    test('execute with insteadMethod', async () => {
      // Arrange
      expect.hasAssertions();
      const store = mockStore();
      const configList = {
        base: [],
        history: configLists.require,
      };
      const orgRecord = {};
      const edtRecord = {
        key: 'abc',
      };
      const service = { updateHistory: jest.fn() };
      const insteadMethod = jest.fn();

      // Run
      await store.dispatch(
        editActions.updateHistory(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter,
          service,
          companyId,
          insteadMethod
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
      expect(service.updateHistory).not.toHaveBeenCalled();
      expect(insteadMethod).toHaveBeenCalledWith();
    });
  });

  describe('startEditingNewRecord()', () => {
    test("do't have history", async () => {
      // Arrange
      const store = mockStore();
      const configList: {
        base: ConfigUtil.configList;
      } = {
        base: [],
      };
      const sfObjFieldValues = {};
      const service = {};
      const companyId = 'abc';

      // Run
      store.dispatch(
        editActions.startEditingNewRecord(
          configList,
          sfObjFieldValues,
          service,
          companyId
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
    });

    test('have history', async () => {
      // Arrange
      const store = mockStore();
      const configList: {
        base: ConfigUtil.configList;
      } = {
        base: [],
        history: [],
      };
      const sfObjFieldValues = {};
      const service = {};
      const companyId = 'abc';

      // Run
      store.dispatch(
        editActions.startEditingNewRecord(
          configList,
          sfObjFieldValues,
          service,
          companyId
        )
      );
      const actions = store.getActions();

      // Assert
      expect(snapshotDiff([], actions)).toMatchSnapshot();
    });
  });

  test('startEditingBase()', () => {
    // Arrange
    const store = mockStore();

    // Run
    store.dispatch(editActions.startEditingBase());
    const actions = store.getActions();

    // Assert
    expect(snapshotDiff([], actions)).toMatchSnapshot();
  });

  test('startEditingHistory()', () => {
    // Arrange
    const store = mockStore();
    const configList: ConfigUtil.ConfigList = configLists.hasAction;
    const record = {
      validDateFrom: '2018/12/31',
      comment: 'old comment',
    };
    const param = {
      validDateFrom: '2020/01/01',
      comment: 'new comment',
    };
    const service = {
      actionName: jest.fn(),
    };
    const companyId = 'abc';

    // Run
    store.dispatch(
      editActions.startEditingHistory(
        param,
        record,
        configList,
        service,
        companyId
      )
    );
    const actions = store.getActions();

    // Assert
    expect(snapshotDiff([], actions)).toMatchSnapshot();
    expect(service.actionName).toHaveBeenCalledTimes(1);
    expect(service.actionName).toHaveBeenCalledWith({
      companyId,
      targetDate: param.validDateFrom,
    });
  });

  describe('checkCharType()', () => {
    /*eslint-disable */
    //const checkCharType = editDefault.__get__('checkCharType');
    /*eslint-disable */
    describe.each([
      [
        'numeric',
        {
          false: [undefined, 'a'],
          true: [null, '', '0', 0, '1', 1],
        },
      ],
      [
        'any',
        {
          true: [null, undefined, 0, '0', '', [], {}, 'abc', '123'],
        },
      ],
    ])('charType is %s', (charType, values) => {
      if (values.false) {
        test.each(values.false)('%p is false', (val) => {
          expect(editActions.checkCharType(charType, val)).toEqual(false);
        });
      }
      if (values.true) {
        test.each(values.true)('%p is true', (val) => {
          expect(editActions.checkCharType(charType, val)).toEqual(true);
        });
      }
    });
  });
});
