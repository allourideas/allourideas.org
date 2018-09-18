Rails.application.routes.draw do 
  root 'home#index'
  resource :session, :controller => "clearance/sessions", :only => [:new, :create, :destroy]
  get '/sign_in' => "clearance/sessions#new", :as => 'signin'
  get '/sign_out' => "clearance/sessions#destroy", :as => :signout
  resource :passwords, :controller => "clearance/passwords"

  resources :questions do
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
    resources :prompts, :only => [] do
      member do
        post :vote
        post :skip
        post :flag
      end
    end
    resources :choices, :only => [:show] do
      member do
        get :votes
        get :activate
        get :deactivate
        post :rotate
      end
    end
  end

  resources :earls, :only => [] do
    collection do
      get :export_list
    end
  end
  resources :clicks do
    collection do
      get :export
    end
  end
  #map.connect '/questions/:question_id/choices/:id', :controller => 'choices', :action => 'show'
  post '/questions/:earl_id/choices/:id/toggle.:format' =>  'choices#toggle', :as => 'toggle_choice_status'
  get '/cookies_blocked.gif' =>  'home#cookies_blocked', :as => 'cookies_blocked'
  get '/about' => 'home#about', :as => 'about'
  get '/admin' => 'home#admin', :as => 'admin'
  get '/privacy' => 'home#privacy', :as => 'privacy'
  get '/privacy-2009-07-06' => 'home#privacy-2009-07-06', :as => 'privacy-2009-07-06'
  get '/example' => 'home#example', :as => 'example'
  get '/verify' => 'home#verify', :as => 'verify'
  get '/signup' => 'users#new', :as => 'signup'
  #map.toggle_question '/questions/:id/toggle', :controller => 'questions'
  #map.abingoTest "/abingo/:action/:id", :controller=> :abingo_dashboard
  get "/no_google_tracking" => 'home#no_google_tracking', :as => 'googletracking'


  get '/export/:name' => 'exports#download'

  get '/prompts/load_wikipedia_marketplace' => 'prompts#load_wikipedia_marketplace'
  get '/wikipedia-banner-challenge/gallery' => 'home#wikipedia_banner_challenge_gallery'

  get '/:id' => 'earls#show', :as => 'earl'
  get '/:id/v/:code' => 'earls#verify', :as => 'earl_verify'
  get '/:id/addphotos' => 'questions#add_photos', :as => 'add_photos'
  get '/:id/:action' => 'questions'
  # rake routes
  # http://guides.rubyonrails.org/routing.html
end
