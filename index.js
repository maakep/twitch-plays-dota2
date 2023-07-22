const tmi = require('tmi.js');
var robot = require('robotjs');

const allowedInput = new RegExp(/(^[qwerdfhszxatyuiop0-9]|f1|f2|f3|f4)$/i);

const client = new tmi.Client({
  channels: ['maakep'],
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  let input = null;
  if (message[0] == '!') input = message.substring(1);
  if (!input) return;

  doCommand(input);
});

function doCommand(input) {
  const isMouseCommand = input.includes(',');
  const isClick = input == 'm1' || input == 'm2';

  if (isMouseCommand) {
    const pos = input.split(',');
    const x = (within100(Number.parseInt(pos[0])) / 100) * 1920;
    const y = Math.max(100, (within100(Number.parseInt(pos[1])) / 100) * 1080);

    robot.dragMouse(x, y);
  } else if (isClick) {
    if (input == 'm1') {
      robot.mouseClick('left');
    } else if (input == 'm2') {
      robot.mouseClick('right');
    }
  } else {
    const allowed = input.match(allowedInput);
    if (allowed) {
      robot.keyTap(input);
    }
  }
}

function within100(number) {
  return Math.min(100, Math.max(0, number));
}
