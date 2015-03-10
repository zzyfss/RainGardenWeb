// Map
var map;
// Mainly used to store the location of map center
var map_center_lat = 39.5;
var map_center_lng = -98.35;
// Saved zoom level
var zoom_level = 4;
// Saved Zoom level
var map_typeID = google.maps.MapTypeId.ROADMAP;
// Map markers
var add_marker;
var search_marker;
// Last address which user entered
var last_address;
// Infowindow along with add_marker
var infoWindow = new google.maps.InfoWindow();

var geocoder = new google.maps.Geocoder();

/* Latlng of the facility to be added.
  they will be used in add.js*/
var add_lat;
var add_lng;

var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
    (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));

if (isMobile) {
  $("meta[name=viewport]")
  .prop('content', 'initial-scale=1.0, user-scalable=no');
}

/** Set up view for map and search box*/
function mapInit() {

  google.maps.visualRefresh = false;

  var mapDiv = document.getElementById('googft-mapCanvas');

  mapDiv.style.width = '100%';
  mapDiv.style.height = '100%';

  var center = new google.maps.LatLng(map_center_lat, map_center_lng);

  map = new google.maps.Map(mapDiv, {
    center: center,
    zoom: zoom_level,
    mapTypeId: map_typeID
  });

  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend-open'));
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend'));

  layer = new google.maps.FusionTablesLayer({
    map: map,
    heatmap: { enabled: false },
    query: {
      select: "col2",
      from: "1AR61AoqCN13Xe-VL6QgxkkNAK_TykMDQ_VEV6Pvg",
      where: ""
    },
    options: {
      styleId: 3,
      templateId: 4
    },
    styles: [{
      where: "Type = 'Rain garden'",
      markerOptions: {
        iconName: "small_red"
      }
    }, {
      where: "Type = 'Rain barrel'",
      markerOptions: {
        iconName: "small_purple"
      }
    }]
  });

  /* Set a listener for right-click event */
  google.maps.event.addListener(map, 'rightclick',
                                function(event) {

                                  // Hide previous one
                                  if(add_marker){
                                    infoWindow.close();
                                    add_marker.setVisible(false);
                                  }

                                  /* Set a marker for adding facility */
                                  add_marker = new google.maps.Marker({
                                    map : map,
                                    position: event.latLng,
                                    draggable : true,
                                    visible:true,
                                    animation: google.maps.Animation.DROP,
                                    icon: 'blue-dot.png'
                                  });

                                  // Update lat lng of the facility to be added
                                  add_lat = event.latLng.lat();
                                  add_lng = event.latLng.lng();

                                  /* Set a listener to add_marker
    to record latLng of the facility to be added. */
                                  google.maps.event.addListener(add_marker, "dragend", function(){
                                    var add_pos = add_marker.getPosition();
                                    add_lat = add_pos.lat();
                                    add_lng = add_pos.lng();
                                  });

                                  // Set infoWindow
                                  infoWindow.setContent($('#add-info-window').html());
                                  infoWindow.open(map,add_marker);

                                  $('#cancel-btn').on("click", function(){
                                    add_marker.setVisible(false);
                                    infoWindow.close();
                                  });

                                  google.maps.event.addListener(infoWindow, "closeclick", function(){
                                    add_marker.setVisible(false);
                                    this.close();
                                  });



                                });


  /* Set listeners to save map state */
  google.maps.event.addListener(map, "center_changed", function(){
    var mc = map.getCenter();
    map_center_lat = mc.lat();
    map_center_lng = mc.lng();

    // Reset last_address to enable next search
    last_address = "";
  });

  google.maps.event.addListener(map, "zoom_changed", function() {
    zoom_level = map.getZoom();
  });

  google.maps.event.addListener(map, "maptypeid_changed", function(){
    map_typeID = map.getMapTypeId();
  });

  if (isMobile) {
    var legend = document.getElementById('googft-legend');
    var legendOpenButton = document.getElementById('googft-legend-open');
    var legendCloseButton = document.getElementById('googft-legend-close');
    legend.style.display = 'none';
    legendOpenButton.style.display = 'block';
    legendCloseButton.style.display = 'block';
    legendOpenButton.onclick = function() {
      legend.style.display = 'block';
      legendOpenButton.style.display = 'none';
    }
    legendCloseButton.onclick = function() {
      legend.style.display = 'none';
      legendOpenButton.style.display = 'block';
    }
  }

};



function search(address){

  if(last_address === address){
    return;
  }

  var request = {
    address : address
  }

  // Set the previous one to be invisible
  if(search_marker){
    search_marker.setVisible(false);
  }

  geocoder.geocode(request,function(results, status){
    if(status == google.maps.GeocoderStatus.OK){
      var pos = results[0].geometry.location;

      map.setCenter(pos);
      if (results[0].geometry.viewport)
        map.fitBounds(results[0].geometry.viewport);
      else
        map.setZoom(16);

      /* Set a marker for search result */
      search_marker = new google.maps.Marker({
        map : map,
        draggable : false,
        visible:true,
        animation: google.maps.Animation.DROP,
        position: pos
      });

      last_address = address;
    }
    else{

      $("#search").popover('show');
      setTimeout(function(){
        $('#search').popover('hide');
      },5000);
    }

  });
};


/** Set up views for home page */
function homeInit(){

  // Initialize the map
  mapInit();
  // Initialize the 'add' modal
  addInit();

  // Set up search box
  $("#search-btn").on("click",function(){
    var input = $("#search-box").val();

    if(input){
      search(input);
    }
  });

  $('#search-box').keypress(function (e) {
    if(e.keyCode==13){
      search($(this).val());
      $(this).blur();
      return false;
    }
  });

};
