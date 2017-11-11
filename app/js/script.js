const baseUrl = 'https://play.railsbank.com/';
const apiKey = 'kdaGUXFQJQO0WT5ElszpsHn38POQSs8u#wKPZ4NBBva9AfH6i9eENIhwMNQqOAE0ZiF4W6hJKMe0OgJfz6OIEFcFPLtaz3CXI';

function cFetch(method, rUrl, data) {
  return fetch(baseUrl + rUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `API-Key ${apiKey}`,
    },
    body: JSON.stringify(data),
  }).then(response => response.json());
}

function post(url, data) {
  return cFetch('POST', url, data);
}

function get(url) {
  return cFetch('GET', url);
}

// function put(url, data) {
//   return cFetch('PUT', url, data);
// }

(async function test() {
  let response = await post('v1/customer/endusers', {
    person: {
      name: 'Henry',
    },
  });

  const henry = response.enduser_id;
  console.log(henry);

  response = await get(`v1/customer/endusers/${response.enduser_id}/wait`);
  console.log(response);
}());
