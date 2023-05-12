interface AoiPromptData {
  id: number;
  left_choice_id: number;
  right_choice_id: number;
  created_at: string;
  updated_at: string;
  votes_count: number;
  left_choice_text: string;
  right_choice_text: string;
}

interface AoiQuestionData {
  id: number;
  creator_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  choices_count: number;
  prompts_count: number;
  active: boolean;
  information: string;
  site_id: number;
  local_identifier: string;
  votes_count: number;
  it_should_autoactivate_ideas: boolean;
  inactive_choices_count: number;
  uses_catchup: boolean;
  show_results: boolean;
  version: string;
  appearance_id: string;
  picked_prompt_id: number;
  visitor_votes: number;
  visitor_ideas: number;
}

interface AoiEarlData {
  id: number;
  name: string;
  question_id: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  pass: string;
  logo_file_name: string;
  logo_content_type: string;
  logo_file_size: string;
  logo_updated_at: string;
  welcome_message: string;
  default_lang: string;
  logo_size: string;
  flag_enabled: boolean;
  accept_new_ideas: boolean;
  verify_code: string;
  show_cant_decide: boolean;
  show_add_new_idea: boolean;
  configuration?: AoiEarlConfigurationData;
}


interface AoiEarlConfigurationData {
  welcome_html?: string;
  target_votes: number;
  lock_results_until_target_votes: boolean;
  temp_logo_url?: string;
  theme_color?: string;
  welcome_html: string;
  target_votes: number;
  lock_results_until_target_votes: boolean;
  theme_color: string;
  temp_logo_url: string;
  analysis_config: {
    analyses: AoiSurveyAnalysisData[];
  };
}

interface AoiEarlResponse {
  earlContainer: AoiEarlContainerData;
  prompt: AoiPromptData;
  question: AoiQuestionData;
}

interface AoiVoteResponse {
  prompt_id: number;
  question_id: number;
  appearance_lookup: string;
  left_choice_id: number;
  left_choice_url: string;
  message?: string;
  newleft: string;
  newright: string;
  right_choice_id: number;
  right_choice_url: string;
}

interface AoiVoteData {
  time_viewed: number;
  prompt_id: number;
  direction: string;
  appearance_lookup: string;
}

interface AoiVoteSkipData {
  time_viewed: number;
  cant_decide_reason: string;
  appearance_lookup: string;
}

interface AoiResultData {
  id: number;
  created_at: string;
  active: boolean;
  score: number;
  wins: number;
  losses: number;
  data: string;
  user_created: boolean;
}

interface AoiEarlContainerData {
  earl: AoiEarlData;
}


interface AnalysisTypeData {
  label: string;
  contextPrompt?: string;
  analysis?: string;
  answerRows?: AoiResultData[];
}

interface AoiSurveyAnalysisData {
  ideasLabel: string;
  ideasIdsRange: number;
  analysisTypes: AnalysisTypeData[]
}