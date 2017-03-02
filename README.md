**Fody** is an interface for 
[intelmq-mailgen](https://github.com/Intevation/intelmq-mailgen) setups.

### Features
 * Shows event details for a report that has been send out.
 * Inspect the [IntelMQ certbund-contact](https://github.com/Intevation/intelmq/tree/certbund-contact/intelmq/bots/experts/certbund_contact) database.

![Screenshot](https://cloud.githubusercontent.com/assets/8190008/20760225/b2c83b80-b71f-11e6-98a0-f141f23b28c6.png)

![Screenshot-small-device](https://cloud.githubusercontent.com/assets/8190008/20760245/c2aa5678-b71f-11e6-920e-548d2e275c8e.png)

![Screenshot-Contacts](https://cloud.githubusercontent.com/assets/8190008/22743973/271a7d76-ee1c-11e6-882e-bbc629e97ace.png)

Installation
------------

#### Download:

Download (or clone) the source code.

[Install yarn "globally"](https://yarnpkg.com/en/docs/install).


#### Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:8080 
#   and proxy /api requests to localhost:8002
yarn run dev

# build for production with minification
yarn run build
```



For data to be retrieved, you need to serve the
[checkticket](https://github.com/Intevation/intelmq-mailgen/tree/master/extras/checkticket-spa)
and
[contactdb](https://github.com/Intevation/intelmq-mailgen/tree/master/extras/contactdb_api)
apis via http for your Intelmq setup.
As long as [#30](https://github.com/Intevation/intelmq-fody/issues/30) is
unsolved the apis needs to be server single-threaded.

See the [setup example for Ubuntu](docs/SetupExampleUbuntu.md) for a complete example.

Documentation
-------------

Check the [NEWS](NEWS.md) when upgrading from a previous version.

Some [design considerations](docs/DesignConsiderations.md) are documented.

The layout frame has originally be derived from the [CoPilot](https://github.com/misterGF/CoPilot) template.

License
-------
Fody is Free Software under the licenses of CoPilot,
the included components and
GNU Affero GPL v>=3 (for the files originating here).
Please see a particular source files for details.

During the build process a number of Free Software tools and components
are used, parts of them are included in the production build.
To get an overview of the licenses of the dependencies:
```sh
yarn licenses ls | grep License: | sed 's/^.*License: /License: /' | sort -u
```
While `yarn licenses ls` and `yarn generate-disclaimer` will give you
more details.

CoPilot is a Free Software initiative by [Gil Ferreira](http://gferreira.me)
and licensed under [MIT](http://opensource.org/licenses/MIT).

CoPilot is based on the [AdminLTE](https://github.com/almasaeed2010/AdminLTE)
template.
