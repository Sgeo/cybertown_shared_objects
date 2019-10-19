(function() {
    
    function loadInlineAsync(browser, url) {
        browser.endUpdate();
        let inline = browser.currentScene.createNode("Inline");
        inline.url = new X3D.MFString(url);
        let loadSensor = browser.currentScene.createNode("LoadSensor");
        loadSensor.watchList[0] = inline;
        let callbackKey = {};
        let promise = new Promise(function(resolve, reject) {
            loadSensor.addFieldCallback("isLoaded", callbackKey, function(value) {
                loadSensor.removeFieldCallback("isLoaded", callbackKey);
                if(value) {
                    resolve(inline);
                } else {
                    reject(inline);
                }
            });
        });
        browser.beginUpdate();
        return promise;
    }
    
    X3D(function() {
        let browser = X3D.getBrowser();
        browser.addBrowserCallback({}, async function(eventType) {
            console.log(eventType);
            if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
                
                let avInline = await loadInlineAsync(browser, "/avatars/default.wrl");
                browser.currentScene.updateImportedNode(avInline, "Avatar", "DefaultAvatar");
                window.avImport = browser.currentScene.getImportedNode("DefaultAvatar")
                console.log(window.avImport);
                browser.currentScene.addRootNode(avInline);
            }
        });
    });
})();