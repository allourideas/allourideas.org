 * Add better error handling for Ajax requests.
 * upgrade Bootstrap to 2.3.2 (deployed 2014-04-07T14:22:32Z)

## All Our Ideas 3.3.0 (Mar 31, 2014) ###
 * check for CSV data via pairwise API call instead of redis. Requires pairwise v3.2.0 to work.
 * include more information in CSV error email
 * use UTF8 for CSV files
 * alter layout of CSV file request links
 * alter name used to identify CSV exports

## All Our Ideas 3.2.0 (Mar 18, 2014) ###
 * Revamp session handling to better handle expired sessions, one session per wiki survey, multiple tabs. Expects at least pairwise v3.1.0 for proper handling of expired sessions.

## All Our Ideas 3.1.2 (Nov 26, 2013) ###
 * handle UTF8 characters in CSV data more gracefully
 * raise error on unverified requests (authenticity token)
 * update icons / graphics to be retina ready
 * add cookie check on non-widget voting page
 * improve widget when 3rd-party cookies are disabled
 * add caching for i18n calls
 * use libxml for XML parsing

## All Our Ideas 3.1.1 (Jun 17, 2013) ###
 * vote optimizations
 * update modal body to be fluid
 * Prevent infinite redirects in widget cookie fix
## All Our Ideas 3.1.0 (May 24, 2013) ###
 * Add Ruby 1.9.3 Support

## All Our Ideas 3.0.0 (Apr 10, 2013) ###
 * Remove old A/Bingo tests
 * Upgrade to Rails 2.3.18
