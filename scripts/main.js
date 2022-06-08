import { setBalanceField } from './functions.js'

if (!localStorage.getItem('balance_tube')) {
    localStorage.setItem('balance_tube', 10000)
}

setBalanceField()