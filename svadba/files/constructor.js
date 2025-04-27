var inp;
var cursect = 0;
var sections = [];
var offsections = [];
let ajax_url = '/sitemaker/ajax_alpha.php';
let template_val = {};
let template_data = {};
let data_value = {};
var iframe = $('iframe');
var tplwrapper = $('.ct-template_wrapper');
var ifh = iframe.height();
var ifw = iframe.width();
var checkCook;
var grayscales = {};
var cursort_template = 0;
var recursiveSearch;
var possibilities = [];
var filter_options = [];
var pre_sect = 0;
var pers_block_available = 0;
var psending = false;
var pres_timer;
var current_own = -1;
var dweeks = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
var tmonths = ['Январь' , 'Февраль' , 'Март' , 'Апрель' , 'Май' , 'Июнь' , 'Июль' , 'Август' , 'Сентябрь' , 'Октябрь' , 'Ноябрь' , 'Декабрь' ];
var tmonthsr = [ 'Января' , 'Февраля' , 'Марта' , 'Апреля' , 'Мая' , 'Июня' , 'Июля' , 'Августа' , 'Сентября' , 'Октября' , 'Ноября' , 'Декабря' ];

var tmonths_ln = ['January' , 'February' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'December' ];

var image_fields = ['COVER_PHOTO','BRIDE_PHOTO','GROOM_PHOTO','TIMING_PHOTO', 'SPLASH', 'STORY_PHOTO', 'HELLO_PHOTO_ONE', 'LOCATION_PHOTO', 'PHOTO_ONE', 'TIMING_PHOTO', 'DATETIME_PHOTO_ONE', 'WISH_PHOTO_ONE', 'HELLO_PHOTO', 'TIMER_PHOTO_ONE', 'CONTACTS_PHOTO_ONE', 'ANKETA_PHOTO_ONE', 'BYE_PHOTO_ONE'];  //Одно фото

var galleries = ['MAIN_GALLERY','DRESSCODE_GIRLS_GALLERY','DRESSCODE_GUYS_GALLERY', 'LOCATION_GALLERY', 'CONTACT_PHOTO'];  // галлереи в сетки

var gallery_items = ['MAIN_GALLERY_ITEMS','DRESSCODE_GIRLS_GALLERY_ITEMS','DRESSCODE_GUYS_GALLERY_ITEMS','LOCATION_GALLERY_ITEMS', 'HELLO_PHOTO_ITEMS', 'CONTACT_PHOTO_ITEMS', 'LOCATION_PHOTO_ITEMS', 'COVER_PHOTO_ITEMS',  'STORY_PHOTO_ITEMS','ANKETA_PHOTO_ITEMS', 'OWN_IMAGES'];  //Одиночные в галлереи

var text_items = ['WISH_TEXT_ITEMS','TIMING_1','TIMING_2','TIMING_3','TIMING_4', 'TIMING_DESC', 'ANKETA_DRINKS', 'LOCATION_TIMING'];

$('.ct-switch_template').click(function(){
    $('.ct-panel_settings-page').removeClass('active')
    $('#mainPanel').toggleClass('active',true);
    $('#selectTpl').toggleClass('active',true);
})
//Проверка домена
$(document).on('input','.ct-domain_check', function(){
    this.value = this.value.replace(/[^a-z0-9.\-]/gi,'');
    var dotcheck = this.value.split('.ru');
    var domain = dotcheck[0].split('.').join('-');
    domainCheckHandler(domain);
})

$(document).on('input','.ct-phone_check', function(){
    this.value = this.value.replace(/[^0-9()+\-]/gi,'');
    //var phone = this.value;
})

$(window).on('resize',function(){ifresize()})
function ifresize() {
    tplwrapper.css('transform', 'scale(1)')
    iframe.css('transform', 'scale(1)').css('height', '100%').css('width', '100%').css('margin-top', 0).css('margin-left', 0);
    var ifh = 875;
    var ifw = 425;
    var mw = 390;

    if (!tplwrapper.hasClass('ct-iphone-wrapper')) {
        if($(window).innerWidth() > 768) {
            mw = 1920;
        }
        ifw = iframe.width();
        ifh = iframe.height();
    }

    var is1 = $('.ct-template_container').innerWidth() / mw
    var nifw = ifw / is1;
    var nifh = ifh / is1;
    var mt = (ifh - nifh) / 2
    var ml = (ifw - nifw) / 2
    if (!tplwrapper.hasClass('ct-iphone-wrapper')) {
        if($(window).innerWidth() <= 768) {
            nifw = mw;
            nifh = Math.ceil(ifh / is1);
            mt = Math.ceil((ifh - nifh) / 2)
            ml = Math.ceil((ifw - nifw) / 2)
        }

        iframe.css('transform', 'scale(' + is1 + ')').css('height', nifh).css('width', mw).css('transform-origin', 'top, left').css('margin-top', mt).css('margin-left', ml)
    }
    else
    {
        is1 = $(window).innerHeight() / (885 * 1.25);
        $('.ct-iphone-wrapper').css('transform', 'scale(' + is1 + ')').css('transform-origin', 'center');
    }

    if(typeof($('[name="contact_link"]')) != 'undefined' && $('[name="contact_link"]').parents('.ct-panel_settings-page.active').length > 0)
    {
        if((data_value['CONTACTS_LINK'].value == '' || data_value['CONTACTS_LINK'].value == 'wedwed_russia') && data_value['CONTACTS_LINK'].type != '5')
        {
            $('[name="contact_link"]').val('');
            $('.ct-panel_settings-page.active .submit_current').toggleClass('active',true);
        }
    }
}

