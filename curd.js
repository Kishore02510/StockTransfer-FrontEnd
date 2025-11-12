$(document).ready(function () {
    $("button").button().click(function (event) {
        event.preventDefault();
    });

    const today = new Date();

    // Format as yyyy-mm-dd
    const formattedDate = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

    // Set it into the input
    $('#txtReqDate').val(formattedDate);
    funLoadOffices();
    funLoadRequestingOffices();
    //funLoadEmp();
    funLoadProd();
});

function funLoadOffices() {
    $.ajax({
        url: 'http://localhost:8081/getoffices', // Spring Boot endpoint
        type: 'GET',
        success: function (response) {
            // Empty the select element
            // $('#itemSelect').empty();

            // // Add default option
            // $('#itemSelect').append('<option value="">-- Select an Item --</option>');

            // Loop through the response data and append options
            $.each(response, function (index, item) {
                $('#txtRequestingOffice').append('<option value="' + item.officeid + '">' + item.officename + '</option>');
            });
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
}

function funLoadRequestingOffices() {
    $.ajax({
        url: 'http://localhost:8081/getoffices', // Spring Boot endpoint
        type: 'GET',
        success: function (response) {
            // Empty the select element
            // $('#itemSelect').empty();

            // // Add default option
            // $('#itemSelect').append('<option value="">-- Select an Item --</option>');

            // Loop through the response data and append options
            $.each(response, function (index, item) {
                $('#txtRequestReceivingOffice').append('<option value="' + item.officeid + '">' + item.officename + '</option>');
            });
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
}

function funLoadEmp() {
    $.ajax({
        url: 'http://localhost:8081/getemployeedetails', // Spring Boot endpoint
        type: 'GET',
        success: function (response) {
            // Empty the select element
            // $('#txtRequestReceivingOffice').empty();

            // // Add default option
            // $('#itemSelect').append('<option value="">-- Select an Item --</option>');

            // Loop through the response data and append options
            $.each(response, function (index, item) {
                $('#txtRequestReceivingOffice').append('<option value="' + item.empid + '">' + item.empname + '</option>');
            });
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
}


$(".btnsave").click(function () {
    event.preventDefault(); // ⛔ Prevent default form submission
    var ajaxparamter = $("#frmUserInfo").serializeArray();
    console.log(ajaxparamter);
    let payload = {};

    // Convert serialized array to a JSON object
    ajaxparamter.forEach(function (field) {
        payload[field.name] = field.value;
    });
    console.log(payload);
    $.ajax({
        url: 'http://localhost:8080/insert',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (response) {
            // if (response.status == "success") {
            //     alert(response.message);  // or you can use any other method to show the message
            // } else {
            //     alert('Error: ' + response.message);
            // }
            alert(response);
        },
        error: function (xhr, status, error) {
            // Handle errors from the AJAX request
            alert('Request failed: ' + error);
        }
    });
});

function funLoadProd() {
    var i = 0;
    // e.preventDefault(); // Always prevent default behavior

    $.ajax({
        url: 'http://localhost:8081/getProducts',
        method: 'GET',
        success: function (response) {
            // console.log("Response:", response);
            $("#tblView tbody").empty(); // Clear old rows
            response.forEach(function (finishedgoods) {
                i++;
                $("#tblView tbody").append(
                    "<tr onclick='funClick(\"" + finishedgoods.productname + "\", \"" + finishedgoods.sellingpriceperunit + "\", \"" + finishedgoods.productid + "\")'>" +
                    "<td><input class='form-check-input clsProdId' type='checkbox' value='" + finishedgoods.productid + "' id='chkProd" + finishedgoods.productid + "' onclick='funChk(" + finishedgoods.productid + ")'> " + i + " </td>" +
                    "<td class='text-center'>" + finishedgoods.productname + "</td>" +
                    "<td><input type='text' class='form-control text-end' id='txtprice" + finishedgoods.productid + "' value='" + finishedgoods.sellingpriceperunit + "' readonly ></td>" +
                    "<td><input disabled type='text' class='form-control text-end' id='txtRequestedQty" + finishedgoods.productid + "' name='txtRequestedQty" + finishedgoods.productid + "' ></td>" +
                    "</tr>"
                );
            });
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
            alert("Error fetching data: " + error);
        }
    });
}

function funChk(argId) {
    if ($("#chkProd" + argId).prop('checked')) {
        $("#txtRequestedQty" + argId).attr("disabled", false);
        $("#txtRequestedQty" + argId).focus();
    } else {
        $("#txtRequestedQty" + argId).attr("disabled", true);
        $("#txtRequestedQty" + argId).val("");
    }
}





function funSave() {

    let products = [];
    $('.clsProdId:checked').each(function() {
        let pid = $(this).val();
        let qty = parseInt($("#txtRequestedQty" + pid).val());
        let price = parseFloat($("#txtprice" + pid).val());
        products.push({
            productid: pid,
            requestedQuantity: qty,
            amountperunit: price
        });
    });

    let payload = {
        requestingofficeid: $("#txtRequestingOffice").val(),
        receivingofficeid: $("#txtRequestReceivingOffice").val(),
        remarks: $("#txtRemarks").val(),
        //sendingemployeeid: 1,  example, get from session
        products: products
    };

    // alert(JSON.stringify(payload))
    // console.log("payload --> ", JSON.stringify(payload, null, 2));


    $.ajax({
        url: 'http://localhost:8081/savereqdetails',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(response) {
            alert(response.message);
            funRefresh();
        },
        error: function(xhr, status, error) {
            alert('Request failed: ' + error);
        }
    });
}

function funRefresh(){
    window.location.reload();
}

// });

