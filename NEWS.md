## 0.6.1 to 0.6.2 (unreleased)
(TODO)

 * Tickets: Improves displaying details about a send out ticket. It shows
   more information in a small table now, including the `template_format`.
 * Tickets: Changes behaviour to always show up to 10,000 events. If there are
   more events, the ones with the lowest `events_id` will be shown.
 * Contacts: (minor) Improves input of integers to avoid the cursor jumping
   to the end if a digit is entered in the middle of a number for browsers
   that check the type correctly (e.g. Chromium).
 * Stats: (minor) Adds hints how to use the `_icontains` query conditions.

### Upgrade
 * technical:
   Depends on fody-backend v>=0.6.1.


## 0.6.0 to 0.6.1

 * Contacts: (minor) Improves input of integers to avoid showing a superfluous
   dot.


## 0.5.2 to 0.6.0

 * Tickets, Stats: Raises display limit from <10,000 to <=50,000 events.
   So tickets with a higher number of events can be displayed
   at the cost of more time for loading the data. A message is shown if
   events will not be shown because of the limit.
 * Contacts: Improves entering an ASN or the sector-id, by disallowing
   incremental changes to avoid accidental change by a mouse wheel event
   and more rigidly checking for a natural number.
 * Contacts: Sorts the list of otherAttributes by their keys when editing,
   which makes the order consistent with both display only and editing.


## 0.5.1 to 0.5.2

 * Stats: Makes csv export files directly parsable for libreoffice by adding
     an ISO 8601 column.
 * Tickets, Stats: Improves the events detail view by displaying
     the `extra` attribute.
 * Stats: (minor) Adds minutes to the hourly x-axis-label to be more common.
 * Contacts: (minor) Changes display of ASNs from "ASN1234" to "AS1234".

### Upgrade
 * technical:
   Recommends fody-backend v>=0.5.3 for Stats event details to fully work.


## 0.5.0 to 0.5.1

 * Contacts: Fixes tag search to repeat the search after a commit.
 * Contacts: (minor) Display comment in brackets (except for the organisation)
   to be more consistent.


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
