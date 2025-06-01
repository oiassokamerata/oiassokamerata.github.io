$(document).ready(function() {
    document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px")
    
    // Automatic Slideshow - change image every 5 seconds
    var myIndex = 1;
    setTimeout(carousel, 4000); 

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
      setTimeout(carousel, 4000);    
    }
    

    // When the user clicks anywhere outside of the modal, close it
    var modal = document.getElementById('programaModal');
    window.onclick = function(event) {
      if (event.target == modal) {
        kenduElem(modal);
      }
    }
    
    var gehi_button = $('#programa_gehi')
    var gehi_div = $('#programa_gehi_div')
    var gridProgramak = $('#grid-programak > div')
    gehi_button.click(function() {
        gridProgramak.show()
        gehi_div.hide()
    })

    const topBar = document.getElementById('topBar')
    const contentBorder = document.getElementById('content-border')

    const observerOptions = {
        rootMargin: '-84px 0px 1000px 0px'
    }

    const observer = new IntersectionObserver(
        function(entries) {
            entries.forEach(entry => {
              //console.log(entry)
              if (entry.isIntersecting) {
                topBar.classList.remove('w3-white', 'w3-card')
                topBar.classList.add('transparentBar')
              } else {
                topBar.classList.remove('transparentBar')
                topBar.classList.add('w3-white', 'w3-card')
              }
            })
        },
        observerOptions
    )

    observer.observe(contentBorder)  

    setLang('eu')
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

function setLang(lang) {

    currentLang = lang

    bilatuEmanaldiak()

    let elements = document.querySelectorAll(".lang")
    elements.forEach(element => {
        let key = element.getAttribute("key")
        element.innerHTML = strings[lang][key]
    })

    document.querySelectorAll(".langButton").forEach(function(button) {
        if (button.getAttribute('key') == lang) {
            button.style.display = 'none'
        } else {
            button.style.display = ''
        }
    })
}

function setLangElem(elem, lang) {
    elem.querySelectorAll(".lang").forEach(subElem => {
        let key = subElem.getAttribute("key")
        subElem.innerHTML = strings[lang][key]
    })
}

function erakutsiModala(izena) {
    let elem = document.getElementById('programaModal')
    fetch('./' + izena + '.html')
        .then(response => response.text())
        .then(html => {
            elem.innerHTML = html
            setLangElem(elem, currentLang)
            elem.style.display = 'block'
        })
}

function kenduElem(elem) {
    elem.style.display = "none";
    elem.replaceChildren();
}

function bilatuEmanaldiak() {
    let dataOrain = new Date()
    var zerrendaDiv = $('#emanaldi-lista')
    zerrendaDiv.empty()
    //$.getJSON('./emanaldiak.json', function(emanaldiak) {
    $.ajax({
        url: './emanaldiak.json',
        dataType: 'json',
        async: false,
        success: function(emanaldiak) {
            for (let emanaldia of emanaldiak) {
                let data = new Date(...emanaldia['data_array'])
                if (data > dataOrain) {
                    document.getElementById('emanaldiak').style.display = 'block'
                    document.getElementById('emanaldiak-laster').style.display = 'none'
                    if (zerrendaDiv.children().length > 0) {
                        zerrendaDiv.append('<div class="emanaldi-sep"></div>')
                    }
                    let atributuak = ''
                    let ikonoa = ''
                    if ('programa' in emanaldia) {
                        atributuak = ' onclick="erakutsiModala(\'' + emanaldia['programa'] + '\')" style="cursor:pointer;"'
                        ikonoa = '&ensp;<i class="fa fa-chevron-circle-right"></i>'
                    }
                    let orduaNormal = data.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})
                    let dataString = getDateString(data, currentLang)
                    let emanaldiDiv = $(
                        '<div>'+
                            '<p class="tituloProg"' + atributuak + '><b>' + emanaldia['izena_' + currentLang] + '</b>' + ikonoa + '</p>' +
                            '<div class="emanaldi-info">' +
                                '<div>' +
                                    '<i class="fa fa-calendar fa-fw" style="padding-right:10px;"></i>' + dataString +
                                '</div>' +
                                '<div>' +
                                    '<i class="fa fa-clock-o fa-fw" style="padding-right:10px;"></i>' +
                                    orduaNormal +
                                '</div>' +
                                '<div>' +
                                    '<i class="fa fa-map-marker fa-fw" style="padding-right:10px;"></i>' +
                                    emanaldia['aretoa'] + ', ' + emanaldia['herria'] +
                                '</div>' +
                            '</div>' +
                        '</div>')
					let botoiakDiv = $('<div></div>')
					if ('esteka_eu' in emanaldia) {
						switch (emanaldia['esteka_mota']) {
							case 'sarrerak':
								var botoiEdukia = '<i class="fa fa-shopping-cart"></i> <span class="lang" key="sarrerak">'
								break
						}
						let estekaBotoia = $(
							'<a href=' + emanaldia['esteka_' + currentLang] + ' target="_blank" class="w3-button w3-border w3-padding w3-round-xxlarge agenda-button">' + botoiEdukia + '</a>'
							)
						botoiakDiv.append(estekaBotoia)
					}
                    let gehituBotoia = $(
                        '<a class="w3-button w3-border w3-padding w3-round-xxlarge agenda-button"><i class="fa fa-calendar-plus-o"></i> <span class="lang" key="gehitu"></a>')
                    let bukaeraData = new Date(data.getTime());
                    bukaeraData.setHours(data.getHours() + 1);
                    let bukaeraOrdua = bukaeraData.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})
                    let em_config = {
                        name: emanaldia['izena_' + currentLang],
                        description: "Oiasso Kamerataren kontzertua / Concierto de la Oiasso Kamerata",
                        startDate: data.toISOString().split('T')[0],
                        startTime: orduaNormal,
                        endTime: bukaeraOrdua,
                        location: emanaldia['aretoa'] + ', ' + emanaldia['herria'],
                        options: ["Google", "Apple", "Outlook.com" ,"iCal"],
                        timeZone: "Europe/Berlin",
                        trigger: "click",
                    };
                    let gehituFunc = function (config, botoia) {
                        atcb_action(config, botoia)
                    }.bind(this, em_config, gehituBotoia[0])
                    gehituBotoia.click(gehituFunc)
                    botoiakDiv.append(gehituBotoia)
                    emanaldiDiv.append(botoiakDiv)
                    zerrendaDiv.append(emanaldiDiv)
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    })   
}