
/* =======================
      GLOBAL VARIABLES
   ======================= */
const MAX_OTP_ATTEMPTS = 0;

let emailOtpAttempts = 0;
let mobileOtpAttempts = 0;
let twoFactorOtpAttempts = 0;

let authSteps = [];
let currentStepIndex = 0;
let isCaptchaVerified = false;
// GLOBAL FLAG
let isCaptchaShown = false;

let qrGenerated = false; // QR generated first time

let otpSettings = {};
let otpAttempts = {};
// =======================
// GLOBAL VARIABLES
// =======================
let resendTimers = {};   // ✅ FIX
let resendIntervals = {};     // interval references ✅ FIX

// Initially hide button
//$('#btnShowQRAgain').hide();

const STEP_ORDER = ["captcha", "email_verify", "mobile_verify", "two_factor"];

const otpConfigs = {
    email_verify: {
        inputs: $('.otp-input'),
        verifyBtn: $('#verifyBtn')
    },
    mobile_verify: {
        inputs: $('.otp-input-mobile'),
        verifyBtn: $('#verifyBtnMobile')
    },
    two_factor: {
        inputs: $('.otp-input-2FA'),
        verifyBtn: $('#verifyBtn2FA')
    }
};

$(document).ready(function () {

    showScreen("loginContainer");

    // Init immediately
    initAuthSettings(window.AUTH_SETTINGS);

    restoreResendTimers();

    /* =======================
       TOASTR CONFIG
    ======================= */
    toastr.options = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
        timeOut: 3000,
        extendedTimeOut: 1000,
        preventDuplicates: true,
        newestOnTop: true
    };

    /* =======================
      LOGIN
   ======================= */
    $("#togglePassword").click(function () {
        const password = $("#txtPass");
        const icon = $(this); // use jQuery consistently

        if (password.attr("type") === "password") {
            password.attr("type", "text");
            icon.removeClass("fa-eye").addClass("fa-eye-slash");
        } else {
            password.attr("type", "password");
            icon.removeClass("fa-eye-slash").addClass("fa-eye");
        }

    });

    $("#btnSubmitLogin").click(function () {

        var email = $("#txtEmail").val().trim();
        var pass = $("#txtPass").val().trim();
        var captcha = $("#txtCaptcha").val().trim();

        if (email === "" || pass === "") {  // || captcha.length !== 5)) {
            if (email === "")
                $("#lblemailError").text("Please enter Username.").removeClass("d-none");
            if (pass === "")
                $("#lblpassError").text("Please enter Password.").removeClass("d-none");
            //if (captcha === "" )
            //    $("#captchaErrorMsg").text("Please Enter Captcha").removeClass("d-none").addClass("d-flex");

            return;
        }
        // 🔹 CAPTCHA VALIDATION ONLY IF SHOWN
        if (isCaptchaShown) {

            if (captcha === "" || captcha.length !== 5) {
                $("#captchaErrorMsg")
                    .text("Please enter valid Captcha")
                    .removeClass("d-none")
                    .addClass("d-flex");
                return; // 🚫 stop login
            }

            // Verify captcha first
            verifyCaptchaAndLogin();
        }
        else {
            // 🚀 Direct login (captcha not shown)
            loginUser();
        }
    });


    /* =======================
      Check all input value are entered or not.
   ======================= */
    $("#txtCaptcha").on("keyup", function () {

        var captcha = $("#txtCaptcha").val().trim();
        if (captcha !== "") {
            $("#captchaErrorMsg").addClass("d-none").removeClass("d-flex").text("");
        } else {
            $("#captchaErrorMsg").text("Please Enter Captcha").removeClass("d-none").addClass("d-flex");

        }

    });

    $("#txtEmail").on("keyup", function () {
        var email = $("#txtEmail").val().trim();
        if (email !== "") {

            $("#lblemailError").addClass("d-none").text("");
        }
        else {
            $("#lblemailError").text("Please enter Username.").removeClass("d-none");

        }
    });

    $("#txtPass").on("keyup", function () {

        var pass = $("#txtPass").val().trim();
        if (pass !== "") {
            $("#lblpassError").addClass("d-none").text("");
        }
        else {
            $("#lblpassError").text("Please enter Password.").removeClass("d-none");

        }
    });

    /* =======================
       OTP Resend HANDLERS
    ======================= */
    $('#resendLink').on('click', function () {

        if ($(this).hasClass('disabled')) return;

        const type = authSteps[currentStepIndex];

        onOtpSent(type);   // 🔥 restart resend timer
    });

    $('#resendLinkMobile').on('click', function () {

        if ($(this).hasClass('disabled')) return;

        const type = authSteps[currentStepIndex];

        onOtpSent(type);   // 🔥 restart resend timer
    });

    /* =======================
       OTP VERIFY HANDLERS
    ======================= */
    $('#verifyBtn').click(() => verifyStaticOtp('email_verify'));

    $('#verifyBtnMobile').click(() => verifyStaticOtp('mobile_verify'));

    $('#verifyBtn2FA').click(function () {
        const otp = getOtpValue('two_factor');

        if (otp.length < 6) {
            toastr.warning("Please enter a 6-digit OTP");
            return;
        }

        $.post('/Login/VerifyTwoFactorCode', { otp })
            .done(res => {
                if (res.success) {
                    toastr.success("2FA verification successful");

                    otpAttempts['two_factor'] = 0;
                    saveOtpAttempts();
                    goToNextStep();


                    // ✅ RESET ATTEMPTS HERE
                    //otpConfigs['2fa'].resetAttempts();
                    //saveOtpAttempts();   // 🔥 ADD THIS LINE
                    //goToNextStep();
                } else {
                    resetOtp('two_factor');
                    handleOtpFailure('two_factor');
                }
            });
    });


    //$('#btnClear2FA').on('click', function () {

    //    if (!confirm("This will require scanning QR code again. Continue?")) {
    //        return;
    //    }

    //    $.ajax({
    //        url: '/Login/ResetTwoFactorForNewDevice',
    //        type: 'POST',
    //        success: function (response) {
    //            if (response.success) {
    //                // Redirect to login page


    //                load2FASetup();
    //                //window.location.href = '/Login';
    //            } else {
    //                alert(response.message || "Unable to reset 2FA");
    //            }
    //        },
    //        error: function () {
    //            alert("Something went wrong. Please try again.");
    //        }
    //    });
    //});

    /* =======================
       Button VERIFY HANDLERS
    ======================= */
    $("#btnVeriyOtpScreen").on("click", function () {

        // Show main 2FA container
        showScreen("twoFactorQRContainer");

        //$('#twoFactorQRContainer').removeClass('d-none').addClass('d-flex');

        // Hide QR screen
        $('#QRGenerator').addClass('d-none');

        // Show OTP verify screen
        $('#twoFactorVerifyContainer').removeClass('d-none');

        //if (qrGenerated) {
        //    $('#btnShowQRAgain').removeClass('d-none');

        //    $('#btnClear2FA').addClass('d-none');

        //} else {
        //    $('#btnShowQRAgain').addClass('d-none');

        //    $('#btnClear2FA').removeClass('d-none');

        //}

        // Hide No QR message if visible
        $("#NoQrCode").addClass("d-none");



        // Focus first OTP input
        $('#twoFactorVerifyContainer input:first').focus();
        saveAuthState({ screen: "2fa_verify" });


    });

    $('#btnShowQRAgain').click(function () {
        if (!qrGenerated) return; // safety check

        // Hide OTP inputs
        $('#twoFactorVerifyContainer').addClass('d-none');

        // Show QR generator container
        $('#QRGenerator').removeClass('d-none');
        $('#twoFactorQRContainer').removeClass('d-none');
        $('#NoQrCode').addClass('d-none');
    });

    $('#btnRefreshCaptch').on('click', function () {
        refreshCaptcha();
    });

    $('#btnCopySecret').on('click', function () {

        const $btn = $(this);
        const secret = $('#manualSecret').text().trim();

        if (!secret) return;

        navigator.clipboard.writeText(secret).then(() => {

            // Change text to "Copied"
            $btn.text('Copied ✓')
                .removeClass('btn-outline-secondary')
                .addClass('btn-success');

            // Reset after 2 seconds
            setTimeout(() => {
                $btn.text('Copy')
                    .removeClass('btn-success')
                    .addClass('btn-outline-secondary');
            }, 2000);

        }).catch(() => {
            toastr.error('Unable to copy secret key');
        });
    });


});


