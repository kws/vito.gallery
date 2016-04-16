// Load data
var gallery = JSON.parse(document.getElementById('gallery-data').textContent)
var tags = JSON.parse(document.getElementById('tags-data').textContent)

// Create image lookup and group into rows & columns
gallery.imageById = imageById = {};
gallery.images.forEach(function(image) {
	image._filename = image.id;
	image.id = parseInt(image.id);
	imageById[image.id] = image;
});

// Tags are by default 'by tag' - associate tags with their respective images
for (var tag in tags) {
  tags[tag].forEach(function(imageid) {
      var image = imageById[imageid];
      if (typeof image === 'undefined') {
      	console.error('Image not found: ' + imageid);
      	return;
      }
      var tagList = image.tags;
      if (!tagList) 
          image.tags = tagList = [];
      tagList.push(tag);
  });
}

// Set header
var headerImage = getRandomImageWithTag(gallery.images, 'header');
var headerUrl = gallery.imagefolder + "/" + headerImage._filename + ".jpg";

console.log("Loading header")
$('<img/>').attr('src', headerUrl).load(function() {
   console.log("header loaded...")
   $(this).remove(); 
   $('#intro-header .container').css('background-image', 'url(' + headerUrl + ')').fadeIn();
   renderGallery();
});


function renderGallery() {
  // Filter by tag 
  var tagSearch = getQueryVariable('tag'); 
  if (tagSearch) {
    gallery.images = gallery.images.filter(function(image){
    	return $.inArray(tagSearch, image.tags) >= 0;
    });
  }

  // Option to show labels
  gallery.showLabels = getQueryVariable('labels');

  // Arrange into rows & columns and then render
  makeRows(gallery, 4);
  var source   = document.getElementById("gallery-template").textContent;
  var template = Handlebars.compile(source);

  document.getElementById('content').innerHTML = template(gallery);

  var lightGallery = $('#content');
  lightGallery.lightGallery({
    selector: '.portfolio-item a',
    thumbnail: true
  }); 
  lightGallery.on('onAfterSlide.lg', function(event, prevIndex, index){
    _gs('track');
  });   
}

/**
  Populates the gallery.rows property with the images broken down
  by rows and columns (rows is an array of arrays). maxCols is the max
  number of rows per column.
*/
function makeRows(gallery, maxCols) {
  gallery.rows = imagesByRow = [], currentCol = [];
  gallery.images.forEach(function(image) {
    if (currentCol.length >= maxCols) currentCol = [];
    if (currentCol.length === 0) imagesByRow.push(currentCol);
    currentCol.push(image);
  });
}

/**
  Pick a random image from the array of images with tag 'tag'.

  Leave tag undefined to pick from all.
*/
function getRandomImageWithTag(images, tag){
  var images = typeof tag === 'undefined' ? images : 
    images.filter(function(image){return $.inArray(tag, image.tags) >= 0;});
  var randomPos = Math.floor(Math.random() * images.length);
  return images[randomPos];
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
         var pair = vars[i].split("=");
         if(pair[0] == variable){return pair[1];}
  }
  return(false);
}


