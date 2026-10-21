# Preference Privacy Contract

## Professional view

May access its own preference records, location display name, category and active state. It can create and remove them idempotently.

## Contractor view

Receives only:

```text
locationId
categoryId
count
```

It must never receive professional id, name, avatar, profile, contact, precise position, timestamp, sequence or a link to an individual.

## Rules

- Repeating the same active preference does not increase count.
- Removing preference decreases the aggregate.
- Publishing a job from an aggregate pre-fills only category and location.
- Preference never creates application, assignment, chat or notification identifying a professional.
