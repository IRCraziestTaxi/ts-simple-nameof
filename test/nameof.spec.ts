import { nameof } from "../src/nameof";

class Parent {
    public child: Child;

    private _prop: string;

    public constructor() {
        this._prop = "";
    }

    public get prop(): string {
        return this._prop;
    }

    public set prop(value: string) {
        this._prop = value;
    }

    public func(callback: (...args: any[]) => void): void {
    }
}

class Child {
    public parent: Parent;

    private _prop: string;

    public constructor() {
        this._prop = "";
    }

    public get prop(): string {
        return this._prop;
    }

    public set prop(value: string) {
        this._prop = value;
    }

    public func(callback: (...args: any[]) => void): void {
    }
}

describe("nameof", () => {
    it("parses prop", () => {
        const parsedName = nameof<Parent>(p => p.prop);

        expect(parsedName)
            .toBe("prop");
    });

    it("parses multiple props", () => {
        const parsedName = nameof<Parent>(p => p.child.prop);

        expect(parsedName)
            .toBe("child.prop");
    });

    it("parses props with assertion operators", () => {
        const parsedName = nameof<Parent>(p => p.child!.prop);

        expect(parsedName)
            .toBe("child.prop");
    });

    it("parses class name", () => {
        const parsedName = nameof(Parent);

        expect(parsedName)
            .toBe("Parent");
    });
});
