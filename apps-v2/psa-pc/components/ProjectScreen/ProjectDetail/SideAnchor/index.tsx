import React, { useState } from 'react';

import Button from '@apps/commons/components/buttons/Button';
import IconCheckmark from '@apps/commons/images/icons/iconCheckmark.svg';

import { ROOT } from '@psa/components/ProjectScreen/ProjectDetail/Form';

import sideAnchorData from './data';

type Props = {
  refArray: Array<any>;
};

const scrollToRef = (ref) =>
  window.scrollTo({
    top: ref.current.offsetTop - 165,
    behavior: 'smooth',
  });

const SideAnchor = (props: Props) => {
  const [activeLink, setLink] = useState('BASE');

  return (
    <div className={`${ROOT}__anchors`}>
      {sideAnchorData().map((i, index) => {
        const isActive = i.key === activeLink ? 'is-active' : '';

        return (
          <Button
            key={i.key}
            className={`${ROOT}__link ${isActive}`}
            onClick={() => {
              setLink(i.key);
              scrollToRef(props.refArray[index]);
            }}
          >
            <IconCheckmark className={`${ROOT}__link-icon`} />
            <span className={`${ROOT}__text`}>{i.text}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default SideAnchor;
