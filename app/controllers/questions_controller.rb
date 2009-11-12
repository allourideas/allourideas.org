class QuestionsController < ApplicationController
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
      @items = @question.items
      @right_choice_text = @prompt.right_choice_text
      @left_choice_text = @prompt.left_choice_text
  end
  
  def vote_left
    prompt_id = "1"
    question_id = "1"
    @prompt = Prompt.find(prompt_id)
    respond_to do |format|
        flash[:notice] = 'Vote was successfully counted.'
        format.xml  { head :ok }
        format.js  { 
          if @prompt.post(:vote_left, :params => {:question_id => question_id)
            render :json => '{"votes" : "20"}'
          else
            render :json => '{"error" : "Vote failed"}'
          end
          }
        end
      end

      def vote_right
        respond_to do |format|
            flash[:notice] = 'Vote was successfully counted.'
            format.xml  { head :ok }
            format.js  { 
              render :json => '{"votes" : "20"}'
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
