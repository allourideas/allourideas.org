# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
case RAILS_ENV
when 'staging'
ActionController::Base.session = {
  :session_key => "_allourideas_ey_session_#{RAILS_ENV}_#{Time.now.inspect}",
  :secret      => "6dba8105d5aea328b336942988bcfd80erwe"
}
else
  ActionController::Base.session = {
    :session_key => "_allourideas_ey_session_#{RAILS_ENV}",
    :secret      => "6dba8105d5aea328b336942988bcfd80erwe"
  }
end

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
