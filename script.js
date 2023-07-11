
'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP


// Data
const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111,
	movementsDates: [
		'2023-02-18T21:31:17.178Z',
		'2019-12-23T07:42:02.383Z',
		'2023-02-12T09:15:04.904Z',
		'2020-04-01T10:17:24.185Z',
		'2023-02-16T14:11:59.604Z',
		'2020-05-27T17:01:17.194Z',
		'2020-07-11T23:36:17.929Z',
		'2023-02-18T10:51:36.790Z',
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
		'2023-02-18T09:48:16.867Z',
		'2019-12-25T06:04:23.907Z',
		'2020-01-25T14:18:46.235Z',
		'2023-02-16T16:33:06.386Z',
		'2020-04-10T14:43:26.374Z',
		'2020-04-25T18:49:59.371Z',
		'2023-02-18T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-US',
};

const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
	movementsDates: [
		'2019-11-18T21:31:17.178Z',
		'2023-02-17T07:42:02.383Z',
		'2020-01-28T09:15:04.904Z',
		'2023-02-18T10:17:24.185Z',
		'2020-05-08T14:11:59.604Z',
		'2020-05-27T17:01:17.194Z',
		'2020-07-11T23:36:17.929Z',
		'2023-02-15T10:51:36.790Z',
	],
	currency: 'EUR',
	locale: 'pt-PT', // de-DE
};

const account4 = {
	owner: 'Sarah Smith',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
	movementsDates: [
		'2019-11-01T13:15:33.035Z',
		'2023-02-15T09:48:16.867Z',
		'2023-02-18T06:04:23.907Z',
		'2023-02-20T14:18:46.235Z',
		'2020-01-05T16:33:06.386Z',
		// '2020-04-10T14:43:26.374Z',
		// '2020-06-25T18:49:59.371Z',
		// '2020-07-26T12:01:20.894Z',
	],
	currency: 'USD',
	locale: 'en-GB',
};

const accounts = [account1, account2, account3, account4];

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
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
// 	['USD', 'United States dollar'],
// 	['EUR', 'Euro'],
// 	['GBP', 'Pound sterling'],
// ]);

// fake always logged in 

const dateNotice = function (displayDate, locale) {

	const displayNewDate = new Intl.DateTimeFormat(locale).format(displayDate);
	// const currentDay = `${displayDate.getDate()}`.padStart(2, 0);
	// const currentMonth = `${displayDate.getMonth() + 1}`.padStart(2, 0);
	// const currentYear = displayDate.getFullYear();
	// const currentHour = `${displayDate.getHours()}`.padStart(2, 0);
	// const currentMin = `${displayDate.getMinutes()}`.padStart(2, 0);

	const calcDayPassed = (data1, date2) => Math.round(Math.abs(date2 - data1) / (1000 * 60 * 60 * 24));
	const daysPassed = calcDayPassed(new Date(), displayDate);

	if (daysPassed === 0) return 'TODAY';
	else if (daysPassed === 1) return 'YEASTERDAY';
	else if (daysPassed < 7) return `${daysPassed} AGO`;
	else {
		// console.log(daysPassed);
		return displayNewDate;
	}

}


const IntlApi = function (acc, value) {
	const option = {
		style: 'currency',
		currency: acc.currency,
	};

	const payment = new Intl.NumberFormat(acc.locale, option).format(value);
	return payment;
}

const displayMovements = function (account, sort = false) {

	const option = {
		style: 'currency',
		currency: account.currency,
	}

	containerMovements.innerHTML = '';

	const movsSort = sort ? account.movements.slice()
		.sort((a, b) => a - b) : account.movements;

	movsSort.forEach(function (movement, index) {
		const type = movement > 0 ? 'deposit' : 'withdrawal';

		const displayDate = new Date(account.movementsDates[index]);
		// const currenciesIntl = IntlApi(account, movement);

		const currenciesIntl = new Intl.NumberFormat(account.locale, option).format(movement);

		const html = `
		<div class="movements__row">
			<div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
			<div class="movements__date">${dateNotice(displayDate, movement.locale)}</div>
			<div class="movements__value">${currenciesIntl}</div>
		</div>
		`;
		containerMovements.insertAdjacentHTML('afterbegin', html)
	})

}

