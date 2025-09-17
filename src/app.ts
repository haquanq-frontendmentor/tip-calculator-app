import { setupTextField } from "./libs/setupTextField";
import { formatPrice } from "./utils/formatPrice";

const billTotalTextField = setupTextField("#bill-total-text-field", {
    type: "float",
    required: true,
});

const numberOfPeopleTextField = setupTextField("#number-of-people-text-field", {
    type: "integer",
    required: true,
});

const tipRatePercentageRadioField = (() => {
    const wrapper = document.querySelector("#tip-rate-radio-field") as HTMLElement;
    const hint = wrapper.querySelector(".radio-field__hint") as HTMLElement;

    const options: Array<{ button: HTMLElement; input: HTMLInputElement }> = [];

    wrapper.querySelectorAll(".radio-field__option").forEach((eleemnt) => {
        options.push({
            button: eleemnt as HTMLElement,
            input: eleemnt.querySelector(".radio-field__input") as HTMLInputElement,
        });
    });

    Array.from(wrapper.querySelectorAll(".radio-field__input") as NodeListOf<HTMLInputElement>);

    const customTipRatePercentageInput = wrapper.querySelector(".radio-field__custom-input") as HTMLInputElement;

    const helpers = {
        validate: () => {
            const notSelected = options.every((v) => v.input.checked === false);

            if (notSelected) {
                helpers.showError("Please select one.");
                return false;
            } else if (options[options.length - 1].input.checked && customTipRatePercentageInput.value === "") {
                helpers.showError("Can't be empty.");

                return false;
            }

            helpers.clearError();
            return true;
        },

        showError: (message: string) => {
            hint.textContent = message;
            wrapper.setAttribute("aria-invalid", "true");
        },

        clearError: () => {
            hint.textContent = "";
            wrapper.setAttribute("aria-invalid", "false");
        },

        getName: () => {
            return options[0].input.name;
        },

        getValue: (): number | null => {
            if (options[options.length - 1].input.checked) {
                if (customTipRatePercentageInput.value === "") return null;
                return parseFloat(customTipRatePercentageInput.value.replaceAll(",", "")) / 100;
            }

            const selectedOption = options.find((v) => v.input.checked);
            if (!selectedOption) return null;
            return parseFloat(selectedOption.input.value) / 100;
        },

        focus: () => {
            options[options.length - 1].input.focus();
        },

        reset: () => {
            options.forEach((v) => (v.input.checked = false));
            customTipRatePercentageInput.value = "";
            helpers.clearError();
        },
    };

    let validateTimeoutRequest: NodeJS.Timeout | null = null;

    const eventHandlers = {
        focusOutEvent: (e: FocusEvent) => {
            if (!wrapper.contains(e.relatedTarget as HTMLElement)) {
                validateTimeoutRequest = setTimeout(() => {
                    helpers.validate();
                }, 100);
            }
        },
        changeEvent: (e: Event) => {
            const input = e.target as HTMLInputElement;

            if (validateTimeoutRequest) clearTimeout(validateTimeoutRequest);

            if (options[options.length - 1].input.isEqualNode(input)) {
                customTipRatePercentageInput.disabled = false;
            } else {
                customTipRatePercentageInput.disabled = true;
                customTipRatePercentageInput.value = "";
            }
        },
    };

    options.forEach(({ input }) => {
        input.addEventListener("change", eventHandlers.changeEvent);
    });

    wrapper.addEventListener("focusout", eventHandlers.focusOutEvent);

    customTipRatePercentageInput.addEventListener("beforeinput", (e) => {
        if (e.data === "." && customTipRatePercentageInput.value.includes(".")) {
            e.preventDefault();
        }
    });

    const selectCustomOption = () => {
        customTipRatePercentageInput.disabled = false;
        requestAnimationFrame(() => {
            customTipRatePercentageInput.focus();
        });
    };

    options[options.length - 1].button.addEventListener("mouseup", () => {
        selectCustomOption();
    });

    options[options.length - 1].button.addEventListener("touchend", () => {
        selectCustomOption();
    });

    customTipRatePercentageInput.addEventListener("input", () => {
        customTipRatePercentageInput.value = customTipRatePercentageInput.value.replaceAll(/[^0-9]/g, "");
    });

    return { ...helpers };
})();

(() => {
    const tipCalculatorForm = document.querySelector(".calculator__form") as HTMLFormElement;
    const tipCalculatorFormResetButton = document.querySelector(".result__reset-btn") as HTMLButtonElement;
    const tipAmountPerPersonElement = document.querySelector("#tip-amount-per-person") as HTMLElement;
    const payAmountPerPersonAfterTipElement = document.querySelector("#pay-amount-per-person") as HTMLElement;

    const calculateTip = (billTotal: number, numberOfPeople: number, tipRate: number) => {
        const tipAmount = billTotal * tipRate;
        const tipAmountPerPerson = tipAmount / numberOfPeople;
        const payAmountPerPersonAfterTip = (billTotal + tipAmount) / numberOfPeople;
        return { tipAmountPerPerson, payAmountPerPersonAfterTip };
    };

    const showResult = (tipAmountPerPerson: number, payAmountPerPersonAfterTip: number) => {
        tipAmountPerPersonElement.textContent = formatPrice(tipAmountPerPerson);
        payAmountPerPersonAfterTipElement.textContent = formatPrice(payAmountPerPersonAfterTip);
        tipCalculatorFormResetButton.disabled = false;
    };

    const clearResult = () => {
        tipAmountPerPersonElement.textContent = formatPrice(0);
        payAmountPerPersonAfterTipElement.textContent = formatPrice(0);
        tipCalculatorFormResetButton.disabled = true;
    };

    tipCalculatorForm.addEventListener("input", () => {
        const billTotal = billTotalTextField.getValue();
        const numberOfPeople = numberOfPeopleTextField.getValue();
        const tipRate = tipRatePercentageRadioField.getValue();

        if (billTotal !== null && numberOfPeople !== null && tipRate !== null) {
            const result = calculateTip(billTotal, numberOfPeople, tipRate);
            showResult(result.tipAmountPerPerson, result.payAmountPerPersonAfterTip);
        } else {
            clearResult();
        }
    });

    tipCalculatorFormResetButton.addEventListener("click", () => {
        clearResult();
        billTotalTextField.reset();
        numberOfPeopleTextField.reset();
        tipRatePercentageRadioField.reset();
    });
})();
