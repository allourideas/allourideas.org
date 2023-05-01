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

    fetch(`/questions/get_ai_answer_ideas?question=${question}&previous_ideas=${ideasTextArea.value}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      credentials: "same-origin"
    })
    .then(response => response.text())
    .then(data => {
      console.log("Success fetching AI answer ideas:", data);
      let newValue = ideasTextArea.value+"\n"+data.replace("\n\n","\n");
      newValue = removeNumbersAndExtraLines(newValue);
      ideasTextArea.value = newValue;
      spinner.style.display = "none";
      ideasTextArea.scrollTop = ideasTextArea.scrollHeight;
    })
    .catch(error => {
      console.error("Error fetching AI answer ideas:", error);
      spinner.style.display = "none";
    });
  });
});