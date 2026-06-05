let table;
let editorInstance;

$(document).ready(function () {

    initEditor();
    

    loadTable();

    $("#addBtn").click(function () {
        resetForm(); // ✅ already done
        $("#tableSection").addClass("d-none");
        $("#formSection").removeClass("d-none");
    });

    // Cancel
    $("#btnCancel").click(function () {
        $("#formSection").addClass("d-none");
        $("#tableSection").removeClass("d-none");
    });

    // Save
    $("#btnSave").click(function () {
        saveTemplate();
    });

    $("input").on("input", function () {
        $(this).next(".text-danger").addClass("d-none");
    });


});

function loadTable() {
    table = $('#templateTable').DataTable({
        ajax: {
            url: '/NotificationTemplate/GetAll',
            type: 'GET',
            dataSrc: 'data'
        },
        columns: [
            {
                data: null,
                render: (data, type, row, meta) => meta.row + 1
            },
            { data: 'eventCode' },
            { data: 'eventName' },
            { data: 'channel' },
            {
                data: 'subject',
                render: data => data ? data : '-'
            },
            {
                data: 'isActive',
                render: data => data ? 'Active' : 'Inactive'
            },
            {
                data: null,
                render: function (data) {
                    return `
                        <button class="btn btn-sm btn-primary me-1" onclick="editTemplate(${data.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTemplate(${data.id})"> <i class="fas fa-trash"></i></button>
                    `;
                }
            }
        ]
    });
}


function saveTemplate() {

    if (!validateForm()) return; // 🔥 STOP if invalid


    const id = parseInt($("#templateId").val()) || 0;

    const model = {
        Id: id,
        EventCode: $("#eventCode").val(),
        EventName: $("#eventName").val(),
        Channel: $("input[name='channel']:checked").val(),
        Subject: $("#emailSubject").val(),
        Body: editorInstance.getData(),
        IsActive: true
    };

    // 🔥 Decide URL here
    const url = id > 0
        ? '/NotificationTemplate/UpdateTemplate'
        : '/NotificationTemplate/SaveTemplate';
    console.log(model);
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(model),
        success: function (res) {

            if (res.success) {
                notificationToastCustom('success', res.message, 'Success');

                $("#formSection").addClass("d-none");
                $("#tableSection").removeClass("d-none");
                table.ajax.reload();
            } else {
                
                // 🔥 HANDLE SERVER VALIDATION
                handleServerErrors(res.errors);
            }
        }
    });
}





function editTemplate(id) {

    // ✅ CLEAR ERRORS FIRST
    $(".text-danger").addClass("d-none").text('');
    $(".form-control").removeClass("is-invalid");

    $.get('/NotificationTemplate/GetById?id=' + id, function (data) {

        $("#templateId").val(data.id);

        $("#eventCode").val(data.eventCode);
        $("#eventName").val(data.eventName);

        // Channel select
        $(`input[name="channel"][value="${data.channel}"]`).prop("checked", true);
        toggleFields();

        $("#emailSubject").val(data.subject);
        editorInstance.setData(data.body);

        $("#tableSection").addClass("d-none");
        $("#formSection").removeClass("d-none");
    });
}


function deleteTemplate(id) {

    if (!confirm("Are you sure to delete?")) return;

    $.post('/NotificationTemplate/deleteAsync?id=' + id, function (res) {

        if (res.success) {
            alert(res.message);
            table.ajax.reload();
        } else {
            alert(res.message);
        }

    });
}

function resetForm() {

    $("#templateId").val(0);

    $("input[type=text]").val('');
    $("input[name='channel']").prop("checked", false);

    $("#emailSubjectDiv").addClass("d-none");

    editorInstance.setData('');

    // ✅ CLEAR ALL ERRORS
    $(".text-danger").addClass("d-none").text('');

    // ✅ REMOVE RED BORDER (if using)
    $(".form-control").removeClass("is-invalid");
}


 

function initEditor() {

    ClassicEditor
        .create(document.querySelector('#classic-editor'))
        .then(editor => {   
            editorInstance = editor;
            $("#btnUpdateSetting").prop("disabled", false);
        })
        .catch(error => console.error(error));
}

function validateForm() {

    let isValid = true;

    $(".text-danger").addClass("d-none").text('');

    const eventCode = $("#eventCode").val().trim();
    const eventName = $("#eventName").val().trim();
    const channel = $("input[name='channel']:checked").val();
    const subject = $("#emailSubject").val().trim();
    const body = editorInstance.getData().trim();

    if (!eventCode) {
        $("#err_eventCode").text("Event Code is required").removeClass("d-none");
        isValid = false;
    }

    if (!eventName) {
        $("#err_eventName").text("Template Name is required").removeClass("d-none");
        isValid = false;
    }

    if (!channel) {
        $("#err_channel").text("Please select channel").removeClass("d-none");
        isValid = false;
    }

    if (channel === "EMAIL" && !subject) {
        $("#err_subject").text("Email subject is required").removeClass("d-none");
        isValid = false;
    }

    if (!body || body === "<p>&nbsp;</p>") {
        $("#err_body").text("Message body is required").removeClass("d-none");
        isValid = false;
    }

    // 🔥 focus ONLY first error
    if (!isValid) {
        focusFirstError();
    }

    return isValid;
}

function handleServerErrors(errors) {

    if (!errors) return;

    $(".text-danger").addClass("d-none").text('');

    // show ALL errors
    if (errors.code) {
        $("#err_eventCode").text(errors.code).removeClass("d-none");
    }

    if (errors.channel) {
        $("#err_channel").text(errors.channel).removeClass("d-none");
    }

    if (errors.subject) {
        $("#err_subject").text(errors.subject).removeClass("d-none");
    }

    // 🔥 focus first error only
    focusFirstError();
}


function focusFirstError() {

    const firstError = $(".text-danger:not(.d-none)").first();

    if (firstError.length) {

        $('html, body').animate({
            scrollTop: firstError.offset().top - 120
        }, 300);

        const input = firstError.prev("input, select, textarea");

        if (input.length) {
            input.focus();
        }
    }
}
