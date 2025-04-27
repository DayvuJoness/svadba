$(function(){
    $('.ct-modal_open').click(function(){
        var mtarget = $(this).data('target');
        modalOpen($('[data-modal="' + mtarget + '"]'));
    })
    $('.ct-modal .ct-panel_close').click(function(){
        modalClose();
    })
})

function modalOpen(modal)
{
    modalClose();
    modal.toggleClass('active',true);
}

function modalClose()
{
    $('.ct-modal').removeClass('active');
}