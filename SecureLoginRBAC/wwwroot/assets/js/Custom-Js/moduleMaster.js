const ICON_SIZE_CLASS = 'fa-2x';
let table = null;
let tempModules = [];
 
$(document).ready(function () {
    $('#moduleSelect').val(0);
    $('#moduleSelect').on('change', function () {
        bindParentModules(0);
    });

    // 🔥 LOAD ACTION MASTER + CLEAR SELECTION
    loadActionsMaster(true);
    $('#moduleCode').on('keydown', function (e) {
        if (e.key === ' ') {
            e.preventDefault();
        }
    });

     
    // Initialize Select2
    $('#stateSelect').select2({
        tags: true,
        /*selectOnClose: true,*/
        placeholder: "Select or type",
        width: '100%',
        createTag: function (params) {
            let term = $.trim(params.term);

            if (term === '') return null;

            return {
                id: `new:${term}`,    
                text: term,
                isNew: true
            };
        }
    });


   

    $('#stateSelect').on('select2:clear select2:unselect', function () {
        if (!$(this).val() || $(this).val().length === 0) {
            $(this).val(null).trigger('change');
        }
    });


 



    loadModules();
    showTable();

    //Load role when the tab is clicked
    $('button[data-bs-target="#tabFormMaster"]').on('shown.bs.tab', function () {
        /* =========================================================
          INIT
          ========================================================= */
        //location.reload();
        loadModules();
        showTable();

    });

    $(document).on('click', '.toggle', function (e) {
        e.stopPropagation(); // prevent drag
        let $submenu = $(this).closest('.menu-item').find('.submenu-list');
        $submenu.toggleClass('collapsed');
        $(this).toggleClass('collapsed');
    });

    $("#saveMenuPriority").click(function () {

        saveMenuOrder();
    });

    // Load role priority when the tab is clicked
    $('button[data-bs-target="#tabFormPriority"]').on('shown.bs.tab', function () {
        loadMenuPriority();
    });




    $('.text-danger.small').addClass('d-none').text('');
    /* =========================================================
       DATATABLE
       ========================================================= */
    table = $('#FormDatatable').DataTable({
        data: [],
        responsive: true,
        autoWidth: false,
        pageLength: 10,
        destroy: true,
        columnDefs: [
            { width: "3%", targets: 0 },   // Sr No
            { width: "14%", targets: 1 },   // Form Name
            { width: "15%", targets: 2 },   // Form Code
            { width: "4%", targets: 3 },   // Icon
            { width: "13%", targets: 4 },   // Controller
            { width: "13%", targets: 5 },   // Action
            { width: "14%", targets: 6 },   // Menu Type
            { width: "3%", targets: 7 },   // Menu Order
            { width: "4%", targets: 8 },   // Is Menu
            { width: "10%", targets: 9 },   // Parent
            { width: "4%", targets: 10, orderable: false } // Actions
        ],
        columns: [
            {
                data: null,
                render: (d, t, r, m) => m.row + 1
            },
            { data: 'formName' },
            { data: 'moduleName' },
            // 🔹 ICON COLUMN
            {
                data: 'formIcon',
                className: 'text-center',
                render: d =>
                    d
                        ? `<i class="${d} ${ICON_SIZE_CLASS} text-primary"></i>`
                        : '-'
            },

            {
                data: 'controllerName',
                render: function (d, t, r) {
                    // Show '-' if null
                    return d ? d : '-';
                }
            },
            {
                data: 'actionName',
                render: function (d, t, r) {
                    return d ? d : '-';
                }
            },
            {
                data: 'menuType',
                render: d => {
                    if (d === 'parent') return 'Parent (with submenu)';
                    if (d === 'parent-no-sub') return 'Parent (no submenu)';
                    if (d === 'submenu') return 'Submenu';
                    return '-';
                }
            },
            { data: 'menuOrder' },
            {
                data: 'isMenu',
                render: d =>
                    `<span class="badge ${d ? 'bg-info' : 'bg-secondary'}">
                        ${d ? 'Yes' : 'No'}
                     </span>`
            },
            {
                data: 'parentId',
                render: d => getParentName(d)
            },

            {
                data: null,
                render: () =>


                    `
                     <li class="list-inline-item dropdown">
                <a class="text-muted dropdown-toggle px-2"  href="#"
                   role="button"  data-bs-toggle="dropdown" aria-haspopup="true"
                   aria-expanded="false"> <i class="uil uil-ellipsis-h"></i>
                </a>

                <div class="dropdown-menu dropdown-menu-end">


                    <button class="btn-sm dropdown-item text-secondary editBtn">
                        <i class="fas fa-edit me-2"></i> Edit
                    </button>

                    <button class="btn-sm  dropdown-item viewBtn text-primary">
                        <i class="fas fa-eye me-2"></i> View
                    </button>

                    <button class="btn-sm text-danger dropdown-item deleteBtn">
                        <i class="fas fa-trash me-2"></i> Delete
                    </button>
                </div>
            </li>

                     `
            }
        ]
    });

    /* =========================================================
       EVENTS
       ========================================================= */

    $('.form-control, .form-select').on('input change', function () {
        $(this).next('.text-danger').addClass('d-none').text('');
    });

    $('.form-control, .form-select').on('input change', function () {

        let rawValue = $(this).val();
        let value = '';

        // Handle Select2 / multi-select (array)
        if (Array.isArray(rawValue)) {
            value = rawValue.length ? rawValue.join(',') : '';
        }
        // Handle normal inputs
        else {
            value = String(rawValue || '').trim();
        }

        const $error = $(this).next('.text-danger');

        if (value === '') {
            let fieldName = $(this).prev('label').text().trim();

            $error
                .removeClass('d-none')
                .text(fieldName + ' is required');
        } else {
            $error
                .addClass('d-none')
                .text('');
        }
    });




    // ADD
    $('#addBtn').on('click', function () {
        clearForm();
        $('#stateSelect').val(null).trigger('change'); // 🔥 important
        $('#isMenu').prop('checked', false);
        setMenuType('parent');   // default
        $('#moduleSelect').val(0);
        showForm(false);
    });


    // EDIT
    $('#FormDatatable').on('click', '.editBtn', function () {
        const data = table.row($(this).closest('tr')).data();
        if (!data) return;


        getModuleById(data.id)


    });


    $('#isMenu').on('change', function () {
        applyMenuUIState($(this).is(':checked'));
    });


    // VIEW
    $('#FormDatatable').on('click', '.viewBtn', function () {
        const d = table.row($(this).closest('tr')).data();

        $('#v_moduleName').text(d.formName);
        $('#v_moduleCode').text(d.moduleName);
        $('#v_moduleIcon').html(
            d.formIcon
                ? `<i class="${d.formIcon} fa-lg me-2 text-primary"></i>${d.formIcon}`
                : '-'
        );


        $('#v_controller').text(d.controllerName || '-');
        $('#v_action').text(d.actionName || '-');
        //$('#v_menuOrder').text(d.menuOrder);
        $('#v_parent').text(getParentName(d.parentId));

        $('#v_isMenu').text(d.isMenu ? 'Yes' : 'No');

        new bootstrap.Modal('#viewModuleModal').show();
    });

    // DELETE
    $('#FormDatatable').on('click', '.deleteBtn', function () {
        const data = table.row($(this).closest('tr')).data();
        if (!data) return;

        // 🔴 BLOCK DELETE if parent has sub menus
        if (data.menuType === 'parent' && hasSubMenus(data.id)) {
            showWarning('This parent menu has sub menus. Please delete sub menus first.');
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteModule(data.id);
            }
        });
    });

    // SAVE
    $('#btnSave').on('click', function () {
        if (!validateForm()) return;
        const actionPayLoad = getActionPayload();
        const menuType = $('#menuTypeToggle .btn.active').data('type'); // 'parent', 'submenu', 'parent-no-sub'
        


        const data = {
            id: $('#moduleId').val() ? parseInt($('#moduleId').val()) : 0,
            // 👇 selected module id
            moduleId: $('#moduleSelect').val()
                ? parseInt($('#moduleSelect').val())
                : 0,
            formName: $('#moduleName').val().trim(),
            formCode: $('#moduleCode').val().trim(),
            formIcon: $('#moduleIcon').val().trim(),
            //menuOrder: parseInt($('#menuOrder').val()) || 1,
            controllerName: $('#controllerName').val().trim(),
            actionName: $('#actionName').val().trim(),

            parentId: $('#parentId').val() || null,
            isMenu: menuType !== 'submenu',
            menuType: menuType,
            isActive: true,

            // 👇 important part
            actionPayLoad: actionPayLoad
        };

        saveModule(data);
    });

    // CANCEL
    $('#btnCancel').on('click', function () {
        clearForm();
        showTable();
    });


    // ICON LIVE PREVIEW
    $('#moduleIcon').on('input', function () {
        const icon = $(this).val().trim();
        $('#iconPreview').attr(
            'class',
            icon ? `${icon} ${ICON_SIZE_CLASS} text-primary ms-2` : ''
        );
    });

    $('#menuTypeToggle').on('click', '.btn', function () {
        setMenuType($(this).data('type'));
    });

});


