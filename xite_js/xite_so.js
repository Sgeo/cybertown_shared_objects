BxxEvents.addEventListener("SO:upload:position", e => console.log(e));
BxxEvents.addEventListener("SO:upload:rotation", e => console.log(e));


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
        
        sharedObject.addFieldCallback("newPosition", {}, function(pos) {
            BxxEvents.dispatchEvent(new CustomEvent("SO:upload:position", {
                detail: {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z
                }
            }));
        });
        
        sharedObject.addFieldCallback("newRotation", {}, function(rot) {
            BxxEvents.dispatchEvent(new CustomEvent("SO:upload:rotation", {
                detail: {
                    x: rot.x,
                    y: rot.y,
                    z: rot.z,
                    angle: rot.angle
                }
            }));
        });
        
        return sharedObject
    }
    
    X3D(function() {
        console.log("Browser ready");
        let browser = X3D.getBrowser();
        window.SOs = new Map();
        browser.addBrowserCallback({}, async function(eventType) {
            console.log(eventType);
            if(eventType === X3D.X3DConstants.INITIALIZED_EVENT) {
                
                let SOs = await fetch("SOs.json").then(resp => resp.json());
                for(sharedObject of SOs) {
                    let sharedObjectInstance = addSO(browser, sharedObject);
                    window.SOs.set(sharedObject.id, sharedObjectInstance);
                }
            }
        });
    });
})();