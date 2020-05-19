import { NameofOptions } from "./interfaces/nameof-options.interface";

/**
 * Converts a lambda function to a string in order to parse the dot-accessed property on the parameter type.
 * @param selector Lambda function representing selection of a property on the parameter type, ex. x => x.prop
 */
export declare function nameof<T extends Object>(selector: (obj: T) => any, options?: NameofOptions): string;

/**
 * Converts a class into a function string in order to parse the class's name.
 * @param classType The class whose name to get.
 */
export declare function nameof<T extends Object>(classType: { new (...params: any[]): T; }): string;