function updatePriority() {
    $('#menuSortable > .menu-item').each(function (i) {
        $(this).find('.menu-row .priority').text(i + 1);

        $(this).find('.submenu-item').each(function (j) {
            $(this).find('.priority').text(j + 1);
        });
    });
}


function getParentName(parentId) {

    if (!parentId) return '-';
    const parent = tempModules.find(x => x.parentId == parentId);
    return parent ? parent.formName : '-';
}

function hasChildren(moduleId) {
    return tempModules.some(x => x.id == moduleId);
}

function isSubMenu(moduleId) {
    const m = tempModules.find(x => x.id == moduleId);
    return m && m.parentId !== null;
}

function setMenuType(currentType) {
    $('.text-danger.small').addClass('d-none').text('');
    const moduleId = $('#moduleId').val()
        ? parseInt($('#moduleId').val())
        : 0;

    if (moduleId > 0) {

        const current = tempModules.find(x => x.id == moduleId);
        const type = current?.menuType;
        const parentTypeId = current.parentId || '';
        const hasChildren = tempModules.some(x => x.parentId === moduleId);


        /* ---------------------------------------------------
            RULE 1: Parent with children cannot convert
         --------------------------------------------------- */
        if (type === 'parent' && hasChildren && currentType !== 'parent') {
            showWarning('Parent menu with sub menus cannot be converted. Remove sub menus first.');

            //alert('Parent menu with sub menus cannot be converted. Remove sub menus first.');
            revertUI(type);
            return;
        }

        /* =====================================================
       RULE 2: Parent-No-Sub → Parent ❌
                Parent-No-Sub → Submenu ✅
    ====================================================== */
        if (type === 'parent-no-sub' && currentType === 'parent') {
            showWarning('Parent Menu (No Sub) cannot be converted to Parent Menu.');

            //alert('Parent Menu (No Sub) cannot be converted to Parent Menu.');
            revertUI(type);
            return;
        }

        if (type === 'parent-no-sub' && currentType === 'submenu') {

            if (parentTypeId) {
                $('#parentId').val(parentTypeId);

            }
            // Parent must be selected before save
            $('#parentId').prop('required', true).show();
        }
        if (currentType == "submenu") {

            if (parentTypeId) {
                $('#parentId').val(parentTypeId);

            }
            $('#parentId').prop('required', true).show();
        }

        /* =====================================================
       RULE 3: Submenu → Parent ❌
                Submenu → Parent-No-Sub ✅
    ====================================================== */
        if (type === 'submenu' && currentType === 'parent') {
            //alert('Sub Menu cannot be converted to Parent Menu.');
            showWarning('Sub Menu cannot be converted to Parent Menu.');


            revertUI(type);
            return;
        }

        if (type === 'submenu' && currentType === 'parent-no-sub') {
            // Clear & hide parent
            $('#parentId').val('').hide().prop('required', false);
        }

    }

    // ✅ If Submenu → Parent-No-Sub, clear parent
    if (currentType === 'parent-no-sub') {
        $('#parentId').val('');
    }

    // ✅ Apply UI
    $('#menuTypeToggle .btn').removeClass('active');
    $(`#menuTypeToggle .btn[data-type="${currentType}"]`).addClass('active');

    $('#isMenu').val(currentType !== 'submenu');
    applyMenuUIState(currentType);
}

