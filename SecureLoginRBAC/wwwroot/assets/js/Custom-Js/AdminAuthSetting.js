$(document).ready(function () {
    loadAuthSettings();
    loadPasswordRules();




    /* ===============================
       Method card click interaction
    ================================ */
    $('.method-card').each(function () {
        const $card = $(this);
        const $toggle = $card.find('input[type="checkbox"]');

        $card.on('click', function (e) {

            if (
                e.target.type !== 'checkbox' &&
                !$(e.target).hasClass('toggle-switch') &&
                !$(e.target).hasClass('toggle-slider')
            ) {
                $toggle.prop('checked', !$toggle.prop('checked')).trigger('change');
            }
        });


    });



    /* ===============================
       Toggle method card active state
    ================================ */
    $('.toggle-switch input').on('change', function () {

        const $card = $(this).closest('.method-card');

        if ($(this).is(':checked')) {
            $card.addClass('active');
        } else {
            $card.removeClass('active');
        }
    });

    // Prevent button click from toggling checkbox
    $('.method-card button').on('click', function (e) {

        loadEmailConfig();
        e.stopPropagation(); // 🔑 this is the fix
    });

    /* ===============================
       Ensure at least one auth method
    ================================ */
    const authToggles = [
        $('#mobileOtpToggle'),
        $('#emailOtpToggle'),
        $('#twoFaToggle'),
        $('#captchaToggle')
    ];



    $(document).on("click", "#btnUpdateAuthSetting", function () {

        const isAnyChecked =
            $("#captchaToggle").is(":checked") ||
            $("#emailOtpToggle").is(":checked") ||
            $("#mobileOtpToggle").is(":checked") ||
            $("#twoFaToggle").is(":checked");

        if (!isAnyChecked) {
            notificationToastCustom(
                'warning',
                'At least one authentication method must be enabled.',
                'Validation'
            );
            return false;
        }


        const authSettings = [];

        // Captcha
        authSettings.push({
            AuthSettingId: $('#captchaAuthSettingId').val() || 0,
            IsEnabled: $("#captchaToggle").is(":checked"),
            AuthCode: "CAPTCHA",
            Otpattempt: null,
            OtpresetTime: null,
            OtpexpiryTime: null
        });

        // Email OTP
        authSettings.push({
            AuthSettingId: $('#emailOtpAuthSettingId').val() || 0,
            AuthCode: "EMAIL_VERIFY",
            IsEnabled: $("#emailOtpToggle").is(":checked"),
            Otpattempt: $("#emailOtpAttempts").val() ? parseInt($("#emailOtpAttempts").val()) : null,
            OtpresetTime: $("#emailOtpReset").val() ? parseInt($("#emailOtpReset").val()) : null,
            OtpexpiryTime: $("#otpEmailExpirationTime").val()
                ? parseInt($("#otpEmailExpirationTime").val())
                : null
        });

        // Mobile OTP
        authSettings.push({
            AuthSettingId: $('#mobileOtpAuthSettingId').val() || 0,
            AuthCode: "MOBILE_VERIFY",
            IsEnabled: $("#mobileOtpToggle").is(":checked"),
            Otpattempt: $("#mobileOtpAttempts").val() ? parseInt($("#mobileOtpAttempts").val()) : null,
            OtpresetTime: $("#mobileOtpReset").val() ? parseInt($("#mobileOtpReset").val()) : null,
            OtpexpiryTime: $("#otpMobileExpirationTime").val()
                ? parseInt($("#otpMobileExpirationTime").val())
                : null
        });

        // Two Factor Auth
        authSettings.push({
            AuthSettingId: $('#twoFaAuthSettingId').val() || 0,
            AuthCode: "TWO_FACTOR",
            IsEnabled: $("#twoFaToggle").is(":checked"),
            Otpattempt: $("#twoFaAttempts").val() ? parseInt($("#twoFaAttempts").val()) : null,
            OtpresetTime: null,
            OtpexpiryTime: null
        });

        // ✅ Separate new vs existing settings
        const newSettings = authSettings.filter(s => s.AuthSettingId == 0);
        const updateSettings = authSettings.filter(s => s.AuthSettingId != 0);

        // ✅ Save new settings
        if (newSettings.length > 0) {
            $.ajax({
                url: '/AuthPasswordSetting/SaveAuthenticationSettings',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newSettings),
                success: function (response) {
                    if (response.result)
                        notificationToastCustom('success', response.message, "Success");
                    else
                        notificationToastCustom('error', response.message, "Error");
                },
                error: ajaxErrorHandler
            });
        }

        // ✅ Update existing settings
        if (updateSettings.length > 0) {
            $.ajax({
                url: '/AuthPasswordSetting/UpdateAuthenticationSettings',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(updateSettings),
                success: function (response) {
                    if (response.result)
                        notificationToastCustom('success', response.message, "Success");
                    else
                        notificationToastCustom('error', response.message, "Error");
                },
                error: ajaxErrorHandler
            });
        }

    });

    

    // DEBUG
    //$.ajax({
    //    url: '/AuthPasswordSetting/UpdateAuthenticationSettings',
    //    type: 'POST',
    //    contentType: 'application/json',
    //    data: JSON.stringify(authSettings),
    //    success: function (response) {


    //        if (response.result == true)
    //            notificationToastCustom('success', response.message, "Success")
    //        else
    //            notificationToastCustom('error', response.message, "Error")

    //    },
    //    error: function (xhr) {
    //        if (xhr.status === 403) {
    //            notificationToastCustom(
    //                'error',
    //                'You do not have permission to perform this action.',
    //                'Access Denied'
    //            );
    //        }
    //        else if (xhr.status === 401) {
    //            notificationToastCustom(
    //                'warning',
    //                'Your session has expired. Please login again.',
    //                'Unauthorized'
    //            );
    //        }
    //        else {
    //            notificationToastCustom(
    //                'error',
    //                'Something went wrong. Please try again later.',
    //                'Error'
    //            );
    //        }
    //    }
    //});
});

