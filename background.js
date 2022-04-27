// 获取用户信息
async function getUserData() {
    try {
        let response = await fetch("data/user.json", {
            method: 'GET',
            async: false,
            headers: {
                'Content-Type': 'application/json'
            },
            'contentType': 'json'
        });

        return await response.json();
    } catch (error) {
        console.log('Request Failed', error);
    }
}

// 创建一个浏览器通知
function notify(sender) {
    chrome.notifications.create({
        "type": "basic",
        "iconUrl": "img/icon_128x128.png",
        "title": "demo title for notifications",
        "message": "demo message for notifications" + sender.id
    }, function (notificationId) {
        setTimeout(function () {
            chrome.notifications.clear(notificationId);
        }, 5000);
    });
}

// 如果manifest.json未配置 action.default_popup，点击扩展按钮会触发此事件
// https://developer.chrome.com/docs/extensions/reference/action/
chrome.action.onClicked.addListener(function (tab) {
    // 设置标题
    chrome.action.setTitle({ tabId: tab.id, title: "You are on tab:" + tab.id });
    // 设置文字
    chrome.action.setBadgeText({ text: "ON" });
});


// 后台监听事件消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    let requestType = message.type;

    switch (requestType) {
        // 检测是否是扩展开启状态
        case "checkFlag":
            // sender.id 获取应用id
            // sender.url 获取tab url
            // sender.tab 非popup获取tab信息
            console.log(sender);
            sendResponse({ "runtime": true });
            break;

        case "sendRequest":
            console.log(sender);
            chrome.tabs.sendMessage(sender.tab.id, {
                type: "checkTab",
                message: "send tab a message"
            });
            break;

        // 发布个notify
        case "notify":
            notify(sender);
            sendResponse({ "complete": 1 });
            break;

        case "getUserData":
            (async () => {
                const data = await getUserData();
                sendResponse({ "complete": 1, "data": data });
            })();
            break;
    }
    // 这里一定要写个，保证async异步执行完成
    return true;
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    console.log("chrome tab remove begin, tabId: " + tabId);
});


// 窗口移除事件监听
chrome.windows.onRemoved.addListener(function (windowId) {
    console.log("chrome tab remove begin, windowId: " + windowId);
});

// 插件安装监听事件
chrome.runtime.onInstalled.addListener(() => {

    // 清除插件所有的本地数据
    chrome.storage.local.clear();
    // local 和 sync 区别在于，sync会同步到chrome登录用户
    chrome.storage.sync.clear();

    // 设置初始数据
    chrome.storage.local.set({
        "demo": "demo 数据",
        "env": "dev"
    }, function () {
        console.log("chrome extension is install.");
    });
});