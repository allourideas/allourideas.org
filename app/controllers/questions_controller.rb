class QuestionsController < ApplicationController
  require 'crack'
  # GET /questions
  # GET /questions.xml
  def index
    @questions = Question.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @questions }
    end
  end

  # GET /questions/1
  # GET /questions/1.xml
  # def show
  #   @question = Question.find(params[:id])
  # 
  #   respond_to do |format|
  #     format.html # show.html.erb
  #     format.xml  { render :xml => @question }
  #   end
  # end
  
  def show
    #if user_owns_id?(id)
     @question = Question.find(params[:id]) #the question has a prompt id with it
      logger.info Question.find(params[:id]).inspect
      @prompt = Prompt.find(@question.attributes['picked_prompt_id'], :params => {:question_id => params[:id]})
      session[:current_prompt_id] = @question.attributes['picked_prompt_id']
      @items = @question.items
      @right_choice_text = @prompt.right_choice_text
      @left_choice_text = @prompt.left_choice_text
  end
  
  def vote_left
    prompt_id = session[:current_prompt_id]
    logger.info "Getting ready to vote left on Prompt #{prompt_id}, Question #{params[:id]}"
    @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})
    #raise Prompt.find(:all).inspect
    respond_to do |format|
        flash[:notice] = 'Vote was successfully counted.'
        format.xml  {  head :ok }
        format.js  { 
          if p = @prompt.post(:vote_left, :params => {'auto' => request.session_options[:id]})
            newprompt = Crack::XML.parse(p.body)['prompt']
            @newprompt = Question.find(params[:id])
            render :json => {:votes => 20, :newleft => newprompt['left_choice_text'], :newright => newprompt['right_choice_text']}.to_json
          else
            render :json => '{"error" : "Vote failed"}'
          end
          }
      end
    end
    
    def skip
      prompt_id = session[:current_prompt_id]
      logger.info "Getting ready to skip out on Prompt #{prompt_id}, Question #{params[:id]}"
      @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})
      #raise Prompt.find(:all).inspect
      respond_to do |format|
          flash[:notice] = 'You just skipped.'
          format.xml  {  head :ok }
          format.js  { 
            if p = @prompt.post(:skip, :params => {'auto' => request.session_options[:id]})
              newprompt = Crack::XML.parse(p.body)['prompt']
              @newprompt = Question.find(params[:id])
              render :json => {:votes => 20, :newleft => newprompt['left_choice_text'], :newright => newprompt['right_choice_text']}.to_json
            else
              render :json => '{"error" : "Skip failed"}'
            end
            }
        end
      end

      def add_idea
        prompt_id = session[:current_prompt_id]
        logger.info "Getting ready to skip out on Prompt #{prompt_id}, Question #{params[:id]}"
        new_idea_data = params[:new_idea]
        @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})
        #:params => {:question_id => params[:id]}
        @choice = Choice.new(:data => new_idea_data)
        #raise Prompt.find(:all).inspect
        respond_to do |format|
            flash[:notice] = 'You just added an idea for people to vote on.'
            format.xml  {  head :ok }
            format.js  { 
              if p = Choice.post(:create_from_abroad, :question_id => params[:id], :params => {'auto' => request.session_options[:id], :data => new_idea_data, :question_id => params[:id]})
                newprompt = Crack::XML.parse(p.body)['prompt']
                @newprompt = Question.find(params[:id])
                render :json => {:votes => 20, :newleft => newprompt['left_choice_text'], :newright => newprompt['right_choice_text'], 
                                 :message => "You just added an idea for people to vote on: #{new_idea_data}"}.to_json
              else
                render :json => '{"error" : "Addition of new idea failed"}'
              end
              }
          end
        end

    def vote_right
      prompt_id = session[:current_prompt_id]
      logger.info "Getting ready to vote right on Prompt #{prompt_id}, Question #{params[:id]}"
      @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})
      respond_to do |format|
          format.xml  {  head :ok }
          format.js  { 
            if @prompt.post(:vote_right, :params => {'auto' => request.session_options[:id]})
              flash[:notice] = 'Vote was successfully counted.'
              render :json => '{"votes" : "20"}'
            else
              render :json => '{"error" : "Vote failed"}'
            end
            }
        end
      end


  # GET /questions/new
  # GET /questions/new.xml
  def new
    @question = Question.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @question }
    end
  end

  # GET /questions/1/edit
  def edit
    @question = Question.find(params[:id])
  end

  # POST /questions
  # POST /questions.xml
  def create
    @question = Question.new(params[:question])

    respond_to do |format|
      if @question.save
        flash[:notice] = 'Question was successfully created.'
        format.html { redirect_to(@question) }
        format.xml  { render :xml => @question, :status => :created, :location => @question }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /questions/1
  # PUT /questions/1.xml
  def update
    @question = Question.find(params[:id])

    respond_to do |format|
      if @question.update_attributes(params[:question])
        flash[:notice] = 'Question was successfully updated.'
        format.html { redirect_to(@question) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /questions/1
  # DELETE /questions/1.xml
  def destroy
    @question = Question.find(params[:id])
    @question.destroy

    respond_to do |format|
      format.html { redirect_to(questions_url) }
      format.xml  { head :ok }
    end
  end
end
