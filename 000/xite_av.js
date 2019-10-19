(function() {
    
    X3D(function() {
        let browser = X3D.getBrowser();
        browser.addBrowserCallback({}, async function(eventType) {
            console.log(eventType);
            if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
                
                let avInline = browser.currentScene.createNode("Inline");
                avInline.url = new X3D.MFString("/avatars/wizards/wizardfem.wrl");
                browser.currentScene.updateImportedNode(avInline, "Avatar", "WizFemAvatar");
                setTimeout(function() {
                    window.av = browser.currentScene.getImportedNode("WizFemAvatar")
                    //browser.currentScene.addRootNode(window.av);
                    console.log(window.av);
                }, 5000);
                browser.currentScene.addRootNode(avInline);
            }
        });
    });
})();