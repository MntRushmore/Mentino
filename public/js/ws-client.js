// WebSocket client for real-time messaging
// This is a stub — will be activated when WebSocket server is fully implemented

(function () {
  const messagesContainer = document.querySelector("[data-messages]");
  if (!messagesContainer) return;

  const matchId = messagesContainer.dataset.matchId;
  if (!matchId) return;

  // WebSocket connection (stub — server needs to support upgrade)
  // const ws = new WebSocket(`ws://${window.location.host}/ws?match_id=${matchId}`);
  // ws.onmessage = (event) => {
  //   const msg = JSON.parse(event.data);
  //   appendMessage(msg.content, msg.senderName, false);
  // };

  function appendMessage(content, senderName, isMe) {
    const div = document.createElement("div");
    div.className = `flex ${isMe ? "justify-end" : "justify-start"}`;
    div.innerHTML = `
      <div class="max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}">
        <p class="text-sm">${content}</p>
        <p class="text-xs mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}">${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
      </div>
    `;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
})();
