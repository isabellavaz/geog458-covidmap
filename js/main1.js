mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.5, // starting zoom
    center: [-100, 40], // starting center
    projection: 'albers' // make map albers projection

});

async function geojsonFetch() {
    // other operations
    let response = await fetch('../assets/covidrates.json');
    let covidrates = await response.json();


    //load data to the map as new layers.
    //map.on('load', function loadingData() {
    map.on('load', function loadingdata() { //simplifying the function statement: arrow with brackets to define a function

        // when loading a geojson, there are two steps
        // add a source of the data and then add the layer out of the source
        map.addSource('covidrates', {
            type: 'geojson',
            data: covidrates
        });

        map.addLayer({
            'id': 'covidrates-layer',
            'type': 'fill',
            'source': 'covidrates',
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'fill-color': [
                    'step',
                    ['get', 'rates'],

                    '#FFEDA0', // stop_output_0
                    10, // stop_input_0
                    '#FED976', // stop_output_1
                    20, // stop_input_1
                    '#FEB24C', // stop_output_2
                    50, // stop_input_2
                    '#FD8D3C', // stop_output_3
                    100, // stop_input_3
                    '#FC4E2A', // stop_input_4
                    200, // stop_input_4
                    '#E31A1C', // stop_output_5
                    500, // stop_input_5
                    "#BD0026", // stop_output_6
                    1000, // stop_input_6
                    "#800026", // stop_output_7

                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }




        });

        const layers = [
            '0-9',
            '10-19',
            '20-49',
            '50-99',
            '100-199',
            '200-499',
            '500-999',
            '1000+'
        ];
        const colors = [
            '#FFEDA070',
            '#FED97670',
            '#FEB24C70',
            '#FD8D3C70',
            '#FC4E2A70',
            '#E31A1C70',
            '#BD002670',
            '#80002670'
        ];


        // create legend
        const legend = document.getElementById('legend');
        // add the data source
        const source =
            '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NY Times</a> </p>';
        legend.innerHTML = "<b>COVID-19 Rates in the U.S.<br>(cases in 1,000 people)" + source;

        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });

        map.on('mousemove', (event) => {
            const crates = map.queryRenderedFeatures(event.point, {
                layers: ['covidrates-layer']
            });
            document.getElementById('text-description').innerHTML = crates.length 
            ? `<h3>${crates[0].properties.county} County</h3><p><strong><em>${crates[0].properties.rates}</strong> cases per 1000 people</em></p>` :
                `<p>Hover over a county!</p>`;
        });

    });

};

geojsonFetch();