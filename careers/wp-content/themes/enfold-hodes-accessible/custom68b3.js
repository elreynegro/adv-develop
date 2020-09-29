/*
 * Reads the entire contents of the location cookie
 */
read_language_cookie = function () {
    var cookie = null;

    var cookie_value = window.location.href.split('/')[3].trim();
    if (cookie_value) {
        write_language_cookie(cookie_value);
    }

    // Retrieve the cookie contents
    cookie = CWS.cookies.getItem('cws_current_language');
    return cookie;
};

/*
 * Sets the value of the language cookie
 */
write_language_cookie = function (cookie_value) {
    var expDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30); // Expires in 30 days
    // Set the cookie contents
    CWS.cookies.setItem('cws_current_language', cookie_value, expDate.toGMTString(), '/', window.location.host);
};

var cookie = read_language_cookie();
/*var domain = window.location.protocol + '//' + window.location.host + '/';
 var pageUrl = window.location.href;
 var isRootPage = domain == pageUrl;*/
var showVal = 'Show', hideVal = 'Hide', skipNavTxt = 'Skip to main content';
if (cookie != null) {
    if (cookie.toLowerCase() == 'fr-ca') {
        showVal = 'Lire';
        hideVal = 'Cacher';
        skipNavTxt = 'Passer au contenu principal';
    }
}
/* *** One time controls */

jQuery(document).ready(function() {
  jQuery('.col-controls,.ascending,.descending').removeAttr( "style");

    //Tab and accordion
    var tab_hash_value = window.location.hash;
    if(tab_hash_value.indexOf('#tab-id-') > -1){
        $(tab_hash_value).click();
    }
});

