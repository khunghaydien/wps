import { ReactNode } from 'react';

export type Props = Readonly<{
  isShowingBody: boolean;
  children: ReactNode;
}>;

export default (props: Props) => {
  return props.isShowingBody ? props.children : null;
};