$('.ct-edit_template').click(function(){
    if($(this).hasClass('ct-mob-menu-icon')){
            if($('#secondPanel.active').length > 0){
                $('#secondPanel').removeClass('active')
                $('.ct-panel_sub').removeClass('active');
            }
            else
            {
                $('#mainPanel').toggleClass('active', true);
                // if($('#mainPanel').hasClass('active'))
                // {
                $('#mainPanel .ct-panel_settings-page').toggleClass('active',false);
                $('#mainSettings').toggleClass('active',true);
                // }
            }
        $('#mainPanel').scrollTop(0);
    }
    else {
        $('#mainPanel').toggleClass('active', true);
        $('#secondPanel').toggleClass('active', false);
        $('.ct-panel_settings-page').removeClass('active');
        $('#mainSettings').toggleClass('active', true);
        ifresize();
        }
})

$(document).on('click','.ct-panel_close',function(){
    if($(this).parents('.ct-pleasepay').length > 0)
    {
        $('.ct-pleasepay').removeClass('active');
    }
    else {
        $(this).parents('.ct-panel:first').removeClass('active');
        $('.ct-panel_sub').removeClass('active');
        ifresize();
    }
})


$(document).on('click','.ct-color-wrapper .ct-color-remove',function(){
    var p = $(this).parents('.ct-color-wrapper');
    var parent = $(this).parents('.ct-colors-wrapper');
    if(parent.find('.ct-color-wrapper').length > 1)
    {
        p.remove();
        $('.ct-panel_settings-page.active .submit_current').toggleClass('active',true);
    }
    parent.find('.ct-color-remove').toggleClass('ct-hidden',parent.find('.ct-color-wrapper').length <= 1)
})

$(document).on('click','.ct-color-wrapper .ct-color-add',function(){
    $(this).parents('.ct-colors-wrapper').append($(this).parent().clone())
    var parent = $(this).parents('.ct-colors_wrapper');
    parent.find('.ct-color-remove').toggleClass('ct-hidden',parent.find('.ct-color_wrapper').length <= 1)
    $('.ct-panel_settings-page.active .submit_current').toggleClass('active',true);
})

$(document).on('input','input[type="color"]',function(event) {
    $(this).parent().find('span.ct-color').removeClass('empty').css('background-color',$(this).val());
});

$('input[name="ct-device"]').on('change',function(){
    tplwrapper.toggleClass('ct-iphone-wrapper',$(this).val() > 0)
    ifresize();
})

ifresize();

$('#setupBlock').click(function(){
    $('#secondPanel').toggleClass('active',true);
    $('#secondPanel .ct-panel_settings-page').removeClass('active')

    $('#secondPanel .ct-panel_settings-page[data-section="'+(cursect + 1)+'"]').addClass('active')
    $('#mainPanel').toggleClass('active',false);
    ifresize();
})

$(document).on('input','.ct-input',function(){
    var p = $(this).parents('.ct-panel_settings-page[data-section]')
    if(p.length > 0)
        {
            p.find('.submit_current').toggleClass('active',true);
        }
})

$('.ct-button_ask').click(function(){
    $('#mainPanel .ct-panel_settings-page').removeClass('active')
    $('#askSupport').toggleClass('active',true);
    $('#mainPanel').scrollTop(0);
})

$('.ct-present').click(function(){

    if(present_view !== false) {
        $.post(ajax_url, {action: 'present'}, function () {
            present_view = false;
            clearTimeout(pres_timer);
        });
    }
})

$(document).on('click','.ct-tpl_selector-item_body',function(){
    $('.ct-tpl_selector-item').removeClass('active')
    $(this).parent().addClass('active');

    setPrice()

    var tpl = $(this).parent().data('tpl');
    var col = $(this).parent().find('.ct-tpl_selector-item_footer-colors li.active').index() + 1;
    var atype = $('#anim_type .ct-input_select-current').attr('data-id');
    var aspeed = $('#anim_speed .ct-input_select-current').attr('data-id');
    var hfont = $('#hfont .ct-input_select-current').attr('data-id');
    var tfont = $('#tfont .ct-input_select-current').attr('data-id');
    var noneedtoask = true;

    if(tpl != template_val.id)
    {
        if($('.ct-cancel.active').length > 0){
            noneedtoask = false;
            presaveTpl(tpl, col, atype, aspeed, hfont, tfont)
        }
    }

    if(noneedtoask)
    {
        presaveTpl(tpl, col, atype, aspeed, hfont, tfont)
    }
})

$(document).on('click','.ct-tpl_selector-item_footer .ct-button, .ct-tpl_selector-item_footer span',function(){
    var titem = $(this).parents('.ct-tpl_selector-item')
    $('.ct-tpl_selector-item').removeClass('active')
    titem.toggleClass('active',true);

    setPrice()

    var tpl =  titem.data('tpl');
    var col =  titem.find('.ct-tpl_selector-item_footer-colors li.active').index() + 1;
    var atype = $('#anim_type .ct-input_select-current').attr('data-id');
    var aspeed = $('#anim_speed .ct-input_select-current').attr('data-id');
    var hfont = $('#hfont .ct-input_select-current').attr('data-id');
    var tfont = $('#tfont .ct-input_select-current').attr('data-id');
    var noneedtoask = true;

    if(tpl != template_val.id)
    {
        if($('.ct-cancel.active').length > 0){
            noneedtoask = false;
            presaveTpl(tpl, col, atype, aspeed, hfont, tfont)
        }
    }

    if(noneedtoask)
    {
        presaveTpl(tpl, col, atype, aspeed, hfont, tfont)
    }
})



$(document).on('mouseover','.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li',function(){
    var col = $(this).index() + 1;
    iframe.contents().find('body').removeClass().toggleClass('sm-color' + col,true);
})
$(document).on('mouseout','.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li',function(){
    var col = $(this).parents('.ct-tpl_selector-item_footer-colors').find('li.active').index() + 1;
    iframe.contents().find('body').removeClass().toggleClass('sm-color' + col,true);
})

