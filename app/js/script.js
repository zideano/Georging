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

const l = {
  partner_product: 'ExampleBank-EUR-1',
  asset_class: 'currency',
  asset_type: 'eur',
  'ledger-type': 'ledger-type-single-user',
  'ledger-who-owns-assets': 'ledger-assets-owned-by-me',
  'ledger-primary-use-types': ['ledger-primary-use-types-payments'],
  'ledger-t-and-cs-country-of-jurisdiction': 'GB',
};

const accounts = {
  georgeExpenseAcc: {
    enduser: {
      person: {
        name: 'George',
      },
    },
    ledger: l,
  },
  georgeDonationAcc: {
    enduser: {
      person: {
        name: 'George Donation',
      },
    },
    ledger: l,
  },
  colaDonationAcc: {
    enduser: {
      company: {
        name: 'Coca-Cola Donation',
      },
    },
    ledger: l,
  },
  mergedDonationAcc: {
    enduser: {
      company: {
        name: 'To charity',
      },
    },
    ledger: l,
  },
};

async function createAcc(acc, callback) {
  let response = await post('v1/customer/endusers', acc.enduser); // create enduser

  // wait for user to be set
  acc.ledger.holder_id = response.enduser_id;
  response = await get(`v1/customer/endusers/${response.enduser_id}/wait`);

  // create ledger
  response = await post('v1/customer/ledgers', acc.ledger);

  // wait for ledger to be set
  response = await get(`v1/customer/ledgers/${response.ledger_id}/wait`);

  // assign IBAN to ledger
  response = await post(`v1/customer/ledgers/${response.ledger_id}/assign-iban`);

  // wait for IBAN to be set
  get(`v1/customer/ledgers/${response.ledger_id}/wait`).then((account) => {
    callback({
      enduser_id: account.ledger_holder.enduser_id,
      ledger_id: account.ledger_id,
      iban: account.iban,
      bic: account.bic_swift,
    });
  });
}

function test(obj) {
  console.table(obj);
}

createAcc(accounts.georgeExpenseAcc, test);


/*
 * UX
 */
const loginButton = document.querySelector('#login-button');
const app = document.querySelector('#app');
loginButton.addEventListener('click', () => {
  const req = new XMLHttpRequest();
  req.open('GET', 'platform.html', true);
  req.addEventListener('load', () => {
    document.querySelector('#login').remove();
    app.appendChild(document.createTextNode(req.response));
  });
  req.send();
});
