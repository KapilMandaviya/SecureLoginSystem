let collegeTable;

$(document).ready(function () {
       
    
    // TEMP: Move to Step 2 without saving
    $('#btnNextStep').click(function () {

        nextToSeatMatrix();

    });

    $(document).on('input change', 'input, select, textarea', function () {
        let fieldId = $(this).attr('id');
        $('#lbl' + fieldId + 'Error').addClass('d-none');
    });

    // Prevent duplicate Program + Quota combination
    $(document).on('change', '.program-select, .quota-select', function () {

        let $row = $(this).closest('tr');
        let program = $row.find('.program-select').val();
        let quota = $row.find('.quota-select').val();


 
        if (!program || !quota || program === "0" || quota === "0") {
            return;
        }

        

        let duplicateFound = false;

        $('#seatGrid tbody tr').not($row).each(function () {

            let p = $(this).find('.program-select').val();
            let q = $(this).find('.quota-select').val();

            if (p === program && q === quota) {
                duplicateFound = true;
                return false; // break loop
            }
        });

        if (duplicateFound) {
            Swal.fire('Duplicate Entry',
                'This Program + Quota combination already exists.',
                'warning');

            // Reset dropdown that triggered
            $(this).val("0");
        }
    });

    // Auto row add when last row is filled
    $(document).on('input change',
        '#seatGrid tbody tr:last .category-seat, #seatGrid tbody tr:last .program-select, #seatGrid tbody tr:last .quota-select',
        function () {

            let $lastRow = $('#seatGrid tbody tr:last');

            let program = $lastRow.find('.program-select').val();
            let quota = $lastRow.find('.quota-select').val();

            if (program === "0" || quota === "0") return;

            // Check duplicate before adding row
            let duplicate = false;

            $('#seatGrid tbody tr').not($lastRow).each(function () {
                let p = $(this).find('.program-select').val();
                let q = $(this).find('.quota-select').val();

                if (p === program && q === quota) {
                    duplicate = true;
                    return false;
                }
            });

            if (duplicate) return;

            let hasSeat = false;
            $lastRow.find('.category-seat').each(function () {
                if ($(this).val() && parseInt($(this).val()) > 0) {
                    hasSeat = true;
                }
            });

            if (hasSeat) {
                addNewRow();
            }
        });

    // Row total auto calculate
    $(document).on('input', '.category-seat', function () {

        let $row = $(this).closest('tr');
        let rowTotal = 0;

        $row.find('.category-seat').each(function () {
            let val = parseInt($(this).val());
            if (!isNaN(val)) {
                rowTotal += val;
            }
        });

        $row.find('.row-total-seat').text(rowTotal);
        updateHeaderTotalSeat();
    });


    $('#btnBack').click(function () {

        $('#step2').addClass('d-none');
        $('#step1').removeClass('d-none');

        $('#step2-indicator')
            .removeClass('active');

        $('#step1-indicator')
            .removeClass('completed')
            .addClass('active');
    });
    // call on page load
    loadCollegeTable();

    // Allow only numbers in mobile
    $('#mobileNo').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    // Allow only numbers in mobile
    $('#pincode').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    /* ================= DATATABLE ================= */

    collegeTable = $('#collegeDatatable').DataTable({
        data: [],
        columns: [
            { data: null }, // Serial number
            { data: 'collegeName' },
            { data: 'universityName' },
            { data: 'programName' },
            { data: 'academicYear' },
            { data: 'quotaName' }, // show city name instead of Id
            { data: 'totalSeat' },
            { data: 'city' },

            {
                data: null,
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

                    if (can('Admission_CollegeMaster_UPDATE')) {


                        buttons += `<button class="btn-sm dropdown-item text-secondary btneditCollege" data-index="${meta.row}">
                           <i class="fas fa-edit"> </i> Edit College
                       </button>`;
                    }


                    if (can('Admission_CollegeMaster_UPDATE')) {


                        buttons += `<button class="btn-sm dropdown-item text-secondary btneditMatrix" data-index="${meta.row}">
                           <i class="fas fa-edit"> </i> Edit Seat Matrix
                       </button>`;
                    }

                    if (can('Admission_CollegeMaster_DELETE')) {

                        buttons += `<button class="btn-sm dropdown-item text-danger deleteBtn" data-index="${meta.row}" title="Delete">
                            <i class="fas fa-trash-alt"> </i> Delete
                        </button>`;

                    }

                    buttons += ` </div>
            </li>
`;

                    return buttons;
                }
            }
        ],

        columnDefs: [
            { targets: 0, width: "5%", render: (data, type, row, meta) => meta.row + 1 },      // Sr No
            { targets: 1, width: "25%" },  // College Name //className: "text-center"
            { targets: 2, width: "16%" },  // University Name
            { targets: 3, width: "17%" },  // Program Name
            { targets: 4, width: "8%" },  // Academic Year
            { targets: 5, width: "15%" },  // Quota Name
            { targets: 6, width: "7%", }, // Total Seat
            { targets: 7, width: "5%" },  // City
            { targets: 8, width: "15%", orderable: false } // Actions
        ],
    });

    // Custom multi-filter
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        
        var college = $('#filterCollege').val();
        var program = $('#filterProgram').val();
        var quota = $('#filterQuota').val();
        var academicText = $('#filterAcademicYear option:selected').text();

        var rowData = collegeTable.row(dataIndex).data();

        // Apply filters only if selected
        if (college != ''  && rowData.collegeId != college)
            return false;

        if (program != '' && rowData.programId != program)
            return false;

        if (quota != '' && rowData.quotaId != quota)
            return false;

        if (academicText != 'All Academic Year' && rowData.academicYear != academicText)
            return false;

        return true;
    });


    // Redraw table on any dropdown change
    $('#filterCollege, #filterProgram, #filterQuota, #filterAcademicYear')
        .on('change', function () {
            collegeTable.draw();
        });

 

    $('#addBtn').click(function () {

        clearForm();
        $('#tableSection').addClass('d-none');
        $('#collegeSeatMatrixFlow').removeClass('d-none');
        
        $('#formTitle').text('Create College');

        // Show step indicator
        
        $('.step-indicator').removeClass('d-none');

        // Show Next button
        $('#btnNextStep').removeClass('d-none');
        $('#btnUpdateCollege').addClass('d-none');
        $('#btnCancelText').addClass('d-none');
        $('#btnBack').removeClass('d-none');
        $('#step1').removeClass('d-none');
        $('#step2').addClass('d-none');

        $('#saveButtonText').text('Create College + Matrix');

        $('#collegeInfoHeader').addClass('d-none');

        $('#gridBody').empty();
    });

 

    $('#btnCancel').click(function () {

        goToTablHideShow();

    });
    $('#btnCancelText').click(function () {
        goToTablHideShow();
       

    });

    /* ================= SAVE ================= */

    $('#btnSave').click(function () {


        if (!validateSeatMatrix()) {
            return;
        }

        let collegeObj = getFormData();
        let url = collegeObj.CollegeId === 0
            ? '/CollegeMaster/SaveCollegeDetails'
            : '/CollegeMaster/UpdateCollegeDetails';
        
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(collegeObj),
            success: function (res) {

                if (res.success) {
                    notificationToastCustom('success', res.message, "Success");

                    clearForm();

                    $('#formTitle').text('Create College');

                    // Reset Step Indicators
                    $('#step1-indicator')
                        .removeClass('completed')
                        .addClass('active');

                    $('#step2-indicator')
                        .removeClass('active completed');

                    goToTablHideShow();

                    loadCollegeTable();

                } else {
                    if (res.errors) {
                        if (res.errors.name)
                            $('#lblcollegeNameError').text(res.errors.name).removeClass('d-none');
                        if (res.errors.collegeCode)
                            $('#lblcollegeCodeError').text(res.errors.collegeCode).removeClass('d-none');

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
    });

    $('#btnUpdateCollege').click(function () {

        if (!validateRequired() || !validateEmail() || !validateMobile() || !validatePincode()) return;

        let collegeObj = getFormData();

        // 🔥 Remove matrix data
        collegeObj.seatMatrixDtos =null;
        collegeObj.CollegeSeatTotal =null;

        $.ajax({
            url: '/CollegeMaster/UpdateCollegeDetails',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(collegeObj),
            success: function (res) {

                if (res.success) {

                    notificationToastCustom('success', res.message, "Success");

                    goToTablHideShow();

                    loadCollegeTable();
                }
                else {
                    notificationToastCustom('error', res.message, "Error");
                }
            }
        });
    });



    $('#collegeDatatable tbody').on('click', '.btneditCollege', function () {

        let data = collegeTable.row($(this).parents('tr')).data();
        console.log(data);
        $.ajax({
            url: '/CollegeMaster/GetById',
            type: 'GET',
            data: { id: data.collegeId },
            success: function (res) {
                $('#collegeSeatMatrixFlow').removeClass('d-none');
                fillForm(res);

                $('#collegeId').val(res.collegeId);

                $('#formTitle').text('Update College');

                // ❌ Hide step indicator
                $('.step-indicator').addClass('d-none');

                // ❌ Hide Step 2 completely
                $('#step2').addClass('d-none');

                $('#collegeInfoHeader').addClass('d-none');

                // ✅ Show Step 1
                $('#step1').removeClass('d-none');

                // ❌ Hide Next button
                $('#btnNextStep').addClass('d-none');

                // ✅ Show Update button
                $('#btnUpdateCollege').removeClass('d-none');

                $('#tableSection').addClass('d-none');
                
            }
        });
    });

    $('#collegeDatatable tbody').on('click', '.btneditMatrix', function () {

        let data = collegeTable.row($(this).parents('tr')).data();
        console.log(data);
        $.ajax({
            url: '/CollegeMaster/GetById',
            type: 'GET',
            data: { id: data.collegeId },
            success: function (res) {

                fillForm(res);

                $('#tableSection').addClass('d-none');

                $('#collegeId').val(res.collegeId);
                $('#formTitle').text('Edit Seat Matrix');

                // ❌ HIDE STEP INDICATOR
                $('.step-indicator').addClass('d-none');

                // Show only Step 2
                $('#step1').addClass('d-none');
                $('#step2').removeClass('d-none');

                // Show header
                $('#configCollegeName').text(res.name);
                $('#configCollegeCode').text(res.collegeCode);
                $('#configCollegeStatus').text('Active');

                $('#collegeInfoHeader').removeClass('d-none');

                $('#btnBack').addClass('d-none');
                $('#btnCancelText').removeClass('d-none');

                $('#saveButtonText').text('Update Seat Matrix');


                
                $('#collegeSeatMatrixFlow').removeClass('d-none');

                if (!res.seatMatrixDtos || res.seatMatrixDtos.length !== 0)
                    populateCategorySeats(res);
                else
                    addNewRow(); // blank row

            }
        });
    });

    $('#collegeDatatable tbody').on('click', '.deleteBtn', function () {
        let data = collegeTable.row($(this).parents('tr')).data();

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
                $.ajax({
                    url: '/CollegeMaster/Delete',
                    type: 'GET',
                    data: { id: data.collegeId },
                    success: function (res) {
                        if (res.success) {
                            notificationToastCustom('success', res.message, "Success");
                            loadCollegeTable();
                        }
                        else {
                            notificationToastCustom('error', res.message, "Error");
                        }

                    },
                    error: function (err) {

                        notificationToastCustom('error', "Somethine went wrong!", "Error");
                    }
                });

            }
        });
    });

     
    function getFormData() {
         

        let seatMatrixArray = [];
        let CollegeSeatTotal = [];

         

        $('#seatGrid tbody tr').not(':last').each(function () {

            let programId = parseInt($(this).find('.program-select').val());
            let quotaId = parseInt($(this).find('.quota-select').val());
            let rowTotal = parseInt($(this).find('.row-total-seat').text()) || 0;

            if (programId === 0 || quotaId === 0 || rowTotal === 0)
                return;

            let collegeSeatTotalId =
                parseInt($(this).data('collegeseattotalid')) || 0;

            let academicYear =
                parseInt($(this).data('academicyear')) || 0;

            // ✅ PUSH CollegeSeatTotal
            CollegeSeatTotal.push({
                Id: collegeSeatTotalId,
                CollegeId: parseInt($('#collegeId').val()) || 0,
                ProgramId: programId,
                QuotaId: quotaId,
                AcademicYear: academicYear,
                TotalSeat: rowTotal,
                IsActive: true,
                CreatedBy: 1
            });

            // ✅ Seat Matrix
            $(this).find('.category-seat').each(function () {

                let seatValue = $(this).val() || 0;
                let categoryId = parseInt($(this).data('categoryid'));
                let seatId = parseInt($(this).data('seatmatrixid')) || 0;
                let catCode = $(this).data('catcode');

                if (seatValue !== "" && parseInt(seatValue) > 0) {

                    seatMatrixArray.push({
                        Id: seatId,
                        AcademicYear: academicYear,
                        CollegeId: parseInt($('#collegeId').val()) || 0,
                        ProgramId: programId,
                        QuotaId: quotaId,
                        CategoryId: categoryId,
                        CatCode: catCode,
                        Seat: parseInt(seatValue),
                        IsActive: true
                    });
                }
            });
        });


        return {
            CollegeId: parseInt($('#collegeId').val()) || 0,
            UniversityId: parseInt($('#universityId').val()) || 0,
            CollegeCode: $('#collegeCode').val(),
            Name: $('#collegeName').val(),
            CollegeAliasName: $('#collegeAliasName').val(),
            Address: $('#address').val(),
            CityId: parseInt($('#citySelect').val()),
            Pincode: $('#pincode').val(),
            StdCode: $('#stdCode').val(),
            LandlineNo1: $('#landlineNo1').val(),
            LandlineNo2: $('#landlineNo2').val(),
            MobileNo: $('#mobileNo').val(),
            FaxNo: $('#faxNo').val(),
            Email: $('#email').val(),
            WebUrl: $('#webUrl').val(),
            AcademicYear: currentAcYearID,
            IsActive: true,
            CreatedBy: 1, // replace dynamically

            // 🔥 Seat Matrix List
            seatMatrixDtos: seatMatrixArray,

            // 🔥 Total Seat Object
            CollegeSeatTotal: CollegeSeatTotal,
        };
    }

    function fillForm(data) {
        
        $('#collegeId').val(data.collegeId);
        $('#universityId').val(data.universityId);
        $('#collegeName').val(data.name);
        $('#collegeCode').val(data.collegeCode);
        $('#collegeAliasName').val(data.collegeAliasName);
        $('#email').val(data.email);
        $('#address').val(data.address);
        $('#citySelect').val(data.cityId);
        $('#pincode').val(data.pincode);
        $('#stdCode').val(data.stdCode);
        $('#landlineNo1').val(data.landlineNo1);
        $('#landlineNo2').val(data.landlineNo2);
        $('#mobileNo').val(data.mobileNo);
        $('#faxNo').val(data.faxNo);
        $('#webUrl').val(data.webUrl);
        //   $('#currentAcYear').val(data.CurrentAcYear);
    }


    function clearForm() {
        $('#collegeFormSection input, #collegeFormSection textarea').val('');
        $('#citySelect').val('0');
        $('#universityId').val('0');
        $('.field-error').addClass('d-none');
        $('#collegeId').val('');
    }

});

