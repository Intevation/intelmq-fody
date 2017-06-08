## 0.5.0 to 0.5.1 (unreleased)

 (TODO)

## 0.4.3 to 0.5.0
 * Contacts: Adds search field for tags.
 * Contacts: Improves editing of annotation.tags, by offering the choice
     of commonly used tags loaded from the backend.
 * Adds a logo for fody.

### Upgrade
 * technical:
   Needs fody-backend v>=0.5.1


## 0.4.2 to 0.4.3
 * Contacts: Changes cidr search into one that searches cidr, IPs, domains
   and national certs.
 * Contacts: Limits the number of displayed search results
   (fixes https://github.com/Intevation/intelmq-fody/issues/51)


## 0.4.1 to 0.4.2
 * Contacts: Adds cidr search.
 * Contacts: Improves annotation handling and display:
   Inhibitions can now be edited and display nicer.
   Annotations can be added to ASNs.

### Upgrade
 * technical:
   Needs fody-backend v>=0.4.2.


## 0.2.1 to 0.4.1

TODO


## 0.2.0 to 0.2.1-dev

### Upgrade
 * minor, technical:
   Make sure that the subpages are also directly routed by the HTTP server,
   for examples with hug like
   ```
   @hug.get(urls=['/', '/tickets', '/contacts', '/stats', '/settings', '/login'],
            output=hug.output_format.file)
   def root():
           return("/home/fody/www/index.html")
   ```


## 0.1.2 to 0.2.0

 * Accesses the contactdb\_api on the server now, so it must be installed
   for the /Contacts subpage to work (see installation instructions).
 * The configuration of the production HTTP server must be single-threaded
   to avoid write conflicts in the contactdb.


_Noting the important changes to fody.
MUST list necessary actions when upgrading._
