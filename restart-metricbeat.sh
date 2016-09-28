#/bin/sh
for i in `/usr/local/bin/vagrant status|grep running|awk '{print \$1}'`; do
  /usr/local/bin/vagrant ssh $i -c "sudo restart metricbeat";
done