const calcdisplaySummary = function (accounts) {

	const income = accounts.movements
		.filter((mov) => {
			return mov > 0;
		})
		.reduce((acc, mov) => {
			return acc + mov;
		}, 0);
	const outcome = accounts.movements
		.filter((mov) => {
			return mov < 0;
		})
		.reduce((acc, mov) => {
			return acc + mov;
		}, 0);

	const interest = accounts.movements
		.filter((mov) => {
			return mov > 0;
		})
		.map((dep) => {
			return dep * accounts.interestRate / 100;
		})
		.filter((int, i, arr) => {
			return int >= 1;
		})
		.reduce((acc, int) => {
			return acc + int;
		}, 0)

	const paymentIncomeIntl = IntlApi(accounts, income);
	const paymentOutcomeIntl = IntlApi(accounts, outcome);
	const paymentInterestIntl = IntlApi(accounts, interest);
	// const paymentIncomeIntl = new Intl.NumberFormat(accounts.locale, option).format(income);
	// const paymentOutcomeIntl = new Intl.NumberFormat(accounts.locale, option).format(outcome);
	labelSumInterest.textContent = `${paymentInterestIntl}`;
	labelSumIn.textContent = `${paymentIncomeIntl}`;
	labelSumOut.textContent = `${paymentOutcomeIntl}`;
}



// currencies.forEach(function (value, key, map) {
// 	console.log(map);
// 	console.log(`the value is ${ value } with key is ${ key } `)
// })


// for (const movement of movements) {
// 	if (movement > 0) {
// 		console.log(`yo deposited ${ movement } `)
// 	}
// 	else {
// 		console.log(`you withdraw ${ Math.abs(movement) } `)
// 	};
// }
// console.log(`\n`);


// movements.forEach((function (movement, i, array) {
// 	console.log(array);
// 	if (movement > 0) {
// 		console.log(`yo deposited ${ movement } which is at index ${ i } `)
// 	}
// 	else {
// 		console.log(`you withdraw ${ Math.abs(movement) } which is at index ${ i } `)
// 	};
// }));
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const euroToUsd = 1.1;


// const movementToUsd = movements.map(function (move, index, map) {
// 	// console.log(map);
// 	// console.log(`you have ${ move } having index ${ index } `);
// 	return move * euroToUsd;
// });

// console.log(movementToUsd);

// const movementToUsd = movements.map((moves) => {
// 	return moves * euroToUsd;
// });
// console.log(movementToUsd);
// const user = 'steven Thomas Williams';


const createUserName = function (accountArg) {

	accountArg.forEach(function (user) {
		user.userName = user.owner
			.toLowerCase().split(' ').map(function (userMember, i) {
				// console.log(`the user name is ${ userMember } and it's index is ${i + 1}`);
				return userMember[0];
			}).join('');
	})
	// return accountArg.owner;
};
createUserName(accounts);
// console.log(accounts);


const calcPrintBalance = function (acc) {
	const option = {
		style: 'currency',
		currency: acc.currency,
	}

	acc.balance = acc.movements.reduce(function (acc, mov) {
		return acc + mov;
	}, 0);

	const balanceIntl = IntlApi(acc, acc.balance)
	// const balanceIntl = new Intl.NumberFormat(acc.locale, option).format(acc.balance);
	labelBalance.textContent = `${balanceIntl}`;
}



// maximum value calculation

// const max = function (movements) {
// 	const currentMax = movements.reduce(function (acc, mov, i) {
// 		if (acc > mov) {
// 			currentMax = mov;
// 		}

// 	}, movements[0])
// 	return currentMax;
// };
// console.log(max(account1.movements));


