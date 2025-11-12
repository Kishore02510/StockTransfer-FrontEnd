
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
        url: 'http://localhost:8081/requestdetails',
        type: 'GET',
        success: function (response) {

            $.each(response, function (index, IssuingDetails) {
                i++;
                $('#tblIssuingDetails').append("<tr onclick='funLoadReqDetails(" + IssuingDetails.requestId + "," + IssuingDetails.receivingOfficeId + "," + IssuingDetails.requestingOfficeId + ")'><td class='text-class'>" + i + "</td><td>"+ IssuingDetails.finishedgoodstransferrequestrefno +"</td><td class='text-class'>" + IssuingDetails.receivingOfficeName + "</td><td class='text-class'>" + IssuingDetails.requestingOfficeName + "</td><td>" +
                    IssuingDetails.transactionDateTime + "</td><td class='text-class'>" + IssuingDetails.remarks + "<input type='hidden' id='hdnFGTRId" + IssuingDetails.requestId + "' name='hdnFGTRId" + IssuingDetails.requestId + "' value='" + IssuingDetails.requestId + "'> </td></tr>");
                // $("#hdnFGTRId").val(IssuingDetails.requestId);
            });
            // $("#hdnIssuingOfzId").val(IssuingDetails.receivingOfficeId);
            // $("#hdnTransferingOfzId").val(IssuingDetails.requestingOfficeId);
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
}

function funLoadReqDetails(argFGTRId, argRecOfzId, argReqOfzId) {

    $("#tblTransfer").show();
    $("#tblIssuingDetails").hide();
    $("#hdnIssuingOfzId").val(argRecOfzId);
    $("#hdnTransferingOfzId").val(argReqOfzId);
    var ajaxparamter = $("#frmFGT").serializeArray();
    // alert(argFGTRId)
    // console.log(ajaxparamter);
    // let payload = {}
    $.ajax({
        url: 'http://localhost:8081/products/' + argFGTRId,
        type: 'GET',
        success: function (response) {
            $.each(response, function (index, IssuingDetails) {
                $("#txtIssuingOfz").val(IssuingDetails.issuingofz);
                $("#txtTransferToOfz").val(IssuingDetails.transferingToOfz);
            });

            funLoadReqProdDetails(argFGTRId);

        },
        error: function (xhr, status, error) {
            // Handle errors from the AJAX request
            alert('Request failed: ' + error);
        }
    });

}

function funLoadReqProdDetails(argFGTRId) {
    var i = 0;
    var balanceqty = 0;
    var ajaxparamter = $("#frmFGT").serializeArray();
    $.ajax({
        url: 'http://localhost:8081/productdetails/' + argFGTRId,
        type: 'GET',
        success: function (response) {

            $.each(response, function (index, ProdDetails) {
                i++;
                let balanceqty = parseInt(ProdDetails.requestedqty) - parseInt(ProdDetails.receivedqty);                

                $('#tblTransfer').append(
                    "<tr>" +
                    "<td class='text-class'>" +
                    "<input onclick='funChk(" + ProdDetails.productid + ")' class='clsProdId' type='checkbox' id='chkProd" + ProdDetails.productid + "' value='" + ProdDetails.productid + "'> " + i +
                    "</td>" +
                    "<td class='text-class'>" + ProdDetails.productname + "</td>" +
                    "<td class='text-class' id='tdRequestedQty" + ProdDetails.productid + "'>" + ProdDetails.requestedqty + "</td>" +
                    "<td class='text-class' id='tdReceivedQty" + ProdDetails.productid + "'>" + ProdDetails.receivedqty + "</td>" +
                    "<td class='text-class'id='tdBalanceQty" + ProdDetails.productid + "' >" + balanceqty + "</td>" +
                    "<td class='text-class'><input type='text' disabled oninput='validateQty(" + ProdDetails.productid + ");funAmtCalc(" + ProdDetails.productid + ")'  id='txtTransQty" + ProdDetails.productid + "'></td>" +
                    "<td class='text-class'><input type='text' disabled id='txtPrice" + ProdDetails.productid + "' name='txtPrice" + ProdDetails.productid + "' value='" + ProdDetails.amountperunit + "'></td>" +
                    "<td class='text-class'><input readonly disabled type='text' id='txtTotal" + ProdDetails.productid + "' value=''></td>" +
                    "<input type='hidden' id='hdnFGTRid' value='" + argFGTRId + "'></tr>"
                );

                if(parseInt(balanceqty) == 0){
                    $('#chkProd'+ProdDetails.productid).prop('disabled', true);
                }
            });

            $('#tblTransfer').append("<tr><td colspan=9 class='text-center'><button type='button' id='btnSave' onclick='funSave()'>Save</button><button type='button' id='btnRefresh' onclick='funRefresh()'>Refresh</button></td></tr>");
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
        // $("#txtPrice" + argId).val("");
        $("#txtTotal" + argId).val("");
    }
}

function funSave() {
    let products = [];
    let finishedgoodstransferrequestid = 0;
    $('.clsProdId:checked').each(function () {
        let pid = $(this).val();
        let qty = parseInt($("#txtTransQty" + pid).val());
        let price = parseFloat($("#txtPrice" + pid).val());
        finishedgoodstransferrequestid = parseInt($("#hdnFGTRid").val());
        products.push({
            // issuingofzId:
            productid: pid,
            requestedQuantity: qty,
            amountperunit: price,

        });
    });

    let payload = {
        issuingofzid: $("#hdnIssuingOfzId").val(),
        transferingofzid: $("#hdnTransferingOfzId").val(),
        remarks: $("#txtRemarks").val(),
        finishedgoodstransferrequestid: finishedgoodstransferrequestid,
        //sendingemployeeid: 1,  example, get from session
        products: products
    };

    // console.log(products);

    $.ajax({
        url: 'http://localhost:8081/savetransferreqdetails',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (response) {
            alert(response.message);
            funRefresh();
        },
        error: function (xhr, status, error) {
            alert('Request failed: ' + error);
        }
    });
}

function funAmtCalc(argProdId) {

    var ReqQty = $("#txtTransQty" + argProdId).val();
    var AmtPerUnit = $("#txtPrice" + argProdId).val();

    var TotAmt = parseFloat(ReqQty) * parseFloat(AmtPerUnit);
    if (isNaN(TotAmt)) {
        TotAmt = "";
    }
    if (ReqQty == "") {
        $("#txtTotal" + argProdId).val("");
    }
    $("#txtTotal" + argProdId).val(TotAmt.toFixed(2));
}

function validateQty(argProdId) {
    // alert($("#tdReceivedQty"+argProdId).html());
    // alert($("#tdBalanceQty"+argProdId).html());
    // alert($("#tdRequestedQty"+argProdId).html())
    var quantity = (parseFloat($("#tdBalanceQty" + argProdId).html()) > 0.00) ? $("#tdBalanceQty" + argProdId).html() : $("#tdRequestedQty" + argProdId).html();
    var msg = (parseFloat($("#tdReceivedQty" + argProdId).html()) > 0.00) ? "Balance" : "Requested";
    if (parseFloat($("#txtTransQty" + argProdId).val()) > parseFloat(quantity)) {
        alert("Transfer quantity must be less than " + msg + " Quantity...");
        $("#txtTransQty" + argProdId).focus();
        $("#txtTransQty" + argProdId).val("");
        return false;
    }
}

function funRefresh() {
    window.location.reload();
}
