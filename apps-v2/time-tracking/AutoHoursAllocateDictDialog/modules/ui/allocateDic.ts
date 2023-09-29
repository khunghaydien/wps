import nanoid from 'nanoid';

import {
  AutoHoursAllocationDictItem,
  FIELD_TYPE,
  getLargestPriority,
  OPERATOR_TYPE,
  REFERENCE_SCOPE_TYPE,
  updatePrioritiesOnChangeItemPriority,
  updatePrioritiesOnRemoveItem,
} from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';

import ValidationError from '@apps/time-tracking/AutoHoursAllocateDictDialog/validators/ValidationError';

type State = {
  byKey: { [key: string]: AutoHoursAllocationDictItem };
  allKeys: string[];
  errors: ValidationError[];
};

const initialState = { byKey: {}, allKeys: [], errors: [] };

// Actions
const ActionType = {
  INIT: '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_LIST/INIT',
  EDIT_JOB:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_LIST/EDIT_JOB',
  EDIT_WORK_CATEGORY:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_LIST/EDIT_WORK_CATEGORY',
  EDIT_PRIORITY:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_LIST/EDIT_PRIORITY',
  EDIT_ITEM_FIELD:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_LIST/EDIT_ITEM_FIELD',
  ADD_ITEM:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_LIST/ADD_ITEM',
  DELETE_ITEM:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_LIST/DELETE_ITEM',
  ADD_VALIDATION_ERRORS:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_LIST/ADD_VALIDATION_ERRORS',
  CLEAR_VALIDATION_ERRORS:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-DIC-DIALOG/UI/ALLOCATE_DIC_LIST/CLEAR_VALIDATION_ERRORS',
} as const;

type InitAction = {
  type: typeof ActionType.INIT;
  payload: {
    dictItems: AutoHoursAllocationDictItem[];
  };
};

type EditJobAction = {
  type: typeof ActionType.EDIT_JOB;
  payload: {
    id: string;
    job: AutoHoursAllocationDictItem['job'];
  };
};

type EditWorkCategoryAction = {
  type: typeof ActionType.EDIT_WORK_CATEGORY;
  payload: {
    id: string;
    workCategory: AutoHoursAllocationDictItem['workCategory'];
  };
};

type EditPriorityAction = {
  type: typeof ActionType.EDIT_PRIORITY;
  payload: {
    id: string;
    priority: AutoHoursAllocationDictItem['priority'];
  };
};

type DictItemKeys = keyof AutoHoursAllocationDictItem;
type EditItemFieldAction<T extends DictItemKeys = DictItemKeys> = {
  type: typeof ActionType.EDIT_ITEM_FIELD;
  payload: {
    id: string;
    key: T;
    value: AutoHoursAllocationDictItem[T];
  };
};

type AddItemAction = {
  type: typeof ActionType.ADD_ITEM;
};

type DeleteItemAction = {
  type: typeof ActionType.DELETE_ITEM;
  payload: {
    id: string;
  };
};
type AddValidationErrorsAction = {
  type: typeof ActionType.ADD_VALIDATION_ERRORS;
  payload: {
    errors: ValidationError[];
  };
};

type ClearValidationErrorsAction = {
  type: typeof ActionType.CLEAR_VALIDATION_ERRORS;
};

type Action =
  | InitAction
  | EditJobAction
  | EditWorkCategoryAction
  | EditPriorityAction
  | EditItemFieldAction
  | AddItemAction
  | DeleteItemAction
  | AddValidationErrorsAction
  | ClearValidationErrorsAction;

