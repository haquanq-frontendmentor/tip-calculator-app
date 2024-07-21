const tipOption = {
    optionsElement: document.querySelectorAll(".tip-rate__radiobox__input"),
    tipInputElement: document.querySelector("#tip-custom"),
    messageElement: document.querySelector("#tip-rate-hint"),
    clear() {
        this.optionsElement.forEach((element) => (element.checked = false));
        this.tipInputElement.value = "";
    },
    checkValid() {
        let valid = this.tipInputElement.value != "";

        if (!valid) {
            this.optionsElement.forEach((element) => {
                if (element.checked) {
                    valid = true;
                }
            });
        }

        if (valid) {
            this.messageElement.textContent = "";
        } else {
            this.messageElement.textContent = "Must choose one";
        }

        return valid;
    },
    getValue() {
        if (this.tipInputElement.value.length > 0) {
            return parseInt(this.tipInputElement.value) / 100;
        }

        let v = "";
        this.optionsElement.forEach((el) => {
            if (el.checked) v = el.value;
        });
        return parseInt(v) / 100;
    },
    handleOptionFocus(e) {
        this.tipInputElement.value = "";
    },
    handleTipInputKeydown(e) {
        const excludedKeys = ["+", "-", "E", "e", "."];
        if (excludedKeys.includes(e.key)) {
            e.preventDefault();
        }
    },
    handleTipInputChanged(e) {
        let v = e.target.value;
        if (v.length > 3) v = "999";
        e.target.value = v;
    },
    init() {
        this.optionsElement.forEach((element) => {
            element.addEventListener("focus", (e) => {
                this.handleOptionFocus;
            });
        });
        this.tipInputElement.addEventListener("input", (e) => this.handleTipInputChanged(e));
        this.tipInputElement.addEventListener("keydown", (e) => this.handleTipInputKeydown(e));
    },
};

const billTextbox = {
    inputElement: document.querySelector("#bill-total"),
    messageElement: document.querySelector("#bill-input-hint"),

    clear() {
        this.inputElement.value = "";
    },
    getValue() {
        return parseFloat(this.inputElement.value);
    },
    checkValid() {
        const valid = this.inputElement.value != "";
        if (valid) {
            this.messageElement.textContent = "";
            this.inputElement.setAttribute("aria-invalid", "false");
        } else {
            this.messageElement.textContent = "Can't be zero";
            this.inputElement.setAttribute("aria-invalid", "true");
        }
        return valid;
    },
    handleKeyDown(e) {
        const excludedKeys = ["+", "-", "E", "e"];
        if (excludedKeys.includes(e.key)) {
            e.preventDefault();
        }
    },
    handleValueChanged(e) {
        if (parseFloat(e.target.value) >= 1000000) {
            e.target.value = "999999";
        }
    },
    init() {
        this.inputElement.addEventListener("keydown", (e) => this.handleKeyDown(e));
        this.inputElement.addEventListener("input", (e) => this.handleValueChanged(e));
    },
};

const numberOfPersonTextbox = {
    inputElement: document.querySelector("#person-count"),
    messageElement: document.querySelector("#person-count-input-hint"),
    clear() {
        this.inputElement.value = "";
    },
    getValue() {
        return parseInt(this.inputElement.value);
    },
    checkValid() {
        const valid = this.inputElement.value != "";
        if (valid) {
            this.messageElement.textContent = "";
            this.inputElement.setAttribute("aria-invalid", "false");
        } else {
            this.messageElement.textContent = "Can't be zero";
            this.inputElement.setAttribute("aria-invalid", "true");
        }
        return valid;
    },
    handleValueChanged(e) {
        let v = e.target.value;
        if (v.length > 3) v = "999";
        e.target.value = v;
    },
    handleKeydown(e) {
        const excludedKeys = ["+", "-", "E", "e", "."];
        if (excludedKeys.includes(e.key)) {
            e.preventDefault();
        }
    },
    init() {
        this.inputElement.addEventListener("input", (e) => this.handleValueChanged(e));
        this.inputElement.addEventListener("keydown", (e) => this.handleKeydown(e));
    },
};

const tipCalculatorApp = {
    form: document.querySelector(".calculator__form"),
    tipPerPersonElement: document.querySelector("#tip-per-person"),
    totalPerPersonElement: document.querySelector("#total-per-person"),
    resetButton: document.querySelector("#calculator-reset-btn"),
    resultText: document.querySelector("#calculator-result-text"),
    handleSubmit(e) {
        e.preventDefault();
        const valid = [billTextbox.checkValid(), numberOfPersonTextbox.checkValid(), tipOption.checkValid()].every(
            (v) => v
        );
        if (!valid) return;

        const billTotal = billTextbox.getValue();
        const tipRate = tipOption.getValue();
        const personCount = numberOfPersonTextbox.getValue();

        const tipPerPerson = (billTotal * tipRate) / personCount;
        const totalPerPerson = (billTotal + billTotal * tipRate) / personCount;

        this.tipPerPersonElement.textContent = tipPerPerson.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
            style: "currency",
            currency: "USD",
        });

        this.totalPerPersonElement.textContent = totalPerPerson.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
            style: "currency",
            currency: "USD",
        });

        const a = tipPerPerson
            .toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            })
            .split(".");
        const b = totalPerPerson

            .toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            })
            .split(".");

        this.resultText.textContent = `Tip amount per person: ${a[0]} dollars ${
            a.length > 1 ? "and " + a[1] + " cents" : ""
        }, total per person: ${b[0]} dollars ${b.length > 1 ? "and " + b[1] + " cents" : ""}`;

        this.resetButton.removeAttribute("disabled");
    },
    handleResetClick() {
        numberOfPersonTextbox.clear();
        billTextbox.clear();
        tipOption.clear();
        this.tipPerPersonElement.textContent = "$0.00";
        this.totalPerPersonElement.textContent = "$0.00";
        this.resultText.textContent = "";
        this.resetButton.setAttribute("disabled", "");

        billTextbox.inputElement.focus();
    },
    init() {
        billTextbox.init();
        numberOfPersonTextbox.init();
        tipOption.init();

        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        this.resetButton.addEventListener("click", (e) => this.handleResetClick(e));
    },
};

tipCalculatorApp.init();
