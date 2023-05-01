import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcNotificationListPost } from '../ac-notification-list-post.js';
import '../ac-notification-list-post.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcNotificationListPost', () => {
  let element: AcNotificationListPost;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

    beforeEach(async () => {
      const notification =  {
        id: 1,
        type: 'ALex',
        domain_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        AcActivities: [{
          type: 'LEXI',
          created_at: new Date().toISOString(),
          domain_id: 2,
          Post: YpTestHelpers.getPost(),
          User: YpTestHelpers.getUser(),
        }]
      } as AcNotificationData;

      element = await fixture(html`
        ${YpTestHelpers.renderCommonHeader()}
        <ac-notification-list-post
          .notification="${notification}"
        ></ac-notification-list-post>
      `);
      await aTimeout(100);
    });

    it('passes the a11y audit', async () => {
      debugger;
      await expect(element).shadowDom.to.be.accessible();
    });
  });