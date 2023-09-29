import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';

import { CoreProvider } from '../../index';
import Dialog, { useModal, useModeless } from '../Dialog';

const testRender = (app) => {
  return render(<CoreProvider>{app}</CoreProvider>);
};

const TestDialog = ({
  isModal,
  onClose,
  ...props
}: {
  isModal: boolean;
  onClose?: (event: React.SyntheticEvent<HTMLElement>) => void;
  'data-testid'?: string;
}) => (
  <Dialog
    onClose={onClose}
    data-testid={props['data-testid'] || 'test-dialog'}
    isModal={isModal}
    title="TEST"
    content={<h3>TEST</h3>}
  />
);

const TestModal = () => {
  const [show, hide] = useModal(TestDialog, []);
  return (
    <>
      <button onClick={show} data-testid="show" />
      <button onClick={hide} data-testid="hide" />
    </>
  );
};

const TestModeless = () => {
  const [show, hide] = useModeless(TestDialog, []);
  return (
    <>
      <button onClick={() => show()} data-testid="show" />
      <button onClick={() => hide()} data-testid="hide" />
    </>
  );
};

it('should show a modal dialog on triggered show action', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = testRender(<TestModal />);
  const show = getByTestId('show');

  // Act
  fireEvent.click(show);

  const actual = queryByTestId('test-dialog');

  // Assert
  expect(actual).not.toBeNull();
});

it('should hide a modal dialog on triggered hide action', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = testRender(<TestModal />);
  const show = getByTestId('show');
  const hide = getByTestId('hide');

  // Act
  fireEvent.click(show);

  fireEvent.click(hide);
  const actual = queryByTestId('test-dialog');

  // Assert
  expect(actual).toBeNull();
});

it('should render a modeless dialog on triggered show action', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = testRender(<TestModeless />);
  const show = getByTestId('show');

  // Act
  fireEvent.click(show);

  // Assert
  const actual = queryByTestId('test-dialog');
  expect(actual).not.toBeNull();
});

it('should hide a modeless dialog on triggered hide action', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = testRender(<TestModeless />);
  const show = getByTestId('show');
  const hide = getByTestId('hide');

  // Act
  fireEvent.click(show);

  fireEvent.click(hide);
  const actual = queryByTestId('test-dialog');

  // Assert
  expect(actual).toBeNull();
});

it('should show multiple dialogs', async () => {
  // Arrange
  const TestMultipleDialogs = () => {
    const [show1, hide1] = useModeless(
      ({ isModal }) => (
        <TestDialog isModal={isModal} data-testid="test-dialog1" />
      ),
      []
    );
    const [show2, hide2] = useModal(
      ({ isModal }) => (
        <TestDialog isModal={isModal} data-testid="test-dialog2" />
      ),
      []
    );
    const [show3, hide3] = useModal(
      ({ isModal }) => (
        <TestDialog isModal={isModal} data-testid="test-dialog3" />
      ),
      []
    );
    const [show4, hide4] = useModeless(
      ({ isModal }) => (
        <TestDialog isModal={isModal} data-testid="test-dialog4" />
      ),
      []
    );
    return (
      <>
        <button onClick={show1} data-testid="show1" />
        <button onClick={hide1} data-testid="hide1" />
        <button onClick={show2} data-testid="show2" />
        <button onClick={hide2} data-testid="hide2" />
        <button onClick={show3} data-testid="show3" />
        <button onClick={hide3} data-testid="hide3" />
        <button onClick={show4} data-testid="show4" />
        <button onClick={hide4} data-testid="hide4" />
      </>
    );
  };

  const { getByTestId, queryByTestId } = testRender(<TestMultipleDialogs />);

  // Act
  fireEvent.click(getByTestId('show2'));
  fireEvent.click(getByTestId('show4'));

  const actual = {
    dialog1: queryByTestId('test-dialog1'),
    dialog2: queryByTestId('test-dialog2'),
    dialog3: queryByTestId('test-dialog3'),
    dialog4: queryByTestId('test-dialog4'),
  };

  // Assert
  // TODO
  // Rewrite the following assertions to single assertion
  // with custom matcher.
  expect(actual.dialog1).toBeNull();
  expect(actual.dialog2).not.toBeNull();
  expect(actual.dialog3).toBeNull();
  expect(actual.dialog4).not.toBeNull();
});

it('should close a modal dialog on click close button', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = testRender(<TestModal />);

  const show = getByTestId('show');
  fireEvent.click(show);

  // Act
  const close = getByTestId('test-dialog__close-button');
  fireEvent.click(close);

  const actual = queryByTestId('test-dialog');

  // Assert
  expect(actual).toBeNull();
});

it('should close a modeless dialog on click close button', async () => {
  // Arrange
  const { getByTestId, queryByTestId } = testRender(<TestModeless />);

  const show = getByTestId('show');
  fireEvent.click(show);

  // Act
  const close = getByTestId('test-dialog__close-button');
  fireEvent.click(close);

  const actual = queryByTestId('test-dialog');

  // Assert
  expect(actual).toBeNull();
});
