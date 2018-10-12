import ReactDOM from 'react-dom';
import walkTree from 'react-tree-walker';
export const renderToStringWithData = element =>
  getDataFromTree(element).then(() => ReactDOM.renderToString(element));

export const getDataFromTree = element => {
  const promises = [];
  walkTree(element, visitor(promises));
  return Promise.all(promises);
};

const visitor = promises => (element, instance) => {
  if (element.forceRequest) {
    promises.push(element.forceRequest());
  } else if (instance.forceRequest) {
    promises.push(instance.forceRequest());
  }
};
