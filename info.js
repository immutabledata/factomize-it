// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


/**
 * Quick template rendering function.  For each cell passed to it, check
 * to see if the cell's text content is a key in the supplied data array.
 * If yes, replace the cell's contents with the corresponding value and
 * unhide the cell.  If no, then remove the cell's parent (tr) from the
 * DOM.
 */
function renderCells(cells, data) {
  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    var key = cell.innerText;
    if (data[key]) {
      cell.innerText = data[key];
      cell.parentElement.className = "rendered";
    } else {
      cell.parentElement.parentElement.removeChild(cell.parentElement);
    }
  }
};

/**
 * Returns true if the supplies object has no properties.
 */
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

/**
 * Resizes the window to the current dimensions of this page's body.
 */
function resizeWindow() {
  window.setTimeout(function() {
    chrome.tabs.getCurrent(function (tab) {
      var newHeight = Math.min(document.body.offsetHeight + 140, 700);
      chrome.windows.update(tab.windowId, {
        height: newHeight,
        width: 520
      });
    });
  }, 150);
};

/**
 * Called directly by the background page with information about the
 * image.  Outputs image data to the DOM.
 */
function renderImageInfo(imageinfo) {
  console.log('imageinfo', imageinfo);

  var divloader = document.querySelector('#loader');
  var divoutput = document.querySelector('#output');
  divloader.style.display = "none";
  divoutput.style.display = "block";

  var divinfo = document.querySelector('#info');
  var divexif = document.querySelector('#exif');

  // Render general image data.
  var datacells = divinfo.querySelectorAll('td');
  renderCells(datacells, imageinfo);

  // If EXIF data exists, unhide the EXIF table and render.
  if (imageinfo['exif'] && !isEmpty(imageinfo['exif'])) {
    divexif.style.display = 'block';
    var exifcells = divexif.querySelectorAll('td');
    renderCells(exifcells, imageinfo['exif']);
  }
};

/**
 * Renders the URL for the image, trimming if the length is too long.
 */
function renderUrl(url) {
  var divurl = document.querySelector('#url');
  var urltext = (url.length < 45) ? url : url.substr(0, 42) + '...';
  var anchor = document.createElement('a');
  anchor.href = url;
  anchor.innerText = urltext;
  divurl.appendChild(anchor);
};

/**
 * Renders a thumbnail view of the image.
 */
function renderThumbnail(url) {
  var canvas = document.querySelector('#thumbnail');
  var context = canvas.getContext('2d');

  canvas.width = 100;
  canvas.height = 100;

  var image = new Image();
  image.addEventListener('load', function() {
    var src_w = image.width;
    var src_h = image.height;
    var new_w = canvas.width;
    var new_h = canvas.height;
    var ratio = src_w / src_h;
    if (src_w > src_h) {
      new_h /= ratio;
    } else {
      new_w *= ratio;
    }
    canvas.width = new_w;
    canvas.height = new_h;
    context.drawImage(image, 0, 0, src_w, src_h, 0, 0, new_w, new_h);
  });
  image.src = url;
};

/**
 * Returns a function which will handle displaying information about the
 * image once the ImageInfo class has finished loading.
 */
function getImageInfoHandler(url) {
  return function() {
    renderUrl(url);
    renderThumbnail(url);
    var imageinfo = ImageInfo.getAllFields(url);
    renderImageInfo(imageinfo);
    resizeWindow();
  };
};

function printHtml (id, text) {
  document.getElementById(id).innerText = text;
}


function setFactomEntry (hashes) {
    var fctmOptions = {
      host: 'http://demo.factom.org',
      port: '8088',
      pubkey: 'wallet'
    }

    console.warn(hashes)
    var chainId = hashes.imageUrl;
    var extIds = [hashes.sha256, hashes.blockhash];
    var data = ImageInfo.getAllFields(hashes.imageUrl);

    data.imageUrl= hashes.imageUrl;
    data.browserFingerPrint = new Fingerprint().get().toString();

    var fctm = new factomjs({host: fctmOptions.host, port: fctmOptions.port});

    // fctm.creditbalance(fctmOptions.pubkey);

    // fctm.buycredit(fctmOptions.pubkey, 100);

    // fctm.dblocksbyrange(4, 4);

    var chain_id = data.browserFingerPrint + '/' + hashes.chainId;

    utils.convertImgToBase64(hashes.imageUrl, function (base64Img) {

      data.raw = 'IMAGE:'+base64Img;

      fctm.submitentry(chain_id, extIds, data);

      printHtml('chainId', chain_id)
      printHtml('extIds', extIds.toString())
      printHtml('Entrydata', JSON.stringify(data, undefined, 4))
    })

    // fctm.entry('');
}

function getBlockhash (imageUrl, cb) {
    var blkhash = {
      methods: [1, 2],
      bits: 16
    }   

    blockhashjs.blockhash(imageUrl, blkhash.bits, blkhash.methods[0], function (error, result) {
      if (error) console.error(error)
      printHtml('blockhash-m1', result.toString())
      if (cb) cb(result.toString());
    })

    blockhashjs.blockhash(imageUrl, blkhash.bits, blkhash.methods[1], function (error, result) {
      if (error) console.error(error)
      printHtml('blockhash-m2', result.toString())
    })

}

/**
 * Load the image in question and display it, along with its metadata.
 */
document.addEventListener("DOMContentLoaded", function () {
  // The URL of the image to load is passed on the URL fragment.
  var data = utils.parseQueryArgs(window.location.hash.substring(1))
  var imageUrl = data.imageUrl;


  if (imageUrl) {
    // Use the ImageInfo library to load the image and parse it.
    ImageInfo.loadInfo(imageUrl, getImageInfoHandler(imageUrl));

    utils.getSHA256Hash(imageUrl, function (hash) {
      printHtml('sha256', hash)
      getBlockhash(imageUrl, function (blockhash) {
        setFactomEntry({
          imageUrl: imageUrl,
          sha256: hash,
          blockhash: blockhash,
          chainId: data.chainId
        })
      })
    })


    printHtml('fingerprint', new Fingerprint().get().toString())


  }
});