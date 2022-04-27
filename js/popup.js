document.addEventListener('DOMContentLoaded', function () {


    // 获取manifest.json内容
    document.querySelector("#getAppInfo").onclick = function () {
        let app = chrome.runtime.getManifest();
        console.log(app);

        // 清除插件所有的本地数据
        // chrome.storage.local.clear();
        // chrome.storage.sync.clear();
    };

    // 向background.js发送通讯
    document.querySelector("#getUserData").onclick = function () {
        chrome.runtime.sendMessage({ type: "getUserData" }, (response) => {
            console.log(response);
            if (response.complete) {
                console.log(response.data);
            }
        });
    };

    // 向background.js发送通讯
    document.querySelector("#notifyMessage").onclick = function () {
        chrome.runtime.sendMessage({ type: "notify" }, (response) => {
            if (response.complete) {
                window.close();
            }
        });
    };
});