let categoryTable;
let canEdit = false;
let canDelete = false;

$(document).ready(function () {

    loadCategoryTable();

    // Show Create Form
    $("#addBtn").click(function () {
        clearForm();
        $("#formTitle").text("Create Category");
        $("#tableSection").addClass("d-none");
        $("#categoryFormSection").removeClass("d-none");
    });

    // Cancel Button
    $("#btnCancel").click(function () {
        $("#categoryFormSection").addClass("d-none");
        $("#tableSection").removeClass("d-none");
    });

    // Save Button
    $("#btnSave").click(function () {
        saveCategory();
    });

});


// ================= LOAD DATATABLE =================
function loadCategoryTable() {

    categoryTable = $("#categoryDatatable").DataTable({
        ajax: {
            url: "/Category/GetAll",
            type: "GET",
            dataSrc: function (json) {

                canEdit = json.canEdit;
                canDelete = json.canDelete;

                return json.data;
            },
            error: function () {
                notificationToastCustom(
                    'error',
                    'Failed to load categories.',
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
                render: function (data) {

                    let buttons = `
                        <li class="list-inline-item dropdown">
                            <a class="text-muted dropdown-toggle px-2" href="#"
                               role="button" data-bs-toggle="dropdown"
                               aria-expanded="false">
                               <i class="uil uil-ellipsis-h"></i>
                            </a>

                            <div class="dropdown-menu dropdown-menu-end">
                    `;

                    if (canEdit) {
                        buttons += `
                            <button class="btn-sm dropdown-item text-secondary"
                                onclick="editCategory(${data})">
                                <i class="fas fa-edit"></i> Edit
                            </button>`;
                    }

                    if (canDelete) {
                        buttons += `
                            <button class="btn-sm dropdown-item text-danger"
                                onclick="deleteCategory(${data})">
                                <i class="fas fa-trash-alt"></i> Delete
                            </button>`;
                    }

                    if (!canEdit && !canDelete) {
                        buttons += `
                            <div class="text-center text-muted small py-1">
                                No actions
                            </div>`;
                    }

                    buttons += `</div></li>`;

                    return buttons;
                }
            }
        ]
    });
}



// ================= SAVE (CREATE / UPDATE) =================
function saveCategory() {

    let id = $("#categoryId").val();
    let categoryName = $("#categoryName").val().trim();
    let categoryCode = $("#categoryCode").val().trim();

    $(".field-error").addClass("d-none");

    if (categoryName === "") {
        $("#lblcategoryNameError")
            .text("Category Name is required")
            .removeClass("d-none");
        return;
    }

    if (categoryCode === "") {
        $("#lblcategoryCodeError")
            .text("Category Code is required")
            .removeClass("d-none");
        return;
    }

    let categoryData = {
        id: id ? parseInt(id) : 0,
        name: categoryName,
        code: categoryCode
    };

    let url = id
        ? "/Category/updateCategoryDetail"
        : "/Category/saveCategoryDetail";

    $.ajax({
        url: url,
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(categoryData),

        success: function (res) {

            if (res.success) {

                notificationToastCustom('success', res.message, "Success");

                $("#categoryFormSection").addClass("d-none");
                $("#tableSection").removeClass("d-none");

                categoryTable.ajax.reload();
                clearForm();
            }
            else {
                notificationToastCustom('error', res.message, "Error");
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
function editCategory(id) {

    clearForm();

    $.ajax({
        url: "/Category/GetById/" + id,
        type: "GET",
        success: function (data) {

            $("#categoryId").val(data.id);
            $("#categoryName").val(data.name);
            $("#categoryCode").val(data.code);

            $("#formTitle").text("Edit Category");
            $("#tableSection").addClass("d-none");
            $("#categoryFormSection").removeClass("d-none");
        },
        error: function () {
            notificationToastCustom(
                'error',
                'Failed to fetch category details.',
                'Error'
            );
        }
    });
}



// ================= DELETE =================
function deleteCategory(id) {

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
                url: "/Category/deleteProgram/" + id,
                type: "GET",

                success: function (res) {

                    if (res.success) {
                        notificationToastCustom('success', res.message, "Success");
                        categoryTable.ajax.reload();
                    }
                    else {
                        notificationToastCustom('error', res.message, "Error");
                    }
                },

                error: function () {
                    notificationToastCustom(
                        'error',
                        'Something went wrong!',
                        'Error'
                    );
                }
            });
        }
    });
}



// ================= CLEAR FORM =================
function clearForm() {
    $("#categoryId").val("");
    $("#categoryName").val("");
    $("#categoryCode").val("");
    $(".field-error").addClass("d-none");
}
