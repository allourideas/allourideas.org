import { YpServerApi } from '../common/YpServerApi.js';
import { YpCodeBase } from '../common/YpCodeBaseclass.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpLogin } from '../yp-user/yp-login.js';
import { Snackbar } from '@material/mwc-snackbar';
import { YpRegistrationQuestionsDialog } from '../yp-user/yp-registration-questions-dialog.js';

export class YpAppUser extends YpCodeBase {
  serverApi: YpServerApi;

  loginForAcceptInviteParams: {
    token: string;
    editDialog: HTMLElement;
  } | null = null;

  loginForEditParams: {
    editDialog: HTMLElement;
    newOrUpdate: boolean;
    params: object;
    refreshFunction: Function;
  } | null = null;

  loginForNewPointParams: {
    postPointsElement: HTMLElement;
    params: { value: number; content: string };
  } | null = null;

  loginForEndorseParams: {
    postActionElement: HTMLElement;
    params: { value: number };
  } | null = null;

  loginForRatingsParams: {
    postActionElement: HTMLElement;
  } | null = null;

  loginForPointQualityParams: {
    pointActionElement: HTMLElement;
    params: { value: number };
  } | null = null;

  loginForMembershipParams: {
    membershipActionElement: HTMLElement;
    params: { value: string; content: string };
  } | null = null;

  loginFor401refreshFunction: Function | undefined;

  loginForNotificationSettingsParams = false;

  toastLoginTextCombined: string | undefined;

  toastLogoutTextCombined: string | undefined;

  user: YpUserData | null | undefined;

  endorsementPostsIndex: Record<number, YpEndorsement> = {};

  groupCurrentVoteCountIndex: Record<number, number> = {};

  ratingPostsIndex: Record<number, Record<number, YpRatingData>> = {};

  membershipsIndex: Record<string, Record<number, boolean>> = {};

  pointQualitiesIndex: Record<number, YpPointQuality> = {};

  adminRights: YpAdminRights | undefined;

  promoterRights: YpPromoterRights | undefined;

  memberships: YpMemberships | undefined;

  completeExternalLoginText: string | undefined;

  isPollingForLogin = false;

  lastLoginMethod: string | undefined;

  facebookPopupWindow: Window | null = null;

  samlPopupWindow: Window | null = null;

  pollingStartedAt: number | undefined;

  hasIssuedLogout = false;

  sessionPrefix = 'session_';

  sessionStorage = window.localStorage;

  constructor(serverApi: YpServerApi) {
    super();
    this.serverApi = serverApi;
    if (!window.location.pathname.startsWith('/survey/')) {
      this.checkLogin();
    } else {
      console.log('Not checking login in survey mode');
    }
    this.addGlobalListener('yp-forgot-password', this._forgotPassword.bind(this));
    this.addGlobalListener('yp-reset-password', this._resetPassword.bind(this));
  }

  sessionHas(key: string) {
    const prefixed_key = this.sessionPrefix + key;
    const value = this.sessionStorage.getItem(prefixed_key);
    return value !== null;
  }

  sessionGet(key: string) {
    const prefixed_key = this.sessionPrefix + key;
    const value = this.sessionStorage.getItem(prefixed_key);
    let parsed;
    if (value) {
      try {
        parsed = JSON.parse(value);
      } catch (e) {
        parsed = null;
      }
    }
    return parsed;
  }

  sessionSet(key: string, value: string | object) {
    const prefixed_key = this.sessionPrefix + key;
    const stringfied = JSON.stringify(value);
    this.sessionStorage.setItem(prefixed_key, stringfied);
  }

  sessionUnset(key: string) {
    const prefixed_key = this.sessionPrefix + key;
    this.sessionStorage.removeItem(prefixed_key);
  }

  sessionClear() {
    this.sessionStorage.clear();
  }

  loginForAcceptInvite(
    editDialog: HTMLElement,
    token: string,
    email: string,
    collectionConfiguration: object | undefined
  ) {
    this.loginForAcceptInviteParams = { editDialog: editDialog, token: token };
    this.openUserlogin(email, collectionConfiguration);
  }

  loginForEdit(
    editDialog: HTMLElement,
    newOrUpdate: boolean,
    params: object,
    refreshFunction: Function
  ) {
    this.loginForEditParams = {
      editDialog: editDialog,
      newOrUpdate: newOrUpdate,
      params: params,
      refreshFunction: refreshFunction,
    };
    this.openUserlogin();
  }

