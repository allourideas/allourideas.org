require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe Visitor do
  before(:each) do
    @valid_attributes = {
    }
  end

  it "should create a new instance given valid attributes" do
    Visitor.create!(@valid_attributes)
  end

  it "should calculate scores accurately" do
	  examples = [ #votes, #ideas, result
		       [0, 0, 0.0], [0, 1, 9.5],  [0, 2, 15.5],
		       [1, 0, 5.0], [1, 1, 14.5],  [1, 2, 20.5],
		       [2, 0, 8.1], [2, 1, 17.7],  [2, 2, 23.6],
		       [3, 0, 10.8],[3, 1, 20.3], [3, 2, 26.3],
		       [4, 0, 13.2],[4, 1, 22.7], [4, 2, 28.7],
		       [5, 0, 15.5],[5, 1, 25.0], [5, 2, 30.9],
		       [6, 0, 17.6],[6, 1, 27.1], [6, 2, 33.0],
		       [7, 0, 19.6],[7, 1, 29.1], [7, 2, 35.0],
		       [8, 0, 21.5],[8, 1, 31.0], [8, 2, 36.9],
		       [9, 0, 23.3],[9, 1, 32.9], [9, 2, 38.8],
		       [10, 0, 25.1],[10, 1,34.6],[10, 2, 40.6]

	  ]

	  examples.each do |e|
		  Visitor.level_score(:votes => e[0], :ideas => e[1]).should be_close(e[2], 0.05)
	  end
  end
  
  it "should return level messages accurately" do
          Visitor.leveling_message(:votes => 0, :ideas => 1).should == "Now you have cast 0 votes and added 1 idea: terrible"
          Visitor.leveling_message(:votes => 1, :ideas => 1).should == "Now you have cast 1 vote and added 1 idea: pathetic"
          Visitor.leveling_message(:votes => 2, :ideas => 2).should == "Now you have cast 2 votes and added 2 ideas: lame"
  end
end
