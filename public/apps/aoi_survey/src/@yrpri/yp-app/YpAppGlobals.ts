import i18next from 'i18next';
//TODO: Fix moment
//import moment from 'moment';
import HttpApi from 'i18next-http-backend';

import { YpServerApi } from '../common/YpServerApi.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { YpCodeBase } from '../common/YpCodeBaseclass.js';
import { YpRecommendations } from './YpRecommendations.js';
import { YpCache } from './YpCache.js';
import { YpOffline } from './YpOffline.js';
import { YpAnalytics } from './YpAnalytics.js';
import { YpThemeManager } from './YpThemeManager.js';
//import { any /*Snackbar*/ } from '@material/mwc-snackbar';

export class YpAppGlobals extends YpCodeBase {
  seenWelcome = false;

  resetSeenWelcome = false;

  disableWelcome = false;

  activityHost = '';

  domain: YpDomainData | undefined;

  groupConfigOverrides: Record<number, Record<string, string | boolean>> = {};

  currentAnonymousUser: YpUserData | undefined;

  currentGroup: YpGroupData | undefined;

  registrationQuestionsGroup: YpGroupData | undefined;

  currentAnonymousGroup: YpGroupData | undefined;

  currentForceSaml = false;

  disableFacebookLoginForGroup = false;

  currentSamlDeniedMessage: string | undefined;

  currentSamlLoginMessage: string | undefined;

  originalQueryParameters: Record<string, string | number | undefined> = {};

  externalGoalTriggerGroupId: number | undefined;

  externalGoalCounter = 0;

  appStartTime: Date;

  autoTranslate = false;

  goalTriggerEvents: Array<string> = [
    'newPost',
    'endorse_up',
    'endorse_down',
    'newPointFor',
    'newPointAgainst',
  ];

  haveLoadedLanguages = false;

  hasTranscriptSupport = false;

  hasVideoUpload = false;

  hasAudioUpload = false;

  // Locale seleted from query or loaded
  locale: string | undefined;

  // TODO: Remove any,
  i18nTranslation: any | undefined;

  serverApi: YpServerApi;

  recommendations: YpRecommendations;

  cache: YpCache;

  offline: YpOffline;

  analytics: YpAnalytics;

  theme: YpThemeManager;

  highlightedLanguages: string | undefined;

  magicTextIronResizeDebouncer: number | undefined;

  signupTermsPageId: number | undefined;

  retryMethodAfter401Login: Function | undefined;

  groupLoadNewPost = false;

  constructor(serverApi: YpServerApi) {
    super();

    this.appStartTime = new Date();

    this.serverApi = serverApi;
    this.recommendations = new YpRecommendations(serverApi);
    this.cache = new YpCache();
    this.analytics = new YpAnalytics();
    this.theme = new YpThemeManager();
    this.offline = new YpOffline();

    // Boot
    this.boot();
    this.hasVideoUploadSupport();
    this.hasAudioUploadSupport();

    //TODO: See if this is recieved
    this.fireGlobal('app-ready');
    this.parseQueryString();
    this.addGlobalListener('yp-logged-in', this._userLoggedIn.bind(this));
  }

  showRecommendationInfoIfNeeded() {
    if (!localStorage.getItem('ypHaveShownRecommendationInfo')) {
      localStorage.setItem('ypHaveShownRecommendationInfo', '1');
      this.fireGlobal('yp-notify-dialog', {
        text: this.t('recommendationToastInfo'),
      });
    }
  }

  showSpeechToTextInfoIfNeeded() {
    if (
      window.appGlobals.hasTranscriptSupport &&
      !localStorage.getItem('haveShownTranscriptInfo')
    ) {
      localStorage.setItem('haveShownTranscriptInfo', '1');
      this.fireGlobal('yp-notify-dialog', { text: this.t('speechToTextInfo') });
    }
  }

  async hasVideoUploadSupport() {
    const response = (await this.serverApi.hasVideoUploadSupport()) as YpHasVideoResponse | void;
    if (response) {
      window.appGlobals.hasVideoUpload = response.hasVideoUploadSupport;
      window.appGlobals.hasTranscriptSupport = response.hasTranscriptSupport;
      this.fireGlobal('yp-has-video-upload');
    }
  }

  sendVideoView(videoId: number | string) {
    this.serverApi.sendVideoView({ videoId: videoId });
    this.activity('view', 'video', videoId);
  }

