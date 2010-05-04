run "cd #{release_path} && rake hoptoad:deploy TO=#{node[:environment][:framework_env]} USER=#{node[:owner_name]} REVISION=#{`cat #{release_path}/REVISION`}"
