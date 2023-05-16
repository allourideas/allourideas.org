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

  if (aiIdeasButton) {
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
  }
});
