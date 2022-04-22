import { heroes } from './heroes';
import { Hero } from '../lib';

/**
 * Return a fulfilled promise after a given delay.
 */
const delay: (ms: number) => Promise<void> = (ms: number) =>
  new Promise<void>(res => setTimeout(res, ms)); // delaying by ms seconds

/* function delayFn(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
}
delay = delayFn; */

/**
 * Return a fulfilled promise of heroes
 */
const getHeroesDelayedAsync: () => Promise<Hero[]> = () =>
  new Promise<Hero[]>(resolve => resolve(heroes)); // resolve a promise with heroes

const getHeroesDelayedAsyncByPromiseResolveShorter: () => Promise<
  Hero[]
> = () => Promise.resolve(heroes); // Short way of Promise resolve
/**
 * Return a fulfilled promise of empty array
 */
let getHeroesEmpty: () => Promise<[]> = () =>
  new Promise<[]>(resolve => resolve([]));

/**
 * Get the heroes via a Promise
 */
export const getHeroesViaPromise: () => Promise<Hero[]> = function() {
  return delay(1000).then(() => getHeroesDelayedAsync()); // delay by 1 sec and getHeroes
};

/**
 * Create and return a promise.
 * When invoked, it will settle
 * by either resolve or reject.
 */
export let getHeroesViaNewPromise: () => Promise<Hero[]> = function() {
  const newPromise = new Promise<Hero[]>((resolve, reject) => {
    // creating a promise
    return delay(1000) // delaying by 1 second
      .then(() => getHeroesDelayedAsync()) //calling getHeros
      .then((heroes: Hero[]) => {
        //receiving returned value of heroes
        if (heroes && heroes.length) {
          // checking the length and null for heroes
          resolve(heroes); // resolving the promise
        } else {
          reject(Error('Error in fetching heroes')); // rejecting the promise
        }
      });
  });
  return newPromise; // return promise
};

/**
 * Get the heroes,
 * except this always causes a Promise reject
 */
export let getHeroesViaPromiseReject: () => Promise<Hero[]> = function() {
  const rejectPromise = new Promise<Hero[]>((resolve, reject) => {
    return delay(1000)
      .then(() => getHeroesEmpty())
      .then((heroes: Hero[]) => {
        if (heroes && heroes.length) {
          resolve(heroes);
        } else {
          reject(Error('Error in fetching heroes'));
        }
      });
  });
  return rejectPromise;
};

/**
 * Get the heroes
 * Except this always causes a Promise to reject, too
 */
export let getHeroesViaPromiseRejectShorter: () => Promise<
  Hero[]
> = function() {
  const rejectPromise = () =>
    Promise.reject('Bad error occured getting the heroes'); //Declaring an arrow function
  return delay(1000).then(() => rejectPromise()); // rejecting the promise by invoking the arrow function.
};
