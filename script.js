const inventory = {
    screwdriver: { rack: "A1", bin: "B3", quantity: 25 },
    hammer: { rack: "A2", bin: "B1", quantity: 10 },
    wrench: { rack: "A3", bin: "B4", quantity: 15 },
    pliers: { rack: "A4", bin: "B2", quantity: 8 }
  };
  
  const validUsers = [
    { username: "Auto", password: "9283" },
  ];
  
  function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("loginMessage");
  
    const user = validUsers.find(user => user.username === username && user.password === password);
    if (user) {
      document.getElementById("loginPage").classList.add("hidden");
      document.getElementById("appPage").classList.remove("hidden");
    } else {
      loginMessage.textContent = "❌ Invalid username or password!";
    }
  }
  
  function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.classList.toggle("active");
    document.getElementById("overlay").style.display = menu.classList.contains("active") ? "block" : "none";
  }
  
  function goBack() {
    document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
    document.getElementById("main").classList.remove("hidden");
    clearInputs();
  }
  
  function clearInputs() {
    document.querySelectorAll("input").forEach(i => (i.value = ""));
    document.getElementById("searchResult").innerHTML = "";
  }
  
  function showSuggestions() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const suggestBox = document.getElementById("suggestBox");
    suggestBox.innerHTML = "";
    if (!input) return;
    Object.keys(inventory).forEach(item => {
      if (item.includes(input)) {
        const div = document.createElement("div");
        div.textContent = item;
        div.onclick = () => {
          document.getElementById("searchInput").value = item;
          suggestBox.innerHTML = "";
          searchItem();
        };
        suggestBox.appendChild(div);
      }
    });
  }
  
  function searchItem() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const item = inventory[input];
    const result = document.getElementById("searchResult");
    if (item) {
      result.innerHTML = `
        <p><strong>Item:</strong> ${input}</p>
        <p><strong>Rack:</strong> ${item.rack}</p>
        <p><strong>Bin:</strong> ${item.bin}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>`;
    } else {
      result.innerHTML = `<p style="color:red;">❌ Item not found!</p>`;
    }
  }
  
  function addItem() {
    const name = document.getElementById("newItem").value.toLowerCase();
    const rack = document.getElementById("newRack").value;
    const bin = document.getElementById("newBin").value;
    const qty = parseInt(document.getElementById("newQty").value);
    if (name && rack && bin && qty) {
      inventory[name] = { rack, bin, quantity: qty };
      alert("✅ Item added!");
      goBack();
    } else {
      alert("❌ Fill all fields!");
    }
  }
  
  function updateItem() {
    const name = document.getElementById("updateItem").value.toLowerCase();
    const qty = parseInt(document.getElementById("updateQty").value);
    if (inventory[name]) {
      inventory[name].quantity = qty;
      alert("✅ Quantity updated!");
      goBack();
    } else {
      alert("❌ Item not found!");
    }
  }
  
  function deleteItem() {
    const name = document.getElementById("deleteItem").value.toLowerCase();
    if (inventory[name]) {
      delete inventory[name];
      alert("✅ Item deleted!");
      goBack();
    } else {
      alert("❌ Item not found!");
    }
  }
  
  function downloadCSV() {
    let csv = "Item,Rack,Bin,Quantity\n";
    Object.keys(inventory).forEach(item => {
      const { rack, bin, quantity } = inventory[item];
      csv += `${item},${rack},${bin},${quantity}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "inventory.csv";
    a.click();
  }
  
  function startListening() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported!");
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = event => {
      document.getElementById("searchInput").value = event.results[0][0].transcript.toLowerCase();
      searchItem();
    };
  }
  
  function openAdd() {
    toggleMenu();
    goBack();
    document.getElementById("addSection").classList.remove("hidden");
  }
  
  function openUpdate() {
    toggleMenu();
    goBack();
    document.getElementById("updateSection").classList.remove("hidden");
  }
  
  function openDelete() {
    toggleMenu();
    goBack();
    document.getElementById("deleteSection").classList.remove("hidden");
  }
  
  function showSpares() {
    toggleMenu();
    goBack();
    const container = document.getElementById("sparesList");
    container.innerHTML = `
      <table>
        <tr><th>Item</th><th>Rack</th><th>Bin</th><th>Quantity</th></tr>
        ${Object.entries(inventory).map(([item, data]) =>
          `<tr><td>${item}</td><td>${data.rack}</td><td>${data.bin}</td><td>${data.quantity}</td></tr>`).join("")}
      </table>`;
    document.getElementById("sparesSection").classList.remove("hidden");
  }
  