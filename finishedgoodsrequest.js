$(document).ready(function () {
    funIssuingDetails();
    $("button").button().click(function (event) {
        event.preventDefault();
    });
});


function funIssuingDetails() {
    var i = 0;
    $.ajax({
        url: 'http://localhost:8081/getReqDetailsForApproval', 
        type: 'GET',
        success: function (response) {
            $.each(response, function (index, IssuingDetails) {
                i++;
                $('#tblDetails').append("<tr><td class='text-class'>" + i + "</td><td>" + IssuingDetails.finishedgoodstransferrequestrefno + "</td><td class='text-class'>" + IssuingDetails.requestingOffice + "</td><td class='text-class'>" + IssuingDetails.receivingOffice + "</td><td>" +
                    IssuingDetails.requestDate + "</td><td class='text-class'>" + IssuingDetails.remarks + "<input type='hidden' id='hdnFGTRId"+ IssuingDetails.finishedGoodsTransferRequestId+"' name='hdnFGTRId"+IssuingDetails.finishedGoodsTransferRequestId +"' value='"+IssuingDetails.finishedGoodsTransferRequestId+"'> </td>"
                    +"<td><button type='button' id='btnApprove' onclick='funApporRej(1,"+ IssuingDetails.finishedGoodsTransferRequestId  +")'>Approve</button>"
                    +"<button type='button' id='btnReject' onclick='funApporRej(9,"+IssuingDetails.finishedGoodsTransferRequestId+")' >Reject</button>"
                    +"<button data-bs-toggle='modal' data-bs-target='#staticBackdrop' type='button' id='btnView' onclick='funViewProducts(0,"+ IssuingDetails.finishedGoodsTransferRequestId +")'>View Products</button></td></tr>");
            });
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });
}

function funRefresh(){
    window.location.reload();
}

function funApporRej(argStatus,argFGTRIds){
    console.log(argStatus,argFGTRIds)
    var ajaxparamter =[];
    ajaxparamter.push({name:'requestid',value:argFGTRIds});
    ajaxparamter.push({name:'argStatus',value:argStatus});
    console.log(ajaxparamter)
   $.ajax({
        url: 'http://localhost:8081/getReqDetailsForApproval',
        method: 'PUT',
        //contentType: 'application/json',
        data: ajaxparamter,
        success: function (response) {
            alert(response);
            funRefresh();
        },
        error: function (xhr, status, error) {
            alert('Request failed: ' + error);
        }
    });

    
}

function funViewProducts(argStatus,argFGTRIds){
    // var ajaxparamter = [];
    // ajaxparamter.push({name:'id',value:argFGTRIds});
 var i = 0;
    $.ajax({
        url: 'http://localhost:8081/getReqProdDetailsForApproval/'+argFGTRIds, 
        type: 'GET',
        // data:ajaxparamter,
        success: function (response) {

            $.each(response, function (index, IssuingDetails) {
                i++;
                $('#tblProDetails').append("<tr><td class='text-class'>" + i + "</td><td class='text-class'>" + IssuingDetails.productname + "</td><td class='text-class'>" + IssuingDetails.requestedqty + "</td><td>" +
                    IssuingDetails.amountperunit + "</td><td class='text-class'>" + IssuingDetails.totalamount + "<input type='hidden' id='hdnFGTRId"+ IssuingDetails.finishedGoodsTransferRequestId+"' name='hdnFGTRId"+IssuingDetails.finishedGoodsTransferRequestId +"' value='"+IssuingDetails.finishedGoodsTransferRequestId+"'> </td></tr>");
            });
            
        },
        error: function (error) {
            console.log('Error:', error);
        }
    });

}


