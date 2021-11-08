import { Carryall, CARRYALL_STATUS } from '../model/Carryall.js';
import { Harvester, HARVESTER_STATUS } from '../model/Harvester.js';
import { Thumper, THUMPER_STATUS } from '../model/Thumper.js';
import { Sandworm } from '../model/Sandworm.js';

window.$ = window.jQuery = require('../scripts/jquery.min.js');

const ctx = $('#canvas')[0].getContext('2d');
$('#canvas')[0].width = window.innerWidth;
$('#canvas')[0].height = window.innerHeight;

const config = {
  GAME_OVER_SOLARI: -1000,
};

const market = {
  solariPerSpice: 100,
  harvester: 1000,
  callCarryall: 300,
  thumper: 100,
};

const user = {
  spiceAmount: 10,
  solariAmount: 1000,
  buyWithSpice: (price) => {
    if (user.spiceAmount < price) {
      alert(`Not enough spices to buy!\nYour spices : ${user.spiceAmount}`);
      return false;
    }
    user.spiceAmount -= price;
    return true;
  },
  buyWithSolari: (price) => {
    if (user.solariAmount < price) {
      alert(`Not enough solari to buy!\nYour solaris : ${user.solariAmount}`);
      return false;
    }
    user.solariAmount -= price;
    return true;
  },
  message: 'this is a nice day for spicing sir...',
  focusedHarvester: null,
  gameOver: false,
  frameCount: 0,
};

const objects = {
  harvesters: [],
  sandworms: [],
  thumpers: [],
  // TODO: spotter enlightens desert area so that harvesters can avoid sandworms
  spotters: [],
  carryall: new Carryall(),
};

const updateMessage = () => {
  if (user.spiceAmount > 1000) {
    user.message = 'Happy harvesting sir!';
  }
  if (user.solariAmount < 0) {
    user.message = 'We are running out of solari, sir!';
  }
  if (user.solariAmount > 100000) {
    user.message = 'My true lord!';
  }
};

const updateMarket = () => {
  const increasedPercent = Math.floor(Math.random() * 10 - 4.4) / 3;
  market.solariPerSpice = Math.floor(market.solariPerSpice * (1 + 0.01 * increasedPercent) + 0.5);
};

const updateAttributes = () => {
  updateMessage();
  updateMarket();
  // statistics
  $('#status').text(`👨🏻‍💼\n"${user.message}"`);
  $('#mined_spice').text(`⛏\nspice mined :\n ${user.spiceAmount}`);
  $('#solari').text(`💰\nsolari :\n $${user.solariAmount}`);
  $('#solariPerSpice').text(
    `💹\nmarket :\n $${market.solariPerSpice} solari/spice`,
  );
  $('#user_record').html(`🎖\nYour Record : ${Math.floor(user.frameCount / 180)}`);
  // controller
  $('#new_harvester').html(`<b>H</b> New Harvester ($${market.harvester})`);
  $('#call_helicopter').html(
    `<b>C</b> Call Carryall ($${market.callCarryall})`,
  );
  $('#create_thumper').html(`<b>T</b> Create Thumper ($${market.thumper})`);
};

const calculateLeftoverSpice = () => {
  user.spiceAmount += objects.harvesters.reduce(
    (prev, harvester) => prev + harvester.getMinedSpice(), 0,
  );
  user.solariAmount -= 1;
};

const judgeGameOver = () => {
  if (user.solariAmount < config.GAME_OVER_SOLARI) {
    user.gameOver = true;
    alert(`Game Over!\nYour Record : ${Math.floor(user.frameCount / 180)}\n`);
  }
};

const listenEvents = () => {
  // TODO: Make events
  if (user.frameCount === 10000) {
    alert('Emperor ordered Arakis to devote 10,000 spices.');
    user.spiceAmount -= 10000;
  }
};

const initInstances = () => {
  objects.harvesters.push(new Harvester());
  objects.sandworms.push(new Sandworm());
  objects.thumpers.push(new Thumper());
};

