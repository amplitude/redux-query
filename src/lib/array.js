export const intersection = (a, b) => a.filter(item => b.indexOf(item) !== -1);
export const difference = (a, b) => a.filter(item => b.indexOf(item) === -1);
