import styled from 'styled-components';

import * as Base from '../atoms/Card';

// @ts-ignore https://github.com/microsoft/TypeScript/issues/37597
export const Card = styled(Base.Card)<{ isOpen?: boolean }>`
  min-height: ${(props) => (props.isOpen ? '290px' : 'auto')};
`;
export const Header = Base.Header;
export const HeaderGroup = Base.HeaderGroup;
export const HeaderItem = Base.HeaderItem;
export const Divider = Base.Divider;
export const Body = Base.Body;
export const Title = Base.Title;