/* ================= HELPERS ================= */

function revertUI(type) {
    $('#menuTypeToggle .btn').removeClass('active');
    $(`#menuTypeToggle .btn[data-type="${type}"]`).addClass('active');
}


function setMenuTypeOnEdit(type) {
    // Set active button
    $('#menuTypeToggle .btn').removeClass('active');
    $(`#menuTypeToggle .btn[data-type="${type}"]`).addClass('active');

    // Set hidden values
    $('#isMenu').val(type !== 'submenu');

    // Parent logic
    if (type === 'parent-no-sub') {
        $('#parentId').val('');
    }

    // Apply UI state
    applyMenuUIState(type);
}



function applyMenuUIState(type) {
    const $subMenuFields = $('.ui-submenu-only'); // Controller & Action
    const $parentDropdown = $('.ui-parent-only'); // Parent dropdown only

    if (type === 'parent') {
        // Parent Menu with submenus → controller/action disabled
        $subMenuFields.find('input').val('').prop('disabled', true);
        $subMenuFields.hide();
        $parentDropdown.hide();
    }
    else if (type === 'parent-no-sub') {
        // Parent Menu no sub → controller/action enabled, no parent dropdown
        $subMenuFields.find('input').prop('disabled', false);
        $subMenuFields.show();
        $parentDropdown.hide();
    }
    else {
        // Sub Menu → show all fields
        $subMenuFields.find('input').prop('disabled', false);
        $subMenuFields.show();
        $parentDropdown.show();
        $('#parentId').prop('disabled', false);
    }
}

