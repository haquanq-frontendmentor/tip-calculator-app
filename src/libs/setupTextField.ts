type TextFieldPresets = { type: "integer" | "float"; required: boolean };

export const setupTextField = (id: `#${string}`, preset: TextFieldPresets) => {
    const wrapper = document.querySelector(id) as HTMLElement;
    const input = wrapper.querySelector(".text-field__input") as HTMLInputElement;
    const hint = wrapper.querySelector(".text-field__hint") as HTMLParagraphElement;

    input.required = preset.required;

    const helpers = {
        validate: () => {
            let errorMessage = "";
            if (input.validity.valueMissing) {
                errorMessage = "Can't be empty.";
            }

            if (errorMessage !== "") {
                helpers.showError(errorMessage);
                return false;
            }

            helpers.clearError();
            return true;
        },
        showError: (message: string) => {
            wrapper.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-invalid", "true");
            hint.textContent = message;
        },
        clearError: () => {
            wrapper.setAttribute("aria-invalid", "false");
            input.setAttribute("aria-invalid", "false");
            hint.textContent = "";
        },
        getName: () => {
            return input.name;
        },
        getValue: (): number | null => {
            if (input.value === "") return null;
            return parseFloat(input.value.replaceAll(",", ""));
        },
        focus: () => {
            input.focus();
        },
        reset: () => {
            helpers.clearError();
            input.value = "";
        },
    };

    const eventHandlers = {
        beforeInputEvent: (e: InputEvent) => {
            if (e.data === "." && input.value.includes(".")) {
                e.preventDefault();
            }
        },
        inputEvent: () => {
            const regex = preset.type === "float" ? /[^0-9.]/g : /[^0-9]/g;
            const parsedValue = input.value.replaceAll(regex, "");
            input.value = parsedValue;
        },
        blurEvent: () => {
            const newValue = parseFloat(input.value).toLocaleString("en-US", {
                maximumFractionDigits: 2,
            });
            input.value = newValue === "NaN" ? "" : newValue;
            helpers.validate();
        },
        focusEvent: () => {
            input.value = input.value.replaceAll(",", "");
        },
    };

    input.addEventListener("beforeinput", eventHandlers.beforeInputEvent);
    input.addEventListener("input", eventHandlers.inputEvent);
    input.addEventListener("blur", eventHandlers.blurEvent);
    input.addEventListener("focus", eventHandlers.focusEvent);
    return { ...helpers };
};
