require "openai"

module AiHelper
  def get_answer_ideas(question, previous_ideas)
    client = OpenAI::Client.new(access_token: ENV.fetch("OPENAI_API_KEY"))

    moderation_response = client.moderations(parameters: { input: question })
    puts "Moderation response: "+moderation_response.to_s
    flagged = moderation_response.dig("results", 0, "flagged")
    puts "Flagged: "+flagged.to_s

    if previous_ideas and previous_ideas.length > 0
      previous_ideas = "Previous ideas:\n"+previous_ideas+"\n\n"
    end

    if flagged == true
      Rails.logger.error("Flagged: "+question)
      return null
    else
      messages = [
        {
          role: "system",
          content: "You are a higlhly competent AI that is able to generate short answer ideas for questions.
                    You will generate 10 short one sentence answers to a single question.
                    The answers should be unique, wide ranging, creative, unbiased and thoughtful.
                    The answer should never be more than one short sentence.
                    If there are previous ideas do not output them or very similar ideas again.
                    Write the answers out the clearly as an answer to the question without directly referencing the question.
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
