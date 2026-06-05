
let table;
let editorInstance = null;

$(document).ready(function () {

    initTable();
    loadSettingsList(); // ✅ ONLY TABLE LOAD FIRST

   
    initEditor();
    initSelect2();
    initEvents();

    
});

function initEditor() {
    $("#btnUpdateSetting").prop("disabled", true);

    ClassicEditor
        .create(document.querySelector('#classic-editor'))
        .then(editor => {
            editorInstance = editor;
            $("#btnUpdateSetting").prop("disabled", false);
        })
        .catch(error => console.error(error));
}

function initSelect2() {
    $('#universityId').select2({
        multiple: true,
        allowClear: true,
        closeOnSelect: false,
        width: '100%',
        ajax: {
            url: '/GeneralSettings/GetUniversities',
            dataType: 'json',
            delay: 250,
            processResults: data => ({ results: data })
        }
    });
    $("#universityId option[value='']").prop("disabled", true);


}

function initTable() {
    table = $('#settingsTable').DataTable({
        data: [],
        autoWidth: false, // ❗ important
        columns: [
            {
                data: null,
                width: "5%",
                render: (d, t, r, m) => m.row + 1
            },
            {
                data: 'universityName',
                width: "30%",
                render: function (data) {
                    if (!data) return '';
                    return data.split(',')
                        .map(u => `<span class="badge bg-primary badge-university me-1"  style="font-size: 12px; padding: 5px 8px;">${u.trim()}</span>`)
                        .join('');
                }
            },
            { data: 'degreeName', width: "25%" },
            { data: 'academicYear', width: "10%" },
            { data: 'academicStartDate', width: "8%" },
            { data: 'academicEndDate', width: "8%" },
            {
                data: 'isActive',
                width: "7%",
                render: d =>
                    `<span class="badge ${d ? 'bg-success' : 'bg-danger'}">
                        ${d ? 'Active' : 'Inactive'}
                     </span>`
            },
            {
                data: null,
                width: "8%",
                orderable: false,
                render: () => `
                    <button class="btn btn-sm btn-primary editBtn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger deleteBtn ms-1">
                        <i class="fas fa-trash"></i>
                    </button>
                `
            }
        ]
    });
}


function loadSettingsList() {
    $.get('/GeneralSettings/GetLoadSettings', function (res) {
      
         
        table.clear().rows.add(res.data).draw();
      // table.clear().rows.add(res.data).draw();
    });
}

function initEvents() {

    $("#degreeId option[value='']").prop("disabled", true);

    let today = new Date().toISOString().split('T')[0];

    $("#startDate").attr("min", today);
    $("#endDate").attr("min", today);

    $("#startDate").on("change", function () {

        let start = $(this).val();

        $("#endDate").val(""); // res.dataet
        $("#endDate").attr("min", start);
    });


    // ADD
    $("#addBtn").click(function () {
        clearForm();
        showForm();
    });

    // EDIT
    $('#settingsTable').on('click', '.editBtn', function () {
        let data = table.row($(this).closest('tr')).data();

        $.get(`/GeneralSettings/GetById/${data.id}`, function (res) {
            bindForm(res);
            showForm(true);
        });
    });

    //DELETE
    $('#settingsTable').on('click', '.deleteBtn', function () {

        let data = table.row($(this).closest('tr')).data();

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {

            if (result.isConfirmed) {

                $.ajax({
                    url: `/GeneralSettings/DeleteApplicatoin?id=${data.id}`,
                    type: 'POST',
                    success: function (res) {

                        if (res.success) {
                            notificationToastCustom('success', res.message, "Success");
                           //toastr.success(res.message || "Deleted successfully");

                            // Reload table
                            loadSettingsList();

                        } else {
                            notificationToastCustom('error', res.message, "Error");
                        }
                    },
                    error: function () {
                        toastr.error("Something went wrong");
                    }
                });

            }
        });
    });



    // SAVE
    $("#btnUpdateSetting").click(function () {
        if (!validateSettings()) return;
        saveSettings();
    });

    // CANCEL
    $("#btnCancelSetting").click(function () {
        showTable();
    });

    // REMOVE ROUND
    $("#roundTable").on("click", ".removeRow", handleRemoveRow);

    // ADD ROUND
    $("#addRowBtn").click(addRoundRow);

    // INPUT CHANGE
    $(document).on("input change", "input, select", function () {
        $(this).removeClass("is-invalid");
        $(this).closest("div").find(".text-danger").addClass("d-none");
    });
}

