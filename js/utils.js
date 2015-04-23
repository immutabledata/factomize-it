
var utils = {};

utils.getSHA256Hash = function getSHA256Hash (url, cb) {

	utils.getRaw(url, function (rawData) {
		if (cb) cb(CryptoJS.SHA256(CryptoJS.enc.Latin1.parse(rawData)).toString());
	})

}

utils.getRaw = function getRaw (url, cb) {
    BinaryAjax(
      url,
      function(http) {
        if (cb) cb(http.binaryResponse.getRawData());
      },
      null
    )
}

utils.convertImgToBase64 = function convertImgToBase64(url, callback, outputFormat){
  var canvas = document.createElement('CANVAS');
  var ctx = canvas.getContext('2d');
  var img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function(){
    canvas.height = img.height;
    canvas.width = img.width;
      ctx.drawImage(img,0,0);
      var dataURL = canvas.toDataURL(outputFormat || 'image/png');
      callback.call(this, dataURL);
        // Clean up
      canvas = null; 
  };
  img.src = url;
}


utils.parseQueryArgs = function (query) {
  var args = query.split('&');

  var argsParsed = {};

  for (i=0; i < args.length; i++)
  {
      var arg = decodeURIComponent(args[i]);

      if (arg.indexOf('=') == -1)
      {
          argsParsed[arg.trim()] = true;
      }
      else
      {
          var kvp = arg.split('=');
          argsParsed[kvp[0].trim()] = kvp[1].trim();
      }
  }

  return argsParsed;
}