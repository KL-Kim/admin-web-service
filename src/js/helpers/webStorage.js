/**
 * WebStorage Utilities
 */

/**
* load state from localStorage
*/
export const loadFromStorage = (item) => {
  try {
    const serializedState = localStorage.getItem(item);
    if (serializedState === null) return null;
    return JSON.parse(serializedState);
  } catch(err) {
    return null;
  }
};

/**
* set state from localStorage
*/
export const saveToStorage = (item, state) => {
  const serializedState = JSON.stringify(state);
  localStorage.setItem(item, serializedState);
  return ;
};

/**
* remove state from localStorage
*/
export const removeFromStorage = (item) => {
  try {
    localStorage.removeItem(item);
  } catch(err) {
    return null;
  }
};
