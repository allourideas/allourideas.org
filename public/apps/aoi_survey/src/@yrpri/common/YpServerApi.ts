import { YpServerApiBase } from './YpServerApiBase.js';

export class YpServerApi extends YpServerApiBase {

  constructor(urlPath: string = '/api') {
    super();
    this.baseUrlPath = urlPath;
  }

  public boot() {
    return this.fetchWrapper(this.baseUrlPath + '/domains');
  }

  public isloggedin() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/isloggedin'
    );
  }

  public getAdminRights() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/adminRights'
    );
  }

  public getMemberships() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/memberships'
    );
  }

  public getAdminRightsWithNames() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/adminRightsWithNames'
    );
  }

  public getMembershipsWithNames() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/membershipsWithNames'
    );
  }

  public logout() {
    return this.fetchWrapper(this.baseUrlPath + '/users/logout', {
      method: 'POST',
    });
  }

  public setLocale(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/loggedInUser/setLocale',
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getRecommendationsForGroup(groupId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/recommendations/groups/${groupId}/getPostRecommendations`,
      {
        method: 'PUT',
        body: JSON.stringify({}),
      }
    );
  }

  public hasVideoUploadSupport() {
    return this.fetchWrapper(
      this.baseUrlPath + '/videos/hasVideoUploadSupport'
    );
  }

  public hasAudioUploadSupport() {
    return this.fetchWrapper(
      this.baseUrlPath + '/audios/hasAudioUploadSupport'
    );
  }

  public sendVideoView(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + '/videos/videoView',
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public sendAudioView(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + '/audios/videoView',
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public createActivityFromApp(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/createActivityFromApp',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public marketingTrackingOpen(groupId: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${groupId}/marketingTrackingOpen`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public createApiKey() {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/createApiKey`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
      false
    );
  }

  public triggerTrackingGoal(groupId: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${groupId}/triggerTrackingGoal`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getCollection(collectionType: string, collectionId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApi.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}`
    );
  }

  public getCategoriesCount(id: number, tabName: string | undefined) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${id}/categories_count/${tabName}`
    );
  }

  public getGroupPosts(searchUrl: string) {
    return this.fetchWrapper(searchUrl);
  }

  public getPost(postId: number) {
    return this.fetchWrapper(this.baseUrlPath + `/posts/${postId}`);
  }

  public getGroup(groupId: number) {
    return this.fetchWrapper(this.baseUrlPath + `/groups/${groupId}`);
  }

  public endorsePost(postId: number, method: string, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/posts/${postId}/endorse`,
      {
        method: method,
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getHasNonOpenPosts(groupId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${groupId}/checkNonOpenPosts`
    );
  }

  public getHelpPages(collectionType: string, collectionId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApi.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/pages`
    );
  }

  public getTranslation(translateUrl: string) {
    return this.fetchWrapper(translateUrl);
  }

  public getTranslatedRegistrationQuestions(groupId: number, targetLanguage: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${groupId}/translatedRegistrationQuestions?targetLanguage=${targetLanguage}`
    ) as unknown as Array<string>;
  }

  public sendRegistrationQuestions(registrationAnswers: Array<Record<string,string>>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/setRegistrationAnswers`,
      {
        method: 'PUT',
        body: JSON.stringify({
          registration_answers: registrationAnswers
        }),
      },
      true
    );
  }

  public savePostTranscript(postId: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/posts/${postId}/editTranscript`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getPostTranscriptStatus(groupId: number, tabName: string | undefined) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${groupId}/categories_count/${tabName}`
    );
  }

  public addPoint(groupId: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/points/${groupId}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public completeMediaPoint(mediaType: string, pointId: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${mediaType}/${pointId}/completeAndAddToPoint`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public completeMediaPost(
    mediaType: string,
    method: string,
    postId: number,
    body: Record<string, unknown>
  ) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${mediaType}/${postId}/completeAndAddToPost`,
      {
        method: method,
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getPoints(postId: number) {
    return this.fetchWrapper(this.baseUrlPath + `/posts/${postId}/points`);
  }

  public getMorePoints(postId: number, offsetUp: number, offsetDown: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/posts/${postId}/points?offsetUp=${offsetUp}&offsetDown=${offsetDown}`
    );
  }

  public getNewPoints(postId: number, latestPointCreatedAt: Date) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/posts/${postId}/newPoints?latestPointCreatedAt=${latestPointCreatedAt}`
    );
  }

  public getSurveyTranslations(post: YpPostData, language: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/posts/${post.id}/translatedSurvey?targetLanguage=${language}&groupId=${post.Group.id}`
    );
  }

  public getVideoFormatsAndImages(videoId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/videos/${videoId}/formatsAndImages`
    );
  }

  public getGroupConfiguration(groupId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${groupId}/configuration`
    );
  }


  public setVideoCover(videoId: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/videos/${videoId}/setVideoCover`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getTranscodingJobStatus(mediaType: string, mediaId: number, jobId: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${mediaType}/${mediaId}/getTranscodingJobStatus`,
      {
        method: 'PUT',
        body: JSON.stringify({jobId}),
      },
    );
  }

  public startTranscoding(
    mediaType: string,
    mediaId: number,
    startType: string,
    body: Record<string, unknown>
  ) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${mediaType}/${mediaId}/${startType}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public createPresignUrl(mediaUrl: string, body = {}) {
    return this.fetchWrapper(
      mediaUrl,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public updatePoint(pointId: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/points/${pointId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public updatePointAdminComment(groupId: number, pointId: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${groupId}/${pointId}/adminComment`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public deletePoint(pointId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/points/${pointId}`,
      {
        method: 'DELETE',
        body: JSON.stringify({}),
      },
      false
    );
  }

  public checkPointTranscriptStatus(type: string, pointId: number) {
    return this.fetchWrapper(this.baseUrlPath + `/$points/${pointId}/${type}`);
  }

  public registerUser(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/register`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public loginUser(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/login`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public submitForm(
    url: string,
    method: string,
    headers: Record<string, string>,
    body: string
  ) {
    return this.fetchWrapper(
      this.baseUrlPath + url,
      {
        method: method,
        headers: headers,
        body: body,
      },
      false,
      "formError"
    );
  }

  public getSurveyGroup(surveyGroupId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${surveyGroupId}/survey`
    );
  }

  public postSurvey(surveyGroupId: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/groups/${surveyGroupId}/survey`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public deleteActivity(
    type: string,
    collectionId: number,
    activityId: number
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${type}/${collectionId}/${activityId}/delete_activity`,
      {
        method: 'DELETE',
        body: JSON.stringify({}),
      },
      false
    );
  }

  public getAcActivities(url: string) {
    return this.fetchWrapper(url);
  }

  public getRecommendations(typeName: string, typeId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/recommendations/${typeName}/${typeId}`
    );
  }

  public setNotificationsAsViewed(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/notifications/setIdsViewed`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public setNotificationsAllAsViewed() {
    return this.fetchWrapper(
      this.baseUrlPath + `/notifications/markAllViewed`,
      {
        method: 'PUT',
        body: JSON.stringify({}),
      },
      false
    );
  }

  public getAcNotifications(url: string) {
    return this.fetchWrapper(url);
  }

  public getComments(type: string, pointId: number) {
    return this.fetchWrapper(this.baseUrlPath + `/${type}/${pointId}/comments`);
  }

  public getCommentsCount(type: string, pointId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${type}/${pointId}/commentsCount`
    );
  }

  public postComment(type: string, id: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${type}/${id}/comment`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public setPointQuality(pointId: number, method: string, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/points/${pointId}/pointQuality`,
      {
        method: method,
        body: JSON.stringify(body),
      },
      false
    );
  }

  public postNewsStory(url: string, body: Record<string, unknown>) {
    return this.fetchWrapper(
      url,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public pointUrlPreview(urlParams: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/points/url_preview?${urlParams}`
    );
  }

  public disconnectSamlLogin() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/disconnectSamlLogin',
      {
        method: 'DELETE',
        body: JSON.stringify({}),
      },
      false
    );
  }

  public disconnectFacebookLogin() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/disconnectFacebookLogin',
      {
        method: 'DELETE',
        body: JSON.stringify({}),
      },
      false
    );
  }

  public deleteUser() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/delete_current_user',
      {
        method: 'DELETE',
        body: JSON.stringify({}),
      },
      false
    );
  }

  public anonymizeUser() {
    return this.fetchWrapper(
      this.baseUrlPath + '/users/anonymize_current_user',
      {
        method: 'DELETE',
        body: JSON.stringify({}),
      },
      false
    );
  }

  public resetPassword(token: string, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/reset/${token}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public setEmail(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/missingEmail/setEmail`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public linkAccounts(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/missingEmail/linkAccounts`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public confirmEmailShown() {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/missingEmail/emailConfirmationShown`,
      {
        method: 'PUT',
        body: JSON.stringify({}),
      },
      false,
      'forgotPassword'
    );
  }

  public forgotPassword(body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/forgot_password`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public acceptInvite(token: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/accept_invite/${token}`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
      false,
      'acceptInvite'
    );
  }

  public getInviteSender(token: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/get_invite_info/${token}`,
      { method: 'GET' },
      false,
      'acceptInvite'
    );
  }

  public getPostLocations(type: string, id: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/${type}/${id}/post_locations`
    );
  }

  public hasAutoTranslation() {
    return this.fetchWrapper(
      this.baseUrlPath + `/users/has/AutoTranslation`
    );
  }

  public apiAction(url: string, method: string, body: Record<string, unknown>) {
    return this.fetchWrapper(
      url,
      {
        method: method,
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getImages(postId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/images/${postId}/user_images`
    );
  }

  public postRating(postId: number, ratingIndex: number, body: Record<string, unknown>) {
    return this.fetchWrapper(
      this.baseUrlPath + `/ratings/${postId}/${ratingIndex}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public deleteRating(postId: number, ratingIndex: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/ratings/${postId}/${ratingIndex}`,
      {
        method: 'DELETE',
        body: JSON.stringify({}),
      },
      false
    );
  }
}
