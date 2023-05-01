import { YpServerApi } from '../YpServerApi.js';
import { YpAppGlobals } from '../../yp-app/YpAppGlobals.js';
import { YpAppUser } from '../../yp-app/YpAppUser.js';
import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import { html } from 'lit';
import fetchMock from 'fetch-mock';

export class YpTestHelpers {
  static async setupApp() {
    window.serverApi = new YpServerApi();
    window.appGlobals = new YpAppGlobals(window.serverApi);
    window.appUser = new YpAppUser(window.serverApi);
    await i18next.use(HttpApi).init({
      lng: 'en',
      fallbackLng: 'en',
      backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
    });

    window.appGlobals.locale = 'en';
    window.appGlobals.i18nTranslation = i18next;
    window.appGlobals.haveLoadedLanguages = true;
  }

  static get fetchMockConfig() {
    return { headers: {
      'Content-Type': 'application/json',
  }};
  }

  static getDomain() {
    return {
      id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      Communities: [
        {
          id: 1,
          name: 'BEE',
          description: '',
          counter_posts: 10,
          counter_points: 11,
          counter_users: 12,
          configuration: {

          }
        } as YpCommunityData
      ]
    } as YpDomainData
  }

  static getCommunity() {
    return {
     id: 1,
      name: 'Betri Reykjavik Test',
      description: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      configuration: {

      },
      Groups: [
        {
          id: 1,
          name: 'Betri Reykjavik Test',
          objectives: '',
          counter_posts: 10,
          counter_points: 11,
          counter_users: 12,
          configuration: {
          }
        } as YpGroupData
      ]
    } as YpCommunityData;
  }

  static getPost() {
    return {
      id: 1,
      location:{
        latitude: 2,
        longitude: 3,
      },
      name: 'Robert',
      group_id: 1,
      description: 'Post-Test',
      counter_endorsements_up: 2,
      counter_endorsements_down: 4,
      counter_points: 5,
      Group: {
        id: 1,
        name: 'Alexi',
        community_id: 1,
        counter_points: 1,
        counter_users: 2,
        counter_posts: 1,
        configuration: {
          makeMapViewDefault: false
        }
      }
    } as YpPostData;
  }

  static getPoint() {
    return {
      id: 1,
      public_data: {},
      created_at: new Date(),
      counter_quality_up: 3,
      counter_quality_down: 2,
      content: 'Betri-Alexander',
      value: 1,
      PointRevisions: [
        {
          id: 1,
          content: "Blah",
          User: {
            id: 1,
            email: "blah@blah.is",
            name: "bluh"
          }
        }
      ],
    } as YpPointData;
  }


  static getUser() {
    return {
      id: 1,
      name: 'YURR'
    } as YpUserData
  }

  static getGroup() {
    return {
      id: 1,
      name: 'Betri Reykjavik Test',
      objectives: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      configuration: {
        makeMapViewDefault: false
      }
    } as YpGroupData
  }

  static getGroupResults() {
    return {
      group: YpTestHelpers.getGroup(),
      hasNonOpenPosts: true
    }
  }

  static getImages() {
    return [{
      description: 'Tekinn af ',
      photographer_name: 'Alexander',
      id: 2,
      formats: '["https://yrpri6-production.s3.amazonaws.com/5dddb81c-6023-4636-aae6-29e013e084d4-desktop-retina.png","https://yrpri6-production.s3.amazonaws.com/5dddb81c-6023-4636-aae6-29e013e084d4-mobile-retina.png","https://yrpri6-production.s3.amazonaws.com/5dddb81c-6023-4636-aae6-29e013e084d4-thumb.png"]',
      user_id: 2,
    }] as Array<YpImageData>
  }

  static getFetchMock() {
    return fetchMock.get('/api/domains', { domain: YpTestHelpers.getDomain() }, YpTestHelpers.fetchMockConfig).
      get('/api/videos/hasVideoUploadSupport', { hasTranscriptSupport: true, hasVideoUploadSupport: true }, YpTestHelpers.fetchMockConfig).
      get('/api/audios/hasAudioUploadSupport', { hasAudioUploadSupport: true }, YpTestHelpers.fetchMockConfig).
      get('/api/users/loggedInUser/isloggedin', { notLoggedIn: true }, YpTestHelpers.fetchMockConfig).
      get('/api/users/loggedInUser/memberships', { GroupUsers: [], CommunityUsers: [], DomainUsers: []}, YpTestHelpers.fetchMockConfig).
      get('/api/users/has/AutoTranslation', { hasAutoTranslation: true }, YpTestHelpers.fetchMockConfig).
      get('/api/users/loggedInUser/adminRights', 0, YpTestHelpers.fetchMockConfig)
  }

  static renderCommonHeader() {
    return html`
      <link
        href="https://fonts.googleapis.com/css?family=Material+Icons&display=block"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        rel="stylesheet"
      />

      <base href="/" />

      <style>
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
          background-color: #ededed;
        }
      </style>
    `;
  }
}