// const totalDepositeUSD = function (moves) {
// 	// console.log(moves)
// 	const total = moves
// 		.filter(mov => {
// 			return mov > 0;
// 		})
// 		.map(mov => {
// 			return mov * euroToUsd;
// 		})
// 		.reduce((acc, mov) => {
// 			return acc + mov;
// 		}, 0);
// 	console.log(total);
// }
// totalDepositeUSD(movements);


//challange
// const calcAverageAge = function (ages) {
// 	const humanAge = ages.map(age => {
// 		return age <= 2 ? 2 * 2 : 16 + age * 4
// 	}
// 	)
// 	const adult = humanAge.filter(age => {
// 		return age >= 18;
// 	})
// 	const average = adult.reduce((acc, age, i, arr) => {
// 		return (acc + age) / arr.length
// 	}, 0);

// 	return average;
// }
// const result = calcAverageAge([5, 2, 4, 1, 15, 8, 3]);
// console.log(result);


// find method
// const fintMethod = accounts.find(mov => {
// 	return mov.userName === 'js';
// })
// console.log(accounts);
// console.log(fintMethod);

function updateUI(currentAcc) {
	calcPrintBalance(currentAcc);
	displayMovements(currentAcc);
	calcdisplaySummary(currentAcc);
}


//logout time
const logOutTimer = function () {
	let time = 120;
	const timer = setInterval(function () {
		const min = String(Math.trunc(time / 60)).padStart(2, 0);
		const sec = String(time % 60).padStart(2, 0);

		labelTimer.textContent = `${min}:${sec}`;
		if (time === 0) {
			clearInterval(timer);

			containerApp.style.opacity = 0;
			labelWelcome.textContent = 'log in to get started';
		}
		time--;

	}, 1000)
	return timer;
}


let timer;
// login feature
btnLogin.addEventListener('click', function (e) {
	e.preventDefault();

	const currentAcc = accounts.find((acc) => {
		// console.log(currentAcc);
		return acc.userName === inputLoginUsername.value;
	});

	//dates
	const now = new Date();
	const option = {
		hour: 'numeric',
		minute: 'numeric',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}
	// const locale = navigator.language;
	// console.log(locale);
	labelDate.textContent = new Intl.DateTimeFormat(currentAcc.locale, option).format(now);
	// console.log(now);
	// const day = `${now.getDate()}`.padStart(2, 0);
	// const month = `${now.getMonth() + 1}`.padStart(2, 0);
	// const year = now.getFullYear();
	// const hour = `${now.getHours()}`.padStart(2, 0);
	// const min = `${now.getMinutes()}`.padStart(2, 0);
	// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

	if (currentAcc?.pin === Number(inputLoginPin.value)) {
		labelWelcome.textContent = `Welcome Back, ${currentAcc.owner.split(' ')[0]}`;
		containerApp.style.opacity = 100;
		// clearing the acc name and it's value;
		inputLoginUsername.value = '';
		inputLoginPin.value = '';
		inputLoginPin.blur();
		updateUI(currentAcc)

	}
	// console.log(accounts);

	btnTransfer.addEventListener('click', function (e) {
		e.preventDefault();

		const amount = Number(inputTransferAmount.value);
		const reciverAcc = accounts.find((acc) => {
			return acc.userName === inputTransferTo.value
		})
		// console.log(amount, reciverAcc);

		if (amount > 0 &&
			reciverAcc &&
			currentAcc.balance >= amount &&
			reciverAcc?.userName !== currentAcc.userName) {
			let date = new Date();
			currentAcc.movements.push(-amount);
			currentAcc.movementsDates.push(date)
			reciverAcc.movements.push(amount);
			reciverAcc.movementsDates.push(date);

			updateUI(currentAcc)
			inputTransferTo.value = '';
			inputTransferAmount.value = '';

			// add timer
			clearInterval(timer);
			timer = logOutTimer();
		};
	});

	//btn loan to accout 
	btnLoan.addEventListener('click', function (e) {
		e.preventDefault();
		const loanAmount = Math.floor(inputLoanAmount.value);
		if (loanAmount > 0 && currentAcc.movements.some(mov =>
			mov >= loanAmount / 10)) {
			currentAcc.movements.push(loanAmount);
			currentAcc.movementsDates.push(new Date());
			updateUI(currentAcc)
		}
		inputLoanAmount.value = '';

		clearInterval(timer);
		timer = logOutTimer();
	});

	// btn close the account
	btnClose.addEventListener('click', function (e) {
		e.preventDefault();

		if (currentAcc.userName === inputCloseUsername.value && currentAcc.pin === Number(inputClosePin.value)) {
			const index = accounts.findIndex((acc) => {
				return acc.userName === currentAcc.userName;
			})
			accounts.splice(index, 1);

			containerApp.style.opacity = 0;
		}
		inputCloseUsername.value = inputClosePin.value = '';
	})

	// sorting account
	let sorted = false
	btnSort.addEventListener('click', function (e) {
		e.preventDefault();
		displayMovements(currentAcc.movements, !sorted);
		sorted = !sorted;
		// updateUI();
	})
	if (timer) clearInterval(timer);
	timer = logOutTimer();
});


