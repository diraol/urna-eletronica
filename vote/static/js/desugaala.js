// Generated by CoffeeScript 1.4.0
(function() {
  var apiCall, serializeBallot;

  apiCall = function(opts) {
    return _.defaults({}, opts, {
      type: 'POST',
      headers: {
        "X-CSRFToken": window.desugaalaCsrfToken,
        "Content-Type": "application/json"
      }
    });
  };

  serializeBallot = function() {
    var $category, $option, ballot, category, categoryEl, option, optionEl, options, _i, _j, _len, _len1, _ref, _ref1;
    ballot = {};
    _ref = $('.category');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      categoryEl = _ref[_i];
      $category = $(categoryEl);
      category = $category.data('category');
      options = [];
      _ref1 = $category.find('li');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        optionEl = _ref1[_j];
        $option = $(optionEl);
        if ($option.is('.deadline')) {
          break;
        } else {
          option = $option.data('option');
          options.push(option);
        }
      }
      if (options.length > 0) {
        ballot[category] = options;
      }
    }
    return {
      url: '/vote',
      data: JSON.stringify({
        ballot: ballot,
        username: $('#id_username').val(),
        password: $('#id_password').val()
      })
    };
  };

  $(function() {
    var _loggedInState, _loginOk, _voteState;
    $('.category').sortable().disableSelection();
    _loggedInState = $('#login-button').asEventStream('click').doAction(function(e) {
      return false;
    }).merge($('#login-form').asEventStream('submit').doAction(function(e) {
      return false;
    })).map(function() {
      return {
        username: $('#id_username').val(),
        password: $('#id_password').val()
      };
    }).map(function(data) {
      return {
        url: '/login',
        data: JSON.stringify(data)
      };
    }).map(apiCall).ajax().map('.result').toProperty('not_yet_logged_in');
    _loginOk = _loggedInState.map(function(v) {
      return v === 'ok';
    });
    _loginOk.assign($('#send-button'), 'toggle');
    _loginOk.assign($('.login-ok'), 'toggle');
    _loginOk.not().assign($('#login-form'), 'toggle');
    _loggedInState.map(function(v) {
      return v === 'login_failed' || v === 'not_yet_logged_in';
    }).assign($('#not-logged-in'), 'toggle');
    _loggedInState.map(function(v) {
      return v === 'login_failed';
    }).assign($('.login-failed'), 'toggle');
    _loggedInState.map(function(v) {
      return v === 'already_voted';
    }).assign($('.already-voted'), 'toggle');
    _voteState = $('#send-button').asEventStream('click').filter(_loginOk).map(serializeBallot).map(apiCall).ajax().map('.result').toProperty('vote_not_yet_sent');
    _voteState.map(function(v) {
      return v === 'vote_not_yet_sent';
    }).assign($('#vote-page'), 'toggle');
    _voteState.map(function(v) {
      return v === 'ok';
    }).assign($('#thanks-page'), 'toggle');
    return _voteState.map(function(v) {
      return v !== 'ok' && v !== 'vote_not_yet_sent';
    }).assign($('#oops-page'), 'toggle');
  });

}).call(this);
