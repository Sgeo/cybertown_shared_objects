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
                    let eventData = e.detail;
                    let avatar = AVATARS.get(eventData.id);
                    if(!avatar) {
                        avatar = {};
                        AVATARS.set(eventData.id, avatar);
                    }
                    avatar.transform = {};
                    if(eventData.translation) {
                        avatar.transform.translation = eventData.translation;
                    }
                    if(eventData.rotation) {
                        avatar.transform.rotation = eventData.rotation;
                    }
                    
                    if(!avatar.loading && !avatar.loaded) {
                        avatar.loading = true;
                        let avInline = await loadInlineAsync(browser, eventData.wrl);
                        let uniqueID = unique("Av-");
                        browser.currentScene.updateImportedNode(avInline, "Avatar", uniqueID);
                        avImport = browser.currentScene.getImportedNode(uniqueID);
                        browser.currentScene.addRootNode(avInline);
                        avatar.loading = false;
                        avatar.loaded = true;
                        avatar["inline"] = avInline;
                        avatar["import"] = avImport;
                    }
                    
                    // avatar.transform may have changed during above await;
                    if(avatar["inline"]) {
                        if(avatar.transform.translation) {
                            avatar["import"].set_translation.x = avatar.transform.translation.x;
                            avatar["import"].set_translation.y = avatar.transform.translation.y;
                            avatar["import"].set_translation.z = avatar.transform.translation.z;
                        }
                        if(avatar.transform.rotation) {
                            avatar["import"].set_rotation.x = avatar.transform.rotation.x;
                            avatar["import"].set_rotation.y = avatar.transform.rotation.y;
                            avatar["import"].set_rotation.z = avatar.transform.rotation.z;
                            avatar["import"].set_rotation.angle = avatar.transform.rotation.angle;
                        }
                    }
                });
            }
        });
    });
})();