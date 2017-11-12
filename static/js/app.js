$(function() {
    var searchTerm;
    var searchButton = $('#search-button');
    var cardArea = $('#card-area');
    var spinner = $('#spinner');
    var requestInProgress = false;

    if (window.pass) {
        if (window.userSearch) {
            sendRequest(window.userSearch);
            $('#search-term')[0].value = window.userSearch;
        } else {
            var localSearch = localStorage.getItem('night-search');
            if (localSearch) {
                sendRequest(localSearch);
                $('#search-term')[0].value = localSearch;
            }
        }
    }

    searchButton.on('click', function(e) {
        searchTerm = $('#search-term')[0].value;
        localStorage.setItem('night-search', searchTerm);
        e.preventDefault();
        sendRequest(searchTerm);
    });

    $('#search-term').on('keydown', function(e) {
        if (e.which === 13) {
            searchTerm = $('#search-term')[0].value;
            localStorage.setItem('night-search', searchTerm);
            e.preventDefault();
            sendRequest(searchTerm);
        }
    });

    // Functions
    function sendRequest(query) {
        if (requestInProgress) {
            return;
        }
        cardArea.html('');
        requestInProgress = true;
        spinner.css('display', 'block');
        var URL = 'http://127.0.0.1:3000/api/search/' + query;
        $.ajax({
            type: "POST",
            url: URL,
            data: { search: query },
            success: processData
        });
    }

    function processData(data) {
        if (data.error) {
            cardArea.html('There are no records to show');
            requestInProgress = false;
            spinner.css('display', 'none');
            return;
        }

        data.forEach(business => {
            var htmlToAdd = '<div class="card">';
            htmlToAdd += '<div class="card-image">';
            htmlToAdd += '<figure class="image is-4by3">';
            htmlToAdd += '<img src="' + business.image_url + '" alt="">';
            htmlToAdd += '</figure>';
            htmlToAdd += '</div>';
            htmlToAdd += '<div class="card-content">';
            htmlToAdd += '<p class="title is-4">' + business.name  +'</p>';
            htmlToAdd += '<p class="subtitle"><small>' + business.address.join(' ') + '</small></p>';
            htmlToAdd += '<p>Rating: ' + business.ratings + ' / 5 ('+ business.review_count +' reviews)</p>';
            htmlToAdd += '</div>';
            htmlToAdd += '<div class="card-footer">';
            htmlToAdd += '<div class="card-footer-item">';
            htmlToAdd += '<i class="fa fa-map-marker" style="color: red"></i>';
            htmlToAdd += '</div>';
            htmlToAdd += '<div data-toggle="'+ business.business_id +'" class="go card-footer-item">';
            htmlToAdd += 'Going &nbsp <i class="fa fa-check"></i>';
            htmlToAdd += '</div>';
            htmlToAdd += '<div class="card-footer-item">';
            htmlToAdd += '<span data-toggle="'+ business.business_id +'" class="tag is-primary">' + business.going +' going</span>';
            htmlToAdd += '</div>';
            htmlToAdd += '</div></div>';
            spinner.css('display', 'none');
            cardArea.append(htmlToAdd);
            requestInProgress = false;
        });
        $('.go').on('click', function() {
            var id = $(this).attr('data-toggle');
            var toggles = $('[data-toggle="' + id +'"]');
            $.post('http://127.0.0.1:3000/api/toggle/' + id, { search: searchTerm }, function(res) {
                console.log(res);
                if (res.error) {
                    window.location = 'auth/twitter';
                    return;
                }
                toggles[1].innerHTML = res.newValue + ' going';
                if (!res.added) {
                    toggles[0].className = 'go card-footer-item';
                } else {
                    toggles[0].className += ' has-text-primary';
                }
            });
        })
    }
});