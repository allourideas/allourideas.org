class HomeController < ApplicationController
  

  def index
    demo_vars
  end

  def login
    if request.post?
      set_user(params[:email], params[:password])
      if user_account?
        flash.now[:notice] = t('session.logged_in_successfully')
        redirect_to users_path
      else
        reset_user
        flash.now[:error] = t('session.no_account')
      end
    end
  end

  def logout
    reset_user
    redirect_to root_path
  end

  def forgot_password
    if request.post?
      user = User.first(:conditions => { :email => params[:email] })
      if user
        Mailer.deliver_password(user)
        flash[:notice] = t('user.retrieve_success')
        redirect_to login_path
      else
        flash[:error] = t('user.no_email')
      end
    end
  end

  def about
    about_question = Question.find(1)#Const::ABOUT_QUESTION_ID)
    # set_pairwise_user(about_question.user.email, about_question.user.decoded_password)
    # @id, @question, @items, @votes = Pairwise.get_question(about_question.pairwise_id)
    # @url1 = named_url_for_question(about_question)
  end

  def tour
    demo_vars
  end

  def privacy
  end

  private
    def demo_vars
      question = Question.find(1)#Const::TOUR_DEMO_QUESTION_ID)
      #set_pairwise_user(question.user.email, question.user.decoded_password)
      #@id, @question, @items, @votes = Pairwise.get_question(question.pairwise_id)
      #@url1 = named_url_for_question(question)
    end
end
