
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
let firstMessage = true;



document.addEventListener("DOMContentLoaded", function() {
  const aiIdeasButton = document.getElementById("ai-ideas-button");
  const spinner = document.getElementById("ai-ideas-spinner");
  const ideasTextArea = document.getElementById("question_ideas");

  function removeNumbersAndExtraLines(text) {
    return text
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.replace(/^\d+\.\s*/, ''))
      .join('\n');
  }

  const getPreviousIdeas = () => {
    let previousIdeas = ideasTextArea.value;
    // Replace all new lines with "  \n"
    previousIdeas = previousIdeas.replace(/\n/g, "aoirvb8735");
    return previousIdeas;
  };

  aiIdeasButton.addEventListener("click", function() {
    spinner.style.display = "block";

    const question = document.getElementById("question_name").value;
    aiIdeasButton.disabled = true;

    fetch(`/questions/get_ai_answer_ideas?question=${question}&previous_ideas=${getPreviousIdeas()}&first_message=${firstMessage}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      credentials: "same-origin"
    })
    .then(response => response.json())
    .then(jsonData => {
      const answerIdeas = jsonData.answerIdeas;
      firstMessage = false;
      aiIdeasButton.disabled = false;
      console.log("Success fetching AI answer ideas:", answerIdeas);
      let cleanedAnswerIdeas = ideasTextArea.value+"\n"+answerIdeas.replace("\n\n","\n");
      cleanedAnswerIdeas = removeNumbersAndExtraLines(cleanedAnswerIdeas);
      cleanedAnswerIdeas = cleanedAnswerIdeas.replace(/&quot;/g, '"');
      cleanedAnswerIdeas = cleanedAnswerIdeas.trim();
      ideasTextArea.value = cleanedAnswerIdeas;
      spinner.style.display = "none";
      ideasTextArea.scrollTop = ideasTextArea.scrollHeight;
    })
    .catch(error => {
      aiIdeasButton.disabled = false;
      console.error("Error fetching AI answer ideas:", error);
      spinner.style.display = "none";
    });
  });
});
// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
//= jquery
//= jquery-ui
//= jquery.hint
//= jquery.corner
//= facebox
//= jquery.jqEasyCharCounter
//= jquery.blockUI
//= application_main


;
