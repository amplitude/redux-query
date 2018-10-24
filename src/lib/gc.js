export const lru = (state, options = { count: 100 }) => {
  const withQueryKeys = Object.keys(state).map(queryKey => ({
    queryKey,
    query: state[queryKey],
  }));
  const collected = withQueryKeys
    .filter(item => !!getQueryTime(item))
    .sort(reverseCompareTimes)
    .slice(0, options.count);
  const all = collected.concat(withQueryKeys.filter(item => !getQueryTime(item)));
  return all.reduce((acc, item) => {
    acc[item.queryKey] = state[item.queryKey];
    return acc;
  }, {});
};

const compareTimes = (a, b) => {
  if (getQueryTime(a) > getQueryTime(b)) {
    return 1;
  }
  if (getQueryTime(b) > getQueryTime(a)) {
    return -1;
  }
  return 0;
};
const getQueryTime = item => item.query.lastUpdated;
const reverseCompareTimes = (a, b) => compareTimes(b, a);
