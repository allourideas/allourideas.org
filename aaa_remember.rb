# Steps to prepare testing 
Pairwise:
  rake testserver:launch
AOI: 
  script/console cucumber
    Abingo.cache.clear
  rake db:test:prepare
  
# start redis
rake redis:start