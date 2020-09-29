$(document).ready(function () {

    setTimeout(function () {
        //$("#Save").click();
    }, 250);
    $("#Send").on("click", function () {
        console.log("Call");
        PostPaymentData();
    })
});

var PostPaymentData = function () {
    var Reservation = new Object();
    Reservation.rental_location_id = "123";
    Reservation.return_location_id = "http://localhost:64750/";
    Reservation.pickup_date_time = "12/02/2017 12:10";
    Reservation.pickup_date = "12/02/2017";
    Reservation.pickup_time = "12:33"

    var viewModelData = new Object();
    viewModelData.reservation = Reservation;

    var ajaxURl = '/aezmobiletest/pay/Index';
    $.ajax({
        url: ajaxURl,
        type: 'POST',
        async: true,
        data: JSON.stringify({ 'viewModelData': viewModelData, 'command': 'AutoSave' }),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log("Call for recorded", data);
            $("#RenderPage").html(data);
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}