function initOtpInputs(config) {

    config.inputs.on('input', function () {
        const $this = $(this);
        const index = parseInt($this.data('index'));
        const value = $this.val();

        if (!/^\d*$/.test(value)) {
            $this.val('');
            return;
        }

        if (value && index < config.inputs.length - 1) {
            config.inputs.eq(index + 1).focus();
        }

        updateOtpStyles();
        checkOtpComplete();
    });

    config.inputs.on('keydown', function (e) {
        const index = parseInt($(this).data('index'));

        if (e.key === 'Backspace' && !this.value && index > 0) {
            config.inputs.eq(index - 1).val('').focus();
        }

        if (e.key === 'ArrowLeft' && index > 0)
            config.inputs.eq(index - 1).focus();

        if (e.key === 'ArrowRight' && index < config.inputs.length - 1)
            config.inputs.eq(index + 1).focus();
    });

    config.inputs.on('click', function () {
        this.select();
    });
}

Object.values(otpConfigs).forEach(initOtpInputs);

/* =======================
   RESTORE SCREEN
======================= */
function restoreScreen(state) {
    if (!state || !state.screen) {
        return;
    }

    switch (state.screen) {
        case "email":
            showScreen("emailOtpVerifyContainer");
            break;

        case "mobile":
            showScreen("mobieOtpVerifyContainer");
            break;

        case "2fa_qr":
            showScreen("twoFactorQRContainer");
            load2FASetup();
            break;

        case "2fa_verify":
            showScreen("twoFactorQRContainer");
            $("#QRGenerator").addClass("d-none");
            $("#twoFactorVerifyContainer").removeClass("d-none");
            break;

        //default:
        //    showScreen("loginContainer");
    }
}

