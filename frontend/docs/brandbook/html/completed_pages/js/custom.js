// строка поиска в header
$(document).ready(function () {
  $('.search .icon').click(function () {
    $('.search, .search .input').toggleClass('active')
    $("input[type='text']").focus()
  })
})

// доп меню в header
$(document).ready(function () {
  $('.menu .dop').hover(function () {
    $(this).toggleClass('active')
  })
})

// кнопка в начало страницы
$(function () {
  $('#button_up').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 600)
    return false
  })
})

// слайдер в первом блоке (главная)
$('.slider_main_page').slick({
  dots: true,
  infinite: true,
  arrows: false,
  speed: 300,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4700,
  slidesToShow: 1,
})

// добавление класса к блоку cookies
$(document).ready(function () {
  $('.cookies .button').click(function () {
    $('.cookies').addClass('active')
  })
})

// popup для карты

$('.map-point').each(function () {
  var region = $('#' + $(this).data('region'))
  var offset = region.offset()
  var mapPos = $('#russian-map').offset()
  var regionSize = region[0].getBBox()
  var topOffset = $(this).data('top-offset') || 0
  $(this).css({
    left: offset.left - mapPos.left + regionSize.width / 3,
    /*top: (offset.top - (mapPos.top + topOffset)) - regionSize.height / 2 + 50*/
    top: offset.top - mapPos.top + regionSize.height / 3,
  })
})

// Клик по названию магазина - открывается подсказка.
$('.scheme-item').on('click', function () {
  $('.scheme-popup').hide()
  $('.selector path').removeClass('active')
  var popupsh = $(this).find('.scheme-popup')
  var popup = $(this)

  //$(popup).css('top', '-' + ($(popup).outerHeight(true)/2) + 'px');
  //$(popup).css('left', '-' + (($(popup).outerWidth(true) / 2) - ($(this).outerWidth(true) / 2)) + 'px');
  /*$(popup).css('top', ($(popup).outerHeight(true)/2) + 'px');
    $(popup).css('left', '-' + (($(popup).outerWidth(true) / 2) - ($(this).outerWidth(true) / 2)) + 'px');*/
  $('.selector path[id=' + $(this).data('id') + ']').addClass('active')
  $(popupsh).show()
})

// Клик по полигону магазина - также открывается подсказка.

$('.selector path').mouseenter(function () {
  $('.scheme-popup').hide()

  var rect = $(this).offset()
  var region = $(this).attr('id')

  var mapofset = $('#russian-map').offset()

  $('.scheme-item[data-id=' + $(this).attr('id') + ']').trigger('click')

  var heightpopup = $(".scheme-item[data-id='" + region + "']").outerHeight()

  $(".scheme-item[data-id='" + region + "']").css(
    'top',
    rect.top - mapofset.top - heightpopup + 'px',
  )
  $(".scheme-item[data-id='" + region + "']").css('left', rect.left - mapofset.left + 'px')
  $(".scheme-item[data-id='" + region + "']").mouseleave(function () {
    /*$(".scheme-item[data-id='" + region + "']").css("top", "-666px");
        $(".scheme-item[data-id='" + region + "']").css("left", "-1666px");*/
  })
  $(this).mouseleave(function () {
    $('.scheme-item').removeClass('active')
  })
})