function addRoundRow() {

    let row = `
    <tr>
        <td>
            <input type="hidden" class="roundId" value="0" />
            <input type="text" class="form-control roundName" />
        </td>
        <td><input type="date" class="form-control startDate" /></td>
        <td><input type="date" class="form-control endDate" /></td>
        <td>
            <select class="form-select status">
                <option>Upcoming</option>
                <option>Active</option>
                <option>Completed</option>
            </select>
        </td>
        <td>
            <button type="button" class="btn btn-danger btn-sm removeRow">🗑</button>
        </td>
    </tr>`;

    $("#roundTable tbody").append(row);

    applyRoundDateLimits(); // ✅ keep date constraints
}


function applyRoundDateLimits() {
    // Get academic year start and end dates
    let academicStart = $("#startDate").val();
    let academicEnd = $("#endDate").val();

    // Iterate over all rows
    $("#roundTable tbody tr").each(function () {
        let rStart = $(this).find(".startDate");
        let rEnd = $(this).find(".endDate");

        // Apply min/max for round start date
        if (academicStart) {
            rStart.attr("min", academicStart);
        } else {
            rStart.removeAttr("min");
        }

        if (academicEnd) {
            rStart.attr("max", academicEnd);
            rEnd.attr("max", academicEnd);
        } else {
            rStart.removeAttr("max");
            rEnd.removeAttr("max");
        }

        // Ensure round end is never before start
        if (rStart.val()) {
            rEnd.attr("min", rStart.val());
        } else if (academicStart) {
            rEnd.attr("min", academicStart);
        } else {
            rEnd.removeAttr("min");
        }
    });
}

function handleRemoveRow() {

    let row = $(this).closest("tr");
    let roundId = parseInt(row.find(".roundId").val()) || 0;

    // 🟢 Not saved → just remove
    if (roundId === 0) {
        row.remove();
        return;
    }

    // 🔴 Saved → confirm delete
    Swal.fire({
        title: 'Are you sure?',
        text: "This round will be permanently deleted!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {

        if (result.isConfirmed) {

            $.ajax({
                url: '/GeneralSettings/DeleteRound',
                type: 'POST',
                data: { id: roundId },
                success: function (res) {

                    if (res.success) {
                        notificationToastCustom('success', res.message, "Success");

                        // ✅ Remove row from UI
                        row.remove();
                    }
                    else {
                        notificationToastCustom('error', res.message, "Error");
                    }
                },
                error: function () {
                    notificationToastCustom('error', "Something went wrong", "Error");
                }
            });
        }
    });
}

function bindForm(data) {

    $("#academicYearMasterId").val(data.id);

    // ✅ SET AcademicYearId here
    $("#academicYearId").val(data.academicYearId);

    // Universities
    bindUniversities(data.universityId);

    $("#degreeId").val(data.degreeId).trigger("change");

    $("#startDate").val(data.academicStartDate);
    $("#endDate").val(data.academicEndDate);

    $("#activeToggle").prop("checked", data.isActive);

    if (editorInstance) {
        editorInstance.setData(data.newsNotice || "");
    }

    bindRounds(data.admissionRounds);
}

function bindUniversities(uniIds) {

    if (!Array.isArray(uniIds)) {
        uniIds = uniIds ? uniIds.split(',') : [];
    }

    $('#universityId').empty();

    $.get('/GeneralSettings/GetUniversities', function (data) {

        uniIds.forEach(id => {
            let item = data.find(x => x.id == id);
            if (item) {
                let option = new Option(item.text, item.id, true, true);
                $('#universityId').append(option);
            }
        });

        $('#universityId').trigger('change');
    });
}

