#
# Cookbook Name:: topbeat
# Recipe:: default
#
# Copyright 2016, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
topbeat_latest = Chef::Config[:file_cache_path] + '/topbeat-' + node['topbeat']['version']
remote_file topbeat_latest do
  source 'https://download.elastic.co/beats/topbeat/topbeat_' + node['topbeat']['version'] + '_i386.deb'
end

dpkg_package 'topbeat' do
  source topbeat_latest
  action :install
end

template node['topbeat']['conf_file'] do
  source 'topbeat.yml.erb'
  mode '0644'
  variables(
    :elasticsearch_host => node['topbeat']['elasticsearch_host']
  )
end

service 'topbeat' do
  provider Chef::Provider::Service::Init::Debian
  action [:enable, :start]
  supports :start => true, :stop => true, :restart => true, :reload => false, :status => true
end

