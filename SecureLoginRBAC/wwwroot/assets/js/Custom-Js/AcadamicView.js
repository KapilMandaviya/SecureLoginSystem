let today = new Date();
let currentYear = today.getFullYear();
let nextYear = currentYear + 1;
let currentDto = null;

$(document).ready(function () {
    clearErrors();
    // ✅ Start Date → Only Current Year
    $("#start_date").attr({
        min: currentYear + "-01-01",
        max: currentYear + "-12-31"
    });

    // ✅ End Date → Only Next Year
    $("#end_date").attr({
        min: nextYear + "-01-01",
        max: nextYear + "-12-31"
    });

    // ✅ When Start Date changes → Adjust End Date minimum
    $("#start_date").on("change", function () {

        let selectedStart = new Date($(this).val());

        if (selectedStart.getFullYear() !== currentYear) {
            $("#startDateError")
                .text(`Start Date must be in current year (${currentYear}).`)
                .removeClass("d-none");
            $(this).val("");
            return;
        }

        // Force End Date to be next year only
        $("#end_date").attr("min", nextYear + "-01-01");
    });



    let editIndex = null;


    let table = $("#AcadamicYearDatatable").DataTable({
        ajax: {
            url: "/AcadamicYear/GetAll",
            type: "GET",
            //dataSrc: "data" // ← match the 'data' property
            dataSrc: function (json) {
                // Save user permission flags globally
                canEdit = json.canEdit;
                canMakeActive = json.canMakeActive;

                // Return actual data array for DataTable
                return json.data;
            }
        },
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: "startDate" },
            { data: "endDate" },
            { data: "currentAcYear" },
            {
                data: "statusAc",
                render: function (data) {
                    return data
                        ? '<span class="badge bg-success">Active</span>'
                        : '<span class="badge bg-secondary">Inactive</span>';
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {

                    // Build the dropdown items conditionally
                    let editItem = "";
                    let makeActiveItem = "";
                     

                    // Edit button: only if user can edit AND row is active
                    if (canEdit && row.statusAc) {
                        editItem = `
            <button class="btn-sm dropdown-item editBtn text-secondary" data-id="${row.id}">
                <i class="fas fa-edit me-2"></i> Edit
            </button>
        `;
                    }

                    // Make Active button: only if user can make active AND row is inactive
                    if (canMakeActive && !row.statusAc && !row.isProcessed) {
                        makeActiveItem = `
            <button class="btn-sm dropdown-item makeActiveBtn text-success" data-id="${row.id}">
                <i class="fas fa-check me-2"></i> Make Active
            </button>
        `;
                    }

                    // If no buttons are available, show a placeholder
                    let noAction = "";
                    if (!editItem && !makeActiveItem) {
                        noAction = `
            <div class="text-center text-muted small py-1">
                No actions
            </div>
        `;
                    }

                    return `
        <li class="list-inline-item dropdown">
            <a class="text-muted dropdown-toggle px-2" href="#"
               role="button" data-bs-toggle="dropdown" aria-haspopup="true"
               aria-expanded="false">
               <i class="fas fa-ellipsis-h"></i>
            </a>

            <div class="dropdown-menu dropdown-menu-end">
                ${editItem}
                ${makeActiveItem}
                
                ${noAction}
            </div>
        </li>
    `;
                }

            }
        ]
    });


    // Show Form
    $("#addBtn").click(function () {
        currentDto = null; // reset so it doesn’t carry old edit data
        editIndex = null;


        clearForm();
        clearErrors();
        $("#formTitle").text("Create Academic Year");
        
        //$("#tableSection").addClass("d-none");
        //$("#formSection").removeClass("d-none");
        let academicSidebar = new bootstrap.Offcanvas(document.getElementById('academicYearSidebar'));
        academicSidebar.show();
    });

    $("#btnCancel").click(function () {
        $("#formSection").addClass("d-none");
        $("#tableSection").removeClass("d-none");
        clearForm();
    });

    function clearErrors() {
        $("#startDateError").text("").addClass("d-none");
        $("#endDateError").text("").addClass("d-none");
    }

    // Save
    $("#btnSave").click(function () {
        clearErrors();



        let startDateVal = $("#start_date").val();
        let endDateVal = $("#end_date").val();

        let isValid = true;
        let currentYear = new Date().getFullYear();
        let nextYear = currentYear + 1;

        if (!startDateVal) {
            $("#startDateError").text("Start Date is required.").removeClass("d-none");
            isValid = false;
        } else if (new Date(startDateVal).getFullYear() !== currentYear) {
            $("#startDateError")
                .text(`Start Date must be in current year (${currentYear}).`)
                .removeClass("d-none");
            isValid = false;
        }

        if (!endDateVal) {
            $("#endDateError").text("End Date is required.").removeClass("d-none");
            isValid = false;
        } else if (new Date(endDateVal).getFullYear() !== nextYear) {
            $("#endDateError")
                .text(`End Date must be in next year (${nextYear}).`)
                .removeClass("d-none");
            isValid = false;
        } else if (startDateVal && new Date(endDateVal) <= new Date(startDateVal)) {
            $("#endDateError")
                .text("End Date must be greater than Start Date.")
                .removeClass("d-none");
            isValid = false;
        }

        if (!isValid) return;

        // ✅ Use currentDto for fields not in UI
        let dto = {
            Id: currentDto ? currentDto.id : 0,
            StartDate: startDateVal,
            EndDate: endDateVal,
            CurrentAcYear: currentDto ? currentDto.currentAcYear : `${currentYear}-${nextYear}`,
            StatusAc: currentDto ? currentDto.statusAc : false,
            IsProcessed: currentDto ? currentDto.isProcessed : false,
            IsActive: currentDto ? currentDto.isActive : true,
            CreatedBy: currentDto ? currentDto.createdBy : null
        };

        // Decide URL dynamically
        let url = (!dto.Id || dto.Id === 0)
            ? '/AcadamicYear/saveAcademicDetail'   // Create
            : '/AcadamicYear/updateAcademicDetail'; // Update

        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(dto),
            success: function (response) {
                if (response.success) {
                    notificationToastCustom("success", response.message, "Success");
                    //$("#formSection").addClass("d-none");
                    //$("#tableSection").removeClass("d-none");

                    let sidebarEl = document.getElementById('academicYearSidebar');
                    let sidebar = bootstrap.Offcanvas.getInstance(sidebarEl);
                    sidebar.hide();

                    clearForm();



                    table.ajax.reload();
                    currentDto = null; // reset after saving// ✅ reload DataTable
                }
                else {
                    notificationToastCustom("error", response.message, "Error");
                }
            },
            error: function () {
                alert("Error saving data.");
            }
        });

});




