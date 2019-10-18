(function() {
    function addSO(browser, obj) {
        let sharedObject = browser.currentScene.createProto("SharedObject");
        sharedObject.name = obj.name;
        sharedObject.id = obj.id;
        sharedObject.translation = new X3D.SFVec3f(obj.position.x, obj.position.y, obj.position.z);
        sharedObject.rotation = new X3D.SFRotation(obj.rotation.x, obj.rotation.y, obj.rotation.z, obj.rotation.angle);
        let inline = browser.currentScene.createNode("Inline");
        inline.url = new X3D.MFString(obj.url);
        sharedObject.children[0] = inline;
        browser.currentScene.addRootNode(sharedObject);
    }
    
    X3D(function() {
        let browser = X3D.getBrowser();
        browser.addBrowserCallback(null, async function(eventType) {
            console.log(eventType);
            if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
                
                let SOs = await fetch("SOs.json").then(resp => resp.json());
                for(sharedObject of SOs) {
                    addSO(browser, sharedObject);
                }
            }
        });
    });
})();