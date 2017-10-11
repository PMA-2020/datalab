const baseUrl = "http://api.pma2020.org";
const headers = new Headers({
  'Access-Control-Allow-Origin':'*',
});
const requestOptions = {
  method: 'get',
  mode: 'cors',
  headers
};

const displayLoading = () => {
  $(".chart-control").prop('disabled', true);
  $(".row-error").hide();
  $(".row-loading").show();
};

const displayError = () => {
  $(".row-loading").hide();
  $(".row-error").show();
};

const removeAlerts = () => {
  $(".chart-control").prop('disabled', false);
  $(".row-loading").hide();
  $(".row-error").hide();
};

const sendRequest = request => {
  displayLoading();
  return fetch(request).then(function(response) {
    removeAlerts();
    return response.json();
  }).catch(function(err) {
    displayError();
    console.log("Error while attempting to request resource. Please contact site administrator.");
    console.log(err);
  });
};

const buildUrl = (path, opts) => {
  let url =  `${baseUrl}/v1/${path}`;

  if (opts) {
    url = `${url}?`;
    for (var k in opts) { url = `${url}${k}=${opts[k]}&`; }
  }

  console.log(url);
  return url;
};

const get = (path, opts) => {
  const request = new Request(buildUrl(path, opts));
  return sendRequest(request);
};

const network = {
  get,
  buildUrl,
};

export default network;
