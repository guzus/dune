import { CARRYALL_STATUS, Carryall } from '../model/Carryall.js';
import { Harvester, HARVESTER_STATUS } from '../model/Harvester.js';
import { Sandworm } from '../model/Sandworm.js';

window.$ = window.jQuery = require('../scripts/jquery.min.js');

const ctx = $('#canvas')[0].getContext('2d');
$('#canvas')[0].width = window.innerWidth;
$('#canvas')[0].height = window.innerHeight;

const market = {
  solariPerSpice: 100,
};

const user = {
  spiceAmount: 10,
  solariAmount: 10000,
  message: 'this is a nice day for spicing sir...',
};

const price = {
  createHarvester: 100,
  callCarryall: 80,
};

let frameCount = 0;

let harvesters = [];
let sandworms = [];
let carryall = new Carryall();

const updateMessage = () => {
  if(user.spiceAmount > 1000) {
    user.message = "happy harvesting sir!"
  }
}

const updateMarket = () => {
  market.solariPerSpice += Math.floor(Math.random()*10-4);
}

const updateAttributes = () => {
  updateMessage();
  updateMarket();
  $('#mined_spice').text(`⛏ spice mined : ${user.spiceAmount}`);
  $('#solari').text(`💰 solari : $${user.solariAmount}`);
  $('#status').text(user.message);
  $('#solariPerSpice').text(`💹 market : $${market.solariPerSpice} solari/spice`);
};

const initInstances = () => {
  const harvester = new Harvester();
  harvesters.push(harvester);
  const sandworm = new Sandworm();
  sandworms.push(sandworm);
};

const animate = () => {
  frameCount += 1;
  requestAnimationFrame(animate);

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  // fill canvas with color
  ctx.fillStyle = '#c8b57b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // update attributes
  if (frameCount % 10 === 0) {
    updateAttributes();
  }

  // death check
  harvesters = harvesters.filter(
    (harvester) => harvester.status !== HARVESTER_STATUS.DESTROYED
  );

  // retarget
  sandworms.forEach(
    // TODO: add thumpers to candidates
    (sandworm) => {
      if(!sandworm.target) {
        sandworm.retarget(harvesters);
      }
    }
  );

  // draw
  sandworms.forEach((sandworm) => sandworm.draw(ctx));
  harvesters.forEach((harvester) => harvester.draw(ctx));
  carryall.draw(ctx);

  if (frameCount % 20 === 0) {
    sandworms.forEach((sandworm) => sandworm.move());
  }
  harvesters.forEach((harvester) => harvester.move());
  carryall.move();

  harvesters.forEach((harvester) => user.spiceAmount += harvester.getMinedSpice());
};

initInstances();
sandworms[0].target = harvesters[0];
animate();

// functions

const createHarvester = () => {
  const x = Math.random()*500, y = Math.random()*500;
  const harvester = new Harvester(x, y);
  harvesters.push(harvester);
  // alert('404 harvester not found');
};

const callCarryall = () => {
  user.solariAmount -= price.callCarryall;
  carryall.status = CARRYALL_STATUS.MOVING;
  // TODO: select target Harvester
  carryall.target = harvesters[0];
};

const createThumper = () => {
  alert('404 to be updated');
}

const sellSpices = (amount=1000) => {
  alert(`sold ${amount} spices`);
  user.spiceAmount -= amount;
  user.solariAmount += market.solariPerSpice*amount;
}

// listeners
$(document).on('click', '#new_harvester', () => {
  createHarvester();
});

$(document).on('click', '#call_helicopter', () => {
  callCarryall();
});

$(document).on('click', '#create_thumper', () => {
  createThumper();
});

$(document).on('click', '#sell_spices', () => {
  sellSpices();
});

// shortcuts
document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'Space':
      break;
    case 'Escape':
      alert('Paused. press OK to resume');
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
      harvesters[0].y -= 3;
      break;
    case 'KeyS':
      harvesters[0].y += 3;
      break;
    case 'KeyD':
      harvesters[0].x += 3;
      break;
    case 'KeyA':
      harvesters[0].x -= 3;
      break;
  }
});