/* =========================================================
      LOAD & BIND
      ========================================================= */

//function bindParentModules() {
//    const ddl = $('#parentId');
//    ddl.empty().append('<option value="">-- None --</option>');

//    tempModules
//        .filter(x => x.parentId !== null && x.menuType=="parent")
//        .forEach(m => {
//            ddl.append(`<option value="${m.parentId}">${m.formName}</option>`);
//        });
//}

function bindParentModules(excludeId = 0) {

    const selectedModuleId = $('#moduleSelect').val()
        ? parseInt($('#moduleSelect').val())
        : 0;

    if (!selectedModuleId) return;
    const ddl = $('#parentId');
    ddl.empty().append('<option value="">-- Select Parent --</option>');
    var data = tempModules
        .filter(x =>
            x.menuType === 'parent' &&
            x.parentId !== null &&
            x.id !== excludeId
        );

    //tempModules
    //    .filter(x =>
    //        x.menuType === 'parent' &&
    //        x.parentId !== null &&
    //        x.id !== excludeId
    //    )
    //    .forEach(m => {

    //        ddl.append(`<option value="${m.parentId}">${m.formName}</option>`);
    //    });


    tempModules
        .filter(x =>
            x.menuType === 'parent' &&          // only parent menus
            x.parentId !== null &&
            x.moduleId === selectedModuleId && // ✅ filter by module
            x.id !== excludeId                 // exclude self (edit mode)
        )
        .forEach(m => {
            ddl.append(`<option value="${m.parentId}">${m.formName}</option>`);
        });
}


function loadModules() {
    $.ajax({
        url: '/FormMaster/GetAll',
        type: 'GET',
        dataType: 'json',
        success: function (res) {
            
            tempModules = res.data;

            table.clear().rows.add(tempModules).draw();
            // Handle permissions
            if (!res.canEdit) $('.editBtn').hide();
            if (!res.canDelete) $('.deleteBtn').hide();
            bindParentModules(0);
        },
        error: function (xhr) {
            notificationToastCustom('error', 'Failed to load modules', 'Error');
            console.error(xhr.responseText);
        }
    });
}


/* =========================================================
   SHOW / HIDE
   ========================================================= */
function showTable() {
    $('#tableSection').removeClass('d-none');
    $('#formSection').addClass('d-none');
    setTimeout(() => table.columns.adjust().responsive.recalc(), 100);
}

function showForm(edit = false) {
    $('#tableSection').addClass('d-none');
    $('#formSection').removeClass('d-none');
    if (!edit) {
        $('#moduleCode').css('background-color', '');

        $('#moduleCode').prop("disabled", false)

        $('#moduleSelect').attr('disabled', false);
        $('#moduleSelect').css('background-color', '');
    }
    $('#formTitle').text(edit ? 'Edit Form' : 'Create Form');
}

