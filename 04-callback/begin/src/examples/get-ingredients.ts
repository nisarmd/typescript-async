import { ingredients } from './ingredients';

/**
 * TODO
 * Wait for a delay, get the ingredients,
 * then pass them in a callback function
 */

const getIngredients = async function() {
    return await ingredients;
}

export function getDataAfterDelay(
    delayMs: number, callback: (data: string[]) => void) {
    setTimeout(() =>{
        const data = ingredients;
        callback(data);
    }, delayMs);
}