$(document).on('click','.ct-tpl_selector-item_footer-colors li',function(){
    $('.ct-tpl_selector-item').removeClass('active')
    $(this).parents('.ct-tpl_selector-item').toggleClass('active',true);

    setPrice();
    $(this).parent().find('li').removeClass('active');
    $(this).toggleClass('active',true);

    var tpl = $(this).parents('.ct-tpl_selector-item').data('tpl');
    var col = $(this).index() + 1;
    var atype = $('#anim_type .ct-input_select-current').attr('data-id');
    var aspeed = $('#anim_speed .ct-input_select-current').attr('data-id');
    var hfont = $('#hfont .ct-input_select-current').attr('data-id');
    var tfont = $('#tfont .ct-input_select-current').attr('data-id');

    presaveTpl(tpl, col, atype, aspeed, hfont, tfont);
})

$('.ct-menu li').click(function(){

    if($(this).hasClass('ct-menu-icon_active'))
    {
        $(this).removeClass('ct-menu-icon_active')
    }
    var sect = $(this).data('item');
    $('#mainPanel .ct-panel_settings-page').removeClass('active');
    $('#' + sect).toggleClass('active',true)
    if(sect == 'customizeView'){
        if($('.ct-hello_wrapper').length > 0 && !$('.ct-hello_items').hasClass('slick-initialized'))
        {
            var h = $('.ct-hello_items').attr('data-current');
            var helloInit = $('.ct-hello_item[data-id="'+h+'"]').index();
            $('.ct-hello_items').slick({
                slidesToShow: 3,
                // arrows: false,
                variableWidth:true,
                infinite: false,
                swipeToSlide: true,
                touchMove: false,
                initialSlide: helloInit,
                centerMode: true,
            }).on('setPosition', function(){
                var did = $('.ct-hello_items .slick-current .ct-hello_item').attr('data-id');
                $('.ct-hello_edit').toggleClass('ct-hidden', did == '0');
                if(h != did) {
                    h = did;
                    resetIntro()
                    checkIntroData();
                }
            });
        }
    }
})

$('.ct-hello_edit').click(function(e){
    e.preventDefault();
    $(this).toggleClass('active');
    if($(this).hasClass('active')) {
        checkIntroData();
    }
    else
    {
        $('.ct-hello_data').toggleClass('active',false);
    }
    return false;
})

$('#intro_reset').click(function(){
    resetIntro()
    checkIntroData();
})

$('#intro_save').click(function(){
    saveIntro(true);
})

$('.ct-hello_submit').click(function(e){
    e.preventDefault();
    resetIntro()
    checkIntroData();
    saveIntro(true);
    return false;
})

$('.ct-panel_back').click(function(){
    if($(this).parents('#filterTpl').length > 0)
    {
        $('#filterTpl').toggleClass('active', false);
        $('#selectTpl').toggleClass('active',true)
    }
    else
    {
        $('#mainPanel .ct-panel_settings-page').removeClass('active');
        $('#mainSettings').toggleClass('active', true)
    }
})




$(document).on('click', '.ct-input_select', function(){
    $(this).toggleClass('active');
    if(($(this).attr('id') == 'hfont' || $(this).attr('id') == 'tfont') && !$(this).hasClass('inited')){
        $(this).addClass('inited')
        $.each($(this).find('li'),function(){
            var svg = $(this).attr('data-file');
            $(this).append('<img src="/sitemaker/css/fontcss/'+svg+'.svg">');
        })
    }
})

$(document).on('click','.ct-input_select li', function(){
    $(this).parents('ul').find('li').removeClass('ct-input_select-current');
    $(this).addClass('ct-input_select-current');
    $(this).parents('.ct-input_select').find('span').text($(this).text());

    if($(this).parents('.ct-input_select').prop('id') == 'introd')
    {
        var did = $(this).attr('data-id');
        $.post(ajax_url,{action:'setintro',iid:did}, function(data)
        {

        })
    }

    if($(this).parents('.ct-input_select').prop('id') == 'music')
    {
        var did = $(this).attr('data-id');
        $.post(ajax_url,{action:'setmus',mid:did}, function(data)
        {

        })
    }


    if($.inArray($(this).parents('.ct-input_select').prop('id'),['hfont','tfont','anim_speed','anim_type']) !== -1)
    {
        var key = '';

        if($(this).parents('.ct-input_select').prop('id') == 'hfont')
        {
            key = 'headerStyle';
        }
        else if($(this).parents('.ct-input_select').prop('id') == 'tfont')
        {
            key = 'textStyle'
        }

        if(key != '') {
            iframe.contents().find('#' + key).remove();
            var css = $(this).attr('data-file');
            const linkElement = document.createElement('link');
            linkElement.setAttribute('rel', 'stylesheet');
            linkElement.setAttribute('id', key)
            linkElement.setAttribute('href', '/sitemaker/css/fontcss/' + css + '.min.css');
            iframe.contents().find('head').append(linkElement);
        }

        saveSettings();
    }

    if($(this).parents('#ct-sort_templates').length > 0) {
        var ctpid = $('#ct-sort_templates .ct-input_select-current').data('id');
        if (ctpid != cursort_template) {
            if (ctpid == 4) {
                reSortFilter("price");
            } else if (ctpid == 1) {
                reSortFilter('popular', true);
            } else if (ctpid == 0) {
                reSortFilter('sort');
            } else if (ctpid == 2) {
                reSortFilter('colors', true);
            } else if (ctpid == 3) {
                reSortFilter('new', true);
            } else if (ctpid == 5) {
                reSortFilter("price", true);
            }
            cursort_template = ctpid;
        }
    }


    if($(this).parents('.ct-own_block-setting_select').length > 0) {
        rebuildStructure($(this).attr('data-id'));
    }

    else if($(this).parents('.ct-input_select').attr('id') == 'own_align') {
        $('[name="own_align"]').val($(this).attr('data-id')).trigger('input', typeof data_value['OWN_ALIGN'] == 'undefined' || data_value['OWN_ALIGN'] != $(this).attr('data-id'));
    }

})

$(document).on('input','#secondPanel [name="location_map"]',function(){
    checkUrl($(this).next('span'),$(this).val())
})

