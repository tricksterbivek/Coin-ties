// Get HTML elements
const transferForm = document.getElementById("transfer-form");
const senderSelect = document.getElementById("sender-name");
const recipientSelect = document.getElementById("recipient-name");
const userTable = document.querySelector("#user-table tbody");

// User data
let users;

// Fetch user data from JSON file
fetch("users.json")
  .then(response => response.json())
  .then(data => {
    users = data;
    
    // Populate sender and recipient select options
    for (let user in users) {
      const option = document.createElement("option");
      option.value = user;
      option.text = users[user].name;
      senderSelect.add(option.cloneNode(true));
      if (user !== senderSelect.value) {
        recipientSelect.add(option);
      }
    }
    
    // Set initial balances in HTML table
    for (let user in users) {
      const row = userTable.insertRow();
      const nameCell = row.insertCell();
      const balanceCell = row.insertCell();
      nameCell.innerText = users[user].name;
      balanceCell.id = `${user}-balance`;
      balanceCell.innerText = users[user].balance;
    }
  })
  .catch(error => {
    console.log("Error fetching user data:", error);
  });

// Transfer function
function transferCoins(sender, recipient, amount) {
  // Check if sender has enough coins
  if (sender.balance < amount) {
    console.log("Insufficient balance.");
    return;
  }
  
  // Update sender balance
  sender.balance -= amount;
  
  // Update recipient balance
  recipient.balance += amount;
  
  // Update HTML table
  for (let user in users) {
    const balanceCell = document.getElementById(`${user}-balance`);
    balanceCell.innerText = users[user].balance;
  }
  
  // Log transaction details
  console.log(`${amount} coins transferred from ${sender.name} to ${recipient.name}`);
  console.log(`${sender.name}'s new balance: ${sender.balance}`);
  console.log(`${recipient.name}'s new balance: ${recipient.balance}`);
}

// Form submit event listener
transferForm.addEventListener("submit", function(event) {
  event.preventDefault();
  
  const senderName = senderSelect.value;
  const recipientName = recipientSelect.value;
  const amount = parseInt(document.getElementById("amount").value);

  // Check if sender and recipient names are valid
  if (!users[senderName]) {
    console.log("Invalid sender name.");
    return;
  }
  
  if (!users[recipientName]) {
    console.log("Invalid recipient name.");
    return;
  }
  
  // Check if sender and recipient are the same
  if (senderName === recipientName) {
    console.log("Sender and recipient cannot be the same.");
    return;
  }
  
  // Transfer coins
  transferCoins(users[senderName], users[recipientName], amount);
  
  // Reset form
  transferForm.reset();
});

// Update recipient select options when sender changes
senderSelect.addEventListener("change", function() {
  const currentSender = senderSelect.value;
  recipientSelect.innerHTML = "";
  for (let user in users) {
    if (user !== currentSender) {
      const option = document.createElement("option");
      option.value = user;
      option.text = users[user].name;
      recipientSelect.add(option);
    }
  }
});