const animate = () => {
  if (user.gameOver) {
    return;
  }
  user.frameCount += 1;
  requestAnimationFrame(animate);

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  // fill canvas with color
  ctx.fillStyle = '#c8b57b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // update attributes
  if (user.frameCount % 10 === 1) {
    updateAttributes();
  }

  // event listener
  // TODO: events like ROUND / DEAL with other empire / Pay for Emperor
  listenEvents();

  // death check
  objects.harvesters = objects.harvesters.filter(
    (harvester) => harvester.status !== HARVESTER_STATUS.DESTROYED,
  );
  objects.thumpers = objects.thumpers.filter(
    (thumper) => thumper.status !== THUMPER_STATUS.DESTROYED,
  );
  if (!user.focusedHarvester || user.focusedHarvester.status === HARVESTER_STATUS.DESTROYED) {
    user.focusedHarvester = objects.harvesters[0];
  }

  // retarget
  objects.sandworms.forEach(
    (sandworm) => {
      if (!sandworm.target) {
        sandworm.retarget(objects.harvesters.concat(thumpers));
      }
    },
  );

  // TODO: make instances unable to get out of canvas
  // draw
  objects.sandworms.forEach((sandworm) => sandworm.draw(ctx));
  objects.harvesters.forEach((harvester, index) => harvester.draw(ctx, index + 1));
  objects.thumpers.forEach((thumper) => thumper.draw(ctx));
  objects.carryall.draw(ctx);

  // move
  if (user.frameCount % 10 === 0) {
    objects.sandworms.forEach((sandworm) => sandworm.move());
  }
  objects.harvesters.forEach((harvester) => harvester.move());
  objects.carryall.move();
  objects.thumpers.forEach((thumper) => thumper.move());

  // calculate
  calculateLeftoverSpice();

  judgeGameOver();
};

initInstances();
objects.sandworms.forEach((sandworm) => sandworm.retarget(objects.harvesters));
animate();

const createHarvester = () => {
  if (user.buyWithSolari(market.harvester)) {
    const [x, y] = [Math.random() * 500, Math.random() * 500];
    objects.harvesters.push(new Harvester(x, y));
  }
};

const callCarryall = () => {
  if (user.buyWithSolari(market.callCarryall)) {
    objects.carryall.status = CARRYALL_STATUS.MOVING;
    objects.carryall.target = user.focusedHarvester;
  }
};

const createThumper = () => {
  if (user.buyWithSolari(market.thumper)) {
    const [x, y] = [Math.random() * 500, Math.random() * 500];
    objects.thumpers.push(new Thumper(x, y));
  }
};

const sellSpices = (amount = 1000) => {
  if (user.buyWithSpice(amount)) {
    user.solariAmount += market.solariPerSpice * amount;
    alert(`sold ${amount} spices, @${market.solariPerSpice}`);
  }
};

// listeners
$(document).on('click', '#new_harvester', () => createHarvester());
$(document).on('click', '#call_helicopter', () => callCarryall());
$(document).on('click', '#create_thumper', () => createThumper());
$(document).on('click', '#sell_spices', () => sellSpices());

// shortcuts
document.addEventListener('keydown', (e) => {
  const isDigit = () => parseInt(e.key, 10) >= 1 && parseInt(e.key, 10) <= 9;
  switch (e.code) {
    // case 'Space':
    //   harvesters[0].angle += 5;
    //   break;
    case 'Escape':
      alert('Paused. press OK to resume');
      break;
    case 'KeyE':
      sellSpices();
      break;
    case 'KeyP':
      // TODO: showMarketChart
      alert('TBU');
      break;
    case 'KeyH':
      createHarvester();
      break;
    case 'KeyC':
      callCarryall();
      break;
    case 'KeyT':
      createThumper();
      break;
    // move harvester
    case 'KeyW':
      user.focusedHarvester.y -= 3;
      break;
    case 'KeyS':
      user.focusedHarvester.y += 3;
      break;
    case 'KeyD':
      user.focusedHarvester.x += 3;
      break;
    case 'KeyA':
      user.focusedHarvester.x -= 3;
      break;
    default:
      if (isDigit()) {
        user.focusedHarvester = objects.harvesters[parseInt(e.key, 10) - 1];
      }
      break;
  }
});
