import env from '../../env';

/**
 * Encapsulate network requests to the API
 */
export default class Network {
  /**
   * Display that the network is loading data
   * @private
   */
  static displayLoading() {
    $(".chart-control").prop('disabled', true);
    $(".row-error").hide();
    $(".row-loading").show();
  }

  /**
   * Display to the user that there was an error
   * @private
   */
  static displayError() {
    $(".row-loading").hide();
    $(".row-error").show();
  }

  /**
   * Remove all alerts and error info
   * @private
   */
  static removeAlerts() {
    $(".chart-control").prop('disabled', false);
    $(".row-loading").hide();
    $(".row-error").hide();
  }

  /**
   * Send network request for data
   * @private
   */
  static sendRequest(request) {
    Network.displayLoading();
    return fetch(request).then(function(response) {
      Network.removeAlerts();
      return response.json();
    }).catch(function(err) {
      Network.displayError();
      console.log("Error while attempting to request resource. Please contact site administrator.");
      console.log(err);
    });
  }

  /**
   * Build a URL to the API v1
   */
  static buildUrl(path, opts) {
    const baseUrl = env.api_url || 'http://api.pma2020.org';
    let url =  `${baseUrl}/v1/${path}`;
    if (opts) {
      url = `${url}?`;
      for (var k in opts) { url = `${url}${k}=${opts[k]}&`; }
    }
    return url;
  }

  /**
   * Send a GET request to the API at path, with options (opts)
   */
  static get(path, opts) {
    const request = new Request(this.buildUrl(path, opts));
    return this.sendRequest(request);
  }
}
