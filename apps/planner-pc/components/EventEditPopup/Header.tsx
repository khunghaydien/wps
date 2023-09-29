import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../commons/languages';

type Props = Readonly<
  Exclude<
    React.ComponentProps<'input'>,
    {
      children: React.ReactNode | null;
    }
  >
>;

const S = {
  Title: styled.header`
    width: 100%;
    height: 100%;
    padding-top: 12px;
  `,
  TitleInput: styled.input.attrs<Props>(() => ({
    type: 'text',
  }))`
    width: 462px;
    height: 36px;
    margin-left: 12px;
    border-radius: 4px;
    border: 0;
    font-size: 20px;
    line-height: 30px;
    padding: 2px 8px 2px 8px;

    :focus {
      border: 1px solid #2782ed;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 0 3px #0070d2;
      outline: none;
    }

    :hover {
      background: #f3f2f2;
    }

    ::placeholder {
      color: #999;
      font-size: 20px;
      line-height: 30px;
    }
  `,
};

const Header: React.ComponentType<Props> = React.memo((props: Props) => {
  const ref: React.RefObject<HTMLInputElement> = React.useRef();

  React.useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <S.Title>
      <S.TitleInput
        {...props}
        data-testid="event-edit-popup__title"
        ref={ref}
        placeholder={msg().Cal_Lbl_Title}
      />
    </S.Title>
  );
});

export default Header;
