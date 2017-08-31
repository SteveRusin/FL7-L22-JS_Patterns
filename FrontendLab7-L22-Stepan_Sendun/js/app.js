function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


function User(name) {
    this.name = name;
    // set random date and random value for some properties
    this.lastVisitDate = randomDate(new Date(2016, 0, 1), new Date());
    this.globalDiscount = parseInt(Math.random()*20, 10);
    this.nightDiscount = parseInt(Math.random()*20, 10);
    this.weekendDiscount = parseInt(Math.random()*20, 10);
    this.ordersCount = parseInt(Math.random()*20, 10);
    this.ordersTotalPrice = parseInt(Math.random()*1000, 10);
    this.bonus = 0;
}

User.prototype = {
    constructor: User
}


function DiscountDecorator(user) {
    for (var key of Object.keys(user)) {
        this[key] = user[key];
    }

    this.getDiscount = function () {
        let totalDiscount = this.globalDiscount;
        if (this.lastVisitDate.getDay() === 0 || this.lastVisitDate.getDay() === 6) {
            totalDiscount += this.weekendDiscount;
        }
        if (this.lastVisitDate.getHours() >= 23 || this.lastVisitDate.getHours() <= 5) {
            totalDiscount += this.nightDiscount;
        }
        return `${this.name}'s discount is ${totalDiscount}%`;
    };

}

DiscountDecorator.prototype = {
    constructor: DiscountDecorator
}


function BonusDecorator(user) {
    let daysOfAbsence;
    for (var key of Object.keys(user)) {
        this[key] = user[key]
    }

    this.getBonus = function () {
        daysOfAbsence = parseInt((((new Date).getTime() - this.lastVisitDate.getTime()) / 1000 / 60 / 60 / 24), 10);
        if (daysOfAbsence < 10) {
            this.bonus += 240 - daysOfAbsence * 24;
        }
        this.bonus += this.ordersCount;
        
        return `${this.name}'s bonus is ${this.bonus}`
    };
}

BonusDecorator.prototype = {
    constructor: BonusDecorator
}

// invocation example

let user1 = new BonusDecorator(new DiscountDecorator(new User('Ivan')));
let user2 = new DiscountDecorator(new BonusDecorator(new User('Zeka')));


let container = document.getElementById('container');

container.innerHTML += `<p>${user1.getBonus()} | user 1</p>`;
container.innerHTML += `<p>${user1.getDiscount()} | user 1</p>`;

container.innerHTML += `<p>${user2.getBonus()} | user 2</p> `;
container.innerHTML += `<p>${user2.getDiscount()} | user 2</p>`;


// Or logged result in console
console.log(user1.getBonus() + ' |user 1');
console.log(user1.getDiscount() + ' |user 1');

console.log(user2.getBonus() + ' |user 2');
console.log(user2.getDiscount() + ' |user 2');
