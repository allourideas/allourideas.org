export class YpNavHelpers {
  static redirectTo(path: string) {
    //history.pushState({}, '', path);
    //window.dispatchEvent(new CustomEvent('location-changed'));

    console.error('not redirecting to', path);

    document.dispatchEvent(
      new CustomEvent('yp-pause-media-playback', { bubbles: true, detail: {} })
    );
  }

  static goToPost(
    postId: number,
    pointId: number | undefined = undefined,
    cachedActivityItem: AcActivityData | undefined = undefined,
    cachedPostItem: YpPostData | undefined = undefined,
    skipKeepOpen = false
  ) {

    if (postId === undefined) {
      console.error("Can't find post id for goToPost");
      return;
    }

    let postUrl = '/post/' + postId;

    if (pointId !== undefined) {
      postUrl += '/' + pointId;
    }

    const windowLocation = window.location.href;

    if (cachedActivityItem) {
      window.appGlobals.cache.cachedActivityItem = cachedActivityItem;
    }

    if (
      cachedPostItem &&
      cachedPostItem.Group &&
      cachedPostItem.Group.Community
    ) {
      window.appGlobals.cache.cachedPostItem = cachedPostItem;
    }

    if (windowLocation.indexOf(postUrl) == -1) {
      window.appGlobals.activity('open', 'post', postUrl, {
        id: postId,
        modelType: 'post',
      });
      if (skipKeepOpen !== true)
        window.app.setKeepOpenForPostsOn(window.location.pathname);
      setTimeout(() => {
        this.redirectTo(postUrl);
      });
    }
  }
}
