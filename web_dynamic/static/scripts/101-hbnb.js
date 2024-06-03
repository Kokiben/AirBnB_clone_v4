$(document).ready(function () {
    // Objects to keep track of selected amenities, states, and cities
    let amenities = {};
    let states = {};
    let cities = {};

    // Listen for changes on each input checkbox tag for amenities
    $(document).on('change', "input[type='checkbox']", function () {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const category = $(this).closest('div').hasClass('amenities') ? 'amenities' :
                         $(this).closest('div').hasClass('locations') && $(this).closest('ul').prev().is('h3') ? 'states' : 'cities';

        // If the checkbox is checked, store the ID in the respective object
        if (this.checked) {
            if (category === 'amenities') amenities[id] = name;
            if (category === 'states') states[id] = name;
            if (category === 'cities') cities[id] = name;
        } else {
            // If the checkbox is unchecked, remove the ID from the respective object
            if (category === 'amenities') delete amenities[id];
            if (category === 'states') delete states[id];
            if (category === 'cities') delete cities[id];
        }

        // Update the h4 tag inside the div Locations and div Amenities with the list of selected filters
        let locationsList = [...Object.values(states), ...Object.values(cities)];
        if (locationsList.length > 0) {
            $('div.locations > h4').text(locationsList.join(', '));
        } else {
            $('div.locations > h4').html('&nbsp;');
        }

        let amenitiesList = Object.values(amenities);
        if (amenitiesList.length > 0) {
            $('div.amenities > h4').text(amenitiesList.join(', '));
        } else {
            $('div.amenities > h4').html('&nbsp;');
        }
    });

    // Check the status of the API
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
        if (data.status === "OK") {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Function to load places using the API
    function loadPlaces(filters = {}) {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(filters),
            success: function (data) {
                $('section.places').empty();
                for (let place of data) {
                    let article = `<article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${place.max_guest != 1 ? 's' : ''}</div>
                            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms != 1 ? 's' : ''}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? 's' : ''}</div>
                        </div>
                        <div class="description">
                            ${place.description}
                        </div>
                        <div class="reviews">
                            <h2>Reviews <span data-id="${place.id}" class="toggle-reviews">show</span></h2>
                            <div class="review-list"></div>
                        </div>
                    </article>`;
                    $('section.places').append(article);
                }
            }
        });
    }

    // Initial load of places
    loadPlaces();

    // Filter places based on selected amenities, states, and cities
    $('button').click(function () {
        let filters = {
            amenities: Object.keys(amenities),
            states: Object.keys(states),
            cities: Object.keys(cities)
        };
        loadPlaces(filters);
    });

    // Toggle reviews on click
    $(document).on('click', '.toggle-reviews', function () {
        let span = $(this);
        let placeId = span.data('id');
        let reviewList = span.closest('div.reviews').find('.review-list');

        if (span.text() === '
