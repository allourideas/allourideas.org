class Visitor < ActiveRecord::Base
	has_many :session_infos

	def self.leveling_message(params = {:votes => 0})
		vote_noun = params[:votes] == 1 ? I18n.t('common.vote').mb_chars.downcase.to_s : I18n.t('common.votes').mb_chars.downcase.to_s
		I18n.translate('vote.leveling.leveling_message_votes_only', 
      :vote_num => params[:votes], 
      :vote_noun => vote_noun)
	end

	def self.level_score(params = {:votes => 0, :ideas => 0})
		score = (A * params[:votes] + B)**C + (D * params[:ideas] + E)**F

		[score, 99].min # only 10 levels
	end
end
