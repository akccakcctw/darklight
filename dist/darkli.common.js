'use strict';

var CONFIG = {
  box: '.darkli',
  contents: '.darkli-content',
  btnOpens: '[data-darkli]',
  btnClose: '.darkli .darkli-close',
  heightAuto: false
};

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
  var separator = uri.indexOf('?') !== -1 ? '&' : '?';
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + value + '$2');
  }
  return uri + separator + key + '=' + value;
}

function getQueryStringParameter(key) {
  var url = window.location.href;
  var name = key.replace(/[[\]]/g, '\\$&');
  var re = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  var results = re.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function createSVG(tag, attrs) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  var svgNS = svg.namespaceURI;
  var el = document.createElementNS(svgNS, tag);
  Object.keys(attrs).forEach(function (k) {
    el.setAttribute(k, attrs[k]);
  });
  svg.appendChild(el);
  return svg;
}

function query(selectors) {
  var baseEl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

  return baseEl.querySelector(selectors);
}

function queryAll(selectors) {
  var baseEl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

  return baseEl.querySelectorAll(selectors);
}

function open(targetContent) {
  var _this = this;

  var _beforeOpen = function _beforeOpen() {
    return new Promise(function (resolve) {
      if (!_this.config.beforeOpen) return resolve();
      _this.config.beforeOpen();
      return resolve();
    });
  };
  var _afterOpen = function _afterOpen() {
    return new Promise(function (resolve) {
      if (!_this.config.afterOpen) return resolve();
      _this.config.afterOpen();
      return resolve();
    });
  };
  var _open = function _open() {
    return new Promise(function (resolve) {
      var _config$box$querySele;

      var newURL = updateQueryStringParameter(document.URL, 'darkli', targetContent);
      window.history.pushState(targetContent, null, newURL);
      _this.config.box.classList.add('is-active');
      var boxContentClasses = ['is-active'];
      if (_this.config.heightAuto) boxContentClasses.push('is-height-auto');
      (_config$box$querySele = _this.config.box.querySelector('[data-darkli-content=' + targetContent + ']').classList).add.apply(_config$box$querySele, boxContentClasses);
      return resolve();
    });
  };
  _beforeOpen().then(_open()).then(_afterOpen());
}

function close() {
  var _this2 = this;

  var popHistory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  if (!this.config.box.classList.contains('is-active')) return;
  var _beforeClose = function _beforeClose() {
    return new Promise(function (resolve) {
      if (!_this2.config.beforeClose) return resolve();
      _this2.config.beforeClose();
      return resolve();
    });
  };
  var _afterClose = function _afterClose() {
    return new Promise(function (resolve) {
      if (!_this2.config.afterClose) return resolve();
      _this2.config.afterClose();
      return resolve();
    });
  };
  var _close = function _close() {
    return new Promise(function (resolve) {
      _this2.config.box.classList.remove('is-active');
      _this2.config.box.querySelectorAll('.darkli-content').forEach(function (content) {
        if (content.classList.contains('auto-destroy')) {
          content.parentNode.removeChild(content);
        }
        content.classList.remove('is-active');
      });
      if (popHistory === true) {
        window.history.go(-1);
      }
      return resolve();
    });
  };
  _beforeClose().then(_close()).then(_afterClose());
}

function create() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$box = _ref.box,
      box = _ref$box === undefined ? this.config.box : _ref$box,
      _ref$isExternal = _ref.isExternal,
      isExternal = _ref$isExternal === undefined ? false : _ref$isExternal,
      _ref$autoDestroy = _ref.autoDestroy,
      autoDestroy = _ref$autoDestroy === undefined ? false : _ref$autoDestroy,
      content = _ref.content;

  var hashString = (+new Date()).toString(36);
  var el = document.createElement('div');
  el.classList.add('darkli-content');
  el.setAttribute('data-darkli-content', hashString);
  if (isExternal) {
    el.classList.add('is-external');
  }
  if (autoDestroy) {
    el.classList.add('auto-destroy');
  }
  el.innerHTML = content;
  box.appendChild(el);
  this.open(hashString);
}



