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
  totalDonationAcc: {
    enduser: {
      company: {
        name: 'To charity',
      },
    },
    ledger: l,
  },
};

const pubSub = (function pubSub() {
  const subs = {
    enduser: [],
  };
  return {
    on(type, fn) {
      if (typeof subs[type] === 'undefined') {
        subs[type] = [];
      }
      subs[type].push(fn);
    },
    trigger(type, arg) {
      if (typeof subs[type] !== 'undefined') {
        subs[type].forEach((fn) => {
          fn(arg);
        });
      }
    },
  };
}());

async function createEndUser(acc) {
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
    pubSub.trigger('enduser', account);
  });
}

pubSub.on('enduser', (acc) => {
  console.log(acc);
});

createEndUser(accounts.georgeExpenseAcc);


/*
 * UX
 */
const loginButton = document.querySelector('#login-button');
loginButton.addEventListener('click', () => {
  const req = new XMLHttpRequest();
  req.open('GET', 'platform.html', true);
  req.responseType = 'document';
  req.addEventListener('load', () => {
    document.open();
    document.appendChild(req.response.documentElement);
    document.close();
  });
  req.send();
});
