import React from 'react';
import Two from 'two.js';
import { TWO_PI } from 'two.js/src/utils/math';

const elem = document.body;
const two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(elem);


let core;
let gutter = two.height / 20;
const maxLumens = 42 / (2/3) ;
const haloColor = '#66b3ff';
const foregroundColor = lumenToRBG(maxLumens);

const hourMarkerColor = 'rgb(255, 128, 0)';
const minuteMarkerColor = foregroundColor;  
const secondMarkerColor = haloColor;

let background = two.makeGroup();
let middleground = two.makeGroup();
let foreground = two.makeGroup();

let banner = null;

let hourCorona = makeTriangle(two, gutter);  
let minuteCorona = makeTriangle(two, gutter * .8, 4);  
let secondCorona = makeTriangle(two, gutter * .5, 8);  

const sunAndMoon = makeSunAndMoon(two)
sunAndMoon.translation.set(two.width / 2, two.height / 2);
 
hourCorona.noStroke();  
hourCorona.fill = hourMarkerColor;
sunAndMoon.add(hourCorona);  

minuteCorona.noStroke();  
minuteCorona.fill = minuteMarkerColor;
sunAndMoon.add(minuteCorona);  

secondCorona.noStroke();  
secondCorona.fill = secondMarkerColor;
sunAndMoon.add(secondCorona);  


middleground.add(sunAndMoon);  

let messageReady = false;
const messages = '\n\nEvery\n\nMoment\n\nCounts\n\n\n\n'.split("\n\n");

two
  .bind('resize', function() {

    sunAndMoon.translation.x = two.width / 2;
    sunAndMoon.translation.y = two.height / 2;
    // TODO - do this for all translations

  })
  .bind('update', function(frameCount) {


    const date = getDate();

    const { second, millisecond } = date;

    const transparency = (millisecond/1000).toFixed(2);
    
    const lumens = (maxLumens * transparency).toFixed(0);
    const downLumens = (maxLumens - lumens).toFixed(0);

    const rgb = `rgb(${lumens}, ${lumens}, ${lumens})`;
    const downRgb = `rgb(${downLumens}, ${downLumens}, ${downLumens})`;

    if(core) {
        // console.log(`the second is: ${second}`)
        if(second % 2) {
            // console.log(`alumen: ${rgb}`);
            core.fill = rgb;
        } else {
            // console.log(`dlumen: ${downRgb}`);
            core.fill = downRgb;
        }
    }    

    setCoronaMarkers(two, date);
    setBanner(two, second);

    // now.rotation = TWO_PI * (second + millisecond / 1000) / 60

    // numbers.rotation = rotation;  
    })

  .play();

function setBanner(too, second) {

  if(banner) {
    foreground.remove(banner);
  }

    const scale = 4.5;

    const radius = Math.min(too.width / scale, too.height / scale);

    const size = radius * (0.33)

    const styles = {
        size, //: radius * 0.33,
        weight: 'bold',
        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        fill: foregroundColor,
        opacity: 0.33,
    };

    const messageIndex = Math.round(second) % messages.length;
    if( !messageReady && messageIndex === 10) {
      messageReady = true;
    }

    // if(!messageReady) return;

    const message = messages[messageIndex];

    const x = 0; // radius * Math.sin(i / 12 * TWO_PI);
    const y = 0; //- radius * Math.cos(i / 12 * TWO_PI);
    banner = new Two.Text(message, x, y, styles);

    banner.translation.set(two.width / 2, two.height / 2);
    foreground.add(banner);

    return banner;
}

function makeSunAndMoon(too) {

    let color = 'black';
    let sam = too.makeGroup();
    const radius = too.height / 4;
    let gutter = too.height / 20;
  
    core = too.makeCircle(0, 0, radius);
    core.stroke = haloColor;
    core.linewidth = 5;

    core.fill = color;
  
    sam.core = core;

    sam.add(core);

    setCoronaMarkers(too);
    
    return sam;  


  }

  function lumenToRBG(lumens) {
    return `rgb(${lumens}, ${lumens}, ${lumens})`
  }  

  function randomRBG() {
    return Math.ceil( 255 * Math.random());
  }

  function getRandomColor() {
    const r = randomRBG();
    const b = randomRBG();
    const g = randomRBG();

    return {
        r: randomRBG(),  
        g: randomRBG(),  
        b: randomRBG(),  

    };
  }

  function getDate(date = new Date()) {    
    return {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
    }

  }

  function getTwelveHour(date = getDate()) {

    const { hour, minute, second, millisecond } = date;

    const twelveHour = hour % 12 + minute / 60 + second / 60 / 60 + millisecond / 60 / 60 / 1000;
    return twelveHour;
}

function getTwelveHourPercent(date = getDate()) {
    const percent = getTwelveHour(date);
    return percent / 12;
}

function getMinutePercent(date = getDate()) {
  const { minute, second, millisecond } = date;
  const percent = minute / 60 + second / 60 / 60 + millisecond / 60 / 60 / 1000;
  return percent;

}



function getSecondPercent(date = getDate()) {
  const { second, millisecond } = date;
  const percent = second / 60 + millisecond / 60 / 1000;
  return percent;
}

function setCoronaMarkers(too, date = getDate()) {
    const baseRadius = too.height / 4;

    if(!hourCorona || !minuteCorona) return;

    const hourGutter = too.height / 25;

    const hourRadius = baseRadius + hourGutter;


    const twelveHourPercent = getTwelveHourPercent(date);

    setCoronaMarker(hourCorona, twelveHourPercent, hourRadius)

    const minutePercent = getMinutePercent(date);

    const minuteGutter = too.height / 35;

    const minuteRadius = baseRadius + minuteGutter;

    setCoronaMarker(minuteCorona, minutePercent, minuteRadius);

    const secondPercent = getSecondPercent(date);

    const secondGutter = too.height / 100;

    const secondRadius = baseRadius + secondGutter;

    setCoronaMarker(secondCorona, secondPercent, secondRadius);


}

function setCoronaMarker(corona, percentComplete, radius) {

  const x = radius * Math.sin(percentComplete * TWO_PI);
  const y = - radius * Math.cos(percentComplete * TWO_PI);
  
  corona.translation.set(x, y);

  const rotation = Math.atan2(-y, -x) - Math.PI / 2;
  // console.log({rotation})
  corona.rotation = rotation;

}


  function makeTriangle(too, size, factor = 2) {
    var tri = two.makePath(
      - size / factor,
      0,
      size / factor,
      0,
      0,
      size
    );
    return tri;
  }