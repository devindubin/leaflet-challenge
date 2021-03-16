let endPoint = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'

var access_token = 'pk.eyJ1IjoiZGV2aW5kdWJpbiIsImEiOiJja21jZXdmOGkwOXFzMnBtbnNxczF2Z2ltIn0.x_i_x85g0VU6W_icp-iiNA'

d3.json(endPoint, function (data) {
  console.log(data)
  const metaEarth = data.metadata
  const features = data.features
  readQuake(features)
})
console.log(endPoint)
console.log('test')

function readQuake (earthquakeMeta) {
  let earthquakes = L.geoJSON(earthquakeMeta, {
      pointToLayer: function (earthquakeMeta, latlng) {
        var geojsonMarkerOptions = {
            radius: earthquakeMeta.properties.mag * 5,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: .75,
            fillOpacity: 0.8
        };
        return L.circleMarker(latlng, geojsonMarkerOptions)
      },
      onEachFeature: function (earthquakeMeta, layer) {
        return layer.bindPopup(`<b>Location:<b>${earthquakeMeta.properties.place} <b>Magnitude:<b>${earthquakeMeta.properties.mag}`);
      }
  })
  mapMaker(earthquakes)
};

function mapMaker (earthquakes) {
  let eventMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v11',
    accessToken: access_token
  })

  var mapThemap = L.map('map', {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [eventMap, earthquakes]
  })

    var overlayMap = {
    Earthquakes: earthquakes
  }

    L.control.layers(eventMap, overlayMap, {
    collapsed: false
  }).addTo(mapThemap)
}
