var messages = document.getElementById("messages");
        var messageInput = document.getElementById("messageInput");
        var sendButton = document.getElementById("sendButton");

        sendButton.addEventListener("click", function () {
        var messageText = messageInput.value;
        if (messageText.trim() !== "") {
            addMessage("You", messageText);
            messageInput.value = "";
        }
        });

        function addMessage(user, message) {
        var li = document.createElement("li");
        li.className = "chat-message";
        li.innerHTML =
            '<span class="user">' + user + ':</span><span class="message">' + message + "</span>";
        messages.appendChild(li);
        }

        var openCloseButton = document.getElementById("openCloseButton");
        var chatBox = document.querySelector(".chat-box");

        // openCloseButton.addEventListener("click", function () {
        //   if (chatBox.style.display === "none") {
        //     chatBox.style.display = "block";
        //     openCloseButton.innerText = "Close Chat";
        //   } else {
        //     chatBox.style.display = "none";
        //     openCloseButton.innerText = "Open Chat";
        //   }
        // });

        function closeChat() {
          chatBox.style.display = "none";
          // get the image chat and make it visible
          let image = document.getElementById("open");
          image.style.display = "inline-block";
        }

        function mute() {
          document.querySelector(".chat-box img:nth-child(2)").style.display = "none";
          document.querySelector(".chat-box img:nth-child(3)").style.display = "inline-block";
        }

        function unmute() {
          document.querySelector(".chat-box img:nth-child(2)").style.display = "inline-block";
          document.querySelector(".chat-box img:nth-child(3)").style.display = "none";
        }

        function openChat() {
          chatBox.style.display = "block";
          // get the image chat and make it visible
          let image = document.getElementById("open");
          image.style.display = "none";
        }