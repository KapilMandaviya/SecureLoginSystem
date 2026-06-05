let degreeTable;

let universities = [
     
];
 
let degreeList = [];

$(document).ready(function () {

    loadAllDegrees(); // ✅ only ONE API call


    $('#addBtn').click(function () {

        clearForm();

        $('#formTitle').text('Create Degree');

        let offcanvas = new bootstrap.Offcanvas('#degreeSidebar');
        offcanvas.show();
    });

    //SaveOrUpdateUniversityDegreeMapping
    $("#btnSaveMapping").click(function () {

        let result = [];

        $(".degree-select").each(function () {

            let universityId = $(this).data("uni-id");
            let selectedDegrees = $(this).val();

            let mappingIds = $(this).attr("data-mapping-ids");
            let academicYearId = $(this).attr("data-academic-year-id");

            result.push({
                id: mappingIds ? parseInt(mappingIds.split(',')[0]) : 0, // take first or handle properly
                academicYearId: academicYearId ? parseInt(academicYearId) : $('#AcademicYearId').val(),
                universityId: universityId,
                degreeId: selectedDegrees ? selectedDegrees.join(",") : null,
                isActive: true,
                createdBy: 1
            });
        });

        console.log(result);

        $.ajax({
            url: '/DegreeMaster/SaveOrUpdateUniversityDegreeMapping',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(result),
            success: function (res) {
                if (res.success) {
                    notificationToastCustom('success', res.message, "Success");
                } else {
                    notificationToastCustom('error', res.message, "Error");
                }
            }
        });
    });

    $(document).on("change", ".degree-select", function () {
        updateDegreeOptions();
    });

    $('#btnSave').click(function () {

        let isValid = true;

        // Clear errors
        $('.text-danger').addClass('d-none');

        if (!$('#Degree').val()) {
            $('#degreeError').text('Degree name is required').removeClass('d-none');
            isValid = false;
        }

        if (!$('#DegreeCode').val()) {
            $('#codeError').text('Code is required').removeClass('d-none');
            isValid = false;
        }

        if (!$('#DegreeType').val()) {
            $('#typeError').text('Type is required').removeClass('d-none');
            isValid = false;
        }

        if (!isValid) return;

        let dto = {
            DegreeId: $('#DegreeId').val() || 0,
            Degree: $('#Degree').val(),
            DegreeCode: $('#DegreeCode').val(),
            DegreeType: $('#DegreeType').val()
        };

        let url = dto.DegreeId == 0
            ? '/DegreeMaster/SaveDegreeMasterDetails'
            : '/DegreeMaster/updateDegreeMasterDetails';

        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(dto),
            success: function (res) {

                if (res.success) {
                    notificationToastCustom('success', res.message, "Success");
                    degreeTable.ajax.reload();

                     
                    // Close sidebar
                    bootstrap.Offcanvas.getInstance(document.getElementById('degreeSidebar')).hide();

                } else {
                    if (res.errors) {
                        if (res.errors.name)
                            $('#degreeError').text(res.errors.name).removeClass('d-none');
                        if (res.errors.type)
                            $('#typeError').text(res.errors.type).removeClass('d-none');

                    } else {
                        notificationToastCustom('error', res.message, "Error");
                    }
                }


            }
        });
    });

    $('#btnCancel').click(function () {
        $('#formSection').addClass('d-none');
        $('#tableSection').removeClass('d-none');
    });

   

});

function clearForm() {
    $('#DegreeId').val('');
    $('#Degree').val('');
    $('#DegreeCode').val('');
    $('#DegreeType').val('');
    $('.text-danger').addClass('d-none');
}
function updateDegreeOptions() {
    let selectedValues = [];

    // Collect all selected degrees
    $(".degree-select").each(function () {
        let val = $(this).val();
        if (val) {
            selectedValues = selectedValues.concat(val);
        }
    });

    // Loop again to update each dropdown
    $(".degree-select").each(function () {
        let currentSelect = $(this);
        let currentValues = currentSelect.val() || [];

        currentSelect.find("option").each(function () {
            let optionValue = $(this).val();

            // If selected in another dropdown → disable
            if (
                selectedValues.includes(optionValue) &&
                !currentValues.includes(optionValue)
            ) {
                $(this).prop("disabled", true);
            } else {
                $(this).prop("disabled", false);
            }
        });

        // Refresh Select2
        currentSelect.trigger("change.select2");
    });
}

