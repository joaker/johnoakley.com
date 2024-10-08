import Two from 'https://cdn.skypack.dev/two.js@latest';

const two = new Two({
  type: Two.Types.svg,
  fullscreen: true,
  autostart: true
}).appendTo(document.body);

two.renderer.domElement.style.background = '#efefef';

const TWO_PI = Math.PI * 2;
const drag = 0.125;
const radius = Math.min(two.width, two.height) * 0.33;
const styles = {
  size: radius * 0.33,
  weight: 'bold',
  family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fill: 'black',
  opacity: 0.33
};

const ticks = two.makeCircle(0, 0, radius);
ticks.noFill();
ticks.dashes = [1, (TWO_PI * radius / 60 - 1)];
ticks.linewidth = 50;
ticks.stroke = 'rgba(0, 0, 0, 0.33)';

for (let i = 0; i < 12; i++) {

  const x = radius * Math.sin(i / 12 * TWO_PI);
  const y = - radius * Math.cos(i / 12 * TWO_PI);
  const number = new Two.Text(i === 0 ? 12 : i, x, y, styles);

  number.position.set(x, y);
  two.add(number);

}

const hands = {
  hour: new Two.Line(0, 0, 0, - radius * 0.66),
  minute: new Two.Line(0, 0, 0, - radius * 0.8),
  second: new Two.Line(0, 0, 0, - radius * 0.9)
};

hands.hour.noFill();
hands.hour.stroke = 'white';
hands.hour.linewidth = 20;
hands.hour.cap = 'round';

hands.minute.noFill();
hands.minute.stroke = 'rgb(255, 50, 50)';
hands.minute.linewidth = 10;
hands.minute.cap = 'round';

hands.second.cap = 'round';

two.add(hands.hour, hands.minute, hands.second);

two.bind('resize', resize)
   .bind('update', update);

resize();

function resize() {
  two.scene.position.set(two.width / 2, two.height / 2);
}

function update(frameCount, timeDelta) {
  const date = new Date();
  const hr = TWO_PI * date.getHours() / 12;
  const mr = TWO_PI * date.getMinutes() / 60;
  const sr = TWO_PI * date.getSeconds() / 60;
  hands.hour.rotation += (hr - hands.hour.rotation) * drag;
  hands.minute.rotation += (mr - hands.minute.rotation) * drag;
  hands.second.rotation += (sr - hands.second.rotation) * drag;
}