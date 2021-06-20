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

$("#totalDeposit").sparkline(totalDepositChart, {
    type: "bar",
    barColor: "#F6CAFD",
    height: "25",
    width: "100%",
    barWidth: "7",
    barSpacing: 7
});

$('.select2-size-sm').select2({
    dropdownAutoWidth: true,
    width: '100%',
    containerCssClass: 'select-sm'
});