/*$('.map-point').each(function () {
$('.map-point').click(function(){
    var popup = $(this).find('.scheme-popup');
    $(popup).css('top', '-' + ($(popup).outerHeight(true) + 15) + 'px');
    $(popup).css('left', '-' + (($(popup).outerWidth(true) / 2) - ($(this).outerWidth(true) / 2)) + 'px');
    $('.selector path[data-id=' + $(this).data('region') + ']').addClass('active');
    $(popup).show();
});
})*/
/*$('.map-point').each(function () {
    $('.map-point').click(function(){
        $('.scheme-item[data-id=' + $(this).data('region') + ']').trigger('click');
    });
})*/
/*$('.selector path').each(function () {
$(this).click(function(){
    var popup = $(this).parents('.custmup').find('.popup');
    popup.each(function (){
    $(popup).css('top', '-' + ($(popup).outerHeight(true) + 15) + 'px');
    $(popup).css('left', '-' + (($(popup).outerWidth(true) / 2) - ($(this).outerWidth(true) / 2)) + 'px');
    $('.selector path[data-id=' + $(this).data('region') + ']').addClass('active');
    $(popup).show();
    });
});
})
$('.map-point').each(function () {
    $('.map-point').click(function(){
        $('.scheme-item[data-id=' + $(this).data('region') + ']').trigger('click');
    });
})*/

// Клик вне магазинов все закрывает.
$('body').click(function (e) {
  if ($(e.target).closest('.selector path, .scheme-item, .map-point').length == 0) {
    $('.scheme-popup').hide()
    $('.selector path').removeClass('active')
    /*$('.selector path').attr('class', '');*/
  }
})

$('.scheme-item').each(function (index, el) {
  var val = $(el).attr('data-id')
  $('.selector path[id=' + val + ']').attr('class', 'activepath')
})

// слайдер в пятом блоке (главная)
$('.fifth .slider__smi').slick({
  dots: false,
  infinite: true,
  arrows: true,
  speed: 300,
  slidesToScroll: 1,
  autoplay: false,
  slidesToShow: 4,
  responsive: [
    {
      breakpoint: 835,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 431,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
})

// аккордеон
document.addEventListener('DOMContentLoaded', function () {
  const accordionHeaders = document.querySelectorAll('.accordion-header')

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', function () {
      const accordionItem = this.parentElement
      if (!accordionItem.classList.contains('active')) {
        closeAllAccordionItems()
        accordionItem.classList.add('active')
      } else {
        accordionItem.classList.remove('active')
      }
    })
  })

  function closeAllAccordionItems() {
    const accordionItems = document.querySelectorAll('.accordion-item')
    accordionItems.forEach((item) => {
      item.classList.remove('active')
    })
  }
})

// слайдер в международное сотрудничество
if (window.innerWidth >= 835) {
  // Установите здесь необходимую ширину
  // Назначаем нужную ширину слайдов
  $('.slider_cooperation').slick({
    dots: false,
    infinite: false,
    arrows: true,
    slidesToScroll: 1,
    slidesToShow: 3,
  })
}

if (window.innerWidth <= 834) {
  // Установите здесь необходимую ширину
  // Назначаем нужную ширину слайдов
  $('.vertical_main').slick({
    centerMode: true,
    centerPadding: '20px',
    arrows: false,
    dots: false,
    autoplay: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 431,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '20px',
          slidesToShow: 1,
        },
      },
    ],
  })
}

if (window.innerWidth <= 460) {
  // Установите здесь необходимую ширину
  // Назначаем нужную ширину слайдов
  $('.partners_sponsors.mobile').slick({
    infinite: true,
    slidesToShow: 2,
    autoplay: true,
    slidesToScroll: 1,
    arrows: false,
  })
}

if (window.innerWidth <= 430) {
  // Установите здесь необходимую ширину
  // Назначаем нужную ширину слайдов
  $('.vertical_main').slick({
    infinite: true,
    slidesToShow: 1,
    autoplay: false,
    slidesToScroll: 1,
    arrows: false,
  })
}

function openVerticalTabs(tabId) {
  // Скрыть все вертикальные вкладки
  var verticalTabs = document.querySelectorAll('.vertical-tabs')
  verticalTabs.forEach(function (tab) {
    tab.style.display = 'none'
  })

  // Показать выбранную вертикальную вкладку
  var tab = document.getElementById(tabId)
  tab.style.display = 'block'
}

