import * as React from 'react';

import styled from 'styled-components';

import $CheckBox from '../../../atoms/Fields/CheckBox';
import Person from '../../../atoms/Person';

const CheckBox = styled($CheckBox)`
  &&& {
    .mobile-app-atoms-checkbox__input-checkbox {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
`;

const PersonCheckBox: React.FC<
  React.ComponentProps<typeof Person> & React.ComponentProps<typeof CheckBox>
> = ({ className, src, alt, onCheck, ...checkboxProps }) => {
  return (
    <div
      className={className}
      role="button"
      aria-hidden="true"
      onClick={onCheck}
    >
      {checkboxProps.value ? (
        <CheckBox {...checkboxProps} onChange={onCheck} />
      ) : (
        <Person src={src} alt={alt} />
      )}
    </div>
  );
};

export default PersonCheckBox;
