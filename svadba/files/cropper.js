var crop_size
var orig_size
var crop_type
var crop_numb
var temp_cont
var cropped
var orient = 1;
var crop_sized = false;
var ratio = 1;
var imra = 1;
var cropim;
var cim;
var h2anyloaded = false;
function loadScript(url, callback) {
    var script = document.querySelectorAll('script');
    for (var i = 0; i < script.length; i++) {
        if (script[i].src === url) {
            script = script[i];
            if (!script.readyState && !script.onload) {
                callback();
            } else { // script not loaded so wait up to 10 seconds
                var secs = 0, thisInterval = setInterval(function() {
                    secs++;
                    if (!script.readyState && !script.onload) {
                        clearInterval(thisInterval);
                        callback();
                    } else if (secs == 10) {
                        clearInterval(thisInterval);
                        console.log('could not load ' + url);
                    }
                }, 1000);
            }
            return;
        }
    }
    script = document.createElement('script');
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
                script.onreadystatechange = null;
                callback();
            }
        }
    } else {
        script.onload = function() {
            script.onload = null;
            callback();
        }
    }
    script.src = url;
}
function isHEIC(file) { // check file extension since windows returns blank mime for heic
    let x = file.type ? file.type.split('image/').pop() : file.name.split('.').pop().toLowerCase();

    return x == 'heic' || x == 'heif';
}

function h2a(file, resolve)
{
    heic2any({
        blob: file,
        toType: "image/jpg"
    }).then(function (convertedFile) {
        convertedFile.name = file.name.substring(0, file.name.lastIndexOf('.')) + '.jpeg';
        resolve(convertedFile);
    });
}

function convertHEIC(file) {
    return new Promise(function(resolve) {

        if (!isHEIC(file)) return resolve(file);
        if(typeof(heic2any) == 'undefined') {
            loadScript('/sitemaker/js/heic2any.min.js', function () {
                h2a(file,resolve);
            });
        }
        else
        {
            h2a(file,resolve);
        }
    });
}
function preCrop(file,cont,upinfo){
    $('body').toggleClass('ct-preloader',true)
    cropped = false;
    temp_cont = cont;
    imra = 1;

    var oReader = new FileReader();
    $('body').append('<div class="ct-jcrop_wrapper"><div class="ct-jcrop"><img id="ct-crop_preview"></div><div class="ct-bwrap ct-flex ct-gap-16 ct-flex-space_between"><div class="ct-button ct-button_secondary" id="stopCrop">Отменить</div><div class="ct-button" id="saveCrop">Сохранить</div></div></div>');
   if(upinfo.find('.ct-image_uploader-single').length > 0)
        {crop_numb = cont.siblings('.ct-image_cropper').data('photos-k');}
   else
        {crop_numb = cont.index();}

   crop_type = upinfo.data('for');

       if( crop_type == 'INTRO_PHOTO')
       {
           crop_numb = 'INTRO_PHOTO';
       }

    var curim = iframe.contents().find('[data-sm-src="' + crop_type + '"]');
    if(!curim || curim.length === 0)
        {curim = iframe.contents().find('img[data-sm-src="' + crop_type + '_'+crop_numb+'"]');}


    if(curim && curim.width()) {
        imra = curim.width()/curim.height();
    }


    oReader.onload = function(e) {
        var img = new Image();
        img.src = e.target.result;
        img.onload = function () {
            crop_sized = false;
            orient = 1;
            EXIF.getData(img, function(data) {
                orient = (EXIF.getTag(this, "Orientation") || 1);
            });
            cim = img;
            orig_size = {iw:img.width,ih:img.height,isw:$('.ct-jcrop').width(),ish:$('.ct-jcrop').height()}
            $('.ct-jcrop').toggleClass('ct-jcrop_horizontal',img.width >= img.height)
            $('.ct-jcrop').toggleClass('ct-jcrop_vertical',img.width < img.height)
            $('#ct-crop_preview').attr('src',img.src)

            $('#ct-crop_preview').Jcrop({
                boxWidth:$(window).innerWidth()/100*80,
                boxHeight:$(window).innerHeight()/100*80,
                aspectRatio: imra,
                setSelect : [0,0, $('.ct-jcrop').width(),$('.ct-jcrop').height()],
                onChange: setCoords,
                onSelect: setCoords
            },function(){
                var b= this.getBounds();
                orig_size.isw = $('.ct-jcrop').width();
                orig_size.ish = $('.ct-jcrop').height();
                ratio = orig_size.iw / b[0];
                $('body').toggleClass('ct-preloader',false)
            });

            img.remove()
        }
    }

   convertHEIC(file).then(function(filed) {
        oReader.readAsDataURL(filed);
   });
}
function setCoords(c)
{
        crop_size = {
            x: c.x + 2, y: c.y + 2,
            w: c.w - 2, h: c.h - 2
        };

        cropped = true;
}
function cropInit()
{
    $('.ct-image_preview:not(.ct-image_cropper):not(.ct-image_uploader)').toggleClass('ct-image_cropper',true);
}

$(document).on('click','#stopCrop',function(){
    $('.ct-jcrop_wrapper').remove();
    $('#secondPanel').removeClass('active').html('');
    $('.ct-sections_setup').html('');
    $('body').removeClass('waitforupload');
    $('.tmp-photo').remove();
    ifresize();
    loadSections();
})

