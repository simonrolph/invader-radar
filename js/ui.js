/**
 * UI Module
 * Handles user interface interactions and updates
 */

function updateProgressBar(width, message) {
    if (bar) {
        bar.style.width = width + "%";
        bar.innerHTML = message;
    }
}

function hideProgressBar() {
    setTimeout(function () {
        const progressbar = document.getElementById("progbar");
        if (progressbar) {
            progressbar.style.opacity = '0';
        }
    }, 500);
}

function applySettings(reset_gps) {
    if (reset_gps) {
        window.location = "?i_rad=" + document.getElementById("i_rad").value + "&o_rad=" + document.getElementById("o_rad").value + extra_params;
    } else {
        window.location = '?lat=' + document.getElementById("lat").value + "&lng=" + document.getElementById("lng").value + "&i_rad=" + document.getElementById("i_rad").value + "&o_rad=" + document.getElementById("o_rad").value + extra_params;
    }
}
