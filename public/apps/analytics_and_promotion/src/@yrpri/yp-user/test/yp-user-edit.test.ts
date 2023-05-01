import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpUserEdit } from '../yp-user-edit.js';
import '../yp-user-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpUserEdit', () => {
  let element: YpUserEdit;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const settings = {
      my_posts: {
        method: 3,
        frequency: 1,
      },

      my_posts_endorsements: {
        method: 3,
        frequency: 1,
      },

      my_points: {
        method: 3,
        frequency: 1,
      },

      my_points_endorsements: {
        method: 3,
        frequency: 1,
      },

      all_community: {
        method: 3,
        frequency: 1,
      },

      all_group: {
        method: 3,
        frequency: 1,
      },

      newsletter: {
        method: 3,
        frequency: 1,
      },
    } as AcNotificationSettingsData;

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-user-edit .settings="${settings}" .user="${YpTestHelpers.getUser()}"></yp-user-edit>
    `);
    await aTimeout(100);
    element.open(true, { id: 1 });
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
