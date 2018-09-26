export const pick = (object, keys) =>
  keys.reduce((accumulator, key) => ({ ...accumulator, [key]: object[key] }), {});
export const omit = (object, keys) =>
  Object.keys(object).reduce(
    (accumulator, key) => ({
      ...accumulator,
      ...(keys.indexOf(key) === -1 ? { [key]: object[key] } : {}),
    }),
    {},
  );

export const identity = a => a;

const baseGet = (object, path) => {
  let index = 0;
  let res = object;
  const length = path.length;

  while (object != null && index < length) {
    res = res[path[index++]];
  }
  return index && index == length ? res : undefined;
};

export const get = (object, path, defaultValue) => {
  const result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
};
