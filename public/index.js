$.getJSON("/", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'><br /> <a href='" + data[i].link + "'>"+(i+1)+". "+data[i].title+"</a></p>")
        .append("<h3>My notes</h3>")
        .append("<p>"+data[i].comment+"</p>")
        .append("<textarea placeholder='Did you read it?' class='"+data[i]._id+"'></textarea><br /><input type='submit' class='comment' id='"+data[i]._id+"'>")
  }

  $(document).on("click",".comment", function(){
    var id = $(this).attr("id");
    var textClass = "."+id
    var comment = $(textClass).val().trim();
    console.log(id,comment)
    $.ajax({
      method: "POST",
      url: "/articles/" + id,
      data: {
        comment:comment
      }
    }).then(function(data){
      console.log(data);
    })
    location.reload();
  })
  res.send(JSON)
})