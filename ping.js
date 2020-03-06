window.addEventListener('load', function () {
    var setup_elem = document.getElementById("setup");

    var start_audio = document.getElementById("start_wav");
    var success_audio = document.getElementById("success_wav");
    var fail_audio = document.getElementById("fail_wav");

    var visual_status_success = document.getElementById("visual_status_success");
    var visual_status_failure = document.getElementById("visual_status_failure");
    var visual_status_ready = document.getElementById("visual_status_ready");

    function ping() {
        var client = new XMLHttpRequest();
        // cache burst GET request
        client.open('GET', '/pong.txt?' + Math.random());
        client.timeout = 5000;
        client.onload = function() {
            visual_status_failure.style.display = "none";
            visual_status_ready.style.display = "none";
            visual_status_success.style.display = "block";
            success_audio.play();
        }
        client.ontimeout = client.onerror = function() {
            visual_status_success.style.display = "none";
            visual_status_ready.style.display = "none";
            visual_status_failure.style.display = "block";
            fail_audio.play();
        }
        client.onloadend = function() {
            setTimeout(reset, 3000);
        }
        client.send();
    }

    function reset() {
        visual_status_success.style.display = "none";
        visual_status_failure.style.display = "none";
        visual_status_ready.style.display = "block";
        setTimeout(ping, 2000);
    }

    function start_ping_loop() {
        setup_elem.parentNode.removeChild(setup_elem);
        reset();
    }

    start_audio.onended = start_ping_loop;
})

