import Api from '../commons/api';

import {
  AttSummary,
  AttSummaryFromRemote,
  createFromRemote,
} from '../domain/models/team/AttSummary';

import adapter from './adapters';

type SearchQuery = Readonly<{
  targetYear: string;
  targetMonthly: string;
  departmentId: string | null | undefined;
}>;

const queryToParam = (query: SearchQuery) => ({
  ...query,
  departmentId: query.departmentId || null,
});

export default {
  /**
   * Execute to get an timesheet
   *
   * @param targetYear - 対象年
   * @param targetMonthly - 対象月度
   * @param departmentId - 部署ID
   * {@link https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/894239334/team+att+summary+search}
   */
  search: (query: SearchQuery): Promise<AttSummary> => {
    return Api.invoke({
      path: '/team/att/summary/search',
      param: adapter.toRemote(query, [queryToParam]),
    }).then((result: AttSummaryFromRemote) => {
      return adapter.fromRemote({ ...result }, [createFromRemote]);
    });
  },
};
