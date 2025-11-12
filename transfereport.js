$(document).ready(function () {
    const today = new Date();

   const formattedDate = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

    $("#txtFromDate").datepicker({
        dateFormat: "dd-mm-yy",
        changeMonth: true,
        maxDate: 0,
        changeYear: true,
        showAnim: "fold",
        onSelect: function (selected) {
            // ✅ Convert to Date object
            const fromDate = $.datepicker.parseDate("dd-mm-yy", selected);
            $("#txtToDate").datepicker("option", "minDate", fromDate);
        }
    });

    $("#txtToDate").datepicker({
        dateFormat: "dd-mm-yy",
        changeMonth: true,
        maxDate: 0,
        changeYear: true,
        showAnim: "fold"
    });
    // $("#txtToDate").val(formattedDate);
    $("button").button().click(function (event) {
        event.preventDefault();
    });

    // $(".btRefresh").click(function () {
    //     document.location.reload(true);
    // });
});

function funIssuingDetails() {
    $("#tblGen").show();
    $("#tblDetail").hide();
    const fromDate = $("#txtFromDate").val();
    const toDate = $("#txtToDate").val();
    // alert(fromDate)
    // alert(toDate)
    if (!fromDate || !toDate) {
        alert("Please select both From Date and To Date.");
        return;
    }

    $.ajax({
        url: "http://localhost:8081/transferReport", // ✅ Update to your actual controller mapping
        type: "GET",
        data: {
            fromdate: fromDate  ,
            todate:toDate 
        },
        success: function(response) {
            console.log(response);
            const tbody = $("#tblTransferHeader tbody");
            tbody.empty();

            if (response.length === 0) {
                tbody.append("<tr><td colspan='7' class='text-center'>No data found</td></tr>");
                return;
            }

            $.each(response, function(index, transfer) {
                tbody.append(
                    `<tr>
                        <td>${index + 1}</td>
                        <td>${transfer.finishedgoodstransferrefno || '-'}</td>
                        <td>${transfer.transactionDate || '-'}</td>
                        <td>${transfer.issuingOffice || '-'}</td>
                        <td>${transfer.transferingOffice || '-'}</td>
                        <td>${transfer.remarks || '-'}</td>
                        <td>${transfer.status || '-'}</td>
                    </tr>`
                );
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching data:", error);
            alert("Failed to load request report!");
        }
    });
}
//    <td>${transfer.requestId || '-'}</td> 

function funProdDetails() {
    $("#tblDetail").show();
    $("#tblGen").hide();
    const fromDate = $("#txtFromDate").val();
    const toDate = $("#txtToDate").val();
    // alert(fromDate)
    // alert(toDate)
    if (!fromDate || !toDate) {
        alert("Please select both From Date and To Date.");
        return;
    }

    $.ajax({
        url: "http://localhost:8081/transferProdReport", // ✅ Update to your actual controller mapping
        type: "GET",
        data: {
            fromdate: fromDate  ,
            todate:toDate 
        },
        success: function(response) {
            console.log(response);
            const tbody = $("#tblTransferHeader tbody");
            tbody.empty();

            if (response.length === 0) {
                tbody.append("<tr><td colspan='7' class='text-center'>No data found</td></tr>");
                return;
            }

            $.each(response, function(index, transfer) {
                tbody.append(
                    `<tr>
                        <td>${index + 1}</td>
                        <td>${transfer.finishedgoodstransferrequestrefno}</td>
                        <td>${transfer.finishedgoodstransferrefno}</td>
                        <td>${transfer.transactionDate}</td>
                        <td>${transfer.productName }</td>
                        <td>${transfer.quantity}</td>
                        <td>${transfer.amountPerUnit}</td>
                        <td>${transfer.netTotalAmount}</td>
                        
                    </tr>`
                );
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching data:", error);
            alert("Failed to load request report!");
        }
    });
}