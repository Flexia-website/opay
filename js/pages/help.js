function renderHelpPage(container) {
  const { primaryColor } = Stores.customization.get();
  let messages = [
    { text: "Hello! I'm here to help you with any questions about OPay. What would you like to know?", isUser: false, timestamp: new Date() },
  ];
  let inputText = "";
  let isThinking = false;

  function generateResponse(userInput) {
    const l = userInput.toLowerCase();
    if (l.includes("transfer") || l.includes("send money")) return "To send money, go to your dashboard and tap 'To OPay' or 'To Bank'. Enter the recipient's details and amount, then confirm the transfer.";
    if (l.includes("balance") || l.includes("add money")) return "You can add money to your account by tapping the 'Add Money' button on your dashboard or going to Me → Adjust Balance.";
    if (l.includes("airtime") || l.includes("data")) return "To buy airtime or data, tap the respective service on your dashboard, enter your phone number and select the amount.";
    if (l.includes("transaction") || l.includes("history")) return "You can view your transaction history by tapping 'Transaction History' on your dashboard or from the balance card.";
    if (l.includes("security") || l.includes("safe")) return "Your OPay account is secured with advanced encryption. Always keep your login details private and use secure networks.";
    if (l.includes("help") || l.includes("support")) return "I'm here to help! You can ask me about transfers, payments, account management, or any OPay feature.";
    return "I can help you with transfers, payments, airtime/data purchases, transaction history, and account management. What specific topic would you like help with?";
  }

  function render() {
    container.innerHTML = `
    <div style="min-height:100vh;background:#f9fafb;display:flex;flex-direction:column;">
      <header style="background:white;padding:0.75rem;display:flex;align-items:center;gap:0.75rem;border-bottom:1px solid hsl(var(--border));">
        <button data-nav-back style="background:none;border:none;">${Icon("arrow-left", { size: 20 })}</button>
        <div class="flex items-center" style="gap:0.5rem;">
          <span style="color:${primaryColor};">${Icon("help-circle", { size: 20 })}</span>
          <h1 style="font-size:1.125rem;font-weight:600;margin:0;">Help &amp; Support</h1>
        </div>
      </header>

      <div id="messages-area" style="flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:1rem;min-height:60vh;max-height:65vh;">
        ${messages
          .map(
            (m) => `
          <div style="display:flex;justify-content:${m.isUser ? "flex-end" : "flex-start"};">
            <div style="max-width:80%;padding:0.75rem;border-radius:0.5rem;color:${m.isUser ? "black" : "white"};background:${m.isUser ? "#f1f5f9" : primaryColor};">
              <p style="font-size:0.875rem;margin:0;">${m.text}</p>
              <p style="font-size:10px;opacity:0.7;margin:4px 0 0;">${m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>`
          )
          .join("")}
        ${
          isThinking
            ? `<div style="display:flex;justify-content:flex-start;">
            <div style="background:#f1f5f9;padding:0.75rem;border-radius:0.5rem;">
              <div style="display:flex;gap:4px;">
                <div class="animate-pulse" style="width:0.5rem;height:0.5rem;background:#d1d5db;border-radius:9999px;"></div>
                <div class="animate-pulse" style="width:0.5rem;height:0.5rem;background:#d1d5db;border-radius:9999px;"></div>
                <div class="animate-pulse" style="width:0.5rem;height:0.5rem;background:#d1d5db;border-radius:9999px;"></div>
              </div>
            </div>
          </div>`
            : ""
        }
      </div>

      <div style="padding:1rem;background:white;border-top:1px solid hsl(var(--border));">
        <div class="flex items-center" style="gap:0.5rem;">
          <input id="chat-input" type="text" placeholder="Ask me anything about OPay..." class="input" style="flex:1;" value="${inputText}" />
          <button id="send-btn" style="padding:0.75rem;color:white;border-radius:0.5rem;border:none;background:${primaryColor};" ${!inputText.trim() || isThinking ? "disabled" : ""}>${Icon("send", { size: 20 })}</button>
        </div>
      </div>
    </div>`;

    container.querySelector("[data-nav-back]").addEventListener("click", () => navigate("/dashboard"));
    const input = container.querySelector("#chat-input");
    input.addEventListener("input", () => {
      inputText = input.value;
      container.querySelector("#send-btn").disabled = !inputText.trim() || isThinking;
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSend();
    });
    container.querySelector("#send-btn").addEventListener("click", handleSend);

    const area = container.querySelector("#messages-area");
    area.scrollTop = area.scrollHeight;
  }

  function handleSend() {
    if (!inputText.trim()) return;
    messages.push({ text: inputText, isUser: true, timestamp: new Date() });
    const userInput = inputText;
    inputText = "";
    isThinking = true;
    render();
    setTimeout(() => {
      messages.push({ text: generateResponse(userInput), isUser: false, timestamp: new Date() });
      isThinking = false;
      render();
    }, 1000);
  }

  render();
}

window.renderHelpPage = renderHelpPage;