$('#btnCancelAuthSetting').on('click', function (e) {
    loadAuthSettings();
    notificationToastCustom('info', "Cancel Your Changes", "Information");
});

$('#btnCancelPasswordRule').on('click', function (e) {
    loadPasswordRules();
    notificationToastCustom('info', "Cancel Your Changes", "Information");
});

//$('#updatePasswordRules').click(function () {
$('#updatePasswordRules').on('click', function (e) {

    let rules = [
        {
            RuleId: $('#minLength').data('ruleid'),
            RuleCode: 'MIN_LENGTH',
            IsEnabled: $('#minLength').is(':checked'),
            RuleValue: 8
        },
        {
            RuleId: $('#uppercase').data('ruleid'),
            RuleCode: 'UPPERCASE',
            IsEnabled: $('#uppercase').is(':checked'),
            RuleValue: 1
        },
        {
            RuleId: $('#lowercase').data('ruleid'),
            RuleCode: 'LOWERCASE',
            IsEnabled: $('#lowercase').is(':checked'),
            RuleValue: 1
        },
        {
            RuleId: $('#number').data('ruleid'),
            RuleCode: 'NUMBER',
            IsEnabled: $('#number').is(':checked'),
            RuleValue: 1
        },
        {
            RuleId: $('#specialChar').data('ruleid'),
            RuleCode: 'SPECIAL_CHAR',
            IsEnabled: $('#specialChar').is(':checked'),
            RuleValue: 1
        }
    ];

    $.ajax({
        url: '/AuthPasswordSetting/UpdatePasswordRule',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(rules),
        success: function (response) {
            if (response.result == true)
                notificationToastCustom('success', response.message, "Success");
            else
                notificationToastCustom('error', response.message, "Error");

        },
        error: ajaxErrorHandler
    });
});

