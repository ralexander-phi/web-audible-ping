window.addEventListener('load', function () {
    var setup_elem = document.getElementById("setup");

    var start_audio = document.getElementById("start_wav");
    var success_audio = document.getElementById("success_wav");
    var fail_audio = document.getElementById("fail_wav");

    var visual_status_success = document.getElementById("visual_status_success");
    var visual_status_failure = document.getElementById("visual_status_failure");
    var visual_status_ready = document.getElementById("visual_status_ready");

    var settings_button = document.getElementById("settings");
    var settings_panel = document.getElementById("settings-panel");

    var mute_toggle = document.getElementById("mute");
    var beep_on_success_toggle = document.getElementById("beep-on-success");
    var beep_on_failure_toggle = document.getElementById("beep-on-failure");
    var invert_toggle = document.getElementById("invert");

    settings_button.onclick = function() {
        if (settings_panel.style.display === "none") {
            settings_panel.style.display = "block";
        } else {
            settings_panel.style.display = "none";
        }
    }

    mute_toggle.onclick = function() {
        beep_on_success_toggle.disabled =
          beep_on_failure_toggle.disabled =
            mute_toggle.checked;
    }

    function on_result(isSuccess) {
        visual_status_ready.style.display = "none";
        if (isSuccess) {
            visual_status_success.style.display = "block";
            visual_status_failure.style.display = "none";
        } else {
            visual_status_success.style.display = "none";
            visual_status_failure.style.display = "block";
        }

        var shouldPlay = (
          (! mute_toggle.checked) &&
           ((beep_on_success_toggle.checked && isSuccess) ||
           (beep_on_failure_toggle.checked && !isSuccess)));

        if (shouldPlay) {
            if (invert_toggle.checked != isSuccess) {
                success_audio.play();
            } else {
                fail_audio.play();
            }
        }
    }

    function ping() {
        var client = new XMLHttpRequest();
        // cache burst GET request
        client.open('GET', '/web-audible-ping/pong.txt?' + Math.random());
        client.timeout = 5000;
        client.onload = function() { on_result(true); };
        client.ontimeout = client.onerror = function() { on_result(false); };
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

