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

const accounts = {
  georgeExpenseAcc: {
    iban: 'SK2300000991510408055471',
    ledger_primary_use_types: [
      'ledger-primary-use-types-payments',
    ],
    ledger_id: '5a06ff6f-4150-4247-982e-afb582817353',
    ledger_holder: {
      enduser_id: '5a06ff5c-9a3c-4ca4-8007-4d0d5083deb7',
    },
    ledger_who_owns_assets: 'ledger-assets-owned-by-me',
    partner_ref: 'examplebank',
    partner_id: '58fe2ce0-3def-4e08-b778-c121c7f98334',
    ledger_t_and_cs_country_of_jurisdiction: 'GB',
    bic_swift: 'SPSRSKBA',
    ledger_status: 'ledger-status-ok',
    amount: 0,
    partner_product: 'ExampleBank-EUR-1',
    partner: {
      partner_id: '58fe2ce0-3def-4e08-b778-c121c7f98334',
      company: {
        name: 'Example Bank',
      },
      partner_ref: 'examplebank',
    },
    ledger_iban_status: 'ledger-iban-status-ok',
    asset_type: 'eur',
    asset_class: 'currency',
    ledger_type: 'ledger-type-single-user',
  },
  georgeDonationAcc: {
    iban: 'SK5400001001510408061009',
    ledger_primary_use_types: [
      'ledger-primary-use-types-payments',
    ],
    ledger_id: '5a06ff6f-2ff7-4aa1-94b5-c2fef585ad37',
    ledger_holder: {
      enduser_id: '5a06ff5c-9a3c-4ca4-8007-4d0d5083deb7',
    },
    ledger_who_owns_assets: 'ledger-assets-owned-by-me',
    partner_ref: 'examplebank',
    partner_id: '58fe2ce0-3def-4e08-b778-c121c7f98334',
    ledger_t_and_cs_country_of_jurisdiction: 'GB',
    bic_swift: 'SPSRSKBA',
    ledger_status: 'ledger-status-ok',
    amount: 0,
    partner_product: 'ExampleBank-EUR-1',
    partner: {
      partner_id: '58fe2ce0-3def-4e08-b778-c121c7f98334',
      company: {
        name: 'Example Bank',
      },
      partner_ref: 'examplebank',
    },
    ledger_iban_status: 'ledger-iban-status-ok',
    asset_type: 'eur',
    asset_class: 'currency',
    ledger_type: 'ledger-type-single-user',
  },
  colaDonationAcc: {
    iban: 'SK2300001011510408068245',
    ledger_primary_use_types: [
      'ledger-primary-use-types-payments',
    ],
    ledger_id: '5a06ff75-6017-4c88-b3ac-794761a854ad',
    ledger_holder: {
      enduser_id: '5a06ff5c-9a3c-4ca4-8007-4d0d5083deb7',
    },
    ledger_who_owns_assets: 'ledger-assets-owned-by-me',
    partner_ref: 'examplebank',
    partner_id: '58fe2ce0-3def-4e08-b778-c121c7f98334',
    ledger_t_and_cs_country_of_jurisdiction: 'GB',
    bic_swift: 'SPSRSKBA',
    ledger_status: 'ledger-status-ok',
    amount: 0,
    partner_product: 'ExampleBank-EUR-1',
    partner: {
      partner_id: '58fe2ce0-3def-4e08-b778-c121c7f98334',
      company: {
        name: 'Example Bank',
      },
      partner_ref: 'examplebank',
    },
    ledger_iban_status: 'ledger-iban-status-ok',
    asset_type: 'eur',
    asset_class: 'currency',
    ledger_type: 'ledger-type-single-user',
  },
  totalDonationAcc: {
    iban: 'SK7800001041510408566566',
    ledger_primary_use_types: [
      'ledger-primary-use-types-payments',
    ],
    ledger_id: '5a070167-f5a1-406f-96b9-6aa8cbc576a0',
    ledger_holder: {
      enduser_id: '5a070154-6388-4d0e-b67b-4ae078fe0cc1',
    },
    ledger_who_owns_assets: 'ledger-assets-owned-by-me',
    partner_ref: 'examplebank',
    partner_id: '58fe2ce0-3def-4e08-b778-c121c7f98334',
    ledger_t_and_cs_country_of_jurisdiction: 'GB',
    bic_swift: 'SPSRSKBA',
    ledger_status: 'ledger-status-ok',
    amount: 0,
    partner_product: 'ExampleBank-EUR-1',
    partner: {
      partner_id: '58fe2ce0-3def-4e08-b778-c121c7f98334',
      company: {
        name: 'Example Bank',
      },
      partner_ref: 'examplebank',
    },
    ledger_iban_status: 'ledger-iban-status-ok',
    asset_type: 'eur',
    asset_class: 'currency',
    ledger_type: 'ledger-type-single-user',
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

console.log(accounts.georgeDonationAcc.bic_swift);
console.log(accounts.georgeDonationAcc.iban);

post('dev/customer/transactions/receive', {
  amount: 100,
  'bic-swift': accounts.georgeExpenseAcc.bic_swift,
  iban: accounts.georgeExpenseAcc.iban,
})

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
