/**
 * boxExpand
 * version: 1.0
 */

(function () {
  'use strict';
  // boxExpand
  var namespace = 'boxExpand';
  var Expand = window.expand || {};

  Expand = function ($self, method) {
    var self = this;
    self.defaults = {
      closeHeight: '0px',
      isScrollAnimation: false,
      callback: {
        initializeAfter: null,
        showAfter: null,
        hideAfter: null,
        scrollAfter: null
      },
      type: {
        content: 'default', // 'default' or 'fadeout'
        trigger: 'default' // 'default' or 'arrow'
      },
      showClass: 'boxExpand-show',
      openClass: 'boxExpand-open',
      contentCloakClass: 'boxExpand-cloak',
      contentFadeoutClass: 'boxExpand-contents-fadeout',
      triggerArrowClass: 'boxExpand-trigger-arrow',
    };
    self.initials = {
      $trigger: $self.find('.boxExpand-trigger'),
      $triggerText: $self.find('.boxExpand-triggerText'),
      $contents: $self.find('.boxExpand-contents'),
      $cloak: null,
      isShow: false,
      triggerTextData: {
        show: '',
        hide: ''
      }
    };
    self.options = $.extend(true, self.defaults, method, self.initials);
    self.$expand = $self;
    var options = self.options;
    var defaultText = options.$triggerText.text();
    var changeText = (function () {
      var text = options.$triggerText.attr(namespace + '-toggle-text');
      if (text !== undefined && text !== '') {
        return text;
      } else {
        return defaultText;
      }
    })();

    options.$contents.wrap('<div class="' + options.contentCloakClass + '"></div>');
    options.$cloak = $self.find('.' + options.contentCloakClass);

    // 初回の状態確認 + テキストを格納
    if ($self.hasClass(options.showClass)) {
      options.isShow = true;
      options.triggerTextData.show = defaultText;
      options.triggerTextData.hide = changeText;
    } else {
      options.isShow = false;
      options.triggerTextData.hide = defaultText;
      options.triggerTextData.show = changeText;
      options.$cloak.css('height', options.closeHeight);
    }
    self.initialize();

    return self;
  };

  Expand.prototype.initialize = function () {
    var self = this;
    var options = self.options;
    var $expand = self.$expand;
    if (options.type.content === 'fadeout') {
      $expand.toggleClass(options.contentFadeoutClass, true);
    }
    if (options.type.trigger === 'arrow') {
      $expand.toggleClass(options.triggerArrowClass, true);
    }
    options.$trigger.on('click.' + namespace, function (e) {
      e.preventDefault();
      if (options.isShow) {
        self.closeBox();
      } else {
        self.openBox();
      }
    });

    self.activeCallback('initializeAfter');
    $expand.trigger('boxExpandInit',[self]);
  };

  Expand.prototype.openBox = function () {
    var self = this;
    var $expand = self.$expand;
    var options = self.options;
    if (options.isShow) {
      return;
    }
    var contentsHeight = options.$contents.outerHeight();

    $expand.toggleClass(options.openClass, true);
    options.$cloak
      .css('height', contentsHeight)
      .on('transitionend.' + namespace + ' webkitTransitionEnd.' + namespace, function () {
        self.textChange(options.isShow);
        $(this).off('transitionend.' + namespace + ' webkitTransitionEnd.' + namespace);
        $(this).css('height', '');
        $expand.toggleClass(options.openClass, false);
        $expand.toggleClass(options.showClass, true);
        options.isShow = true;
        self.activeCallback('showAfter');
        $expand.trigger('boxExpandShow',[self]);
      });
  };

  Expand.prototype.closeBox = function () {
    var self = this;
    var $expand = self.$expand;
    var options = self.options;
    if (!options.isShow) {
      return;
    }
    var contentsHeight = options.$contents.outerHeight();
    var scrollPosition = $expand.offset().top + ($(window).height() / 2);

    $expand.toggleClass(options.showClass, false);
    options.$cloak
      .css('height', contentsHeight)
      .delay(50).queue(function () {
        self.textChange(options.isShow);
        options.$cloak.css('height', options.closeHeight).dequeue();
        options.isShow = false;
        self.activeCallback('hideAfter');
        $expand.trigger('boxExpandHide',[self]);
      });

    // 移動
    if (options.isScrollAnimation) {
      scrollPosition = $expand.offset().top + calculateCloseHeight(self) - ($(window).height() / 2);
      if (scrollPosition < 0) {
        scrollPosition = 0;
      }
      $('html, body').stop().animate({
        scrollTop: scrollPosition
      }, 300, function () {
        self.activeCallback('scrollAfter');
        $expand.trigger('boxExpandScroll',[self]);
      });
    }
  };

  Expand.prototype.textChange = function (isShow) {
    var self = this;
    var options = self.options;
    if (isShow) {
      options.$triggerText.text(options.triggerTextData.hide);
    } else {
      options.$triggerText.text(options.triggerTextData.show);
    }
  };

  Expand.prototype.activeCallback = function (callbackName) {
    var self = this;
    var options = self.options;
    if (typeof options.callback[callbackName] === 'function') {
      options.callback[callbackName]();
    }
  };

  Expand.prototype.destroy = function () {
    var self = this;
    var $expand = self.$expand;
    var options = self.options;
    $expand.toggleClass(options.showClass, false);
    $expand.toggleClass(options.contentFadeoutClass, false);
    $expand.toggleClass(options.triggerArrowClass, false);
    options.$trigger.off('click.' + namespace);
    options.$cloak.off('transitionend.' + namespace + ' webkitTransitionEnd.' + namespace);
    $(options.$contents).unwrap('<div class="' + options.contentCloakClass + '"></div>');
    $expand.removeData(namespace);
  };

  function calculateCloseHeight(self) {
    var $expand = self.$expand;
    var options = self.options;
    var $dummy = $('<div class=".' + options.contentCloakClass + '"></div>');
    $dummy.css({
      'position': 'absolute',
      'top': '-9999px',
      'left': '-9999px',
      'height': options.closeHeight,
      'z-index': -1
    });
    $dummy.appendTo($expand);
    var hoge = $dummy.outerHeight();
    $dummy.remove();
    return hoge;
  }

  $.fn[namespace] = function() {
    var self = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;
    for (i = 0; i < l; i++) {
        if (typeof opt == 'object' || typeof opt == 'undefined') {
            self[i][namespace] = new Expand($(this), opt);
        } else {
            ret = self[i][namespace][opt].apply(self[i][namespace], args);
            if (typeof ret != 'undefined') return ret;
        }
    }
    return self;
};
})();
