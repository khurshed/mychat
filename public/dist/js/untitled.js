


        if(!FeedPost.validatePost(formid)){
            return false;
        }  
        var formdata = new FormData(formid[0]);
        $('#postingbutton').show();
        $('#postbutton').hide();
        $('#post_loder').show();
        jQuery.ajax({
            type: 'POST',
            url: formid.attr('action'),
            datatype: 'json',
            data: formdata, // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false, // The content type used when sending data to the server.
            cache: false, // To unable request pages to be cached
            processData: false,
            beforeSend:function(){
            $('#feed-main-loader').show(); 
            $('#postingbutton').show();
            $('#postbutton').hide();            
            },
            success: function (response) {
                removecustomfields();
              
                if (response.status == "success") {
                     
                    $('#postingbutton').hide();
                    $('#postbutton').show();
                    $.emoticons.define(emoticonsIcon);
                    $('ul li[id^=imgli]').remove();
                    $('#post_img').attr('src', '').parents('.upload_img').hide();
                    $('#url_preview_image').attr('src', '').parents('.hotels-pack').hide();
                    $('input[name="attachedimage"]').val();
                    /************hide pdf box preview************/
                    $('li.add-pdf-btn').hide();
                    $('#choose-document').show();
                    $('#post-pdf-file').val('');
                    $('#document-preview').hide();
                    $("#document-icon").attr("src", "/images/pdf.png");
                    $('#document-name').text('');
                    $('#document-type').text('');
                    $('#postfeed_form_div').after(response.view);
                    $('#post-main-section'+response.postId).find('.book-hotel-box p').html(LinkifyUrlObj.UrlToLink($('#post-main-section'+response.postId).find('.book-hotel-box p').text()));
                    $('#post-main-section'+response.postId).find('.book-hotel-box p').html($.emoticons.replace($('#post-main-section'+response.postId).find('.book-hotel-box p').text()));
                    $('#postfeed_form_div').addClass('hide-unnecessary-part');
                    $('#postfeed_form_div').removeClass('make-visible');
                    $('#image_select').hide();
                    $('.highlight-shadow').fadeOut(300);
                    $('.comment_methods').children('.loaction-anchor').attr('data-on','');
                    $('#link_url').attr('href','');
                    $('#link_url').val('');
                    $('#type0').val(0);
                    $('#feedAtLat').val('');
                    $('#feedAtLng').val('');
                    $('#atPlace').val('');
                    $('#url_description_show').html('');
                    $('#url_description').val('');
                    $('#url_title_show').html('');
                    $('#url_title').val('');
                    $('#url_image').val('');
                    $('#url_embed').val('');
                    $('#site_url').val('');
                    $('#url_by_show').html('');
                    $('#link-box').val('');
                    $('#link-url').val('');
                    $('.location_after_selection .person-added').text('');
                    $('.location_after_selection .location-of-person').text('');
                    $('.location_after_selection').hide();
                    $('#selectator_person').children('.selectator_chosen_items').html('');
                    formid[0].reset();
                    if($(window).width() < 768){
                        $('#postfeed_form_div').addClass('hide-unnecessary-part web-to-mobile');
                        $('#postfeed_form_div .text_or_voice').height('auto');
                        //$('.back-shade').removeClass('make-visible');
                    }
                    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
                        type: 'iframe',
                        mainClass: 'mfp-fade',
                        removalDelay: 160,
                        preloader: true,
                        fixedContentPos: false
                    });
                   
                   
                } else {
                    $('#postingbutton').hide();
                    $('#postbutton').show();
                    $('#post-error').show().text(response.message);
                    $('ul li[id^=imgli]').remove();
                    $('#post_img').attr('src', '').parents('.upload_img').hide();
                    $('#url_preview_image').attr('src', '').parents('.hotels-pack').hide();
                    $('input[name="attachedimage"]').val();
                    /************hide pdf box preview************/
                    $('li.add-pdf-btn').hide();
                    $('#choose-document').show();
                    $('#post-pdf-file').val('');
                    $('#document-preview').hide();
                    $("#document-icon").attr("src", "/images/pdf.png");
                    $('#document-name').text('');
                    $('#document-type').text('');
                    $('#postfeed_form_div').addClass('hide-unnecessary-part');
                    $('#postfeed_form_div').removeClass('make-visible');
                    $('#image_select').hide();
                    $('#link_url').attr('href','');
                    $('#link_url').val('');
                    $('#type0').val(0);
                    $('#feedAtLat').val('');
                    $('#feedAtLng').val('');
                    $('#atPlace').val('');
                    $('#url_description_show').html('');
                    $('#url_description').val('');
                    $('#url_title_show').html('');
                    $('#url_title').val('');
                    $('#url_image').val('');
                    $('#url_embed').val('');
                    $('#site_url').val('');
                    $('#url_by_show').html('');
                    $('#link-box').val('');
                    $('#link-url').val('');
                    $('.location_after_selection .person-added').text('');
                    $('.location_after_selection .location-of-person').text('');
                    $('.location_after_selection').hide();
                    $('#selectator_person').children('.selectator_chosen_items').html('');
                    formid[0].reset();                    
                    $('.two-type-text').addClass('box_error');
                }
                $('.feed_select').selectator(); 
                $('#post_loder').hide();
                $('#feed-main-loader').hide();
                $('li.add-img-btn').not('li.add-img-btn:first').remove();
                $('li.add-img-btn').show();
                if(response.atPlace!='' && response.atLat!='' && response.atLong!=''){
                    googleMap(response.atLat,response.atLong,response.postId);
                }
                $(".image-gallery-album-feed").lightGallery({
                    speed: 800,
                    download: false,
                    fullScreen: false,
                    pager: false,
                    hash: false,
                    zoom: false,
                    scale: false,
                    actualSize: false,
                    autoplayControls: false

                });
                 if(response.admin.value == 1){                     
                      FeedPost.adminnotify(response.admin.id,response.admin.feed_type,response.admin.link);
                    }
                if(response.group_id > 0){
                 FeedPost.groupnotify(response.group_id,response.postId);  
                }    
            },
            error: function (e){
             removecustomfields();
             $('#postingbutton').hide();
             $('#postbutton').show();
             $('#feed-main-loader').hide();
             $('#feed-img-grd-preview').find('.uploaded-content.album-img').remove();
             $('li.add-img-btn').not('li.add-img-btn:first').remove();
             $('li.add-img-btn').show();
            }
        });
*/