  sendLongVideoView(videoId: number | string) {
    this.serverApi.sendVideoView({ videoId: videoId, longPlaytime: true });
    this.activity('view', 'videoLong', videoId);
  }

  async hasAudioUploadSupport() {
    const response = (await this.serverApi.hasAudioUploadSupport()) as YpHasAudioResponse | void;
    if (response) {
      window.appGlobals.hasAudioUpload = response.hasAudioUploadSupport;
      this.fireGlobal('yp-has-audio-upload');
    }
  }

  sendAudioListen(audioId: number | string) {
    this.serverApi.sendAudioView({ audioId: audioId });
    this.activity('view', 'audio', audioId);
  }

  sendLongAudioListen(audioId: number | string) {
    this.serverApi.sendAudioView({ audioId: audioId, longPlaytime: true });
    this.activity('view', 'audioLong', audioId);
  }

  changeLocaleIfNeededAfterWait(locale: string, force: boolean) {
    if (
      window.appGlobals.haveLoadedLanguages === true &&
      locale &&
      this.language != locale
    ) {
      if (force || !localStorage.getItem('yp-user-locale')) {
        i18next.changeLanguage(locale, () => {
          //TODO: Fix moment
          //moment.locale([locale, 'en']);
          this.fireGlobal('yp-language-loaded', { language: locale });
          this.fireGlobal('language-loaded', { language: locale });
        });
      }
    }
  }

  setHighlightedLanguages(languages: string | undefined) {
    this.highlightedLanguages = languages;
    this.fireGlobal('yp-refresh-language-selection');
  }

  changeLocaleIfNeeded(locale: string, force = false) {
    if (window.appGlobals.haveLoadedLanguages) {
      this.changeLocaleIfNeededAfterWait(locale, force);
    } else {
      setTimeout(() => {
        console.warn(
          'Locales not loaded while trying to load languages, trying again in 100 ms'
        );
        this.changeLocaleIfNeeded(locale, force);
      }, 100);
    }
  }

  //TODO: Test this well
  parseQueryString() {
    const queryString = (window.location.search || '?').substr(1);

    const params: Record<string, string> = {};

    const queries = queryString.split('&');

    queries.forEach((indexQuery: string) => {
      const indexPair = indexQuery.split('=');

      const queryKey = decodeURIComponent(indexPair[0]);
      const queryValue = decodeURIComponent(
        indexPair.length > 1 ? indexPair[1] : ''
      );

      params[queryKey] = queryValue;
    });

    this.originalQueryParameters = params;
  }

  setAnonymousUser(user: YpUserData | undefined) {
    this.currentAnonymousUser = user;
  }

  setRegistrationQuestionGroup(group: YpGroupData | undefined) {
    if (group &&
      group.configuration &&
      group.configuration.registrationQuestionsJson) {
      this.registrationQuestionsGroup = group;
      window.appUser.checkRegistrationAnswersCurrent();
    } else {
      this.registrationQuestionsGroup = undefined;
    }
  }

  setAnonymousGroupStatus(group: YpGroupData | undefined) {
    if (
      group &&
      group.configuration &&
      (group.configuration.allowAnonymousUsers ||
        group.configuration.allowOneTimeLoginWithName)
    ) {
      this.currentAnonymousGroup = group;
      if (!window.appUser.user && this.currentAnonymousUser) {
        window.appUser.setLoggedInUser(this.currentAnonymousUser);
      } else if (
        window.appUser &&
        !window.appUser.user &&
        group.configuration.allowAnonymousAutoLogin &&
        this.originalQueryParameters &&
        this.originalQueryParameters.autoLogin
      ) {
        window.appUser.autoAnonymousLogin();
      }
    } else {
      if (
        window.appUser &&
        window.appUser.user &&
        window.appUser.user.profile_data &&
        window.appUser.user.profile_data.isAnonymousUser
      ) {
        window.appUser.removeAnonymousUser();
      }
      this.currentAnonymousGroup = undefined;
    }
  }

  _domainChanged(domain: YpDomainData | undefined) {
    if (domain) {
      this.fireGlobal('yp-domain-changed', { domain: domain });
    }
  }

  notifyUserViaToast(text: string) {
    this.fireGlobal('yp-open-toast', { text: text });
  }

