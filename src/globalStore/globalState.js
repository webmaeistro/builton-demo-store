import { setGlobal, resetGlobal, addReducer, getDispatch } from 'reactn';
import {
  clearFieldCurry,
  getFieldCurry,
  setFieldCurry,
  clearAllFields
} from './localStorage';

let INITIALIZED = false;

const DEFAULT_CHECKOUT = {
  0: {
    title: 'bag',
    complete: false,
  },
  1: {
    title: 'authentication',
    complete: false,
  },
  2: {
    title: 'payment_method',
    complete: false,
  },
  3: {
    title: 'delivery_address',
    complete: false,
  },
  4: {
    title: 'confirm',
    complete: false,
  }
};

const DEFAULT_ORDER = {
  items: [],
  delivery_address: '',
  payment_method: '',
};

const clearUser = clearFieldCurry('user');
const getUser = getFieldCurry('user');
const setUser = setFieldCurry('user');

const clearBuiltonSession = clearFieldCurry('builtonSession');
const getBuiltonSession = getFieldCurry('builtonSession');
const setBuiltonSession = setFieldCurry('builtonSession');

const clearBag = clearFieldCurry('bag');
const getBag = getFieldCurry('bag');
const setBag = setFieldCurry('bag');

const clearCheckout = clearFieldCurry('checkout');
const getCheckout = getFieldCurry('checkout');
const setCheckout = setFieldCurry('checkout');

const clearOrder = clearFieldCurry('order');
const getOrder = getFieldCurry('order');
const setOrder = setFieldCurry('order');

addReducer('updateUser', (global, dispatch, user, setLocalStorage = true) => {
  if (setLocalStorage) {
    setUser(user);
  }
  return {
    user
  };
});

addReducer('addItemToBag', (global, dispatch, item) => {
  setBag([...(getBag() || []), item]);
  return {
    bag: [...(getBag() || [])]
  }
});

addReducer('clearBag', (global, dispatch) => {
  setBag(null);
  return {
    bag: null
  }
});

addReducer('updateCheckoutStep', (global, dispatch, checkout) => {
  setCheckout(checkout);
  return {
    checkout
  }
});

addReducer('updateOrder', (global, dispatch, order) => {
  setOrder(order);
  return {
    order
  }
});

addReducer('updatePaymentMethod', (global, dispatch, paymentMethod) => {
  return {
    paymentMethod
  }
});

addReducer('updateBuiltonSession', (global, dispatch, builtonSession , setLocalStorage = true) => {
  if (setLocalStorage) {
    setBuiltonSession(builtonSession);
  }
  return {
    builtonSession
  };
});

addReducer('removeItemFromBag', (global, dispatch, itemId) => {
  const bag = getBag();
  for (let i = 0; i < bag.length; i += 1) {
    if (bag[i].size._id.$oid === itemId) {
      bag.splice(i, 1);
      break;
    }
  }
  setBag(bag);
  return {
    bag
  }
});

addReducer('clearCheckout', async (global, dispatch) => {
  await dispatch.updateOrder(DEFAULT_ORDER);
  await dispatch.updatePaymentMethod(null);
  await dispatch.updateCheckoutStep(DEFAULT_CHECKOUT);
});

addReducer('logout', async (global, dispatch) => {
  await dispatch.updateUser(null, false);
  await dispatch.updateBuiltonSession(null, false);
  await dispatch.updateOrder(DEFAULT_ORDER);
  await dispatch.updatePaymentMethod(null);
  await dispatch.clearCheckout();
});

export default {
  init: () => {
    if (INITIALIZED) {
      console.log('Authentication already initialized');
      return;
    }

    let data = {
        user: null,
        builtonSession: null,
        bag: null,
        order: DEFAULT_ORDER,
        paymentMethod: null,
        checkout: DEFAULT_CHECKOUT
      };

    try {
      data = {
        user: getUser(),
        builtonSession: getBuiltonSession(),
        bag: getBag(),
        checkout: getCheckout() || DEFAULT_CHECKOUT,
        order: getOrder() || DEFAULT_ORDER,
        paymentMethod: null,
      };
    } catch (err) {
      clearUser();
      clearBuiltonSession();
      clearBag();
    }

    // Setting values in global store
    setGlobal(data);

    INITIALIZED = true;
  },
  updateSession: (session) => {
    setBuiltonSession(session)
  },
  clear: () => {
    clearAllFields();
    resetGlobal();
  },
  logout: async () => {
    clearUser();
    clearBuiltonSession();
    clearOrder();
    clearCheckout();
    await getDispatch().logout();


    INITIALIZED = false;
  }
};
