require "openai"

module AiHelper
  def get_answer_ideas(question, previous_ideas, first_message)
    client = OpenAI::Client.new(access_token: ENV.fetch("OPENAI_API_KEY"))

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
                    The answer should never be more than one short sentence.
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
            model: "gpt-4",
            messages: messages,
            temperature: 0.7,
        })
      puts "Response: "+response.to_s
      return response.dig("choices", 0, "message", "content")
        end
  end
end
