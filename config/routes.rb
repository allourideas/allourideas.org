AllOurIdeas::Application.routes.draw do

  resources :passwords, controller: "clearance/passwords", only: [:create, :new]
  resource :session, controller: "clearance/sessions", only: [:create]

  resources :users, controller: "clearance/users", only: [:create] do
    resource :password,
      controller: "clearance/passwords",
      only: [:edit, :update]
  end

  get "/admin" => "home#admin", :as => :admin
  get "/privacy" => "home#privacy", :as => :privacy
  get "/about" => "home#about", :as => :about
  get "/sign_in" => "clearance/sessions#new", as: "sign_in"
  get "/sign_out" => "clearance/sessions#destroy", as: "sign_out"
  get "/sign_up" => "clearance/users#new", as: "sign_up"

  get "/:earlName", to: "static#index", via: :all, constraints: { earlName: /[^\/]+/ }

  get '/analytics-and-promotion/:questionId', to: redirect { |params, request|
    "/apps/analytics_and_promotion/dist/?questionId=#{params[:questionId]}"
  }

  get '/apps/aoi_survey/dist/:id', to: redirect { |params, request|
    "/apps/aoi_survey/dist?name=#{params[:id]}"
  }

  put '/api/analytics/:questionId/plausibleStatsProxy', to: 'analytics#plausible_stats_proxy', as: :plausible_stats_proxy
  get '/api/analytics/:questionId/:type/getPlausibleSeries', to: 'analytics#get_plausible_series', as: :get_plausible_series
  post '/api/analytics/createActivityFromApp', to: 'analytics#create_activity_from_app', as: :create_activity_from_app

  scope '/api/analytics/:question_id', controller: :campaigns do
    get 'get_campaigns', action: :index
    post 'create_campaign', action: :create
    put ':campaign_id/update_campaign', action: :update
    delete ':campaign_id/delete_campaign', action: :destroy
  end

#  resource :passwords
  resources :questions do
    collection do
      get :get_ai_answer_ideas
    end
    member do
      put :update_name
      post :add_idea
      post :toggle
      post :toggle_autoactivate
      delete :delete_logo
      get :addphotos
      post :upload_photos
      get :admin_stats
      get :visitor_voting_history
    end
    resources :prompts, :only => [:vote, :skip, :flag] do
      member do
        post :vote
        post :skip
        post :flag
      end
    end

    resources :choices, :only => [:show, :votes] do
      member do
        get :activate
        get :deactivate
        post :rotate
        get :votes
      end
    end
  end

  resources :earls, :only => [:export_list] do
    collection do
      get :export_list
    end
  end

  resources :clicks do
    collection do
      get :export
    end
  end

  match "/questions/:earl_id/choices/:id/toggle.:format" => "choices#toggle", :as => :toggle_choice_status, :via => :post
  get "/cookies_blocked.gif" => "home#cookies_blocked", :as => :cookies_blocked
  get "/privacy-2009-07-06" => "home#privacy-2009-07-06", :as => :privacy_2009_07_06
  get "/example" => "home#example", :as => :example
  get "/verify" => "home#verify", :as => :verify
  get "/" => "home#index"
  #match "/abingo/:action/:id" => "abingo_dashboard#index", :as => :abingoTest
  get "/no_google_tracking" => "home#no_google_tracking", :as => :googletracking
  get "/export/:name" => "exports#download"
  get "/prompts/load_wikipedia_marketplace" => "prompts#load_wikipedia_marketplace"
  get "/wikipedia-banner-challenge/gallery" => "home#wikipedia_banner_challenge_gallery"
  get "/:id" => "earls#show", :as => :earl
  post "/:id/v/:code" => "earls#verify", :as => :earl_verify
  post "/:id/addphotos" => "questions#add_photos", :as => :add_photos
  get "/:id/:action" => "questions#index"

  scope '/api' do
     post "/questions/:question_id/prompts/:id/votes.js" => "prompts#vote"
     post "/questions/:id/add_idea.js" => "questions#add_idea"
     get "/earls/:id" => "earls#show", :as => :earl_two
     get "/questions/:id/results" => "questions#results", :as => :questions_results
     get "/questions/:id/:analysisIndex/:typeIndex/analysis" => "questions#analysis", :as => :questions_analysis
  end

  root :to => 'home#index'

end