$(document).on('click','.ct-image_preview i',function(){
    $(this).toggleClass('active')
    $(this).parents('.ct-image_preview').attr('data-filter',($(this).hasClass('active') ? 'black' : ''));
    var cat = $(this).parents('.ct-image_uploader-info').attr('data-for');
    var ind = $(this).parents('.ct-image_preview').index();
    var objindex = grayscales.findIndex((obj => obj.name == cat));
    if(objindex === -1)
        {grayscales.push({name:cat,data:[]});}

    objindex = grayscales.findIndex((obj => obj.name == cat));
    if($(this).hasClass('active'))
    {
        grayscales[objindex].data.push(ind)
    }
    else
    {
        var index =   grayscales[objindex].data.indexOf(ind);
        if (index !== -1) {
            grayscales[objindex].data.splice(index, 1);
        }
    }

    $.post(ajax_url,{action:'grayscales',data:JSON.stringify(grayscales)},function(data){
        doGrayscales();
    });
})

$(document).on('click','.ct-image_uploader',function(){
    $(this).closest('input[type="file"]').click();
})

$(document).on('change', 'input[type="file"]:not(.ct-music_file)', function () {
    var data = new FormData();
    var that = $(this);
    var cont = that.parents('.ct-image_uploader')
    var upinfo = that.parents('.ct-image_uploader-info')
    data.append('action', 'images');
    var name = $(this).attr('name').toUpperCase();
    if(typeof cropInit !== "undefined" && iframe.contents().find('.ct-photo_cropper').length === 0)
    {
        preCrop(that[0].files[0],cont,upinfo);
    }
    else {
        $.each(that[0].files, function (i, file) {
            data.append(name, file);
        });

        cont.find('.ct-image_upload-status div').css('width', 0);
        cont.find('.ct-image_upload-status').toggleClass('active', true);
        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        cont.find('.ct-image_upload-status div').css('width', percentComplete);

                        if (percentComplete === 100) {
                            cont.find('.ct-image_upload-status').toggleClass('active', false);
                        }
                    }
                }, false);
                return xhr;
            },
            type: 'POST',
            url: ajax_url,
            cache: false,
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {
                if (result != '' && result != 'ok') {
                    var res = JSON.parse(result);

                    if (typeof (that.attr('multiple')) == 'undefined' && cont.hasClass('ct-image_uploader-single')) {
                        if (res[0] && res[0] != '') { //одиночная фотка. не трогаем
                            upinfo.find('.ct-image_preview:not(.ct-image_uploader)').css('background-image', 'url(' + res[0] + ')').attr('data-url', res[0].split('/sitemaker/').join('/'));
                        }
                    } else {
                        var ko = upinfo.find('.ct-image_preview:not(.ct-image_uploader)').length;
                        var rlen = res.length;
                        var cnt = that.data('count');
                        if (cnt > 0) {
                            if (rlen >= cnt) {
                                ko = 0;
                                upinfo.find('.ct-image_preview:not(.ct-image_uploader-origin)').remove();
                            } else if (rlen > cnt - ko) {
                                ko = cnt - rlen;
                                $.each(upinfo.find('.ct-image_preview:not(.ct-image_uploader-origin)'), function (ki, vi) {
                                    if (ki >= ko) {
                                        $(this).remove();
                                    }
                                })
                            }
                        }

                        if (res.length == 1 && !cont.hasClass('ct-image_uploader-origin')) {
                            cont.replaceWith('<li class="ct-image_preview" data-url="' + res[0].split('/sitemaker/').join('/') + '" style="background-image: url(' + res[0] + ')"><span></span><i></i></li>');
                        } else {
                            $.each(res, function (k, v) {
                                if (upinfo.find('.ct-image_preview:not(.ct-image_uploader-origin)').length < cnt) {
                                    that.parents('.ct-image_uploader').before('<li class="ct-image_preview" data-photos="tmp" data-photos-k="' + (Number(ko) + Number(k)) + '" data-url="' + v.split('/sitemaker/').join('/') + '" style="background-image: url(' + v + ')"><span></span></li>')
                                }
                            })
                        }


                    }

                    if (!upinfo.parents('.ct-panel_settings-page').hasClass('active') && !$('#secondPanel').hasClass('active')) {
                        upinfo.parents('.ct-panel_settings-page').find('.submit_current').click();
                    }
                }

                checkUploader(upinfo)
            },
            error: function (err) {
                console.log(err);
            }
        })
    }
});

$(document).on('mouseover','[data-hint]',function(){
    $(this).append('<div class="ct-input_helper">'+$(this).data('hint')+'</div>')
})
$(document).on('mouseout','[data-hint]',function(){
   $('.ct-input_helper').remove();
})

$('.ct-reset').click(function(){
    $.post(ajax_url,{action:'reset'},function(data){
        loadTemplateData();

    })
})

$('.ct-send').click(function(){
    var uname = $('input[name="uname"]').val();
    var uemail = $('input[name="uemail"]').val();
    var utext = $('[name="utext"]').val();

    if(uname != '' && uemail != '' && utext != '')
    {
        $.post(ajax_url,{action:'support',uname:uname,uemail:uemail,utext:utext},function(data){
            $('input[name="uname"]').val('');
            $('input[name="uemail"]').val('');
            $('[name="utext"]').val('');
            alert('Ваша сообщение принято. Спасибо!')
            $('#askSupport').removeClass('active');
            $('#mainPanel').removeClass('active');
            ifresize();
        })
    }
})



$(document).on('click','.ct-image_preview span',function(){
    if(confirm('Уверены что хотите удалить изображение?'))
    {
        // var p = $(this).parents('.ct-image_uploader-info');
        // $(this).parent().remove();
        // checkUploader(p)

        var p = $(this).parents('.ct-image_uploader-info');
        var pt = $(this).parent();
        var iu = p.find('.ct-image_uploader-origin').clone()
        iu.find('input').removeAttr('multiple')
        pt.replaceWith(iu.removeClass('ct-image_uploader-origin').removeClass('ct-hidden'));

        if(iu.find('input').attr('name') === 'own_images[]') {
            $('.ct-panel_settings-page.active .submit_current').toggleClass('active',true);
        }
        
        checkUploader(p)
    }
})

