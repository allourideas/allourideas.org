import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostRatingsInfo } from '../yp-post-ratings-info.js';
import '../yp-post-ratings-info.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';


describe('YpPostRatingsInfo', () => {
  let element: YpPostRatingsInfo;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const post = {
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
        name: 'Alex',
        community_id: 1,
        counter_points: 1,
        counter_users: 2,
        counter_posts: 1,
        configuration: {
          makeMapViewDefault: false,
          customRatings: [{
            emoji: 'smiley',
            numberOf: 0,
            averageRating: 1,
            count: 2
          }]
        }
      }
    } as YpPostData;

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-ratings-info
        .post="${post}"
      ></yp-post-ratings-info>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
