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

  aiIdeasButton.addEventListener("click", function() {
    spinner.style.display = "block";

    const question = document.getElementById("question_name").value;
    aiIdeasButton.disabled = true;

    fetch(`/questions/get_ai_answer_ideas?question=${question}&previous_ideas=${ideasTextArea.value}&first_message=${firstMessage}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      credentials: "same-origin"
    })
    .then(response => response.text())
    .then(data => {
      firstMessage = false;
      aiIdeasButton.disabled = false;
      console.log("Success fetching AI answer ideas:", data);
      let newValue = ideasTextArea.value+"\n"+data.replace("\n\n","\n");
      newValue = removeNumbersAndExtraLines(newValue);
      newValue = newValue.replace(/&quot;/g, '"');
      newValue = newValue.trim();
      ideasTextArea.value = newValue;
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