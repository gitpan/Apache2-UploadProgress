
function updateProgressBar(progress) {
    var barwidth = 300;
    var currenttime = new Date();
    var totalelapsedtime = ( currenttime.getTime() - progress.starttime.getTime() ) / 1000;
    var lastelapsedtime  = ( currenttime.getTime() - progress.lasttime.getTime() ) / 1000;

    if (progress.received == progress.size)
        progress.finished = 1;

    progress.elapsedtime = totalelapsedtime;

    if (totalelapsedtime != 0)
        progress.rate = parseInt( progress.received / totalelapsedtime );
    else
        progress.rate = 0;

    if (lastelapsedtime != 0)
        progress.currentrate = parseInt( (progress.received - progress.lastamount) / lastelapsedtime );
    else
        progress.currentrate = 0

    if (progress.currentrate != 0)
        progress.remainingtime = parseInt( (progress.size - progress.received) / progress.currentrate );
    else
        progress.progress.remainingtime = '';

    var percent = 0;
    if (progress.size != 0)
        percent = Math.round(progress.received / progress.size * 100);

    progress.currentbarwidth   = Math.round(percent * barwidth / 100);
    progress.remainingbarwidth = barwidth - progress.currentbarwidth;
    progress.barwidth = barwidth;

    progress.currentrate = formatBytes(progress.currentrate);
    progress.rate = formatBytes(progress.rate);
    progress.size = formatBytes(progress.size);
    progress.received = formatBytes(progress.received);
    progress.elapsedtime = formatTime(progress.elapsedtime);
    progress.remainingtime = formatTime(progress.remainingtime);
    progress.percent = percent;

    $('progress').innerHTML = Jemplate.process('meter.tmpl', progress);
}

function formatTime(time) {
    var seconds = Math.round(time);
    var minutes = 0;
    if (time >= 60) {
        minutes = Math.round(seconds / 60);
        seconds %= 60;
    }
    if (seconds < 10)
        seconds = '0' + seconds;

    return minutes + ':' + seconds;
}

function formatBytes(bytes, precision) {
    if ( typeof(precision) != 'number')
        precision = 2;
    var suffix = '';

    // Only positive values are allowed
    if (bytes <= 0)
        return bytes;

    if (bytes > 1073741824) {
        bytes /= 1073741824;
        suffix = 'G';
    } else if (bytes > 1048576) {
        bytes /= 1048576;
        suffix = 'M';
    } else if (bytes > 1024) {
        bytes /= 1024;
        suffix = 'K';
    }

    return formatNumber(bytes, precision) + suffix;
}

function formatNumber(number, precision) {
    if ( typeof(precision) != 'number')
        precision = 2;
    var num = new Number(number);
    return num.toFixed(precision)
}

function reportUploadProgress(progress) {

    new Ajax.Request( '/progress', {  // uri as defined in httpd.conf
        method         : 'get',
        asynchronous   : true,
        parameters     : 'progress_id=' + progress.id,
        requestHeaders : [ 'Accept', 'text/x-json' ],
        onComplete     : function(request) {

            var state = eval( '(' + request.responseText + ')' );

            if ( state != undefined ) {

                state.starttime       = progress.starttime;
                state.lasttime        = progress.lasttime;
                state.lastamount      = progress.lastamount;

                progress.lasttime     = new Date();
                progress.lastamount   = state.received;
                progress.size         = state.size;
                progress.received     = state.received;

                if ( progress.received != progress.size ) {
                    window.setTimeout( reportUploadProgress, 1000, progress );
                }

                updateProgressBar(state);
            }
        }
    });
}

function startUploadProgress(form) {

    var progress = {};

    progress.id         = form.action.match(/progress_id=([A-Za-z0-9]{32})/);
    progress.starttime  = new Date();
    progress.lasttime   = new Date(progress.starttime);
    progress.lastamount = 0;

    window.setTimeout( reportUploadProgress, 100, progress );

    return true;
}
