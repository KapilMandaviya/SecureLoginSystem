
$(document).ready(function () {

    // Load data on page load
    loadSettings();

    // Save button
    $("#btnUpdateSetting").click(function () {
        saveSettings();
    });

    // Cancel button
    $("#btnCancelSetting").click(function () {
        loadSettings();
        notificationToastCustom('success', "Cancel your changes", "Success");
    });

    $("#applicationFee").on("input", function () {
        if ($(this).val() !== "" && parseFloat($(this).val()) >= 0) {
            $("#applicationFeeError").addClass("d-none");
            $(this).removeClass("is-invalid");
        }
    });

    $("#retryAttempts").on("input", function () {
        if ($(this).val() !== "" && parseInt($(this).val()) >= 0) {
            $("#retryAttemptsError").addClass("d-none");
            $(this).removeClass("is-invalid");
        }
    });

    $("input[name='paymentTiming']").change(function () {
        $("#paymentTimingError").addClass("d-none");
    });

    $("#gatewayProvider").on("input", function () {
        if ($(this).val().trim() !== "") {
            $("#gatewayProviderError").addClass("d-none");
            $(this).removeClass("is-invalid");
        }
    });

    $("#merchantKey").on("input", function () {
        if ($(this).val().trim() !== "") {
            $("#merchantKeyError").addClass("d-none");
            $(this).removeClass("is-invalid");
        }
    });

});


// ================= LOAD DATA =================
function loadSettings() {
    $.ajax({
        url: '/PaymentConfig/GetAll',
        type: 'GET',
        success: function (res) {
            res = res.data;
            if (res) {
                // 🔹 Store ID
                $("#settingId").val(res.id);
                // Payment Timing
                $("input[name='paymentTiming'][value='" + res.paymentTiming + "']")
                    .prop("checked", true);

                // Fee
                $("#applicationFee").val(res.applicationFee);
                $("#retryAttempts").val(res.retryAttempts);

                // Switches
                $("#refundableFee").prop("checked", res.refundableFee);
                $("#testMode").prop("checked", res.testMode);

                // Gateway
                $("#gatewayProvider").val(res.gatewayProvider);
                $("#merchantKey").val(res.merchantKey);
            }
        },
        error: function () {
            notificationToastCustom('error', "Something went wrong", "Error");
        } 
    });
}


// ================= SAVE DATA =================
function saveSettings() {

    // Validation
    if (!validateForm()) return;

    let model = {
        id: parseInt($("#settingId").val()) || 0, // 🔹 IMPORTANT
        paymentTiming: $("input[name='paymentTiming']:checked").val(),
        applicationFee: parseFloat($("#applicationFee").val()) || 0,
        retryAttempts: parseInt($("#retryAttempts").val()) || 0,
        refundableFee: $("#refundableFee").is(":checked"),
        testMode: $("#testMode").is(":checked"),
        gatewayProvider: $("#gatewayProvider").val(),
        merchantKey: $("#merchantKey").val()
    };
    

    console.log("Sending Data:", model); // 🔥 Debug

    $.ajax({
        url: '/PaymentConfig/SaveOrUpdatePaymentSetting',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',  // 🔥 MUST
        data: JSON.stringify(model),                     // 🔥 MUST
        success: function (res) {
            
            if (res.success) {
                notificationToastCustom('success', res.message, "Success");
            } else {
                notificationToastCustom('error', res.message, "Error");
            }
        },
        error: function () {
            notificationToastCustom('error', "Something went wrong", "Error");
        } 
    });
}

function validateForm() {

    let isValid = true;
    let firstErrorElement = null;

    // Clear old errors
    $(".text-danger").addClass("d-none").text("");
    $(".form-control").removeClass("is-invalid");

    let paymentTiming = $("input[name='paymentTiming']:checked").val();
    let fee = $("#applicationFee").val();
    let retry = $("#retryAttempts").val();
    let provider = $("#gatewayProvider").val().trim();
    let merchantKey = $("#merchantKey").val().trim();

    // 🔹 Payment Timing
    if (!paymentTiming) {
        $("#paymentTimingError")
            .text("Please select payment timing")
            .removeClass("d-none");

        if (!firstErrorElement)
            firstErrorElement = $("input[name='paymentTiming']").first();

        isValid = false;
    }

    // 🔹 Application Fee
    if (fee === "" || parseFloat(fee) < 0) {
        $("#applicationFeeError")
            .text("Enter valid application fee")
            .removeClass("d-none");

        $("#applicationFee").addClass("is-invalid");

        if (!firstErrorElement)
            firstErrorElement = $("#applicationFee");

        isValid = false;
    }

    // 🔹 Retry Attempts
    if (retry === "" || parseInt(retry) < 0) {
        $("#retryAttemptsError")
            .text("Enter valid retry attempts")
            .removeClass("d-none");

        $("#retryAttempts").addClass("is-invalid");

        if (!firstErrorElement)
            firstErrorElement = $("#retryAttempts");

        isValid = false;
    }

    // 🔹 Gateway Provider
    if (provider === "") {
        $("#gatewayProviderError")
            .text("Enter payment gateway provider")
            .removeClass("d-none");

        $("#gatewayProvider").addClass("is-invalid");

        if (!firstErrorElement)
            firstErrorElement = $("#gatewayProvider");

        isValid = false;
    }

    // 🔹 Merchant Key (only required if provider entered)
    if (merchantKey === "") {
        $("#merchantKeyError")
            .text("Enter merchant key")
            .removeClass("d-none");

        $("#merchantKey").addClass("is-invalid");

        if (!firstErrorElement)
            firstErrorElement = $("#merchantKey");

        isValid = false;
    }

    // 🔥 Focus first error
    if (firstErrorElement) {
        firstErrorElement.focus();
    }

    return isValid;
}
