// accordion
(function () {
  var namespace = 'onionAccordion';
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
      }
    };
    self.initials = {
      $trigger: $self.find('.ab-ui-accordion-trigger'),
      $triggerText: $self.find('.ab-ui-accordion-triggerText'),
      $contents: $self.find('.ab-ui-accordion-contents'),
      $inner: $self.find('.ab-ui-accordion-background'),
      isShow: false,
      showClass: 'ab-ui-accordion-show',
      openClass: 'ab-ui-accordion-open',
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

    // 初回の状態確認 + テキストを格納
    if ($self.hasClass(options.showClass)) {
      options.isShow = true;
      options.triggerTextData.show = defaultText;
      options.triggerTextData.hide = changeText;
    } else {
      options.isShow = false;
      options.triggerTextData.hide = defaultText;
      options.triggerTextData.show = changeText;
      options.$contents.css('height', options.closeHeight);
    }
    self.initialize();

    return self;
  };

  expand.prototype.initialize = function () {
    var self = this;
    var options = self.options;
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
    var contentsHeight = options.$inner.outerHeight();

    $expand.toggleClass(options.openClass, true);
    options.$contents
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
    var contentsHeight = options.$inner.outerHeight();
    var scrollPosition = $expand.offset().top + ($(window).height() / 2);

    $expand.toggleClass(options.showClass, false);
    options.$contents
      .css('height', contentsHeight)
      .delay(50).queue(function () {
        self.textChange(options.isShow);
        options.$contents.css('height', options.closeHeight).dequeue();
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
    options.$trigger.off('click.' + namespace);
    options.$contents.off('transitionend.' + namespace + ' webkitTransitionEnd.' + namespace);
    $expand.removeData(namespace);
  };

  function calculateCloseHeight(self) {
    var $expand = self.$expand;
    var options = self.options;
    var $dummy = $('<div class="ab-ui-accordion-contents"></div>');
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
