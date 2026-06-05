
$(document).ready(function () {

    // Static Data
    let dashboardData = {
        totalRegistered: 2456,
        totalRegisteredChange: "+12.5%",
        totalPaid: 1834,
        totalPaidChange: "+8.3%",
        formProgress: 422,
        formProgressChange: "-5.2%",
        docsPending: 298,
        docsPendingChange: "-3.1%",
        submitted: 1536,
        submittedChange: "+10.2%",
        verified: 1234,
        verifiedChange: "+7.8%",
        approved: 1089,
        approvedChange: "+6.5%",
        rejected: 145,
        rejectedChange: "+2.1%"
    };

    // Function to format numbers
    function formatNumber(num) {
        return num.toLocaleString();
    }

    // Bind values
    $("#totalRegistered").text(formatNumber(dashboardData.totalRegistered));
    $("#totalRegisteredChange").text(dashboardData.totalRegisteredChange);

    $("#totalPaid").text(formatNumber(dashboardData.totalPaid));
    $("#totalPaidChange").text(dashboardData.totalPaidChange);

    $("#formProgress").text(formatNumber(dashboardData.formProgress));
    $("#formProgressChange").text(dashboardData.formProgressChange);

    $("#docsPending").text(formatNumber(dashboardData.docsPending));
    $("#docsPendingChange").text(dashboardData.docsPendingChange);

    $("#submitted").text(formatNumber(dashboardData.submitted));
    $("#submittedChange").text(dashboardData.submittedChange);

    $("#verified").text(formatNumber(dashboardData.verified));
    $("#verifiedChange").text(dashboardData.verifiedChange);

    $("#approved").text(formatNumber(dashboardData.approved));
    $("#approvedChange").text(dashboardData.approvedChange);

    $("#rejected").text(formatNumber(dashboardData.rejected));
    $("#rejectedChange").text(dashboardData.rejectedChange);

});