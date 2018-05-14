$(function () {
    $('.start').on('click', startProcess);
    $('.stop').on('click', stopProcess);
    $('.reset').on('click', resetProcess);
    $('.update').on('click', updateProcess);
    
});

var timer;

/**
 * スタート処理
 * @param {Event} event 
 */
function startProcess(event) {
    event.preventDefault();
    $('button').prop('disabled', true);
    clearTimeout(timer);
    var options = {
        url: '/api/start',
        type: 'POST',
        dataType: 'json',
        data: {
            'count': $('#count').val()
        }
    };
    var done = function (data, textStatus, jqXHR) {
        console.log(data, textStatus, jqXHR);
        $('.status').text('抽選中');
        var time = 5 * 60 * 1000;
        timer = setTimeout(function () {
            stopProcess();
        }, time);
    };
    var fail = function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
        alert('エラーが発生しました');
    };
    var always = function () {
        $('button').prop('disabled', false);
    };
    $.ajax(options)
        .done(done)
        .fail(fail)
        .always(always);
}

/**
 * 停止処理
 * @param {Event} event 
 */
function stopProcess(event) {
    if (event !== undefined) {
        event.preventDefault();
    }
    $('button').prop('disabled', true);
    clearTimeout(timer);
    var options = {
        url: '/api/stop',
        type: 'POST',
        dataType: 'json',
        data: {}
    };
    var done = function (data, textStatus, jqXHR) {
        console.log(data, textStatus, jqXHR);
        $('.status').text('抽選停止');
    };
    var fail = function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
        alert('エラーが発生しました');
    };
    var always = function () {
        $('button').prop('disabled', false);
    };
    $.ajax(options)
        .done(done)
        .fail(fail)
        .always(always);
}

/**
 * 更新
 * @param {Event} event 
 */
function updateProcess(event) {
    if (event !== undefined) {
        event.preventDefault();
    }
    $('button').prop('disabled', true);
    var options = {
        url: '/api/winners',
        type: 'GET',
        dataType: 'json',
        data: {}
    };
    var done = function (data, textStatus, jqXHR) {
        console.log(data, textStatus, jqXHR);
        var html = '';
        for (var i = 0; i < data.winners.length; i++) {
            var winner = data.winners[i];
            html += '<li class="list-group-item">' +
            '<p>' + winner.winningNumber + '</p>' +
            '<p style="margin-bottom: 0">' + winner.name + '</p>' +
            '</li>';
        }
        $('.list-group').html(html);
    };
    var fail = function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
    };
    var always = function () {
        $('button').prop('disabled', false);
    };
    $.ajax(options)
        .done(done)
        .fail(fail)
        .always(always);
}

/**
 * リセット
 * @param {Event} event 
 */
function resetProcess(event) {
    if (event !== undefined) {
        event.preventDefault();
    }
    $('button').prop('disabled', true);
    clearTimeout(timer);
    var options = {
        url: '/api/reset',
        type: 'POST',
        dataType: 'json',
        data: {}
    };
    var done = function (data, textStatus, jqXHR) {
        console.log(data, textStatus, jqXHR);
        $('.list-group').html('');
        $('.status').text('抽選停止');
    };
    var fail = function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
    };
    var always = function () {
        $('button').prop('disabled', false);
    };
    if (window.confirm('リセットしますか？')) {
        $.ajax(options)
            .done(done)
            .fail(fail)
            .always(always);
    } else {
        $('button').prop('disabled', false);
    }
}