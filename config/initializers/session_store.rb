# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :session_key => ENV['SESSION_KEY'] || "_development_session",
  :secret      => ENV['SESSION_SECRET'] || "acae512910d591e2ab92d82781abc8f52bc723a8cc2124225a89b9e2ed05de875d2ec49c10a585bfcf40f6bfc1385b22578d9cbc7213a2cf61a9a900eaf57cfc"
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
