
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var city = $('#city').val();
    //console.log(city);
    var street = $('#street').val();
    //console.log(street);
    var address = street.replace(/ /g,'%20')+','+city.replace(/ /g,'%20');
    var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location='+address;
    $greeting.text("So you want to live at " + street+', '+ city + "?");
    $body.append('<img class="bgimg" src= "'+ streetViewUrl +'">');
    //console.log('<img class="bgimg" src="https://maps.googleapis.com/maps/api/streetview?size=600x300&location='+street+','+city+'>');
    
    //getting articles from nyTimes
    var nyTimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +street + "&api-key=7c152aef45a540b5b42097ff7cb8744c"
    $.getJSON( nyTimesUrl, function( data ) {
    $nytHeaderElem.text("New York Times Articles about " + street);
    var items = [];
    var articles = data.response.docs;
    for (var i = 0; i < articles.length; i++) {
        /*
        console.log( "<li>" 
                        +"<a href = " + articles[i].web_url + " >" + articles[i].headline.main  + "</a>"
                        +"<p>" + articles[i].snippet + "</p>"
                        + "</li>" );
                        */
        items.push( "<li>" 
                        +"<a href = " + articles[i].web_url + " >" + articles[i].headline.main  + "</a>"
                        +"<p>" + articles[i].snippet + "</p>"
                        + "</li>" );
    }
    
    $nytElem.append(items);
    }).error(function(e) {
        $nytHeaderElem.text("Call to New York Times Failed");
    });
    
    //getting articles from wikipedia
    //introduce a timeout to enable error checking
    var wikiTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia resource");
    },8000);
    var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+street+"&format=json&callback=wikiCallback";
    $.ajax({
    url: wikiUrl,
    dataType: 'jsonp',
    success: function (data) {
        var articles = data[1];
        var description = data[2]
        var links = data[3];
        var items = [];
        for (var i = 0; i < articles.length; i++) {
            /*
            console.log( "<li>" 
                            +"<a title = '" + description[i] + "' href = " + links[i] + " >" + articles[i] + "</a>"
                            + "</li>" );
                            */
            items.push( "<li>" 
                            +"<a title = '" + description[i] + "' href = " + links[i] + " >" + articles[i] + "</a>"
                            + "</li>" );
        }
        clearTimeout(wikiTimeout);
        $wikiElem.text("");
        $wikiElem.append(items);
        
    }
    });
    return false;
};

$('#form-container').submit(loadData);
