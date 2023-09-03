// Función para mostrar errores en el modal
function displayErrors(errors) {
    var errorList = $("#errorList");
    errorList.empty();
    $.each(errors, function (key, value) {
        errorList.append("<li>" + key + ": " + value + "</li>");
    });
    $("#errorModal").modal("show");
}

function getGenderTypes(genderId) {
    $.ajax({
        url: "/api/gendertypes",
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            // Llenar el selector 'gender' con las opciones
            var genderSelector = $("#gender");
            genderSelector.empty(); // Limpiar opciones actuales
            $.each(data, function (index, gender) {
                genderSelector.append(new Option(gender.name, gender.id));
            });
            $("#gender").val(genderId);
        },
        error: function (xhr, status, error) {
            displayErrors(xhr.responseJSON);
        }
    });
}

function getCountries(countryId) {
    $.ajax({
        url: "/api/countries",
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            // Llenar el selector 'country' con las opciones
            var countrySelector = $("#country");
            countrySelector.empty(); // Limpiar opciones actuales
            $.each(data, function (index, country) {
                countrySelector.append(new Option(country.name, country.id));
            });
            $("#country").val(countryId);
        },
        error: function (xhr, status, error) {
            displayErrors(xhr.responseJSON);
        }
    });
}

function getStates(countryId, stateId) {
    $.ajax({
        url: "/api/states?country_id=" + countryId,
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            // Llenar el selector 'state' con las opciones
            var stateSelector = $("#state");
            stateSelector.empty();
            $.each(data, function (index, state) {
                stateSelector.append(new Option(state.name, state.id));
            });

            $("#state").val(stateId);
        },
        error: function (xhr, status, error) {
            displayErrors(xhr.responseJSON);
        }
    });
}

function getCities(stateId, cityId) {
    $.ajax({
        url: "/api/cities?state_id=" + stateId,
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            // Llenar el selector 'city' con las opciones
            var citySelector = $("#city");
            citySelector.empty(); // Limpiar opciones actuales
            $.each(data, function (index, city) {
                citySelector.append(new Option(city.name, city.id));
            });
            $("#city").val(cityId);
        },
        error: function (xhr, status, error) {
            displayErrors(xhr.responseJSON);
        }
    });
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

    // Realiza una solicitud AJAX para obtener los detalles del contacto
    $.ajax({
        url: "/api/contacts/" + contactId,
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            // Aquí puedes manejar los datos del contacto y mostrarlos en tu página
            $("#state").prop("disabled", false);
            $("#city").prop("disabled", false);

            getGenderTypes(data.gender.id);
            getCountries(data.country.id);
            getStates(data.country.id, data.state.id);
            getCities(data.state.id, data.city.id);

            // Resto de los campos
            $("#birthdate").val(data.birthdate);
            $("#first_name").val(data.first_name);
            $("#last_name").val(data.last_name);
            $("#email").val(data.email);
            $("#address").val(data.address);
            $("#housing_type").val(data.housing_type);
            $("#comment").val(data.comment);
        },
        error: function (xhr, status, error) {
            displayErrors(xhr.responseJSON);
        }
    });

    $("#country").change(function () {
        // Obtén el valor seleccionado del país
        var selectedCountry = $(this).val();

        if (selectedCountry) {
            $("#state").prop("disabled", false);
            // Realiza una solicitud AJAX para obtener los estados por país
            loadSelectData("state", "/api/states/", "Departamento", { country_id: selectedCountry });
            $("#city").prop("disabled", true);
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
            url: "/api/contacts/" + contactId + "/",
            method: "PUT",
            data: JSON.stringify(formData),
            headers: { Accept: "application/json", "X-CSRFToken": csrfToken, "Content-Type": "application/json" },
            success: function (response) {
                // Maneja la respuesta del servidor si es necesario
                $("#successModal").modal("show");

                $("#successModal").on("hidden.bs.modal", function () {
                    // Redirigir a contactList.html
                    window.location.href = "http://localhost:8000/contactList";
                });
            },
            error: function (xhr, status, error) {
                displayErrors(xhr.responseJSON);
            }
        });
    });
});