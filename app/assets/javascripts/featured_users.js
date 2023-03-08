$(document).ready(function() {
  $(document).on("click", ".show-selected-user", function() {
    if ($("#user_id").val() !== "") {
      var url = "/admin/featured_users/" + $("#user_id").val()

      $.ajax({
        url: url,
        type: "get",
        dataType: "script",
        data: {}
      })
    } else {
      toastr.error('Search user should not be blank.')
    }

  })

  $(document).on("click", ".featured-user-remove", function() {
    var totalCount = parseInt($(".users-total-count").data("count"));
    var dataId = $(this).data("id")
    var filteredIds = $(".custom-user-id-input").val().split(",").filter(function(x) { return x.toString() !== dataId.toString() })
    $(this).closest(".featured-user-entry").remove()
    $(".custom-user-id-input").val(filteredIds.join(","))
    totalCount += 1
    $(".users-total-count").data("count", totalCount)
    $(".users-total-count").text('Only Left '+totalCount)
  })
})