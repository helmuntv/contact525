$(document).ready(function () {
    $.ajax({
        url: "/api/contacts/",
        method: "GET",
        dataType: "json",
        headers: { Accept: "application/json" },
        success: function (data) {
            var contactTableBody = $("#contactTableBody");
            $.each(data.contacts, function (index, contact) {
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
                
                var optionsCell = $("<td class='options'>");
                
                var detailLink = $("<a>");
                detailLink.attr("href", "contactDetail/" + contact.id + "/");
                var detailIcon = $("<i>");
                detailIcon.addClass("fa fa-eye");
                detailIcon.css("margin-right", "10px");
                detailLink.append(detailIcon);
                
                var deleteLink = $("<a href='#' class='delete-icon' data-contact-id='" + contact.id + "'>");
                var deleteIcon = $("<i class='fa fa-trash'>");
                deleteIcon.css("margin-left", "10px");
                deleteLink.append(deleteIcon);
                
                optionsCell.append(detailLink);
                optionsCell.append(deleteLink);
                
                row.append(optionsCell);
                contactTableBody.append(row);
            });

            var cityCountsList = $("#cityCountsList");
            $.each(data.city_counts, function (city, count) {
                var listItem = $("<li>");
                listItem.text(city + ": " + count);
                cityCountsList.append(listItem);
            });

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

            $("#filterFirstName, #filterLastName, #filterEmail, #filterCountry, #filterState, #filterCity").on("input", applyFilters);
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar la lista de contactos: " + error);
        }
    });

    $(document).on("click", ".delete-icon", function () {
        var contactId = $(this).data("contact-id");
        $("#confirmDelete").data("contact-id", contactId);
        $("#deleteModal").modal("show");
    });

    $("#confirmDelete").click(function () {
        var contactId = $(this).data("contact-id");
        var csrfToken = $("[name=csrfmiddlewaretoken]").val();
        
        $.ajax({
            url: "/api/contacts/" + contactId + "/",
            method: "DELETE",
            dataType: "json",
            headers: { Accept: "application/json", "X-CSRFToken": csrfToken, "Content-Type": "application/json" },
            success: function (data) {
                $("#deleteModal").modal("hide");
                location.reload();
            },
            error: function (xhr, status, error) {
                $("#deleteModal").modal("hide");
            }
        });
    });
});