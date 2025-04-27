var ownBlockTemplate = '<section class="sm-own sm-edit" data-type="166" data-jsscroll="" data-jsscroll-slide-top=""><div class="sm-container"><div class="sm-own_wrapper"><div class="sm-own_wrapper-img"></div><h2 data-sm-text="OWN_TITLE" title=""></h2><div data-sm-text="OWN_TEXT" title="">{%OWN_TEXT%}</div><a data-sm-href="OWN_BUTTON_LINK" title="" class="sm-own_button" target="_blank"></a></div></div></section>';
var alignSelector = '<div class="ct-input ct-input_select ct-input_select-top" id="own_align"><span>Картинка под заголовком</span><ul><li class="ct-input_select-current" data-id="1">Картинка под заголовком</li><li data-id="2">Картинка слева</li><li data-id="3">Картинка справа</li></ul></div>';
var own_images = '';
$(document).on('input','#secondPanel [name="own_colors[]"]',function(){
   var c = $(this).val();
   var b = $(this).parents('.ct-color-wrapper').index();
   if(b == 0)
   {
       iframe.contents().find('.sm-own').css('background-color',c)
   }
   else
   {
       iframe.contents().find('[data-sm-text="OWN_TITLE"]').css('color',c);
       iframe.contents().find('[data-sm-text="OWN_TEXT"]').css('color',c);
   }
})

$(document).on('click','#setupAddBlock',function(){
    $('#secondPanel').toggleClass('active',true);
    $('#secondPanel .ct-panel_settings-page').removeClass('active');
    $('#secondPanel .ct-panel_settings-page[data-section="166"]').toggleClass('active',true)
   // rebuildStructure(cursect + 1);
    closeMain();
})

function initOwnBlock(){
    //убираем все свитчеры
    //$('[data-section="166"] .ct-switcher').remove();


        if (typeof data_value['OWN_IMAGES'] == 'undefined') {
            data_value['OWN_IMAGES'] = [];

            var ik = 'OWN_IMAGES';
            var sphotos = '<li class="ct-image_preview ct-image_uploader ct-image_uploader-origin"><img src="/sitemaker/images/constr/ct-image-plus.svg">Добавить фото<div class="ct-image_upload-status"><div></div></div></li>';
            var inph = $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').clone();
            inph.attr('id', 'ct-uploader_' + ik);

            $('#secondPanel [name="' + ik.toLowerCase() + '[]"]').before('<div class="ct-image_uploader-info" data-for="' + ik + '" >' + sphotos + '</div>');

            $('.ct-image_uploader-info[data-for="' + ik + '"] .ct-image_uploader').append(inph);

            $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').remove();
        }

        if (typeof data_value['OWN_TITLE'] == 'undefined') {
            data_value['OWN_TITLE'] = 'Заголовок';
        }

        if (typeof data_value['OWN_COLORS'] == 'undefined') {
            data_value['OWN_COLORS'] = ['#ffffff', '#000000'];
        }

        if (typeof data_value['OWN_TEXT'] == 'undefined') {
            data_value['OWN_TEXT'] = 'Текст';
        }

        // if(typeof data_value['OWN_ALIGN'] == 'undefined')
        // {
        data_value['OWN_ALIGN'] = 1;
        //}

        if (typeof data_value['OWN_AFTER'] == 'undefined') {
            data_value['OWN_AFTER'] = 0;
        }

        $('#secondPanel [name="own_title"]').val(data_value['OWN_TITLE']);
        $('#secondPanel [name="own_text"]').val(data_value['OWN_TEXT']);
        $('#secondPanel [name="own_after"]').val(data_value['OWN_AFTER']);

        //Цвета персонального блока
        var own_colors_block = $('#secondPanel [name="own_colors[]"]').parents('.ct-input_wrapper');
        own_colors_block.find('.ct-panel_header').remove();
        own_colors_block.find('.ct-color-add').remove();
        own_colors_block.find('.ct-color-remove').remove();
        own_colors_block.toggleClass('ct-shadow', true);
        $.each(data_value['OWN_COLORS'], function (k, v) {
            var kk = own_colors_block.find('.ct-color-wrapper')[k];
            $(kk).find('input').attr('value', v);
            $(kk).find('span.ct-color').css('background-color', v);
            if (k < 1) {
                $(kk).after($(kk).clone());
            }
        })

        $('.ct-own_block-setting_select li[data-id="' + data_value['OWN_AFTER'] + '"]').click();
        $('.ct-own_block-setting_select').removeClass('active');

        if ($('#setupAddBlock').length === 0 && $('.ct-demonstration').length == 0) {
            var sb = $('#setupBlock').clone();
            sb.attr('id', 'setupAddBlock');
            $('#setupBlock').before(sb);
            sb.toggleClass('ct-hidden', Number(data_value['OWN_AFTER']) !== 0);
            $('#switcher-166').prop('checked', Number(data_value['OWN_AFTER']) !== 0);
            $('#switcher-166').parents('.ct-switcher').toggleClass('active', Number(data_value['OWN_AFTER']) !== 0);
        }

        // выбор вариантов дизайна пока отключили
        if ($('#secondPanel #own_align').length == 0) {
            //    $('#secondPanel [name="own_align"]').parents('.ct-input_wrapper').append(alignSelector)
        }


        // $('#secondPanel #own_align li').removeClass('ct-input_select-current');
        // $('#secondPanel #own_align li[data-id="'+data_value['OWN_ALIGN']+'"]').toggleClass('ct-input_select-current',true);
        // $('#secondPanel #own_align span').text($('#secondPanel #own_align li[data-id="'+data_value['OWN_ALIGN']+'"]').text());

        $('#secondPanel [name="own_after"]').parents('.ct-input_wrapper').hide();
        $('#secondPanel [name="own_align"]').parents('.ct-input_wrapper').hide();

        if ($('#secondPanel .ct-own_block-setting').length == 0) {
            $('#secondPanel [data-section="166"] .ct-menu_wrapper').prepend($('.ct-own_block-setting .ct-input_wrapper').clone());
            var s = $('#secondPanel [data-section="166"] .ct-menu_wrapper .ct-own_block-setting_select');
            s.removeClass('ct-input_select-top');
            s.parents('.ct-input_wrapper').find('.ct-subtitle').remove();
            s.parents('.ct-input_wrapper').toggleClass('ct-ignore', true);
        }

    $('.ct-own_block-setting').toggle(pers_block_available == 1)
    if(pers_block_available == 0)
    {
        $('#setupAddBlock').remove();
        iframe.contents().find('.sm-own').remove();
    }
    else
    {
        insertOwnData();
    }
}