function goToTablHideShow() {
    $('#collegeSeatMatrixFlow').addClass('d-none');


    $('#tableSection').removeClass('d-none');
}

/* ================= VALIDATIONS ================= */

function validateRequired() {
    let isValid = true;
    
    // College Name
    if ($('#universityId').val() === null) {
        $('#lbluniversityIdError').text('University is required').removeClass('d-none');
        isValid = false;
    } else {
        $('#lbluniversityIdError').addClass('d-none');
    }

    // College Name
    if ($('#collegeName').val().trim() === '') {
        $('#lblcollegeNameError').text('College name is required').removeClass('d-none');
        isValid = false;
    } else {
        $('#lblcollegeNameError').addClass('d-none');
    }

    // Code 
    if ($('#collegeCode').val().trim() === '') {
        $('#lblcollegeCodeError').text('College code is required').removeClass('d-none');
        isValid = false;
    } else {
        $('#lblcollegeCodeError').addClass('d-none');
    }


    // Code 
    if ($('#pincode').val().trim() === '') {
        $('#lblpincodeError').text('Pincode is required').removeClass('d-none');
        isValid = false;
    } else {
        $('#lblpincodeError').addClass('d-none');
    }


    // City
    if ($('#citySelect').val() === null) {
        $('#lblcityError').text('City is required').removeClass('d-none');
        isValid = false;
    } else {
        $('#lblcityError').addClass('d-none');
    }

    // Address
    if ($('#address').val().trim() === '') {
        $('#lbladdressError').text('Address is required').removeClass('d-none');
        isValid = false;
    } else {
        $('#lbladdressError').addClass('d-none');
    }

    // Email required
    if ($('#email').val().trim() === '') {
        $('#lblemailError').text('Email is required').removeClass('d-none');
        isValid = false;
    }

    return isValid;
}

