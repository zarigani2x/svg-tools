$("#input-text").on("input",()=>{

    t = $("#input-text").val()
    $("#preview-area").html(
        t
    );
})