$("#btnSaveEmail").on('click', function () {
    if (!validateEmailConfig()) return; // stop if invalid
    let emailData = {
        emailId: $("#editIndex").val() ? parseInt($("#editIndex").val()) : 0,
        email: $("#txtemail").val(),
        appPassword: $("#txtPassword").val(),
        smtpPort: parseInt($("#txtSmtpPort").val()),
        smtpServer: $("#txtSmtpServer").val()
    };

    if (emailData.emailId == 0 && emailData.emailId != null) {
        $.ajax({
            url: "/AuthPasswordSetting/SaveEmailConfig",   // backend decides insert/update
            type: "POST",
            data: JSON.stringify(emailData),
            contentType: "application/json",
            success: function (response) {
                if (response.result == true) {
                    notificationToastCustom('success', response.message, "Success");
                    loadEmailConfig();
                    $("#btnEmailSidebar").offcanvas('hide');
                }
                else {
                    notificationToastCustom('error', response.message, "Error");
                }

            },
            error: ajaxErrorHandler
        });
    }
    else {
        $.ajax({
            url: "/AuthPasswordSetting/updateEmailConfig",   // backend decides insert/update
            type: "POST",
            data: JSON.stringify(emailData),
            contentType: "application/json",
            success: function (response) {
                if (response.result == true) {
                    notificationToastCustom('success', response.message, "Success");
                    loadEmailConfig();
                    $("#btnEmailSidebar").offcanvas('hide');
                }
                else {
                    notificationToastCustom('error', response.message, "Error");
                }

            },
            error: ajaxErrorHandler
        });
    }
});

$('#txtSmtpPort').on('input', function () {
    $(this).val($(this).val().replace(/[^0-9]/g, ''));
});


$("#btnCancelEmail").on('click', function () {
    // Clear previous errors
    $(".field-error").addClass("d-none").text("");
    loadEmailConfig();

});

$("#togglePassword").click(function () {
    const password = $("#txtPassword");
    const icon = $(this).find("i"); // select the <i> inside the span

    if (password.attr("type") === "password") {
        password.attr("type", "text");
        icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        password.attr("type", "password");
        icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
});



function loadPasswordRules() {
    $.ajax({
        url: '/AuthPasswordSetting/GetPasswordRules',
        type: 'GET',
        success: function (rules) {

            rules.forEach(r => {

                let checkbox = null;

                switch (r.ruleCode) {
                    case 'MIN_LENGTH': checkbox = $('#minLength'); break;
                    case 'UPPERCASE': checkbox = $('#uppercase'); break;
                    case 'LOWERCASE': checkbox = $('#lowercase'); break;
                    case 'NUMBER': checkbox = $('#number'); break;
                    case 'SPECIAL_CHAR': checkbox = $('#specialChar'); break;
                }

                if (checkbox) {
                    checkbox.prop('checked', r.isEnabled);
                    checkbox.attr('data-ruleid', r.ruleId); // 🔑 STORE ID
                }
            });
        }
    });
}

function loadEmailConfig() {
    $.ajax({
        url: "/AuthPasswordSetting/getEmaiConfig",
        type: "GET",
        success: function (response) {
            // Clear previous errors
            $(".field-error").addClass("d-none").text("");
            // 🔹 set hidden id

            $("#editIndex").val(response.emailId);

            $("#txtemail").val(response.email);
            $("#txtPassword").val(response.appPassword);
            $("#txtSmtpPort").val(response.smtpPort);
            $("#txtSmtpServer").val(response.smtpServer);
        },
        error: function () {
            alert("Failed to load email configuration.");
        }
    });
}

function validateEmailConfig() {
    let isValid = true;

    const email = $("#txtemail").val().trim();
    const password = $("#txtPassword").val().trim();
    const smtpPort = $("#txtSmtpPort").val().trim();
    const smtpServer = $("#txtSmtpServer").val().trim();

    // Clear previous errors
    $(".field-error").addClass("d-none").text("");

    // ----- Email -----
    if (!email) {
        $("#lblemailError").removeClass("d-none").text("Email is required");
        isValid = false;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $("#lblemailError").removeClass("d-none").text("Enter a valid email");
            isValid = false;
        }
    }

    // ----- App Password -----
    if (!password) {
        $("#lblPasswordError").removeClass("d-none").text("App password is required");
        isValid = false;
    } else if (password.length !== 16) {
        $("#lblPasswordError").removeClass("d-none").text("App password must be exactly 16 characters");
        isValid = false;
    }

    // ----- SMTP Port -----
    if (!smtpPort) {
        $("#lblSmtpError").removeClass("d-none").text("SMTP port is required");
        isValid = false;
    } else if (!/^\d{3}$/.test(smtpPort)) {
        $("#lblSmtpError").removeClass("d-none").text("SMTP port must be 3 digits");
        isValid = false;
    }

    // ----- SMTP Server -----
    if (!smtpServer) {
        $("#lblSmtpServerError").removeClass("d-none").text("SMTP server is required");
        isValid = false;
    } else {
        // basic domain check (letters, numbers, dots, hyphens)
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(smtpServer)) {
            $("#lblSmtpServerError").removeClass("d-none").text("Enter a valid SMTP server");
            isValid = false;
        }
    }

    return isValid;
}
// ✅ Centralized AJAX error handler
function ajaxErrorHandler(xhr) {
    if (xhr.status === 403) {
        notificationToastCustom('error', 'You do not have permission to perform this action.', 'Access Denied');
    }
    else if (xhr.status === 401) {
        notificationToastCustom('warning', 'Your session has expired. Please login again.', 'Unauthorized');
    }
    else {
        notificationToastCustom('error', 'Something went wrong. Please try again later.', 'Error');
    }
}


