// @flow

export const pick = <T: { [key: string]: mixed }>(
  source: T,
  keysToPick: Array<string>,
): { ...{ ...T } } => {
  const picked = { ...source };
  const keysToPickSet = new Set(...keysToPick);
  const keysToDelete = Object.keys(source).filter(key => !keysToPickSet.has(key));

  for (const key of keysToDelete) {
    if (picked.hasOwnProperty(key)) {
      delete picked[key];
    }
  }

  return picked;
};
