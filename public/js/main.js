// client-seitiges Javascript
// Delete-Request ueber AJAX, da sicherer als mit GET-Request
$(document).ready(function() {                      // AJAX Request
    $('.delete-article').on('click', function(e){   // delete article Klasse des Buttons auswählen und mit Klick-Event versehen 
        $target = $(e.target);                      // Objekt auf welches geklickt wurde
        const id = $target.attr('data-id');       // ID des Artikelobjekts durch Attribut 'data-id' bekommen
        $.ajax({                            // AJAX Request mit Objektuebergabe
            type:'DELETE',                  
            url:'/article/'+id,             // Route muss fuer Delete-Request erstellt werden
            success: function(response){
                alert('Deleting Article');
                window.location.href='/';   // Redirect zur Homepage
            },
            error: function(err){          // Falls Fehler auftritt
                console.log(err);   
            }
        });
    });
}); 