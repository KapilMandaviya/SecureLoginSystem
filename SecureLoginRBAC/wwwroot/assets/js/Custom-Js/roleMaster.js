// Sample role data
let roles = [];
let canEdit = false;
let canDelete = false;


let forms = [];        // [{ formCode, permissions }]
let formMap = {};     // formCode → formId

let currentRoleId = null;
let currentRole = null;
let isCreateFlow = false;
let rolesTable = null;
let isConfigureFlow = false;

//let selectedRole = null;   // immutable (datatable row)
//let workingRole = null;    // mutable (used in UI)

// Initialize the page
$(document).ready(function () {
    // Standalone (no sub-menu) checkbox → Select2 select all
    $('#moduleSelect').on('change', function () {
        loadModulesAndPermissions();

        
    });

    initDataTable();

    loadModulesAndPermissions();

    initEventListeners();
    //Load role when the tab is clicked
    $('button[data-bs-target="#tabRoleMaster"]').on('shown.bs.tab', function () {
        //rolesTable.ajax.reload(null, false);
        goToMainView();
        loadModulesAndPermissions();
    });

    // Load role priority when the tab is clicked
    $('button[data-bs-target="#tabRolePriority"]').on('shown.bs.tab', function () {
        loadRolePriority();
    });

    // Close dropdown when clicking an option
    $('#roleTable').on('click', '.dropdown-item', function () {
        $(this).closest('.action-menu').hide();
    });

    $("#btnSavePriority").click(function () {

        let data = [];
        $("#rolePriorityList li").each(function (i) {
            data.push({
                id: parseInt($(this).data("id")) || 0,
                rolePriority: i + 1,
                isActive: true,
                roleName: '',
            });
        });
        $.ajax({
            url: '/roleMaster/SavePriority',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                if (response.success == true) {
                    notificationToastCustom('success', response.message, 'Success')
                    loadRolePriority();
                }
                else {
                    notificationToastCustom('error', response.message, 'error')
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




});


// Parent checkbox toggles ONLY its children
$(document).on('change', '.parent-check', function () {
    const isChecked = $(this).prop('checked');
    const group = $(this).closest('tr').data('group');

    $(`.${group} .child-check`).prop('checked', isChecked);

    // Open accordion when checked
    if (isChecked) {
        $(`.${group}`).collapse('show');
    }
    // Select ALL options in each child Select2
    $(`.${group} .perm-select`).each(function () {
        const $select = $(this);

        if (isChecked) {
            const allValues = $select.find('option').map(function () {
                return $(this).val();
            }).get();

            $select.val(allValues).trigger('change');
        } else {
            // Optional: clear Select2 when parent unchecked
            $select.val(null).trigger('change');
        }
    });
});

$(document).on('change', '.child-check', function () {
    const $row = $(this).closest('tr');           // current child row
    const groupRow = $row.prevAll('.parent-row').first();
    const group = groupRow.data('group');

    const totalChildren = $(`.${group} .child-check`).length;
    const checkedChildren = $(`.${group} .child-check:checked`).length;
    const isChecked = $(this).prop('checked');

    // Parent stays checked if ANY child is checked
    groupRow.find('.parent-check').prop('checked', checkedChildren > 0);

    // Update only this child's Select2
    const $select = $row.find('.perm-select');
    if (isChecked) {
        // Select all options for this child
        const allValues = $select.find('option').map(function () {
            return $(this).val();
        }).get();

        $select.val(allValues).trigger('change');
    } else {
        // Clear only this child's Select2
        $select.val(null).trigger('change');
    }
});

$(document).on('change', '.row-check', function () {
    const isChecked = $(this).prop('checked');
    const $row = $(this).closest('tr');
    const $select = $row.find('.perm-select');

    if (isChecked) {
        // Get all Select2 option values
        const allValues = $select.find('option').map(function () {
            return $(this).val();
        }).get();

        // Select all
        $select.val(allValues).trigger('change');
    } else {
        // Optional: clear selection
        $select.val(null).trigger('change');
    }
});

$(document).on('change', '.perm-select', function () {
    const $select = $(this);
    const selectedValues = $select.val();

    const $row = $select.closest('tr');

    // 1️⃣ Check/uncheck THIS row checkbox
    const $rowCheckbox = $row.find('.row-check, .child-check').first();
    $rowCheckbox.prop('checked', selectedValues && selectedValues.length > 0);

    // 2️⃣ HANDLE PARENT CHECKBOX
    const groupClasses = $row.attr('class')?.split(' ').filter(c => c.startsWith('group-'));

    if (!groupClasses || groupClasses.length === 0) return;

    const groupClass = groupClasses[0];

    // All children under this parent
    const $childRows = $(`tr.${groupClass}`);
    const $parentRow = $(`tr.parent-row[data-group="${groupClass}"]`);
    const $parentCheckbox = $parentRow.find('.parent-check');

    // Check if ANY child has permissions selected
    let anyChildChecked = false;

    $childRows.each(function () {
        const values = $(this).find('.perm-select').val();
        if (values && values.length > 0) {
            anyChildChecked = true;
            return false; // break loop
        }
    });

    $parentCheckbox.prop('checked', anyChildChecked);
});

function loadRolePriority() {
    $.ajax({
        url: '/roleMaster/GetRolePriority', // API to fetch roles
        type: 'GET',
        dataType: 'json',
        success: function (roles) {
            
            $("#rolePriorityList").empty();

            $.each(roles, function (i, role) {
                $("#rolePriorityList").append(`
                        <li class="list-group-item" data-id="${role.id}">
                            <span class="priority-badge">${role.rolePriority}</span>
                            <span class="drag-handle">☰</span>
                            ${role.roleName}
                        </li>
                    `);
            });

            enableSorting();
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

function enableSorting() {
    $("#rolePriorityList").sortable({
        cancel: "button, input",
        update: function () {
            updateNumbers();
        }
    });
}

function updateNumbers() {
    $("#rolePriorityList li").each(function (i) {
        $(this).find(".priority-badge").text(i + 1);
    });
}

function loadModulesAndPermissions() {
    let moduleId = $('#moduleSelect').val()
        ? parseInt($('#moduleSelect').val())
        : 0;
    $.ajax({
        url: '/FormMaster/GetAllForms', // backend endpoint
        method: 'GET',
        data: { moduleId: moduleId },
        success: function (response) {
            
            forms = response.map(f => ({
                formCode: f.formCode,
                permissions: f.actionPayLoad || []
            }));

            formMap = {};
            response.forEach(f => {
                formMap[f.formCode] = f.id;
            });
            
            populatePermissionsTable(response);
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
 
function populatePermissionsTable(response) {
    const tableBody = $('#permissionsTableBody').empty();

    const { parents, parentNoSubs } = buildMenuGroups(response);

    // ✅ NO FORMS FOUND
    if (
        (!parents || parents.length === 0) &&
        (!parentNoSubs || parentNoSubs.length === 0)
    ) {
        tableBody.append(`
            <tr>
                <td colspan="3" class="text-center text-muted py-2 font-size-16">
                    No Forms Found
                </td>
            </tr>
        `);
        return;
    }

    // 🔶 STANDALONE (NO SUBMENU)
    parentNoSubs.forEach(item => {
        tableBody.append(`
            <tr class="align-middle" data-module="${item.formCode}">
                <td class="text-center">
                    <input type="checkbox" class="row-check">
                </td>
                <td class="fw-bold text-start">
                    ${item.formName}
                </td>
                <td>
                    <select class="form-select perm-select"
                            data-permissions='${JSON.stringify(item.actionPayLoad || [])}'
                            multiple>
                    </select>
                </td>
            </tr>
        `);
    });

    // 🔷 PARENTS WITH SUBMENUS
    parents.forEach((parent, index) => {
        const groupId = `group-${index}`;

        tableBody.append(`
            <tr class="parent-row" data-group="${groupId}">
                <td class="text-center">
                    <input type="checkbox" class="no-collapse parent-check">
                </td>
                <td colspan="2"
                    class="fw-bold text-start parent-toggle"
                    data-bs-toggle="collapse"
                    data-bs-target=".${groupId}"
                    aria-expanded="false"
                    style="cursor:pointer">
                    <span>${parent.formName}</span>
                    <i class="fas fa-chevron-down float-end me-2"></i>
                </td>
            </tr>
        `);

        parent.children.forEach(child => {
            tableBody.append(`
                <tr class="collapse ${groupId} align-middle" data-module="${child.formCode}">
                    <td></td>
                    <td class="ps-2 text-start">
                        <input type="checkbox" class="child-check me-2">
                        ${child.formName}
                    </td>
                    <td>
                        <select class="form-select perm-select"
                                data-permissions='${JSON.stringify(child.actionPayLoad || [])}'
                                multiple></select>
                    </td>
                </tr>
            `);
        });
    });

    // Initialize Select2
    initPermissionSelect2();
}




function getFormIdByCode(formCode) {
    return formMap[formCode] || 0; // returns 0 if not found
}

// Initialize DataTable
function initDataTable() {
    rolesTable = $('#roleTable').DataTable({
        ajax: {
            url: '/roleMaster/GetAll',
            type: 'GET',
            dataSrc: function (json) {
                //canEdit = json.canEdit;
                //canDelete = json.canDelete;

                //// Hide or show Actions column dynamically
                //const col = rolesTable.column(3); // Actions column index
                //col.visible(canEdit || canDelete);

                return json.data;
            }
        },
        order: [[1, 'asc']],

        columns: [
            {
                data: 'roleName',
                render: d => `<div class="fw-bold">${d}</div>`
            },
            {
                data: 'rolePriority',
                className: 'text-center',
                orderable: true,   // explicitly enable ordering
                render: d => `<div class="fw-bold">${d}</div>`
            },
            {
                data: 'isActive',
                render: d => `
                <span class="badge ${d ? 'bg-success' : 'bg-danger'}">
                    ${d ? 'Active' : 'Inactive'}
                </span>`
            },

            {
                data: null,
                orderable: false,
                className: 'text-center',
                render: function (row) {
                    let actions = '';

                    if (can('Admission_RoleMaster_UPDATE')) {
                    actions += `
                <a class="dropdown-item btn-edit text-secondary" href="javascript:void(0)">
                    <i class="fas fa-edit me-2"></i>Edit
                </a>`;
                      }

                    // if (canEdit) {
                    if (can('Admission_RoleMaster_UPDATE')) {
                    actions += `
                <a class="dropdown-item btn-configure text-primary" href="javascript:void(0)">
                    <i class="fas fa-cog me-2"></i>Configure
                </a>`;
                     }

                    if (can('Admission_RoleMaster_DELETE')) {

                    actions += `
                <a class="dropdown-item text-danger deleteBtn" 
                   href="javascript:void(0)" 
                   data-role-id="${row.id}">
                    <i class="fas fa-trash-alt me-2"></i>Delete
                </a>`;
                     }

                    if (!actions) {
                        return `<span class="text-muted">No Actions</span>`;
                    }

                    return `
            <li class="list-inline-item dropdown">
                <a class="text-muted dropdown-toggle font-size-18 px-2"
                   href="#"
                   role="button"
                   data-bs-toggle="dropdown"
                   aria-haspopup="true"
                   aria-expanded="false">
                    <i class="uil uil-ellipsis-h"></i>
                </a>

                <div class="dropdown-menu dropdown-menu-end">
                    ${actions}
                </div>
            </li>
        `;
                }
            }


        ],
        pageLength: 10
    });

}





// Initialize event listeners
function initEventListeners() {

    $('#saveButtonText').text('Create Role');
    $('#btnNewRole').click(startCreateFlow);
    $('#btnCancel').click(goToMainView);
    $('#btnNext').click(nextToPermissions);
    $('#btnBack').click(backToDetails);
    $('#btnSave').click(saveRoleFull);

    $('#roleTable').on('click', '.btn-edit', function () {
        $('.field-error').text('').addClass('d-none');
        const rowData = rolesTable
            .row($(this).closest('tr'))
            .data();
        isConfigureFlow = false;   // 👈 important
        editRoleFromRow(rowData);
    });

    $('#roleTable').on('click', '.btn-configure', function () {
        const rowData = rolesTable
            .row($(this).closest('tr'))
            .data();
        isConfigureFlow = true;    // 👈 important
        configureRoleFromRow(rowData);
    });


    // Handle delete button click
    $('#roleTable').on('click', '.deleteBtn', function () {
        const roleId = parseInt($(this).attr('data-role-id'), 0);


        // Ask for confirmation using SweetAlert
        Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the role and its permissions!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {

                // Optional: Check if role is assigned to any user before deleting
                $.ajax({
                    url: `/roleMaster/checkAssigned`, // Your endpoint to check assignment
                    method: 'GET',
                    data: { roleId: roleId },
                    success: function (checkResponse) {
                        // checkResponse.assigned = true/false
                        if (checkResponse.assigned) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Cannot delete',
                                text: 'This role is assigned to one or more users.'
                            });
                            return;
                        }

                        // Proceed with deletion if not assigned
                        $.ajax({
                            url: '/roleMaster/Delete', // Your delete endpoint
                            method: 'GET',
                            data: { roleId: roleId },
                            success: function (deleteResponse) {

                                if (deleteResponse.success) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Deleted!',
                                        text: deleteResponse.message
                                    });
                                    rolesTable.ajax.reload(null, false);
                                    // Optionally, remove the row from table
                                    $('#roleTable').find(`tr[data-role-id="${roleId}"]`).remove();
                                }
                                else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Not Deleted!',
                                        text: deleteResponse.message,
                                    });
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
        });
    });




}

// Start create new role flow
function startCreateFlow() {
    $('.field-error').text('').addClass('d-none');
    $('#saveButtonText').text('Create Role');
    isCreateFlow = true;
    currentRoleId = null;
    currentRole = null;
    $('#roleName').val('');
    $('#rolePriority').val('');
    $('#roleStatus').prop('checked', true);
    $('#permissionsTableBody .perm').prop('checked', false);
    $('#saveButtonText').text('Create Role');
    $('#roleInfoHeader').addClass('d-none');
    $('#step1-indicator').removeClass('completed').addClass('active');
    $('#step2-indicator').removeClass('active completed');
    $('#step1').removeClass('d-none');
    $('#step2').addClass('d-none');
    $('#mainView').addClass('d-none');
    $('#roleFlow').removeClass('d-none');
    rolesTable.ajax.reload(null, false);
}


// Go to main view
function goToMainView() {
    isConfigureFlow = false;
    isCreateFlow = false;
    currentRole = null;
    currentRoleId = null;

    $('#mainView').removeClass('d-none');

    $('#roleFlow').addClass('d-none');
    rolesTable.ajax.reload(null, false);
    if (rolesTable) { rolesTable.clear(); rolesTable.rows.add(roles); rolesTable.draw(); }
}

// Next to permissions
function nextToPermissions() {
    const roleName = $('#roleName').val().trim();
    const rolePriority = $('#rolePriority').val().trim();
    const roleStatus = $('#roleStatus').is(':checked');

    let isValid = true;

    // ===== Validate Role Name =====
    if (!roleName) {
        /*$('#roleName').addClass('is-invalid');*/
        $('#lblRoleNameError').text('Role Name is required').removeClass('d-none');
        $('#roleName').focus();
        isValid = false;
    } else {
        //$('#roleName').removeClass('is-invalid');
        $('#lblRoleNameError').addClass('d-none');
    }

    // ===== Validate Priority =====
    if (!rolePriority) {
        /*$('#rolePriority').addClass('is-invalid');*/
        $('#lblPriorityError').text('Priority Level is required').removeClass('d-none');
        if (isValid) $('#rolePriority').focus(); // focus only if Role Name is valid
        isValid = false;
    } else {
        //$('#rolePriority').removeClass('is-invalid');
        $('#lblPriorityError').addClass('d-none');
    }

    // ===== Validate Active Role =====
    if (!roleStatus) {
        //$('#roleStatus').addClass('is-invalid');
        $('#lblactiveError').text('Role must be active').removeClass('d-none');
        if (isValid) $('#roleStatus').focus();
        isValid = false;
    } else {
        //$('#roleStatus').removeClass('is-invalid');
        $('#lblactiveError').addClass('d-none');
    }

    if (!isValid) return; // stop execution if validation failed

    let roleNameUpdate = null;
    let rolePriorityUpdate = null;
    if (!isConfigureFlow) {

        if (!$('#roleName').val().trim()) {
            alert('Role name is required');
            $('#roleName').focus();
            return;
        }
        roleNameUpdate = $('#roleName').val().trim();
        rolePriorityUpdate = parseInt($('#rolePriority').val()) || 0;
    }
    else {
        roleNameUpdate = currentRole.roleName;
        rolePriorityUpdate = currentRole.rolePriority;
    }
    const roleDto = {
        id: currentRoleId ?? 0,
        roleName: roleNameUpdate,
        rolePriority: rolePriorityUpdate,
        isActive: true,
        createdBy: 0, // current logged-in user
        formRolePermissions: []
    };

    $.ajax({
        url: '/roleMaster/checkedRoleDetails', // single endpoint
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(roleDto),
        success: function (res) {
            if (res.success == false) {
                
                if (res.errors.roleName)
                    $('#lblRoleNameError').text(res.errors.roleName).removeClass('d-none');
                if (res.errors.rolePriority)
                    $('#lblPriorityError').text(res.errors.rolePriority).removeClass('d-none');

                //$('#step1').removeClass('d-none');
                //$('#step2').addClass('d-none');

                //$('#step1-indicator').removeClass('completed').addClass('active');
                //$('#step2-indicator').removeClass('active completed');

                return;
            }
            else {
                if (!isCreateFlow && currentRole) {
                    $('#configRoleName').text($('#roleName').val());
                    $('#configRolePriority').text($('#rolePriority').val());
                    $('#configRoleStatus').text($('#roleStatus').is(':checked') ? 'Active' : 'Inactive');
                    $('#roleInfoHeader').removeClass('d-none');
                }
                $('#step1').addClass('d-none');
                $('#step2').removeClass('d-none');

                // ======= LOAD PERMISSIONS IF EDITING =======
                //if (!isCreateFlow && currentRole) {
                //    configureRoleFromRow(currentRole);
                //}
                // ✅ Only bind permissions when coming from EDIT → NEXT
                if (!isCreateFlow && !isConfigureFlow && currentRole) {
                    configureRoleFromRow(currentRole);
                }

                if (currentRole && currentRole.id) {
                    bindRoleModulePermissions(currentRole.id);
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

// Back to details
function backToDetails() {
    // 🔹 If coming from CONFIGURE → go back to MAIN VIEW
    if (isConfigureFlow) {
        goToMainView();
        return;
    }

    // 🔹 If it's CREATE flow → just switch steps without alert
    if (isCreateFlow) {
        $('#step1-indicator').removeClass('completed').addClass('active');
        $('#step2-indicator').removeClass('active');
        $('#step1').removeClass('d-none');
        $('#step2').addClass('d-none');
        return;
    }

    // 🔹 If not configure flow (i.e., creating/editing role)
    if (!isConfigureFlow) {
        // Show confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: "Going back will discard unsaved changes!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, go back',
            cancelButtonText: 'No, stay here',
        }).then((result) => {
            if (result.isConfirmed) {
                // ✅ User clicked YES → go back to Step 1
                $('#step1-indicator').removeClass('completed').addClass('active');
                $('#step2-indicator').removeClass('active');
                $('#step1').removeClass('d-none');
                $('#step2').addClass('d-none');

                // Restore previous role data if editing
                if (currentRole) {
                    $('#roleName').val(currentRole.roleName);
                    $('#rolePriority').val(currentRole.rolePriority);
                    $('#roleStatus').prop('checked', currentRole.isActive);
                } else {
                    // Clear fields if creating new role
                    $('#roleName').val('');
                    $('#rolePriority').val('');
                    $('#roleStatus').prop('checked', true);
                }
            } else {
                // ❌ User clicked NO → stay on Step 2, keep data intact
                return;
            }
        });

        return; // exit function
    }
} 

function saveRoleFull() {
    // ----- Validate at least one permission ----- 

    let roleNameUpdate = null;
    let rolePriorityUpdate = null;
    if (!isConfigureFlow) {

        if (!$('#roleName').val().trim()) {
            alert('Role name is required');
            $('#roleName').focus();
            return;
        }
        roleNameUpdate = $('#roleName').val().trim();
        rolePriorityUpdate = parseInt($('#rolePriority').val()) || 0;
    }
    else {
        roleNameUpdate = currentRole.roleName;
        rolePriorityUpdate = currentRole.rolePriority;
    }

    // ----- Collect selected permissions (ONE ROW PER ACTION) -----
    let moduleId = $('#moduleSelect').val()
        ? parseInt($('#moduleSelect').val(), 10)
        : 0;

    let moduleName = $('#moduleSelect option:selected').text().trim();

    const roleDto = {
        id: currentRoleId ?? 0,
        roleName: roleNameUpdate,
        moduleId: moduleId,
        rolePriority: rolePriorityUpdate,
        isActive: true,
        createdBy: 0, // current logged-in user
        formRolePermissions: []
    };

    

    $('#permissionsTableBody tr').each(function () {

        const $row = $(this);

        // ✅ row must be checked
        const isChecked =
            $row.find('.child-check').is(':checked') ||
            $row.find('.row-check').is(':checked');

        if (!isChecked) return;

        // ✅ form code
        const formCode = $row.data('module');
        if (!formCode) return;

        const formId = getFormIdByCode(formCode);
        const $select = $row.find('.perm-select');
        


        // ✅ loop selected permissions ONLY
        $select.find('option:selected').each(function () {

            const actionId = parseInt(this.value, 10);
            const actionName = $(this).text().trim(); // ✔ correct text

            roleDto.formRolePermissions.push({
                Id: 0,
                RoleId: roleDto.id,
                /*ModuleId: moduleId,*/
                FormId: formId,
                ActionId: actionId,
                PermissionKey: `${moduleName}_${formCode}_${actionName}`,
                CanView: isChecked,
                IsActive: true,
                CreatedBy: 0
            });
        });
    });

    // ----- AJAX -----
    let url = (!roleDto.id || roleDto.id === 0) ? '/roleMaster/SaveRoleDetails' : '/roleMaster/updateRoleDetails';
    
    $.ajax({
        url: url, // single endpoint
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(roleDto),
        success: function (res) {
            if (res.success) {
                notificationToastCustom('success', res.message, 'Success');
                rolesTable.ajax.reload(null, false);
                // Remove current tab session
               // sessionStorage.removeItem('menuData');

                // 🔥 Notify other tabs
                
                goToMainView();
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


function editRoleFromRow(role) {

    isCreateFlow = false;
    currentRoleId = role.id;
    currentRole = role;

    $('#roleName').val(role.roleName);
    $('#rolePriority').val(role.rolePriority);
    $('#roleStatus').prop('checked', role.isActive);

    $('#saveButtonText').text('Update Role');
    $('#roleInfoHeader').addClass('d-none');

    $('#step1-indicator').addClass('active').removeClass('completed');
    $('#step2-indicator').removeClass('active completed');

    $('#step1').removeClass('d-none');
    $('#step2').addClass('d-none');

    $('#mainView').addClass('d-none');
    $('#roleFlow').removeClass('d-none');
}

function configureRoleFromRow(role) {

    isCreateFlow = false;
    currentRoleId = role.id;
    currentRole = role;
    if (isCreateFlow && isConfigureFlow && currentRole) {


        /* ===== ROLE DETAILS ===== */
        $('#roleName').val(role.roleName);
        $('#rolePriority').val(role.rolePriority);
        $('#roleStatus').prop('checked', role.isActive);



        $('#saveButtonText').text('Create Role');
    }
    else {
        $('#configRoleName').text(currentRole.roleName);
        $('#configRolePriority').text(currentRole.rolePriority);
        $('#configRoleStatus').text(currentRole.isActive ? 'Active' : 'Inactive');


        $('#saveButtonText').text('Update Permissions');
    }

    $('#roleInfoHeader').removeClass('d-none');

    if (currentRole && currentRole.id) {
        bindRoleModulePermissions(currentRole.id);
    }


    /* ===== UI FLOW ===== */
    $('#step1-indicator').addClass('completed').removeClass('active');
    $('#step2-indicator').addClass('active');

    $('#step1').addClass('d-none');
    $('#step2').removeClass('d-none');

    $('#mainView').addClass('d-none');
    $('#roleFlow').removeClass('d-none');
}

function initPermissionSelect2() {
   
    $('.perm-select').each(function () {

        const $select = $(this);
        $select.empty();
       
        // 🔹 permissions attached to this form
        const permissions = $select.data('permissions') || [];

        permissions.forEach(p => {
            // p.id = 7, p.name = "View"
            $select.append(new Option(p.name, p.id, false, false));
        });

        // 🔹 Initialize Select2
        //$select.select2({
        //    placeholder: 'Select permissions',
        //    closeOnSelect: false,
        //    width: '100%'
        //});

        // Initialize Select2 ONCE
        $select.select2({
            placeholder: 'Select permissions',
            closeOnSelect: false,
            width: '100%',
            dropdownAutoWidth: true
        });
    });

    // 🔥 bind role + module permissions
    if (currentRole && currentRole.id) {
        bindRoleModulePermissions(currentRole.id);
    }

}

function bindRoleModulePermissions(roleId) {

    const moduleId = $('#moduleSelect').val()
        ? parseInt($('#moduleSelect').val(), 10)
        : 0;

    if (!roleId || !moduleId) return;

    $.ajax({
        url: '/roleMaster/GetRoleModulePermissions',
        type: 'GET',
        data: { roleId, moduleId },
        success: function (permissions) {
            resetPermissionsUI();       // 🔥 important
            applySavedPermissions(permissions);
        }
    });
}

function applySavedPermissions(savedPermissions) {
    console.log(savedPermissions);
    savedPermissions.forEach(p => {

        // find row by formId
        const $row = $('#permissionsTableBody tr').filter(function () {
            
            const formCode = $(this).data('module');
            console.log(formCode);
            return getFormIdByCode(formCode) === p.formId;
        });

        if (!$row.length) return;

        const $select = $row.find('.perm-select');

        let selectedValues = $select.val() || [];

        // add saved action
        selectedValues.push(p.actionId.toString());

        // unique values only
        selectedValues = [...new Set(selectedValues)];

        // 🔥 bind to select2
        $select.val(selectedValues).trigger('change');

        // check checkbox
        $row.find('.row-check, .child-check').prop('checked', true);
    });
}


function resetPermissionsUI() {
    // clear all select2 values
    $('.perm-select').each(function () {
        $(this).val([]).trigger('change');
    });

    // uncheck all checkboxes
    $('.row-check, .child-check').prop('checked', false);
}


function buildMenuGroups(data) {
    const parents = {};
    const parentNoSubs = [];

    data.forEach(item => {
        
        if (item.menuType === "parent") {
            parents[item.parentId] = { ...item, children: [] };
        }
        else if (item.menuType === "submenu") {
            if (parents[item.parentId]) {
                parents[item.parentId].children.push(item);
            }
        }
        else if (item.menuType === "parent-no-sub") {
            parentNoSubs.push(item);
        }
    });

    return {
        parents: Object.values(parents),
        parentNoSubs
    };
}



function can(permission) {
    return userPermissions.includes(permission) ||
        userPermissions.includes(permission.split('_')[0] + "_Full"); // handle full permission
}

