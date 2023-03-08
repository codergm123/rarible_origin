import {symbol} from "prop-types";

$(document).ready(function () {
  $(document).on('click', '.view-notification', function () {
    $.ajax({
      url: "/notifications",
      type: "get",
      dataType: "script",
      data: {}
    })
  })

  $(document).on('click', '.dark-theme-slider', function () {
    lightSelected = $(this).hasClass('lightTheme');
    document.getElementById('themeChange').setAttribute('href', lightSelected ? 'dark' : '');
  });

  $(document).on('click', '.copyUserAddress', function () {
    var copyText = document.getElementById("userAddress");
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
    toastr.success('Copied successfully.')
  });

  $(document).on("click", ".dashboard-load-more", function (e) {
    $.ajax({
      url: "/category_filter",
      type: "get",
      dataType: "script",
      data: {page_no: $(this).data("page-no"), category: $(this).data("category"), sort_by: $(this).data("sort-by")}
    })
  });

  $(window).scroll(function() {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
      $(".dashboard-load-more").click()
      $(".user-load-more").click()
    }
  });

  $(".scrollbar-activity").scroll(function() {
    if ($(".scrollbar-activity").scrollTop() > $(".overall-activities").height() - $(".scrollbar-activity").height()) {
      $(".common-activity-load-more").click()
    }

  })

  $(document).on("click", ".user-load-more", function (e) {
    $.ajax({
      url: "/users/load_tabs",
      type: "get",
      dataType: "script",
      data: {id: $(this).data("id"), page_no: $(this).data("page-no"), tab: $(this).data("tab")}
    })
  });

  $(document).on("click", ".common-activity-load-more", function (e) {
    $.ajax({
      url: "/load_more_activities",
      type: "get",
      dataType: "script",
      data: {id: $(this).data("id"), page_no: $(this).data("page-no"), tab: $(this).data("tab")}
    })
  });

  $(document).on("click", ".dashboard-sort-by", function(e) {
    e.preventDefault()
    var dataParam = {}
    if ($(".top-filter li.active a").data("name")) {
      dataParam["category"] = $(".top-filter li.active a").data("name")
    }

    if ($(this).data("name")) {
      dataParam["sort_by"] = $(this).data("name")
    }

    $.ajax({
      url: "/category_filter",
      type: "get",
      dataType: "script",
      data: dataParam
    })
  })
});
