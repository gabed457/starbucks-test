# Starbucks NodeJs test (by Summit Group Solutions)

# Tasks:
This project is all about having fun with data. The project consists of 3 main components:
- server (express app) 
- job-processor.js, you will need to implement this file to complete the following tasks
- test/index.spec.js, your completed solution 

Notes: 
- event has the following structure/scheam
    {
        "event_id": INT,
        "type": "STRING",           // MANUAL, AUTOMATIC or HYBRID
        "payload": {
            "time": "INT (ms)",     // how long this event took, e.g.: 200ms. Note this field can be empty
            "status": "STRING",     // FAILED, SUCCEEDED, or PENDING
            "catalog_id": INT       // catalog id 
        }
    }
- routes/events.json contains all raw events that you will write code to manipulate

You have 4 core tasks to complete:
1. implement a route in events.js that:
    route name: events/raw (http://localhost:8000/events/raw)
    objective: 
        - returns all events from routes/events.json
2. implement a route in events.js
    route name: events/type/%s (e.g.: http://localhost:8000/events/type/MANAUL)
    objective: 
        - returns matching events base on event type
        - event type (url parameter) needs to be case insenisitive. For example, manual, Manual, MANUAL, or manuAL all are considered as MANUAL
        - Returns the following error message when event type has no match. For example: http://localhost:8000/events/type/abc
        {
            "error": "event type abc doesnt exist"
        }
3. implement the following function in job-processor.js (root level)
    async function getRawEvents(url) {
    }

    This function makes a HTTP GET request to http://localhost:PORT/events/raw, and will be used in tests (index.spec.js)

4. implement the following function in job-processor.js (root level)
    async function getEventsByType(url, eventType) {
    }

    This function makes a HTTP GET request to http://localhost:PORT/events/type/{eventType}, and will be used in tests (index.spec.js)

5. implement the following function in job-processor.js (root level)
    async function specialJob(eventUrl) {
    }

    This function should:
    - retrieve all raw events
    - we only interested in the "AUTOMATIC" events, but your function should be able to handle other event types
    - catalog_items needs to be sorted in ascending order
    - your implementation needs to be as performant as possible, the objective of this task is to evaluate your algorithm skill 
    - return the following output
   {
       "SUCCEEDED": {
           "total_time": 1241,
           "catalog_items": [1, 3, 4, 5]
       },
       FAILED: {
           "total_time": 1650,
           "catalog_items": [2, 11, 12]
       }
   }


Bonus (optional) tasks:
- a route/view to visualize the events 
- deploy to public cloud (e.g.: Google cloud, AWS, Azure, Heroku)
- CI/CD pipeline
- A utility to generate events for mocking and testing purposes
- authentication

# How to develop:
- npm install 
- npm start or nodemon server/index.js

# How to test:
- npm test