$(document).ready(function () {

    

    let settingId = null; // Will hold the ID if record exists

    function loadSettings() {
        $.ajax({
            url: '/RegistrationVerification/GetRegistrationVerificationSettings',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
               
                if (!data) return;

                settingId = data.id || null; // Store ID if present

                $('#mobileOtpToggle').prop('checked', !!data.mobileOtpRequired);
                $('#emailOtpToggle').prop('checked', !!data.emailOtpRequired);
                $('#autoExpireAccountToggle').prop('checked', !!data.autoExpireEnabled);

                $('#mobileOtpAttempts').val(data.mobileOtpAttempts ?? 3);
                $('#mobileOtpReset').val(data.mobileOtpReset ?? 10);
                $('#otpMobileExpirationTime').val(data.mobileOtpExpiration ?? '');

                $('#emailOtpAttempts').val(data.emailOtpAttempts ?? 3);
                $('#emailOtpReset').val(data.emailOtpReset ?? 10);
                $('#otpEmailExpirationTime').val(data.emailOtpExpiration ?? '');
            },
            error: function (xhr, status, error) {
                alert('Failed to load settings: ' + (xhr.responseText || error));
            }
        });
    }

    loadSettings();

    function getIntValue(selector) {
        let val = parseInt($(selector).val(), 10);
        return isNaN(val) ? null : val;   // 🔥 Fix for null issue
    }

    $('#btnUpdateAuthSetting').on('click', function () {

        var data = {
            Id: settingId || 0,

            MobileOtpRequired: $('#mobileOtpToggle').is(':checked'),
            EmailOtpRequired: $('#emailOtpToggle').is(':checked'),
            AutoExpireEnabled: $('#autoExpireAccountToggle').is(':checked'),

            MobileOtpAttempts: getIntValue('#mobileOtpAttempts'),
            MobileOtpReset: getIntValue('#mobileOtpReset'),
            MobileOtpExpiration: getIntValue('#otpMobileExpirationTime'),

            EmailOtpAttempts: getIntValue('#emailOtpAttempts'),
            EmailOtpReset: getIntValue('#emailOtpReset'),
            EmailOtpExpiration: getIntValue('#otpEmailExpirationTime'),

            IsActive: true,
            CreatedBy: 0
        };

        console.log("Sending Data:", data); // 🔍 Debug

        var $btn = $(this);
        $btn.prop('disabled', true).text('Saving...');

        // ✅ FIXED URL LOGIC
        let ajaxUrl = settingId
            ? '/RegistrationVerification/UpdateRegistrationVerificationSettings'
            : '/RegistrationVerification/SaveRegistrationVerificationSettings';

        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),

            success: function (res) {
                if (res.result)
                    notificationToastCustom('success', res.message, "Success");
                else
                    notificationToastCustom('error', res.message, "Error");


                $btn.prop('disabled', false)
                    .html('<i class="fas fa-save me-1"></i> Update Settings');
                loadSettings();
            },

            error: function (xhr) { 
                console.error(xhr.responseText);
                alert('Error: ' + (xhr.responseText || 'Something went wrong'));
                $btn.prop('disabled', false)
                    .html('<i class="fas fa-save me-1"></i> Update Settings');
            }
        });
    });

    $('#btnCancelSetting').on('click', function () {
        $('#btnCancelSetting').on('click', function () {
            window.location.href = '/Home/Dashboard';
        });
    });
});