
const getSessionFromCookie = () => {
  var strCookies = document.cookie;
  var cookiearray = strCookies.split(";");
  var sid = "";
  for (var i = 0; i < cookiearray.length; i++) {
    var name = cookiearray[i].split("=")[0];
    var value = cookiearray[i].split("=")[1];
    if (name == " connect.sid") sid = value;
  }
  return sid;
};

const getQuestionIdFromPath = () => {
  const url = new URL(window.location.href);
  const pathComponents = url.pathname.split("/");
  let questionId = "-1";
  if (pathComponents.length > 1) {
    questionId = pathComponents[1];
  }
  return questionId;
}

async function logActivity(questionId, type, object, context, target) {
  return
  let actor;

  if (!questionId)  {
    questionId = getQuestionIdFromPath();
  }

  if (window.appUser && window.appUser.user) {
    actor = window.appUser.user.id;
  } else {
    actor = "-1";
  }

  const logString = `activity stream: ${questionId} ${actor} ${type} ${object}`;

  console.log(logString);

  let postId;
  let communityId;
  let groupId;
  let domainId;

  let pointId;

  if (context && typeof context === "object") {
    if (context.pointId) {
      pointId = context.pointId;
    }

    if (!postId && context.postId) {
      postId = context.postId;
    }
  }

  const date = new Date();
  const formData = new FormData();
  formData.append("actor", actor);
  formData.append("type", type);
  formData.append("object", object);
  formData.append("target", JSON.stringify(target));
  formData.append("context", context ? context : "");
  formData.append("path_name", location.pathname);
  formData.append("event_time", date.toISOString());
  formData.append("session_id", getSessionFromCookie());
  formData.append("pointId", pointId);
  formData.append("postId", postId);
  formData.append("questionId", questionId);
  formData.append(
    "groupId",
    (window.appGlobals && window.appGlobals.currentGroup ) ? window.appGlobals.currentGroup.id : groupId
  );
  formData.append("communityId", communityId);
  formData.append("domainId", domainId);
  formData.append("originalQueryString", window.location.search);
  formData.append("originalReferrer", document.referrer);
  formData.append("userLocale", window.locale);
  formData.append("userAutoTranslate", window.autoTranslate);
  formData.append("user_agent", navigator.userAgent);
  formData.append("referrer", document.referrer);
  formData.append("url", location.href);
  formData.append("screen_width", window.innerWidth);

  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");

  const response = await fetch("/createActivityFromApp", {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(formData),
  });

  if (!response.ok) {
    console.error("Error submitting activity:", response.statusText);
  }
}

window.logActivity = logActivity;

(async () => {
  const questionId = getQuestionIdFromPath();

  // Call the logActivity function here or other code within the anonymous function
  await window.logActivity(questionId, "pageview", location.pathname);
})();
