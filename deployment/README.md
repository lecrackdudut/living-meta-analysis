# LiMA deployment

We deploy LiMA on two servers:
- `lima` – the actual LiMA Node.js server
- `statsvr` – a separate server with StatsD and Graphite so we can see statistics even if the LiMA server crashes.

The files in `deployment` reflect the above servers; `deployment/shared` files may go on both.

------------------
## Server `lima`

We expect LiMA to be installed on a Linux server by the user `lima` in `/home/lima/living-meta-analysis`. Logs and PID go into `/var/{run,log}/lima`. If you want to change any of this, you need to hunt for the mentions of these paths everywhere in `deployment/`.

### Requirements

- git
- node (we use 4.x)

### Setup

 1. clone the repo into `/home/lima/living-meta-analysis`
 1. `npm install`
 1. fill in google-datastore-specific settings in `server/config.js`
   * the above needs an authentication key pointed at by `config.gcloudProject.keyFilename` – this is generated for you by the Google developer console
 1. change `webpages/js/auth.js` to include your own client ID also generated by Google
 1. fill in HTTPS settings, or comment out HTTPS-specific parts of `config.js` to run on HTTP only
 1. `npm start`

### Updating

```
ssh lima
sudo login -f lima
cd living-meta-analysis
# do not forever stop server
git diff -U2             # review currently existing local changes
git stash
git pull
git stash apply
git diff -U2             # verify the local changes haven't been broken
npm install --production # if package.json has changed
forever restart server   # if server has changed
logout                   # so we don't have a hanging terminal to the server
```

### Invite Codes

For now with `./invites.txt` to generate an invite, append a line like this:

```
random-code-12345 # 2017-02-28 generated for Cochrane workshop attendees
```

use the script `geninvite` to generate invites, e.g.

```
for pom in `seq 1 100`; do geninvite "for Cochrane workshop attendees and other invitees"; done
```

Then print them with [LiMA's print page](https://lima.soc.port.ac.uk/admin/print-invites).

Source of `geninvite`:

```
#!/bin/bash

code=''
while grep -q "$code" invites.txt
do
  code=`uuidgen`
  code=${code##*-}
done

echo $code '#' `date +"%Y-%m-%d %H:%M"` $1
echo $code '#' `date +"%Y-%m-%d %H:%M"` $1 >> ~/living-meta-analysis/invites.txt
```

To view used invites:

```
zcat -f /var/log/lima/*access.log  | awk '/^[^    ]+[     ][^-]/ {print $2}' | sort -u | (while read a; do grep -- "$a" ~/living-meta-analysis/invites.txt; done) | sort -k +3
```

To view failed invites:

```
zcat -f /var/log/lima/*access.log  | awk '/^[^    ]+[     ]-/ {print $2}' | sort -u 
```


------------------
## Server `statsvr`

We monitor LiMA with StatsD and Graphite, deploying those with Docker.

The `deployment/statsvr` folder contains:

- `Dockerfile` – a docker configuration for an image of StatsD and Graphite
- `config.js` – a custom StatsD configuration file that gets baked into the docker image
- `example-graphite-dashboard.json` – an example Graphite dashboard set up to monitor both servers

The VM expects to use port 8080 for the graphite frontend. (Change the commands below to tweak this.) This port gives access to all the data without authorization; graphs and dashboards can only be stored after logging in through the Web interface as the user `root` (whose password needs to be set as part of the setup below). Consider firewalling this `statsvr` server so only trusted networks have access to it.

### Requirements

 - Ubuntu/Debian
 - Docker
 - OS monitoring requirements from the **Shared Files** section

### Setup

First, copy the `deployment/statsvr` directory onto the server. Then, on the server, run as root:

```
cd statsvr
docker build -t graphiteimg .
docker run -d \
           --name graphite \
           --restart=always \
           -p 8080:80 \
           -p 8125:8125/udp \
           -v `pwd`/data:/opt/graphite/storage \
           graphiteimg
```

**Then change the root password (default `root`) at `http://<statsvr hostname>/admin/password_change/`.**

This should be all that's needed, verify it is running correctly by browsing to the server (port 8080).

Graphite will come up with no pre-configured graphs or dashboards. In `example-graphite-dashboard.json` you'll find a beginner dashboard. You can import this into Graphite using the Web UI through Dashboard -> Edit Dashboard.

Docker will automatically start the image when docker itself starts, including on machine boot.

### Persistent `statsvr` Files:

The `run` command above sets up the following persistent data volume:

- `data`: the storage for Graphite – this contains all of your saved graphs and dashboards, the admin password, and all the historic data

This `data` directory will persist between boots; you will probably want to back it up.

### Useful Docker Commands

command | comment
--------|--------
`docker restart graphite` | stop and start the instance `graphite` (e.g. if some bit of it breaks)
`docker stop graphite` | stop the running instance
`docker rm graphite` | remove the instance
`docker rmi graphiteimg` | clear the built container image `graphiteimg`
`docker logs graphite` | shows the runtime logs of the container
`docker exec -it graphite /bin/bash` | open a `bash` inside the container (e.g. for inspection)


------------------

## Shared Files: OS-level monitoring scripts

 - `monitoring-os-scripts` has OS-level monitoring scripts (CPU, HDD, NET) that should run on any server we want to monitor
 - `monitoring-os-scripts/init` contains a sample `/etc/init.d/` file for automatically running the monitoring scripts on boot

### Requirements

- ifconfig
- /proc/stat
- free
- df
- nc

### Setup

LiMA server:

- On LiMA server, create `/home/lima/living-meta-analysis/statsd-server-conf.sh` that specifies the location of the StatsD VM as `STATSD_HOST` and `STATSD_PORT`, see example below
- In this file, also include `STATSD_PREFIX=lima.` (with the trailing `.`, as shown below) so it ties to the prepared Graphite dashboard
- Make sure that `living-meta-analysis/deployment/shared/monitoring-os-scripts/monitor.sh` gets run at boot
  - for example, copy `living-meta-analysis/deployment/shared/monitoring-os-scripts/init/lima-os-monitoring` to `/etc/init.d` and register it with your OS
  - this example puts PID and logs into `/var/{run,log}/lima`

```
STATSD_HOST=<statsvr hostname or IP address>
STATSD_PORT=8125
STATSD_PREFIX=lima.
```

Stats server:

- copy the `deployment/shared/monitoring-os-scripts` folder onto the `statsvr` server
- create the `statsd-server-conf.sh` file in the `monitoring-os-scripts` as above
- but use the prefix `STATSD_PREFIX=statsvr.`
- Make sure that `monitoring-os-scripts/monitor.sh` gets run at boot
  - for example, copy `monitoring-os-scripts/init/lima-os-monitoring` to `/etc/init.d`
  - update the `DAEMON` line with the correct absolute path
  - create `/var/{run,log}/lima` for PID and logs
  - and register it with your OS

------------------
## Database

We use [Google Datastore](https://cloud.google.com/datastore/).

We have server-side datastore dump, restore and migrate scripts. They communicate directly with the datastore as configured in `config.js`; the LiMA server should be down while the restore script is running.

### Dump

To dump the currently configured data store:

`npm run db-dump`

... this will create a dump file and write out its name.


### Restore

To restore from a dumpfile, first stop LiMA server, then run the following:

`npm run db-add < dumpfile`

After restoring data, start LiMA server again and it should see the new data.

Note that `db-add` will not overwrite any existing data.


### Migrate

To migrate a dumpfile, run the following:

`npm run db-migrate < dumpfile > dumpfile.migrated`
