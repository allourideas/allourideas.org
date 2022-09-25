AllOurIdeas::Application.routes.draw do

  resources :passwords, controller: "clearance/passwords", only: [:create, :new]
  resource :session, controller: "clearance/sessions", only: [:create]

  resources :users, controller: "clearance/users", only: [:create] do
    resource :password,
      controller: "clearance/passwords",
      only: [:edit, :update]
  end

  get "/sign_in" => "clearance/sessions#new", as: "sign_in"
  delete "/sign_out" => "clearance/sessions#destroy", as: "sign_out"
  get "/sign_up" => "clearance/users#new", as: "sign_up"
#  resource :passwords
  resources :questions do
    collection do
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
  get "/about" => "home#about", :as => :about
  get "/admin" => "home#admin", :as => :admin
  get "/privacy" => "home#privacy", :as => :privacy
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

  root :to => 'home#index'
end
