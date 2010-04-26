class Visitor < ActiveRecord::Base
	has_many :session_infos

	#Default param values to use in leveling message
	A = 10
	B = 0
	C = 0.7
	D = 25
	E = 0
	F = 0.7
	LEVEL_ADJECTIVES = ["terrible", "pathetic", "lame", "so-so", "okay, I suppose",
		              "not bad", "good", "great", "amazing", "mythical"]

	def self.leveling_message(params = {:votes => 0, :ideas => 0})
		score = self.level_score(params)

		message = "Now you have cast " + 
		                "#{params[:votes]} #{params[:votes] == 1 ? "votes".singularize : "votes"} "+ 
		                "and added #{params[:ideas]} #{params[:ideas] == 1 ? "ideas".singularize : "ideas"}: "+
			        LEVEL_ADJECTIVES[(score/10).truncate]	
		          

	end

	def self.level_score(params = {:votes => 0, :ideas => 0})
		(A * params[:votes] + B)**C + (D * params[:ideas] + E)**F
	end
end
