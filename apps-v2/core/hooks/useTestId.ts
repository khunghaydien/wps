import { useMemo } from 'react';

type Props = {
  'data-testid'?: string;
};

type TestIdBuilder = (testId: string) => string;

export default (
  { 'data-testid': testId }: Props,
  builder?: TestIdBuilder
): typeof undefined | string => {
  return builder
    ? useMemo(() => (testId ? builder(testId) : undefined), [testId])
    : testId;
};