// const deposite = mov => mov > 0;
// console.log(movements.some(deposite));
// console.log(movements.filter(deposite));
// console.log(movements.every(deposite));

// const bankDepositeSum = accounts
// 	.map(acc => acc.movements)
// 	.flat()
// 	.filter(acc => acc > 0)
// 	.reduce((acc, el) => acc + el, 0);

// console.log(bankDepositeSum)
// // bankDepositeSum.flat();

// const numDeposite100 = accounts.map(acc => acc.movements)
// 	.flat()
// 	.filter(el => el > 1000)
// 	.length;

// const numDeposite100 = accounts.map(acc => acc.movements)
// 	.flat()
// 	.reduce((acc, el) => {
// 		// console.log(el);
// 		return el >= 1000 ? ++acc : acc
// 	}, 0);

// console.log(numDeposite100);

//reduce method
// const { deposite, withdrawl } = accounts.map(acc => acc.movements)
// 	.flat()
// 	.reduce((acc, el) => {
// 		el > 0 ? (acc.deposite += el) : (acc.withdrawl += el);
// 		return acc;
// 	}, { deposite: 0, withdrawl: 0 })

// console.log(deposite, withdrawl);

// const covertString = function (title) {
// 	const exception = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'the'];
// 	const titleCase = title.toLowerCase()
// 		.split(' ')
// 		.map(words =>
// 			exception.includes(words) ? words :
// 				words[0].toUpperCase() + words.slice(1));
// 	return titleCase.join(' ');
// }

// console.log(covertString('this is a nice title'));

// const dogs = [
// 	{
// 		weight: 22,
// 		curfood: 250,
// 		owners: ['alice', 'bob'],
// 	},
// 	{
// 		weight: 8,
// 		curfood: 200,
// 		owners: ['matilda', 'john'],
// 	},
// 	{
// 		weight: 13,
// 		curfood: 275,
// 		owners: ['sarah', 'john'],
// 	},
// 	{
// 		weight: 32,
// 		curfood: 340,
// 		owners: ['micheal'],
// 	}
// ]

// dogs.forEach(dog => {
// 	return dog.recfood = Math.trunc(dog.weight ** 0.75 * 28)
// });


// const dogSarah = dogs.find(dog => {
// 	return dog.owners.includes('sarah');
// })

// console.log(dogSarah);


// const dogsEatToMuch = dogs.filter(dog => {
// 	return dog.curfood > dog.recfood
// }).map(owner => {
// 	return owner.owners;
// }).flat();

// console.log(dogsEatToMuch);

// const dogSorted = dogs.slice()
// 	.sort((a, b) => a.curfood - b.curfood);
// console.log(dogSorted)

//Number dates
// console.log(Number('23'));

// labelBalance.addEventListener('click', function () {
// 	document.querySelectorAll('.movements__row')
// 		.forEach(function (row, i) {
// 			if (i % 2 !== 0) {
// 				row.style.backgroundColor = 'whitesmoke';
// 			}
// 		})
// });

// const now = new Date();
// console.log(now);
// console.log(new Date('decemeber 2022'));