function bindRounds(rounds) {

    $("#roundTable tbody").empty();

    // ✅ If no rounds → add default row
    if (!rounds || rounds.length === 0) {
        addRoundRow();
        return;
    }

    $.each(rounds, function (i, item) {

        let row = `
        <tr>
            <td>
                <input type="hidden" class="roundId" value="${item.id}" />
                <input type="text" class="form-control roundName" value="${item.roundName}" />
            </td>
            <td><input type="date" class="form-control startDate" value="${formatDate(item.startDate)}" /></td>
            <td><input type="date" class="form-control endDate" value="${formatDate(item.endDate)}" /></td>
            <td>
                <select class="form-select status">
                    <option ${item.admissionStatus == 'Upcoming' ? 'selected' : ''}>Upcoming</option>
                    <option ${item.admissionStatus == 'Active' ? 'selected' : ''}>Active</option>
                    <option ${item.admissionStatus == 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-sm removeRow">🗑</button>
            </td>
        </tr>`;

        $("#roundTable tbody").append(row);
    });
}

function formatDate(date) {
    if (!date) return '';
    return date.split('T')[0];
}

//  SAVE DATA
function saveSettings() {

    let rounds = [];

    $("#roundTable tbody tr").each(function () {

        let row = $(this);

        rounds.push({
            id: parseInt(row.find(".roundId").val()) || 0,
            AdmissionAcademicYearId: parseInt($("#academicYearMasterId").val()) || 0,
            // ✅ TAKE FROM HIDDEN FIELD
            academicYearId: parseInt($("#academicYearId").val()) || 0,
            //academicYearId: 0,
            roundName: row.find(".roundName").val(),
            startDate: row.find(".startDate").val(),
            endDate: row.find(".endDate").val(),
            admissionStatus: row.find(".status").val()
        });
    });

    let universityIds = $("#universityId").val();

    let universityCsv = universityIds ? universityIds.join(",") : "";

    let data = {
        // ✅ MAIN ID FROM HIDDEN FIELD
        id: parseInt($("#academicYearMasterId").val()) || 0,

        universityId: universityCsv,
        degreeId: $("#degreeId").val(),
        // ✅ TAKE FROM HIDDEN FIELD
        academicYearId: parseInt($("#academicYearId").val()) || 0,
        academicStartDate: $("#startDate").val(),
        academicEndDate: $("#endDate").val(),

        isEnabled: $("#activeToggle").is(":checked"),

        // ✅ CKEDITOR VALUE
        newsNotice: editorInstance ? editorInstance.getData() : "",
        admissionRounds: rounds
    };

    let url = data.id > 0
        ? '/GeneralSettings/UpdateGeneralSettings'
        : '/GeneralSettings/SaveGeneralSettings';

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
            if (res.success) {
                notificationToastCustom('success', res.message, "Success");

                loadSettingsList(); // reload table
                showTable();        // 👈 go back
            }
            else {
                if (res.errors) {
                    if (res.errors.degree)
                        $('#lblprogramIdError').text(res.errors.degree).removeClass('d-none');
                            $('html, body').animate({
                                scrollTop: $('#lblprogramIdError').offset().top - 150
                            }, 300);

                    $('#lblprogramIdError').focus();
                } else {
                    notificationToastCustom('error', res.message, "Error");

                }
            }

        }
    });
}



function clearForm() {

    // ✅ reset this also
    $("#academicYearId").val(0);
    $("#academicYearMasterId").val(0);
    $("#universityId").val(null).trigger("change");
    $("#degreeId").val("").trigger("change");

    $("#startDate, #endDate").val("");
    $("#activeToggle").prop("checked", false);

    if (editorInstance) {
        editorInstance.setData("");
    }

    $("#roundTable tbody").empty();
}

