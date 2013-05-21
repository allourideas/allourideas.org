# Finally, we have this innocuous looking patch.  Without it, queries like this: current_account.tickets.recent.count
# would instantiate AR objects all (!!) tickets in the account, not merely return a count of the recent ones.
# See https://rails.lighthouseapp.com/projects/8994/tickets/5410-multiple-database-queries-when-chaining-named-scopes-with-rails-238-and-ruby-192
# (The patch in that lighthouse bug was not, in fact, merged in).
module ActiveRecord
  module Associations
    class AssociationProxy   
      def respond_to_missing?(meth, incl_priv)
        false
      end
    end
  end
end
