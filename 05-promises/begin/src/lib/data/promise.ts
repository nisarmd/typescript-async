import axios, { AxiosResponse, AxiosError } from 'axios';
import { heroes } from '../../examples/heroes';

import { Order, Hero, AccountRepresentative } from '../interfaces';
import { apiUrl, parseList } from './config';

/**
 * Get the hero and his/her related orders and account rep
 * using promises
 */
const getHeroTreePromise = function(searchEmail: string) {
  // TODO
  let hero: Hero;
  return getHeroPromise(searchEmail)
    .then((h: Hero) => {
      hero = h;
      return h; // ## Must return Hero so that next .then() can use it!
    })
    .then((hero: Hero) => {
      return Promise.all([  // Promise.all() to call multiple promises
        getOrdersPromise(hero.id),
        getAccountRepPromise(hero.id),
      ]);
    })
    .then((result: [Order[], AccountRepresentative]) => mergeData(result));

  function mergeData(results: [Order[], AccountRepresentative]): Hero {
    const [orders, accontRep] = results;
    if (orders) {
      hero.orders = orders;
    }
    if (accontRep) {
      hero.accountRep = accontRep;
    }
    return hero;
  }
};

/**
 * Get the hero
 */
const getHeroPromise = (email: string): Promise<Hero> => {
  // TODO
  return axios
    .get<Hero[]>(`${apiUrl}/heroes?email=${email}`)
    .then((response: AxiosResponse<Hero[]>) => {
      const data = parseList<Hero>(response);
      const hero = data[0];
      return hero;
    })
    .catch((error: AxiosError) => handleAxiosErrors(error, 'Hero'));
};

/**
 * Get the hero's orders
 */
const getOrdersPromise = function(heroId: number) {
  // TODO
  return axios
    .get<Order[]>(`${apiUrl}/orders/${heroId}`)
    .then((response: AxiosResponse<Order[]>) => {
      const data = parseList(response);
      const order = data[0];
      return order;
    })
    .catch((error: AxiosError) => {
      handleAxiosErrors(error, 'Orders');
    });
};

/**
 * Get the hero's account rep
 */
const getAccountRepPromise = function(heroId: number) {
  // TODO
  return axios
    .get<AccountRepresentative>(`${apiUrl}/accountreps/${heroId}`)
    .then((response: AxiosResponse<AccountRepresentative>) => {
      return parseList(response)[0];
    })
    .catch((error: AxiosError) => {
      handleAxiosErrors(error, 'AccountRepresentative');
    });
};

export { getHeroTreePromise };

function handleAxiosErrors(error: AxiosError, model: string): Promise<never> {
  console.error(`Developer Error: Async Data Error: ${error.message}`);
  return Promise.reject(`Oh no! We're unable to fetch the model ${model}`);
}
