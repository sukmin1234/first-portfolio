//로딩중(애니큐빅)
$(function () {
  const $loading = $(".loading");

  $loading.children("p").fadeOut();
  $loading.delay(250).fadeOut(800);

  $(window).on("load", function () {
    new WOW().init(); //WOW 플러그인 연동

    $("html,body").animate({ scrollTop: 0 }); //최초 로딩시 맨위로 이동
  });
});

//메뉴, 스크롤
$(function () {
  const $h1 = $("h1");
  const $home = $h1.next("#home");
  const $intro = $home.children(".intro");
  const $header = $home.nextAll("header");
  const $aside = $("aside");

  const $nav = $header.find("nav");
  const $mnu = $nav.find("a");
  const $btnGnb = $header.find(".btn-gnb");

  const arrTopVal = []; //header 이후에 존재하는 section의 top값
  let nowIdx = 0;
  const headerH = $header.height();

  //브라우저를 뜻하는 전역변수 window
  //처음 로딩과 브라우저창의 크기를 재조정 했을 때
  $(window).on("load resize", function () {
    //현재 브라우저 화면의 크기(스크롤바와 툴바 미포함) - .innerHeight, .innerWidth
    $home.height(window.innerHeight);

    if (window.innerWidth > 640) {
      //PC모드
      $h1.css({
        top: Math.round($intro.offset().top) - 72,
        marginLeft: -Math.round($h1.width() / 2),
      });

      $nav.show();
    } else {
      //모바일
      $h1.css({
        top: Math.round($intro.offset().top) - 100,
        marginLeft: -Math.round($h1.width() / 2),
      });
      $btnGnb.removeClass("clse");
      $nav.hide();
    }

    //각 section의 top값을 배열에 저장
    $("header~section").each(function (idx) {
      arrTopVal[idx] = $(this).offset().top;
    });
  });

  $(window).on("scroll", function () {
    //1. 현재 스크롤바의 top값 추출
    let scrollTop = Math.ceil($(this).scrollTop());
    const $aboutme = $home.nextAll("#aboutme");

    //2. 스크롤탑값에 따른 header 고정처리
    if (scrollTop > $(this).height()) {
      $header.addClass("fixed");
      $aboutme.css({
        marginTop: headerH,
      });
    } else {
      $header.removeClass("fixed");
      $aboutme.css({
        marginTop: 0,
      });
    }

    //3. 네이버라인 비주얼 효과
    if (window.innerWidth > 640) {
      //PC모드
      if (scrollTop > $(this).height() - 400) {
        $home.css({ transform: "scale(0.9)" });
      } else {
        $home.css({ transform: "scale(1)" });
      }
    }

    //4. 메뉴 활성화 표시
    for (let i = 0; i < $mnu.length; i++) {
      //for문을 이용하여 5개의 if문을 하나로 작성
      if (scrollTop >= arrTopVal[i] - headerH - 200) {
        $mnu.eq(i).parent().addClass("on").siblings().removeClass("on");
      } else if (scrollTop < arrTopVal[0] - headerH - 200) {
        $mnu.parent().removeClass("on");
      }
    }

    //5. 맨위로가기 top 버튼
    //view>0 이면 푸터가 화면에 노출되었다는 것을 의미
    const view = scrollTop + $(window).height() - $("footer").offset().top;

    if (view > 0) {
      //푸터노출
      $aside.css("margin-bottom", view);
    } else {
      $aside.css("margin-bottom", 0);
    }

    //6. 탑버튼 노출처리
    if (scrollTop > 120) {
      $aside.fadeIn();
    } else {
      $aside.fadeOut();
    }
  });

  //네비게이션 click에 따른 페이지 이동
  $mnu.on("click", function (evt) {
    evt.preventDefault();

    nowIdx = $mnu.index(this); //이번에 클릭한 메뉴의 인덱스번호 추출
    $("html,body").animate({ scrollTop: arrTopVal[nowIdx] - headerH });

    if (window.innerWidth <= 640) {
      $btnGnb.trigger("click"); //이벤트를 강제로 발생시키는 메소드 trigger('이벤트명');
    }
  });

  //모바일 전용 메뉴버튼
  $btnGnb.on("click", function () {
    $(this).toggleClass("clse");
    $nav.toggle();
  });

  $(".logo, aside").on("click", function (evt) {
    evt.preventDefault();
    $("html,body").animate({ scrollTop: 0 });
  });
});

//ability 영역
$(function () {
  $("#ability").on("inview", function (visible) {
    if (visible) {
      //방법1
      // for (let i = 0; i < 6; i++) {
      //    const $that = $('#ability .bar').eq(i);
      //    $that.width($that.parent().attr('data-bar') + '%');
      // }

      //방법2
      $("#ability .bar").each(function () {
        $(this).width($(this).children("span").text());
      });
    }
  });

  $(".piechart").on("inview", function (visible) {
    if (visible) {
      $(".chart").easyPieChart({
        //your configuration goes here
        easing: "easeInOutCubic",
        delay: 3000,
        barColor: "#68c3a3",
        trackColor: "rgba(255,255,255,0.2)",
        scaleColor: false,
        lineWidth: 8,
        size: 140,
        animate: 2000,
        onStep: function (from, to, percent) {
          this.el.children[0].innerHTML = Math.round(percent);
        },
      });
    }
  });

  //온라인이력서 모달창
  const $btnIam = $("#ability > .resume > div > .iam > a");
  const $shadow = $btnIam.next(".shadow");
  const $modal = $shadow.children(".modal");
  const $btnClse = $shadow.find(".clse");

  $btnIam.on("click", function (evt) {
    evt.preventDefault();
    $shadow.show();
  });

  $btnClse.on("click", function () {
    $shadow.hide();
  });

  $modal.on("click", function (evt) {
    evt.stopPropagation();
  });

  $shadow.on("click", function () {
    $(this).hide();
  });

  $(document).on("keyup", function (evt) {
    if (evt.which === 27) {
      $shadow.hide();
    }
  });
});

