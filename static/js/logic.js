let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

d3.json(url).then(function(data) {
  createFeatures(data.features)
  
  });

function chooseColor(depth) {
    if (depth <= 1.0) return "#0264f7";
        else if (depth > 1.0 & depth <= 2.5) return "#eff702";
        else if (depth > 2.5 & depth <= 4.0) return "#e8a702";
        else if (depth > 4.0 & depth <= 5.5) return "#d65104";
        else if(depth > 5.5 & depth <= 8.0) return "#c20212";
        else if (depth > 8.0 & depth <= 20.0) return "#850101";
         else return "#E2FFAE";
    }


function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3> Location: " + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<br><h2> Magnitude: " + feature.properties.mag + "</h2>");
    }

    function createCircleMarker(feature, latlng){
        let options = {
        radius: feature.properties.mag*3,
        color: "#000",
        fillColor: chooseColor(feature.properties.mag),
        weight: 1, 
        opacity: 1, 
        fillOpacity: 0
        }
    }

    let quakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: createCircleMarker
    });


    createMap(quakes);
  };


function createMap(quakes) {
    
    let streetl = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let baseMaps = {
        "Street Level": streetl,
    };

    let overlayMaps = {
        Earthquakes: quakes
    };

    let myMap = L.map("map", {
        center: [
            37.00, -95.00
        ],
        zoom: 5,
        layers: [streetl, quakes]
        
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

    let legend = L.control({position: 'bottomright'});
      legend.onAdd = function() {
          let div = L.DomUtil.create('div', 'info legend');
            let depth = [1.0, 2.5, 4.0, 5.5, 8.0];
      
          for (let i = 0; i < depth.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
                  depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
          }
          return div;
       
          };
       legend.addTo(myMap);
       

}



  

