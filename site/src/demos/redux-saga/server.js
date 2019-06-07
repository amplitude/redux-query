/**
 * This is a mock server for demonstration purposes. redux-query is purely a
 * client-side library and is completely ambivalent to the server's
 * architecture.
 */

const artificialDelayDuration = 1000;
const memoryDb = {
  name: '',
};

/**
 * The response callback function type (called by `serveRequest` below).
 *
 * @callback responseCallback
 * @param {number} response status
 * @param {string|Object} response body
 * @param {Object=} response headers
 */

/**
 * This is the server's main function that handles all requests.
 *
 * @param {string} url The url being requested
 * @param {string} method The HTTP request method
 * @param {Object} options An object with the request body and request headers
 * @param {responseCallback} callback Function to call with response data
 * @returns {void}
 */
const serveRequest = (url, method, { body }, callback) => {
  if (url.match(/^\/api\/name/)) {
    // Endpoint for getting the current name

    if (method.toUpperCase() === 'GET') {
      setTimeout(() => {
        callback(200, {
          name: memoryDb.name,
        });
      }, artificialDelayDuration);
    } else {
      callback(405);
    }
  } else if (url.match(/^\/api\/change-name/)) {
    // Endpoint for changing the name

    if (method !== 'POST') {
      callback(405);
      return;
    }

    if (!body.name || body.name.trim().length === 0 || body.name.trim() !== body.name) {
      setTimeout(() => {
        callback(400, 'A valid name must be provided with no leading or trailing spaces');
      }, artificialDelayDuration);
      return;
    }

    memoryDb.name = body.name;

    setTimeout(() => {
      callback(200, {
        name: memoryDb.name,
      });
    }, artificialDelayDuration);
  } else {
    callback(404);
  }
};

export default serveRequest;
