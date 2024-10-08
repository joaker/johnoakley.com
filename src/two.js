import React from 'react';
import Two from 'two.js';

const elem = document.body;
const two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(elem);

let background = two.makeGroup();
let middleground = two.makeGroup();
let foreground = two.makeGroup();

const sunAndMoon = makeSunAndMoon(two)
sunAndMoon.translation.set(two.width / 2, two.height / 2);
middleground.add(sunAndMoon)

two
  .bind('resize', function() {

    sunAndMoon.translation.x = two.width / 2;
    sunAndMoon.translation.y = two.height / 2;
    // path.translation.copy(sunAndMoon.translation);

  })
  .bind('update', function(frameCount) {
    // what to do each frame update
  })
  .play();

// const createCircle = () => {
//     // Two.js has convenient methods to make shapes and insert them into the scene.
//     let radius = 50;
//     let x = two.width * 0.5;
//     let y = two.height * 0.5 - radius * 1.25;
//     let circle = two.makeCircle(x, y, radius);

//     y = two.height * 0.5 + radius * 1.25;
//     let width = 100;
//     let height = 100;
//     let rect = two.makeRectangle(x, y, width, height);

//     // The object returned has many stylable properties:
//     circle.fill = 'black';
//     // And accepts all valid CSS color:
//     circle.stroke = '#66b3ff';
//     circle.linewidth = 5;

// }

function makeSunAndMoon(too) {

    let color = 'black';
    let sam = too.makeGroup();
    let radius = too.height / 4;
    let gutter = too.height / 20;
  
    let core = too.makeCircle(0, 0, radius);
    core.stroke = '#66b3ff';
    core.linewidth = 5;

    core.fill = color;
  
    sam.core = core;

    const hourMarkerColor = 'rgb(255, 128, 0)';
  
    let coronas = [];
    let corona_amount = 1;
    for (let i = 0; i < corona_amount; i++) {
      let pct = (i + 1) / corona_amount;
      let theta = pct * Math.PI * -.5;
      let x = (radius + gutter) * Math.cos(theta);
      let y = (radius + gutter) * Math.sin(theta);
      let corona = makeTriangle(too, gutter);
      corona.noStroke();
      corona.fill = hourMarkerColor;
      corona.translation.set(x, y);
      corona.rotation = 0;//Math.atan2(-y, -x) + Math.PI / 2;
      coronas.push(corona);
    }
  
    sam.add(core).add(coronas);
  
    return sam;
  
  }

  function makeTriangle(too, size) {
    var tri = two.makePath(- size / 2, 0, size / 2, 0, 0, size);
    return tri;
  }