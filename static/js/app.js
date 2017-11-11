$(function() {
   var searchTerm = $('#search-term')[0].value;
   var searchButton = $('#search-button');
   var cardArea = $('#card-area');

   searchButton.on('click', function(e) {
        e.preventDefault();
        var URL = 'http://127.0.0.1:3000/api/search/' + searchTerm;
        $.post(URL, function(data) {
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
                cardArea.append(htmlToAdd);
            });
            $('.go').on('click', function() {
                var id = $(this).attr('data-toggle');
                var toggles = $('[data-toggle="' + id +'"]');
                $.post('http://127.0.0.1:3000/api/toggle/' + id, function(res) {
                    console.log(res);
                    if (res.error) {
                        window.location = 'auth/twitter';
                        return;
                    }
                    toggles[1].innerHTML = res.newValue + ' going';
                    if (res.newValue === 0) {
                       toggles[0].className = 'go card-footer-item';
                    } else {
                       toggles[0].className += ' has-text-primary';
                    }
                });
            })
        })
   });
});