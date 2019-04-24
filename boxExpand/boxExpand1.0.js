(function () {
  // boxExpand
  var namespace = 'boxExpand';
  var expand = window.expand || {};

  expand = function ($self, method) {
    var self = this;
    self.defaults = {
      closeHeight: '0px',
      isScrollAnimation: false,
      callback: {
        initializeAfter: null,
        showAfter: null,
        hideAfter: null
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

  expand.prototype.initialize = function () {
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
        self.closeAcco();
      } else {
        self.openAcco();
      }
    });

    self.activeCallback('initializeAfter');
  };

  expand.prototype.openAcco = function () {
    var self = this;
    var $expand = self.$expand;
    var options = self.options;
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
      });
  };

  expand.prototype.closeAcco = function () {
    var self = this;
    var $expand = self.$expand;
    var options = self.options;
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
      });

    // 移動
    if (options.isScrollAnimation) {
      scrollPosition = $expand.offset().top + calculateCloseHeight(self) - ($(window).height() / 2);
      if (scrollPosition < 0) {
        scrollPosition = 0;
      }
      $('html, body').stop().animate({
        scrollTop: scrollPosition
      }, 300, function () {});
    }
  };
  expand.prototype.textChange = function (isShow) {
    var self = this;
    var options = self.options;
    if (isShow) {
      options.$triggerText.text(options.triggerTextData.hide);
    } else {
      options.$triggerText.text(options.triggerTextData.show);
    }

  };

  expand.prototype.activeCallback = function (callbackName) {
    var self = this;
    var options = self.options;
    if (typeof options.callback[callbackName] === 'function') {
      options.callback[callbackName]();
    }
  };

  expand.prototype.destroy = function () {
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

  $.fn[namespace] = function (method) {
    return this.each(function () {
      var $this = $(this);
      $this.data(namespace, new expand($this, method));
    });
  };
})();
