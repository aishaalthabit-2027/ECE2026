// Bridge.js - JavaScript interface for communicating with native iOS code
// This file will be injected into the WKWebView to enable native functionality

(function() {
    // Create the bridge object
    window.iOSBridge = {
        // File system access
        saveFile: function(fileName, fileData) {
            // Send message to native iOS code
            window.webkit.messageHandlers.iOSBridge.postMessage({
                action: "saveFile",
                fileName: fileName,
                fileData: fileData
            });
        },
        
        loadFile: function(fileName) {
            window.webkit.messageHandlers.iOSBridge.postMessage({
                action: "loadFile",
                fileName: fileName
            });
        },
        
        // User defaults/simple storage
        setItem: function(key, value) {
            window.webkit.messageHandlers.iOSBridge.postMessage({
                action: "setItem",
                key: key,
                value: value
            });
        },
        
        getItem: function(key) {
            window.webkit.messageHandlers.iOSBridge.postMessage({
                action: "getItem",
                key: key
            });
        },
        
        // File picker
        showDocumentPicker: function() {
            window.webkit.messageHandlers.iOSBridge.postMessage({
                action: "showDocumentPicker"
            });
        }
    };
    
    // Override localStorage to use our bridge (for compatibility)
    if (!window.localStorage.iosBridgePatched) {
        var _getItem = window.localStorage.getItem;
        var _setItem = window.localStorage.setItem;
        var _removeItem = window.localStorage.removeItem;
        
        window.localStorage.getItem = function(key) {
            return _getItem.call(this, key);
        };
        
        window.localStorage.setItem = function(key, value) {
            _setItem.call(this, key, value);
            // Also sync to our bridge
            window.iOSBridge.setItem(key, value);
        };
        
        window.localStorage.removeItem = function(key) {
            _removeItem.call(this, key);
            window.iOSBridge.setItem(key, null);
        };
        
        window.localStorage.iosBridgePatched = true;
    }
    
    // Expose the bridge to the page
    window.webkit = window.webkit || {};
    window.webkit.messageHandlers = window.webkit.messageHandlers || {};
    window.webkit.messageHandlers.iOSBridge = {
        postMessage: function(message) {
            console.log("Bridge message sent:", message);
        }
    };
})();
