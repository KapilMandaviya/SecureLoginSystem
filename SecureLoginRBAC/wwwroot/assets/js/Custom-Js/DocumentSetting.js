$(document).ready(function () {

    loadDocuments();

    // ✅ LOAD DATA
    function loadDocuments() {
        $.ajax({
            url: "/DocumentConfigSetting/GetAll", // change to your API
            type: "GET",
            success: function (res) {
                console.log(res);
                window.canDelete =res.canDelete;
                res = res.data;
                let tbody = $("#docTable tbody");
                tbody.empty();

                if (res.length === 0) {
                    addNewRow();
                } else {
                    $.each(res, function (i, doc) {
                        // Render delete button only if user has permission
                        let deleteBtn = window.canDelete
                            ? `<button class="btn btn-sm btn-danger deleteRow">
                        <i class="fas fa-trash-alt"></i>
                   </button>`
                            : 'No Action'; // otherwise, leave empty


                        let row = `
                            <tr data-id="${doc.id}">
                                <td>
                                    <input type="text" class="form-control docName" value="${doc.documentName}">
                                </td>
                                <td class="text-center">
                                    <div class="form-check form-switch form-switch-lg d-flex justify-content-center">
                                        <input class="form-check-input isMandatory" type="checkbox" ${doc.isMandatory ? 'checked' : ''}>
                                    </div>
                                </td>
                                
                                <td class="text-center btnBorder" >
                                    ${deleteBtn}
                                </td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                }
            }
        });
    }

    // ✅ ADD ROW
    $("#btnAddRow").click(function () {
        removeEmptyRow();

        addNewRow();
    });

    $(document).on("input change", ".docName", function () {
        
        if ($(this).val().trim() !== "") {
            $(this).closest("tr").removeClass("error-border");
        }
    });

    // ✅ DELETE ROW WITH SWEET ALERT
    $(document).on("click", ".deleteRow", function () {
        let row = $(this).closest("tr");

        let id = row.data("id");
        


        // Check mandatory count
        let totalRows = $("#docTable tbody tr").length;

        if (totalRows <= 1) {
            Swal.fire({
                icon: "warning",
                title: "At least one document is required"
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this document",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it"
        }).then((result) => {
            if (result.isConfirmed) {

                
                // If exists in DB → delete API
                if (id != 0) {
                    $.ajax({
                        url: "/DocumentConfigSetting/Delete/" + id,
                        type: "GET",
                        success: function () {
                            if (res.success) {
                                notificationToastCustom('success', res.message, "Success");
                                row.remove();
                                checkEmpty();
                                loadDocuments();
                            }
                            else {
                                notificationToastCustom('error', res.message, "Error");
                            }
                             
                        }
                    });
                } else {
                    row.remove();
                    checkEmpty();
                }

                
            }
        });
    });

    // ✅ SAVE DATA
    $("#btnSave").click(function () {

        let documents = [];
        let emptyRow = 0;
        $("#docTable tbody tr").each(function () {

            let id = $(this).data("id");
            let name = $(this).find(".docName").val();
            let mandatory = $(this).find(".isMandatory").is(":checked");

            if (name.trim() !== "") {
                documents.push({
                    id: id,
                    documentName: name,
                    isMandatory: mandatory,
                    isActive: true,
                    createdBy: 0
                });
            }
            else {
                // Add red border to empty input
                $(this).addClass("error-border");
                emptyRow++;
                return;
            }
        });

        if (emptyRow > 0) {
            Swal.fire("Error", "Please remove blank row", "error");
            return;
        }
        if (documents.length === 0) {
            Swal.fire("Error", "Please add at least one document", "error");
            return;
        }
        

        $.ajax({
            url: '/DocumentConfigSetting/SaveOrUpdateDocumentSettingDetails',
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(documents),
            success: function (res) {
                
                if (res.result) {
                    notificationToastCustom('success', res.message, "Success");
                    loadDocuments();
                }
                else
                    notificationToastCustom('error', res.message, "Error");
                
            }
        });
    });

    //add new row
    function addNewRow() {

        let deleteBtn = window.canDelete
            ? `<button class="btn btn-sm btn-danger deleteRow">
                <i class="fas fa-trash-alt"></i>
           </button>`
            : 'No Action'; // otherwise, no button


        let newRow = `
            <tr data-id="0">
                <td>
                    <input type="text" class="form-control docName" placeholder="Enter document name">
                </td>
                <td class="text-center">
                    <div class="form-check form-switch form-switch-lg d-flex justify-content-center">
                        <input class="form-check-input isMandatory" type="checkbox">
                    </div>
                </td>
              <td class="text-center btnBorder">
                ${deleteBtn}
            </td>
            </tr>
        `;

        $("#docTable tbody").append(newRow);

    }

    // ✅ EMPTY STATE
    //function showEmptyRow() {
    //    let emptyRow = `
    //        <tr class="emptyRow">
    //            <td colspan="3" class="text-center text-muted">
    //                No document added
    //            </td>
    //        </tr>
    //    `;
    //    $("#docTable tbody").append(emptyRow);
    //}



    function removeEmptyRow() {
        $(".emptyRow").remove();
    }

    function checkEmpty() {
        if ($("#docTable tbody tr").length === 0) {
            addNewRow();
        }
    }

});