function showTable() {
    $("#tableSection").removeClass("d-none");
    $("#formSection").addClass("d-none");
}

function showForm() {
    $("#tableSection").addClass("d-none");
    $("#formSection").removeClass("d-none");
}


function validateSettings() {

    let isValid = true;
    let firstInvalid = null;

    let today = new Date().toISOString().split('T')[0];

    // res.dataet all errors
    $(".text-danger").addClass("d-none").text("");
    $("input, select").removeClass("is-invalid");
    function setError(element, errorLabel, message) {
        $(element).addClass("is-invalid");
        $(errorLabel).text(message).removeClass("d-none");

        if (!firstInvalid) {
            firstInvalid = element;
        }

        isValid = false;
    }


    let university = $("#universityId");
    let degreeId = $("#degreeId");
    let startDate = $("#startDate");
    let endDate = $("#endDate");

    // 🔴 University
    if (!university.val()) {
        setError(university, "#lbluniversityIdError", "Please select university");
    }

    // 🔴 Academic Year
    if (!degreeId.val()) {
        setError(degreeId, "#lblprogramIdError", "Please select program");
    }

    // 🔴 Start Date
    if (!startDate.val()) {
        setError(startDate, "#startDateError", "Start date is required");
    } else if (startDate.val() < today) {
        setError(startDate, "#startDateError", "Start date must be today or future");
    }

    // 🔴 End Date
    if (!endDate.val()) {
        setError(endDate, "#endDateError", "End date is required");
    } else if (startDate.val() && endDate.val() < startDate.val()) {
        setError(endDate, "#endDateError", "End date must be after start date");
    }


    // 🔴 CKEditor Required
    let news = editorInstance ? editorInstance.getData().trim() : "";
    if (!news) {
        $("#lblNewsError").text("News/Notice is required").removeClass("d-none");

        if (!firstInvalid) {
            firstInvalid = "#classic-editor";
        }

        isValid = false;
    }

    // 🔴 Round Table Validation
    let rows = $("#roundTable tbody tr");

    if (rows.length === 0) {
        notificationToastCustom('error', "Please add at least one round", "Error");

        if (!firstInvalid) {
            firstInvalid = "#addRowBtn";
        }

        isValid = false;
    }

    rows.each(function (i) {

        let row = $(this);

        let roundName = row.find(".roundName");
        let rStart = row.find(".startDate");
        let rEnd = row.find(".endDate");

        row.find("input").removeClass("is-invalid");

        if (!roundName.val()) {
            roundName.addClass("is-invalid");
            isValid = false;

            if (!firstInvalid) firstInvalid = roundName;
        }

        if (!rStart.val()) {
            rStart.addClass("is-invalid");
            isValid = false;

            if (!firstInvalid) firstInvalid = rStart;
        }

        if (!rEnd.val()) {
            rEnd.addClass("is-invalid");
            isValid = false;

            if (!firstInvalid) firstInvalid = rEnd;
        }

        // Date Logic
        if (rStart.val() && startDate.val() && rStart.val() < startDate.val()) {
            rStart.addClass("is-invalid");
            isValid = false;

            if (!firstInvalid) firstInvalid = rStart;
        }

        if (rEnd.val() && rStart.val() && rEnd.val() < rStart.val()) {
            rEnd.addClass("is-invalid");
            isValid = false;

            if (!firstInvalid) firstInvalid = rEnd;
        }

        if (rEnd.val() && endDate.val() && rEnd.val() > endDate.val()) {
            rEnd.addClass("is-invalid");
            isValid = false;

            if (!firstInvalid) firstInvalid = rEnd;
        }
    });

    // 🔥 Focus on first invalid field
    if (firstInvalid) {
        $('html, body').animate({
            scrollTop: $(firstInvalid).offset().top - 100
        }, 300);

        $(firstInvalid).focus();
    }

    return isValid;
}

//Format Date
function formatDate(date) {
    if (!date) return '';
    return date.split('T')[0];
}
