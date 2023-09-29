import * as React from 'react';

import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

import { DialogType, DialogTypeProps } from '../../contexts/DialogContext';
import { useId, usePortal } from '../../hooks';

interface Props {
  dialogs: {
    [key: string]: { dialog: DialogType; props: DialogTypeProps };
  };
}

const Background = css`
  background: rgba(0, 0, 0, 0.6);
`;

const S = {
  // TODO Remove z-index after all Dialogs are replace with core/Dialog
  DialogContainer: styled.div<{ containsModal?: boolean }>`
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    /* Background */
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5100000;
    ${({ containsModal }): null | FlattenSimpleInterpolation =>
      containsModal ? Background : null}
  `,
  // TODO Remove z-index after all Dialogs are replace with core/Dialog
  DialogContent: styled.div`
    position: absolute;
    z-index: 5100000;
  `,
};

const Renderer = React.memo(
  ({ component, containsModal, ...props }: Record<string, any>) => (
    <S.DialogContainer containsModal={containsModal}>
      <S.DialogContent>{component(props)}</S.DialogContent>
    </S.DialogContainer>
  )
);

const DialogRoot: React.FC<Props> = ({ dialogs }: Props) => {
  const keys = Object.keys(dialogs);
  const containsModal = React.useMemo(() => {
    return keys.some((key) => dialogs[key].props.isModal);
  }, [keys]);
  const id = useId();

  const Dialogs = usePortal(
    `portal-${id}`,
    <>
      {keys.map((key) => (
        <Renderer
          key={key}
          component={dialogs[key].dialog}
          {...dialogs[key].props}
          containsModal={containsModal}
        />
      ))}
    </>
  );
  return Dialogs;
};

export default React.memo(DialogRoot);
