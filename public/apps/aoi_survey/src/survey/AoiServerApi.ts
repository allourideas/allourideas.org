import { YpServerApiBase } from '../@yrpri/common/YpServerApiBase.js';

export class AoiServerApi extends YpServerApiBase {
  constructor(urlPath: string = '/api') {
    super();
    this.baseUrlPath = urlPath;
  }

  public getEarl(earlName: string): AoiEarlResponse {
    return this.fetchWrapper(
      this.baseUrlPath + `/earls/${earlName}.json`
    ) as unknown as AoiEarlResponse;
  }

  public getSurveyResults(earlName: string): AoiResultData[] {
    return this.fetchWrapper(
      this.baseUrlPath + `/questions/${earlName}/results.json`
    ) as unknown as AoiResultData[];
  }

  getSurveyAnalysis(
    earlName: string,
    analysisIndex: number,
    analysisTypeIndex: number
  ): AnalysisTypeData {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/questions/${earlName}/${analysisIndex}/${analysisTypeIndex}/analysis.json`
    ) as unknown as AnalysisTypeData;
  }

  public submitIdea(questionId: number, newIdea: string): AoiAddIdeaResponse {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/questions/${questionId}/add_idea.js`,
      {
        method: 'POST',
        body: JSON.stringify({new_idea: newIdea}),
      },
      false
    ) as unknown as AoiAddIdeaResponse;
  }

  public postVote(
    questionId: number,
    promptId: number,
    locale: string,
    body: AoiVoteData
  ): AoiVoteResponse {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/questions/${questionId}/prompts/${promptId}/votes.js?locale=${locale}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    ) as unknown as AoiVoteResponse;
  }

  public postVoteSkip(
    questionId: number,
    promptId: number,
    locale: string,
    body: AoiVoteSkipData
  ): AoiVoteResponse {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/questions/${questionId}/prompts/${promptId}/skip.js?locale=${locale}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    ) as unknown as AoiVoteResponse;
  }
}
