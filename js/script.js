const customers = document.querySelector("#customers");
const addCustomer = document.querySelector("#addCustomer");
const single = document.querySelector("#single");
const transaction = document.querySelector("#transaction");
const transactionHistory = document.querySelector("#transactionHistory");
const deleteBtn = document.querySelector("#deleteBtn");
const infoList = ["name", "address", "phoneNumber", "balance"];

const readData = (key) => {
    let data;
    try {
        data = JSON.parse(localStorage.getItem(key));
        if(!Array.isArray(data)) {
            throw new Error('data isn\'t array');
        }
    }
    catch (e) {
        data = [];
    }
    return data;
};

const setData = (key, value) => {
    value = Array.isArray(value)? value : [];
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
}

const show = (customer) => {
    localStorage.setItem("customer", JSON.stringify(customer))
    window.location.replace("single.html");
}

if (addCustomer) {
    addCustomer.addEventListener("submit", function(event) {
        event.preventDefault();
        const customersData = readData("customers");
        const customer = {};
        try {
            customer.accountNumber = customersData[customersData.length-1].accountNumber +1;
        }
        catch (e) {
            customer.accountNumber = 5000;
        }
        infoList.forEach((item) => {
            customer[item] = this.elements[item].value;
        });
        customer.balance = Number(customer.balance);
        customer.balance = Number.isNaN(customer.balance)? 0 : customer.balance;
        console.log(customer.balance)
        customer.transactions = [];
        customersData.push(customer);
        setData("customers", customersData);
        window.location.replace("index.html");
    })
}

if (customers) {
    customers.innerHTML = "";
    const customersData = readData("customers");
    if (customersData !== []) {
        customersData.forEach((customer) => {
            const tr = document.createElement("tr");
            const accountNumber = document.createElement("td");
            accountNumber.innerText = customer.accountNumber;
            tr.appendChild(accountNumber);
            const name = document.createElement("td");
            name.innerText = customer.name;
            tr.appendChild(name);
            const showBtn = document.createElement("button");
            showBtn.classList = "btn btn-outline-info";
            showBtn.innerText = "Show";
            showBtn.addEventListener("click", (event) => {
                show(customer)
            })
            tr.appendChild(showBtn);
            customers.appendChild(tr);

        })
    }
}

if (single) {
    try {
        const customer = JSON.parse(localStorage.getItem("customer"));
        
        single.innerHTML = "";
        const tr = document.createElement("tr");

        const accountNumber = document.createElement("td");
        accountNumber.innerText = customer.accountNumber;
        tr.appendChild(accountNumber);

        const name = document.createElement("td");
        name.innerText = customer.name;
        tr.appendChild(name);

        const address = document.createElement("td");
        address.innerText = customer.address;
        tr.appendChild(address);

        const phoneNumber = document.createElement("td");
        phoneNumber.innerText = customer.phoneNumber;
        tr.appendChild(phoneNumber);

        const balance = document.createElement("td");
        balance.innerText = customer.balance;
        tr.appendChild(balance);

        single.appendChild(tr);
    }
    catch (e) {
        single.innerHTML = "No values yet";
    }
}

if (transaction) {
    transaction.addEventListener("submit", function(event) {
        event.preventDefault();
        const customer = JSON.parse(localStorage.getItem("customer"));
        const customersData = readData("customers");
        const newTransaction = {};
        newTransaction.type = this.elements.type.value;
        newTransaction.amount = Number(this.elements.amount.value);
        newTransaction.time = new Date();
        if (newTransaction.type === "withdraw") newTransaction.amount = -newTransaction.amount;
        let customerIndex;
        customersData.forEach((head, index) => {
            if (head.accountNumber == customer.accountNumber) {
                customerIndex = index;
            }
        })
        customersData[customerIndex].balance += newTransaction.amount;
        customer.balance += newTransaction.amount;
        customersData[customerIndex].transactions.push(newTransaction);
        customer.transactions.push(newTransaction);
        setData("customers", customersData);
        localStorage.setItem("customer", JSON.stringify(customer))
        console.log(customersData)
        window.location.reload();
    })
}

if (transactionHistory) {
    try {
        const customer = JSON.parse(localStorage.getItem("customer"));
        transactionHistory.innerHTML = "";
        customer.transactions.forEach(head => {
            const tr = document.createElement("tr");

            const type = document.createElement("td");
            type.innerText = head.type;
            tr.appendChild(type);

            const amount = document.createElement("td");
            amount.innerText = head.amount;
            tr.appendChild(amount);

            const time = document.createElement("td");
            time.innerText = head.time;
            tr.appendChild(time);
            transactionHistory.appendChild(tr);
        });
    }
    catch (e) {
        transactionHistory.innerHTML = "No values yet";
    }
}

if (deleteBtn) {
    deleteBtn.addEventListener("click", (event) => {
        event.preventDefault();
        const customersData = readData("customers");
        const customer = JSON.parse(localStorage.getItem("customer"));
        let customerIndex;
        customersData.forEach((head, index) => {
            if (head.accountNumber == customer.accountNumber) {
                customerIndex = index;
            }
        })
        customersData.splice(customerIndex, 1);
        localStorage.removeItem('customer');
        setData("customers", customersData);
        window.location.replace("index.html");
    })
}