$(document).on('click','.ct-input-dynamic_multiplier',function(){
    var toclone = $(this).prev();
    if(toclone.hasClass('ct-toclone'))
        {
            toclone.removeClass('ct-toclone').show()
        }
    else
        {
            toclone.after(toclone.clone())
        }
    var wrapper = $(this).parent();
    $(this).prev().find('input').val('');
    $(this).prev().find('.ct-input_label span').text(wrapper.find('.ct-input_wrapper.ct-input-dynamic').length)
})

$(document).on('click','.ct-input_remover',function(){
    var wrapper = $(this).parents('.ct-input_wrapper').parent();
    var l = wrapper.find('.ct-input_wrapper.ct-input-dynamic').length;
    if(l > 1) {
        $(this).parents('.ct-input_wrapper').remove();
    }
    else
    {
        $(this).parents('.ct-input_wrapper').addClass('ct-toclone').hide();
    }


    $('.ct-panel_settings-page.active .submit_current').toggleClass('active',true);

    $.each(wrapper.find('.ct-input_wrapper'),function(k,v){
        $(this).find('.ct-input_label span').text(k + 1);
    })
})
$(document).on('click','.ct-examples_toggle',function(){
    var ex = $(this).data('example');
    $('.ct-panel_sub .ct-panel_settings-page').removeClass('active');
    $('.ct-panel_sub .ct-panel_settings-page[data-ex='+ex+']').attr('data-for',$(this).data('for')).addClass('active')
    $('.ct-panel_sub').toggleClass('active')
})
$(document).on('change','.ct-switcher input',function(){
    if($(this).data('target'))
    {
        var _that = $(this).prop('checked');
        var _target  = $(this).data('target');
        $('#' + _target).toggleClass('active',_that)
        if(_target == 'alco')
        {
            $.post(ajax_url,{action:'setalco',alco:(_that ? 1 : 0)}, function(data){
                var dsa = iframe.contents().find('[data-sm-anketa-toggle]');
                dsa.toggle(_that)
               // $.each(dsa,function(){
               //      $(this).find('[data-sm-text="ANKETA_DRINKS_QUESTION"]:first-child').toggle(_that);
               //      $(this).find('.sm-form__drinks:first-child').toggle(_that);
               //      $(this).find('[data-sm-anketa="*"]:first-child').toggle(_that);
               // })
                d_alco = (_that ? 1 : 0);
            })
        }
        else if(_target == 'palette')
        {
            $.post(ajax_url,{action:'setpalette',palette:(_that ? 1 : 0)}, function(data){
                var palette = iframe.contents().find('[data-sm-text="DRESSCODE_COLORS"]');
                palette.toggle(_that);
                d_palette = (_that ? 1 : 0);
            })
        }
        else if(_target == 'sput')
        {
            $.post(ajax_url,{action:'setsput',sput:(_that ? 1 : 0)}, function(data){
                var sputnik = iframe.contents().find('[data-sm-anketa-company]');
                if(sputnik.parents('.sm-form__block').length > 0)
                {
                    sputnik = sputnik.parents('.sm-form__block');
                }
                else if(sputnik.parents('.sm-form__input-wrapp').length > 0)
                {
                    sputnik = sputnik.parents('.sm-form__input-wrapp');
                }
                else if(sputnik.parents('.sm-form__row').length > 0)
                {
                    sputnik = sputnik.parents('.sm-form__row');
                }
                else if(sputnik.parents('.sm-form-inner').length > 0)
                {
                    sputnik = sputnik.parents('.sm-form-inner');
                }
                else if(sputnik.prev('.sm-mgb40').length > 0)
                {
                    sputnik.prev('.sm-mgb40').toggle(_that)
                }
                else if(sputnik.prev('.text-20px').length > 0)
                {
                    sputnik.prev('.text-20px').toggle(_that)
                }
                else if(sputnik.parents('.sm-wrapper_block-anketa_question').length > 0)
                {
                    sputnik = sputnik.parents('.sm-wrapper_block-anketa_question');
                }
                else if(sputnik.parents('.sm-questionnaire__form-inner').length > 0)
                {
                    sputnik = sputnik.parents('.sm-questionnaire__form-inner');
                }
                else if(sputnik.parents('.sm-wrapper-input').length > 0)
                {
                    sputnik = sputnik.parents('.sm-company_wrapper');
                }
                sputnik.toggle(_that);
                d_sput = (_that ? 1 : 0);
            })
        }
    }
    else
    {
        if ($(this).parents('#secondPanel').length > 0) {
            var sect = $(this).parents('.ct-panel_settings-page').data('section') - 1;
            if(sect === 165){
                if (!$(this).prop('checked'))
                {
                    pre_sect = data_value['OWN_AFTER'];
                    rebuildStructure(0);
                }

                else
                {
                    rebuildStructure(pre_sect);
                }
            }
            else
            {
                if (!$(this).prop('checked')) {
                    offsections.push(sect)
                    $($('.ct-sections_setup li')[sect]).find('input').prop('checked', false);
                } else {
                    var removeItem = sect;
                    offsections = $.grep(offsections, function (value) {
                        return value != removeItem;
                    });

                    $($('.ct-sections_setup li')[sect]).find('input').prop('checked', true);
                }
                setSect();
                checkSect();
            }
        }

        if ($(this).parents('#editSections').length > 0) {
            var ind = $(this).parents('li').index();

            if (!$(this).prop('checked')) {
                offsections.push(ind)
                $('.ct-panel_settings-page[data-section="' + (ind + 1) + '"] .ct-switcher input').prop('checked', false)
            } else {
                var removeItem = ind;
                offsections = $.grep(offsections, function (value) {
                    return value != removeItem;
                });
                $('.ct-panel_settings-page[data-section="' + (ind + 1) + '"] .ct-switcher input').prop('checked', true)
            }
            setSect();
            checkSect();
        }
    }
})