function validateEmail() {
    let email = $('#email').val().trim();
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === '') return false;

    if (!regex.test(email)) {
        $('#lblemailError').text('Enter valid email address').removeClass('d-none');
        return false;
    }

    $('#lblemailError').addClass('d-none');
    return true;
}

function validateMobile() {
    let mobile = $('#mobileNo').val().trim();

    if (mobile === '') {
        mobile = null;
    }

    if (mobile !== null && !/^[0-9]{10}$/.test(mobile)) {
        $('#lblmobileError').text('Mobile number must be 10 digits').removeClass('d-none');
        return false;
    }

    $('#lblmobileError').addClass('d-none');
    return true;
}

function validatePincode() {
    let pincode = $('#pincode').val().trim();

    if (pincode !== '' && !/^[0-9]{6}$/.test(pincode)) {
        $('#lblpincodeError').text('Pincode must be 6 digits').removeClass('d-none');
        return false;
    }

    $('#lblpincodeError').addClass('d-none');
    return true;
}


function loadCollegeTable() {
    $.ajax({
        url: '/CollegeMaster/GetAll',
        type: 'GET',
        success: function (res) {

            collegeTable.clear().rows.add(res.data).draw();
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

function can(permission) {
    return userPermissions.includes(permission) ||
        userPermissions.includes(permission.split('_')[0] + "_Full"); // handle full permission
}


function nextToSeatMatrix() {

    if ($('#seatGrid tbody tr').length === 0) {
        addNewRow();
    }
    const collegeName = $('#collegeName').val().trim();
    const collegeCode = $('#collegeCode').val().trim();
    const isActive = $('#collegeStatus').is(':checked'); // if you have checkbox

    if (!validateRequired() || !validateEmail() || !validateMobile() || !validatePincode()) return;

    // ✅ Set Header Values
    $('#configCollegeName').text(collegeName);
    $('#configCollegeCode').text(collegeCode);
    $('#configCollegeStatus').text('Active');

    $('#collegeInfoHeader').removeClass('d-none');

    // Move to Step 2
    $('#step1').addClass('d-none');
    $('#step2').removeClass('d-none');

    $('#step1-indicator').removeClass('active').addClass('completed');
    $('#step2-indicator').addClass('active');
}

function validateSeatMatrix() {

    let $rows = $('#seatGrid tbody tr');

    if ($rows.length === 0) {
        Swal.fire('Validation', 'Please add at least one row.', 'warning');
        return false;
    }

    let combinations = new Set();
    let isValid = true;

    // 🔥 IMPORTANT: Ignore LAST ROW
    $rows.not(':last').each(function () {
        let program = $(this).find('.program-select').val();
        let quota = $(this).find('.quota-select').val();
        let rowTotal = parseInt($(this).find('.row-total-seat').text()) || 0;

        if (program == "0") {
            Swal.fire('Validation', 'Program is required in all rows', 'warning');
            isValid = false;
            return false;
        }

        if (quota == "0") {
            Swal.fire('Validation', 'Quota is required in all rows', 'warning');
            isValid = false;
            return false;
        }

        if (rowTotal <= 0) {
            Swal.fire('Validation', 'Enter at least one category seat', 'warning');
            isValid = false;
            return false;
        }

        let key = program + "_" + quota;

        if (combinations.has(key)) {
            Swal.fire('Duplicate Entry',
                'Duplicate Program + Quota combination found.',
                'warning');
            isValid = false;
            return false;
        }

        combinations.add(key);
    });

    return isValid;
}

 
function populateCategorySeats(res) {

    $('#gridBody').empty();

    if (!res.seatMatrixDtos || res.seatMatrixDtos.length === 0)
        return;

    let grouped = {};

    res.seatMatrixDtos.forEach(function (item) {

        // ✅ GROUP BY 3 KEYS
        let key = item.programId + "_" + item.quotaId + "_" + item.academicYear;



        if (!grouped[key]) {

            // 🔥 Find total from collegeSeatTotal array
            let totalObj = res.collegeSeatTotal.find(x =>
                x.programId == item.programId &&
                x.quotaId == item.quotaId &&
                x.academicYear == item.academicYear
            );


            grouped[key] = {
                programId: item.programId,
                quotaId: item.quotaId,
                academicYear: item.academicYear,
                collegeSeatTotalId: totalObj.id,
                totalSeat: totalObj ? totalObj.totalSeat : 0,
                categories: []
            };
        }

        grouped[key].categories.push(item);
    });

    Object.values(grouped).forEach(function (group) {
        addNewRow(group);

    });

    addNewRow(); // blank row
    updateHeaderTotalSeat();
}
function updateHeaderTotalSeat() {

    let grandTotal = 0;

    $('#seatGrid tbody tr').each(function () {
        let rowTotal = parseInt($(this).find('.row-total-seat').text()) || 0;
        grandTotal += rowTotal;
    });

    $('#totalSeat').text(grandTotal);
}

function removeRow(btn) {

    let totalRows = $('#seatGrid tbody tr').length;

    // Prevent deleting last row
    if (totalRows === 1) {
        // Just clear values instead
        $(btn).closest('tr').find('input').val('');
        $(btn).closest('tr').find('select').val('0');
        $(btn).closest('tr').find('.row-total-seat').text('0');
        updateHeaderTotalSeat();
        return;
    }

    $(btn).closest('tr').remove();
    updateHeaderTotalSeat();
}


function addNewRow(data = null) {

    let row = $('<tr></tr>');

    if (data && data.collegeSeatTotalId) {
        row.attr('data-collegeseattotalid',
            data?.collegeSeatTotalId  );
    } else {
        row.attr('data-collegeseattotalid', 0);
    }

    if (data && data.academicYear) {
        row.attr('data-academicyear',
            data?.academicYear);
    } else {
        row.attr('data-academicyear', currentAcYearID);
    } 

    // Remove Button
    row.append(`
        <td>
            <button type="button"
                class="btn btn-danger btn-sm"
                onclick="removeRow(this)">X</button>
        </td>
    `);

    // Program
    let programSelect = $('<select class="form-select program-select"><option value="0" selected disabled>-- Select --</option></select>');
    programList.forEach(p => {
        programSelect.append(`<option value="${p.value}">${p.text}</option>`);
    });
    if (data) programSelect.val(data.programId);
    row.append($('<td></td>').append(programSelect));

    // Quota
    let quotaSelect = $('<select class="form-select quota-select"><option value="0" selected disabled>-- Select --</option></select>');
    quotaList.forEach(q => {
        quotaSelect.append(`<option value="${q.value}">${q.text}</option>`);
    });
    if (data) quotaSelect.val(data.quotaId);
    row.append($('<td></td>').append(quotaSelect));

     

    categoryList.forEach(c => {

        let seatValue = "";
        let seatMatrixId = 0;

        if (data && data.categories) {
            let seatObj = data.categories.find(x => x.categoryId == c.id);
            if (seatObj) {
                seatValue = seatObj.seat;
                seatMatrixId = seatObj.id;  // ✅ IMPORTANT
            }
        }

        row.append(`
        <td>
            <input type="number"
                class="form-control category-seat"
                data-categoryid="${c.id}"
                data-catCode="${c.code}"   

                data-seatmatrixid="${seatMatrixId}"
                value="${seatValue}" />
        </td>
    `);
    });

    // Total
    //row.append(`<td class="row-total-seat">0</td>`);
    let totalSeatValue = data && data.totalSeat ? data.totalSeat : 0;

    row.append(`<td class="row-total-seat">${totalSeatValue}</td>`);

    $('#gridBody').append(row);
}