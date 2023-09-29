import React from 'react';

import styled from 'styled-components';

interface Props {
  icon: string | React.ComponentType<Record<string, unknown>>;
  children: React.ReactNode;

  // eslint-disable-next-line react/no-unused-prop-types
  iconAssistiveText?: string;
}

const Fixed = styled.nav`
  position: fixed;
  width: 100%;
  height: 56px;
  background: #fff;
  top: 0;
  left: 0;
  z-index: 10001;
  border-bottom: 1px solid #eee;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const IconContainer = styled.div`
  width: 32px;
  height: 32px;
  margin: 12px 20px;
`;

const NavigationBar = (props: Props) => {
  // <props.icon /> `would be unused-vars in ESLint, so use variable
  const Icon = props.icon;
  return (
    <Fixed>
      <Flex>
        <IconContainer>
          <Icon />
        </IconContainer>
        {props.children}
      </Flex>
    </Fixed>
  );
};

export default NavigationBar;
