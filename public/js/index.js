document.addEventListener("DOMContentLoaded", function () {
    if (!document.referrer.includes("/login")) {
        document.body.innerHTML = "";
        window.location.href = "../login";
    }
    loadItems();
});

function loadItems() {
    fetch("/api/getSettings")
        .then((response) => response.json())
        .then((data) => {
            displayItems(data);
        });
}

function displayItems(items) {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = "";
    items.forEach((item) => {
        addItem(item);
    });
}

function addItem(item) {
    const itemList = document.getElementById("itemList");
    itemList.innerHTML += `<tr id="${item.username}">
                            <td onclick="writeMessage('user','${
                                item.user_id
                            }')">
                                <input
                                    type="text"
                                    id="textInput"
                                    value="${item.username}${
        item.user_id ? "" : " (не активований)"
    }"
                                    disabled
                                />
                            </td>
                        </tr>`;
}

document.getElementById("sendMessage").addEventListener("click", () => {
    const id = document.getElementById("chat_id").value;
    const messageText = document.getElementById("messageText").value;
    switch (document.getElementById("messageReciever").value) {
        case "all":
            document.getElementById("chat_id").value = "";
            fetch("/api/messageAll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ message: messageText }),
            }).then();
            alert("Сообщение успешно отправлено");
            break;
        case "user":
            fetch("/api/messageOneChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({ chat_id: id, message: messageText }),
            }).then();
            alert("Сообщение успешно отправлено");
            break;
    }
});

function writeMessage(type, id) {
    document.getElementById("messageReciever").value = type;
    document.getElementById("chat_id").value = id;
}
