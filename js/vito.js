// Load data
var gallery = JSON.parse(document.getElementById('gallery-data').textContent)
var tags = JSON.parse(document.getElementById('tags-data').textContent)

// Create image lookup and group into rows & columns
var imageById = {};
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
var headerImages = gallery.images.filter(function(image){return $.inArray('header', image.tags) >= 0;});
var headerImage = headerImages[Math.round(Math.random()*headerImages.length)];
var headerUrl = gallery.imagefolder + "/" + headerImage._filename + ".jpg";
document.getElementById("intro-header").style.backgroundImage = "url('" + headerUrl + "')";

// Filter by tag 
var tagSearch = getQueryVariable('tag'); 
if (tagSearch) {
  gallery.images = gallery.images.filter(function(image){
  	return $.inArray(tagSearch, image.tags) >= 0;
  });
}

// Arrange into rows & columns
gallery.rows = imagesByRow = [], currentCol = [];
gallery.images.forEach(function(image) {
	if (currentCol.length >= 4) currentCol = [];
	if (currentCol.length === 0) imagesByRow.push(currentCol);
	currentCol.push(image);
});


var source   = document.getElementById("gallery-template").textContent;
var template = Handlebars.compile(source);

document.getElementById('content').innerHTML = template(gallery);

var gallery = $('#content');
gallery.lightGallery({
  selector: '.portfolio-item a',
  thumbnail: true
}); 
gallery.on('onAfterSlide.lg', function(event, prevIndex, index){
  _gs('track');
});   




function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
