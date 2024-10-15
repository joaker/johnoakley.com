import React from 'react';
import Two from 'two.js';
import { TWO_PI } from 'two.js/src/utils/math';

const elem = document.body;
const two = new Two({
  type: Two.Types.svg,
  fullscreen: true
}).appendTo(elem);


let core;
let interactiveCore;
let gutter = two.height / 18;
const radiusScale = 6;
const maxLumens = 100 ;
const haloColor = '#66b3ff';
const interactiveCoreColor = 'rgba(255, 255, 255, 0)'
const textColor = haloColor;

const hourMarkerColor = 'rgb(255, 128, 0)';
const minuteMarkerColor = 'white';  
const secondMarkerColor = haloColor;

let messageInterval = null;
const messages = 'Every\nMoment\nCounts'.split("\n");


let background = two.makeGroup();
let middleground = two.makeGroup();
let foreground = two.makeGroup();
let interactiveLayer = two.makeGroup();

let banners = two.makeGroup();

let hourCorona = makeTriangle(two, gutter, 8);  
let minuteCorona = makeTriangle(two, gutter * .5, 4);  
let secondCorona = makeTriangle(two, gutter * .2, 2);  

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

background.add(sunAndMoon); 

const centerInteractive = makeCenterInteractive(two)
centerInteractive.translation.set(two.width / 2, two.height / 2);
interactiveLayer.add(centerInteractive)

two.update();

registerHandlers();

const bannerRevealDelay = 5 * 1000;
setTimeout(() => revealBanners(two), bannerRevealDelay);

two
  .bind('resize', function() {

    sunAndMoon.translation.x = two.width / 2;
    sunAndMoon.translation.y = two.height / 2;

  })
  .bind('update', function(frameCount) {


    const date = getDate();
    const { second, millisecond } = date;

    if( core ) {

      const interval = 1000 * 3;
      const halfInterval = interval / 2;

      const now = millisecond + (second % 3) * 1000;

      const upTransparency = now / interval; 
      const downTransparency = 1 - upTransparency;

      const transparency = now < halfInterval ? upTransparency : downTransparency;

      const rgba = `rgba(${maxLumens}, ${maxLumens}, ${maxLumens}, ${transparency})`;

      core.fill = rgba;
  
    }

    if(interactiveCore) {
      interactiveCore.fill = interactiveCoreColor;
    }    

    setCoronaMarkers(two, date);

  })
  .play();

function registerHandlers() {
  two.renderer.domElement.style.cursor = 'pointer';

  centerInteractive._renderer.elem.addEventListener('mouseover', enterEclipse);  
  centerInteractive._renderer.elem.addEventListener('mouseout', exitEclipse);  
  centerInteractive._renderer.elem.addEventListener('click', clickEclipse);  

}

function makeSunAndMoon(too) {

    let color = 'black';
    let sam = too.makeGroup();
    const radius = too.height / radiusScale;

    const bg = too.makeCircle(0, 0, radius);
    bg.noStroke();
    bg.fill = 'black';
    sam.add(bg);
  
    core = too.makeCircle(0, 0, radius);
    core.stroke = haloColor;
    core.linewidth = 6;

    core.fill = color;
  
    sam.core = core;

    sam.add(core);

    setCoronaMarkers(too);
    
    return sam;  


  }

  function makeCenterInteractive(too) {
    let color = interactiveCoreColor;
    let interactive = too.makeGroup();
    const radius = too.height / 4;
  
    interactiveCore = too.makeCircle(0, 0, radius);
    interactiveCore.stroke = interactiveCoreColor;
    interactiveCore.linewidth = 2;

    interactiveCore.fill = color;
  
    interactive.interactiveCore = interactiveCore;

    interactive.add(interactiveCore);
    
    return interactive;  
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

function enterEclipse() {
  two.renderer.domElement.style.cursor = 'pointer';

  revealBanners(two);
}

function exitEclipse() {
  two.renderer.domElement.style.cursor = 'default';
  clearInterval(messageInterval);
  hideBanners()
}

function clickEclipse() {
  console.log('eclipse clicked');
  window.open('mailto:john@johnoakley.com');
}

function hideBanners() {
  if(banners) {
    [...banners.children].forEach(banner => banners.remove(banner));
    foreground.remove(banners);
  }
}

function revealBanners(too) {

  hideBanners()

  const scale = 4.5;

  const radius = Math.min(too.width / scale, too.height / scale);

  const size = radius * (0.22)




  makeBannerMessage(too, messages[0], size, -size);
  makeBannerMessage(too, messages[1], size, 0);
  makeBannerMessage(too, messages[2], size, size);

  const interval = setInterval(() => {
    let done = false;
    [...banners.children].forEach(banner => {
      banner.opacity += 0.02;
      if(banner.style.opacity >= 0.33) {
        done = true;
      }
    });

    if(done) {
      clearInterval(interval);
      banners.forEach(banner => banner.opacity = 0);
    }


  }, 100)

  foreground.add(banners);
}

function makeBannerMessage(too, message, size, offsetY) {

  const styles = {
    size,  
    weight: 'bold',  
    family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',  
    fill: textColor,  
    opacity: 0,  
    'pointer-events': 'none',  
  };

  const x = 0;
  const y = 0;
  const banner = new Two.Text(message, x, y, styles);

  banner.translation.set(too.width / 2, too.height / 2 + offsetY);

  banners.add(banner);
}



function getSecondPercent(date = getDate()) {
  const { second, millisecond } = date;
  const percent = second / 60 + millisecond / 60 / 1000;
  return percent;
}

function setCoronaMarkers(too, date = getDate()) {
    const baseRadius = too.height / radiusScale;

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