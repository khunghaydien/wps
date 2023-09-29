import * as React from 'react';

import styled from 'styled-components';

import Tooltip from '../../../commons/components/Tooltip';
import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';
import { LinkButton } from '../../../core';

type Props = {
  id?: string;
  onClick: (arg0: React.MouseEvent<HTMLElement>) => void;
  eventsCount: number;
};

const S = {
  LinkButton: styled(LinkButton)`
    font-size: 10px;
  `,
};

const MoreLink = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
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
});

export default MoreLink;