// MakeActive
$(document).on("click", ".makeActiveBtn", function () {
    let id = $(this).data("id");

    Swal.fire({
        title: "Are you sure?",
        text: "Make this Academic Year active?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, activate it!",
        cancelButtonText: "Cancel",
        
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
    $.ajax({
        url: "/AcadamicYear/MakeActive",
        type: "GET",
        data: { id: id },
        success: function (response) {

            if (response.success) {
                notificationToastCustom("success", response.message, "Success");
            }
            else {
                notificationToastCustom("error", response.message, "Error");
            }
            table.ajax.reload();  // ✅ reload table
        },
        error: function () {
            alert("Error updating status.");
        }
    });

        }
    });

});

//EDIT
$(document).on("click", ".editBtn", function () {
    clearErrors();
    let id = $(this).data("id");
    editIndex = id;

    $.ajax({
        url: "/AcadamicYear/GetById?id=" + id,
        type: "GET",
        success: function (data) {
            currentDto = data; // store full DTO
            $("#start_date").val(data.startDate.split('T')[0]);
            $("#end_date").val(data.endDate.split('T')[0]);

            //$("#formTitle").text("Edit Academic Year");
            //$("#tableSection").addClass("d-none");
            //$("#formSection").removeClass("d-none");

            $("#formTitle").text("Edit Academic Year");

            let academicSidebar = new bootstrap.Offcanvas(document.getElementById('academicYearSidebar'));
            academicSidebar.show();
        }
    });

});



function clearForm() {
 
 
    $("#start_date").val("");
    $("#end_date").val("");
    //$("#captchaToggle").prop("checked", false);
    editIndex = null;
    }


    function showWarning(message) {
        Swal.fire({
            icon: 'warning',
            title: 'Warning',
            text: message,
            confirmButtonColor: '#3085d6'
        });
    }

});
