import * as React from 'react';

import { mount } from 'enzyme';

// eslint-disable-next-line  import/named
// @ts-ignore
import { __get__ } from '../DetailPaneHeader';

const withDefaultButtonStatus: (
  arg0: React.ComponentType<any>
) => React.ComponentType<any> = __get__('withDefaultButtonStatus');

const bindButtonEvents: (
  arg0: React.ComponentType<any>
) => React.ComponentType<any> = __get__('bindButtonEvents');

const MODE = {
  READ_ONLY: '',
  NEW: 'new',
  EDIT: 'edit',
  OTHER: 'other',
};

describe('admin-pc/MainContents/DetailPane/DetailPaneHeader', () => {
  describe('withDefaultButtonStatus()', () => {
    describe.each([
      {
        description: 'MODE.READ_ONLY',
        props: {
          mode: MODE.READ_ONLY,
        },
        expected: {
          isDisplayCancelButton: false,
          isDisplayCloseButton: true,
          isDisplayDeleteButton: true,
          isDisplayEditButton: true,
          isDisplaySaveButton: false,
          isDisplayUpdateButton: false,
        },
      },
      {
        description: 'MODE.NEW',
        props: {
          mode: MODE.NEW,
        },
        expected: {
          isDisplayCancelButton: false,
          isDisplayCloseButton: true,
          isDisplayDeleteButton: false,
          isDisplayEditButton: false,
          isDisplayCloneButton: false,
          isDisplaySaveButton: true,
          isDisplayUpdateButton: false,
        },
      },
      {
        description: 'MODE.EDIT',
        props: {
          mode: MODE.EDIT,
        },
        expected: {
          isDisplayCancelButton: true,
          isDisplayCloseButton: false,
          isDisplayDeleteButton: false,
          isDisplayEditButton: false,
          isDisplayCloneButton: false,
          isDisplaySaveButton: false,
          isDisplayUpdateButton: true,
        },
      },
      {
        description: 'MODE.OTHER',
        props: {
          mode: MODE.OTHER,
        },
        expected: {
          isDisplayCancelButton: true,
          isDisplayCloseButton: false,
          isDisplayDeleteButton: false,
          isDisplayEditButton: false,
          isDisplayCloneButton: false,
          isDisplaySaveButton: false,
          isDisplayUpdateButton: false,
        },
      },
      {
        description: 'MODE.READ_ONLY, isSinglePane',
        props: {
          mode: MODE.READ_ONLY,
          isSinglePane: true,
        },
        expected: {
          isDisplayCancelButton: false,
          isDisplayCloseButton: false,
          isDisplayDeleteButton: false,
          isDisplayEditButton: true,
          isDisplayCloneButton: false,
          isDisplaySaveButton: false,
          isDisplayUpdateButton: false,
        },
      },
      {
        description: 'MODE.NEW, isSinglePane',
        props: {
          mode: MODE.NEW,
          isSinglePane: true,
        },
        expected: {
          isDisplayCancelButton: false,
          isDisplayCloseButton: false,
          isDisplayDeleteButton: false,
          isDisplayEditButton: false,
          isDisplayCloneButton: false,
          isDisplaySaveButton: false,
          isDisplayUpdateButton: false,
        },
      },
      {
        description: 'MODE.EDIT isSinglePane',
        props: {
          mode: MODE.EDIT,
          isSinglePane: true,
        },
        expected: {
          isDisplayCancelButton: true,
          isDisplayCloseButton: false,
          isDisplayDeleteButton: false,
          isDisplayEditButton: false,
          isDisplayCloneButton: false,
          isDisplaySaveButton: false,
          isDisplayUpdateButton: true,
        },
      },
      {
        description: 'MODE.OTHER, isSinglePane',
        props: {
          mode: MODE.OTHER,
          isSinglePane: true,
        },
        expected: {
          isDisplayCancelButton: false,
          isDisplayCloseButton: false,
          isDisplayDeleteButton: false,
          isDisplayEditButton: false,
          isDisplayCloneButton: false,
          isDisplaySaveButton: false,
          isDisplayUpdateButton: false,
        },
      },
    ])('%p', ({ description, props, expected }) => {
      const mockPresentation = jest.fn((_props) => <div />);
      const ComponentMock = withDefaultButtonStatus(mockPresentation);
      mount(<ComponentMock {...props} />);

      test(`${description}`, () => {
        const passedProps = mockPresentation.mock.calls[0][0];
        expect(passedProps).toEqual({ ...props, ...expected });
      });
    });
  });

  describe('bindButtonEvents()', () => {
    const events = {
      onClickCancelButton: () => null,
      onClickCloseButton: () => null,
      onClickDeleteButton: () => null,
      onClickEditButton: () => null,
      onClickCloneButton: () => null,
      onClickSaveButton: () => null,
      onClickUpdateButton: () => null,
    };
    const nullEvents = {
      onClickCancelButton: null,
      onClickCloseButton: null,
      onClickDeleteButton: null,
      onClickEditButton: null,
      onClickCloneButton: null,
      onClickSaveButton: null,
      onClickUpdateButton: null,
    };

    describe.each([
      {
        description: 'all true',
        props: {
          ...events,
          isDisplayCancelButton: true,
          isDisplayCloseButton: true,
          isDisplayDeleteButton: true,
          isDisplayEditButton: true,
          isDisplaySaveButton: true,
          isDisplayUpdateButton: true,
          isDisplayCloneButton: true,
        },
        expected: {
          ...events,
        },
      },
      {
        description: 'all false',
        props: {
          ...events,
          isDisplayCancelButton: false,
          isDisplayCloseButton: false,
          isDisplayDeleteButton: false,
          isDisplayEditButton: false,
          isDisplaySaveButton: false,
          isDisplayUpdateButton: false,
          isDisplayCloneButton: false,
        },
        expected: {
          ...nullEvents,
        },
      },
      {
        description: 'all no events',
        props: {
          ...nullEvents,
          isDisplayCancelButton: true,
          isDisplayCloseButton: true,
          isDisplayDeleteButton: true,
          isDisplayEditButton: true,
          isDisplaySaveButton: true,
          isDisplayUpdateButton: true,
          isDisplayCloneButton: false,
        },
        expected: {
          ...nullEvents,
        },
      },
    ])('%p', ({ description, props, expected }) => {
      const mockPresentation = jest.fn((_props) => <div />);
      const ComponentMock = bindButtonEvents(mockPresentation);
      mount(<ComponentMock {...props} />);

      test(`${description}`, () => {
        const passedProps = mockPresentation.mock.calls[0][0];
        expect(passedProps).toEqual({ ...expected });
      });
    });
  });
});
