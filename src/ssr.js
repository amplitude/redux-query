import ReactDOMServer from 'react-dom/server';
import walkTree from 'react-tree-walker';

export const renderToStringWithData = element =>
  getDataFromTree(element).then(() => ReactDOMServer.renderToString(element));

export const getDataFromTree = element => {
  const promises = [];
  return walkTree(element, visitor(promises)).then(() => Promise.all(promises));
};

const visitor = promises => (element, instance) => {
  if (instance && instance.requestData) {
    promises.push(instance.requestData());
  }
};
