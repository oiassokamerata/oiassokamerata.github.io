$(document).ready(function() {
    document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px")
    
    // Automatic Slideshow - change image every 5 seconds
    var myIndex = 1;
    setTimeout(carousel, 5000); 

    function carousel() {
      var i;
      var x = document.getElementsByClassName("mySlides");
      $(x[myIndex-1]).animate({opacity: 0}, 800, complete=function () {
          $(this).hide()
      })
      myIndex++;
      if (myIndex > x.length) {myIndex = 1}   
      $(x[myIndex-1]).show();
      $(x[myIndex-1]).animate({opacity: 1}, 800)
      setTimeout(carousel, 5000);    
    }
    

    // When the user clicks anywhere outside of the modal, close it
    var modal = document.getElementById('programaModal');
    window.onclick = function(event) {
      if (event.target == modal) {
        kenduElem(modal);
      }
    }
    
    var currentLang
    ezarriHizkuntza('eu')
      
})

// Used to toggle the menu on small screens when clicking on the menu button
function myFunction() {
  var menu = document.getElementById("navMenu");
  var but = document.getElementById("navButton");
  var dontCloseYet = true
  if (menu.className.indexOf("w3-show") == -1) {
    menu.className += " w3-show";
    var clickFunction = function (event) {
        if (!dontCloseYet) {
            menu.className = menu.className.replace(" w3-show", "");
            window.removeEventListener('click',clickFunction);
        }
        dontCloseYet = false
    }
    window.addEventListener('click', clickFunction);
  }
}

function ezarriHizkuntza(lang) {
    currentLang = lang
    bilatuEmanaldia()
    
    $.getJSON('./languages/'+lang+'.json', function(data) {
        $(".lang").each(function() {
            $(this).html(data[$(this).attr("key")]);
        })
    })
    $(".langButton").each(function() {
        if ($(this).attr('key') == lang) {
            $(this).hide()
        }
        else {
            $(this).show()
        }
    })

}

function ezarriHizkuntzaElem(elem, lang) {
    $.getJSON('./languages/'+lang+'.json', function(data) {
        elem.find(".lang").each(function() {
            $(this).html(data[$(this).attr("key")]);
        })
    })
}
function erakutsiModala(izena) {
    var elem = $('#programaModal')
    elem.load('./'+izena+'.html', function() {
        ezarriHizkuntzaElem(elem, currentLang)
    })
    elem.show()
}

function kenduElem(elem) {
    elem.style.display = "none";
    elem.replaceChildren();
}

function bilatuEmanaldia() {
    let dataOrain = new Date()
    //$.getJSON('./emanaldiak.json', function(emanaldiak) {
    $.ajax({
        url: './emanaldiak.json',
        dataType: 'json',
        async: false,
        success: function(emanaldiak) {
            for (let emanaldia of emanaldiak) {
                let data = new Date(...emanaldia['data_array'])
                if (data > dataOrain) {
                    $('#em_data').html(emanaldia['data_' + currentLang] + ', ' + emanaldia['herria'])
                    $('#em_izena').html(emanaldia['izena'])
                    $('#em_esteka').attr('href', emanaldia['esteka_' + currentLang])
                    if (emanaldia['esteka_mota'] != 'sarrerak') {
                        $('#em_esteka').hide()
                    }
                    $('#hurrengoaFloat').show()
                    $('footer')[0].style.setProperty('padding-bottom', '120px', 'important');
                    break
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    })   
}