#
# Cookbook Name:: metricbeat
# Recipe:: default
#
# Copyright 2016, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#
#
apt_package 'git' do
  action :install
end

goPath = '/home/vagrant/work'
go_latest = Chef::Config[:file_cache_path] + "/go1.6.2.linux-386"
extract_path = '/usr/local/go'

remote_file go_latest do
  source "https://storage.googleapis.com/golang/go1.6.2.linux-386.tar.gz"
end

execute 'extract_go' do
  cwd ::File.dirname(go_latest)
  command <<-EOH
  mkdir -p #{extract_path}
  tar zxf #{go_latest} -C #{extract_path}
  mv #{extract_path}/*/* #{extract_path}/
  EOH
  not_if { ::File.exists?(extract_path) }
end

directory "#{goPath}/src/github.com/elastic/beats" do
  action :create
  user "vagrant"
  group "vagrant"
  recursive true
end

git "#{goPath}/src/github.com/elastic/beats" do
  action :sync
  revision 'master'
  checkout_branch 'master'
  enable_checkout false
  user "vagrant"
  group "vagrant"
  repository 'https://github.com/elastic/beats.git'
end

execute 'build metricbeat' do
  user "vagrant"
  group "vagrant"
  command '/usr/bin/make'
  cwd "#{goPath}/src/github.com/elastic/beats/metricbeat"
  environment 'GOPATH' => goPath, 'PATH' =>  "/usr/local/go/bin:#{ENV['PATH']}"
end

template "/etc/init/metricbeat.conf" do
  source 'metricbeat.conf.erb'
  mode '0644'
  variables(
    :cmd => "#{goPath}/src/github.com/elastic/beats/metricbeat/metricbeat",
    :cwd => "#{goPath}/src/github.com/elastic/beats/metricbeat"
  )
end

template "#{goPath}/src/github.com/elastic/beats/metricbeat/metricbeat.yml" do
  source 'metricbeat.yml.erb'
  mode '0644'
  user "vagrant"
  group "vagrant"
  variables(
    :elasticsearch => "http://10.0.2.2:9200"
  )
end

service 'metricbeat' do
  provider Chef::Provider::Service::Upstart
  action [:enable, :restart]
end


