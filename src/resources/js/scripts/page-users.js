$(document).ready(function () {

  // variable declaration
  var usersTable;
  var usersDataArray = [];
  var datatableElement = $(".datatable");
  // datatable initialization
  if (datatableElement.length > 0) {
    usersTable = datatableElement.DataTable({
      responsive: true,
      'columnDefs': [{
        "orderable": false,
        // "targets": [0, 8, 9]
      }]
    });
  };
  // on click selected users data from table(page named page-list)
  // to store into local storage to get rendered on second page named page-view
  $(document).on("click", "#list-datatable tr", function () {
    $(this).find("td").each(function () {
      usersDataArray.push($(this).text().trim())
    })

    localStorage.setItem("usersId", usersDataArray[1]);
    localStorage.setItem("usersUsername", usersDataArray[2]);
    localStorage.setItem("usersName", usersDataArray[3]);
    localStorage.setItem("usersVerified", usersDataArray[5]);
    localStorage.setItem("usersRole", usersDataArray[6]);
    localStorage.setItem("usersStatus", usersDataArray[7]);
  })
  // render stored local storage data on page named page-view
  if (localStorage.usersId !== undefined) {
    // $(".view-id").html(localStorage.getItem("usersId"));
    // $(".view-username").html(localStorage.getItem("usersUsername"));
    // $(".view-name").html(localStorage.getItem("usersName"));
    // $(".view-verified").html(localStorage.getItem("usersVerified"));
    // $(".view-role").html(localStorage.getItem("usersRole"));
    // $(".view-status").html(localStorage.getItem("usersStatus"));
    // update badge color on status change
    // if ($(".view-status").text() === "Banned") {
    //   $(".view-status").toggleClass("badge-light-success badge-light-danger")
    // }
    // update badge color on status change
    // if ($(".view-status").text() === "Close") {
    //   $(".view-status").toggleClass("badge-light-success badge-light-warning")
    // }
  }
  // page users list verified filter
  $("#list-verified").on("change", function () {
    var usersVerifiedSelect = $(this).val();
    usersTable.search(usersVerifiedSelect).draw();
  });

  // page empl list verified filter
  // $("#employees-list-active").on("change", function () {
  //   var usersVerifiedSelect = $(this).val();
  //     console.log(usersVerifiedSelect)
  //   usersTable.search(usersVerifiedSelect).draw();
  // });
  // page users list role filter
  $("#list-role").on("change", function () {
    var usersRoleSelect = $("#list-role").val();
    // console.log(usersRoleSelect);
    usersTable.search(usersRoleSelect).draw();
  });
  // page users list status filter
  $("#list-status").on("change", function () {
    var usersStatusSelect = $("#list-status").val();
    // console.log(usersStatusSelect);
    usersTable.search(usersStatusSelect).draw();
  });
  // users language select
  if ($("#language-select2").length > 0) {
    $("#language-select2").select2({
      dropdownAutoWidth: true,
      width: '100%'
    });
  }
  // users music select
  if ($("#music-select2").length > 0) {
    $("#music-select2").select2({
      dropdownAutoWidth: true,
      width: '100%'
    });
  }
  // users movies select
  if ($("#movies-select2").length > 0) {
    $("#movies-select2").select2({
      dropdownAutoWidth: true,
      width: '100%'
    });
  }

  // Input, Select, Textarea validations except submit button validation initialization
  if ($(".edit").length > 0) {
    $("#accountForm, #infotabForm").validate({
      rules: {
        username: {
          required: true,
          minlength: 5
        },
        name: {
          required: true
        },
        email: {
          required: true
        },
        datepicker: {
          required: true
        },
        address: {
          required: true
        }
      },
      errorElement: 'div'
    });
    $("#infotabForm").validate({
      rules: {
        datepicker: {
          required: true
        },
        address: {
          required: true
        }
      },
      errorElement: 'div'
    });
  }
});