$(document).on('click','.ct-colors_switcher li', function(){

    $('.ct-colors_switcher li').removeClass('active');
    $('.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li').removeClass('active');
    // if($(this).parents('.ct-footer_colors').length > 0 || $(this).parents('.ct-header_colors').length > 0)
    // {
        var cin = $(this).index();
        $($('.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li')[cin]).toggleClass('active',true);
        $($('.ct-footer_colors li')[cin]).toggleClass('active',true);
        $($('.ct-header_colors li')[cin]).toggleClass('active',true);
        $($('#customizeView .ct-colors_switcher li')[cin]).toggleClass('active',true);
    //}
   // $(this).addClass('active');
   saveSettings()
})


$(document).on('click','.ct-panel_examples-item', function(){
    $('.ct-panel_examples-item').removeClass('active');
    $(this).addClass('active');
})

$('.ct-pay').click(function(){
    $('.ct-mob-menu').toggleClass('active',false);
    var tvid = template_val.type_id > 1 ? 2 : 1;
    if(payed != '0') {
         if(typeof template_user_type == 'undefined' || template_user_type == tvid) {
             saveProject();
         }
         else
         {
             $('.ct-modal[data-modal="modal_error"]').toggleClass('active',true)
         }
    }
    else
    {
        var that = $(this);
        $.post(ajax_url, {action:'whois',domain: $('#domain_check').val()}, function (data) {
            var d = $.parseJSON(data);
            if (d[0] == '1') {
                if (that.parents('.ct-header').length > 0 && paypcid == '0') {
                    $('.ct-pleasepay_wrapper h3').text('Вы пользуетесь бесплатной версией конструктора')
                    $('.ct-pleasepay').toggleClass('active', true);
                } else {
                    $.ajax({
                        type: 'POST',
                        url: ajax_url,
                        data: {action: 'payment'},
                        success: function (data) {
                            if (data != 0) {
                                if (typeof (_ym) != 'undefined' && _ym != 0) {
                                    ym(_ym, 'reachGoal', 'sitemakerBuyTry')
                                }
                                window.location.href = data;
                            } else {
                                alert("Ошибка оплаты, попробуйте еще раз");
                            }
                        }
                    });
                }
            }
            else
            {
                $('.ct-pleasepay_wrapper h3').text('Выберите домен для своего проекта')
                $('.ct-pleasepay').toggleClass('active', true);
            }
        })
    }
})

$('.ct-toconstr input').on('input',function(){
    $(this).removeClass('ct-input_error');
})

$('.ct-update').click(function(){
    var groom = $('#changeData input[name="groom"]').val();
    var bride = $('#changeData input[name="bride"]').val();
    var main_date = $('#changeData input[name="main_date"]').val();
    var email = $('#changeData input[name="email"]').val();

    $.each($('#changeData input'),function(){
        $(this).toggleClass('ct-input_error',$(this).val() === '');
    })

    if($('#changeData input.ct-input_error').length === 0)
    {
        $.post(ajax_url,{action:'start',groom:groom,bride:bride,main_date:main_date,email:email},function(data){

            d_groom = groom;
            d_bride = bride;
            d_mdate = main_date;
            d_email = email;
            loadTemplateData();

            //тут нужны проверки ошибок, пока без них
        })
    }


})

$('.ct-resetpassword').click(function(e){

    e.preventDefault();
    $.each($('.ct-splash input'),function(){
        if(!$(this).parents('.ct-input_wrapper').hasClass('ct-hidden')) {
            $(this).toggleClass('ct-input_error', $(this).val() === '' && $(this).attr('name') !== 'password');
        }
    });

    var ehash = '';

    if($('.ct-splash input[name="ehash"]').length > 0) {
        ehash = $('.ct-splash input[name="ehash"]').val();
    }

    var email = $('.ct-splash input[name="email"]').val();
    if($('.ct-splash input.ct-input_error').length === 0) //проверили форму
    {
        if (!psending) { //защита от многократных нажатий
            psending = true;
            $.post(ajax_url, {
                action: 'reset',
                ehash: ehash,
                email: email
            }, function (data) {
                psending = false;
                if (data == 'auth') {
                    alert('Ошибка загрузки');
                } else {
                    if (data != '0') {
                        alert('Возникла ошибка');
                    } else {
                        alert('На указанный email отправлен код доступа');
                    }
                }
            })
        }
    }

    return false;
})

$('.ct-toauth').click(function(e){
    e.preventDefault();
    $(this).toggleClass('ct-hidden',true);
    $('.ct-toconstr').after('<div class="ct-pointer ct-tomain">Вернуться</div>')
    $('.ct-form_intro').text('Введите электронную почту для получения временного кода');
    $('.ct-small').hide();
    $('.ct-toconstr').text('Получить код');
    $.each($('.ct-splash input'),function(){
       $(this).parents('.ct-input_wrapper').toggleClass('ct-hidden',$(this).attr('name') != 'email')
    })
    return false;
})

$(document).on('click','.ct-tomain',function(e)
{
    e.preventDefault();
    $(this).remove();
    $('.ct-form_intro').text('Заполните информацию о свадьбе, чтобы текст на вашем сайте сформировался автоматически');
    $('.ct-small').show();
    $('.ct-toconstr').text('Перейти к созданию сайта');
    $('.ct-toauth').removeClass('ct-hidden')
    $.each($('.ct-splash input'),function(){
        $(this).parents('.ct-input_wrapper').toggleClass('ct-hidden',false)
    })
    return false;
})

