require "spec_helper"

class WrongUser
  def deliver_message 
    raise
  end
end

class WrongNotifierJob
  def perform
    WrongUser.deliver_message
  end
end

describe Delayed do

  xit "should call HoptoadNotifier" do
    HoptoadNotifier.expects(:notify)

    @worker = Delayed::Worker.new(:max_priority => nil, :min_priority => nil, :quiet => true)
    @worker.max_attempts = 1
    Delayed::Job.create(:payload_object => WrongNotifierJob.new)
    @worker.work_off
   
  end

end
