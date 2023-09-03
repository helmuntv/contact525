// Función para mostrar errores en el modal
function displayErrors(errors) {
  var errorList = $("#errorList");
  errorList.empty();
  $.each(errors, function (key, value) {
    errorList.append("<li>" + key + ": " + value + "</li>");
  });
  $("#errorModal").modal("show");
}

//Funcion para cargar los select de Gendertypes, Countries, States y Cities
function loadSelectData(selectId, url, placeholder, requestData) {
  $.ajax({
    url: url,
    method: "GET",
    data: requestData,
    dataType: "json",
    headers: { Accept: "application/json" },
    success: function (data) {
      var select = $("#" + selectId);
      select.empty();
      select.append('<option value="">' + placeholder + '</option>');
      $.each(data, function (key, value) {
        select.append('<option value="' + value.id + '">' + value.name + "</option>");
      });
    },
    error: function (xhr, status, error) {
      displayErrors(xhr.responseJSON);
    }
  });
}

$(document).ready(function () {
  $('#datepicker').datepicker({
    format: 'yyyy-mm-dd'
  });

  loadSelectData("gender", "/api/gendertypes/", "Género", "");
  loadSelectData("country", "/api/countries/", "País", "");


  $("#country").change(function () {
    var selectedCountry = $(this).val();
    if (selectedCountry) {
      $("#state").prop("disabled", false);
      loadSelectData("state", "/api/states/", "Departamento", { country_id: selectedCountry })
    } else {
      $("#state").prop("disabled", true);
      $("#city").prop("disabled", true);
    }
  });

  $("#state").change(function () {
    var selectedState = $(this).val();
    if (selectedState) {
      $("#city").prop("disabled", false);
      loadSelectData("city", "/api/cities/", "Ciudad", { state_id: selectedState });
    } else {
      $("#city").prop("disabled", true);
    }
  });

  $("form").submit(function (event) {
    event.preventDefault();

    var csrfToken = $("input[name='csrfmiddlewaretoken']").val();
    
    var formData = {
      gender: parseInt($("#gender").val()),
      birthdate: $("#birthdate").val(),
      first_name: $("#first_name").val(),
      last_name: $("#last_name").val(),
      email: $("#email").val(),
      address: $("#address").val(),
      housing_type: $("#housing_type").val(),
      country: parseInt($("#country").val()),
      state: parseInt($("#state").val()),
      city: parseInt($("#city").val()),
      comment: $("#comment").val()
    };

    $.ajax({
      url: "/api/contacts/",
      method: "POST",
      data: JSON.stringify(formData),
      headers: { Accept: "application/json", "X-CSRFToken": csrfToken, "Content-Type": "application/json" },
      success: function (response) {
        $("#successModal").modal("show");

        $("form")[0].reset();
        $("#state").prop("disabled", true);
        $("#city").prop("disabled", true);
      },
      error: function (xhr, status, error) {
        displayErrors(xhr.responseJSON);
      }
    });
  });
});