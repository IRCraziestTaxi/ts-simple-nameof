function cleanseAssertionOperators(parsedName: string): string {
    return parsedName.replace(/[?!]/g, "");
}

export function nameof<T extends Object>(nameFunction: ((obj: T) => any) | { new(...params: any[]): T }): string {
    const fnStr = nameFunction.toString();

    // ES6 class name:
    // "class ClassName { ..."
    if (
        fnStr.startsWith("class ")
        // Theoretically could, for some ill-advised reason, be "class => class.prop".
        && !fnStr.startsWith("class =>")
    ) {
        return cleanseAssertionOperators(
            fnStr.substring(
                "class ".length,
                fnStr.indexOf(" {")
            )
        );
    }

    // ES6 prop selector:
    // "x => x.prop"
    if (fnStr.includes("=>")) {
        return cleanseAssertionOperators(
            fnStr.substring(
                fnStr.indexOf(".") + 1
            )
        );
    }

    // ES5 prop selector:
    // "function (x) { return x.prop; }"
    if ((new RegExp(/function(\s)?\(/, "g")).test(fnStr)) {
        const firstDotIndex = fnStr.indexOf(".");
        const semicolonIndex = fnStr.indexOf(";");

        return cleanseAssertionOperators(
            fnStr.substring(
                firstDotIndex + 1,
                semicolonIndex
            )
        );
    }

    // ES5 class name:
    // "function ClassName() { ..."
    if (fnStr.startsWith("function ")) {
        return cleanseAssertionOperators(
            fnStr.substring(
                "function ".length,
                fnStr.indexOf("(")
            )
        );
    }

    // Invalid function.
    throw new Error("ts-simple-nameof: Invalid function.");
}
