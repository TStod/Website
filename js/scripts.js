
// Swipe Detection Credit:
// http://www.javascriptkit.com/javatutors/touchevents2.shtml
function swipeDetect(element, callback) {
  var touchSurface = element;
  var swipedir;
  var startX;
  var startY;
  var distX;
  var distY;
  var threshold = 150; //required min distance traveled to be considered swipe
  var restraint = 100; // maximum distance allowed at the same time in perpendicular direction
  var allowedTime = 500; // maximum time allowed to travel that distance
  var elapsedTime;
  var startTime;
  var handleSwipe = callback || function(swipedir){};

  touchSurface.addEventListener("touchstart", function(e) {
    var touchobj = e.changedTouches[0];
    swipedir = "none";
    dist = 0;
    startX = touchobj.pageX;
    startY = touchobj.pageY;
    startTime = new Date().getTime(); // record time when finger first makes contact with surface
    // e.preventDefault();
  }, false)

  touchSurface.addEventListener("touchmove", function(e) {
    // e.preventDefault(); // prevent scrolling when inside DIV
  }, false);

  touchSurface.addEventListener("touchend", function(e) {
    var touchobj = e.changedTouches[0];
    distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
    distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
    elapsedTime = new Date().getTime() - startTime; // get time elapsed
    if (elapsedTime <= allowedTime) { // first condition for awipe met
      if ((Math.abs(distX) >= threshold) && (Math.abs(distY) <= restraint)) { // 2nd condition for horizontal swipe met
        swipedir = (distX < 0) ? "left" : "right"; // if dist traveled is negative, it indicates left swipe
      }
      else if ((Math.abs(distY) >= threshold) && (Math.abs(distX) <= restraint)) { // 2nd condition for vertical swipe met
        swipedir = (distY < 0) ? "up" : "down"; // if dist traveled is negative, it indicates up swipe
      }
    }
    handleSwipe(swipedir);
    // e.preventDefault();
  }, false);
}

$(".carousel").carousel({
    interval: false
});

$(".nav li").on("click", function() {
  $("li.active").removeClass("active");
  $(this).addClass("active");
});

$(".nav li").on("click", function() {
  if ($("button.navbar-toggle").attr("aria-expanded")) {
    $(".navbar-collapse").collapse("hide");
  }
});

var scrollFactor = -0.2;
$(".slideWrapper").on("scroll", function() {
  $(this).parent().parent().css("background-position", "100% " + ($(this).scrollTop() * scrollFactor) + "px");
});

$(".rowImageWrapper a").on("click", function() {  
  $("#imageModalImage").attr("src", $(this).children().first().attr("src"));
});

$(".navbar-collapse").on("show.bs.collapse", function () {
  $(".overflowHidden").addClass("shrink");
});
$(".navbar-collapse").on("hide.bs.collapse", function () {
  $(".overflowHidden").removeClass("shrink");
})

try {
  document.createEvent("TouchEvent");
  swipeDetect(document.getElementById("myCarousel"), function (direction) {
    if (direction == "left") {
      $("#myCarousel").carousel("next");
      if ($("li.active").next().length == 0) {
        $(".nav li").first().addClass("active");
        $("li.active").last().removeClass("active");
      }
      else {
        $("li.active").next().addClass("active");
        $("li.active").first().removeClass("active");
      }
    }
    else if (direction == "right") {
      $("#myCarousel").carousel("prev");
      if ($("li.active").prev().length == 0) {
        $(".nav li").last().addClass("active");
        $("li.active").first().removeClass("active");
      }
      else {
        $("li.active").prev().addClass("active");
        $("li.active").last().removeClass("active");
      }
    }
  });
}
catch (e) {
  // desktop version, no touch events
}