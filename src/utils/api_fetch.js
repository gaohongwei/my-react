import fetch from 'isomorphic-fetch';
async function fetchJson(path, options) {
  const response = await fetch(path, options);

  if (response.status === 401 || response.status === 400) {
    return {code: response.status, message: 'Failed ...'}
  }

  const jsonBody = await response.json();
  if (jsonBody.error) {
    return {code: jsonBody.status, message: jsonBody.error, backendStack: jsonBody.backendStack}
  }

  return {code: 200, data: jsonBody}
}


