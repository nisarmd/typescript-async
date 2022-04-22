import axios, { AxiosResponse, AxiosError } from 'axios';

import {
  Order,
  Callback,
  CallbackError,
  Hero,
  AccountRepresentative,
} from '../interfaces';
import { apiUrl, parseList } from './config';

const getHeroTreeCallback = function(
  email: string,
  callback: Callback<Hero>,
  callbackError?: CallbackError,
) {
  getHeroCallback(
    email,
    hero => {
      getOrdersCallback(
        hero.id,
        orders => {
          hero.orders = orders;
          getAccountRepCallback(
            hero.id,
            accountRep => {
              hero.accountRep = accountRep;
              callback(hero);
            },
            error => callbackError(error),
          );
        },
        error => callbackError(error),
      );
    },
    error => callbackError(error),
  );
};

const getHeroCallback = function(
  email: string,
  callback: Callback<Hero>,
  callbackError?: CallbackError,
) {
  axios
    .get<Hero[]>(`${apiUrl}/heroes?email=${email}`)
    .then((response: AxiosResponse<Hero[]>) => {
      const data = parseList<Hero>(response);
      const hero = data[0];
      callback(hero);
    })
    .catch((error: AxiosError) => {
      console.error(`Developer Error: Async Data Error: ${error.message}`);
      callbackError(`Oh no! We're unable to fetch the Hero`);
    });
};

const getOrdersCallback = function(
  heroId: number,
  callback: Callback<Order[]>,
  callbackError?: CallbackError,
) {
  const url = heroId ? `${apiUrl}/orders/${heroId}` : `${apiUrl}/orders`;
  axios
    .get(url)
    .then((response: AxiosResponse<Order[]>) => {
      const orders = parseList<Order>(response);
      callback(orders);
    })
    .catch((error: AxiosError) => {
      console.error(`Developer Error: Async Data Error: ${error.message}`);
      callbackError(`Oh no! We're unable to fetch the Orders`);
    });
};

const getAccountRepCallback = function(
  heroId: number,
  callback: Callback<AccountRepresentative>,
  callbackError?: CallbackError,
) {
  const url = `${apiUrl}/accountreps/${heroId}`;
  axios
    .get(url)
    .then((response: AxiosResponse<AccountRepresentative>) => {
      const list = parseList<AccountRepresentative>(response);
      const accountRep = list[0];
      callback(accountRep);
    })
    .catch((error: AxiosError) => {
      console.error(`Developer Error: Async Data Error: ${error.message}`);
      callbackError(`Oh no! We're unable to fetch the Account Rep`);
    });
};

/**
 * Promisified call
 **/
// Turning calback into promise.
function promisifiedCallback() {
  // Define a function
  const getHeroTreePromisified = (email: string) => {
    //create a promise
    return new Promise((resolve, reject) => {
      // call the callback function withinn
      getHeroTreeCallback(
        email,
        (hero: Hero) => resolve(hero), // Function type to resolve a positive response callback
        (msg?: string) => reject(msg), // Function type to reject a negative error callback
      );
    });
  };
  // Method invoke / entry point.
  getHeroTreePromisified('madelyn@acme.com').then(() => {
    console.log('next');
  });
}

export { getHeroTreeCallback, promisifiedCallback };
