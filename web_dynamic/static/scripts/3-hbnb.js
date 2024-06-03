$(document).ready(function () {
    // Object to keep track of selected amenities
    let amenities = {};

    // Listen for changes on each input checkbox tag
    $(document).on('change', "input[type='checkbox']", function () {
        const amenityId = $(this).data('id');
        const amenityName = $(this).data('name');

        // If the checkbox is checked, store the Amenity ID in the object
        if (this.checked) {
            amenities[amenityId] = amenityName;
        } else {
            // If the checkbox is unchecked, remove the Amenity ID from the object
            delete amenities[amenityId];
        }

        // Update the h4 tag inside the div Amenities with the list of Amenities checked
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

    // Load places using the API
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function (data) {
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
                </article>`;
                $('section.places').append(article);
            }
        }
    });
});
