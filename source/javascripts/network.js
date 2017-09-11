const baseUrl = "http://api.pma2020.org";
const headers = new Headers({
  'Access-Control-Allow-Origin':'*',
});
const requestOptions = {
  method: 'get',
  mode: 'cors',
  headers
};

const sendRequest = request => {
  return fetch(request).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log("Error while attempting to request resource. Please contact site administrator.");
  });
};

const buildUrl = path => {
  return `${baseUrl}/v1/${path}`;
};

const get = path => {
  const request = new Request(buildUrl(path), requestOptions);
  return sendRequest(request);
};


const network = {
  get,
};

export default network;
