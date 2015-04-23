// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var mapInfo = {};

/**
 * Returns a handler which will open a new window when activated.
 */
function getClickHandler() {
  return function(info, tab) {

    // The srcUrl property is only available for image elements.
    var url = 'info.html#imageUrl=' + info.srcUrl + '&chainId=' + mapInfo[info.menuItemId];

    // Create a new window to the info page.
    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};


function getNewChainClickHandler() {
  return function(info, tab) {

    var chainId = prompt("Please enter chainId");
    saveChain(chainId)

    var url = 'info.html#imageUrl=' + info.srcUrl + '&chainId=' + chainId;

    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};


function saveChain(chainId) {

  if (!chainId) {
    console.error('Error: No value specified');
    return;
  }

  var item = {};
  item[chainId] = '';
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set(item, function() {

    // notification.show();
    console.warn("done")
  });
}



chrome.storage.onChanged.addListener(function() {
  console.log("reload context menu items");
  loadMenuItems();
})

/**
 * Create a context menu which will only show up for images.
 */
function loadMenuItems () {
  chrome.contextMenus.removeAll(function () {
    console.log("clear all context items")
  });

  chrome.storage.sync.get(null, function(items) {
      var allKeys = Object.keys(items);
      console.log("adding context items")

      allKeys.forEach(function (key) {
        var menuId = chrome.contextMenus.create({
          "title" : key,
          "type" : "normal",
          "contexts" : ["image"],
          "onclick" : getClickHandler()
        });
        mapInfo[menuId] = key;
      })
  });

  // default one
  chrome.contextMenus.create({
    "title" : "New ChainId",
    "type" : "normal",
    "contexts" : ["image"],
    "onclick" : getNewChainClickHandler()
  });
}

loadMenuItems();
