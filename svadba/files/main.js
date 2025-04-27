// Модальное окно
$('.open-modal').click(function() {
    $('#modal').addClass('modal-open')
})
document.querySelector('.sm-modal-close').addEventListener('click',function() {
    document.getElementById('modal').classList.remove('modal-open')
})

function setMonthCalendar(year, month, day) {

    let monthDays = new Date(year, Number(month) , 0).getDate(),
        monthPrefix = new Date(year, Number(month) - 1, 0).getDay(),
        monthDaysText = '';


    let dweeks = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    for (let i = 0; i < 7; i++) {
        monthDaysText += '<span class="sm-cormorantLight-30-20px">' + dweeks[i] + '</span>';
    }

    if (monthPrefix > 0) {
        for (let i = 1; i <= monthPrefix; i++) {
            monthDaysText += '<span></span>';
        }
    }

    for (let i = 1; i <= monthDays; i++) {
        monthDaysText += '<span ' + ((i == day) ? 'class="sm-manropeSemiBold-20 number-acrive"' : 'class="sm-manropeSemiBold-20"') + '>' + i + '</span>';
    }

    $('.sm-date__calendar .sm-date__calendar-bottom').html(monthDaysText);
}

function StartCountDown(myDiv, myTargetDate) {
    let dthen = new Date(myTargetDate);
    let dnow = new Date();
    ddiff = new Date(dthen - dnow);
    gsecs = Math.floor(ddiff.valueOf() / 1000);
    CountBack(myDiv, gsecs);
}

function Calcage(secs, num1, num2) {
    s = ((Math.floor(secs / num1)) % num2).toString();
    if (s.length < 2) {
        s = "0" + s;
    }
    return (s);
}

function CountBack(myDiv, secs) {
    let timeArr = [],
        holder;
    if (secs <= 0) {secs = 0}
    timeArr.days = Calcage(secs, 86400, 100000).split('');
    timeArr.hours = Calcage(secs, 3600, 24).split('');
    timeArr.minutes = Calcage(secs, 60, 60).split('');
    timeArr.seconds = Calcage(secs, 1, 60).split('');


    Object.keys(timeArr).map(function (key) {
        holder = document.getElementById(key);
        for (let i = 0; i < holder.childNodes.length; ++i) {
            $($(holder).find('.sm-timer-time_number > span')[i]).text(timeArr[key][i])
            if(key == 'days')
            {
                $(holder).find('.sm-timer-time_number').hide();
                for(var t=0; t < timeArr[key].length; t ++){
                    $($(holder).find('.sm-timer-time_number')[t]).show();
                }
            }
        }
    });

    if(secs > 0) {
        setTimeout(function () {
            CountBack(myDiv, secs - 1);
        }, 990);
    }
}

function onResize(){
    if($('.slick-initialized').length > 0)
    {
        $('.slick-initialized').slick("unslick");
    }


    $('.sm-slider').slick({
        infinite: false,
        adaptiveHeight: false,
    });

    $(".sm-slider").on('afterChange', function (event, slick, currentSlide) {
        $("#counter").text(currentSlide + 1);
    });

}

$(window).on('resize', function() {
    onResize();
});
function startAll() {

    var year = 2024;
    var month = 9;
    var day = 23;

    var nd = parent.d_mdate;
    if(nd != '')
    {
        nd = parent.d_mdate.split('.');
        if(nd.length >= 3 && nd[2] >= new Date().getFullYear()) {
            year = nd[2];
            month = nd[1];
            day = nd[0];
        }
    }

    StartCountDown("timer", year + '/' + month + '/' + day);
    setMonthCalendar(year,month,day);
    onResize();
}

function thankYou()
{
    $('.sm-thanks').toggleClass('active',true).toggleClass('sm-open',true);
    setTimeout(function(){window.location.reload();},3000)
}