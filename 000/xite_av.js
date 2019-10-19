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
                browser.currentScene.removeRootNode(loadSensor);
                if(value) {
                    resolve(inline);
                } else {
                    reject(inline);
                }
            });
        });
        browser.currentScene.addRootNode(inline);
        browser.currentScene.addRootNode(loadSensor);
        browser.beginUpdate();
        return promise;
    }
    
    X3D(function() {
        let browser = X3D.getBrowser();
        browser.addBrowserCallback({}, async function(eventType) {
            console.log(eventType);
            if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
                
                let avInline = await loadInlineAsync(browser, "/avatars/wizards/wizardfem.wrl");
                browser.currentScene.updateImportedNode(avInline, "Avatar", "WizFemAvatar");
                window.av = browser.currentScene.getImportedNode("WizFemAvatar")
                console.log(window.av);
                browser.currentScene.addRootNode(avInline);
            }
        });
    });
})();