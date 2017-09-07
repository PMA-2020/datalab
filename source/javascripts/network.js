const baseUrl = "http://api.pma2020.org";
const headers = new Headers({
  'Access-Control-Allow-Origin':'*',
});
const requestOptions = {
  method: 'get',
  mode: 'cors',
  headers
};

const sendRequest = (request) => {
  return fetch(request).then(function(response) {
    return response.json();
  }).catch(function(err) {
    console.log("Error while attempting to request resource. Please contact site administrator.");
  });
}

const buildUrl = (path) => {
  return getVersion().then(version => {
    return `${baseUrl}/v${version}/${path}`;
  })
}

const getVersion = async () => {
  const url = `${baseUrl}/v1/version`;
  const request = new Request(url, requestOptions);
  const res = await sendRequest(request);
  const majorVersion = res.version.split(".")[0];
  return majorVersion;
}

const get = path => buildUrl(path).then(url => {
  const request = new Request(url, requestOptions);
  return sendRequest(request);
});


const network = {
  get,
}

export default network;