function goToNextStep() {
    currentStepIndex++;
    saveAuthState();
    if (currentStepIndex < authSteps.length) {
        showCurrentStep();
    } else {
        finalizeLogin(); // 🔥 ONLY HERE
    }

}


/* =======================
 SESSION STORAGE HELPERS
 ======================= */
function saveAuthState(extra = {}) {
    sessionStorage.setItem("authState", JSON.stringify({
        currentStepIndex,
        qrGenerated,
        ...extra
    }));
}

function getAuthState() {
    const state = sessionStorage.getItem("authState");
    return state ? JSON.parse(state) : null;
}

function clearAuthState() {
    sessionStorage.removeItem("authState");
}

/* =======================
RESTORE STATE ON REFRESH
======================= */
const savedState = getAuthState();
if (savedState) {
    currentStepIndex = savedState.currentStepIndex ?? 0;
    qrGenerated = savedState.qrGenerated ?? false;
}
restoreOtpAttempts(); // ✅ add here

/*
=======================
 OTP Functionality
 ======================= 
*/
function saveOtpAttempts() {
    sessionStorage.setItem("otpAttempts", JSON.stringify(otpAttempts));

}

function restoreOtpAttempts() {
    const data = sessionStorage.getItem("otpAttempts");
    if (data) {
        otpAttempts = JSON.parse(data);
    }
}

function clearOtpAttempts() {
    sessionStorage.removeItem("otpAttempts");
}

restoreOtpAttempts();

/* =======================
   SCREEN CONTROL
======================= */
function showCurrentStep() {

    const step = authSteps[currentStepIndex];


    // ✅ Reset attempts ONLY when entering step first time
    otpAttempts[step] ??= 0;
    saveOtpAttempts();

    hideAllScreens();


    if (step === "email_verify") {
        showScreen("emailOtpVerifyContainer");
        saveAuthState({ screen: "email" });
        onOtpSent("email_verify");   // ✅ IMPORTANT
    }

    if (step === "mobile_verify") {
        showScreen("mobieOtpVerifyContainer");
        saveAuthState({ screen: "mobile" });

        onOtpSent("mobile_verify");  // ✅ IMPORTANT

    }

    if (step === "two_factor") {
        showScreen("twoFactorQRContainer");
        load2FASetup();
        saveAuthState({ screen: "2fa_qr" });
    }
}

/* =======================
   HELPERS
======================= */
function updateOtpStyles() {
    $('.otp-input, .otp-input-mobile, .otp-input-2FA')
        .toggleClass('filled', function () {
            return $(this).val() !== '';
        });
}

