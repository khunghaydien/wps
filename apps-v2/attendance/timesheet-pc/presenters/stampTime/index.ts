import { Store } from 'redux';

import post from './post';

export default (
  store: Store
): {
  post: ReturnType<typeof post>;
} => ({
  post: post(store),
});
