import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAcceptInvite } from '../yp-accept-invite.js';
import '../yp-accept-invite.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAcceptInvite', () => {
  let element: YpAcceptInvite;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    fetchMock.get('/api/users/get_invite_info/BLAH',{
      inviteName: "robert",
      targetName: "Alexander",
      targetEmail: "robert@citizens.is",
      configuration: {}
    }, YpTestHelpers.fetchMockConfig);
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-accept-invite> </yp-accept-invite>
      `);
        await aTimeout(100);
      element.open('BLAH');
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
