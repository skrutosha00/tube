import { setBalanceField, randElem, randInt, shuffle, changeBalance, animateOnce } from "./functions.js";

setBalanceField()

let balance = document.querySelector('.balance')
let balanceBot = document.querySelector('.bot_balance')
let warning = document.querySelector('.warning')

let active = true
let chosen = []
let botChosen = []

document.querySelector('.name').innerHTML = generateName()
balanceBot.innerHTML = randInt(6, 18) * 1000

for (let i = 0; i < 5; i++) {
    let betInfo = document.createElement('div')
    betInfo.classList.add('bet_info')

    let bet = document.createElement('div')
    bet.innerHTML = 250 + i * 100

    let num = document.createElement('div')
    num.innerHTML = i == 4 ? 10 : i + 1

    let span = document.createElement('div')
    span.innerHTML = 'BET'

    betInfo.append(bet, num, span)
    document.querySelector('.bet_info_cont').appendChild(betInfo)
}

for (let i = 0; i < 80; i++) {
    let cell = document.createElement('div')
    cell.classList.add('cell', 'block')
    cell.innerHTML = cell.dataset.num = i + 1

    cell.onclick = () => {
        if (!active) { return }

        if (!(chosen.includes(cell.innerHTML))) {
            if (chosen.length != 10) {
                cell.classList.add('chosen')
                chosen.push(cell.innerHTML)
            }
        } else {
            cell.classList.remove('chosen')
            chosen.splice(chosen.indexOf(cell.innerHTML), 1)
        }

        updateIndicators()
    }

    document.querySelector('.field').appendChild(cell)
}

for (let i = 0; i < 10; i++) {
    let indicator = document.createElement('div')
    indicator.classList.add('indicator', 'block')
    indicator.dataset.num = indicator.innerHTML = i + 1

    document.querySelector('.indicator_cont').appendChild(indicator)
}

document.querySelector('.play.main').onclick = () => {
    if (!active || !chosen.length) { return }
    active = false

    let bet = chosen.length >= 5 ? 650 : 100 + chosen.length * 100
    changeBalance(-bet)
    balanceBot.innerHTML = Number(balanceBot.innerHTML) - bet

    let numList = shuffle(Array.from({ length: 80 }, (v, i) => String(i + 1)))

    for (let i = 0; i < chosen.length; i++) {
        document.querySelector('.cell[data-num="' + numList[i] + '"]').classList.add('bot_chosen')
        botChosen.push(numList[i])
    }

    setTimeout(() => {
        let winList = shuffle(Array.from({ length: 80 }, (v, i) => String(i + 1))).slice(0, chosen.length)
        let circleNum = 0

        let ballInterval = setInterval(() => {
            let ball = document.createElement('ball')
            ball.classList.add('ball', 'block')
            ball.innerHTML = winList[circleNum]

            document.querySelector('.circle_cont').appendChild(ball)
            circleNum++

            setTimeout(() => {
                ball.style.left = 10 + (80 / chosen.length) / 2 + (80 / chosen.length) * (circleNum - 1) + '%'
            }, 100);

            if (circleNum == chosen.length) {
                clearInterval(ballInterval)
            }
        }, 500);

        setTimeout(() => {
            let win = countCommon(botChosen, winList) == countCommon(chosen, winList) ? 0 : (countCommon(botChosen, winList) < countCommon(chosen, winList) ? 1 : -1)

            if (win == 0) {
                warning.querySelector('.text').innerHTML = 'It is a draw!!<br>Both you and opponent receive your bets'
            } else {
                warning.querySelector('.text').innerHTML = (win == 1 ? 'Congrats!!' : 'No way!!') + '<br>Your score is ' + countCommon(chosen, winList) + '<br>Opponent\'s score is ' + countCommon(botChosen, winList)
            }

            if (win == 0) {
                warning.querySelector('.text').innerHTML = 'It is a draw!!<br>Both you and opponent receive your bets'
                changeBalance(bet)
                balanceBot.innerHTML = Number(balanceBot.innerHTML) + bet
            } else if (win == 1) {
                warning.querySelector('.text').innerHTML = 'Congrats!!<br>Your score is ' + countCommon(chosen, winList) + '<br>Opponent\'s score is ' + countCommon(botChosen, winList)
                changeBalance(bet * 2)
                animateOnce('.balance')
            } else {
                balanceBot.innerHTML = Number(balanceBot.innerHTML) + bet * 2
            }

            warning.style.left = '50%'
        }, chosen.length * 500 + 1500);

    }, 500);
}

document.querySelector('.play.minor').onclick = () => {
    warning.style.left = '-50%'

    for (let ball of document.querySelectorAll('.ball')) {
        ball.style.left = 0
        setTimeout(() => {
            ball.remove()
        }, 600);
    }

    clearField()

    setTimeout(() => {
        active = true
    }, 600);
}

document.querySelector('.random').onclick = () => {
    if (!active) { return }

    clearField()
    let numList = shuffle(Array.from({ length: 80 }, (v, i) => String(i + 1)))

    for (let i = 0; i < 10; i++) {
        document.querySelector('.cell[data-num="' + numList[i] + '"]').classList.add('chosen')
        chosen.push(numList[i])
    }

    updateIndicators()
}

document.querySelector('.cross').onclick = () => {
    if (!active) { return }
    clearField()
}

document.querySelector('.auto').onclick = () => {
    if (!active) { return }
    let count = 0

    document.querySelector('.random').click()
    document.querySelector('.play.main').click()
    count++

    setTimeout(() => {
        document.querySelector('.play.minor').click()
    }, 10000);

    let autoInterval = setInterval(() => {
        document.querySelector('.random').click()
        document.querySelector('.play.main').click()
        count++
        setTimeout(() => {
            document.querySelector('.play.minor').click()

            if (count == 4) { clearInterval(autoInterval) }

        }, 8000);
    }, 12000);
}

function updateIndicators() {
    for (let i = 0; i < 10; i++) {
        if ((i + 1) <= chosen.length) {
            document.querySelector('.indicator[data-num="' + (i + 1) + '"]').classList.add('active')
        } else {
            document.querySelector('.indicator[data-num="' + (i + 1) + '"]').classList.remove('active')
        }
    }
}

function clearField() {
    for (let cell of document.querySelectorAll('.cell')) {
        cell.classList.remove('chosen', 'bot_chosen')
    }

    chosen = []
    botChosen = []
    updateIndicators()
}

function generateName() {
    let friendNicks = ['Rich', 'Bob', 'Maria', 'Kira', 'Milky', 'Mike', 'Nick', 'Player', 'Paul', 'Rick', 'Alex', 'Marta', 'Mellon', 'Baddy', 'Ultra', 'Kira', 'Kim', 'Cat', 'Joker', 'Bat', 'Loo', 'SoSo', 'Lena', 'Angel', 'Devil', 'Nice', 'Megan', 'Boy', 'Lara', 'Lara', 'Lora', 'Jack', 'John', 'Bobby']
    let friendNick = randElem(friendNicks)

    friendNick += randElem(['@', '_', '__', '--', '-', '0'])
    friendNick += randInt(0, 99)

    return friendNick
}

function countCommon(arr1, arr2) {
    let res = 0
    for (let elem of arr1) {
        if (arr2.includes(elem)) {
            res += 1
        }
    }

    return res
}