import React from 'react';
import Two from 'two.js';
import { TWO_PI } from 'two.js/src/utils/math';

const elem = document.body;
const two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(elem);

const drag = 0.125;
let core;
let lastSecond = 0;
let coreRBGA = 0;
const maxLumens = 42;
const tickColor = lumenToRBG(maxLumens);

let background = two.makeGroup();
let middleground = two.makeGroup();
let foreground = two.makeGroup();

let corona = null;
const sunAndMoon = makeSunAndMoon(two)
const radius = two.height / 4;
let gutter = two.height / 20;
const hourMarkerColor = 'rgb(255, 128, 0)';
sunAndMoon.translation.set(two.width / 2, two.height / 2);

corona = makeTriangle(two, gutter);  
corona.noStroke();  
corona.fill = hourMarkerColor;
sunAndMoon.add(corona);  



middleground.add(sunAndMoon)


const seconds = makeSeconds(two);
seconds.translation.set(two.width / 2, two.height / 2);
foreground.add(seconds);

const now = new Two.Line(0, 0, 0, - radius * 0.9);
now.stroke = '#0044cc';
now.linewidth = 5;

foreground.add(now);


const numbers = makeNumbers(two);
// numbers.translation.set(two.width / 2, two.height / 2);
// foreground.add(numbers);



two
  .bind('resize', function() {

    sunAndMoon.translation.x = two.width / 2;
    sunAndMoon.translation.y = two.height / 2;
    // TODO - do this for all translations

  })
  .bind('update', function(frameCount) {


    const date = getDate();

    const { hour, minute, second, millisecond } = date;

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

    setCoronaMarker(two, date);

    // numbers.rotation = rotation;  
    })

  .play();

function makeSeconds(too) {
    const scale = 4.4;
    const radius = Math.min(too.width / scale, too.height / scale);

    const ticks = too.makeCircle(0, 0, radius);
    ticks.noFill();
    ticks.dashes = [1, (TWO_PI * radius / 12)];
    ticks.linewidth = 20;
    ticks.stroke = tickColor;

    ticks.rotation = - TWO_PI * .26/60;

    return ticks;
}

function makeSecondHand(too) {
    const sc = new too.make
}

function makeNumbers(too) {
    const drag = 0.125;
    const count = 12; // 12

    const scale = 3;
    const radius = Math.min(too.width / scale, too.height / scale);

    const numbers = too.makeGroup()

    const size = radius * (0.33/count/12)

    const styles = {
        size, //: radius * 0.33,
        weight: 'bold',
        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        fill: 'grey',
        opacity: 0.33,
    };

    for (let i = 0; i < count; i++) {

        const x = radius * Math.sin(i / 12 * TWO_PI);
        const y = - radius * Math.cos(i / 12 * TWO_PI);
        const number = new Two.Text(i === 0 ? 12 : i, x, y, styles);


        
        number.position.set(x, y);
        numbers.add(number);
    
    }

    return numbers;
    
}

const message = 'Each\nBeat\nCounts'

function makeBanner(too) {

    const scale = 4.5;


    const radius = Math.min(too.width / scale, too.height / scale);

    const size = radius * (0.33)

    const styles = {
        size, //: radius * 0.33,
        weight: 'bold',
        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        fill: 'grey',
        opacity: 0.33,
    };


        const x = 0; // radius * Math.sin(i / 12 * TWO_PI);
        const y = 0; //- radius * Math.cos(i / 12 * TWO_PI);
        const banner = new Two.Text(message, x, y, styles);
        return banner;
}

function makeSunAndMoon(too) {

    let color = 'black';
    let sam = too.makeGroup();
    const radius = too.height / 4;
    let gutter = too.height / 20;
  
    core = too.makeCircle(0, 0, radius);
    core.stroke = '#66b3ff';
    core.linewidth = 5;

    core.fill = color;
  
    sam.core = core;

    sam.add(core);

    setCoronaMarker(too);
    
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
    const twelveHour = getTwelveHour(date);
    return twelveHour / 12;
}

function setCoronaMarker(too, date = getDate()) {

    if(!corona) return;

    const baseRadius = too.height / 4;
    const gutter = too.height / 20;

    const radius = baseRadius + gutter;

    const twelveHourPercent = getTwelveHourPercent();

    const x = radius * Math.sin(twelveHourPercent * TWO_PI);
    const y = - radius * Math.cos(twelveHourPercent * TWO_PI);
    
    corona.translation.set(x, y);

    // const rotation = Math.TWO_PI - (Math.atan2(-y, -x) + Math.PI / 2);
    const rotation = Math.atan2(-y, -x) - Math.PI / 2;
    // console.log({rotation})
    corona.rotation = rotation;

}


  function makeTriangle(too, size) {
    var tri = two.makePath(- size / 2, 0, size / 2, 0, 0, size);
    return tri;
  }