  reBoot() {
    this.boot();
  }

  _userLoggedIn(event: CustomEvent) {
    const user: YpUserData = event.detail;
    if (user) {
      setTimeout(() => {
        if (typeof ga == 'function') {
          ga('set', '&uid', user.id);
        }
      }, 250); // Wait a bit to make sure google analytics tracking id has been set up dynamically
    }
    this.recommendations.reset();
  }

  setupTranslationSystem(loadPathPrefix: string = "") {
    const hostname = window.location.hostname;
    let defaultLocale = 'en';
    if (hostname.indexOf('betrireykjavik') > -1) {
      defaultLocale = 'is';
    } else if (hostname.indexOf('betraisland') > -1) {
      defaultLocale = 'is';
    } else if (hostname.indexOf('forbrukerradet') > -1) {
      defaultLocale = 'no';
    } else {
      const tld = hostname.substring(hostname.lastIndexOf('.'));
      const localeByTld: Record<string, string> = {
        '.fr': 'fr',
        '.hr': 'hr',
        '.hu': 'hu',
        '.is': 'is',
        '.nl': 'nl',
        '.no': 'no',
        '.pl': 'pl',
        '.tw': 'zh_TW',
      };
      defaultLocale = localeByTld[tld] || 'en';
    }

    const storedLocale = localStorage.getItem('yp-user-locale');
    if (storedLocale) {
      defaultLocale = storedLocale;
    }

    let localeFromUrl: string | undefined;

    if (
      window.appGlobals.originalQueryParameters &&
      window.appGlobals.originalQueryParameters['locale']
    ) {
      localeFromUrl = window.appGlobals.originalQueryParameters[
        'locale'
      ] as string;
    }

    if (
      window.appGlobals.originalQueryParameters &&
      window.appGlobals.originalQueryParameters['startAutoTranslate']
    ) {
      setTimeout(() => {
        this.startTranslation();
      }, 2500);
    }

    if (localeFromUrl && localeFromUrl.length > 1) {
      defaultLocale = localeFromUrl;
      localStorage.setItem('yp-user-locale', localeFromUrl);
    }

    i18next.use(HttpApi).init(
      {
        lng: defaultLocale,
        fallbackLng: 'en',
        backend: { loadPath: `${loadPathPrefix}/locales/{{lng}}/{{ns}}.json` },
      },
      () => {
        window.appGlobals.locale = defaultLocale;
        window.appGlobals.i18nTranslation = i18next;
        window.appGlobals.haveLoadedLanguages = true;
        //TODO: Fix moment
        //moment.locale([defaultLocale, 'en']);
        this.fireGlobal('yp-language-loaded', { language: defaultLocale });
        this.fireGlobal('language-loaded', { language: defaultLocale });
      }
    );
  }

  startTranslation() {
    window.appGlobals.autoTranslate = true;
    this.fireGlobal('yp-auto-translate', true);
    window.appDialogs.getDialogAsync('masterToast', (toast: any /*Snackbar*/) => {
      toast.labelText = this.t('autoTranslationStarted');
      toast.open = true;
    });
  }

  stopTranslation() {
    window.appGlobals.autoTranslate = false;
    this.fireGlobal('yp-auto-translate', false);
    window.appDialogs.getDialogAsync('masterToast', (toast: any /*Snackbar*/) => {
      toast.labelText = this.t('autoTranslationStopped');
      toast.open = true;
    });
    sessionStorage.setItem('dontPromptForAutoTranslation', '1');
  }

  async boot() {
    const results = (await this.serverApi.boot()) as YpDomainGetResponse | void;
    if (results) {
      this.domain = results.domain;
      this._domainChanged(this.domain);
      //this.analytics.setupGoogleAnalytics(this.domain);

      if (window.location.pathname == '/') {
        if (
          results.community &&
          results.community.configuration &&
          results.community.configuration.redirectToGroupId
        ) {
          YpNavHelpers.redirectTo(
            '/group/' + results.community.configuration.redirectToGroupId
          );
        } else if (
          results.community &&
          !results.community.is_community_folder
        ) {
          YpNavHelpers.redirectTo('/community/' + results.community.id);
        } else if (results.community && results.community.is_community_folder) {
          YpNavHelpers.redirectTo('/community_folder/' + results.community.id);
        } else {
          YpNavHelpers.redirectTo('/domain/' + this.domain.id);
          this.fireGlobal('yp-change-header', {
            headerTitle: this.domain.domain_name,
            headerDescription: this.domain.description,
          });
        }
      }
    }
  }