$(document).on('click','#saveCrop',function(){
    $('body').toggleClass('ct-preloader',true)
    if(!cropped)
    {
        crop_size = {x:0,y:0,w:orig_size.isw,h:orig_size.ish}
    }
    var fd = new FormData();
        fd.append('crop_size',JSON.stringify(crop_size));
        fd.append('orig_size',JSON.stringify(orig_size));
        if(d_email =='usaisagreatcountry@gmail.com')
        {fd.append('img', $('#ct-crop_preview').attr('src'));}
        else
        {fd.append('img', $('.ct-jcrop img').attr('src'));}

        fd.append('crop_type',crop_type);
        fd.append('crop_numb',crop_numb);
        fd.append('action','cropimage');
        fd.append('ratio',ratio);
        fd.append('orient', orient);
    $.ajax({
        type: 'POST',
        url: ajax_url,
        cache: false,
        contentType: false,
        processData: false,
        data: fd,
        success: function (result) {
            var sta = false
            if(result != '0')
            {
                var newim = '';
                var ni = result.split('/sitemaker/');
                if(ni.length > 1)
                {
                    newim = ni[1];
                    var conta = '';


                   if($('.ct-image_uploader-info[data-for="' + crop_type + '"]').find('.ct-image_uploader-single').length > 0 || temp_cont == ''){
                       if(crop_type == 'INTRO_PHOTO')
                       {
                           if($('.ct-image_uploader-info[data-for="' + crop_type + '"] .ct-image_preview.ct-image_cropper[data-photos-k="'+crop_numb+'"]').length == 0)
                           {
                               $('.ct-image_uploader-info[data-for="' + crop_type + '"]').prepend('<li data-photos="tmp" class="ct-image_preview ct-image_cropper" data-photos-k="INTRO_PHOTO"></li>');
                           }

                           $('.ct-image_uploader-info[data-for="' + crop_type + '"] .ct-image_preview.ct-image_cropper[data-photos-k="'+crop_numb+'"]').attr('data-url','/' + newim).css('background-image','url("/sitemaker/'+newim+'")');
                       }

                       conta = $('.ct-image_uploader-info[data-for="' + crop_type + '"]').parents('.ct-panel_settings-page');
                       $('.ct-image_uploader-info[data-for="' + crop_type + '"] .ct-image_preview.ct-image_cropper[data-photos-k="'+crop_numb+'"]').attr('data-url','/' + newim).css('background-image','url("/sitemaker/'+newim+'")');
                   }
                   else
                   {
                       var that = temp_cont.find('input');
                       var upinfo =  temp_cont.parents('.ct-image_uploader-info')
                       var cnt = that.data('count');

                       var ko = upinfo.find('.ct-image_preview:not(.ct-image_uploader)').length;

                       conta = temp_cont.parents('.ct-panel_settings-page');
                       if(upinfo.find('.ct-image_uploader:not(.ct-image_uploader-origin)').length > 0)
                       {
                           temp_cont.replaceWith('<li class="ct-image_preview ct-image_cropper" data-url="/' + newim + '" data-photos-k="' + (Number(ko) + 1) + '" style="background-image: url(/sitemaker/' + newim + ')"><span></span><i></i></li>');
                       }
                       else
                       {
                           if (ko < cnt) {
                               that.parents('.ct-image_uploader').before('<li class="ct-image_preview" data-photos="tmp" data-photos-k="' + (Number(ko) + 1) + '" data-url="/' + newim + '" style="background-image: url(/sitemaker/' + newim + ')"><span></span></li>')
                           }
                       }

                       // temp_cont.replaceWith('<li class="ct-image_preview ct-image_cropper" data-url="/' + newim + '" style="background-image: url(/sitemaker/' + newim + ')"><span></span><i></i></li>');
                   }
                    if(crop_type != 'INTRO_PHOTO') {
                        if (!conta.hasClass('active') && !$('#secondPanel').hasClass('active')) {
                            conta.find('.submit_current').click();
                        } else {
                            checkUploader(upinfo);

                            // $('.ct-panel_settings-page.active .submit_current').toggleClass('active',true);
                        }
                    }

                    $('.ct-jcrop_wrapper').remove();
                    sta = true;
                }
            }

            if(!sta)
            {
                alert('Проблема с картинкой! Попробуйте еще раз')
            }

            $('body').toggleClass('ct-preloader',false)
        }
    })
})

// $(document).on('click','.ct-image_cropper b',function(){
//     var par = $(this).parent();
//     var p = par.data('url');
//     crop_numb = par.data('photos-k');
//     crop_type = par.parents('.ct-image_uploader-info').data('for')
//     temp_cont = '';
//     $('.ct-jcrop_wrapper').remove();
//     var img = new Image();
//         img.onload = function(){
//             orig_size = {iw:img.width,ih:img.height,isw:$('.ct-jcrop').width(),ish:$('.ct-jcrop').height()}
//             $('.ct-jcrop').toggleClass('ct-jcrop_horizontal',img.width >= img.height)
//             $('.ct-jcrop').toggleClass('ct-jcrop_vertical',img.width < img.height)
//         }
//         img.src = '/sitemaker' + p;
//
//     $('body').append('<div class="ct-jcrop_wrapper"><div class="ct-jcrop"><img src="/sitemaker'+p+'"></div><div class="ct-button" id="saveCrop">Сохранить</div><div class="ct-button ct-button_secondary" id="stopCrop">Отменить</div></div>');
//     var cropim = $('.ct-jcrop img').Jcrop({
//         setSelect: [0, 0, $('.ct-jcrop').width(), $('.ct-jcrop').height()],
//         onSelect: function (c) {
//             crop_size = {
//                 x: c.x, y: c.y,
//                 w: c.w, h: c.h
//             };
//             orig_size.isw = $('.ct-jcrop').width();
//             orig_size.ish = $('.ct-jcrop').height();
//             // $('.ct-jcrop_wrapper .ct-hidden').removeClass('ct-hidden');
//             cropped = true;
//         }
//     });
// })