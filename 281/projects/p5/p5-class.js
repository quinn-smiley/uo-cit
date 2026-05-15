class Monster {
    constructor(name, health, damage, type){
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.type = type;
    }
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        console.log(`${this.name} takes ${amount} damage! Health now: ${this.health}`);
    }

    isAlive() {
        return this.health > 0;
    }
        
    status() {
        if (this.isAlive()) {
            return `${this.name} has ${this.health} health remaining.`;
        } else {
            return `${this.name} has been defeated.`;
        }
    }

    hit(target) {
        if (!target.isAlive()) {
            console.log(`${target.name} is already defeated.`);
            return;
        }

        console.log(`${this.name} hits ${target.name} for ${this.damage} damage!`);
        target.takeDamage(this.damage);
        console.log(target.status());
    }
}

class Player {
    constructor(name, health, damage){
        this.name = name;
        this.health = health;
        this.damage = damage;
    }

    isAlive() {
        return this.health > 0;
    }

    status() {
        if (this.isAlive()) {
            return `${this.name} has ${this.health} health remaining.`;
        } else {
            return `Game Over`;
        }
    }

    hit(target) {
        if (!target.isAlive()) {
            console.log(`${target.name} is already defeated.`);
            return;
        }

        console.log(`${this.name} hits ${target.name} for ${this.damage} damage!`);
        target.takeDamage(this.damage);
        console.log(target.status());
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        console.log(`${this.name} takes ${amount} damage! Health now: ${this.health}`);
    }
}

const monsterList = [
        new Monster('Gary', 100, 10, 'Gargoyle'),
        new Monster('Harold', 100, 10, 'Squid-monster'),
        new Monster('Yuri', 100, 10, 'Yeti')
    ];

module.exports = {Monster, Player, monsterList}