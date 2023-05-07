import { YpCodeBase } from '../common/YpCodeBaseclass.js'

export class YpAnalytics extends YpCodeBase {

  pixelTrackerId: string | undefined;

  communityTrackerId: string | undefined;

  communityTrackerIds: Record<string,boolean> = {}

  setupGoogleAnalytics(domain: YpDomainData) {
    if (domain.public_api_keys && domain.public_api_keys && domain.public_api_keys.google && domain.public_api_keys.google.analytics_tracking_id) {
      ga('create', domain.public_api_keys.google.analytics_tracking_id, 'auto');
    } else if (domain.google_analytics_code && domain.google_analytics_code!="") {
      ga('create', domain.google_analytics_code, 'auto');
    }
    if (typeof ga == 'function') {
      ga('set', 'anonymizeIp', true);
      ga('send', 'pageview', location.pathname);
      ga('set', 'nonInteraction', true);
      setTimeout(() => {
        ga('set', 'nonInteraction', false);
      }, 900);
    } else {
      console.warn("Can't find Google Analytics object");
    }
  }

  facebookPixelTracking(event: string, detailedEvent: string | undefined = undefined) {
    if (this.pixelTrackerId && event) {
      let fbEvent;
      if (event==="pageview") {
        fbEvent="PageView"
      } else if (event==="event" && detailedEvent) {
        fbEvent=detailedEvent;
      } else {
        fbEvent=event;
      }
      const image = new Image(1,1);
      image.src = "https://www.facebook.com/tr?id="+this.pixelTrackerId+"&ev="+fbEvent+"&noscript=1";
      console.debug("Have sent to Facebook pixel: "+fbEvent)
    }
  }

  setCommunityPixelTracker(trackerId: string | undefined) {
    if (trackerId && trackerId!=='') {
      if (localStorage.getItem("consentGivenForFacebookPixelTracking")!=null) {
        const oldTrackerId = this.pixelTrackerId;
        this.pixelTrackerId = trackerId;
        if (trackerId!==oldTrackerId) {
          this.facebookPixelTracking('pageview');
        }
      } else if (!localStorage.getItem("disableFacebookPixelTracking")) {
        //TODO: Make sure is implemented
        this.fireGlobal('yp-open-pixel-cookie-confirm', trackerId);
      } else {
        console.log("Facebook tracking disabled");
      }
    } else {
      this.pixelTrackerId = undefined;
    }
  }

  setCommunityAnalyticsTracker(trackerId: string | undefined) {
    trackerId = trackerId?.trim();
    if (trackerId && trackerId.length>5) {
      const oldTrackerId = this.communityTrackerId;
      this.communityTrackerId=trackerId;
      if (trackerId!==oldTrackerId) {
        this.sendToAnalyticsTrackers('sendOnlyCommunity', 'pageview', location.pathname);
      }
    } else {
      this.communityTrackerId = undefined;
    }
  }

  sendToAnalyticsTrackers(a: string|object, b: string|object,
                          c: string|object, d: string|object|undefined = undefined,
                          e: string|object|undefined = undefined, f: string|object|undefined = undefined) {
    //console.debug("Analytics "+a+" "+b+" "+c+" "+d);
    if (typeof ga == 'function') {
      if (a!='sendOnlyCommunity') {
        ga('send', b, c, d, e, f);
        console.debug("Analytics global: send "+b+" "+c+" "+d);
      }
      if (this.communityTrackerId) {
        let sendName = 'tracker'+this.communityTrackerId.replace(/-/g,'');
        if (!this.communityTrackerIds[this.communityTrackerId]) {
          ga('create', this.communityTrackerId, 'auto', sendName);
          this.communityTrackerIds[this.communityTrackerId] = true;
          console.debug("Created tracker: "+sendName);
        }
        sendName += '.send';
        console.debug("Analytics: "+sendName+": "+b+" "+c+" "+d);
        ga(sendName, b, c, d, e, f);
      }
    } else {
      console.warn("Google analytics message not sent for a:"+a+" b:"+b+" c:"+c+" d:"+d+" e:"+e+" f:"+f);
    }

    if (a!='sendOnlyCommunity') {
      this.facebookPixelTracking(b as string, c as string);
    }
  }

  sendLoginAndSignup(userId: number, eventType: string, authProvider: string, validationError: string|undefined=undefined) {
    if (typeof ga == 'function') {
      if (userId) {
        ga('set', '&uid', userId);
      }

      let fieldsObjects;
      let authProviderText = authProvider;

      switch(eventType) {
        case 'Signup Success':
          fieldsObjects = {
            'dimension1': userId,
            'dimension2': 'Yes',
            'dimension3': authProvider,
            'metric1': '1'
          };
          break;
        case 'Signup Fail':
          fieldsObjects = {
            'dimension3': authProvider,
            'metric2': '1'
          };
          authProviderText += ": "+validationError;
          break;
        case 'Signup Submit':
          fieldsObjects = {
            'dimension3': authProvider,
            'metric3': '1'
          };
          break;
        case 'Login Success':
          fieldsObjects = {
            'dimension1': userId,
            'dimension2': 'Yes',
            'dimension3': authProvider,
            'metric4': '1'
          };
          break;
        case 'Login Fail':
          fieldsObjects = {
            'dimension3': authProvider,
            'metric5': '1'
          };
          authProviderText += ": "+validationError;
          break;
        case 'Login Submit':
          fieldsObjects = {
            'dimension3': authProvider,
            'metric6': '1'
          };
          break;
        case 'Signup/Login Opened':
          fieldsObjects = {
            'metric7': '1'
          };
          break;
      }
      this.sendToAnalyticsTrackers('send','event','Login and Signup', eventType, authProviderText, fieldsObjects);
    }
  }
}