$('.ct-toconstr').click(function(e){
    e.preventDefault();
    var groom = $('.ct-splash input[name="groom"]').val();
    var bride = $('.ct-splash input[name="bride"]').val();
    var main_date = $('.ct-splash input[name="main_date"]').val();
    var email = $('.ct-splash input[name="email"]').val();

    var ehash = '';
    if($('.ct-splash input[name="ehash"]').length > 0)
    {
        ehash = $('.ct-splash input[name="ehash"]').val();
    }

    var pass = '';
    if($('input[name="password"]').length > 0)
    {
        pass = $('input[name="password"]').val();
    }

    $.each($('.ct-splash input'),function(){
        $(this).toggleClass('ct-input_error', !$(this).parents('.ct-input_wrapper').hasClass('ct-hidden') && $(this).val() === '');
    })

    if($('.ct-splash input.ct-input_error').length === 0) //проверили форму
    {
        if(pass != '') // отправили пароль  (второй этап)
        {
            if(!psending) { //защита от многократных нажатий
                psending = true;
                $.post(ajax_url, {
                    action: 'auth',
                    password: pass,
                    ehash: ehash,
                    email: email
                }, function (data) {
                    if (data == 'auth') {
                        psending = false;
                        alert('Ошибка загрузки');
                    }
                    else
                    {
                        var d = $.parseJSON(data);
                        if(d[0] == 'ok' && d.length > 1)
                        {
                            if(d[1] == '/sitemaker/' && typeof(_ym) != 'undefined' && _ym != 0) {
                                ym(_ym, 'reachGoal', 'sitemakerReg');
                            }

                            window.location.href = d[1];
                        }
                    }
                })
            }
        }
        else
        {    // первый этап
            var oper = 'start';
            var wtg = 0;
            if($('.ct-splash input[name="bride"]').parents('.ct-input_wrapper').hasClass('ct-hidden'))
                {
                    oper = 'restart';
                }
            else
                {
                    wtg = $('.ct-telegram').length > 0 && $('.ct-telegram input').is(':checked');
                }

            if(!psending) {
                psending = true;
                $.post(ajax_url,
                    {
                    action: oper,
                    groom: groom,
                    wtg: Number(wtg),
                    bride: bride,
                    main_date: main_date,
                    email: email
                }, function (data) {
                    if (data == 'auth') {
                        psending = false;
                        alert('Ошибка загрузки');
                    }
                    else
                    {
                        if(wtg)
                        {
                            initTelegramAuth();
                            return false;
                        }
                        else {
                            if (data == 'ok') {
                                $('.ct-splash').removeClass('active');
                                d_groom = groom;
                                d_bride = bride;
                                d_mdate = main_date;
                                d_email = email;
                                psending = false;
                                loadTemplateData();
                            }
                            else if(data == 'nouser')
                            {
                                alert('Пользователь с такой почтой не зарегистрирован');
                            }
                            else
                            {
                                window.location.href = '/sitemaker/?e=' + data;
                            }
                        }
                    }
                })
            }
        }
    }

    return false;

})

$('.ct-demo').click(function(){
    // $('body').toggleClass('ct-demonstration');
    // iframe.contents().find('.sm-edit').removeClass('sm-hidden');
    // if($('body').hasClass('ct-demonstration')) {
    //     $.each(offsections, function (k, v) {
    //         iframe.contents().find('.sm-edit[data-type="'+(v+1)+'"]').addClass('sm-hidden');
    //     })
    // }
    // setTimeout(function(){
    //     ifresize();
    // },500)
})

$(document).on('click','.submit_current', function(e){
    console.log($(this));
    if($(this).parents('.ct-panel_sub').length > 0)
    {
        //это примеры
        if($('.ct-panel_settings-page.active .ct-panel_examples-item.active').length > 0)
        {
            var ex = $('.ct-panel_sub .ct-panel_settings-page.active').attr('data-for')
            var d = $('.ct-panel_settings-page.active .ct-panel_examples-item.active').html();
            var dt = $('.ct-panel_settings-page.active .ct-panel_examples-item.active').text();
            var iw = $('.ct-examples_toggle[data-for="'+ex+'"]').prev('.ct-input_wrapper');
            if(iw.find('textarea').length > 0) {
                var ck = iw.find('.ck-editor').attr('aria-labelledby');
                const domEditableElement = document.querySelector('[aria-labelledby="' + ck + '"] .ck-editor__editable_inline');
                const editorInstance = domEditableElement.ckeditorInstance;
                editorInstance.setData(d);
            }
            else
            {
                iw.find('input[type="text"]').val(dt);
            }
            $('.ct-panel_sub').removeClass('active');
        }
    }
    else
    {
        var parwrap = $('.ct-panel_settings-page.active');
        var imwrap = parwrap.find('.ct-image_uploader-info');
        var problem = false;
        if(imwrap.length > 0) {
            $.each(imwrap,function(im,vm)
            {
                var inputup = $(vm).find('.ct-image_uploader-origin');
                var inputup_size = inputup.find('.ct-input').attr('data-count');
                var inputim = $(vm).find('li:not(.ct-image_uploader)').length;
                if(inputim < inputup_size)
                {
                    if(inputup.find('.ct-input').attr('name') != 'own_images[]') {
                        problem = true;
                    }
                }
            })
        }

        $('.ct-error').removeClass('ct-error');

        var reqwrap = parwrap.find('.ct-required');
        if(reqwrap.length > 0)
        {
            $.each(reqwrap,function(){
                $(this).parents('.ct-input_wrapper').toggleClass('ct-error',$(this).val() == '')
            })
        }

        if(problem)
        {
            alert('Кажется, вы забыли загрузить все фотографии в разделе... Изменения не сохранены');
        }
        else if($('.ct-error').length > 0)
        {
           // alert('Обратите внимание на поля обязательные для заполнения');
        }
        else
        {
            $(this).removeClass('active');
            var par = $(this).parents('.ct-menu_wrapper');
            var inp = par.find('.ct-input_wrapper:not(.ct-switcher):not(.ct-ignore)');
            $.each(inp, function (k, v) {

                var ip = $(this).find('.ct-input:not(#own_align)');

                var name = ip.prop('name');
                var nnm = name.split('[]')

                if ($.inArray(nnm[0].toUpperCase(), galleries) === -1 && $.inArray(nnm[0].toUpperCase(), gallery_items) === -1) {
                    var field = $(par).find('[name="' + name + '"]');
                    if (nnm.length > 1) {
                        var nm = name.split('[]').join('').toUpperCase();
                        data_value[nm] = [];
                        $.each(field, function (k, v) {
                            if ($(this).val() !== '') {
                                data_value[nm].push($(this).val())
                            }
                        })
                    } else {
                        if (ip.attr('type') == 'file') {
                            var image = $('.ct-image_uploader-info[data-for="' + name.toUpperCase() + '"] .ct-image_preview:not(.ct-image_uploader)');
                            data_value[name.toUpperCase()] = image.attr('data-url');
                        } else {
                            data_value[name.toUpperCase()] = ip.val();
                        }
                    }
                }
                else
                {
                    nm = name.split('[]').join('').toUpperCase();
                    data_value[nm] = [];
                    var images = $('.ct-image_uploader-info[data-for="' + nm + '"] .ct-image_preview:not(.ct-image_uploader)');
                    if (images.length > 0) {
                        $.each(images, function (k, v) {
                            data_value[nm].push($(this).attr('data-url'));
                        })
                    }
                }
            })

            //правки для опросов

            var aq = $('.ct-addquests_wrapper');
                inp = aq.find('.ct-input_wrapper:not(.ct-switcher)');

            $.each(inp, function (k, v){

                var ip = $(this).find('.ct-input');

                var name = ip.prop('name');
                var nnm = name.split('[]')


                var field = $(aq).find('[name="' + name + '"]');
                if (nnm.length > 1) {
                    var nm = name.split('[]').join('').toUpperCase();
                    data_value[nm] = [];

                    $.each(field, function (k, v) {
                        if ($(this).val() !== '') {
                            data_value[nm].push($(this).val())
                        }
                    })
                }
                else
                {
                data_value[name.toUpperCase()] = ip.val();
                }
            })
            saveTemp();
        }
    }
});

