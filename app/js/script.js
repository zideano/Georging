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

async function createAcc(acc) {
  const user = await post('v1/customer/endusers', acc.enduser) // create enduser
    .then(async (response) => { // wait for user to be set
      acc.ledger.holder_id = response.enduser_id;
      const temp = await get(`v1/customer/endusers/${response.enduser_id}/wait`);
      return temp;
    })
    .then((response) => { // create ledger
      console.log(response);
      return post('v1/customer/ledgers', acc.ledger);
    })
    .then(async (response) => { // wait for ledger to be set
      console.log(response);
      const temp = await get(`v1/customer/ledgers/${response.ledger_id}/wait`);
      return temp;
    })
    .then((response) => { // assign IBAN to ledger
      console.log(response);
      return post(`v1/customer/ledgers/${response.ledger_id}/assign-iban`);
    })
    .then(async (response) => { // wait for IBAN to be set
      console.log(response);
      const temp = await get(`v1/customer/ledgers/${response.ledger_id}/wait`);
      return temp;
    })
    .then((response) => {
      console.log(response);
      return {
        enduser_id: response.ledger_holder.enduser_id,
        ledger_id: response.ledger_id,
        iban: response.iban,
        bic: response.bic_swift,
      };
    });
  return user;
}

console.log(createAcc(accounts.georgeExpenseAcc));
