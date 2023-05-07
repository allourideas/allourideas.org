import { YpCodeBase } from '../common/YpCodeBaseclass.js'
import { YpServerApi } from '../common/YpServerApi.js';

export class YpRecommendations extends YpCodeBase {

  recommendationsGroupCache: Record<number,Array<YpPostData>> = {}

  recommendationsSeenPostIds: object | undefined;

  recommendationCallbacks: Record<number,Function> = {}

  lastRecommendationResponseLengths: Record<number,number> = {}

  currentPostId: number | undefined;

  currentlyDownloadingIds: Record<number,boolean> = {}

  preCacheLimit = 3

  serverApi: YpServerApi;

  constructor(serverApi: YpServerApi) {
    super();
    this.serverApi = serverApi;
  }

  getNextRecommendationForGroup (groupId: number, currentPostId: number, recommendationCallback: Function) {
    this.currentPostId=currentPostId;
    this.recommendationCallbacks[groupId] = recommendationCallback;
    if (!this.recommendationsGroupCache[groupId]) {
      this._getRecommendationsForGroup(groupId);
    } else if (this.recommendationsGroupCache[groupId].length>0) {
      const selectedPost = this._getSelectedPost(groupId);
      if (selectedPost)
        window.appGlobals.showRecommendationInfoIfNeeded();
      recommendationCallback(selectedPost);
    } else {
      recommendationCallback(null);
    }
  }

  _preCacheMediaForPost(post: YpPostData) {
    setTimeout(() => {
      let imagePath=null;
      if ((!post.cover_media_type || post.cover_media_type==='none') && !post.Category) {
        imagePath = "https://i.imgur.com/sdsFAoT.png";
      } else  if ((!post.cover_media_type || post.cover_media_type==='none') && post.Category) {
        imagePath = this._getCategoryImagePath(post);
      } else if (post.cover_media_type==='image') {
        imagePath = this._getImageFormatUrl(post.PostHeaderImages, 0);
      }

      if (imagePath) {
        new Image().src=imagePath;
      }
    });
  }

  _getImageFormatUrl(images: Array<YpImageData>|undefined, formatId: number) {
    if (images && images.length>0) {
      const formats = JSON.parse(images[images.length-1].formats);
      if (formats && formats.length>0)
        return formats[formatId];
    } else {
      return "";
    }
  }

  _getCategoryImagePath(post: YpPostData) {
    if (post && post.Category && post.Category.CategoryIconImages) {
      return this._getImageFormatUrl(post.Category.CategoryIconImages, 0);
    } else {
      return "";
    }
  }

  _downloadItemToCache(postId: number) {
    setTimeout(() => {
      if (!this.currentlyDownloadingIds[postId]) {
        this.currentlyDownloadingIds[postId]=true;
        console.log("Recommendation downloading for cache: "+postId);
        fetch('/api/posts/'+postId).then((response) => {
          this.currentlyDownloadingIds[postId]=false;
          return response.json();
        }).then((post) => {
          if (post) {
            this._preCacheMediaForPost(post);
          } else {
            console.error("Recommendation no post to save to cache");
          }
          window.appGlobals.cache.postItemsCache[postId]=post;
        }).catch((ex) => {
          console.error("Recommendation: Error in getting post for cache", ex);
          this.currentlyDownloadingIds[postId]=false;
        });
      } else {
        console.warn("Recommendation already downloading: "+postId);
      }
    });
  }

  _ensureNextItemsAreCached(groupId: number) {
    for (let i = 0; i < Math.min(this.recommendationsGroupCache[groupId].length-1, this.preCacheLimit); i++) {
     if (!window.appGlobals.cache.postItemsCache[this.recommendationsGroupCache[groupId][i].id]) {
       this._downloadItemToCache(this.recommendationsGroupCache[groupId][i].id);
     }
    }
  }

  async _getRecommendationsForGroup(groupId: number) {
    const recommendations = await this.serverApi.getRecommendationsForGroup(groupId) as Array<YpPostData>|void;
    if (recommendations) {
      this.lastRecommendationResponseLengths[groupId] = recommendations.length;
      if (!this.recommendationsGroupCache[groupId]) {
        this.recommendationsGroupCache[groupId] = recommendations;
      } else {
        this.recommendationsGroupCache[groupId] = this.recommendationsGroupCache[groupId].concat(recommendations);
      }
      if (this.recommendationCallbacks[groupId]) {
        this.recommendationCallbacks[groupId](this._getSelectedPost(groupId));
        delete this.recommendationCallbacks[groupId];
      }
    }
  }

  _getSelectedPost(groupId: number) {
    if (this.recommendationsGroupCache[groupId]) {
      let post = this.recommendationsGroupCache[groupId][0] as YpPostData | null;
      if (post) {
        if (post.id===this.currentPostId) {
          this.recommendationsGroupCache[groupId].shift();
          if (this.recommendationsGroupCache[groupId].length>0) {
            post = this.recommendationsGroupCache[groupId][0];
          } else {
            post = null;
          }
        }

        if (post) {
          this._ensureNextItemsAreCached(groupId);
        }

        return post;
      } else {
        console.warn("Recommendation no post for getSelectedPost, groupId: "+groupId);
        return null;
      }
    } else {
      return null;
    }
  }

  reset () {
    this.recommendationsSeenPostIds = {};
    this.lastRecommendationResponseLengths = {};
    this.recommendationCallbacks = {};
    this.recommendationsGroupCache = {};
  }
}
