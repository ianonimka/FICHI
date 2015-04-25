var mouseX = 0, mouseY = 0, limitX = 20, limitY = 20;
$(window).mousemove(function(e){
  var offset = $('#eye i i i i').offset();
   mouseX = Math.min(e.pageX - offset.left, limitX);
   mouseY = Math.min(e.pageY - offset.top, limitY);
   if (mouseX < 0) mouseX = 0;
   if (mouseY < 0) mouseY = 0;
});

var follower = $('#eye u'), xp = 0, yp = 0,
loop = setInterval(function(){
    xp += (mouseX - xp) / 1;
    yp += (mouseY - yp) / 1;
    follower.css({left:xp, top:yp});
    
}, 30);