$(document).ready(function () {

    function clearPositions() {
        var positions = $("#booksList").children();
        for (var i = 1; i < positions.length; i++) {
            positions[i].remove();
        }
    }

    function get() {
        ajaxCall("","get","").done(function (result) {
            for (var i = 0; i < result.length; i++) {
                var book = result[i];
                var booksList = $("#booksList");
                var newTr = ($("<tr class='listPosition'>"));
                booksList.append(newTr);
                newTr.append($("<td>" + book.id + "</td>"))
                newTr.append($("<td>" + book.title + "</td>"))
                newTr.append($("<td>" + book.author + "</td>"))
                newTr.append($("<td><input type='submit' value='usuń' id='deleteButton'></td>"))
                var secondTr = $("<tr class='details'><td colspan='4'>Tekst próbny</td></tr>").hide();
                secondTr.appendTo(booksList);
            }
        })
    }

    function ajaxCall(ajaxId, ajaxMethod, ajaxData) {
        var ajax = $.ajax({
            url: 'http://localhost:8080/books/' + ajaxId,
            method: ajaxMethod,
            contentType: "application/json",
            datatype: "json",
            data: ajaxData
        })
        return ajax;
    }

    $("#booksList").on("click", ".listPosition", function () {
        $(this).next().toggle();
        var bookDetails = $(this).next().children().eq(0).html("<div></div>");
        ajaxCall($(this).children().eq(0).text(),"get", "").done(function (result) {
            bookDetails.append("<p>Wydawca: " + result.publisher + "</p>");
            bookDetails.append("<p>ISBN: " + result.isbn + "</p>");
            bookDetails.append("<p>Tematyka: " + result.type + "</p>");
        })
    });

    $("#submitButton").on("click", function (event) {
        event.preventDefault();
        var book = {
            "id": $("#addBook #id").val(),
            "title": $("#addBook #title").val(),
            "author": $("#addBook #author").val(),
            "publisher": $("#addBook #publisher").val(),
            "isbn": $("#addBook #isbn").val(),
            "type": $("#addBook #type").val()
        };
        var bookJson = JSON.stringify(book);
        ajaxCall("", "post", bookJson).done(function (result) {
            clearPositions()
            get();
        })
    });

    $("#booksList").on("click", "#deleteButton", function (event) {
        event.stopPropagation();
        ajaxCall($(this).parent().parent().children().eq(0).text(), "delete","").done(function () {
            clearPositions()
            get();
        });
    });

    get();

})