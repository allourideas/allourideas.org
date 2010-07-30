class Visitor < ActiveRecord::Base
	has_many :session_infos

	#Default param values to use in leveling message
	A = 10
	B = 0
	C = 0.7
	D = 25
	E = 0
	F = 0.7

	def self.leveling_message(params = {:votes => 0, :ideas => 0})
		score = self.level_score(params)

		vote_noun = params[:votes] == 1 ? I18n.t('common.vote').downcase : I18n.t('common.votes').downcase
		idea_noun = params[:ideas] == 1 ? I18n.t('common.idea').downcase : I18n.t('common.ideas').downcase

		adjective_key = "vote.leveling.adjective_" + (score/10).truncate.to_s

		message = I18n.translate('vote.leveling.leveling_message', 
					 :vote_num => params[:votes], 
					 :vote_noun => vote_noun, 
					 :idea_num => params[:ideas], 
					 :idea_noun => idea_noun, 
					 :adjective => I18n.t(adjective_key))
		          

	end

	def self.level_score(params = {:votes => 0, :ideas => 0})
		score = (A * params[:votes] + B)**C + (D * params[:ideas] + E)**F

		[score, 99].min # only 10 levels
	end
end
