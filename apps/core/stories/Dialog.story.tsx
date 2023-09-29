import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import DialogRoot from '../blocks/Dialog/DialogRoot';
import { Button, Dialog, Text } from '../index';

const Footer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  padding: 12px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
`;

const Wrapper = styled.div`
  max-height: 572px;
  max-width: 1000px;
  min-height: 320px;
  min-width: 460px;
`;

const ContentWrapper = styled.div`
  min-height: 200px;
`;

const PrimaryButton = styled(Button)`
  padding: 0 16px;
`;

const CancelButton = styled(Button)`
  padding: 0 16px;
  margin: 0 16px 0 0;
`;

const modelessDecorator = (story) => (
  <DialogRoot
    dialogs={{
      '1': {
        dialog: () => story(),
        props: {
          isModal: false,
          onClose: action('onClose'),
        },
      },
    }}
  />
);

const modalDecorator = (story) => (
  <DialogRoot
    dialogs={{
      '1': {
        dialog: () => story(),
        props: { isModal: true, onClose: action('onClose') },
      },
    }}
  />
);

export default {
  title: 'core/Dialog',
};

export const Modeless = () => (
  <>
    <Dialog
      isModal={false}
      title="Modeless"
      content={<Text>Content</Text>}
      footer={
        <Footer>
          <CancelButton>Cancel</CancelButton>
          <PrimaryButton color="primary">OK</PrimaryButton>
        </Footer>
      }
      onClose={action('onClose')}
    />
  </>
);

Modeless.storyName = 'modeless';
Modeless.decorators = [modelessDecorator];

export const ModelessNoFooter = () => (
  <>
    <Dialog
      isModal={false}
      title="Modeless"
      content={<Text>Content</Text>}
      onClose={action('onClose')}
    />
  </>
);

ModelessNoFooter.storyName = 'modeless - no footer';
ModelessNoFooter.decorators = [modelessDecorator];

export const Modal = () => (
  <Wrapper>
    <Dialog
      isModal
      title="Modal"
      content={
        <ContentWrapper>
          <Text>Content</Text>
        </ContentWrapper>
      }
      footer={
        <Footer>
          <CancelButton>Cancel</CancelButton>
          <PrimaryButton color="primary">OK</PrimaryButton>
        </Footer>
      }
      onClose={action('onClose')}
    />
  </Wrapper>
);

Modal.storyName = 'modal';
Modal.decorators = [modalDecorator];

export const ModalNoFooter = () => (
  <Wrapper>
    <Dialog
      isModal
      title="Modal"
      content={
        <ContentWrapper>
          <Text>Content</Text>
        </ContentWrapper>
      }
      onClose={action('onClose')}
    />
  </Wrapper>
);

ModalNoFooter.storyName = 'modal - no footer';
ModalNoFooter.decorators = [modalDecorator];

export const ModalCustomHeader = () => (
  <Wrapper>
    <Dialog
      isModal
      title="Modal"
      header={
        <Header>
          <div>Small Title</div>
          <div>Content</div>
        </Header>
      }
      content={
        <ContentWrapper>
          <Text>Content</Text>
        </ContentWrapper>
      }
      onClose={action('onClose')}
    />
  </Wrapper>
);

ModalCustomHeader.storyName = 'modal - custom header';
ModalCustomHeader.decorators = [modalDecorator];