var youtubeRegex = /(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i;
var youtubeHandler = function youtubeHandler(url) {
  return '\n  <div class="darkli-iframe-container">\n    <iframe frameborder="0" src="' + url + '" allowfullscreen></iframe>\n  </div>\n';
};

function external(url) {
  if (youtubeRegex.exec(url)) {
    this.create({ content: youtubeHandler(url), isExternal: true, autoDestroy: true });
  }
}

function nodeListForEach() {
  // https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }
}

function elementMatches() {
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Otherdarkli = void 0;

// polyfills
nodeListForEach();
elementMatches();

var Darkli = function () {
  function Darkli(cfg) {
    _classCallCheck(this, Darkli);

    this.version = '0.5.0';
    this.author = 'Rex Tsou <akccakccwww@gmail.com>';
    this.bugs = 'https://github.com/akccakcctw/darkli/issues';
    this.license = 'WTFPL';
    this.moduleName = 'darkli';
    this.config = Object.assign(CONFIG, cfg);
    this.init();
  }

  _createClass(Darkli, [{
    key: 'open',
    value: function open$$1() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      open.apply(this, args);
    }
  }, {
    key: 'close',
    value: function close$$1() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      close.apply(this, args);
    }
  }, {
    key: 'create',
    value: function create$$1() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      create.apply(this, args);
    }
  }, {
    key: 'external',
    value: function external$$1() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      external.apply(this, args);
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      // configs
      Object.assign(this.config, {
        box: query(this.config.box),
        btnOpens: queryAll(this.config.btnOpens),
        btnClose: query(this.config.btnClose)
      });

      // default functions
      if (this.config.box == null) throw new Error('config.box cannot be null');
      Array.from(this.config.btnOpens).forEach(function (btn) {
        return btn.addEventListener('click', function () {
          if (!btn.dataset.darkli) {
            _this.external(btn.getAttribute('href'));
            return;
          }
          _this.open(btn.dataset.darkli);
        });
      });

      // open box if URL has query string
      if (getQueryStringParameter(this.moduleName)) {
        this.open(getQueryStringParameter(this.moduleName));
      }

      // create default close button icon(svg)
      var createDefaultCloseIcon = function createDefaultCloseIcon() {
        var icon = createSVG('polygon', { points: '612,36.004 576.521,0.603 306,270.608 35.478,0.603 0,36.004 270.522,306.011 0,575.997 35.478,611.397      306,341.411 576.521,611.397 612,575.997 341.459,306.011    ' });
        icon.classList.add('darkli-icon');
        icon.setAttribute('viewBox', '0 0 612 612');
        _this.config.btnClose.appendChild(icon);
      };
      createDefaultCloseIcon();

      this.config.btnClose.addEventListener('click', function () {
        _this.close();
      });

      document.addEventListener('mouseup', function (e) {
        var content = query('.darkli .darkli-content');
        // click outer space to close darkli
        if (!e.target.matches('.darkli .darkli-content') && !content.contains(e.target)) {
          _this.close();
        }
      });

      document.addEventListener('keyup', function (e) {
        if (e.keyCode === 27 || e.keyCode === 8) {
          // 27(esc), 8(backspace)
          _this.close();
        }
      });
      window.addEventListener('popstate', function () {
        _this.close(false);
      });
      return this;
    }
  }], [{
    key: 'noConflict',
    value: function noConflict() {
      window.darkli = Otherdarkli;
      return Darkli;
    }
  }]);

  return Darkli;
}();

if (typeof exports === 'undefined' && typeof window.darkli !== 'undefined') {
  console.log('darkli already defined. Rename it as `Otherdarkli`');
  window.Otherdarkli = window.darkli;
  window.darkli = Darkli;
}

module.exports = Darkli;