jQuery(function ($) {
    if ($('h1').first().length > 0) {
        if ($('h1').first().attr('id') == undefined) {
            $('h1').first().attr('id','pageHeaderTop');
        }
        $('h1').first().attr('tabindex','-1');
        //CWS.log(CWS._('Skip to main content'));
        //CWS.log(CWS._('Show Map'));
        $('#wrap_all').prepend('<div class="check-style-enabled"></div><div id="skipnav"><a href="#'+$('h1').first().attr('id')+'" target="_self">'+CWS._('Skip to main content')+'</a></div>');
    } else {
        //CWS.log(CWS._('Skip to main content'));
        //CWS.log(CWS._('Show Map'));
        $('#wrap_all').prepend('<div class="check-style-enabled"></div><div id="skipnav"><a href="#main" target="_self">'+CWS._('Skip to main content')+'</a></div>');
    }
    // $('main').attr('role','section');

    $('body').append('<span class="offscreen" aria-hidden="true" id="level2">level 2</span>');
    $('#mobile-advanced ul li').attr('aria-describedby','level2');

    $('.menu-item-language img.iclflag').attr({'alt':'','title':''});
    $('#scroll-top-link').removeAttr('aria-hidden');
    $('a#advanced_menu_toggle,a#advanced_menu_hide').removeAttr('aria-hidden').attr('role','button');
    $('a#job-alert,a#cws-adv-search-btn,#gtm-jobdetail-apply a,#gtm-jobdetail-mind a,#gtm-jobdetail-cart a').attr('role','button');


    $('#mobile-advanced').attr('role','menu');
    $('.hodes-menu').attr('role','menubar');
    $('.hodes-menu').find('span.avia-bullet,span.avia-menu-fx,span.avia-arrow-wrap,span.dropdown_available').attr('aria-hidden','true');
    $('.hodes-menu,#mobile-advanced').find('ul').attr('role','menu');
    $('.hodes-menu,#mobile-advanced').find('li').attr('role','presentation');
    $('.hodes-menu,#mobile-advanced').find('.menu-item a').attr('role','menuitem');
    $('.hodes-menu').find('.dropdown_ul_available > a').attr({'aria-haspopup':'true','aria-expanded':'false'});
    $('.hodes-menu').find('.menu-item-language:first > a').attr({'aria-haspopup':'true','aria-expanded':'false'});
   // $('.hodes-menu > .menu-item-language:first > a').attr({'aria-haspopup':'true','aria-expanded':'false'});

    $('.hodes-menu li a').on('keydown',keyboardHandler);

    //Tab and accordion
    var tab_hash_value = window.location.hash;
    if(tab_hash_value.indexOf('#tab-id-') > -1){
        $(tab_hash_value).click();
    }

    function keyboardHandler(keyVent) {
        var target = keyVent.target;
        var which = keyVent.which;

        if (which === 39) { // RIGHT
            if (isTopLevel(target)) {
                // top level item
                var nextTopItem = adjacentTopLevelItem(target, 'next');

                if (nextTopItem) {
                    keyVent.preventDefault();
                    nextTopItem.focus();
                }
            } else {
                // dropdown item
                var nextDropletItem = adjacentDropdownItem(target, 'next');
                if (nextDropletItem) {
                    keyVent.preventDefault();
                    nextDropletItem.focus();
                }
            }
        } else if (which === 37) { // LEFT
            if (isTopLevel(target)) {
                // top level item
                var prevTopItem = adjacentTopLevelItem(target, 'prev');

                if (prevTopItem) {
                    keyVent.preventDefault();
                    prevTopItem.focus();
                }
            } else {
                // dropdown item
                var prevDropItem = adjacentDropdownItem(target, 'prev');
                if (prevDropItem) {
                    keyVent.preventDefault();
                    prevDropItem.focus();
                }
            }
        } else if (which === 40) { // DOWN
            if (isTopLevel(target) && hasDropdown(target)) {
                keyVent.preventDefault();
                // top level item w/ dropdown -- open dropdown
                openDropdown(target);
            } else {
                // dropdown item
                var nextDropItem = adjacentDropdownItem(target, 'next');
                keyVent.preventDefault();
                if (nextDropItem) {
                    keyVent.preventDefault();
                    nextDropItem.focus();
                }
            }
        } else if (which === 38) { // UP
            if (!isTopLevel(target)) {
                if (isFirstDropItem(target)) {
                    keyVent.preventDefault();
                    var top = closeDropdown(target);
                    setTimeout(function() { top.focus();}, 0);
                } else {
                    var prevDropAnchor = adjacentDropdownItem(target, 'prev');

                    if (prevDropAnchor) {
                        keyVent.preventDefault();
                        prevDropAnchor.focus();
                    }
                }
            }
        } else if (which === 27) { // ESCAPE
            if (!isTopLevel(target)) {
                var topper = closeDropdown(target);
                setTimeout(function() { topper.focus();}, 0);
            }
        } else if (which === 9 && keyVent.shiftKey) { // SHIFT + TAB
            if (!isTopLevel(target) && isFirstDropItem(target)) {
                keyVent.preventDefault();
                var topA = closeDropdown(target);
                setTimeout(function() { topA.focus();}, 0);
            }
        } else if (which === 9) { // TAB
            if (!isTopLevel(target) && isLastDropItem(target)) {
                keyVent.preventDefault();
                var topItem = closeDropdown(target);
                var nextLi = $(topItem.parentNode).next()[0];
                var nextAnchor = $('a', nextLi)[0];
                nextAnchor.focus();
            }
        } else if (which === 13 || which === 32) {
            if (which == 32) { keyVent.preventDefault(); }
            if (isTopLevel(target) &&
                ($(target.parentNode).hasClass('dropdown_ul_available') || $(target.parentNode).hasClass('menu-item-has-children'))) {
                openDropdown(target);
            }
        }
    }

// determines if the item is a top-level one
    function isTopLevel(item) {
        return $(item).is('.menu > li > a');
    }

// determines if the item has a dropdown
    function hasDropdown(item) {
        return ($(item.parentNode).hasClass('menu-item-has-children') || $(item.parentNode).hasClass('menu-item-language-current'));
    }

// determines if the item is the first in the dropdown
    function isFirstDropItem(item) {
        var drop = $(item).closest('.sub-menu')[0];
        var firstInDrop = $('li a', drop)[0];

        return firstInDrop === item;
    }

// determines if the item is the last in the dropdown
    function isLastDropItem(item) {
        var drop = $(item).closest('.sub-menu')[0];
        var lastInDrop = $('li a', drop).last()[0];

        return lastInDrop === item;
    }

// finds the adjacent top level item
    function adjacentTopLevelItem(item, dir) {
        var li = item.parentNode;
        var adjacentLi = (dir === 'next') ? $(li).next()[0] : $(li).prev()[0];
        var adjacentItem = adjacentLi && $('a', adjacentLi)[0];

        return adjacentItem;
    }

// finds the next or prev dropdown item
    function adjacentDropdownItem(item, dir) {
        var adjacentDropItem;
        var li = item.parentNode;
        var adjacentSameCol = (dir === 'next') ? $(li).next()[0] : $(li).prev()[0];
        if (adjacentSameCol) {
            // there is one in the same col
            adjacentDropItem = $('a', adjacentSameCol)[0];
        } else {
            // lets look for one in the adjacent column
            var col = $(li).closest('.sub-menu')[0];
            var adjacentCol = (dir === 'next') ? $(col).next()[0] : $(col).prev()[0];
            if (adjacentCol) {
                // we've found the adjacent column
                var adjacentItem = (dir === 'next') ? $('li a', adjacentCol)[0] : $('li a', adjacentCol).last()[0];
                if (adjacentItem) {adjacentDropItem = adjacentItem;}
            }
        }

        return adjacentDropItem;
    }


    function openDropdown(item) {
        $(item.parentNode).addClass('active');
        $(item).attr('aria-expanded', 'true');
        var droplet = $(item).next('.sub-menu');
        // open the dropdown...
        $(droplet).stop().css({
            visibility: 'visible',
            display: 'block'
        }).animate({ opacity: 1});
        // ...and focus the first item
        setTimeout(function() {$('a', droplet)[0].focus();}, 100);
    }

    function closeDropdown(item) {
        var droplet = $(item).closest('.sub-menu')[0];
        var topLevelItem = $(droplet).prev()[0];
        $(topLevelItem.parentNode).removeClass('active');
        $(topLevelItem).attr('aria-expanded', 'false');
        $(droplet).slideUp(100);
        $(droplet).stop().animate({opacity: 0}, function() {
            $(droplet).css({visibility: 'hidden'});
        });
        return topLevelItem;
    }

    function hideShow(id) {
        this.$id = $('#' + id);
        this.$region = $('#' + this.$id.attr('aria-controls'));
        // this.$region.attr('aria-label', 'Toggle Video Transcript');
        this.keys = {
            enter: 13,
            space: 32
        };
        this.toggleSpeed = 100;
        this.bindHandlers();
    }

    hideShow.prototype.bindHandlers = function() {
        var thisObj = this;
        this.$id.click(function(e) {
            thisObj.toggleRegion();
            e.stopPropagation();
            return false;
        });
    }

    hideShow.prototype.toggleRegion = function() {
        var thisObj = this;
        this.$region.slideToggle(this.toggleSpeed, function() {

            if (thisObj.$id.attr('aria-expanded') == 'true') {
                thisObj.$id.attr('aria-label', CWS._('Show Video Transcript'));
				// thisObj.$id.text(CWS._('Show Video Transcript'));
                thisObj.$id.attr('aria-expanded', 'false');
            } else { // region is expanded
                thisObj.$id.attr('aria-label', CWS._('Hide Video Transcript'));
				// thisObj.$id.text(CWS._('Hide Video Transcript'));
                thisObj.$id.attr('aria-expanded', 'true');
                $(this).focus();
            }
        });
    }

    if ($('#open-transcript-btn').length) {
        var hs1 = new hideShow('open-transcript-btn');
    }
    
    $('#avia2-menu li.menu-item-language-current ').hover(
                     
        function () {
           $('#avia2-menu').find('li.menu-item-language:first > a').attr('aria-expanded', 'true');
        }, 
         
        function () {
           $('#avia2-menu').find('li.menu-item-language:first > a').attr('aria-expanded', 'false');
        }
     );
     
    $('.lang-text a').each(function () {
      if($(this).attr('href')== "/en/"){   
        $(this).attr('aria-label', 'US');
       }

       if($(this).attr('href')== "/en-CA/"){
        $(this).attr('aria-label', 'Canada English');
       }

       if($(this).attr('href')== "/fr-CA/"){
        $(this).attr('aria-label', 'Canada French');
       }
  });
  
  $(".menu-item-language a").each(function () {
      if($(this).attr('href') == '#'){
       var url = window.location.href;
      }else{
       var url = $(this).attr('href');
   }
      if(url.indexOf("/en/") != -1){   
    $(this).attr('aria-label', 'US');
   }
   
   if(url.indexOf("/en-CA/") != -1){
    $(this).attr('aria-label', 'Canada English');
   }
   
   if(url.indexOf("/fr-CA/") != -1){
    $(this).attr('aria-label', 'Canada French');
   }
  });

  if(typeof(_XC_CONFIG) !== 'undefined') {
      // Sign in menu keyboard navigation needs a more reliable solution
      $("a.xcc-sign-in,.xcc-sign-in-submenu .sign-in-link,.xcc-sign-in-submenu .create-profile-link,.xcc-sign-in-submenu .account-link,.xcc-sign-in-submenu .xcc-log-out").focus(function () {
          $(".menu-dropdown .xcc-sign-in-submenu").css("transform", "scaleY(1)");
      });
      $(".create-profile-link").focusout(function () {
          $(".menu-dropdown .xcc-sign-in-submenu").css("transform", "scaleY(0)");
      });
      $("a.xcc-log-out").focusout(function () {
          $(".menu-dropdown .xcc-sign-in-submenu").css("transform", "scaleY(0)");
      });

      // Shortcode content is broken html and causing empty links
      $('.xcc-sign-in').siblings('a:empty').remove()
      $('.xcc-sign-in-parent').siblings('a:has(script)').remove();

      var xcc_view_loaded_modifications = function() {
          var first_h1 = $('h1').first();
          if (first_h1.length > 0) {
              if (first_h1.attr('id') === undefined) {
                  first_h1.attr('id', 'pageHeaderTop');
              }

              // See; https://webaim.org/techniques/keyboard/tabindex
              first_h1.attr('tabindex', '-1');

              // Adds a relative path to the skip nav, other Angular messes up
              $('#skipnav').html('<a href="' + location.pathname + location.search + '#' + first_h1.attr('id') + '" target="_self">' + CWS._('Skip to main content') + '</a>');
          }

          // We need a proper hook after Gigya has loaded
          setTimeout(function () {
              $("span.gigya-login-provider button").attr("tabindex", "0");
          }, 1500);
      };

      if (typeof(XCLOUD) !== 'undefined') {
          if (typeof(XCLOUD.apply_filter) === 'function') {
              XCLOUD.add_filter('cws_adjust_elements_after_view_loaded', xcc_view_loaded_modifications);
          }
      }

  }
});
