jQuery(function ($) {
    var socket = io.connect();
    var $sip = $('#sip');
    socket.on('sip', function (data) {
        var sip = '';
        for (i = 0; i < data.length; i++) {
            sip += data[i] + '<br/>'
        }
        $sip.append('<h3 class="conf-head">Conference call</h3> \
                                        <div class="panel panel-default ">\
                                            <div class="panel-heading " >\
                                                <h3 class="panel-title">' + sip + '</h3>\
                                            </div>\
                                            <div class="panel-body">\
                                                <input type="checkbox" data-on="Voice" data-off="Muted" checked data-toggle="toggle" data-onstyle="success" data-offstyle="danger">\
                                                    <button class="btn btn-default kick" id="kick" data-toggle="modal" data-target="#myModal" type="submit">Kick</button>\
                                                </div>\
                                            </div>');

    });

    $('.kick').click(function () {
        $('#myInput').focus()
    });
});