function loadAuthSettings() {
    $.ajax({
        url: '/AuthPasswordSetting/GetAuthenticationSettings',
        type: 'GET',

        success: function (data) {
            bindAuthSettings(data);
        },
        error: function () {
            toastr.error('Failed to load authentication settings');
        }
    });
}

function bindAuthSettings(settings) {

    settings.forEach(function (item) {

        switch (item.authCode) {

            case 'CAPTCHA':
                $('#captchaToggle')
                    .prop('checked', item.isEnabled)
                    .trigger('change');
                $('#captchaAuthSettingId').val(item.authSettingId);

                break;

            case 'EMAIL_VERIFY':
                $('#emailOtpAuthSettingId').val(item.authSettingId);

                $('#emailOtpToggle')
                    .prop('checked', item.isEnabled)
                    .trigger('change');

                if (item.otpattempt)
                    $('#emailOtpAttempts').val(item.otpattempt);

                if (item.otpresetTime)
                    $('#emailOtpReset').val(item.otpresetTime);

                if (item.otpexpiryTime != null)
                    $('#otpEmailExpirationTime').val(item.otpexpiryTime);
                break;

            case 'MOBILE_VERIFY':
                $('#mobileOtpAuthSettingId').val(item.authSettingId);
                $('#mobileOtpToggle')
                    .prop('checked', item.isEnabled)
                    .trigger('change');

                if (item.otpattempt)
                    $('#mobileOtpAttempts').val(item.otpattempt);

                if (item.otpresetTime)
                    $('#mobileOtpReset').val(item.otpresetTime);

                if (item.otpexpiryTime != null)
                    $('#otpMobileExpirationTime').val(item.otpexpiryTime);

                break;

            case 'TWO_FACTOR':
                $('#twoFaAuthSettingId').val(item.authSettingId);

                $('#twoFaToggle')
                    .prop('checked', item.isEnabled)
                    .trigger('change');

                if (item.otpattempt)
                    $('#twoFaAttempts').val(item.otpattempt);
                break;
        }
    });
}

