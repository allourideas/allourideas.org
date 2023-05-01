export class YpSurveyHelpers {
  static getQuestionLengthWithSubOptions(questions: Array<YpStructuredQuestionData>) {
    let length = 0;
    for (let i = 0; i < questions.length; i++) {
      length += 1;
      const question = questions[i];
      if (
        question.type === 'radios' &&
        question.radioButtons &&
        question.radioButtons.length > 0
      ) {
        length += question.radioButtons.length;
      } else if (
        question.type === 'checkboxes' &&
        question.checkboxes &&
        question.checkboxes.length > 0
      ) {
        length += question.checkboxes.length;
      } else if (
        question.type === 'dropdown' &&
        question.dropdownOptions &&
        question.dropdownOptions.length > 0
      ) {
        length += question.dropdownOptions.length;
      }
    }

    return length;
  }
}
