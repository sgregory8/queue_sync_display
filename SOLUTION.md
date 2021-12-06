## The idea

Essentially systemA and systemB are two asyncronous events occurring, to sync the two events up requires storing each event. This approach assumes
events can arrive in any order at any time.

Once an event arrives it's stored somewhere syncronous (ideally a db, in this case memory). The idea is that as soon as an event arrives it checks
for all sibling events, if all sibling events have arrived then it can retrieve the data and send it on (provided the data has not been sent before).

Because the requirement is to drive this from systemA, a timer is set as soon as an event from systemA arrives to make sure that in x time systemA's data
is sent on regardless if systemB's is present or not.

## Syncing up the events in the server

I chose to sync up systemA and systemB within the server and send them over ws to the client, just to leave the client responsible for just rendering the
data only.

## Improvements

- Implement some sort of data storage for syncing messages, fast in memory database would be good, fast database not tied to the web server even better.
- Test the sync implementation, it should be able to be exteneded to as many async events as needed.
- Drive the client application through a redux middleware to seperate the socket logic from the component, let the comonent be responsible for rendering only.
- Combine the data to one more easily consumable "view".
