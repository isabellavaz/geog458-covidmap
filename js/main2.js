mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.5, // starting zoom
    center: [-100, 40], // starting center
    projection: 'albers' // make map albers projection 
});


const case_numbers = [5000, 20000, 40000],
    colors = ['rgb(255, 237, 160)', 'rgb(254, 178, 76)', 'rgb(240, 59, 32)'],
    radii = [5, 15, 20];


//map.on('load', function loadingData() {
map.on('load', function loadingdata() { //simplifying the function statement: arrow with brackets to define a function

    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('covidcount', {
        type: 'geojson',
        data: 'assets/covidcount.json',
    });

    map.addLayer({
            'id': 'covidcount-layer',
            'type': 'circle',
            'source': 'covidcount',
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [{
                            zoom: 5,
                            value: case_numbers[0]
                        }, radii[0]],
                        [{
                            zoom: 5,
                            value: case_numbers[1]
                        }, radii[1]],
                        [{
                            zoom: 5,
                            value: case_numbers[2]
                        }, radii[2]]
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [case_numbers[0], colors[0]],
                        [case_numbers[1], colors[1]],
                        [case_numbers[2], colors[2]]
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        },
        'waterway-label'
    );

    // click on tree to view magnitude in a popup
    map.on('click', 'covidcount-layer', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>County:</strong> ${event.features[0].properties.county}, ${event.features[0].properties.state}
                    <br><strong>Cases:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });

});

// create legend
const legend = document.getElementById('legend');

//set up legend case numbers and labels
var labels = ['<strong>COVID-19 Case Number </strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < case_numbers.length; i++) {
    vbreak = case_numbers[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');

}

// add the data source
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NY Times</a> </p>';

// combine all the html codes.
legend.innerHTML = labels.join('') + source;
