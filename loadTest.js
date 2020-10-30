import http from 'k6/http';


function getId() {
  return Math.floor(Math.random() * 9999999)
}


export let options = {
    scenarios: {
        constant_request_rate: {
            executor: 'constant-arrival-rate',
            rate: 250,
            timeUnit: '1s',
            duration: '30s',
            preAllocatedVUs: 100, // how large the initial pool of VUs would be
            maxVUs: 250, // if the preAllocatedVUs are not enough, we can initialize more
        }
    }
};

export default function () {

  let getRequests = {
    method: 'GET',
    url: `http://localhost:3004/${getId()}`,
  };

  let postRequests = {
    method: 'POST',
    url: 'http://localhost:3004/api/reviews/',
    body: JSON.stringify({
    "author": "Harsh Singh",
    "stars": 5,
    "body": "This is a new review by Harsh Vikram Singh to test post requests in to the cassandra",
    "wouldRecommend": true,
    "title": "Post request successful",
    "comfort": 4,
    "style": 5,
    "value": 4,
    "sizing": 5,
    "helpfulVotes": 21,
    "productId": 9,
    "id": "8ac1f662-94b6-46e1-a115-71652dd19a7a",
    "createdAt": "2020-07-02",
    "createdAtTimeStamp": "00:00:00.000000994"
    }),
    params: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
  let responses = http.batch([getRequests, postRequests])
}