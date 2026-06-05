//var receiptTable;

$(document).ready(function () {

    showReceiptTable();

    $('#addReceiptBtn').click(function () {
        clearForm();
        showReceiptForm(false);
    });

    receiptTable = $('#receiptTable').DataTable({
        ajax: {
            url: '/ReceiptConfig/GetAll',
            type: 'GET',
            dataSrc: function (json) {
                console.log(json); // 🔥 check structure

                window.canEditReceipt = json.canEdit;
                window.canDeleteReceipt = json.canDelete;

                return json.data;
            }
        },
        columns: [
            
            { data: 'universityName' },
            {
                data: 'universityLogo',
                render: function (data) {
                    return data ? `<img src="${data}" height="40"/>` : '';
                }
            },
            { data: 'headerContent' },
            { data: 'footerContent' },

             
            {
                data: null,
                title: "Actions",
                orderable: false,
                render: (data, type, row, meta) => {


                    let buttons = `
                          <li class="list-inline-item dropdown">
                <a class="text-muted dropdown-toggle px-2"  href="#"
                   role="button"  data-bs-toggle="dropdown" aria-haspopup="true"
                   aria-expanded="false"> <i class="uil uil-ellipsis-h"></i>
                </a>

                <div class="dropdown-menu dropdown-menu-end">

                    
                    `;


                    if (window.canEditReceipt) {
                        buttons += `<button class="btn-sm dropdown-item text-secondary editBtn" data-index="${meta.row}">
                           <i class="fas fa-edit"> </i> Edit
                       </button>`;
                    }

                    if (window.canDeleteReceipt) {
                        buttons += `<button class="btn-sm dropdown-item text-danger deleteBtn" data-index="${meta.row}" title="Delete">
                            <i class="fas fa-trash-alt"> </i> Delete
                        </button>`;
                    }

                   if (!canEditReceipt && !canDeleteReceipt) { 
                        buttons += `
                                <div class="text-center text-muted small py-1">
                                    No actions
                                </div> `;
                    }

                    buttons += ` </div>
                    </li>
                    `;

                    return buttons;
                }
            }
        ]
    });

    $.ajax({
        url: '/GeneralSettings/GetUniversities',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var dropdown = $('#universityId');
            dropdown.empty();

            dropdown.append('<option value="" selected disabled> Select University </option>');

            $.each(data, function (index, item) {
                dropdown.append(
                    $('<option></option>')
                        .val(item.id)
                        .text(item.text)
                );
            });
        }
    });

    $("#logoInput").change(function () {
        $('#err_logo').addClass('d-none');
        let file = this.files[0];

        if (file) {

            let allowedTypes = ['image/jpeg', 'image/png'];
            let maxSize = 500 * 1024; // 500KB

            if (!allowedTypes.includes(file.type)) {
                $('#err_logo').text('Only JPG or PNG allowed').removeClass('d-none');
                return ;
            }

            if (file.size > maxSize) {
                $('#err_logo').text('Max size is 500KB').removeClass('d-none');
                return;
            }


            let reader = new FileReader();

            reader.onload = function (e) {
                $("#logoPreview").html(`<img src="${e.target.result}">`);
            };

            reader.readAsDataURL(file);
        }

    });

    $('#btnSave').click(function () {

        if (!validateForm()) {
            return; // ❌ stop if invalid
        }


        let formData = new FormData();

        // Append object-like data
        formData.append("Id", $('input[name="config_id"]').val() || 0);
   

        // Other fields
        formData.append("UniversityId", $('#universityId').val());
        formData.append("HeaderContent", $('textarea[name="header_content"]').val());
        formData.append("FooterContent", $('textarea[name="footer_content"]').val());

        formData.append("SendSmsPaymentConfirmation",
            $('input[name="send_sms_payment_confirmation"]').is(':checked'));

        formData.append("SendEmailPaymentConfirmation",
            $('input[name="send_email_payment_confirmation"]').is(':checked'));

        formData.append("SendWhatsappPaymentConfirmation",
            $('input[name="send_whatsapp_payment_confirmation"]').is(':checked'));

        // File
        let file = $('#logoInput')[0].files[0];
        if (file) {
            formData.append("UniversityLogoFile", file);
        }

        let ajaxUrl = formData.get("Id") > 0 ? '/ReceiptConfig/UpdateConfigSettingDetails' : '/ReceiptConfig/SaveConfigSettingDetails';

        
        $.ajax({
            url: ajaxUrl,
            type: 'POST',
            data: formData,
            contentType: false,   // 🔥 REQUIRED
            processData: false,   // 🔥 REQUIRED
            success: function (res) {

                if (res.success) {
                    notificationToastCustom('success', res.message, "Success");
                    clearForm();
                    receiptTable.ajax.reload();
                    // 🔥 BACK TO TABLE
                    showReceiptTable();


                } else {
                    if (res.errors) {
                        if (res.errors.setting)
                            $('#err_university').text(res.errors.setting).removeClass('d-none');
                        
                    } else {
                        notificationToastCustom('error', res.message, "Error");
                    }
                }

              
            },
            error: function () {
                alert("Error while saving");
            }
        });

    });

    $('#receiptTable').on('click', '.editBtn', function () {
        const rowData = receiptTable.row($(this).closest('tr')).data();
        let id = rowData.id

        $.ajax({
            url: '/ReceiptConfig/GetById/' + id,
            type: 'GET',
            success: function (data) {

                $('input[name="config_id"]').val(data.id);
                $('#universityId').val(data.universityId);

                $('textarea[name="header_content"]').val(data.headerContent);
                $('textarea[name="footer_content"]').val(data.footerContent);

                $('input[name="send_sms_payment_confirmation"]').prop('checked', data.sendSmsPaymentConfirmation);
                $('input[name="send_email_payment_confirmation"]').prop('checked', data.sendEmailPaymentConfirmation);
                $('input[name="send_whatsapp_payment_confirmation"]').prop('checked', data.sendWhatsappPaymentConfirmation);

                if (data.universityLogo) {
                    $("#logoPreview").html(`<img src="${data.universityLogo}" />`);
                }

                // 🔥 SHOW FORM
                showReceiptForm(true);
            }
        });

    });

    $('#receiptTable').on('click', '.deleteBtn', function () {
        const rowData = receiptTable.row($(this).closest('tr')).data();
        let id = rowData.id


        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteConfigSetting(id);
            }
        });

    });

    $('#universityId').change(function () {
        $('#err_university').addClass('d-none');
    });

    $('textarea').on('input', function () {
        $(this).next('.text-danger').addClass('d-none');
    });

    

    $('#btnReset').click(function () {
        clearForm();
        showReceiptTable();
    });

});

