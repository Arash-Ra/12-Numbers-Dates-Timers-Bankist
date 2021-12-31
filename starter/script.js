'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = (labelDate.textContent = `${day}/${month}/${year}`);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

// Fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(acc, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//
// Video 170
console.log(0.1 + 0.2);
// Convert string to Number in two ways:
// 1.
console.log(Number('23'));

//2.
console.log(+'23');

// Parsing
console.log(Number.parseInt('20px', 10));
console.log(Number.parseFloat('2.5rem'));
console.log(Number.isNaN('23'));
console.log(Number.isNaN(+'23'));
console.log(Number.isNaN('23x'));

// Checking if a value is a real number
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));

//// Video 171

// Square root
console.log(Math.sqrt(25));

console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max('25', 3, 5, 67, 2));
console.log(Math.min(25, 3, 5, 67, 2));

// calculating a circle surface
console.log(Math.PI * parseInt('10px') ** 2);

// Making randon munbers between [1 and 6]
// Way No.1
console.log(Math.floor(Math.random() * 6) + 1);

// Way No.1
console.log(Math.trunc(Math.random() * 6) + 1);

// Making random numbers between two numbers

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min + 1) + min);
console.log(randomInt(10, 20));

// trunc will remove the decimal part
console.log(Math.trunc(23.4));
// result: 23
console.log(Math.trunc(23.9));
// result: 23

// round will round the number
console.log(Math.round(23.4));
// result: 23

console.log(Math.round(23.9));
// result: 24

// ceil will round up
console.log(Math.ceil(23.4));
// result: 24

console.log(Math.ceil(23.9));
// result: 24

// floor will round down
console.log(Math.floor(23.4));
// result: 23

console.log(Math.floor(23.9));
// result: 23

// trunc and floor act differently with negative numbers
console.log(Math.trunc(-23.4)); // result: -23
console.log(Math.floor(-23.4));
console.log(Math.trunc(-23.4)); // result: -24

//Rounding decimals
console.log((26.4).toFixed(0));
// toFixed method returns string
console.log((26.43).toFixed(2));
console.log((26.43).toFixed(1));

////video 172
// Remainer numbers

console.log(5 % 2);
console.log(4 % 2);

console.log('Even numbers between 1-100');
for (let i = 0; i <= 100; i++) {
  if (i % 2 === 0) console.log(i);
}

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // every 2nd row will become in orangered background color
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    // every 3rd row will become in orangered background color

    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

//// video 173
// we can use underscore to use as a seperator to be able to read numbers
const diameter = 287_460_000_000;
console.log(diameter);

const price1 = 345_99;
const price2 = 15_00;

console.log(price1);
console.log(price2);
// we cannot use underscor before or after rge number , example 3._45 is not allowed

// we cannot use theunderscore seperator when we conver to a number
console.log(Number('230_000'));
// we will get error: NaN

// It will parse to a number only the 230 part
console.log(parseInt('230_000'));

//// Video 174
// Big interger
// Bigest number
console.log(Number.MAX_SAFE_INTEGER);
// result: 9007199254740991
console.log(2 ** 53 - 1);

// we use n at theend of Big numbers that javascript can show them acurately
console.log(978818391389138907662878123n);
// result: 978818391389138907662878123n

// ** we cannot operate Big int and regular numbers

// Division
console.log(10n / 3n);
// result: 3n
console.log(11n / 3n);
// result: 3n

//// video 175
// const now = new Date();
// console.log(now);
// //result: Tue Dec 28 2021 20:32:30 GMT-0500 (Eastern Standard Time)
// console.log(new Date('Tue Dec 28 2021 20:32'));
// //result: Tue Dec 28 2021 20:32:30 GMT-0500 (Eastern Standard Time)

// console.log(new Date(0));
// // 0 is milisecond after the start date in Javascript
// //result: Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)
// // that time is the start of time in Javascript

// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// //result: Sat Jan 03 1970 19:00:00 GMT-0500 (Eastern Standard Time)

// const future = new Date(2037, 10, 12, 19, 35, 21);
// console.log(future.getFullYear());
// // result: 2037
// console.log(future.getHours());
// // result: 19
// console.log(future.getMinutes());
// // result: 35
// console.log(future.getSeconds());

// console.log(future.getDate());
// // result: day -> 12
// console.log(future.getDay());
// //result: 4 -> 4th day of the week, it starts from sunday
// console.log(future);
// const bardiaBirth = new Date(2015, 10, 3, 10, 15, 3);
// console.log(bardiaBirth);

// console.log(Date.now());
// console.log(new Date(1640747109935));
// //result: Tue Dec 28 2021 22:05:09 GMT-0500 (Eastern Standard Time)

// future.setFullYear(2025);
// console.log(future);
