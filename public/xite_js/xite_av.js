(function() {
    
    let uniqValue = 0;
    function unique(prefix) {
        uniqValue += 1;
        return prefix + uniqValue.toString();
    }
    
    let AVATARS = new Map();
    
    function loadInlineAsync(browser, url) {
        browser.endUpdate();
        let inline = browser.currentScene.createNode("Inline");
        inline.url = new X3D.MFString(url);
        console.log(inline.url);
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
        browser.addBrowserCallback({}, function(eventType) {
            console.log(eventType);
            if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
                
                
                BxxEvents.addEventListener("AV:fromServer", async function(e) {
                    let eventDetail = e.detail;
                    let avatar = AVATARS.get(eventDetail.id);
                    let avImport;
                    if(avatar) {
                        avImport = avatar["import"];
                    } else {
                        let avInline = await loadInlineAsync(browser, eventDetail.wrl);
                        let uniqueID = unique("Av-");
                        browser.currentScene.updateImportedNode(avInline, "Avatar", uniqueID);
                        avImport = browser.currentScene.getImportedNode(uniqueID);
                        browser.currentScene.addRootNode(avInline);
                        AVATARS.set(eventDetail.id, { "inline": avInline, "import": avImport});
                    }
                    if(eventDetail.translation) {
                        avImport.set_translation.x = eventDetail.translation.x;
                        avImport.set_translation.y = eventDetail.translation.y;
                        avImport.set_translation.z = eventDetail.translation.z;
                    }
                    if(eventDetail.rotation) {
                        avImport.set_rotation.x = eventDetail.rotation.x;
                        avImport.set_rotation.y = eventDetail.rotation.y;
                        avImport.set_rotation.z = eventDetail.rotation.z;
                        avImport.set_rotation.angle = eventDetail.rotation.angle;
                    }
                });
            }
        });
    });
})();