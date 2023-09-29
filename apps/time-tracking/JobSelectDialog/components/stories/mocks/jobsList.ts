import range from 'lodash/range';

import { Job, Jobable } from '../../../../../domain/models/time-tracking/Job';

const createJobs = (
  name: string,
  parentId: string | null | undefined,
  hasChildren: boolean,
  isEditLocked: boolean,
  length: number
): Job[] => {
  return range(0, length).map((id) => ({
    parentId,
    name,
    id: `${name}-${id}-${parentId || 'x'}`,
    hasChildren,
    code: '0000001',
    isDirectCharged: false,
    workCategories: [],
    hasJobType: false,
    isEditLocked,
  }));
};

const [contractProject] = createJobs(
  'Contracted Projects',
  null,
  true,
  false,
  1
);
const [pd] = createJobs('PD', null, true, false, 1);
const [locked] = createJobs('Locked', null, true, true, 1);
const [others] = createJobs('Others', null, true, false, 1);
const companies = createJobs(
  'TeamSpirit',
  contractProject.id,
  true,
  false,
  100
);
const projects = createJobs('Project', companies[0].id, true, false, 100);
const jobs = createJobs('Project', projects[0].id, true, false, 1000);
export const selectedJob = jobs[4];

async function* toLoadingList(xs: Array<Job>): AsyncGenerator<Job, void, void> {
  const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

  for (const job of xs) {
    yield job;
  }

  // Block returning an element in order to display snackbar
  await sleep(100000);
  const [last] = createJobs('Project', projects[0].id, false, false, 1);
  yield last;
}

export const createJobables = (count: number): Array<Jobable> =>
  new Array(count).fill(null).map((_, i) => {
    const id = i.toString().padStart(6, '0');
    return {
      id,
      code: id,
      name: id,
      isEditLocked: i === 0,
      hasChildren: false,
    };
  });

const searchQuery = { parentJobId: '', codeOrName: '' };

export default [
  { key: '1', searchQuery, value: [contractProject, pd, locked, others] },
  { key: '2', searchQuery, value: companies },
  { key: '3', searchQuery, value: projects },
  { key: '4', searchQuery, value: toLoadingList(jobs) },
];
