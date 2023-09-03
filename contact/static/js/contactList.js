$(document).ready(function () {
    // Realiza una solicitud AJAX para obtener los contactos
    $.ajax({
        url: "/api/contacts/", // Reemplaza con la URL correcta de tu endpoint de contactos
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            var contactTableBody = $("#contactTableBody");
            $.each(data.contacts, function (index, contact) {
                // Crea una fila para cada contacto
                var row = $("<tr>");
                row.append("<td class='first-name'>" + contact.first_name + "</td>");
                row.append("<td class='last-name'>" + contact.last_name + "</td>");
                row.append("<td class='email'>" + contact.email + "</td>");
                row.append("<td class='address'>" + contact.address + "</td>")
                row.append("<td class='country'>" + contact.country.name + "</td>");
                row.append("<td class='state'>" + contact.state.name + "</td>");
                row.append("<td class='city'>" + contact.city.name + "</td>");
                row.append("<td class='birthdate'>" + contact.birthdate + "</td>");
                row.append("<td class='comment'>" + contact.comment + "</td>");
                
                // Agrega una celda con los íconos de detalle y eliminación en la misma columna
                var optionsCell = $("<td class='options'>");
                
                // Ícono de detalle
                var detailLink = $("<a>");
                detailLink.attr("href", "contactDetail/" + contact.id + "/"); // Reemplaza con la URL correcta
                var detailIcon = $("<i>");
                detailIcon.addClass("fa fa-eye"); // Clase de Font Awesome para el ícono de "ver detalles"
                detailIcon.css("margin-right", "10px"); // Agrega un margen derecho para separar los íconos
                detailLink.append(detailIcon);
                
                // Ícono de eliminación
                var deleteLink = $("<a href='#' class='delete-icon' data-contact-id='" + contact.id + "'>");
                var deleteIcon = $("<i class='fa fa-trash'>");
                deleteIcon.css("margin-left", "10px"); // Agrega un margen izquierdo para separar los íconos
                deleteLink.append(deleteIcon);
                
                // Agrega ambos íconos al mismo div en la celda
                optionsCell.append(detailLink);
                optionsCell.append(deleteLink);

            
                // Agrega la celda a la fila
                row.append(optionsCell);

                // Agrega la fila a la tabla
                contactTableBody.append(row);
            });

            // Mostrar la sección city_counts
            var cityCountsList = $("#cityCountsList");
            $.each(data.city_counts, function (city, count) {
                var listItem = $("<li>");
                listItem.text(city + ": " + count);
                cityCountsList.append(listItem);
            });

            // Función para aplicar filtros a la tabla
            function applyFilters() {
                var filterFirstName = $("#filterFirstName").val().toLowerCase();
                var filterLastName = $("#filterLastName").val().toLowerCase();
                var filterEmail = $("#filterEmail").val().toLowerCase();
                var filterCountry = $("#filterCountry").val().toLowerCase();
                var filterState = $("#filterState").val().toLowerCase();
                var filterCity = $("#filterCity").val().toLowerCase();

                $("#contactTableBody tr").each(function () {
                    var row = $(this);
                    var firstName = row.find(".first-name").text().toLowerCase();
                    var lastName = row.find(".last-name").text().toLowerCase();
                    var email = row.find(".email").text().toLowerCase();
                    var country = row.find(".country").text().toLowerCase();
                    var state = row.find(".state").text().toLowerCase();
                    var city = row.find(".city").text().toLowerCase();

                    // Comprueba si la fila cumple con los criterios de filtrado
                    var firstNameMatch = firstName.includes(filterFirstName);
                    var lastNameMatch = lastName.includes(filterLastName);
                    var emailMatch = email.includes(filterEmail);
                    var countryMatch = country.includes(filterCountry);
                    var stateMatch = state.includes(filterState);
                    var cityMatch = city.includes(filterCity);

                    if (firstNameMatch && lastNameMatch && emailMatch && countryMatch && stateMatch && cityMatch) {
                        row.show();
                    } else {
                        row.hide();
                    }
                });
            }

            // Aplicar los filtros cuando se cambie el contenido de los campos de filtro
            $("#filterFirstName, #filterLastName, #filterEmail, #filterCountry, #filterState, #filterCity").on("input", applyFilters);
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar la lista de contactos: " + error);
        }
    });

    // Manejar el clic en el ícono de eliminación
    $(document).on("click", ".delete-icon", function () {
        var contactId = $(this).data("contact-id");
        $("#confirmDelete").data("contact-id", contactId); // Almacenar el ID en el botón de confirmación
        $("#deleteModal").modal("show"); // Mostrar el modal de confirmación
    });

    $("#confirmDelete").click(function () {
        var contactId = $(this).data("contact-id");
        var csrfToken = $("[name=csrfmiddlewaretoken]").val();
        // Realizar una solicitud DELETE al endpoint para eliminar el registro
        $.ajax({
            url: "/api/contacts/" + contactId + "/",
            method: "DELETE",
            dataType: "json",
            headers: { Accept: "application/json", "X-CSRFToken": csrfToken, "Content-Type": "application/json" },
            success: function (data) {
                // Realizar alguna acción adicional si es necesario
                // Cerrar el modal de confirmación
                $("#deleteModal").modal("hide");
                // Actualizar la tabla u otra lógica según tus necesidades
                location.reload();
            },
            error: function (xhr, status, error) {
                console.error("Error al eliminar el registro: " + error);
                // Puedes mostrar un mensaje de error aquí si es necesario
                // Cerrar el modal de confirmación
                $("#deleteModal").modal("hide");
            }
        });
    });
});