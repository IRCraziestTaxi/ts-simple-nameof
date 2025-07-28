import { NameofOptions } from "./interfaces/nameof-options.interface";

function cleanseAssertionOperators(parsedName: string): string {
    return parsedName.replace(/[?!]/g, "");
}

function containsOptionalChaining(fnStr: string): boolean {
    // If optional chaining (p => p.child?.childProp) is used, the resulting fnStr is something like
    // p => { var _a; return (_a = p.child) === null || _a === void 0 ? void 0 : _a.childProp; } (es6)
    // or function (p) { var _a; return (_a = p.child) === null || _a === void 0 ? void 0 : _a.grandchild.grandchildProp; } (es5)
    // or function (p) { var _a; return (_a = p.child.grandchild) === null || _a === void 0 ? void 0 : _a.grandchildProp; }
    // or even function (p) { var _a, _b; return (_b = (_a = p.child) === null || _a === void 0 ? void 0 : _a.grandchild) === null || _b === void 0 ? void 0 : _b.grandchildProp; }
    // depending on the placement of the operator(s).
    return fnStr.includes("=== null") || fnStr.includes("===null");
}

function handleOptionalChaining(fnStr: string, options?: NameofOptions): string {
    // See comments in `containsOptionalChaining` for explanation.
    const propsRegex = /\.\w+/gi;
    const propMatches = fnStr.match(propsRegex);

    if (!propMatches) {
        throw new Error(
            "ts-simple-nameof: No prop match after detecting optional chaining."
            + " Avoiding optional chaining with ts-simple-nameof is recommended."
        );
    }

    // Input string: "p => p.child.grandchild.grandchildProp" (with an optional chaining operator in one or more places)
    // results in propMatches of [".child", ".grandchild", ".grandchildProp"]
    const propStr = (options && options.lastProp)
        // ".grandchildProp"
        ? propMatches[propMatches.length - 1]
        // ".child.grandchild.grandchildProp"
        : propMatches.join("");

    // Remove the leading "."
    return propStr.substring(1);
}

export function nameof<T extends Object>(nameFunction: ((obj: T) => any) | { new(...params: any[]): T }, options?: NameofOptions): string {
    const fnStr = nameFunction.toString();

    // ES6 class name:
    // "class ClassName { ..."
    if (
        fnStr.startsWith("class ")
        // Theoretically could, for some ill-advised reason, be "class => class.prop".
        && !fnStr.startsWith("class =>")
    ) {
        // Check whether ClassName extends a base class.
        const terminator = fnStr.indexOf(" extends") > -1 ? fnStr.indexOf(" extends") : fnStr.indexOf(" {");

        return cleanseAssertionOperators(
            fnStr.substring(
                "class ".length,
                terminator
            )
        );
    }

    // ES6 prop selector:
    // "x => x.prop" or "x => { return x.prop; }" (handled by arrowWithReturnRegex)
    if (fnStr.includes("=>")) {
        if (containsOptionalChaining(fnStr)) {
            return handleOptionalChaining(fnStr, options);
        }

        const arrowWithReturnRegex = /\s*(\()?\w+(\))?\s*=>\s*\{[\r\n\s]*return\s+\w+[?!]?\.((\w+[?!]?\.)*(\w+))/i;
        const arrowWithReturnMatch = fnStr.match(arrowWithReturnRegex);

        if (arrowWithReturnMatch) {
            return cleanseAssertionOperators(
                (options && options.lastProp)
                    ? arrowWithReturnMatch[5]
                    : arrowWithReturnMatch[3]
            );
        }

        return cleanseAssertionOperators(
            fnStr.substring(
                (options && options.lastProp)
                    ? fnStr.lastIndexOf(".") + 1
                    : fnStr.indexOf(".") + 1
            )
        );
    }

    // ES5 prop selector:
    // "function (x) { return x.prop; }"
    // webpack production build excludes the spaces and optional trailing semicolon:
    // "function(x){return x.prop}"
    // FYI - during local dev testing i observed carriage returns after the curly brackets as well
    // Note by maintainer: See https://github.com/IRCraziestTaxi/ts-simple-nameof/pull/13#issuecomment-567171802 for explanation of this regex.
    const matchRegex = /function\s*\(\w+\)\s*\{[\r\n\s]*return\s+\w+\.((\w+\.)*(\w+))/i;
    const es5Match = fnStr.match(matchRegex);

    if (es5Match) {
        return (options && options.lastProp)
            ? es5Match[3]
            : es5Match[1];
    }

    // ES5 class name:
    // "function ClassName() { ..."
    // Can also reach this block if using optional chaining and targeting es5.
    if (fnStr.startsWith("function ")) {
        if (containsOptionalChaining(fnStr)) {
            return handleOptionalChaining(fnStr, options);
        }

        return cleanseAssertionOperators(
            fnStr.substring(
                "function ".length,
                fnStr.indexOf("(")
            )
        );
    }

    // Invalid function if none of the above cases were encountered.
    throw new Error("ts-simple-nameof: Invalid function provided.");
}
