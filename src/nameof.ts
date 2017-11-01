/**
 * Converts a lambda function to a string in order to parse the dot-accessed property on the parameter type.
 * @param selector Lambda function representing selection of a property on the parameter type, ex. x => x.prop
 */
export function nameof<T extends Object>(selector: (obj: T) => any): string {
    let fnStr: string = selector.toString();
    let dotIndex: number = fnStr.indexOf(".");
    if (dotIndex > -1) {
        // ES5
        // "function(x) { return x.prop; }"
        // or
        // "function(x) { return x.prop }"
        // or
        // "function(x) {return x.prop}"
        if (fnStr.indexOf("{") > -1) {
            let endingIndex = -1;
            let endsWithSemicolon = fnStr.lastIndexOf(";");
            let endsWithSpace = fnStr.lastIndexOf(" }");
            let endsWithBrace = fnStr.lastIndexOf("}");

            if (endsWithSemicolon > -1) {
                endingIndex = endsWithSemicolon;
            }
            else if (endsWithSpace > -1) {
                endingIndex = endsWithSpace;
            }
            else if (endsWithBrace > -1) {
                endingIndex = endsWithBrace;
            }
            else {
                throw new Error("ts-simple-nameof: Invalid function syntax.");
            }

            return fnStr.substring(dotIndex + 1, endingIndex);
        }
        // ES6
        // "(x) => x.prop"
        else {
            return fnStr.substr(dotIndex + 1);
        }
    }
    else {
        throw new Error("ts-simple-nameof: Invalid property accessor function.");
    }
}