function clearForm() {
    $('.text-danger.small').addClass('d-none').text('');
    $('#moduleId').val('');
    $('#moduleName,#moduleCode,#controllerName,#actionName,#moduleIcon').val('');
    //$('#menuOrder').val(1);
    $('#parentId').val('');
    $('#iconPreview').attr('class', '');
    $('.field-error').addClass('d-none');
}



/* =========================================================
     VALIDATION
========================================================= */

function validateForm() {
    
    let isValid = true;
    $('.text-danger.small').addClass('d-none').text('');

    const moduleId = $('#moduleId').val() ? parseInt($('#moduleId').val()) : 0;
    const menuType = $('#menuTypeToggle .btn.active').data('type');

    const moduleName = $('#moduleName').val().trim();
    const moduleCode = $('#moduleCode').val().trim();
    const moduleIcon = $('#moduleIcon').val().trim();
    const controller = $('#controllerName').val().trim();
    const action = $('#actionName').val().trim();
    const parentId = $('#parentId').val() || null;
    // 👇 selected module id
    const ismoduleId = $('#moduleSelect').val()
        ? parseInt($('#moduleSelect').val())
        : 0;

    
    const actionPayLoad = getActionPayload();
    

    /* ================= REQUIRED ================= */
    if (!moduleName) {
        $('#lblModuleNameError').text('Form name is required').removeClass('d-none');
        isValid = false;
    }



    if (!moduleCode) {
        $('#lblModuleCodeError').text('Form code is required').removeClass('d-none');
        isValid = false;
    }


    if (!moduleIcon) {
        $('#lblModuleIconError').text('Form Icon is required').removeClass('d-none');
        isValid = false;
    }

    /* ================= MENU TYPE RULES ================= */

    // 🔸 SUB MENU
    if (menuType === 'submenu') {

        if (parentId == '' || parentId ==null) {
            //alert('Parent module is required for Sub Menu');
            //showWarning('Parent module is required for Sub Menu');
            $('#lblparentId').text('Parent Form is required for Sub Menu').removeClass('d-none');
            isValid = false;
        }

        if (!actionPayLoad || actionPayLoad.length === 0) {
            $('#lblActionSelectError').text('Please create or select at least one action before saving.').removeClass('d-none');;
            isValid = false;
        }

        if (!controller) {
            //showWarning('Controller and Action are required for Sub Menu');
            $('#lblcontrollerNameError').text('Controller name required for Sub Menu').removeClass('d-none');
            isValid = false;
        }

        if (!action) {
            $('#lblactionNameError').text('Action name required for Sub Menu').removeClass('d-none');
            isValid = false;
        }
    }

    // 🔸 PARENT WITH SUB
    if (menuType === 'parent') {

        if (controller) {
            //showWarning('Controller and Action are required for Sub Menu');
            $('#lblcontrollerNameError').text('Controller  must be empty for parent menu').removeClass('d-none');
            isValid = false;
        }

        if (action) {
            $('#lblactionNameError').text('Action must be empty for Parent Menu').removeClass('d-none');
            isValid = false;
        }

    }

    // 🔸 PARENT NO SUB
    if (menuType === 'parent-no-sub') {

        if (parentId != null) {
            showWarning("This module does'nt have parent menu. Remove them first.");

            return false;
        }
        if (!controller) {
            //showWarning('Controller and Action are required for Sub Menu');
            $('#lblcontrollerNameError').text('Controller name required for Parent Menu (No Sub)').removeClass('d-none');
            isValid = false;
        }

        if (!action) {
            $('#lblactionNameError').text('Action name required for Parent Menu (No Sub)').removeClass('d-none');
            isValid = false;
        }

        if (!actionPayLoad || actionPayLoad.length === 0) {
            $('#lblActionSelectError').text('Please create or select at least one action before saving.').removeClass('d-none');;
            isValid = false;
        }
    }

    if (ismoduleId == 0 || ismoduleId < 0) {
        $('#lblmoduleSelect').text('Module is required').removeClass('d-none');
        isValid = false;
    }
    return isValid;
}

/* =========================================================
       SAVE (CREATE / UPDATE)
       ========================================================= */
