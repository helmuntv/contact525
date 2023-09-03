// Función para mostrar errores en el modal
function displayErrors(errors) {
  var errorList = $("#errorList");
  errorList.empty();
  $.each(errors, function (key, value) {
    errorList.append("<li>" + key + ": " + value + "</li>");
  });
  $("#errorModal").modal("show");
}

function loadSelectData(selectId, url, placeholder, requestData) {
  $.ajax({
    url: url,
    method: "GET",
    data: requestData, // Aquí se agregan los datos adicionales
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
    // Obtén el valor seleccionado del país
    var selectedCountry = $(this).val();
    if (selectedCountry) {
      $("#state").prop("disabled", false);
      // Realiza una solicitud AJAX para obtener los estados por país
      loadSelectData("state", "/api/states/", "Departamento", { country_id: selectedCountry })
    } else {
      $("#state").prop("disabled", true);
      $("#city").prop("disabled", true);
    }
  });

  // Cuando cambia la selección del estado
  $("#state").change(function () {
    // Obtén el valor seleccionado del estado
    var selectedState = $(this).val();

    if (selectedState) {
      $("#city").prop("disabled", false);
      // Realiza una solicitud AJAX para obtener las ciudades por estado
      loadSelectData("city", "/api/cities/", "Ciudad", { state_id: selectedState });
    } else {
      $("#city").prop("disabled", true);
    }
  });

  // Escucha el evento submit del formulario
  $("form").submit(function (event) {
    event.preventDefault(); // Evita que el formulario se envíe normalmente

    var csrfToken = $("input[name='csrfmiddlewaretoken']").val();
    // Captura los valores de los campos del formulario
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

    // Realiza una solicitud AJAX POST con los datos recopilados
    $.ajax({
      url: "/api/contacts/",
      method: "POST",
      data: JSON.stringify(formData),
      headers: { Accept: "application/json", "X-CSRFToken": csrfToken, "Content-Type": "application/json" },
      success: function (response) {
        // Maneja la respuesta del servidor si es necesario
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