$(iframe).on('load',function(){
    if($(iframe).attr('src') != '' && typeof($(iframe).attr('src')) != 'undefined') {
        loadSections();
        loadColors();
    }
})

$('.ct-cancel').click(function(){
    undoProject();
    //cleanProject();
})
$('.ct-redo').click(function(){
    redoProject();
    //cleanProject();
})

$('.ct-democlose').click(function(){
    $(this).parent().hide();
})

$('#ct-domain_block:not(.hovered) .ct-domain_info svg').on('mouseover',function(){
    $('#ct-domain_block').toggleClass('active',true);
    $('#ct-domain_block').toggleClass('hovered',true);
    $('.ct-domain_helper').css('top', $('.ct-domain_info').offset().top - 100);
});

$('#ct-domain_block .ct-domain_info svg').on('click',function(){
    $('#ct-domain_block').toggleClass('active');
    $('.ct-domain_helper').css('top', $('.ct-domain_info').offset().top - 100);
})




$('.js-filter').click(function(){
    $('.ct-panel_settings-page').removeClass('active');
    $('#filterTpl').toggleClass('active',true)
});



$('[name="finp[]"]').on('change',function() {
    var par = $(this).parents('.ct-menu_wrapper').index();
    getFacet(par);
})

$('.ct-resetfilter').click(function(){
    resetAll();
    $('#filterTpl').toggleClass('active', false);
    $('#selectTpl').toggleClass('active',true)
})

$('.ct-subfilter').click(function(){
    getFacet();
    $('#filterTpl').toggleClass('active', false);
    $('#selectTpl').toggleClass('active',true)
})


$('#filterTpl .ct-subtitle').on('click', function (){
    $(this).parents('.ct-menu_wrapper').toggleClass('active')
    if($(this).parents('.ct-menu_wrapper').hasClass('active')){
        $(this).parents('.ct-menu_wrapper').find('.ct-menu_section').show()
    } else {
        $(this).parents('.ct-menu_wrapper').removeClass('start')
        $(this).parents('.ct-menu_wrapper').find('.ct-menu_section').hide()
    }
})

$('.start').each(function (){
    $(this).find('.ct-subtitle').click()
})

$('.ct-filter-toggle').on('click', function() {
    if ($(this).hasClass('active')) {
        $(this).find('.ct-filter-toggle-title').text('Показать все')
        $(this).parents('.ct-menu_wrapper').find('.ct-menu_section').removeClass('active')
        $(this).removeClass('active').parents('.ct-menu_section').find('.ct-field-hidden-wrap').hide(200);
    } else {
        $(this).find('.ct-filter-toggle-title').text('Скрыть')
        $(this).addClass('active').parents('.ct-menu_section').find('.ct-field-hidden-wrap').show(200, function (){
            $(this).parents('.ct-menu_wrapper').find('.ct-menu_section').addClass('active')
        });
    }
    return false;
})

$(function(){
    // if(payed == 0 && needscreen)
    // {
    //     $('.ct-pleasepay_wrapper h3').text('Вы пользуетесь бесплатной версией конструктора')
    //     $('.ct-pleasepay').toggleClass('active',true);
    // }
    if(d_groom != '' && d_bride != '' && d_email != '' && d_mdate != '') {
        loadTemplateData()
    }
    else
    {
        console.log('here we go')
        var splash_date = $('.ct-splash input[name="main_date"]')
        var cnt = splash_date.next('.ct-calcontainer')
        splash_date.Zebra_DatePicker({
                direction: 1,
                format: 'd.m.Y',
                show_clear_date: false,
                container: cnt,
                lang_clear_date: 'Очистить',
                readonly_element: false,
                days_abbr: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                months_abbr: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                days: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            });
        CheckConfirmChangeOperation();
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.ct-accordion');
    accordions.forEach(el => {
        el.addEventListener('click', (e) => {
            const self = e.currentTarget;
            const control = self.querySelector('.ct-accordion__control');
            const content = self.querySelector('.ct-accordion__content');
            self.classList.toggle('open');
            // если открыт аккордеон
            if (self.classList.contains('open')) {
                control.setAttribute('aria-expanded', true);
                content.setAttribute('aria-hidden', false);
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                control.setAttribute('aria-expanded', false);
                content.setAttribute('aria-hidden', true);
                content.style.maxHeight = null;
            }
        });
    });
});