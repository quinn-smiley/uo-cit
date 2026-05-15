const express = require('express');
const session = require('express-session');
const app = express();
const listenPort = 4000;
const listenIP = '127.0.0.1';

app.use(express.static('p5'));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-dev-secret',
    resave: false,
    saveUninitialized: false
}));

app.listen(listenPort, listenIP, () => {
    console.log(`Server is running on http://${listenIP}:${listenPort}`);
});

const {Monster, Player, monsterList} = require('./p5-class.js')
const {damage, initializePlayer, getMonster, handleFight, listMonsterNames} = require('./p5-game.js')

const players = [];

app.get('/monsters', (req, res) => {
    const monsterNames = listMonsterNames();
    res.status(200).json({
        monsters: monsterNames
    });
});

app.post('/pick', (req, res) => {
    const { playerName, monsterNumber } = req.body;

    if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
        return res.status(400).json({ error: 'Name is a required field' });
    }

    if (
        typeof monsterNumber !== 'number' ||
        monsterNumber < 1 ||
        monsterNumber > monsterList.length
    ) {
        return res.status(400).json({ error: 'Please pick a number between 1 and 3' });
    }

    const newPlayer = initializePlayer(playerName.trim());
    players.push(newPlayer);

    const selectedMonster = monsterList[monsterNumber - 1];

    req.session.playerName = newPlayer.name;
    req.session.selectedMonsterIndex = monsterNumber - 1;
    req.session.playerHealth = 100;

    res.status(200).json({
        name: newPlayer.name,
        success: `You picked monster #${monsterNumber}: ${selectedMonster.name}`,
    });
});


app.get('/initializeFight', (req, res) => {
    const { playerName, selectedMonsterIndex } = req.session;

    if (!playerName || selectedMonsterIndex === undefined) {
        return res.status(400).json({ error: 'No session data found' });
    }

    const monster = getMonster(selectedMonsterIndex);

    if (!monster || !playerName) {
        return res.status(404).json({ error: 'Fight not found' });
    }

    res.json({
        monster: {
            name: monster.name,
            health: monster.health,
            damage: monster.damage,
            type: monster.type,
        },
        player: initializePlayer(playerName),
        message: `${monster.name} is ready to fight ${playerName}`,
    });
});

app.post('/playerHit', (req, res) => {
    const { playerName, selectedMonsterIndex } = req.session;

    if (!playerName || selectedMonsterIndex === undefined) {
        return res.status(400).json({ error: 'Missing session data. Start the game first.' });
    }

    const monster = getMonster(selectedMonsterIndex);
    if (!monster) {
        return res.status(404).json({ error: 'Selected monster not found.' });
    }

    const player = initializePlayer(playerName);

    const fightResult = handleFight(player, monster);

    res.status(200).json(fightResult);
});

app.post('/monsterHit', (req, res) => {
    const { playerName, selectedMonsterIndex, playerHealth } = req.session;

    if (!playerName || selectedMonsterIndex === undefined) {
        return res.status(400).json({ error: 'Missing session data. Start the game first.' });
    }

    const monster = getMonster(selectedMonsterIndex);
    if (!monster || !monster.isAlive()) {
        return res.status(404).json({ error: 'Monster not found or already defeated.' });
    }

    const player = new Player(playerName, playerHealth ?? 100, 10);

    monster.hit(player);

    req.session.playerHealth = player.health;

    const defeated = !player.isAlive();
    const resultMessage = defeated
        ? `${monster.name} has defeated ${player.name}. Game Over.`
        : `${monster.name} hits ${player.name} for ${monster.damage} damage!`;

    res.status(200).json({
        message: resultMessage,
        playerHealth: player.health,
        status: player.status()
    });
});


app.get('/result', (req, res) => {
    const { playerName, playerHealth, selectedMonsterIndex } = req.session;

    if (!playerName || selectedMonsterIndex === undefined) {
        return res.status(400).json({ error: 'Game not started. Please pick a player and monster first.' });
    }

    const monster = getMonster(selectedMonsterIndex);
    if (!monster) {
        return res.status(404).json({ error: 'Monster not found.' });
    }

    const currentPlayerHealth = playerHealth ?? 100;

    let statusMessage = '';
    let winner = '';

    if (!monster.isAlive() && currentPlayerHealth > 0) {
    statusMessage = `${playerName} has defeated ${monster.name}!`;
    winner = playerName;
    } else if (monster.isAlive() && currentPlayerHealth <= 0) {
    statusMessage = `${monster.name} has defeated ${playerName}. Game Over.`;
    winner = monster.name;
    } else {
        statusMessage = 'The battle is still ongoing!';
        winner = 'None yet';
    }

    res.json({
        playerName,
        playerHealth: currentPlayerHealth,
        monster: {
            name: monster.name,
            health: monster.health,
            isAlive: monster.isAlive()
        },
        winner,
        statusMessage
    });
});