function saveModule(data) {

    let url = (!data.id || data.id === 0) ? '/FormMaster/SaveFormMasterDetails' : '/FormMaster/updateFormMasterDetails';

    
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (res) {
            console.log(res);
            if (res.success) {
                notificationToastCustom('success', res.message, 'Success');
                loadModules();
                showTable();
                clearForm();
            } else {
                if (res.errors.formCode)
                    $('#lblModuleCodeError').text(res.errors.formCode).removeClass('d-none');

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


//function getModuleById(id) {
//    $.ajax({
//        url: '/FormMaster/GetById',
//        type: 'GET',
//        data: { id },
//        success: function (data) {
//            $('#moduleId').val(data.id);
//            $('#moduleName').val(data.formName);
//            $('#moduleCode').val(data.formCode);
//            $('#controllerName').val(data.controllerName);
//            $('#actionName').val(data.actionName);
//            $('#moduleIcon').val(data.formIcon);
//            //$('#parentId').val(data.parentId);

//            $('#iconPreview').attr(
//                'class',
//                data.moduleIcon ? `${data.moduleIcon} ${ICON_SIZE_CLASS} text-primary` : ''

//            );

//            setMenuTypeOnEdit(data.menuType); // ✅ IMPORTANT
//            bindParentModules(data.id);
//            $('#parentId').val(data.parentId);

//            showForm(true);
//        },
//        error: function () {
//            notificationToastCustom('error', 'Failed to load module', 'Error');
//        }
//    });
//}

function getModuleById(id) {
    $.ajax({
        url: '/FormMaster/GetById',
        type: 'GET',
        data: { id: id },
        dataType: 'json',
        success: function (data) {
            $('#moduleCode').css('background-color', '#eee');

            $('#moduleCode').prop("disabled",true)
            /* ================= BASIC FIELDS ================= */
            $('#moduleId').val(data.id);
            $('#moduleName').val(data.formName);
            $('#moduleCode').val(data.formCode);
            $('#controllerName').val(data.controllerName || '');
            $('#actionName').val(data.actionName || '');
            $('#moduleIcon').val(data.formIcon || '');
            $('#moduleSelect').attr('disabled', true);
            $('#moduleSelect').css('background-color', '#eee');
            $('#moduleSelect').val(data.moduleId);
            
            /* ================= ICON PREVIEW ================= */
            $('#iconPreview').attr(
                'class',
                data.formIcon
                    ? `${data.formIcon} ${ICON_SIZE_CLASS} text-primary`
                    : ''
            );

            /* ================= MENU TYPE ================= */
            setMenuTypeOnEdit(data.menuType);

            /* ================= PARENT DROPDOWN ================= */
            bindParentModules(data.id);
            $('#parentId').val(data.parentId || '');

            /* ================= ACTION SELECT2 ================= */
            // Reload master actions first
            loadActionsMaster(data.actionList);

           

            /* ================= SHOW FORM ================= */
            showForm(true);
        },
        error: function () {
            notificationToastCustom('error', 'Failed to load module', 'Error');
        }
    });
}



function setSelectedActions(actions) {
    const ids = actions.map(a => a.id.toString());
    $('#stateSelect').val(ids).trigger('change');
}


/* =========================================================
DELETE
========================================================= */


function deleteModule(id) {
    $.ajax({
        url: '/FormMaster/Delete',
        type: 'GET',
        data: { id },
        success: function (res) {
            if (res.success) {
                notificationToastCustom('success', res.message, 'Success');
                loadModules();
            } else {
                notificationToastCustom('error', res.message, 'Error');
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
function hasSubMenus(moduleId) {
    return tempModules.some(x => x.parentId == moduleId);
}


function showWarning(message) {
    Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: message,
        confirmButtonColor: '#3085d6'
    });
}

function loadMenuPriority() {
    $.ajax({
        url: '/FormMaster/GetMenuPriority',
        type: 'GET',
        dataType: 'json',
        success: function (menus) {

            bindMenu(menus);
        },
        error: function () {
            alert('Failed to load menus!');
        }
    });
}

function bindMenu(menus) {
    let html = '';

    $.each(menus, function (i, menu) {
        let hasChildren = menu.children && menu.children.length > 0;

        html += `
        <li class="menu-item" data-id="${menu.menuId}" data-parentid="${menu.parentId}">
            <div class="menu-row">
                <span class="priority parentPriority">${i + 1}</span>
                <span class="handle">☰</span>

                <span class="title formNameParent">${menu.formName}</span>

                ${hasChildren ? `<span class="toggle"><i class="fas fa-chevron-down"></i></span>` : ''}
            </div>`;

        if (hasChildren) {
            html += `<ul class="submenu-list">`;

            $.each(menu.children, function (j, child) {
                html += `
                <li class="submenu-item" data-id="${child.menuId}">
                    <span class="priority childPriority">${j + 1}</span>
                    <span class="handle">☰</span>
                    <span class="title formNameChild">${child.formName}</span>
                </li>`;
            });

            html += `</ul>`;
        }

        html += `</li>`;
    });

    $('#menuSortable').html(html);

    // 🔥 Rebind sortable after menu generation
    initSortable();
}


function initSortable() {

    /* =======================
       PARENT MENU SORTABLE
       ======================= */
    $("#menuSortable").sortable({
        items: "> li.menu-item",
        handle: ".menu-row",   // entire parent row draggable
        cancel: ".toggle",     // prevent collapse icon drag
        tolerance: "pointer",
        update: updatePriority
    });

    /* =======================
       SUB MENU SORTABLE
       ======================= */
    $("#menuSortable .submenu-list").each(function () {

        // destroy old instance if exists
        if ($(this).hasClass("ui-sortable")) {
            $(this).sortable("destroy");
        }

        $(this).sortable({
            items: "> li.submenu-item",
            tolerance: "pointer",   // 👈 KEY
            update: updatePriority

        });

    });
}

function saveMenuOrder() {

    let orderData = [];

    // Parent menus
    $('.menu-item').each(function () {
        let parentId = $(this).data('id');             // FormId of parent
        let parentFormName = $(this).find('.formNameParent').text().trim();
        let parentOrder = parseInt($(this).find('.parentPriority').text()); // read from HTML


        // Parent order = 0 (or whatever your system requires)
        orderData.push({
            FormId: parentId,
            FormName: parentFormName,
            ParentId: parentOrder,  // ✅ use actual ParentId
            MenuOrder: 0
        });

        // Sub menus
        $(this).find('.submenu-item').each(function (j) {
            let subId = $(this).data('id');
            let childFormName = $(this).find('.formNameChild').text().trim();
            let childOrder = parseInt($(this).find('.childPriority').text()); // read from badge


            // Submenu order = j + 1
            orderData.push({
                FormId: subId,
                FormName: childFormName,
                ParentId: parentOrder,  // ✅ child links to parent's ParentId
                MenuOrder: childOrder
            });
        });
    });



    $.ajax({
        url: '/FormMaster/SaveMenuOrder',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function (response) {
            if (response.success == true) {
                notificationToastCustom('success', response.message, 'Success')
                //sessionStorage.removeItem('menuData');
                
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

}
function getActionPayload() {
    let actions = [];

    $('#stateSelect option:selected').each(function () {
        const value = $(this).val();
        const text = $(this).text();

        // Make name uppercase here so backend always gets uppercase
        const nameUpper = text.trim().toUpperCase();

        if ($.isNumeric(value)) {
            actions.push({
                id: parseInt(value),
                name: nameUpper
            });
        } else {
            actions.push({
                id: 0, // use 0 for new actions
                name: nameUpper
            });
        }
    });

    return actions; // single array now
}


function loadActionsMaster(actionList) {
    $.ajax({
        url: '/FormMaster/getAllOption',
        type: 'GET',
        dataType: 'json',
        success: function (res) {

            const $select = $('#stateSelect');
            $select.empty();

            res.data.forEach(action => {
                $select.append(new Option(action.name, action.id, false, false));
            });

            // ✅ Bind selected values AFTER options exist
            if (actionList && typeof actionList === 'string') {
                const selectedIds = actionList
                    .split(',')
                    .map(x => x.trim())
                    .filter(Boolean);

                $select.val(selectedIds).trigger('change');
            } else {
                $select.val(null).trigger('change');
            }
        },
        error: function () {
            console.error('Failed to load actions');
        }
    });
}

