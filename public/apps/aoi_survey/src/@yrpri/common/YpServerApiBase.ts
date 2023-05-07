import { YpCodeBase } from './YpCodeBaseclass.js';

export class YpServerApiBase extends YpCodeBase {
  baseUrlPath = '/api';

  static transformCollectionTypeToApi(type: string): string {
    let transformedApiType;

    switch (type) {
      case 'domain':
          transformedApiType = 'domains';
        break;
      case 'community':
          transformedApiType = 'communities';
        break;
      case 'group':
          transformedApiType = 'groups';
        break;
      case 'post':
          transformedApiType = 'posts';
        break;
      case 'user':
          transformedApiType = 'users';
        break;
      default:
        transformedApiType = '';
        console.error(`Cant find collection type transform for ${type}`);
    }

    return transformedApiType;
  }

  protected async fetchWrapper(
    url: string,
    options: RequestInit = {},
    showUserError = true,
    errorId: string | undefined = undefined
  ) {
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }
    if (!navigator.onLine && options.method==="POST" && window.fetch!==undefined) {
      window.appGlobals.offline.sendWhenOnlineNext({
        body: options.body,
        method: options.method,
        params: {},
        url: url
      });
      throw new Error("offlineSendLater");
    } else if (!navigator.onLine && ["POST","PUT","DELETE"].indexOf(options.method!) > -1) {
      this.showToast(this.t('youAreOfflineCantSend'));
      throw new Error("offlineSendLater");
    } else {
      const response = await fetch(url, options);
      return this.handleResponse(response, showUserError, errorId);
      }
  }

  //TODO: Handle 401
  /*

  _error: function (event) {
        this._setActive(false);
        if (!navigator.onLine) {
          this._showToast(this.t('youAreOffline'));
          event.stopPropagation();
        } else {
          if (this.dispatchError) {
            event.stopPropagation();
            if (event.detail.request.xhr.response && event.detail.request.xhr.response.error) {
              this.fire("error", event.detail.request.xhr.response.error);
            } else if (event.detail.request.xhr.response && event.detail.request.xhr.response.message) {
              this.fire("error", event.detail.request.xhr.response.message);
            } else if (event.detail.request.xhr.statusText) {
              this.fire("error", event.detail.request.xhr.statusText);
            } else {
              this.fire("error", event.detail.error);
            }
          } else if (event.detail.error && event.detail.error.message &&
            this._is401(event.detail.error.message) && !window.appUser.user &&
            this.retryMethodAfter401Login) {
            window.appUser.loginFor401(this.retryMethodAfter401Login);
          } else if (this.useDialog && !this.disableUserError) {
            this.showErrorDialog(event.detail.error);
          }
        }
      },

  */
  protected async handleResponse(
    response: Response,
    showUserError: boolean,
    errorId: string | undefined = undefined
  ) {
    if (response.ok) {
      let responseJson = null;
      try {
        responseJson = await response.json();
      } catch (error) {
        if (response.status === 200 && response.statusText === 'OK') {
          // Do nothing
        } else {
          this.fireGlobal('yp-network-error', {
            response: response,
            jsonError: error,
            showUserError,
            errorId,
          });
        }
      }
      if (responseJson!==null) {
        return responseJson;
      } else {
        return true;
      }
    } else {
      this.fireGlobal('yp-network-error', {
        response: response,
        showUserError,
        errorId,
      });
      return null;
    }
  }
}