function loadDegreeMappingTable() {
    let tbody = $("#degreeMappedTableBody");
    tbody.empty();
    
    let degreeOptions = degreeList.map(d =>
        `<option value="${d.degreeId}">${d.degree}</option>`
    ).join("");

    universities.forEach((uni, index) => {
    
        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${uni.uniName}</td>
                <td>
                    <select class="form-control degree-select" multiple data-uni-id="${uni.id}">
                        ${degreeOptions}
                    </select>
                </td>
            </tr>
        `;
        tbody.append(row);
    });

    $(".degree-select").select2({
        placeholder: "Mapped Degree",
        width: '100%'
    });

    updateDegreeOptions();
}

function loadAllDegrees() {
    $.ajax({
        url: '/DegreeMaster/GetAll',
        type: 'GET',
        success: function (res) {

            degreeList = res.data; // store full data
            universities = res.university;
            console.log(res.mappingDetails);
            loadDataTable();              // use same data
            loadDegreeMappingTable();     // use same data

            // ✅ bind mapping AFTER dropdown render
            bindMappings(res.mappingDetails);
        }
    });
}

function bindMappings(mappings) {

    if (!mappings || mappings.length === 0) return;

    let grouped = {};

    mappings.forEach(m => {

        if (!grouped[m.universityId]) {
            grouped[m.universityId] = {
                degreeIds: [],
                mappingIds: [],
                academicYearId: m.academicYearId
            };
        }

        grouped[m.universityId].degreeIds.push(m.degreeId.toString());
        grouped[m.universityId].mappingIds.push(m.id);
    });

    $(".degree-select").each(function () {

        let uniId = $(this).data("uni-id");

        if (grouped[uniId]) {

            // ✅ Set selected degrees
            $(this).val(grouped[uniId].degreeIds).trigger("change");

            // ✅ Store extra data in DOM
            $(this).attr("data-mapping-ids", grouped[uniId].mappingIds.join(","));
            $(this).attr("data-academic-year-id", grouped[uniId].academicYearId);
        }
    });

    updateDegreeOptions();
}

function edit(id) {
    $.ajax({
        url: '/DegreeMaster/GetById?id=' + id,
        type: 'GET',
        success: function (data) {

            $('#DegreeId').val(data.degreeId);
            $('#Degree').val(data.degree);
            $('#DegreeCode').val(data.degreeCode);
            $('#DegreeType').val(data.degreeType);

            $('#formTitle').text('Edit Degree');

            let offcanvas = new bootstrap.Offcanvas('#degreeSidebar');
            offcanvas.show();
        }
    });
}

function deleteDegree(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {

        if (result.isConfirmed) {


            $.ajax({
                url: '/DegreeMaster/Delete?id=' + id,
                type: 'GET',
                success: function (res) {
                    if (res.success) {
                        notificationToastCustom('success', res.message, "Success");
                        degreeTable.ajax.reload();
                    }
                    else {
                        notificationToastCustom('error', res.message, "Error");
                    }

                }
            });
        }
    });
}

function loadDataTable() {

    if (degreeTable) {
        degreeTable.clear().rows.add(degreeList).draw();
        return;
    }

    degreeTable = $('#degreeTable').DataTable({
        data: degreeList, // ✅ use local data
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: 'degree' },
            { data: 'degreeCode' },
            { data: 'degreeType' },
            {
                data: 'degreeId',
                render: function (data) {
                    return `
                        <button class="btn btn-sm btn-info" onclick="edit(${data})"><i class="fas fa-pen"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteDegree(${data})"><i class="fas fa-trash-alt"></i></button>
                    `;
                },
                orderable: false
            }
        ]
    });
}