  loginForNewPoint(
    postPointsElement: HTMLElement,
    params: { value: number; content: string }
  ) {
    this.loginForNewPointParams = {
      postPointsElement: postPointsElement,
      params: params,
    };
    this.openUserlogin();
  }

  loginForEndorse(
    postActionElement: HTMLElement,
    params: { value: number }
  ) {
    this.loginForEndorseParams = {
      postActionElement: postActionElement,
      params: params,
    };
    this.openUserlogin();
  }

  loginForRatings(postActionElement: HTMLElement) {
    this.loginForRatingsParams = { postActionElement: postActionElement };
    this.openUserlogin();
  }

  loginForPointQuality(
    pointActionElement: HTMLElement,
    params: { value: number }
  ) {
    this.loginForPointQualityParams = {
      pointActionElement: pointActionElement,
      params: params,
    };
    this.openUserlogin();
  }

  loginForMembership(
    membershipActionElement: HTMLElement,
    params: { value: string; content: string }
  ) {
    this.loginForMembershipParams = {
      membershipActionElement: membershipActionElement,
      params: params,
    };
    this.openUserlogin();
  }

  loginFor401(refreshFunction: Function) {
    this.loginFor401refreshFunction = refreshFunction;
    this.openUserlogin();
  }

  loginForNotificationSettings() {
    this.loginForNotificationSettingsParams = true;
    this.openUserlogin();
  }

  openUserlogin(
    email: string | undefined = undefined,
    collectionConfiguration: object | undefined = undefined
  ) {
    window.appDialogs.getDialogAsync('userLogin', (dialog: YpLogin) => {
      dialog.setup(this._handleLogin.bind(this), window.appGlobals.domain!);
      dialog.open(undefined, email, collectionConfiguration);
    });
  }

  autoAnonymousLogin() {
    setTimeout(() => {
      if (this.user == null) {
        window.appDialogs.getDialogAsync('userLogin',  (dialog: YpLogin) => {
          dialog.setup(this._handleLogin.bind(this), window.appGlobals.domain!);
          dialog.anonymousLogin();
        });
      } else {
        console.log('Not doing auto anon login as user already exists');
      }
    }, 1);
  }

  _closeUserLogin() {
    window.appDialogs.closeDialog('userLogin');
  }

  _setUserLoginSpinner() {
    window.appDialogs.getDialogAsync('userLogin', (dialog: YpLogin)  => {
      dialog.userSpinner = false;
    });
  }

  _handleLogin(user: YpUserData) {
    this._closeUserLogin();
    this.setLoggedInUser(user);
    if (user.profile_data && user.profile_data.isAnonymousUser) {
      console.debug('Do not fetch admin or memberships for anonymous users');
    } else {
      this.getAdminRights();
      this.getPromoterRights();
      this.getMemberShips();
      this.toastLoginTextCombined =
        this.t('user.loginCompleteFor') + ' ' + this.user?.name;
      this.fireGlobal('yp-open-toast', { text: this.toastLoginTextCombined });
    }
    this._checkLoginForParameters();

    // Redirect to another local service after login, for example the analytics app
    setTimeout(() => {
      if (
        window.appGlobals.originalQueryParameters &&
        window.appGlobals.originalQueryParameters['raLogin']
      ) {
        window.location.href = window.appGlobals.originalQueryParameters[
          'raLogin'
        ] as string;
      }
    });

    setTimeout(() => {
      this._checkRegistrationAnswers(user);
    }, 7500);
  }

