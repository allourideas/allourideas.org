import { YpAccessHelpers } from '../common/YpAccessHelpers.js';

export class YpPostHelpers {
  static fullPostUrl(post: YpPostData) {
    if (post) {
      return encodeURIComponent(
        'https://' + window.location.host + '/post/' + post.id
      );
    } else {
      console.warn("Can't find post for action");
      return '';
    }
  }

  static uniqueInDomain(array: Array<YpGroupData>, domainId: number) {
    const newArray: Array<YpGroupData> = [];
    const ids: Record<number, YpGroupData> = {};
    array.forEach(item => {
      if (!ids[item.id]) {
        //@ts-ignore
        ids[item.id] = item.id;
        if (!item.configuration) {
          item.configuration = { canAddNewPosts: true };
        }
        if (
          item.Community &&
          item.Community.domain_id == domainId &&
          (item.configuration.canAddNewPosts ||
            YpAccessHelpers._hasAdminRights(
              item.id,
              window.appUser!.adminRights!.GroupAdmins
            ))
        ) {
          newArray.push(item);
        } else {
          console.log('Ignoring group:' + item.name);
        }
      }
    });
    return newArray;
  }
}
