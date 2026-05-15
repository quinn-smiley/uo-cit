const {Monster, Player, monsterList} = require('./p5-class')

function initializePlayer(playerName) {
    return new Player(playerName, 100, 10);
}


function getMonster(index) {
    if (index < 1 || index > monsterList.length) {
        return null;
    }
    return monsterList[index];
}


function handleFight(player, monster) {
    if (!monster.isAlive()) {
        return { message: `${monster.name} is already defeated.` };
    }

    player.hit(monster);

    let result = {
        message: `${player.name} hits ${monster.name} for ${player.damage} damage!`,
        monsterHealth: monster.health,
        status: monster.status(),
    };

    if (!monster.isAlive()) {
        result.defeated = true;
        result.status = `${monster.name} has been defeated!`;
    }

    return result;
}

function listMonsterNames() {
    return monsterList.map(monster => monster.name);
}

module.exports = {initializePlayer, getMonster, handleFight, listMonsterNames}