function rebuildStructure(that)
{
    var id = Number(that);
    iframe.contents().find('.sm-own').remove();
    if(id > 0) {
        iframe.contents().find('[data-type="' + id + '"]').after(ownBlockTemplate);
        $('#secondPanel [name="own_after"]').val(id);
        iframe[0].contentWindow.reObserv();
        insertOwnData();
    }

    $('#switcher-166').prop('checked',id !== 0);
    $('#switcher-166').parents('.ct-switcher').toggleClass('active',id !== 0);
    $('#setupAddBlock').toggleClass('ct-hidden', id !== 0);

    $.each($('.ct-own_block-setting_select'),function(){
        $(this).find('li').removeClass('ct-input_select-current');
        $(this).find('li[data-id="'+id+'"]').toggleClass('ct-input_select-current',true);
        $(this).find('span').text($(this).find('li[data-id="'+id+'"]').text())
    })


    $.post(ajax_url,{action:'setown',OWN_AFTER:id,project:project},function(data){
        if(data == '0')
        {
            if(current_own != id) {
                console.log(current_own)
                current_own = id;
               // saveTemp('1');
            }
        }
    })
}



function insertOwnData(){

    iframe.contents().find('[data-sm-text="OWN_TITLE"]').text(data_value['OWN_TITLE']).toggleClass('sm-hidden',(data_value['OWN_TITLE'] === '')).css('color',data_value['OWN_COLORS'][1]);
    iframe.contents().find('[data-sm-text="OWN_TEXT"]').html(parseLinks(data_value['OWN_TEXT'])).toggleClass('sm-hidden',(data_value['OWN_TEXT'] === '')).css('color',data_value['OWN_COLORS'][1]);
    iframe.contents().find('.sm-own').attr('data-position',data_value['OWN_ALIGN']).css('background-color',data_value['OWN_COLORS'][0])
    own_images = '';

    if(data_value['OWN_IMAGES'].length > 0)
    {
        $.each(data_value['OWN_IMAGES'],function(k,v){
            own_images += '<img src="/sitemaker/'+v+'" data-sm-src="OWN_IMAGES_'+k+'">';
        })
    }

    if(typeof(data_value['OWN_BUTTON_LINK']) != 'undefined' && data_value['OWN_BUTTON_LINK']!= '')
    {
        var cl = iframe.contents().find('[data-sm-href="LOCATION_MAP"]').attr('class');
        iframe.contents().find('[data-sm-href="OWN_BUTTON_LINK"]').attr('href',data_value['OWN_BUTTON_LINK']).attr('class',cl).html(data_value['OWN_BUTTON_TITLE']);
    }

    iframe.contents().find('[data-sm-href="OWN_BUTTON_LINK"]').toggleClass('sm-hidden',typeof(data_value['OWN_BUTTON_LINK']) == 'undefined' || data_value['OWN_BUTTON_LINK']== '')

    iframe.contents().find('.sm-own_wrapper-img').html(own_images).toggleClass('sm-hidden',(data_value['OWN_IMAGES'].length === 0));

    if(data_value['OWN_IMAGES'].length > 1)
    {
        iframe[0].contentWindow.ownSlick();
    }

    iframe.contents().find('.sm-own img[data-sm-src]').toggleClass('ct-photo_editor',true).off().on('click',function(){
        var sc = $(this).attr('data-sm-src');
        var sc1 = sc.slice(0, -2);
        if($.inArray(sc,image_fields) != -1)
        {
            var u = sc;
        }
        else if($.inArray(sc1,gallery_items) != -1)
        {
            var sc2 = sc.substring(sc.length - 1);
            var p = $('.ct-image_uploader-info[data-for="'+sc1+'"]');
            var pt = p.find('.ct-image_preview[data-photos-k="'+sc2+'"]');
            var iu = p.find('.ct-image_uploader-origin').clone()
            u = sc1;
            iu.find('input').removeAttr('multiple')
            pt.replaceWith(iu.removeClass('ct-image_uploader-origin').removeClass('ct-hidden'));
        }

        $('#ct-uploader_' + u).click();
    })


    iframe.contents().find('.sm-own [data-sm-text]').off().on('click',function(){
        if($(this).parents('.sm-edit').length > 0) {
            var sect = $(this).parents('.sm-edit').attr('data-type');
            $('#secondPanel .ct-panel_settings-page').toggleClass('active',false)
            $('#secondPanel [data-section='+sect+']').toggleClass('active',true)
            $('#secondPanel').toggleClass('active',true)
        }
        else
        {
            $('#secondPanel .ct-panel_settings-page').toggleClass('active',false)
            $('#secondPanel input[name="' + $(this).data('sm-text').toLowerCase() + '"]').parents('.ct-panel_settings-page').toggleClass('active',true);
            $('#secondPanel').toggleClass('active',true);
        }
        ifresize();
    })
}