function deleteConfigSetting(id) {
    $.ajax({
        url: `/ReceiptConfig/Delete/${id}`,
        method: 'GET',

        success: function (res) {
            if (res.success) {
                notificationToastCustom('success', res.message, "Success");
                clearForm();
                receiptTable.ajax.reload();
            }
            else {
                notificationToastCustom('error', res.message, "Error");
            }

        },
        error: function (err) {
            console.error(err);
            notificationToastCustom('error', "Somethine went wrong!", "Error");
        }
    });
}

function validateForm() {

    let isValid = true;

    // Clear all errors
    $('.text-danger').addClass('d-none').text('');

    // University
    if (!$('#universityId').val()) {
        $('#err_university').text('Please select university').removeClass('d-none');
        isValid = false;
    }

    // Header
    let header = $('textarea[name="header_content"]').val().trim();
    if (header === '') {
        $('#err_header').text('Header is required').removeClass('d-none');
        isValid = false;
    }

    // Footer
    let footer = $('textarea[name="footer_content"]').val().trim();
    if (footer === '') {
        $('#err_footer').text('Footer is required').removeClass('d-none');
        isValid = false;
    }

    // Logo (only for new record)
    let id = $('input[name="config_id"]').val();

    let file = $('#logoInput')[0].files[0];

    if (id == 0 && !file) {
        $('#err_logo').text('Logo is required').removeClass('d-none');
        isValid = false;
    }

    // File validation (if selected)
    if (file) {
        let allowedTypes = ['image/jpeg', 'image/png'];
        let maxSize = 500 * 1024; // 500KB

        if (!allowedTypes.includes(file.type)) {
            $('#err_logo').text('Only JPG or PNG allowed').removeClass('d-none');
            isValid = false;
        }

        if (file.size > maxSize) {
            $('#err_logo').text('Max size is 500KB').removeClass('d-none');
            isValid = false;
        }
    }

    return isValid;
}

function clearForm() {
    $('.text-danger').addClass('d-none').text('');
    $('input[name="config_id"]').val(0);
    $('#universityId').val('');

    $('textarea[name="header_content"]').val('');
    $('textarea[name="footer_content"]').val('');

    $('input[type="checkbox"]').prop('checked', false);

    $('#logoInput').val('');
    $('#logoPreview').html('<i class="bx bx-cloud-upload" style="font-size:40px;"></i>');
}

function showReceiptTable() {
    $('#receiptTableSection').removeClass('d-none');
    $('#receiptFormSection').addClass('d-none');

    setTimeout(() => {
        receiptTable.columns.adjust().draw();
    }, 100);
}

function showReceiptForm(edit = false) {
    $('.text-danger').addClass('d-none').text('');
    $('#receiptTableSection').addClass('d-none');
    $('#receiptFormSection').removeClass('d-none');

    $('#receiptFormTitle').text(edit ? 'Edit Receipt Config' : 'Add Receipt Config');
}