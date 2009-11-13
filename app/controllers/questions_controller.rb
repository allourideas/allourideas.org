class QuestionsController < ApplicationController
  require 'crack'
  caches_page :results, :new
  # GET /questions
  # GET /questions.xml
  def index
    @questions = Question.find(:all)

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
  def results
    @question = Question.find_by_name(params[:id])
    if params[:all]
      @choices = Choice.find(:all, :params => {:question_id => @question.id})
    else
      @choices = Choice.find(:all, :params => {:question_id => @question.id})
    end
    logger.info "First choice is #{@choices.first.inspect}"
  end
  
  def vote_left
    prompt_id = session[:current_prompt_id]
    logger.info "Getting ready to vote left on Prompt #{prompt_id}, Question #{params[:id]}"
     #@question = Question.find_by_name(params[:id])
    @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})
    #raise Prompt.find(:all).inspect
    winner, loser = @prompt.left_choice_text, @prompt.right_choice_text
    logger.info "winnder [sic] was #{winner}, loser is #{loser}"
    logger.info "prompt was #{@prompt.inspect}"
    respond_to do |format|
        flash[:notice] = 'Vote was successfully counted.'
        format.xml  {  head :ok }
        format.js  { 
          if p = @prompt.post(:vote_left, :params => {'auto' => request.session_options[:id]})
            newprompt = Crack::XML.parse(p.body)['prompt']
            @newprompt = Question.find(params[:id])
            render :json => {:votes => 20, :newleft => newprompt['left_choice_text'], 
                             :newright => newprompt['right_choice_text']
                             }.to_json
          else
            render :json => '{"error" : "Vote failed"}'
          end
          }
      end
    end
    
    def vote_right
      prompt_id = session[:current_prompt_id]
      logger.info "Getting ready to vote left on Prompt #{prompt_id}, Question #{params[:id]}"
       #@question = Question.find_by_name(params[:id])
      @prompt = Prompt.find(prompt_id, :params => {:question_id => params[:id]})
      #raise Prompt.find(:all).inspect
      loser, winner = @prompt.left_choice_text, @prompt.right_choice_text
      respond_to do |format|
          flash[:notice] = 'Vote was successfully counted.'
          format.xml  {  head :ok }
          format.js  { 
            if p = @prompt.post(:vote_left, :params => {'auto' => request.session_options[:id]})
              newprompt = Crack::XML.parse(p.body)['prompt']
              @newprompt = Question.find(params[:id])
              render :json => {:votes => 20, :newleft => newprompt['left_choice_text'], 
                               :newright => newprompt['right_choice_text']
                               }.to_json
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
    #@question = Question.find(params[:id])
  end

  # POST /questions
  # POST /questions.xml
  def create
    @question = Question.new(params[:question].except('url').merge({'auto' => request.session_options[:id]}))
    respond_to do |format|
      if @question.save
        earl = Earl.create(:question_id => @question.id, :name => params[:question]['url'])
        logger.info "Question was successfully created."
        flash[:notice] = 'Question was successfully created.'
        format.html { redirect_to(earl) }
        format.xml  { render :xml => @question, :status => :created, :location => @question }
      else
        logger.info "Question was not successfully created."
        format.html { render :action => "new" }
        format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
      end
    end
  end

  # # PUT /questions/1
  # # PUT /questions/1.xml
  # def update
  #   @question = Question.find_by_name(params[:id])
  # 
  #   respond_to do |format|
  #     if @question.update_attributes(params[:question])
  #       flash[:notice] = 'Question was successfully updated.'
  #       format.html { redirect_to(@question) }
  #       format.xml  { head :ok }
  #     else
  #       format.html { render :action => "edit" }
  #       format.xml  { render :xml => @question.errors, :status => :unprocessable_entity }
  #     end
  #   end
  # end
  # 
  # # DELETE /questions/1
  # # DELETE /questions/1.xml
  # def destroy
  #    @question = Question.find_by_name(params[:id])
  #   @question.destroy
  # 
  #   respond_to do |format|
  #     format.html { redirect_to(questions_url) }
  #     format.xml  { head :ok }
  #   end
  # end
end
