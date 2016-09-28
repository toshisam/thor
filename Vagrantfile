# vagrant init hashicorp/precise64
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty32"
  # config.vm.box = "metricbeatbox"
  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
    # v.memory = 128
    v.cpus = 1
  end

  (0..19).to_a.each do |index|
    config.vm.define "host-0#{index}" do |host|
      host.vm.hostname = "host-0#{index}"
    end
  end

  config.vm.provision "chef_solo" do |chef|
    chef.version = "12.10.24"
    chef.cookbooks_path = "chef/cookbooks"
    chef.nodes_path = "chef/nodes"
    chef.roles_path = "chef/roles"
    chef.data_bags_path = "chef/data_bags"
    chef.add_recipe "apt"
    chef.add_recipe "metricbeat"
  end
end
