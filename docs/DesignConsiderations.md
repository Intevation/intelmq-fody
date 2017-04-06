_Aim: Documenting a few technical design considerations._

#### How to expose contactdb n-to-m table functionality

In March 2017 we did a major change of the contactdb schema
(e.g. before and up to https://github.com/Intevation/intelmq/commit/85c89012299e57198713ed222ad921761d9f3d97 ).

The question is how to expose the possible uses of the database schema
to users via fody's front
and [backend](https://github.com/Intevation/intelmq-fody-api).

A big challenge is how to deal with entries in `network`, `fqdn`
and `autonomous_system_annotation`
if changes are made to an organisation relating to them.

For illustration
there are two potential ways to use the possibility of the schema that we can
have the same `fqdn` several times:
 1. Do not make use of multiple entries, because an operator wants
    to keep the comment and annotations of one fqdn to be used in all places
    where it is referenced. So she can change the `comment` or `annotations`
    of the fqdn entry in one place and affect all organisations that use it.
    If she wanted only one organisation to treat the `fqdn` in question
    differently, this would then need to be an annotation
    to the organisation, not the `fqdn`.
 2. Each organisation refering to an `fqdn` gets their own entry. This makes
    adding an annotation that affects the same fqdn in all places harder
    as it would have to be done editing each organisation. On the other hand
    it is easier to understand what will happen if an organisation is changed
    regarding its fqdns.

Mixing both ways add another burden to the interface as the operator
would have to decide between reusing and doing changes to an existing entry
or to a new one. In order to do this, the interface would need to expose
the current relations and methods to change them. The operator would also
need to cope with a more relaborated mental model to be able to make use
of the possibilities.

Both ways have their up and downsides as described. A good decision
which one is better on the long way would need the input of usability testing
and real world usage patterns. It may be that using a single `fqdn`
in different organisations is rare, so 2.'s potential drawback can be neglected.
Or it could be the other way round.


#### Contacts Editing: a single commit request

Operators want to make changes to the contactdb
so that events get distributed better.

The current approach aims for changing the database while the
intelmq-cb-mailgen system is running. We do not want to stop
it for performance reasons and we want the updates to be effective
as soon as possible.

If some values are to be manually adjusted they may have to be changed
in several organisation-objects. For example deleting an ASN in one
organisation and adding it to another. Those changes have to happen
to the database within one transaction to that the status is consistent
before and after the change.

To avoid having to hold a state on the server, we therefore
transmit all changes to the contactdb at once.

This approach is prepared to be reused when preparing the manual
changes before an automatic update of contactdb data can be imported.