export const actions = {
  initAutoHoursAllocateDic: (
    dictItems: AutoHoursAllocationDictItem[]
  ): InitAction => ({
    type: ActionType.INIT,
    payload: {
      dictItems,
    },
  }),
  editJob: (
    id: string,
    job: AutoHoursAllocationDictItem['job']
  ): EditJobAction => ({
    type: ActionType.EDIT_JOB,
    payload: {
      id,
      job,
    },
  }),
  editWorkCategory: (
    id: string,
    workCategory: AutoHoursAllocationDictItem['workCategory']
  ): EditWorkCategoryAction => ({
    type: ActionType.EDIT_WORK_CATEGORY,
    payload: {
      id,
      workCategory,
    },
  }),
  editPriority: (
    id: string,
    priority: AutoHoursAllocationDictItem['priority']
  ): EditPriorityAction => ({
    type: ActionType.EDIT_PRIORITY,
    payload: {
      id,
      priority,
    },
  }),
  editItemField: <T extends DictItemKeys>(
    id: string,
    key: T,
    value: AutoHoursAllocationDictItem[T]
  ): EditItemFieldAction => ({
    type: ActionType.EDIT_ITEM_FIELD,
    payload: {
      id,
      key,
      value,
    },
  }),
  addItem: (): AddItemAction => ({
    type: ActionType.ADD_ITEM,
  }),
  deleteItem: (id: string): DeleteItemAction => ({
    type: ActionType.DELETE_ITEM,
    payload: {
      id,
    },
  }),
  addValidationErrors: (
    errors: ValidationError[]
  ): AddValidationErrorsAction => ({
    type: ActionType.ADD_VALIDATION_ERRORS,
    payload: {
      errors,
    },
  }),
  clearValidationErrors: (): ClearValidationErrorsAction => ({
    type: ActionType.CLEAR_VALIDATION_ERRORS,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  const { byKey, allKeys, errors } = state;
  switch (action.type) {
    case ActionType.INIT: {
      const { dictItems } = (action as InitAction).payload;
      if (dictItems) {
        const byKey = {};
        const allKeys = [];
        dictItems.forEach((item) => {
          byKey[item.key] = item;
          allKeys.push(item.key);
        });
        return {
          byKey,
          allKeys,
          errors,
        };
      }
      return initialState;
    }
    case ActionType.EDIT_JOB: {
      const { id, job } = (action as EditJobAction).payload;
      return {
        byKey: {
          ...byKey,
          [id]: {
            ...byKey[id],
            job: job,
            workCategory: null,
          },
        },
        allKeys,
        errors,
      };
    }
    case ActionType.EDIT_WORK_CATEGORY: {
      const { id, workCategory } = (action as EditWorkCategoryAction).payload;
      const { workCategoryId, workCategoryCode, workCategoryName } =
        workCategory;
      return {
        byKey: {
          ...byKey,
          [id]: {
            ...byKey[id],
            workCategory: {
              workCategoryId,
              workCategoryCode,
              workCategoryName,
            },
          },
        },
        allKeys,
        errors,
      };
    }
    case ActionType.EDIT_PRIORITY: {
      const { id, priority } = (action as EditPriorityAction).payload;

      if (byKey[id].priority === priority) {
        return state;
      }

      return {
        byKey: updatePrioritiesOnChangeItemPriority(byKey, id, priority),
        allKeys,
        errors,
      };
    }
    case ActionType.EDIT_ITEM_FIELD: {
      const { id, key, value } = (action as EditItemFieldAction).payload;
      return {
        byKey: {
          ...byKey,
          [id]: {
            ...byKey[id],
            [key]: value,
          },
        },
        allKeys,
        errors,
      };
    }
    case ActionType.ADD_ITEM: {
      const newItem = {
        key: nanoid(8),
        internalUniqKey: null,
        fieldType: FIELD_TYPE.TITLE,
        operatorType: OPERATOR_TYPE.EQUALS,
        valueText: '',
        job: null,
        workCategory: null,
        referenceScopeType: REFERENCE_SCOPE_TYPE.INDIVIDUAL,
        priority: getLargestPriority(byKey) + 1,
      };
      return {
        byKey: {
          ...byKey,
          [newItem.key]: newItem,
        },
        allKeys: [...allKeys, newItem.key],
        errors,
      };
    }
    case ActionType.DELETE_ITEM: {
      const { id } = (action as DeleteItemAction).payload;
      const keyToBeDeleted = byKey[id].key;
      return {
        byKey: updatePrioritiesOnRemoveItem(byKey, id),
        allKeys: allKeys.filter((key) => byKey[key].key !== keyToBeDeleted),
        errors,
      };
    }
    case ActionType.ADD_VALIDATION_ERRORS: {
      return {
        byKey,
        allKeys,
        errors: (action as AddValidationErrorsAction).payload.errors,
      };
    }
    case ActionType.CLEAR_VALIDATION_ERRORS: {
      return {
        byKey,
        allKeys,
        errors: [],
      };
    }
    default:
      return state;
  }
};
