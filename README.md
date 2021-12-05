## Usage

  Install dependencies:

```bash
npm install
```

  Start the server, client and mock_systems.js script:

```bash
npm start
```

## Challenge

This sample app is made up of:

1. A React client with Redux (using redux-toolkit- <https://redux-toolkit.js.org/>) `./client/`
2. An Express server with Typescript `./server/`
3. A mock tool to simulate external input from two systems. `./tools/mock_systems.js`. This outputs ZMQ messages on your localhost through the following ports (intended for use in a pub/sub zeromq implementation):
  "System A": 20001,
  "System B": 20002

Please extend this service to consume and synchronise the messages for "System A" and "System B" produced by `./tools/mock_systems`. Then send the synchronised data to the React Front-end and display in realtime to the user

- "System A" is the primary system and no ZMQ messages should be skipped or discarded
- "System B" is the secondary system and provides additional - non critical information
- Messages should be synchronised based on their timestamps being equal
- Messages between "System A" and "System B" may be received out of order and with a delay
- We should wait no longer than 800 milliseconds before abandoning an attempt to synchronise the data before returning just the current message from "System A"

To get started follow the steps in Usage above
