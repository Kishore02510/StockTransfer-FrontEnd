
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
    $("#tblTransfer").hide();
    funIssuingDetails();


});

function funIssuingDetails() {
    var i = 0;
    $.ajax({
        url: 'http://localhost:8081/requestdetails', // Spring Boot endpoint
        type: 'GET',
        success: function (response) {

            $.each(response, function (index, IssuingDetails) {
                i++;
                $('#tblIssuingDetails').append("<tr onclick='funLoadReqDetails()'><td class='text-class'>" + i + "</td><td class='text-class'>" + IssuingDetails.issuingofz + "</td><td class='text-class'>" + IssuingDetails.transferingToOfz + "</td><td>" +
                    IssuingDetails.transactiondatetime + "</td><td class='text-class'>" + IssuingDetails.remarks + "</td></tr>");
                $("#hdnFGTRId").val(IssuingDetails.finishedgoodstransferrequestid);
            });
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
}

function funLoadReqDetails() {

    $("#tblTransfer").show();
    $("#tblIssuingDetails").hide();

    var ajaxparamter = $("#frmFGT").serializeArray();
    // console.log(ajaxparamter);
    // let payload = {}
    $.ajax({
        url: 'http://localhost:8081/products/' + $("#hdnFGTRId").val(),
        type: 'GET',
        success: function (response) {
            $.each(response, function (index, IssuingDetails) {
                $("#txtIssuingOfz").val(IssuingDetails.issuingofz);
                $("#txtTransferToOfz").val(IssuingDetails.transferingToOfz);
            });

            funLoadReqProdDetails();

        },
        error: function (xhr, status, error) {
            // Handle errors from the AJAX request
            alert('Request failed: ' + error);
        }
    });

}

function funLoadReqProdDetails() {
    var i = 0;
    var balanceqty = 0;
    var ajaxparamter = $("#frmFGT").serializeArray();
    $.ajax({
        url: 'http://localhost:8081/productdetails/' + $("#hdnFGTRId").val(),
        type: 'GET',
        success: function (response) {

            $.each(response, function (index, ProdDetails) {
                i++;
                balanceqty = parseInt(ProdDetails.requestedqty) - parseInt(ProdDetails.receivedqty);
                $('#tblTransfer').append("<tr><td class='text-class'><input onclick='funChk("+ProdDetails.productid +")' type='checkbox' id='chkProd"+ProdDetails.productid+"'> " + i + "</td><td class='text-class'>" + ProdDetails.productname + "</td><td class='text-class'>" + ProdDetails.requestedqty + "</td><td>" 
                    + ProdDetails.receivedqty + "</td><td>"+balanceqty+"</td><td class='text-class'><input type='text' disabled id='txtTransQty"+ ProdDetails.productid +"'></td><td><input type='text' id='txtTotal"+ProdDetails.productid+"' ></td></tr>");
                //$("#hdnFGTRId").val(IssuingDetails.finishedgoodstransferrequestid);
            });
        },
        error: function (xhr, status, error) {
            // Handle errors from the AJAX request
            alert('Request failed: ' + error);
        }
    });

}

function funChk(argId) {
    if ($("#chkProd" + argId).prop('checked')) {
        $("#txtTransQty" + argId).attr("disabled", false);
        $("#txtTransQty" + argId).focus();
    } else {
        $("#txtTransQty" + argId).attr("disabled", true);
        $("#txtTransQty" + argId).val("");
    }
}

function funSave() {
    let products = [];
    $('.clsProdId:checked').each(function() {
        let pid = $(this).val();
        let qty = parseInt($("#txtTransQty" + pid).val());
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

    alert(JSON.stringify(payload))
    console.log("payload --> ", JSON.stringify(payload, null, 2));


    $.ajax({
        url: 'http://localhost:8081/savereqdetails',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(response) {
            alert(response.message);
        },
        error: function(xhr, status, error) {
            alert('Request failed: ' + error);
        }
    });
}