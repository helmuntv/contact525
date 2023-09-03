// Función para mostrar errores en el modal
function displayErrors(errors) {
    var errorList = $("#errorList");
    errorList.empty();
    $.each(errors, function (key, value) {
        errorList.append("<li>" + key + ": " + value + "</li>");
    });
    $("#errorModal").modal("show");
}

//funcion para obtener los genderType y seleccionarlo de acuerdo con el parametro recibido
function getGenderTypes(genderId) {
    $.ajax({
        url: "/api/gendertypes",
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            var genderSelector = $("#gender");
            genderSelector.empty();
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

//funcion para obtener los country y seleccionarlo de acuerdo con el parametro recibido
function getCountries(countryId) {
    $.ajax({
        url: "/api/countries",
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            var countrySelector = $("#country");
            countrySelector.empty();
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

//funcion para obtener los state y seleccionarlo de acuerdo con los parametros recibidos
function getStates(countryId, stateId) {
    $.ajax({
        url: "/api/states?country_id=" + countryId,
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
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

//funcion para obtener los city y seleccionarlo de acuerdo con los parametros recibidos
function getCities(stateId, cityId) {
    $.ajax({
        url: "/api/cities?state_id=" + stateId,
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            var citySelector = $("#city");
            citySelector.empty();
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

    // obtener el detalle del contacto
    $.ajax({
        url: "/api/contacts/" + contactId,
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            $("#state").prop("disabled", false);
            $("#city").prop("disabled", false);

            getGenderTypes(data.gender.id);
            getCountries(data.country.id);
            getStates(data.country.id, data.state.id);
            getCities(data.state.id, data.city.id);

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
        var selectedCountry = $(this).val();

        if (selectedCountry) {
            $("#state").prop("disabled", false);
            loadSelectData("state", "/api/states/", "Departamento", { country_id: selectedCountry });
            $("#city").prop("disabled", true);
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
            url: "/api/contacts/" + contactId + "/",
            method: "PUT",
            data: JSON.stringify(formData),
            headers: { Accept: "application/json", "X-CSRFToken": csrfToken, "Content-Type": "application/json" },
            success: function (response) {
                $("#successModal").modal("show");

                $("#successModal").on("hidden.bs.modal", function () {
                    window.location.href = "http://localhost:8000/contactList";
                });
            },
            error: function (xhr, status, error) {
                displayErrors(xhr.responseJSON);
            }
        });
    });
});