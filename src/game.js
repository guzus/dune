import { Carryall, CARRYALL_STATUS } from '../model/Carryall.js';
import { Harvester, HARVESTER_STATUS } from '../model/Harvester.js';
import { Thumper, THUMPER_STATUS } from '../model/Thumper.js';
import { Sandworm } from '../model/Sandworm.js';

window.$ = window.jQuery = require('../scripts/jquery.min.js');

const ctx = $('#canvas')[0].getContext('2d');
$('#canvas')[0].width = window.innerWidth;
$('#canvas')[0].height = window.innerHeight;

const market = {
  solariPerSpice: 100,
  harvester: 1000,
  callCarryall: 300,
  thumper: 100,
};

const user = {
  spiceAmount: 10,
  solariAmount: 1000,
  message: 'this is a nice day for spicing sir...',
  focusedHarvester: null,
  gameOver: false
};

let frameCount = 0;

let harvesters = [];
const sandworms = [];
let thumpers = [];
// TODO: spotter enlightens desert area so that harvesters can avoid sandworms
const spotters = [];
const carryall = new Carryall();

const updateMessage = () => {
  if (user.spiceAmount > 1000) {
    user.message = 'happy harvesting sir!';
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
  $('#user_record').html(`🎖\nYour Record : ${Math.floor(frameCount / 180)}`);
  // controller
  $('#new_harvester').html(`<b>H</b> New Harvester ($${market.harvester})`);
  $('#call_helicopter').html(
    `<b>C</b> Call Carryall ($${market.callCarryall})`,
  );
  $('#create_thumper').html(`<b>T</b> Create Thumper ($${market.thumper})`);
};

const calculateLeftoverSpice = () => {
  user.spiceAmount += harvesters.reduce(
    (prev, harvester) => prev + harvester.getMinedSpice(), 0,
  );
  user.solariAmount -= 1;
}

const judgeGameOver = () => {
  if(user.solariAmount < 0) {
    user.gameOver = true;
    alert(`Game Over!\nYour Record : ${Math.floor(frameCount / 180)}\n`);
  }
}


const listenEvents = () => {
  // TODO: Emperor ordered Arakis to devote 10,000 spices.
}

const initInstances = () => {
  harvesters.push(new Harvester());
  sandworms.push(new Sandworm());
  thumpers.push(new Thumper());
};

const animate = () => {
  if(user.gameOver) {
    // user.gameOver = false;
    return;
  }
  frameCount += 1;
  requestAnimationFrame(animate);

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  // fill canvas with color
  ctx.fillStyle = '#c8b57b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // update attributes
  if (frameCount % 10 === 1) {
    updateAttributes();
  }
  
  // event listener
  // TODO: events like ROUND / DEAL with other empire / Pay for Emperor
  listenEvents();

  // death check
  harvesters = harvesters.filter(
    (harvester) => harvester.status !== HARVESTER_STATUS.DESTROYED,
  );
  thumpers = thumpers.filter(
    (thumper) => thumper.status !== THUMPER_STATUS.DESTROYED,
  );
  if (!user.focusedHarvester || user.focusedHarvester.status === HARVESTER_STATUS.DESTROYED) {
    user.focusedHarvester = harvesters[0];
  }

  // retarget
  sandworms.forEach(
    (sandworm) => {
      if (!sandworm.target) {
        sandworm.retarget(harvesters.concat(thumpers));
      }
    },
  );

  // TODO: make instances unable to get out of canvas
  // draw
  sandworms.forEach((sandworm) => sandworm.draw(ctx));
  harvesters.forEach((harvester, index) => harvester.draw(ctx, index + 1));
  thumpers.forEach((thumper) => thumper.draw(ctx));
  carryall.draw(ctx);

  // move
  if (frameCount % 10 === 0) {
    sandworms.forEach((sandworm) => sandworm.move());
  }
  harvesters.forEach((harvester) => harvester.move());
  carryall.move();
  thumpers.forEach((thumper) => thumper.move());

  // calculate
  calculateLeftoverSpice();

  // TODO: judge if LOSE
  judgeGameOver();
};

initInstances();
sandworms.forEach((sandworm) => sandworm.retarget(harvesters));
animate();

// functions
const createHarvester = () => {
  user.solariAmount -= market.harvester;
  const [x, y] = [Math.random() * 500, Math.random() * 500];
  harvesters.push(new Harvester(x, y));
};

const callCarryall = () => {
  user.solariAmount -= market.callCarryall;
  carryall.status = CARRYALL_STATUS.MOVING;
  carryall.target = user.focusedHarvester;
};

const createThumper = () => {
  user.solariAmount -= market.thumper;
  const [x, y] = [Math.random() * 500, Math.random() * 500];
  thumpers.push(new Thumper(x, y));
};

const sellSpices = (amount = 1000) => {
  alert(`sold ${amount} spices, @${market.solariPerSpice}`);
  user.spiceAmount -= amount;
  user.solariAmount += market.solariPerSpice * amount;
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
        user.focusedHarvester = harvesters[parseInt(e.key, 10) - 1];
      }
      break;
  }
});