//uxdesign 영역
$(function () {
  const $container = $("#uxdesign > .slides > .slides-container");
  const $indicator = $("#uxdesign > .slides > .slides-pagination > li > a");
  const $btnPrev = $("#uxdesign > .slides > .slides-prev");
  const $btnNext = $("#uxdesign > .slides > .slides-next");

  let nowIdx = 0;

  //인디케이터에 대한 click 이벤트 구문
  $indicator.on("click", function (evt) {
    evt.preventDefault();
    nowIdx = $indicator.index(this);
    $indicator.eq(nowIdx).parent().addClass("on").siblings().removeClass("on");
    $container.stop().animate({ left: -(100 * nowIdx) + "%" }, 400);
  });

  //다음버튼에 대한 click 이벤트 구문
  $btnNext.on("click", function (evt) {
    evt.preventDefault();

    if (nowIdx < 3) {
      nowIdx++;
    } else {
      nowIdx = 0;
    }

    $indicator.eq(nowIdx).parent().addClass("on").siblings().removeClass("on");
    $container
      .stop()
      .animate({ left: "-100%" }, 400, "easeInOutCubic", function () {
        const $slides = $("#uxdesign > .slides > .slides-container > li"); //li 4개
        $slides.first().appendTo($container); //마지막 li로 이동
        $container.css({ left: 0 });
      });
  });

  //이전버튼에 대한 click 이벤트 구문
  $btnPrev.on("click", function (evt) {
    evt.preventDefault();

    if (nowIdx > 0) {
      nowIdx--;
    } else {
      nowIdx = 3;
    }

    $indicator.eq(nowIdx).parent().addClass("on").siblings().removeClass("on");

    const $slides = $("#uxdesign > .slides > .slides-container > li"); //li 4개
    $slides.last().prependTo($container); //첫번째 li로 이동
    $container.css({ left: "-100%" });
    $container.stop().animate({ left: 0 }, 400);
  });
});

//portfolio 영역
$(function () {
  //1. 페이드슬라이드
  const $slides = $(
    "#portfolio > article.slides > .slides-container > figure "
  );
  const $indicator = $(
    "#portfolio > article.slides > .slides-pagination > li > a"
  );
  const $btnPrev = $("#portfolio .slides-prev");
  const $btnNext = $("#portfolio .slides-next");

  let nowIdx = 0;
  let oldIdx = nowIdx;

  function fadeFn() {
    //활성화표시
    $indicator.eq(nowIdx).parent().addClass("on").siblings().removeClass("on");

    //슬라이드처리
    $slides.eq(oldIdx).stop().fadeOut(200); //이전 슬라이드 사라짐
    $slides.eq(nowIdx).stop().fadeIn(200).css({ display: "flex" }); //이번 슬라이드
  }

  //인디케이터
  $indicator.on("click", function (evt) {
    evt.preventDefault();

    oldIdx = nowIdx;
    nowIdx = $indicator.index(this);

    fadeFn();
  });

  //다음버튼
  $btnNext.on("click", function (evt) {
    evt.preventDefault();

    oldIdx = nowIdx;

    if (nowIdx < 2) {
      nowIdx++;
    } else {
      nowIdx = 0;
    }

    fadeFn();
  });

  //이전버튼
  $btnPrev.on("click", function (evt) {
    evt.preventDefault();

    oldIdx = nowIdx;

    if (nowIdx > 0) {
      nowIdx--;
    } else {
      nowIdx = 2;
    }

    fadeFn();
  });

  //모달(라이트박스)
  const $btnProc = $("#portfolio > article.slides a.proc");
  const $shadow = $("#portfolio > article.slides .shadow");
  const $lightbox = $shadow.children(".lightbox");
  const $btnClse = $shadow.children(".clse");

  //작업과정 버튼 클릭시
  $btnProc.on("click", function (evt) {
    evt.preventDefault();
    $shadow.eq(nowIdx).show();
  });

  //닫기버튼
  $btnClse.on("click", function () {
    $shadow.hide();
  });

  //그림자영역 클릭시 닫힘
  $shadow.on("click", function () {
    $(this).hide();
  });

  //이벤트전파 설정
  $lightbox.on("click", function (evt) {
    evt.stopPropagation();
  });

  //ESC키를 이용한 닫기
  $(document).on("keyup", function (evt) {
    if (evt.which === 27) {
      $shadow.hide();
    }
  });
});

//contact 영역
$(function () {
  const $tit = $("#contact > .apply > dl > dt > a");

  $tit.on("click", function (evt) {
    evt.preventDefault();

    $(this).parent().toggleClass("on").next().slideToggle(150);
  });
});
