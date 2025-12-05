# 11/20 Define Basic Functionaility 
## Input / Output
1. Users are able to look at the past purchases, expenses
2. Users are able to input purchases and expenses. Don't let users feel that they are different though.
### How is this done ? 
1. Although you have the database defined. The user interface is not directly related to the database though. It depends on what the users are able to input and how you take that input and pass to the backend.

This is the API (bridge) definition between the frontend and the backend.

1. Backend will expose some things it needs from the frontend so we have to define the backend api. 
    - No receipt : be able to modify, add, delete entries in the database, at both the purchase and expense granularity.

    - With receipt : be able to add a receipt by photo or phone and pass it to the backend.
### How to design the apis and frontend user UI ?
1. Expose an api that requires all the data purchase needs - Huge payload each time in HTTP
2. Expose an api that only changes a small field in the expense or purchase - Too much api calls and the user might haven't even finished entering the data. 
3. How to make sure user has already inputted data? - But I don't like having a button to confirm everytime. Want user freely edits. 

#### Frontend - 5 solutions (Chatgpt)
1. Autosave with Debouncing
    - User types into the UI
    - Frontend waits 
    - User stops typing - Send single update API call 
    - If user continues typing - timer reset

2. Save Button
    - User edits field
    - Changes are stored in React state
    - Click **Save** to send API request
    - Warn when they leave with unsaved page
3. Auto-save on field blur
    - User focuses into a name field
    - leaves the field (blur-event) - save
4. Temporary local buffer + Save all
    - (Data-heavy apps, Obsidian, Jetbrain IDE)
    - User edits a lot
    - Kepp changes only in the client
    - Save button appears when there are unsaved changes
    - Send large bulk of update
5. Background Sync
    - (Google Doc, Figma, Multiplayer apps)
    - Kepp a local copy of the changes
    - sync in the background using events
    - Can merge conflicts 
    - Works offline

#### Solution : Autosave with debounce (you can actually add blur auto-save on the same field too)

#### Counter : API as modify purchase will result in a large API request
No, it wouldn't because you can use PATCH to change the fields by using optional in fastapi.

### But what about the backend ? 
Define the APIs (through pydantic classes in fastapi)

User inputs : 
Purchase : Location , Whole discount, final price (optional), list of expenses (initialize)
Expense : Price, tax, tip, product(name , item , category), detail(amount, discount, price/unit)


### Middleware
Middleware is code that runs before and after every API request.

Think of it like a “gate” between the outside world and your FastAPI route handlers.

Your React frontend (localhost:5173) is on a different domain from your FastAPI backend (localhost:8000).

Browsers normally block cross-origin requests → this is CORS.

CORS middleware tells the browser:

"This API is safe to access from your frontend domain."

Without CORSMiddleware, your frontend would get errors like:
“CORS policy blocked this request.”

### Sessions of db
Why REAL frameworks require sessions

As soon as you have:

multiple requests

users editing at the same time

multiple tables

foreign keys

constraints

partial updates

multiple API calls during a transaction

You need:

✔ transaction boundaries
✔ rollback on error
✔ identity map (so one object = one row consistently)
✔ concurrency isolation
✔ connection pooling
✔ auto-close behavior

These are provided by sessions, not raw connections.

Flat connections are too dangerous.

Why SQLAlchemy sessions exist

A SQLAlchemy session provides:

✔ 1. Identity map

If you load the same row twice, you get the same Python object.

This prevents:

inconsistent updates

stale data

duplicate inserts

✔ 2. Automatic transaction boundaries

Everything inside a session is part of a single DB transaction.

✔ 3. Lazy loading + caching

If you query the same thing twice, session returns it from memory.

✔ 4. Automatic rollback on errors

If something throws an exception in FastAPI, session rolls back.

✔ 5. Connection pooling

Sessions talk to a pool of reused connections.

✔ 6. Thread safety

Multiple users hitting your API → each gets their own session.

Without sessions, you get:

race conditions

locked tables

corrupted data

half-written transactions

stuck connections

This is why CS50’s simplified approach cannot work for real systems.


# Notes 
ARE there APIs NOT based on HTTP?

Yes, but they are specialized:

1. gRPC (Google RPC)

Uses HTTP/2 transport + binary Protobuf.
Very fast.
Used in microservices.

2. WebSockets

Bi-directional.
Used for chat apps, real-time apps.

3. TCP custom protocols

Used for:

game servers

financial trading

internal systems

4. Message queues

Not HTTP:

Kafka

RabbitMQ

Redis PubSub

5. Unix domain sockets

For local IPC, not internet.

But for webapps, mobile apps, customer-facing apps,
the answer is: always HTTP.