import { YpBaseElement } from '../common/yp-base-element.js';
import { property } from 'lit/decorators.js';

export class AcActivityWithGroupBase extends YpBaseElement {
  @property({ type: Number })
  postId: number | undefined;

  @property({ type: Number })
  groupId: number | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Object })
  activity!: AcActivityData;

  get hasGroupHeader() {
    return (
      this.activity &&
      this.activity.Group &&
      this.activity.Group.name !=
        'hidden_public_group_for_domain_level_points' &&
      !this.postId &&
      !this.groupId
    );
  }

  get groupTitle() {
    if (this.activity.Group && !!this.postId && !this.groupId) {
      let title = '';
      if (
        !this.communityId &&
        this.activity.Community &&
        this.activity.Community.name != this.activity.Group.name
      ) {
        title += this.activity.Community.name + ' - ';
      }
      title += this.activity.Group.name;
      return title;
    } else {
      return '';
    }
  }
}
