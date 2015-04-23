
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