function checkOtpComplete() {
    Object.values(otpConfigs).forEach(cfg => {
        const incomplete = cfg.inputs.toArray().some(i => !i.value);
        cfg.verifyBtn.prop('disabled', incomplete);

        if (incomplete) {
            cfg.verifyBtn.attr("title", "Enter complete OTP");
        }
    });

    Object.values(otpConfigs).forEach(cfg => {
        const allFilled = cfg.inputs.toArray().every(i => i.value.trim() !== '');
        cfg.verifyBtn.prop('disabled', !allFilled);
    });
}

function getOtpValue(type) {
    if (!otpConfigs[type]) {
        console.error("Invalid OTP type:", type);
        return '';
    }


    let otp = '';

    otpConfigs[type].inputs.each(function () {
        otp += this.value;
    });
    return otp;
}

// Reset OTP inputs (invalid attempt)
function resetOtp(type) {
    otpConfigs[type].inputs.val('').removeClass('filled');
    otpConfigs[type].verifyBtn.prop('disabled', true); // disable verify button
    otpConfigs[type].inputs.first().focus();
}

function handleOtpFailure(type) {

    otpAttempts[type]++;
    saveOtpAttempts();

    //const attempts = otpConfigs[type].attempts();
    //saveOtpAttempts(); // 🔥 persist attempts
    const maxAttempts = otpSettings[type]?.maxAttempts ?? 0;

    const remaining = maxAttempts - otpAttempts[type];

    if (otpAttempts[type] >= maxAttempts) {

        toastr.error("Too many failed attempts. Redirecting...");
        clearAuthState();
        setTimeout(() => window.location.href = "/Login", 1500);


    } else {
        toastr.warning(
            `
    <div>
        <strong>Invalid ${type} OTP</strong><br>
        Attempts left: <strong>${remaining}</strong>
    </div>
    `
        );

    }
}

function refreshCaptcha() {
    $("#captchaImg").attr("src", "/Login/Generate?" + Date.now());
}

function hideAllScreens() {
    $('.auth-screen').removeClass('active');
}

function showScreen(id) {
    hideAllScreens();
    $('#' + id).addClass('active');
}
function verifyStaticOtp(type) {
    const otp = getOtpValue(type);
    if (type === "email_verify") {
        $.ajax({
            url: '/Login/VerifyEmailOtp', // adjust controller name
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                otp: otp,
                type: type
            }),
            success: function (response) {
                console.log(response);
                if (response.success) {
                    notificationToastCustom('success', response.message, "SUCCESS")
                    //toastr.success(`${type.toUpperCase()} OTP verified`);

                    // stop resend timer
                    stopResendTimer(type);

                    otpAttempts[type] = 0;
                    saveOtpAttempts();

                    goToNextStep();
                } else {
                    notificationToastCustom('error', response.message, "ERROR")

                    resetOtp(type);
                    handleOtpFailure(type);
                }
            },
            error: function () {
                toastr.error("Something went wrong while verifying OTP");
            }
        });
    }
    else {
        if (otp === "123456") {
            toastr.success(`${type.toUpperCase()} OTP verified`);
            // ✅ STOP resend timer for THIS OTP
            stopResendTimer(type);
            otpAttempts[type] = 0;
            saveOtpAttempts();

            goToNextStep();


        } else {
            resetOtp(type);
            handleOtpFailure(type);
        }
    }

}

