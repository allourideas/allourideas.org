namespace :wikipedia do
  
  task(:seed => :environment) do
seed_ideas = [
"If you love Wikipedia, please donate.
Please read: If you love Wikipedia, please donate.
If you use Wikipedia, please donate to help keep it running.  Servers and bandwidth are not free.
Servers and bandwidth are not free.  If you use Wikipedia, please donate to keep it running.
Do you think Wikipedia runs by itself?  No, it needs your help.
Are you the kind of person that helps make the world a better place?
Do you want to make the world a better place?  Donate to Wikipedia now.
Ads are not evil, but they don’t belong on Wikipedia.
Please read: Ads are not evil, but they don’t belong on Wikipedia.
Stop waiting: donate now.
Wikipedia needs your money to stay awesome.  Please help.
People, we need your help.  Wikipedia need money to keep going.
People, we need your money.  Stop reading and start donating.  Then starting reading again.
The only non-profit website in the top 10.  Help keep us different.
The only non-profit website in the top 10.  Help keep Wikipedia different.
We don’t have ads so we need your help.  Your donation keeps Wikipedia independent and vibrant.
Freedom isn’t free.  Wikipedia can only stay-ad free because of your donations.
If you’re really passionate about knowledge, donate to Wikipedia.
Please read: There is something I want to tell you.
What are you waiting for?  Donate now.
Please read: I’m a student, and I donated to Wikipedia.  What about you?
I’m a student, and I donated to Wikipedia.  What about you?
I’m a student, and I donated  to Wikipedia.  Now it is your turn.",

"If you love Wikipedia, please donate.
Please read: If you love Wikipedia, please donate.
If you use Wikipedia, please donate to help keep it running.  Servers and bandwidth are not free.
Servers and bandwidth are not free.  If you use Wikipedia, please donate to keep it running.
Do you think Wikipedia runs by itself?  No, it needs your help.
Are you the kind of person that helps make the world a better place?
Do you want to make the world a better place?  Donate to Wikipedia now.
Ads are not evil, but they don’t belong on Wikipedia.
Please read: Ads are not evil, but they don’t belong on Wikipedia.
Stop waiting: donate now.
Wikipedia needs your money to stay awesome.  Please help.
People, we need your help.  Wikipedia need money to keep going.
People, we need your money.  Stop reading and start donating.  Then starting reading again.
The only non-profit website in the top 10.  Help keep us different.
The only non-profit website in the top 10.  Help keep Wikipedia different.
We don’t have ads so we need your help.  Your donation keeps Wikipedia independent and vibrant.
Freedom isn’t free.  Wikipedia can only stay-ad free because of your donations.
If you’re really passionate about knowledge, donate to Wikipedia.
Please read: There is something I want to tell you.
What are you waiting for?  Donate now.
My name is Karhik, and I donated to Wikipedia.  I want to help make it better.  Do you?
My name is Karhik, and there is something that I want to tell you.
My name is Karhik, and I want to tell you a story.
Please read: My name is Karhik, and I want to tell you a story.",

"If you love Wikipedia, please donate.
Please read: If you love Wikipedia, please donate.
If you use Wikipedia, please donate to help keep it running.  Servers and bandwidth are not free.
Servers and bandwidth are not free.  If you use Wikipedia, please donate to keep it running.
Do you think Wikipedia runs by itself?  No, it needs your help.
Are you the kind of person that helps make the world a better place?
Do you want to make the world a better place?  Donate to Wikipedia now.
Ads are not evil, but they don’t belong on Wikipedia.
Please read: Ads are not evil, but they don’t belong on Wikipedia.
Stop waiting: donate now.
Wikipedia needs your money to stay awesome.  Please help.
People, we need your help.  Wikipedia need money to keep going.
People, we need your money.  Stop reading and start donating.  Then starting reading again.
The only non-profit website in the top 10.  Help keep us different.
The only non-profit website in the top 10.  Help keep Wikipedia different.
We don’t have ads so we need your help.  Your donation keeps Wikipedia independent and vibrant.
Freedom isn’t free.  Wikipedia can only stay-ad free because of your donations.
If you’re really passionate about knowledge, donate to Wikipedia.
Please read: There is something I want to tell you.
What are you waiting for?  Donate now.
Please read a personal appeal from Susan Hewitt.
Susan Hewitt wants you to donate to Wikipedia.",

"If you love Wikipedia, please donate.
Please read: If you love Wikipedia, please donate.
If you use Wikipedia, please donate to help keep it running.  Servers and bandwidth are not free.
Servers and bandwidth are not free.  If you use Wikipedia, please donate to keep it running.
Do you think Wikipedia runs by itself?  No, it needs your help.
Are you the kind of person that helps make the world a better place?
Do you want to make the world a better place?  Donate to Wikipedia now.
Ads are not evil, but they don’t belong on Wikipedia.
Please read: Ads are not evil, but they don’t belong on Wikipedia.
Stop waiting: donate now.
Wikipedia needs your money to stay awesome.  Please help.
People, we need your help.  Wikipedia need money to keep going.
People, we need your money.  Stop reading and start donating.  Then starting reading again.
The only non-profit website in the top 10.  Help keep us different.
The only non-profit website in the top 10.  Help keep Wikipedia different.
We don’t have ads so we need your help.  Your donation keeps Wikipedia independent and vibrant.
Freedom isn’t free.  Wikipedia can only stay-ad free because of your donations.
If you’re really passionate about knowledge, donate to Wikipedia.
Please read: There is something I want to tell you.
What are you waiting for?  Donate now.
Dude.  What are you waiting for?  Donate now.
Please read an appeal from programmer Brandon Harris.
I work hard writing software to make Wikipedia awesome.  Now, I need your help.
I work hard writing software to help you enjoy Wikipedia.  Now, I need your help.",

"If you love Wikipedia, please donate.
Please read: If you love Wikipedia, please donate.
If you use Wikipedia, please donate to help keep it running.  Servers and bandwidth are not free.
Servers and bandwidth are not free.  If you use Wikipedia, please donate to keep it running.
Do you think Wikipedia runs by itself?  No, it needs your help.
Are you the kind of person that helps make the world a better place?
Do you want to make the world a better place?  Donate to Wikipedia now.
Ads are not evil, but they don’t belong on Wikipedia.
Please read: Ads are not evil, but they don’t belong on Wikipedia.
Stop waiting: donate now.
Wikipedia needs your money to stay awesome.  Please help.
People, we need your help.  Wikipedia need money to keep going.
People, we need your money.  Stop reading and start donating.  Then starting reading again.
The only non-profit website in the top 10.  Help keep us different.
The only non-profit website in the top 10.  Help keep Wikipedia different.
We don’t have ads so we need your help.  Your donation keeps Wikipedia independent and vibrant.
Freedom isn’t free.  Wikipedia can only stay-ad free because of your donations.
If you’re really passionate about knowledge, donate to Wikipedia.
Please read: There is something I want to tell you.
What are you waiting for?  Donate now.
I’m Jimmy Wales, founder of Wikipedia, and I approve this message.
Please read: a personal appeal from Jimmy Wales.
Please read: a personal appeal from Wikipedia founder Jimmy Wales.",

"If you love Wikipedia, please donate.
Please read: If you love Wikipedia, please donate.
If you use Wikipedia, please donate to help keep it running.  Servers and bandwidth are not free.
Servers and bandwidth are not free.  If you use Wikipedia, please donate to keep it running.
Do you think Wikipedia runs by itself?  No, it needs your help.
Are you the kind of person that helps make the world a better place?
Do you want to make the world a better place?  Donate to Wikipedia now.
Ads are not evil, but they don’t belong on Wikipedia.
Please read: Ads are not evil, but they don’t belong on Wikipedia.
Stop waiting: donate now.
Wikipedia needs your money to stay awesome.  Please help.
People, we need your help.  Wikipedia need money to keep going.
People, we need your money.  Stop reading and start donating.  Then starting reading again.
The only non-profit website in the top 10.  Help keep us different.
The only non-profit website in the top 10.  Help keep Wikipedia different.
We don’t have ads so we need your help.  Your donation keeps Wikipedia independent and vibrant.
Freedom isn’t free.  Wikipedia can only stay-ad free because of your donations.
If you’re really passionate about knowledge, donate to Wikipedia.
Please read: There is something I want to tell you.
What are you waiting for?  Donate now.
My name is Maryana Pinchuk, and I have a message for you.
I work to make Wikipedia awesome.  Now I need your help.
My Maryana Pinchuk and there is something I want to say to you.",

"If you love Wikipedia, please donate.
Please read: If you love Wikipedia, please donate.
If you use Wikipedia, please donate to help keep it running.  Servers and bandwidth are not free.
Servers and bandwidth are not free.  If you use Wikipedia, please donate to keep it running.
Do you think Wikipedia runs by itself?  No, it needs your help.
Are you the kind of person that helps make the world a better place?
Do you want to make the world a better place?  Donate to Wikipedia now.
Ads are not evil, but they don’t belong on Wikipedia.
Please read: Ads are not evil, but they don’t belong on Wikipedia.
Stop waiting: donate now.
Wikipedia needs your money to stay awesome.  Please help.
People, we need your help.  Wikipedia need money to keep going.
People, we need your money.  Stop reading and start donating.  Then starting reading again.
The only non-profit website in the top 10.  Help keep us different.
The only non-profit website in the top 10.  Help keep Wikipedia different.
We don’t have ads so we need your help.  Your donation keeps Wikipedia independent and vibrant.
Freedom isn’t free.  Wikipedia can only stay-ad free because of your donations.
If you’re really passionate about knowledge, donate to Wikipedia.
Please read: There is something I want to tell you.
What are you waiting for?  Donate now.
I work hard writing software to make Wikipedia awesome.  Now, I need your help.
I work hard writing software to help you enjoy Wikipedia.  Now, I need your help."]

    # User.destroy_all
    # Earl.destroy_all
    u = User.create!(:email => 'chapambrose@gmail.com', :password => 'password', :password_confirmation => "password")
    u.email_confirmed = true
    u.save!
    7.times do |i|
      q = Question.new(
        :name => "Please click on the Wikipedia fundraising banner that makes you want to donate more.",
        :url => "wikipedia-fundraiser#{'-'+(i+1).to_s unless i == 0}",
        :ideas => seed_ideas[i]
      )
      
      q.save
      u.earls.create!(:question_id => q.id, :name => q.url)
    end
  end

end