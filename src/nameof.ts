/**
 * Converts a lambda function to a string in order to parse the dot-accessed property on the parameter type.
 * @param selector Lambda function representing selection of a property on the parameter type, ex. x => x.prop
 */
export function nameof<T extends Object>(selector: (obj: T) => any): string {
    let fnStr: string = selector.toString();
    let dotIndex: number = fnStr.indexOf(".");
    if (dotIndex > -1) {
        // "function(x) { return x.prop; }"
        // or
        // "(x) => { return x.prop; }"
        if (fnStr.indexOf("{") > -1) {
            return fnStr.substring(dotIndex + 1, fnStr.lastIndexOf(";"));
        }
        // "(x) => x.prop"
        else {
            return fnStr.substr(dotIndex + 1);
        }
    }
    else {
        throw new Error("Invalid property accessor function.");
    }
}