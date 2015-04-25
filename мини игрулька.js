var raf = (function(){
  return  window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame   || 
  window.mozRequestAnimationFrame      || 
  window.oRequestAnimationFrame        || 
  window.msRequestAnimationFrame       || 
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

var topLeft = new Victor(0, 0);
var bottomRight = new Victor(window.innerWidth, window.innerHeight);

var magnetRadius = 30;
var magnetPosition = new Victor(0, 0).randomize(topLeft, bottomRight);

var magnetStrength = 0.003;
var magnetReactionTheshold = 150;

var ballRadius = 15;
var ballPosition = new Victor(0, 0).randomize(topLeft, bottomRight);
var ballVelocity = new Victor(3, 3);

var ball = document.querySelector('.ball');
var magnet = document.querySelector('.magnet');

window.addEventListener('mousemove', updateMagnet);
window.addEventListener('resize', reset);

function reset () {
  ballPosition = new Victor(0, 0).randomize(topLeft, bottomRight);
  bottomRight = new Victor(window.innerWidth, window.innerHeight);
}

function updateMagnet (ev) {
  magnetPosition.x = ev.pageX;
  magnetPosition.y = ev.pageY;
}

function update () {
  if (ballPosition.distanceX(topLeft) <= 0) { ballVelocity.invertX(); }
  if (ballPosition.distanceY(topLeft) <= 0) { ballVelocity.invertY(); }
  if (bottomRight.distanceX(ballPosition) <= 0) { ballVelocity.invertX(); }
  if (bottomRight.distanceY(ballPosition) <= 0) { ballVelocity.invertY(); }
  
  var correction = new Victor(
    magnetPosition.distanceX(ballPosition),
    magnetPosition.distanceY(ballPosition)
  ).multiply(magnetStrength);
  
  var magnetDistance = ballPosition.distance(magnetPosition);
  
  if (magnetDistance < magnetReactionTheshold) {
    ballVelocity.subtract(correction);
  }
  
  ballPosition.add(ballVelocity);
  
  applyTransform(ball, {
    translate: { x: ballPosition.x - ballRadius, y: ballPosition.y - (ballRadius * 2) }
  });
  
  applyTransform(magnet, {
    translate: { x: magnetPosition.x - magnetRadius, y: magnetPosition.y - (magnetRadius * 2) },
    rotate: Math.round((correction.angle() - Math.PI / 2) * 10000) / 10000
  });
  
  raf(update);
}

update();

function applyTransform (el, t) {
  if (typeof el.style.transform !== 'undefined') { el.style.transform = transform(t); return; }
  if (typeof el.style.webkitTransform !== 'undefined') { el.style.webkitTransform = transform(t); return; }
  if (typeof el.style.mozTransform !== 'undefined') { el.style.mozTransform = transform(t); return; }
  if (typeof el.style.oTransform !== 'undefined') { el.style.oTransform = transform(t); return; }
  if (typeof el.style.msTransform !== 'undefined') { el.style.msTransform = transform(t); return; }
}

function transform (t) {
  var trans = [];
  if (t.translate) {
    trans.push('translate3d(' + t.translate.x + 'px, ' + t.translate.y + 'px, 0)');
  }
  if (t.rotate) {
    trans.push('rotate(' + t.rotate + 'rad)');
  }
  
  return trans.join(' ');
}