function initAuthSettings(authSettings) {
    authSettings.forEach(x => {
        const code = (x.authCode || '').toLowerCase();
        otpSettings[code] = {
            maxAttempts: x.otpattempt,
            resendAfterMin: x.otpresetTime
        };

        otpAttempts[code] = 0;
    });

    //Object.keys(otpSettings).forEach(key => {
    //    console.log(
    //        key,
    //        otpSettings[key].maxAttempts,
    //        otpSettings[key].resendAfterMin
    //    );
    //});
    //Object.keys(otpAttempts).forEach(key => {
    //    console.log(
    //        key,
    //        otpSettings[key].maxAttempts,
    //        otpSettings[key].resendAfterMin
    //    );
    //});


    authSteps = [];

    STEP_ORDER.forEach(step => {
        if (authSettings.some(a =>
            (a.authCode || "").toLowerCase() === step && a.isEnabled)) {
            authSteps.push(step);
        }
    });

    // CAPTCHA HANDLING
    if (authSteps.includes("captcha")) {
        isCaptchaShown = true;

        $("#authCaptchaDiv").removeClass("d-none");
        //$("#btnSubmitLogin").prop("disabled", true);
        isCaptchaVerified = false;
    } else {
        $("#authCaptchaDiv").addClass("d-none");
        //$("#btnSubmitLogin").prop("disabled", false);
        isCaptchaShown = false;

        isCaptchaVerified = true;
    }

    // 🔁 RESTORE SESSION OR FIRST LOAD
    const state = getAuthState();
    if (state && state.screen) {
        currentStepIndex = state.currentStepIndex ?? 0;
        qrGenerated = state.qrGenerated ?? false;
        restoreScreen(state);
    } else {
        showScreen("loginContainer");
    }

    restoreOtpAttempts();
}

function load2FASetup() {


    $.ajax({
        url: "/Login/GenerateTwoFactorQR", // adjust controller path
        type: "GET",
        success: function (response) {


            if (response.success == true && response.isEnabled == false) {
                showScreen("twoFactorQRContainer");
                $('#twoFactorVerifyContainer').addClass('d-none');
                // Bind QR image
                $("#QRCODE").html(
                    `<img src="${response.qrCode}" alt="2FA QR Code" />`
                );

                // Show QR section
                $("#QRGenerator").removeClass("d-none");
                $(".no-qr-message").addClass("d-none");


                // Manual setup data
                $('#manualAccount').text(response.account || '');
                $('#manualSecret').text(response.manualKey || '');
                // Set flag: QR generated first time
                qrGenerated = true;


            } else {
                // Show main 2FA container
                /*$('#twoFactorQRContainer').removeClass('d-none').addClass('d-flex');*/
                qrGenerated = false;

                showScreen("twoFactorQRContainer");

                // Hide QR screen
                $('#QRGenerator').addClass('d-none');


                // Show OTP verify screen
                $('#twoFactorVerifyContainer').removeClass('d-none');



                // Hide No QR message if visible
                $("#NoQrCode").addClass("d-none");

                // Focus first OTP input
                $('#twoFactorVerifyContainer input:first').focus();
            }
        },
        error: function () {
            toastr.error("Unable to load 2FA QR code. Please try again.");
            showNoQr();
        }

    });
}

function startResendTimer(type) {

    type = type.toLowerCase();

    const resendMin = otpSettings[type]?.resendAfterMin;
    if (!resendMin) return;

    const waitMs = resendMin * 60 * 1000;
    const enableAt = Date.now() + waitMs;

    resendTimers[type] = enableAt;

    sessionStorage.setItem("resendTimers", JSON.stringify(resendTimers));

    disableResendLink(type);
    updateResendCountdown(type);
}

function disableResendLink(type) {
    $('#resendLink')
        .addClass('disabled')
        .text('Resend OTP');

    $('#resendLinkMobile')
        .addClass('disabled')
        .text('Resend OTP');
}

function enableResendLink(type) {
    $('#resendLink')
        .removeClass('disabled')
        .text('Resend OTP');

    $('#resendLinkMobile')
        .removeClass('disabled')
        .text('Resend OTP');
}

//function updateResendCountdown(type) {

//    const interval = setInterval(() => {

//        const enableAt = resendTimers[type];
//        if (!enableAt) return clearInterval(interval);

//        const remaining = Math.max(0, enableAt - Date.now());

//        if (remaining <= 0) {
//            clearInterval(interval);
//            enableResendLink(type);
//            return;
//        }

//        const sec = Math.ceil(remaining / 1000);
//        $('#resendLink').text(`Resend OTP in ${sec}s`);
//        $('#resendLinkMobile').text(`Resend OTP in ${sec}s`);

//    }, 1000);
//}

