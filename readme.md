# Schema and validation

- checks data before pushing to db (valid or invalid) (write at schema)
- not all fields can be updates. only few fields can updates(write in apis)
- most important thing API validations , must be free from attackers from all aspects.
- use validator package for adding more validations on DB schema
- some fields need to validate from UI only but at schema also for better sanitization and security. (do more validations on db schema where i left some)

# passwords and their security

# indexing

- used to fetch data faster in large database.
- used index for email.
- make email as index. if unique is true then automatically is add index for attribute .
- in connections for fromUser, toUser use a index for both, i.e is compound index. to search connections in faster way.
- $or $and used as joins in mongoDb , read more abt it.

# ref and populate.

- using ref we can establish connection between two table and merge required attributes.
- like connectionRequest contains username and details of who send connction to you, by merging them using ref.

# Feed api and pagination

- feed can be designed as our wish , like only show the girls or only show the boys or show same skill set. like we can apply as many filters on it.
- using filters is the best option

- complex api feed logic based on existed connections using mongoDb query operators.
- pagination for sending only few users of data at a time , reduce the load by some setting some limit
- mongo has default parameters i.e skip and limit , which are helpful for pagination
- /feed?page=1&limit=10 => .skip(0) .limit(10)
- /feed?page=2&limit=10 => .skip(10) .limit(10)

# Chat and messages.

- Time stamp issue in chat
