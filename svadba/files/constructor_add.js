var bltpl = '';
var questfilled = false;
function addQuest(){
   var colq = $('.ct-addquest_tools.active').length + 1;
   console.log(colq)
   var str = new RegExp('{%QID%}')
   var re = new RegExp(str, 'g');
   var bltpl1 = bltpl.replace(re, colq);
   $('.ct-addquests_wrapper').append(bltpl1);
   recalcOrderQuest();
}
function fillQuests(){
    if(template_val.questions && template_val.questions.length > 0)
    {
        var smb = iframe.contents().find('[data-sm-anketa-toggle]');
        var ins = '';
        if(smb.find('.sm-form_preferences').length > 0)
        {
            ins = ' > .sm-form_preferences';
        }
        $.each(template_val.questions, function(k,v)
        {
           var qu = $($('.ct-addquests-item.active')[k]);

           var forqu = qu.find('.ct-panel_header').attr('for');
           var co = qu.find('.ct-hidden_wrapper');

           qu.find('[name="'+forqu+'_answer[]"]').parents('.ct-input_wrapper').remove();
           qu.find('[name="'+forqu+'_question"]').val(v.question);

           if(smb.length > 0)
           {
               $.each(smb,function(ko,vo){
                   var smbt = $(smb.find('div')[0]).clone();

                   if(smb.parent().find('[data-sm-anketa-toggle]' + ins + ' > label').length > 0)
                   {
                       smbt = $(smb.find('label')[0]).clone();
                   }
                   else if(smb.parent().find('[data-sm-anketa-toggle]' + ins + ' > p').length > 0)
                   {
                       smbt = $(smb.find('p')[0]).clone();
                   }

                   var smbc = $(smb.find('[data-sm-anketa]')[0]).clone();
                   var smbb = $(smb.find('.ct-alcotpl')[0]).clone();

                   smbt.attr('data-forq',forqu + '-' + ko)
                   smbc.attr('data-forq',forqu + '-' + ko);

                   $(this).append(smbt);
                   $(this).append(smbc);

                   var titl = iframe.contents().find('[data-forq="'+forqu + '-' + ko +'"]:not([data-sm-anketa])');
                   while( titl.children().length ) {
                       titl = titl.children();
                   }

                   $(titl[0]).html(v.question);
                   var drinks = iframe.contents().find('[data-sm-anketa][data-forq="'+forqu + '-' + ko +'"]');
                    var tn = drinks.find('.ct-alcotpl').prop("tagName");
                   drinks.find(tn + ':not(.ct-alcotpl)').remove();

                   $.each(v.answers,function(ka,va) {
                       var smbd = smbb.clone();
                       drinks.append(smbd)
                       var chb = $(drinks.find('.ct-alcotpl')[ka]);

                       chb.find('input').val(ka + 1).attr('name', forqu + '-' + ko + '[]').attr('id', forqu + '-' + ko + '_' + (ka + 1));
                       chb.find('[data-sm-alcoitem]').attr('for', forqu + '-' + ko + '_' + (ka + 1)).html(va);
                   })
                   smbb.remove();
                   drinks.find('.ct-alcotpl [name="alco[]"]').parents('.ct-alcotpl').remove();
                   drinks.find('.ct-alcotpl').removeClass('ct-alcotpl');
               })
           }

           $.each(v.answers,function(ka,va){
                co.find('.ct-input-dynamic_multiplier').before('<div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">Вариант ответа <span>'+(ka + 1)+'</span></label><input type="text" class="ct-input" placeholder="Вариант ответа" name="'+forqu+'_answer[]" value="'+va+'"></div><div class="ct-input_remover"></div></div>');
           })
        })
    }
    questfilled = true;
}


function recalcOrderQuest(){
    var adqa = $('.ct-addquests-item.active').length;
    if($('.ct-addquests-item').length > 0) {
        $.each($('.ct-addquests-item'), function (k,v) {
            $(this).find('.ct-title span').text(k + 2);
            $(this).css('order',k);
            $(this).find('.ct-addquest_tools-higher').toggleClass('active',(k > 0));
            $(this).find('.ct-addquest_tools-lower').toggleClass('active',(k < adqa - 1 && $('.ct-addquests-item.active').length > 1));
        })
    }


    if(template_val.questions.length > 0 && !questfilled) {
        if ($('.ct-addquests-item.active').length < template_val.questions.length) {
            $($('.ct-addquests-item:not(.active)')[0]).find('.ct-addquest_tools-addremove').click();
        }
        else
        {
            if(!questfilled) {fillQuests();}
        }
    }
}
function doQuests(){
    questfilled = false;
    template_val.questions = {};
    $('.ct-addquests_wrapper').remove();
    iframe.contents().find('[data-forq]').remove();

    if(bltpl == '') {
        bltpl = '<div class="ct-addquests-item"><div class="ct-panel_header" for="quest-{%QID%}"><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">Опрос №<span>{%QID%}</span></div><div class="ct-addquest_tools"><div class="ct-addquest_tools-higher"></div><div class="ct-addquest_tools-lower"></div><div class="ct-addquest_tools-addremove"></div></div></div></div><div id="quest-{%QID%}" class="ct-hidden_wrapper"><div class="ct-input_wrapper"><label class="ct-input_label">Текст вопроса</label><input name="quest-{%QID%}_question" class="ct-input" placeholder="Вопрос" type="text"></div><div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">Вариант ответа <span>1</span></label><input type="text" class="ct-input" placeholder="Вариант ответа" name="quest-{%QID%}_answer[]"></div><div class="ct-input_remover"></div></div><div class="ct-input-dynamic_multiplier">Добавить ответ</div></div></div>'

        var setp = $('#alco').parents('.ct-panel_settings-page');
        setp.find('.submit_current').before('<div class="ct-addquests_wrapper"></div>');

        $(document).on('click', '.ct-addquest_tools-addremove', function () {
            var cont = $(this).parents('.ct-addquests-item');
            var tools = $(this).parents('.ct-addquest_tools');
            tools.toggleClass('active')

            cont.find('.ct-hidden_wrapper').toggleClass('active', tools.hasClass('active'))
            if (!tools.hasClass('active')) {
                cont.remove();
                $('.ct-addquests-item:not(.active)').remove();
            } else {
                cont.toggleClass('active', true);
            }

            addQuest();
        })

        $(document).on('click', '.ct-addquest_tools-higher', function () {
            var cont = $(this).parents('.ct-addquests-item');
            var cind = cont.index();
            if (cind > 0) {
                var precind = cind - 1;
                $($('.ct-addquests-item')[precind]).before(cont);
                recalcOrderQuest();
            }
        })

        $(document).on('click', '.ct-addquest_tools-lower', function () {
            var cont = $(this).parents('.ct-addquests-item');
            var tot = $('.ct-addquests-item.active').length;
            var cind = cont.index();
            if (cind < tot) {
                var precind = cind + 1;
                $($('.ct-addquests-item')[precind]).after(cont);
                recalcOrderQuest();
            }
        })
    }

    $.post(ajax_url,{action:'loadQuestions'},function(data){
        if(data != '')
        {
            template_val.questions = $.parseJSON(data);
        }

        if($('.ct-addquests_wrapper').length  === 0) {
            $('#alco').parents('.ct-panel_settings-page').find('.submit_current').before('<div class="ct-addquests_wrapper"></div>');
        }
        addQuest();
    })
}
