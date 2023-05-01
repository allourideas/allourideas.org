import { YpCodeBase } from '../common/YpCodeBaseclass.js'

export class YpCache extends YpCodeBase {

  cachedActivityItem: AcActivityData | undefined;

  cachedPostItem: YpPostData | undefined;

  backToDomainCommunityItems: Record<number,YpCommunityData | undefined> = {};

  backToCommunityGroupItems: Record<number,YpGroupData | undefined> = {};

  communityItemsCache: Record<number,YpCommunityData> = {};

  groupItemsCache: Record<number,YpGroupData> = {};

  postItemsCache: Record<number,YpPostData> = {};

  autoTranslateCache: Record<string,string[] | string> = {};

  addPostsToCacheLater(posts: Array<YpPostData>) {
    const laterTimeoutMs = Math.floor(Math.random() * 1000) + 750;
    setTimeout(() => {
      if (posts) {
        for (let i = 0; i < posts.length; i++) {
          if (!this.postItemsCache[posts[i].id]) {
            this.postItemsCache[posts[i].id]=posts[i];
          }
        }
      } else {
        console.error("No posts for cache");
      }
    }, laterTimeoutMs);
  }

  getPostFromCache(postId: number) {
    return this.postItemsCache[postId];
  }

  updatePostInCache(post: YpPostData) {
    this.postItemsCache[post.id] = post;
  }
}