  _checkLoginForParameters() {
    /* TODO: Get working again
    if (this.loginForEditParams) {
      const loginParams = this.loginForEditParams;
      // TODO: Remove any
      window.appDialogs.getAsync(loginParams.editDialog, (dialog: any) => {
        dialog.setup(null, true, loginParams.refreshFunction);
        dialog.open('new', loginParams.params);
        this.loginForEditParams = null;
      });
    } else if (this.loginForNewPointParams) {
      const newPointParams = this.loginForNewPointParams;
      newPointParams.postPointsElement.addPoint(newPointParams.params.content, newPointParams.params.value);
      this.loginForNewPointParams = null;
    } else if (this.loginForEndorseParams) {
      const endorseParams = this.loginForEndorseParams;
      endorseParams.postActionElement.generateEndorsementFromLogin(endorseParams.params.value);
      this.loginForEndorseParams = null;
    } else if (this.loginForRatingsParams) {
      const ratingsParams = this.loginForRatingsParams;
      ratingsParams.postActionElement.openRatingsDialog();
      this.loginForRatingsParams = null;
    } else if (this.loginForPointQualityParams) {
      const pointQualityParams = this.loginForPointQualityParams;
      pointQualityParams.pointActionElement.generatePointQualityFromLogin(pointQualityParams.params.value);
      this.loginForPointQualityParams = null;
    } else if (this.loginForMembershipParams) {
      const membershipParams = this.loginForMembershipParams;
      membershipParams.membershipActionElement.generateMembershipFromLogin(membershipParams.params.value);
      this.loginForMembershipParams = null;
    } else if (this.loginForAcceptInviteParams) {
      const acceptInviteParams = this.loginForAcceptInviteParams;
      // TODO: Remove any
      window.appDialogs.getAsync("acceptInvite", (dialog: any) => {
        dialog.reOpen(acceptInviteParams.token);
        dialog.afterLogin(acceptInviteParams.token);
        this.loginForAcceptInviteParams = null;
      });
    } else if (this.loginFor401refreshFunction) {
      this.loginFor401refreshFunction();
    } else if (this.loginForNotificationSettingsParams) {
      this.openNotificationSettings();
    }
    */
  }

  openNotificationSettings() {
    // TODO: Remove any
    window.appDialogs.getDialogAsync('userEdit', (dialog: any) => {
      dialog.setup(window.appUser.user, false, null, true);
      dialog.open('edit', { userId: window.appUser.user?.id });
    });
  }

  _forgotPassword(event: CustomEvent) {
    // TODO: Remove any
    window.appDialogs.getDialogAsync('forgotPassword', (dialog: any) => {
      dialog.open(event.detail);
    });
  }

  _resetPassword(event: CustomEvent) {
    // TODO: Remove any
    window.appDialogs.getDialogAsync('resetPassword', (dialog: any) => {
      dialog.open(event.detail);
    });
  }

  getUser() {
    return this.sessionGet('user');
  }

  setLoggedInUser(user: YpUserData) {
    this.sessionSet('user', user);
    this.user = user;
    this.fireGlobal('yp-logged-in', this.user);

    // TODO: Look at this. Fire another signal a bit later in case some components had not set up their listeners
    //setTimeout(() => {
    //  this.fireGlobal('yp-logged-in', this.user);
    //}, 1000);

    window.appGlobals.analytics.sendLoginAndSignup(
      user.id,
      'Login Success',
      this.lastLoginMethod ? this.lastLoginMethod : 'Email'
    );
    this.lastLoginMethod = undefined;
    if (user && user.profile_data && user.profile_data.isAnonymousUser) {
      window.appGlobals.setAnonymousUser(user);
    } else {
      window.appGlobals.setAnonymousUser(undefined);
    }

    window.appGlobals.offline.checkContentToSendForLoggedInUser();
  }

  removeAnonymousUser() {
    console.log('Remove anon user');
    this.removeUserSession();
  }

  removeUserSession() {
    this.sessionUnset('user');
    this.user = null;
    window.appGlobals.setAnonymousUser(undefined);
    this.fireGlobal('yp-logged-in', null);
  }

  loggedIn() {
    let isCorrectLoginProviderAndAgency = true;
    if (window.appGlobals.currentForceSaml && window.appGlobals.currentGroup) {
      if (!YpAccessHelpers.checkGroupAccess(window.appGlobals.currentGroup)) {
        if (this.user) {
          if (this.user.loginProvider !== 'saml')
            isCorrectLoginProviderAndAgency = false;

          if (
            window.appGlobals.currentGroup &&
            window.appGlobals.currentGroup.configuration &&
            window.appGlobals.currentGroup.configuration
              .forceSecureSamlEmployeeLogin
          ) {
            if (!this.user.isSamlEmployee) {
              isCorrectLoginProviderAndAgency = false;
            }
          }
        } else {
          isCorrectLoginProviderAndAgency = false;
        }
      }
    }
    return this.user != null && isCorrectLoginProviderAndAgency;
  }

  async setLocale(locale: string) {
    await this.serverApi.setLocale({ locale: locale });
  }

  cancelLoginPolling() {
    this.pollingStartedAt = undefined;
  }

