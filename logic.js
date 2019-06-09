// Function to determine marker size based on population
function markerSize(population) {
  return population / 400;
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

// An array containing all of the information needed to create city and state markers
var home_sales = [
  {
    "date": "6/8/2019",
    "street_1": "20765 Saratoga Dr",
    "street_2": "",
    "city": "Fairview Park",
    "state": "OH",
    "zip": 44236,
    "sale_price": 500000,
    "lat": 41.44,
    "long": -81.85,
    "location": [41.44,-81.85]
  },
  {
    "date": "6/9/2019",
    "street_1": "1 Center Court",
    "street_2": "",
    "city": "Cleveland",
    "state": "OH",
    "zip": 44144,
    "sale_price": 200000,
    "lat": 41.49,
    "long": -81.68,
    "location": [41.49,-81.68]
  }
];

// Define arrays to hold created city and state markers
var sales_arr = [];
var total = 0
// Loop through locations and create city and state markers
for (var i = 0; i < home_sales.length; i++) {
  total = home_sales[i].sale_price + total
  // Setting the marker radius for the state by passing population into the markerSize function
  var color = "";
  var radius= "";
  if (home_sales[i].sale_price > 300000) {
    color = "yellow"
    radius = 500;
  }
  else if (home_sales[i].sale_price > 200000) {
    color = "blue"
    radius = 400;;
  }
  else if (home_sales[i].sale_price > 100000) {
    color = "green"
    radius = 300;;
  }
  else {
    color = "red"
    radius = 200;;
  }
  // Setting the marker radius for the city by passing population into the markerSize function
  sales_arr.push( 
    L.circle(home_sales[i].location, {
      fillOpacity: 0.75,
      color: "White",
      fillColor: color,
      radius: markerSize(home_sales[i].sale_price),
    })
    .bindPopup("<h4>" + home_sales[i].street_1 +"<br>"+ home_sales[i].street_2 +"<br>"+ home_sales[i].city+", "+
                      home_sales[i].state+" "+home_sales[i].zip+"</h4> <hr> <h5>Sale Price: " + formatter.format(home_sales[i].sale_price) + "</h5>")
  )};

// Define variables for our base layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

// Create two separate layer groups: one for cities and one for states
var cities = L.layerGroup(sales_arr);

// Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Satellite": satellite
};

// Create an overlay object
var overlayMaps = {
  "Sales": cities
};

// Define a map object
var myMap = L.map("map", {
  center: [41.445, -81.8155],
  zoom: 12,
  layers: [streetmap, cities]
});

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

console.log(total)
document.getElementById('output_tip').innerHTML = total;
