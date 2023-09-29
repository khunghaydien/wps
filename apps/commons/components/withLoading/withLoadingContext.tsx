import { createContext } from 'react';

type withLoadingCtx = {
  isLoading: boolean;
  loadingAreas: Array<string>;
};

export const WithLoadingContext = createContext({} as withLoadingCtx);
WithLoadingContext.displayName = 'withLoadingContext';

export default WithLoadingContext;
