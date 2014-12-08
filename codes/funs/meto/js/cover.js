/**
 * Created by Administrator on 14-9-27.
 */
(function($){
    $('body').addClass('no-touch');

    window.addEventListener('touchstart', function setHasTouch () {
        $('body').removeClass('no-touch');
        window.removeEventListener('touchstart', setHasTouch);
    }, false);

    // Shoe Size Converter Desktop
    setTimeout(function(){tileAppearAniToggle($("#ss_converter .ss_contr .women > ul"),true)},500);

    var tabBtnClickable = true;

    $("#ss_converter .tab_content ul li").bind('touchend',function(){
        $(this).trigger('click');
    });

    $("#ss_converter .tab_content ul li").bind('click',function(e){
        e.preventDefault();

        if(!tabBtnClickable) return;

        var $self = $(this);
        if($self.hasClass('active'))return;

        var $activeTab = $("#ss_converter .tab_content ul li.active");
        var selfClass = $self.attr('class');
        $self.addClass('active');

        $activeTab.removeClass('active');


        var $currentBlk = $("#ss_converter .ss_contr .show");//.removeClass('show');//console.log($("#ss_converter .ss_contr").find('.'+selfClass));
        var $tempBlk = $currentBlk;
        //console.log("currentBlk",$currentBlk);
        tileAppearAniToggle($currentBlk.find(">ul"),false);
        tabBtnClickable = false;

        setTimeout(function(){
            $currentBlk = $("#ss_converter .ss_contr").find('.'+selfClass).css({'position':'absolute','top':0}).addClass('show');

            tileAppearAniToggle($currentBlk.find(">ul"),true);
        },300);

        setTimeout(function(){
            if($self.hasClass('men')&&$activeTab.hasClass('women') || $self.hasClass('women')&&$activeTab.hasClass('men')||$self.hasClass('girls')&&$activeTab.hasClass('boys') || $self.hasClass('boys')&&$activeTab.hasClass('girls')){
                if($("#ss_converter .ss_cont > ul > li.active").index() < 0 || $("#ss_converter .ss_cont > ul > li.active").index() > 13)return;
                var $ssColmn = $($currentBlk.find('>ul >li').eq($("#ss_converter .ss_cont > ul > li.active").index())); //console.log($("#ss_converter .ss_cont > ul > li.active").index());
                activateColmn($($ssColmn.find(">ul>li:first-child")));
                $ssColmn.addClass('active');

            }else{
                deactiveCurrent();
            }
        },1000);

        setTimeout(function(){
            $tempBlk.removeClass('show');
            tabBtnClickable = true;
            $currentBlk.css('position','static');
        },1200);

    });

    $("#ss_converter .ss_btns li").bind('click',function(e){
        e.preventDefault();

        var $parentColmn = $(this).parents('.ss_btns');
        if(!$parentColmn.hasClass('active')){
            activateColmn($(this));
        }
    });

    function activateColmn($tile){
        var $parentColmn = $tile.parents('.ss_btns');
        var $vline = $parentColmn.find('.vline');
        var ssContH = $tile.parents('.ss_cont').height()-15;
        var index = $tile.index();

        deactiveCurrent();

        $tile.addClass('active');
        $tile.addClass('current');
        $parentColmn.addClass('active');

        $vline.show();
        $vline.css({'top':index*65,'height':0});
        $vline.animate({'height':ssContH,'top':0},500);

        toggleSSBtns($parentColmn.find('>ul'),index,-1, true);
        toggleSSBtns($parentColmn.find('>ul'),index,1, true);
    }

    function toggleSSBtns($ul,index,inc,togg){
        var uval = index+inc; //console.log(index);
        var $btnList = $ul.find('>li');
        if(uval < $btnList.size() && uval >= 0){
            setTimeout(function(){
                if(togg)$btnList.eq(uval).addClass('active');
                else $btnList.eq(uval).removeClass('active');
                toggleSSBtns($ul,uval,inc,togg);
            },60);
        }
    }

    function deactiveCurrent(){
        var $activeUL = $("#ss_converter .ss_cont > ul >li.active > ul");
        if($activeUL.size()>0){
            var $currentBtn = $("#ss_converter .ss_cont li.current");
            var $vline = $activeUL.find('.vline');
            $currentBtn.removeClass('active');
            toggleSSBtns($activeUL,$currentBtn.index(),1,false);
            toggleSSBtns($activeUL,$currentBtn.index(),-1,false);
            $currentBtn.removeClass('current');
            $vline.animate({'top':$currentBtn.index()*65,'height':0},400);
            $("#ss_converter .ss_cont > ul >li.active").removeClass('active');
        }
    }


    function tileAppearAniToggle($tileUl,show){
        var colmnDelay = 0; //console.log($tileUl);
        var $vline = $("#ss_converter .ss_cont .vline.active");
        $tileUl.find("> li.ss_btns").each(function(index){
            var $colmn = $(this);
            setTimeout(function(){
                var rowDelay = 0;
                $colmn.find("> ul > li:not(.vline)").each(function(index, element) {
                    var $tile = $(this);

                    setTimeout(function(){
                        if(show)$tile.css('opacity',1);
                        else $tile.css('opacity',0);
                    },rowDelay);

                    rowDelay += 50;
                    //console.log($tile);
                });
            },colmnDelay)

            colmnDelay += 50;
        });

        if($vline.size() > 0 && !show)$vline.hide();

        var ssHeadDelay = 100;
        $tileUl.find('.sshead li').each(function(index){
            var $shead = $(this);
            if(show)$shead.css('opacity',0);
            else $shead.css('opacity',1);

            setTimeout(function(){
                if(show)$shead.animate({'opacity':1},400);
                else $shead.animate({'opacity':0},400);
            },ssHeadDelay);

            ssHeadDelay += 50;
        });
    }



    // Shoe Size Converter Mobile
    var regionVal = "";
    var genderVal = "";
    var $totop = $(".totop");
    var $resultContr = $("#ss_converter_phone .ss_result_contr");
    $("#region").bind('change',function(){
        resetSSFilter();
        $("#gender").parent().find(" > p").html('Choose a gender');
        $("#gender").val("");
        $(this).parent().find('>p').text($(this).find('option:selected').text());
    });

    $("#gender").bind('change',function(){
        if($(this).val()===""){
            $("#gender").parent().find(" > p").html('Choose a gender');
            resetSSFilter();
            return;
        }
        if($('#region').val()==""){
            alert("Please choose region first!");
            return;
        }
        $(this).parent().find('>p').text($(this).find('option:selected').text());

        regionVal = $('#region').val();
        genderVal = $(this).val();
        var $filterLi = $("#ss_converter .ss_contr ." + genderVal + " .ss_btns ul li:nth-child("+regionVal+")");

        resetSSFilter();

        $filterLi.each(function(index, element) {
            var str = $(this).text();
            if(str !== ""){
                str = str.replace(" "," - ");
                var $opt = $("<option></option>").html(str).val(index).appendTo($("#size"));
            }
        });
    });

    $("#size").bind('change',function(){
        if($(this).val()===""){
            $resultContr.hide();
            $resultContr.empty();
            $totop.hide();
            $("#size").parent().find(" > p").html('Choose a size');
            return;
        }
        if($('#region').val()=="" || $('#gender').val()==""){
            alert("Please choose region and gender!");
            return;
        }
        $(this).parent().find('>p').text($(this).find('option:selected').text());

        var $filterLi = $("#ss_converter .ss_contr ." + genderVal+" > ul > li:nth-child("+(parseInt($(this).val())+2)+") ul");
        var $labelLi = $("#ss_converter .ss_contr ." + genderVal+" > ul > li:first-child ul");

        $resultContr.empty();
        $resultContr.show();

        $resultContr.append($labelLi.clone().addClass('label'));
        $resultContr.append($filterLi.clone().addClass('tiles').addClass(genderVal));

        setTimeout(function(){jQuery("html,body").animate({'scrollTop':$resultContr.offset().top-80},500)},50);
        $totop.show();
    });

    $totop.bind('click',function(e){
        e.preventDefault();
        jQuery("html,body").animate({'scrollTop':$("#ss_converter_phone").offset().top-20},500);
    });

    /*$(window).bind('scroll',function(){
     if($resultContr.css('display')==='block' && $(window).scrollTop() > $("#ss_converter_phone").offset().top){
     $totop.stop(true,true).fadeIn();
     }else{
     $totop.stop(true,true).fadeOut();
     }
     });*/

    function resetSSFilter(){
        $("#size").html('');
        $("#size").parent().find(" > p").html('Choose a size');
        var $empty = $("<option selected='selected'></option>").html('Choose a size').val('').appendTo($("#size"));

        $("#ss_converter_phone .ss_result_contr").empty();

        $resultContr.hide();
        $resultContr.empty();
        $totop.hide();
    }

})(jQuery);