  _closeAllPopups() {
    if (this.facebookPopupWindow) {
      try {
        this.facebookPopupWindow.close();
      } catch (error) {
        console.error(error);
      }
      this.facebookPopupWindow = null;
    }
    if (this.samlPopupWindow) {
      try {
        this.samlPopupWindow.close();
      } catch (error) {
        console.error(error);
      }
      this.samlPopupWindow = null;
    }
  }

  async pollForLogin() {
    if (this.pollingStartedAt) {
      const user = (await this.serverApi.isloggedin()) as YpUserData | void;
      if (user && user.notLoggedIn === true && this.pollingStartedAt) {
        const timeSpent = Date.now() - this.pollingStartedAt;
        if (timeSpent < 5 * 60 * 1000) {
          setTimeout(() => {
            this.pollForLogin();
          }, 1200);
        } else {
          this.pollingStartedAt = undefined;
        }
      } else if (user && user.name) {
        this.cancelLoginPolling();
        if (this.facebookPopupWindow) {
          this.loginFromFacebook();
        } else if (this.samlPopupWindow) {
          this.loginFromSaml();
        }
        this._closeAllPopups();
      }
    } else {
      console.error('Unkown state in polling...');
      this._closeAllPopups();
      this.cancelLoginPolling();
    }
  }

  startPollingForLogin() {
    this.pollingStartedAt = Date.now();
    setTimeout(() => {
      this.pollForLogin();
    }, 1000);
  }

  loginFromFacebook() {
    this.cancelLoginPolling();
    this.lastLoginMethod = 'Facebook';
    this._completeExternalLogin(this.t('user.loggedInWithFacebook'));
  }

  loginFromSaml() {
    this.cancelLoginPolling();
    this.lastLoginMethod = 'Saml2';
    this._completeExternalLogin(this.t('user.loggedInWithSaml'));
  }

  _completeExternalLogin(fromString: string) {
    this.checkLogin();
    this._setUserLoginSpinner();
    this.completeExternalLoginText = fromString;
  }

  checkLogin() {
    this.isloggedin();
    this.getMemberShips();
    this.getAdminRights();
    this.getPromoterRights();
  }

  recheckAdminRights() {
    this.getAdminRights();
    this.getPromoterRights();
  }

  updateEndorsementForPost(postId: number, newEndorsement: YpEndorsement, group: YpGroupData | undefined = undefined) {
    if (this.user) {
      if (!this.user.Endorsements) {
        this.user.Endorsements = [];
      }
      let hasChanged = false;
      for (let i = 0; i < this.user.Endorsements.length; i++) {
        if (this.user.Endorsements[i].post_id === postId) {
          if (newEndorsement) {
            this.user.Endorsements[i] = newEndorsement;
          } else {
            this.user.Endorsements.splice(i, 1);
          }
          hasChanged = true;
          break;
        }
      }
      if (!hasChanged && newEndorsement)
        this.user.Endorsements.push(newEndorsement);
      this._updateEndorsementPostsIndex(this.user);
    } else {
      console.error("Can't find user for updateEndorsementForPost");
    }
    if (group && group.configuration && group.configuration.maxNumberOfGroupVotes) {
      this.calculateVotesLeftForGroup(group);
    } else {
      this.fireGlobal('got-endorsements-and-qualities', null);
    }
  }

  calculateVotesLeftForGroup(group: YpGroupData) {
      setTimeout( () => {
        if (this.user && this.user.Endorsements) {
          const lastVoteCount = this.groupCurrentVoteCountIndex[group.id];
        this.groupCurrentVoteCountIndex[group.id] = this.user.Endorsements.filter(function (endorsement) {
          return endorsement.Post && endorsement.Post.group_id === group.id && endorsement.value !== -1 && endorsement.value !== 0
        }).length;

        if (lastVoteCount!=this.groupCurrentVoteCountIndex[group.id]) {
          const text = `${this.t('youHaveUsed')} ${this.groupCurrentVoteCountIndex[group.id]} ${this.t('ofNumber')} ${group.configuration.maxNumberOfGroupVotes} ${this.t('votesForGroup')}`;
          window.appDialogs.getDialogAsync('masterToast', (toast: Snackbar) => {
            toast.labelText = text;
            toast.open = true;
            toast.timeoutMs = 4000;
          });
        }

        this.fireGlobal('got-endorsements-and-qualities', {
          maxGroupId: group.id,
          groupCurrentVoteCount: this.groupCurrentVoteCountIndex[group.id],
        });
      } else {
        console.warn("No user or endorsements for calculateVotesLeftForGroup");
      }
    });
  }

