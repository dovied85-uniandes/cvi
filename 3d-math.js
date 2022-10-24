var ThreeDeeMath = (function(){


var angle = function(t) {
  if (t > 180) {
    return t - 360;
  }
  if (t <= -180) {
    return t + 360;
  }
  return t;
};

return {
  angle: angle
};

})();
