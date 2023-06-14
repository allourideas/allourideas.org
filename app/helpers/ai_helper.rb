require "openai"

module AiHelper
  def get_answer_ideas(question, previous_ideas, first_message)
    client = OpenAI::Client.new(access_token: ENV.fetch("OPENAI_API_KEY"))

    if !previous_ideas
      previous_ideas = ""
    end

    # Replace previous_ides text "||n" with new lines
    previous_ideas = previous_ideas.gsub("aoirvb8735", "\n")

    moderation_response = client.moderations(parameters: { input: question })
    puts "Moderation response: "+moderation_response.to_s
    flagged = moderation_response.dig("results", 0, "flagged")
    puts "Flagged: "+flagged.to_s

    #TODO: If you have alraedy started to use the first message template always use it for this generaation
    first_message_with_previous_ideas_template = ""

    if previous_ideas and previous_ideas.length > 0
      previous_ideas = "Previous answer ideas:\n"+previous_ideas+"\n\n"

      if first_message
        first_message_with_previous_ideas_template = "For your answers please follow the tone of voice, prose, style and length of the Previous answer ideas\n"
      end
    end

    if flagged == true
      Rails.logger.error("Flagged: "+question)
      return null
    else
      messages = [
        {
          role: "system",
          content: "You are a highly competent AI that is able to generate short answer ideas for questions.
                    You will generate 10 short one sentence answers to a single question.
                    The answers should be unique, wide ranging, creative, unbiased and thoughtful.
                    The answer should never be more than one short sentence at most 140 characters long or 27 words.
                    If there are previous ideas do not output them or very similar ideas again.
                    #{first_message_with_previous_ideas_template}
                    Please always answer in the language used in the user question.
                    Write the answers out clearly as an answer to the question without directly referencing the question.
                    You never explain and you only output the 10 answers, nothing else.
                    Never output the answer number at the start of a sentence.",
        },
        {
          role: "user",
          content: "What are some possible answers to the question: #{question}\n\n#{previous_ideas}Answers:\n",
        }
      ]
      puts "Messages: "+messages.to_s
      response = client.chat(
        parameters: {
            model: "gpt-4-0613",
            messages: messages,
            temperature: 0.7,
        })
      puts "Response: "+response.to_s
      return response.dig("choices", 0, "message", "content")
    end
  end

  def get_moderation_flag(input_text)
    if ENV.has_key?("OPENAI_API_KEY")
      client = OpenAI::Client.new(access_token: ENV.fetch("OPENAI_API_KEY"))
      moderation_response = client.moderations(parameters: { input: input_text })
      return moderation_response.dig("results", 0, "flagged")
    else
      return false
    end
  end

  def get_ai_analysis(question_id, contextPrompt, answers)
    if ENV.has_key?("OPENAI_API_KEY")
      base_pre_prompt = "
         You are a highly competent text and ideas analysis AI.
         If an answer sounds implausible as an answer to the question, then include a short observation about it in your analysis.
         Keep your output short, under 300 words.
         The answers have been rated by the public using a pairwise voting method, so the user is always selecting one to win or one to lose.
         Generally, do not include the number of wins and losses in your answers.
         If there are very few wins or losses, under 10 for most of the ideas, then always output a disclaimer to that end, in a separate second paragraph.
         Don't output Idea 1, Idea 2 in your answer.
         Be creative and think step by step.
         If the prompt asks for a table always output a markdown table.
      "
      client = OpenAI::Client.new(access_token: ENV.fetch("OPENAI_API_KEY"))

      answers_text = answers.map { |answer| "#{answer.data} (Won: #{answer.wins}, Lost: #{answer.losses})" }.join("\n")

      moderation_response = client.moderations(parameters: { input: answers_text })
      puts "Moderation response: "+moderation_response.to_s
      flagged = moderation_response.dig("results", 0, "flagged")

      if flagged == true
        Rails.logger.error("Flagged: "+answers_text)
        return ""
      else
        messages = [
          {
            role: "system",
            content: "#{base_pre_prompt}\n#{contextPrompt}"
          },
          {
            role: "user",
            content: "The question: #{@question.name}\n\nAnswers to analyse:\n#{answers_text}",
          }
        ]
        puts "Messages: "+messages.to_s
        response = client.chat(
          parameters: {
              model: "gpt-4-0613",
              messages: messages,
              temperature: 0.7,
          })
        puts "Response: "+response.to_s
        return response.dig("choices", 0, "message", "content")
      end
    else
      return "No AI API key"
    end
  end
end

