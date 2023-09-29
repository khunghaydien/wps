import React, { forwardRef, Ref } from 'react';

import styled from 'styled-components';

import { LinkButton } from '@apps/core';
import Tooltip from '@commons/components/Tooltip';
import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

type Props = {
  id?: string;
  eventsCount: number;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

const S = {
  LinkButton: styled(LinkButton)`
    font-size: 10px;
  `,
};

const MoreLink = (props: Props, ref: Ref<HTMLDivElement>) => {
  return (
    <div ref={ref}>
      <Tooltip id={props.id} align="top" content={msg().Cal_Lbl_SeePlans}>
        <S.LinkButton
          data-testid="open-event-list-popup"
          tabIndex={0}
          size="small"
          onClick={props.onClick}
        >
          {TextUtil.nl2br(
            TextUtil.template(msg().Cal_Lbl_Plans, props.eventsCount)
          )}
        </S.LinkButton>
      </Tooltip>
    </div>
  );
};

export default forwardRef<HTMLDivElement, Props>(MoreLink);