function updateResendCountdown(type) {

    // clear existing interval if any
    if (resendIntervals[type]) {
        clearInterval(resendIntervals[type]);
    }

    resendIntervals[type] = setInterval(() => {

        const enableAt = resendTimers[type];
        if (!enableAt) {
            clearInterval(resendIntervals[type]);
            return;
        }

        const remainingMs = Math.max(0, enableAt - Date.now());

        if (remainingMs <= 0) {
            clearInterval(resendIntervals[type]);
            enableResendLink(type);
            return;
        }

        const totalSeconds = Math.ceil(remainingMs / 1000);

        let displayText = '';

        if (totalSeconds >= 60) {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            displayText = `Resend OTP in ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            displayText = `Resend OTP in ${totalSeconds}s`;
        }

        $('#resendLink').text(displayText);
        $('#resendLinkMobile').text(displayText);

    }, 1000);
}



function stopResendTimer(type) {
    type = type.toLowerCase();

    if (resendIntervals[type]) {
        clearInterval(resendIntervals[type]);
        delete resendIntervals[type];
    }

    delete resendTimers[type];
    sessionStorage.setItem("resendTimers", JSON.stringify(resendTimers));

    enableResendLink(type);
}


function restoreResendTimers() {

    const data = sessionStorage.getItem("resendTimers");
    if (!data) return;

    resendTimers = JSON.parse(data);

    Object.keys(resendTimers).forEach(type => {
        if (Date.now() < resendTimers[type]) {
            disableResendLink(type);
            updateResendCountdown(type);
        } else {
            enableResendLink(type);
        }
    });
}

function onOtpSent(type) {
    type = type.toLowerCase();


    // Reset OTP inputs
    resetOtp(type);

    // Start resend timer from DB
    startResendTimer(type);


    // 🔥 CALL BACKEND BASED ON STEP TYPE
    if (type === "email_verify") {
        sendEmailOtp(type);
    }
    else if (type === "mobile_verify") {
        //sendMobileOtp();
    }
    else if (type === "two_factor") {
        // 2FA OTP is generated by authenticator app (no send)
        return;
    }

    //toastr.info(`OTP sent (${type.replace('_', ' ')})`);
}


function verifyCaptchaAndLogin() {

    $.post("/Login/VerifyCaptcha", { captcha: $("#txtCaptcha").val() })
        .done(valid => {

            if (!valid) {
                $("#captchaErrorMsg")
                    .text("Invalid Captcha")
                    .removeClass("d-none")
                    .addClass("d-flex");

                $("#txtCaptcha").val('');
                refreshCaptcha();
                return;
            }

            // Captcha success
            $("#captchaErrorMsg").addClass("d-none").text("");
            $("#txtCaptcha").prop("disabled", true);

            loginUser();
        });
}


function loginUser() {

    $.ajax({
        url: '/Login/Login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            Email: $("#txtEmail").val(),
            Password: $("#txtPass").val()
        }),
        success: function (res) {
            if (res.result === 1) {
               
                clearOtpAttempts();
                otpAttempts = {};
                qrGenerated = false;
                currentStepIndex = authSteps.findIndex(s => s !== "captcha");

                currentStepIndex !== -1 ? showCurrentStep() : finalizeLogin();


            } else {
                toastr.error(res.message || "Invalid credentials");
            }
        },
        error: function () {
            toastr.error("Login failed. Please try again.");
        }
    });
    saveAuthState({ screen: "login" });

}

function finalizeLogin() {
    $.post('/Login/FinalizeLogin')
        .done(() => {
            clearAuthState();
            clearOtpAttempts();
            toastr.success("Login successful");
            window.location.href = "/Home/Dashboard";
        })
        .fail(() => {
            toastr.error("Authentication incomplete");
            window.location.href = "/Login";
        });
}

function sendEmailOtp(type) {
    
    $.ajax({
        url: '/Login/SendEmailOtp',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(type), // send raw string
        success: function (res) {
            console.log(res);
            if (res.success) {
                toastr.success("OTP sent to your email");
            } else {
                toastr.error(res.message || "Failed to send email OTP");
            }
        },
        error: function () {
            toastr.error("Unable to send email OTP");
        }
    });
}

function sendMobileOtp() {
    $.ajax({
        url: '/Login/SendMobileOtp',
        type: 'POST',
        success: function (res) {
            if (res.success) {
                toastr.success("OTP sent to your mobile");
            } else {
                toastr.error(res.message || "Failed to send mobile OTP");
            }
        },
        error: function () {
            toastr.error("Unable to send mobile OTP");
        }
    });
}