  _updateEndorsementPostsIndex(user: YpUserData) {
    if (user && user.Endorsements && user.Endorsements.length > 0) {
      this.endorsementPostsIndex = {};
      for (let i = 0; i < user.Endorsements.length; i++) {
        this.endorsementPostsIndex[user.Endorsements[i].post_id] =
          user.Endorsements[i];
      }
    } else {
      this.endorsementPostsIndex = {};
    }
  }

  _updateRatingPostsIndex(user: YpUserData) {
    if (user && user.Ratings && user.Ratings.length > 0) {
      this.ratingPostsIndex = {};
      for (let i = 0; i < user.Ratings.length; i++) {
        if (!this.ratingPostsIndex[user.Ratings[i].post_id])
          this.ratingPostsIndex[user.Ratings[i].post_id] = {};
        this.ratingPostsIndex[user.Ratings[i].post_id][
          user.Ratings[i].type_index
        ] = user.Ratings[i];
      }
    } else {
      this.ratingPostsIndex = {};
    }
  }

  updateRatingForPost(postId: number, typeIndex: number, newRating: YpRatingData | undefined) {
    if (this.user) {
      if (!this.user.Ratings) {
        this.user.Ratings = [];
      }

      let hasChanged = false;
      for (let i = 0; i < this.user.Ratings.length; i++) {
        if (
          this.user.Ratings[i].post_id === postId &&
          this.user.Ratings[i].type_index === typeIndex
        ) {
          if (newRating) {
            this.user.Ratings[i] = newRating;
          } else {
            this.user.Ratings.splice(i, 1);
          }
          hasChanged = true;
          break;
        }
      }
      if (!hasChanged && newRating) this.user.Ratings.push(newRating);
      this._updateRatingPostsIndex(this.user);
    } else {
      console.error("Can't find user for updateRatingForPost");
    }
  }

  updatePointQualityForPost(pointId: number, newPointQuality: YpPointQuality) {
    if (this.user) {
      if (this.user.PointQualities) {
        let hasChanged = false;
        for (let i = 0; i < this.user.PointQualities.length; i++) {
          if (this.user.PointQualities[i].point_id === pointId) {
            if (newPointQuality) {
              this.user.PointQualities[i] = newPointQuality;
            } else {
              this.user.PointQualities.splice(i, 1);
            }
            hasChanged = true;
            break;
          }
        }
        if (hasChanged) this._updatePointQualitiesIndex(this.user);
      }
    } else {
      console.error("Can't find user for updatePointQualityForPost");
    }
  }

  _updatePointQualitiesIndex(user: YpUserData) {
    if (user && user.PointQualities && user.PointQualities.length > 0) {
      this.pointQualitiesIndex = {};
      for (let i = 0; i < user.PointQualities.length; i++) {
        this.pointQualitiesIndex[user.PointQualities[i].point_id] =
          user.PointQualities[i];
      }
    } else {
      this.pointQualitiesIndex = {};
    }
  }

  _onUserChanged(user: YpUserData | null) {
    if (user) {
      this._updateEndorsementPostsIndex(user);
      this._updatePointQualitiesIndex(user);
      this._updateRatingPostsIndex(user);
      this.fireGlobal('got-endorsements-and-qualities', null);
    }
  }

  async logout() {
    this.hasIssuedLogout = true;
    (await this.serverApi.logout()) as void;
    this.toastLogoutTextCombined =
      this.t('user.logoutCompleteFor') + ' ' + this.user?.name;
    this.fireGlobal('yp-open-toast', { text: this.toastLogoutTextCombined });
    this.fireGlobal('yp-close-right-drawer', true);
    this.removeUserSession();
    this.recheckAdminRights();
  }

  checkRegistrationAnswersCurrent () {
    if (this.user) {
      this._checkRegistrationAnswers(this.user);
    }
  }

  setHasRegistrationAnswers() {
    if (this.user) {
      this.user.hasRegistrationAnswers = true;
    }
  }

  _checkRegistrationAnswers(user: YpUserData) {
    if (user &&
      !user.notLoggedIn &&
      window.appGlobals.registrationQuestionsGroup &&
      !user.hasRegistrationAnswers &&
      !window.appGlobals.currentAnonymousUser) {
      window.appDialogs.getDialogAsync("registrationQuestions", (dialog: YpRegistrationQuestionsDialog) => {
        dialog.open(window.appGlobals.registrationQuestionsGroup!);
      });
    }
  }

