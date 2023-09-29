import ApiMock from '../../../../__tests__/mocks/ApiMock';
import * as actions from '../Vendor';
import Store from './mocks/Store';
import vendorDetailRes from './mocks/vendorDetailRes.mock';
import vendorListRes from './mocks/vendorListRes.mock';

jest.mock('uuid/v4', () => () => 1);

describe('Vendor', () => {
  afterEach(() => {
    ApiMock.reset();
  });

  let store;

  beforeEach(() => {
    store = Store.create();
  });

  describe('searchVendorDetail()', () => {
    it('search vendor by ID success', async () => {
      ApiMock.mockReturnValue({
        '/exp/vendor/search': vendorDetailRes,
      });

      await store.dispatch(actions.searchVendorDetail(''));

      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('searchVendorLookup()', () => {
    it('search vendor by name or code success', async () => {
      ApiMock.mockReturnValue({
        '/exp/vendor/search': vendorListRes,
      });

      await store.dispatch(actions.searchVendorLookup('', 'a'));

      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