function openContent(contentId) {
  // Скрыть все содержимое
  var contents = document.querySelectorAll('.content')
  contents.forEach(function (content) {
    content.style.display = 'none'
  })

  // Показать выбранное содержимое
  var content = document.getElementById(contentId)
  content.style.display = 'block'
}

$(document).ready(function () {
  var vertab = $('.vertical-tab')
  vertab.each(function () {
    $(this).click(function () {
      $('.content').removeClass('active')
      var dataid = $(this).attr('data-id')
      $('#' + dataid).addClass('active')
    })
  })
})

$(document).ready(function () {
  var hortab = $('.horizontal-tab')
  hortab.each(function () {
    $(this).click(function () {
      $('.horizontal-tab').removeClass('active')
      $(this).addClass('active')
    })
  })
})

$(document).ready(function () {
  var tab = $('.vertical-tab')
  tab.each(function () {
    $(this).click(function () {
      $('.vertical-tab').removeClass('active')
      $(this).addClass('active')
    })
  })
})

$(document).ready(function () {
  var medi = $('.tabs_media .tab_med')
  medi.each(function () {
    $(this).click(function () {
      $('.media').each(function () {
        $(this).removeClass('active')
      })

      $('.tab_med').each(function () {
        $(this).removeClass('active')
      })
      var dataid = $(this).attr('data-id')
      $('.media_main').each(function () {
        $(this)
          .find('#' + dataid)
          .addClass('active')
      })
      $(this).addClass('active')
    })
  })
})

jQuery(document).ready(function () {
  jQuery('.btn_menu').click(function () {
    jQuery(this).toggleClass('active')
    jQuery('header.mobile .click_menu').toggleClass('active')
  })
})

$(document).ready(function () {
  var str = $('.menu .dop a')
  str.each(function () {
    $(this).hover(
      function () {
        $(this).siblings('.submenu').addClass('active')
      },
      function () {
        $(this).siblings('.submenu').removeClass('active')
      },
    )
  })
})

/*
jQuery(document).ready(function() {
    jQuery(".event-item_blue").hover(function() {
        jQuery(".event-item_blue-hover").toggleClass("active");
    });
});

jQuery(document).ready(function() {
    jQuery(".event-item_red").hover(function() {
        jQuery(".event-item_red-hover").toggleClass("active");
    });
});*/

jQuery(document).ready(function () {
  jQuery('.archive_main .button p').click(function () {
    //jQuery(this).toggleClass("active");
    jQuery('.archive_main .archive_events').toggleClass('active')
  })
})

//if (window.innerWidth >= 430) { // Установите здесь необходимую ширину
$(document).ready(function () {
  // $('.calendar-table__row').each(function (){
  //     $(this).find('.calendar-table__col').each(function (){
  //         var blue = $(this).find(".line_blue");
  //         var red = $(this).find(".line_red");
  //         blue.click(function() {
  //             //$(".event-item_blue-hover").toggleClass("active");
  //             var blueitem = $(this).parents(".calendar-table__event-main").find(".event-item_blue-hover");
  //             blueitem.toggleClass("active");
  //             $('.overflow').addClass('active');
  //             $('.event-item_red-hover').removeClass('active');
  //         });
  //         red.click(function() {
  //             // $(".event-item_red-hover").toggleClass("active");
  //             var reditem = $(this).parents(".calendar-table__event-main").find(".event-item_red-hover");
  //             reditem.toggleClass("active");
  //             $('.overflow').addClass('active');
  //             $('.event-item_blue-hover').removeClass('active');
  //         });
  //         $('.overflow').click(function (){
  //             $('.event-item_red-hover').removeClass('active');
  //             $('.event-item_blue-hover').removeClass('active');
  //             $(this).removeClass('active');
  //         });
  //     });
  // });
})
//}

$(function () {
  let header = $('#fix_button')

  $(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
      header.addClass('active')
    } else {
      header.removeClass('active')
    }
  })
})

if ($('[data-fancybox]')) {
  Fancybox.bind('[data-fancybox]', {
    // Your custom options
  })
}