  async isloggedin() {
    const user = (await this.serverApi.isloggedin()) as YpUserData | void;

    if (user && user.notLoggedIn === true) {
      this.removeUserSession();
    } else if (
      user &&
      user.name &&
      user.profile_data &&
      user.profile_data.isAnonymousUser
    ) {
      setTimeout(() => {
        if (window.appGlobals.currentAnonymousGroup) {
          this.setLoggedInUser(user);
        } else {
          window.appGlobals.setAnonymousUser(user);
        }
      }, 500);
    } else if (user && user.name) {
      this.setLoggedInUser(user);
    }

    if (user && user.missingEmail) {
      // TODO: Remove any
      window.appDialogs.getDialogAsync('missingEmail', (dialog: any) => {
        dialog.open(user.loginProvider);
      });
    } else if (
      user &&
      user.profile_data &&
      user.profile_data.saml_show_confirm_email_completed === false
    ) {
      // TODO: Remove any
      window.appDialogs.getDialogAsync('missingEmail', (dialog: any) => {
        dialog.open(user.loginProvider, true, user.email);
      });
    }

    setTimeout(() => {
      this._checkRegistrationAnswers(user!);
    }, 750)

    if (user) {
      if (user.customSamlDeniedMessage) {
        window.appGlobals.currentSamlDeniedMessage =
          user.customSamlDeniedMessage;
      } else {
        window.appGlobals.currentSamlDeniedMessage = undefined;
      }

      if (user.customSamlLoginMessage) {
        window.appGlobals.currentSamlLoginMessage = user.customSamlLoginMessage;
      } else {
        window.appGlobals.currentSamlLoginMessage = undefined;
      }

      if (user.forceSecureSamlLogin) {
        window.appGlobals.currentForceSaml = true;
      } else {
        window.appGlobals.currentForceSaml = false;
      }
    }

    if (this.completeExternalLoginText) {
      window.appGlobals.notifyUserViaToast(this.completeExternalLoginText);
      this._closeUserLogin();
      this.completeExternalLoginText = undefined;
      this._checkLoginForParameters();
    }
  }

  async getAdminRights() {
    const response = (await this.serverApi.getAdminRights()) as
      | YpAdminRights
      | void
      | boolean;

    if (response) {
      this.adminRights = response as YpAdminRights;
      this.fireGlobal('yp-got-admin-rights', true);

      //TODO: Check this outFire another signal a bit later in case some components had not set up their listeners TODO: Find a better way
      /*setTimeout(() => {
        this.fireGlobal('yp-got-admin-rights', true);
      }, 1000);*/
    } else {
      this.adminRights = undefined;
      this.fireGlobal('yp-got-admin-rights', false);
    }
  }

  async getPromoterRights() {
    const response = (await this.serverApi.getPromoterRights()) as
      | YpPromoterRights
      | void
      | boolean;

    if (response) {
      this.promoterRights = response as YpPromoterRights;
      this.fireGlobal('yp-got-promoter-rights', true);
    } else {
      this.promoterRights = undefined;
      this.fireGlobal('yp-got-promoter-rights', false);
  }
  }

  _updateMembershipsIndex(memberships: YpMemberships) {
    if (memberships) {
      let i;
      this.membershipsIndex = { groups: {}, communities: {}, domains: {} };
      for (i = 0; i < memberships.GroupUsers.length; i++) {
        this.membershipsIndex.groups[memberships.GroupUsers[i].id] = true;
      }
      for (i = 0; i < memberships.CommunityUsers.length; i++) {
        this.membershipsIndex.communities[
          memberships.CommunityUsers[i].id
        ] = true;
      }
      for (i = 0; i < memberships.DomainUsers.length; i++) {
        this.membershipsIndex.domains[memberships.DomainUsers[i].id] = true;
      }
    } else {
      this.membershipsIndex = { groups: {}, communities: {}, domains: {} };
    }
  }

  async getMemberShips() {
    const response = (await this.serverApi.getMemberships()) as
      | YpMemberships
      | void
      | boolean;
    if (response) {
      this.memberships = response as YpMemberships;
      this._updateMembershipsIndex(this.memberships);
      this.fireGlobal('yp-got-memberships', true);
    } else if (this.memberships) {
      this.memberships = undefined;
      this.fireGlobal('yp-got-memberships', false);
    }
  }
}
