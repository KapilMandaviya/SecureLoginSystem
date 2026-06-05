$(document).ready(function () {
    loadUniversities();

    $("#logoInput").change(function () {
        $('#err_logo').addClass('d-none');
        let file = this.files[0];

        if (file) {

            let allowedTypes = ['image/jpeg', 'image/png'];
            let maxSize = 500 * 1024; // 500KB

            if (!allowedTypes.includes(file.type)) {
                $('#err_logo').text('Only JPG or PNG allowed').removeClass('d-none');
                return;
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

    function validateUniversityForm() {

        let isValid = true;

        // clear previous errors
        $('.field-error').text('').addClass('d-none');

        const uniName = $('#uni_name').val().trim();
        const state = $('#state').val().trim();
        const code = $('#code').val().trim();
        const email = $('#email').val().trim();
        const mobile = $('#mobile').val().trim();

        if (!uniName) {
            $('#lbluniNameError').text('University name is required').removeClass('d-none');
            isValid = false;
        }

        if (!state) {
            $('#lblstateError').text('State is required').removeClass('d-none');
            isValid = false;
        }

        if (!code) {
            $('#lblcodeError').text('Code is required').removeClass('d-none');
            isValid = false;
        }

        if (!email) {
            $('#lblemailError').text('Email is required').removeClass('d-none');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            $('#lblemailError').text('Invalid email format').removeClass('d-none');
            isValid = false;
        }

        if (!mobile) {
            $('#lblmobileError').text('Mobile number is required').removeClass('d-none');
            isValid = false;
        } else if (!/^[0-9]{10}$/.test(mobile)) {
            $('#lblmobileError').text('Mobile must be 10 digits').removeClass('d-none');
            isValid = false;
        }

        let file = $('#logoInput')[0].files[0];

        // Logo (only for new record)
        let id = $('#editIndex').val();


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


    // Load all universities
    function loadUniversities() {
        $.ajax({
            url: '/UniversityMaster/GetAll',
            method: 'GET',
            success: function (res) {
                const universities = res.data; // ✅ use the array



                // Store permissions globally (optional)

                window.canEditUniversity = res.canEdit;
                window.canDeleteUniversity = res.canDelete;

                table.clear().rows.add(universities).draw();
            },
            error: function (err) {
                notificationToastCustom('error', "Somethine went wrong!", "Error");
            }
        });
    }

    // Save or update
    function saveUniversity(data, isEdit = false) {
        let url = (!data.id || data.id === 0) ? '/UniversityMaster/SaveUniversityDetails' : '/UniversityMaster/updateUniversityDetails';
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            contentType: false,   // 🔥 REQUIRED
            processData: false,   // 🔥 REQUIRED
            success: function (res) {
                if (res.success) {
                    notificationToastCustom('success', res.message, "Success");
                    loadUniversities();

                    showTable();
                    $('#uni_name, #state, #code, #email, #mobile').val('');
                    $('#activeToggle').prop('checked', true);

                } else {
                    if (res.errors) {
                        if (res.errors.code)
                            $('#lblcodeError').text(res.errors.code).removeClass('d-none');
                        if (res.errors.uniName)
                            $('#lbluniNameError').text(res.errors.uniName).removeClass('d-none');
                        if (res.errors.email)
                            $('#lblemailError').text(res.errors.email).removeClass('d-none');
                        if (res.errors.mobile)
                            $('#lblmobileError').text(res.errors.mobile).removeClass('d-none');
                    } else {
                        notificationToastCustom('error', res.message, "Error");
                    }
                }



            },
            error: function (xhr) {
                if (xhr.status === 403) {
                    notificationToastCustom(
                        'error',
                        'You do not have permission to perform this action.',
                        'Access Denied'
                    );
                }
                else if (xhr.status === 401) {
                    notificationToastCustom(
                        'warning',
                        'Your session has expired. Please login again.',
                        'Unauthorized'
                    );
                }
                else {
                    notificationToastCustom(
                        'error',
                        'Something went wrong. Please try again later.',
                        'Error'
                    );
                }
            }

        });

    }

    // Delete
    function deleteUniversity(id) {
        $.ajax({
            url: `/UniversityMaster/Delete/${id}`,
            method: 'GET',

            success: function (res) {
                if (res.success) {
                    notificationToastCustom('success', res.message, "Success");
                    loadUniversities();
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



    const tableSection = $('#tableSection');

    const form = $('#universityForm');

    // ================= DATATABLE INIT =================
    const table = $('#universityDatatable').DataTable({
        data: [],
        autoWidth: false,
        responsive: true,
        pageLength: 10,
        destroy: true,
        columnDefs: [
            { orderable: false, targets: 7 }
        ],
        columns: [
            {
                data: null,
                render: (data, type, row, meta) => meta.row + 1,
                title: "Sr No"
            },
            { data: 'uniName', title: "University Name" },
            {
                data: 'logoFile',
                render: function (data) {
                    return data ? `<img src="${data}" height="40"/>` : '';
                }
            },
            { data: 'code', title: "Code" },
            { data: 'stateName', title: "State" },
            { data: 'email', title: "Email" },
            { data: 'mobile', title: "Mobile" },
            {
                data: 'status',
                title: "Status",
                render: d =>
                    `<span class="badge ${d ? 'bg-success' : 'bg-danger'}">
                        ${d ? 'Active' : 'Inactive'}
                     </span>`
            },
            {
                data: null,
                title: "Actions",
                orderable: false,
                render: (data, type, row, meta) => {
                    

                    let  buttons = `
                          <li class="list-inline-item dropdown">
                <a class="text-muted dropdown-toggle px-2"  href="#"
                   role="button"  data-bs-toggle="dropdown" aria-haspopup="true"
                   aria-expanded="false"> <i class="uil uil-ellipsis-h"></i>
                </a>

                <div class="dropdown-menu dropdown-menu-end">

                     <button class="btn-sm viewBtn dropdown-item text-primary" data-index="${meta.row}" title="View">
                           <i class="fas fa-eye"> </i> View
                       </button>
                    `;
                    

                    if (window.canEditUniversity) {
                        buttons += `<button class="btn-sm dropdown-item text-secondary editBtn" data-index="${meta.row}">
                           <i class="fas fa-edit"> </i> Edit
                       </button>`;
                    }

                    if (window.canDeleteUniversity) {
                        buttons += `<button class="btn-sm dropdown-item text-danger deleteBtn" data-index="${meta.row}" title="Delete">
                            <i class="fas fa-trash-alt"> </i> Delete
                        </button>`;
                    }

                    if (!canEditUniversity && !canDeleteUniversity) {
                        buttons += `
            <div class="text-center text-muted small py-1">
                No actions
            </div>
        `;
                    }

                    buttons += ` </div>
            </li>
`;

                    return buttons;
                }
            }
        ]
    });

    // ================= SHOW / HIDE =================
    function showTable() {
        tableSection.removeClass('d-none');
        $('#formSection').addClass('d-none'); // Hide the form
        setTimeout(() => {
            table.columns.adjust().responsive.recalc();
        }, 100);
    }


    function showForm(edit = false) {
        tableSection.addClass('d-none');
        $('#formSection').removeClass('d-none'); // Add this line
        $('#formTitle').text(edit ? 'Edit University' : 'Create University');
    }


    // ================= ADD =================
    $('#addBtn').on('click', function () {

        $('#editIndex').val('');
        $('#logoInput').val('');
        $('#logoPreview').html('<i class="bx bx-cloud-upload" style="font-size:40px;"></i>');
        showForm(false);
    });

    // ================= EDIT =================
    $('#universityDatatable').on('click', '.editBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();

        $.ajax({
            url: `/UniversityMaster/GetById/${rowData.id}`,
            method: 'GET',
            success: function (data) {
                $('#editIndex').val(data.id);
                $('#uni_name').val(data.uniName);
                $('#state').val(data.stateName);
                $('#code').val(data.code);
                $('#email').val(data.email);
                $('#mobile').val(data.mobile);
                $('#activeToggle').prop('checked', data.isActive);

                if (data.logoFile) {
                    $("#logoPreview").html(`<img src="${data.logoFile}" />`);
                }
                showForm(true);
            }
        });
        
    });


    // ================= VIEW =================
    $('#universityDatatable').on('click', '.viewBtn', function () {

        // Get row data from DataTable
        const u = table.row($(this).closest('tr')).data();

        // Bind data to modal
        $('#v_name').text(u.uniName);
        $('#v_logo').html(`<img src="${u.logoFile}" height="40"/>`);
        $('#v_code').text(u.code);
        $('#v_state').text(u.stateName);
        $('#v_email').text(u.email);
        $('#v_mobile').text(u.mobile);
        $('#v_status').text(u.isActive ? 'Active' : 'Inactive');

        // Show modal
        const modal = new bootstrap.Modal(
            document.getElementById('viewUniversityModal')
        );
        modal.show();
    });

    // ================= DELETE =================
    // On Delete button
    $('#universityDatatable').on('click', '.deleteBtn', function () {
        const rowData = table.row($(this).closest('tr')).data();

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
                deleteUniversity(rowData.id);
            }
        });
    });


    // ================= CANCEL =================
    $('#btnCancel').on('click', function () {
        $('.field-error').text('').addClass('d-none');
        $('#logoInput').val('');
        $('#logoPreview').html('<i class="bx bx-cloud-upload" style="font-size:40px;"></i>');
        showTable();
    });

    // ================= SUBMIT =================
    $('#btnSave').on('click', function () {
        if (!validateUniversityForm()) {
            return; // stop submit if validation fails
        }



        const id = $('#editIndex').val();

        const formData = new FormData();

        formData.append("id", id ? parseInt(id) : 0);
        formData.append("uniName", $('#uni_name').val().trim());
        formData.append("stateName", $('#state').val().trim());
        formData.append("code",   $('#code').val().trim());
        formData.append("email", $('#email').val().trim());
        formData.append("mobile", $('#mobile').val().trim());
        formData.append("status", $('#activeToggle').is(':checked') ? 'Active' : 'Inactive');
        formData.append("isActive", $('#activeToggle').is(':checked'));
         

        let file = $('#logoInput')[0].files[0];
        if (file) {
            formData.append("Logo", file);
        }

        saveUniversity(formData, id !== '');
    });



    $('#addBtn').on('click', function () {
        $('#editIndex').val('');
        $('#uni_name, #state, #code, #email, #mobile').val('');
        $('#activeToggle').prop('checked', true); // default to active
        showForm(false);
    });


    // ================= MOBILE VALIDATION =================
    $('#mobile').on('input', function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });

    // ================= INIT =================
    showTable();

});