  setupGroupConfigOverride(groupId: number, configOverride: string) {
    const configOverrideHash: Record<string, string> = {};
    configOverride.split(';').forEach(function (configItem) {
      const splitItem = configItem.split('=');
      configOverrideHash[splitItem[0]] = splitItem[1];
    });
    this.groupConfigOverrides[groupId] = configOverrideHash;
    if (configOverrideHash['ln']) {
      this.changeLocaleIfNeeded(configOverrideHash['ln'], true);
    }
  }

  // Example use http://localhost:4242/group/47/config/hg=1;rn=Your Priorities;ru=https://yrpri.org/
  overrideGroupConfigIfNeeded(
    groupId: number,
    configuration: YpGroupConfiguration
  ) {
    if (!configuration) {
      configuration = {};
    }
    const override = this.groupConfigOverrides[groupId];
    if (!override) {
      return configuration;
    } else {
      if (override['hg']) {
        configuration['hideGroupHeader'] = Boolean(override['hg']);
      }
      if (override['ht']) {
        configuration['hideAllTabs'] = Boolean(override['ht']);
      }
      if (override['hh']) {
        configuration['hideHelpIcon'] = Boolean(override['hh']);
      }
      if (override['rn']) {
        configuration['customBackName'] = override['rn'] as string;
      }
      if (override['ru']) {
        configuration['customBackURL'] = override['ru'] as string;
      }
      return configuration;
    }
  }

  postLoadGroupProcessing(group: YpGroupData) {
    if (this.originalQueryParameters['yu']) {
      this.serverApi.marketingTrackingOpen(
        group.id,
        this.originalQueryParameters
      );
      this.externalGoalTriggerGroupId = group.id;
      this.goalTriggerEvents = ['newPost', 'newPointFor', 'newPointAgainst'];
      this.originalQueryParameters['goalThreshold'] = 1;
    }
  }

  checkExternalGoalTrigger(type: string) {
    if (
      this.externalGoalTriggerGroupId &&
      this.originalQueryParameters &&
      this.originalQueryParameters.goalThreshold &&
      this.goalTriggerEvents.indexOf(type) > -1
    ) {
      this.externalGoalCounter += 1;
      if (
        this.externalGoalCounter == this.originalQueryParameters.goalThreshold
      ) {
        this.serverApi.triggerTrackingGoal(
          this.externalGoalTriggerGroupId,
          this.originalQueryParameters
        );
      }
    }
  }

  activity(
    type: string,
    object: object | string,
    context: string | object | number | undefined = undefined,
    target: string | object | undefined = undefined
  ) {
    let actor;

    if (window.appUser && window.appUser.user) {
      actor = window.appUser.user.id;
    } else {
      actor = '-1';
    }

    let logString = 'activity stream: ' + actor + ' ' + type + ' ' + object;

    console.log(logString);

    if (context) logString += ' ' + context;

    if (type == 'open') {
      // Wait by sending open so pageview event can be completed before
      setTimeout(() => {
        this.analytics.sendToAnalyticsTrackers('send', 'event', object, type);
      }, 25);
    } else {
      this.analytics.sendToAnalyticsTrackers('send', 'event', object, type);
    }

    this.serverApi.createActivityFromApp({
      actor: actor,
      type: type,
      object: object,
      target: JSON.stringify(target),
      context: context ? context : '',
      path_name: location.pathname,
      event_time: new Date().toISOString(),
      session_id: this.getSessionFromCookie(),
      user_agent: navigator.userAgent,
    });

    if (type === 'completed' || type === 'clicked') {
      this.checkExternalGoalTrigger(object as string);
    }
  }

  setSeenWelcome() {
    this.seenWelcome = true;
    localStorage.setItem('yrpri-welcome-status', '1');
  }

  getSessionFromCookie() {
    const strCookies = document.cookie;
    const cookiearray = strCookies.split(';');
    let sid = '';
    for (let i = 0; i < cookiearray.length; i++) {
      const name = cookiearray[i].split('=')[0];
      const value = cookiearray[i].split('=')[1];
      if (name == ' connect.sid') sid = value;
    }
    return sid;
  }
}
