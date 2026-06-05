
let programTable;

$(document).ready(function () {

    loadProgramTable();

    // Show Create Form
    $("#addBtn").click(function () {
        clearForm();
        $("#formTitle").text("Create Program");

        let offcanvas = new bootstrap.Offcanvas('#programSidebar');
        offcanvas.show();
    });

    // Cancel Button
    $("#btnCancel").click(function () {
        $("#programFormSection").addClass("d-none");
        $("#tableSection").removeClass("d-none");
    });

    // Save Button
    $("#btnSave").click(function () {
        saveProgram();
    });

});

// ================= LOAD DATATABLE =================
function loadProgramTable() {

    programTable = $("#programDatatable").DataTable({
        ajax: {
            url: "/ProgramMaster/GetAll",
            type: "GET",
            dataSrc: function (json) {
                // Save user permission flags globally
                canEdit = json.canEdit;
                canDelete = json.canDelete;

                // Return actual data array for DataTable
                return json.data;
            },
            error: function () {
                notificationToastCustom(
                    'error',
                    'Failed to load programs.',
                    'Error'
                );
            }
        },
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },

            { data: 'degreeName'},
            { data: "name" },
            { data: "code" },
            {
                data: "isActive",
                render: function (data) {
                    return data
                        ? '<span class="badge bg-success">Active</span>'
                        : '<span class="badge bg-danger">Inactive</span>';
                }
            },
            {
                data: "id",
                render: (data, type, row, meta) => {


                    let buttons = `
                          <li class="list-inline-item dropdown">
                <a class="text-muted dropdown-toggle px-2"  href="#"
                   role="button"  data-bs-toggle="dropdown" aria-haspopup="true"
                   aria-expanded="false"> <i class="uil uil-ellipsis-h"></i>
                </a>

                <div class="dropdown-menu dropdown-menu-end">

                    
                    `;


                    if (canEdit) {
                        buttons += `<button class="btn-sm dropdown-item text-secondary" onclick="editProgram(${data})">
                           <i class="fas fa-edit"> </i> Edit
                       </button>`;
                    }

                    if (canDelete) {
                        buttons += `<button class="btn-sm dropdown-item text-danger deleteBtn" onclick="deleteProgram(${data})" title="Delete">
                            <i class="fas fa-trash-alt"> </i> Delete
                        </button>`;
                    }

                    if (!canEdit && !canDelete) {
                        buttons += `
            <div class="text-center text-muted small py-1">
                No actions
            </div>
        `;
                    }

                    buttons += ` </div>
            </li>
`;

                    // If no buttons are available, show a placeholder
                     
                   

                   

                    return buttons;
                }
                //render: function (data, type, row) {
                //    return `
                //            <button class="btn btn-sm btn-info" onclick="editProgram(${data})">Edit</button>
                //            <button class="btn btn-sm btn-danger" onclick="deleteProgram(${data})">Delete</button>
                //        `;
                //}
            }
        ]
    });
}

// ================= SAVE (CREATE / UPDATE) =================
function saveProgram() {

    let id = $("#programId").val();
    let programName = $("#programName").val().trim();
    let programCode = $("#programCode").val().trim();
    let degreeId = $("#degreeId").val();

    $(".field-error, small.text-danger").addClass("d-none");

    let isValid = true;

    if (!degreeId || degreeId == "0") {
        $("#lbldegreeIdError").text("Degree is required").removeClass("d-none");
        isValid = false;
    }

    if (programName === "") {
        $("#lblprogramNameError").text("Program Name is required").removeClass("d-none");
        isValid = false;
    }

    if (programCode === "") {
        $("#lblprogramCodeError").text("Program Code is required").removeClass("d-none");
        isValid = false;
    }

    // 🔴 STOP if any error
    if (!isValid) return;


    let programData = {
        id: id ? parseInt(id) : 0,
        degreeId: degreeId ? parseInt(degreeId) : 0,
        name: programName,
        code: programCode
    };

    let url = id
        ? "/ProgramMaster/updateProgramDetail"
        : "/ProgramMaster/saveProgramDetail";

    $.ajax({
        url: url,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(programData),

        success: function (res) {

            if (res.success) {

                notificationToastCustom('success', res.message, "Success");

                  let offcanvas = bootstrap.Offcanvas.getInstance('#programSidebar');
    offcanvas.hide();

    
                programTable.ajax.reload();
                clearForm();
            }
            else {

                if (res.errors) {
                    if (res.errors.programName)
                        $("#lblprogramNameError").text(res.errors.programName).removeClass("d-none");

                    if (res.errors.programCode)
                        $("#lblprogramCodeError").text(res.errors.programCode).removeClass("d-none");
                }
                else {
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


// ================= EDIT =================
function editProgram(id) {
    clearForm();

    $.ajax({
        url: "/ProgramMaster/GetById/" + id,
        type: "GET",
        success: function (data) {
            $("#degreeId").val(data.degreeId);
            $("#programId").val(data.id);
            $("#programName").val(data.name);
            $("#programCode").val(data.code);

            $("#formTitle").text("Edit Program");

            let offcanvas = new bootstrap.Offcanvas('#programSidebar');
            offcanvas.show();
        }
    });
} 

// ================= DELETE =================
function deleteProgram(id) {

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
                url: "/ProgramMaster/deleteProgram/" + id,
                type: "GET",

                success: function (res) {

                    if (res.success) {
                        notificationToastCustom('success', res.message, "Success");
                        programTable.ajax.reload();
                    }
                    else {
                        notificationToastCustom('error', res.message, "Error");
                    }
                },

                error: function () {
                    notificationToastCustom('error',
                        'Something went wrong!',
                        'Error');
                }
            });
        }
    });
}


 

// ================= CLEAR FORM =================
function clearForm() {
    $("#programId").val("");
    $("#programName").val("");
    $("#programCode").val("");
    $("#degreeId").val("0");

    $("small.text-danger").addClass("d-none").text("");
}

