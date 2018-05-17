Here are some example recipes to setup fody on Ubuntu 14.04LTS.

### Building a production-ready version of fody

### install nodejs and yarn
This setup step is **only necessary for building fody from sources**:

```sh
# as root
# Confirming "trusty" is supported...
curl -sLf -o /dev/null 'https://deb.nodesource.com/node_6.x/dists/trusty/Release' && echo yes

## Adding the NodeSource and Yarn signing pubkeys to your system...
curl -sS https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -

## Creating apt sources list file for the NodeSource Node.js v6.x repo...
echo 'deb https://deb.nodesource.com/node_6.x trusty main' > /etc/apt/sources.list.d/nodesource.list
echo 'deb-src https://deb.nodesource.com/node_6.x trusty main' >> /etc/apt/sources.list.d/nodesource.list

## Creating apt sources list file for yarn...
echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list
```

#### installing nodejs, yarn
If you are using the [logbuch-tools from Intevation's adminton](https://hg.intevation.de/adminton/raw-file/tip/logbuch-tools/logbuch-installer) which helps you to write down administrative steps:
```sh
apt-install nodejs yarn
```
otherwise
```sh
apt-get update
apt-get install nodejs yarn
```

#### Check installed versions
```sh
nodejs -v
# testoutput v6.9.5
yarn --version
# testoutput 0.19.1
```


#### Only for fody (versions <= 0.1.2) :

make sure that we are asking our own webserver before running the build:

```diff
--- a/src/components/dash/Tickets.vue
+++ b/src/components/dash/Tickets.vue
@@ -92 +92 @@ module.exports = {
-      queryURL: 'http://localhost:8000/',  // base url for AJAJ service
+      queryURL: '/',  // base url for AJAJ service
```

Do a production build of fody (as indicated in the main fody documentation), which ends up in `dist`.


### install server-side backend

Follow the instructions of the
[backend](https://github.com/Intevation/intelmq-fody-backend)
and make sure the production version of fody you want will be served.


#### Using a virtual environment for hug
First follow the official way for
[installing Python Modules](https://docs.python.org/3/installing/index.html),
e.g.

```shell
#as root
apt-get install python3-pip python3.4-venv
```

```shell
#as fody
pyvenv-3.4 venv-hug

# enable system-site-packages later, so that pip gets always installed
# change line to  include-system-site-packages = true  with
vim venv-hug/pyvenv.cfg

source venv-hug/bin/activate

# (optionally) get current pip
pip3 install --upgrade pip setuptools

# pip should should now be current (v>9.0.1) and for python 3.4, check with
pip --version

pip install --upgrade hug
```



