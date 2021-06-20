$(document).ready(function () {
    $('select').select2({
        // dropdownAutoWidth: true,
        // width: '100%',
        // containerCssClass: 'select-sm'
    });
});

$("#wallet").sparkline(walletChart, {
    type: "bar",
    barColor: "#F6CAFD",
    height: "25",
    width: "100%",
    barWidth: "7",
    barSpacing: 7

});

$("#totalDirect").sparkline(totalDirectChart, {
    type: "bar",
    barColor: "#F6CAFD",
    height: "25",
    width: "100%",
    barWidth: "7",
    barSpacing: 7
});
$("#totalApp").sparkline(totalAppChart, {
    type: "bar",
    barColor: "#F6CAFD",
    height: "25",
    width: "100%",
    barWidth: "7",
    barSpacing: 7
});

$("#totalDeposit").sparkline(totalDepositChart, {
    type: "bar",
    barColor: "#f6cafd",
    height: "25",
    width: "100%",
    barWidth: "7",
    barSpacing: 7
});


