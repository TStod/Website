function scrollToCurrentPage() {
  var offset = $(window.location.hash + "NoScroll").offset();
  if (offset) {
    $(".xScrollWrapper").scrollLeft(offset.left);
  }
  else {
    $(".xScrollWrapper").scrollLeft(0);
  }
}

// Set the scroll property
// This takes care of not scrolling on window refresh
scrollToCurrentPage();

// Select the proper navigation bar item
$("li.active").removeClass("active");
if ($(".navbar-nav li a[href$=\"" + window.location.hash + "\"]").closest("li").addClass("active").length == 0) {
  $(".navbar-nav li:first-child").addClass("active");
}

// This is an attempt at pre-decoding images
// With the goal of removing scroll stutter 
$("img").each(function() {
  var src = $(this).attr("src");
  if (src !== "") {
    $('<img src="'+ src +'">').load(function() {
      $(this).width(1).height(1).appendTo(".imageBuffer");
    });
  }
});

// This is a similar function for use with background images
$(".item").each(function() {
  var src = $(this).css("background-image");
  if (src !== "none") {
    $('<img src="'+ src.split("\"")[1] +'">').load(function() {
      $(this).width(1).height(1).appendTo(".imageBuffer");
    });
  }
});

// On menu item click, minimize menu and scroll to target
$(".nav li").on("click", function() {
  scrollToPage($(this).index());
  if ($("button.navbar-toggle").attr("aria-expanded")) {
    $(".navbar-collapse").collapse("hide");
  }
});

// On image click open image modal with that image
$(".rowImageWrapper a").on("click", function() {  
  $(".imageModalImage").attr("src", $(this).children().first().attr("src"));
});

// On showing navigation bar make main body smaller
$(".navbar-collapse").on("show.bs.collapse", function () {
  $(".xScrollWrapper").addClass("shrink");
});

// On hiding navigation bar make main body bigger
$(".navbar-collapse").on("hide.bs.collapse", function () {
  $(".xScrollWrapper").removeClass("shrink");
});

// Scroll to a page by index
// Set hash and navigation item
function scrollToPage(index) {
  var mainWidth = $(".mainContent").width();
  $(".xScrollWrapper").stop().animate({
    scrollLeft: index * mainWidth
  }, 500, "swing", function (index) {
    $("li.active").removeClass("active");
    $($(".navbar-nav").children()[index]).addClass("active");
    window.location.hash = $("li.active a").attr("href");
  }(index));
};

// Scroll to a page after a touch is released
function scrollToNearestPage() {
  var mainWidth = $(".mainContent").width();
  var currentScroll = $(".xScrollWrapper").scrollLeft();
  var nearest = Math.floor((currentScroll + (mainWidth / 2)) / mainWidth);  
  scrollToPage(nearest);
};

// If touch events exist make us auto scroll to the nearest page
try {
  document.createEvent("TouchEvent");
  $(".xScrollWrapper").addEventListener("touchend", scrollToNearestPage);
}
catch (e) {
  // Desktop version, no touch events
}

// On resize scroll to current page
// Not working at the moment properly need to debug
$(window).resize(scrollToCurrentPage);

// Parallax effect for background
var scrollFactor = -0.25;
$(".xScrollWrapper").on("scroll", function () {
  $("#backgroundImage img").css("margin-left", $(this).scrollLeft() * scrollFactor);
});
var currentScrolls = {};
$(".yScrollWrapper").on("scroll", function () {
  var $that = $(this);
  currentScrolls[$that.index()] = $that.scrollTop();
  var totalScroll = 0;
  for (var key in currentScrolls) {
    totalScroll += currentScrolls[key];
  }
  $("#backgroundImage img").css("margin-top", totalScroll * scrollFactor);
});