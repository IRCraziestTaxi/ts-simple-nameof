import { nameof } from "../src/nameof";

class Parent {
    public child: Child;

    private _prop: string;

    public constructor() {
        this._prop = "";
    }

    public get parentProp(): string {
        return this._prop;
    }

    public set parentProp(value: string) {
        this._prop = value;
    }

    public func(callback: (...args: any[]) => void): void {
    }
}

class Child {
    public grandchild: Grandchild;
    public parent: Parent;

    private _prop: string;

    public constructor() {
        this._prop = "";
    }

    public get childProp(): string {
        return this._prop;
    }

    public set childProp(value: string) {
        this._prop = value;
    }

    public func(callback: (...args: any[]) => void): void {
    }
}

class Grandchild {
    public parentChild: Child;

    private _prop: string;

    public constructor() {
        this._prop = "";
    }

    public get grandchildProp(): string {
        return this._prop;
    }

    public set grandchildProp(value: string) {
        this._prop = value;
    }

    public func(callback: (...args: any[]) => void): void {
    }
}

class BaseClass {}

class DerivedClass extends BaseClass {}

describe("nameof", () => {
    it("parses prop", () => {
        const parsedName = nameof<Parent>(p => p.parentProp);

        expect(parsedName)
            .toBe("parentProp");
    });

    it("parses multiple props", () => {
        const parsedName = nameof<Parent>(p => p.child.childProp);

        expect(parsedName)
            .toBe("child.childProp");
    });

    it("parses props with not null assertion operator", () => {
        const parsedName = nameof<Parent>(p => p.child!.childProp);

        expect(parsedName)
            .toBe("child.childProp");
    });

    it("parses props with optional chaining operators", () => {
        const parsedNameOne = nameof<Parent>(p => p.child?.grandchild.grandchildProp);
        const parsedNameTwo = nameof<Parent>(p => p.child.grandchild?.grandchildProp);
        const parsedNameThree = nameof<Parent>(p => p.child?.grandchild?.grandchildProp);

        expect(parsedNameOne)
            .toBe("child.grandchild.grandchildProp");
        expect(parsedNameTwo)
            .toBe("child.grandchild.grandchildProp");
        expect(parsedNameThree)
            .toBe("child.grandchild.grandchildProp");
    });

    it("parses last prop with optional chaining operator and lastProp option", () => {
        const parsedNameOne = nameof<Parent>(p => p.child?.grandchild.grandchildProp, { lastProp: true });
        const parsedNameTwo = nameof<Parent>(p => p.child.grandchild?.grandchildProp, { lastProp: true });
        const parsedNameThree = nameof<Parent>(p => p.child?.grandchild?.grandchildProp, { lastProp: true });

        expect(parsedNameOne)
            .toBe("grandchildProp");
        expect(parsedNameTwo)
            .toBe("grandchildProp");
        expect(parsedNameThree)
            .toBe("grandchildProp");
    });

    it("parses class name", () => {
        const parsedName = nameof(Parent);

        expect(parsedName)
            .toBe("Parent");
    });

    it("parses last prop with lastProp option", () => {
        const parsedName = nameof<Parent>(p => p.child.grandchild.grandchildProp, { lastProp: true });

        expect(parsedName)
            .toBe("grandchildProp");
    });

    it("parses derived class name", () => {
        const parsedName = nameof(DerivedClass);

        expect(parsedName)
            .toBe("DerivedClass");
    });

    it("parses arrow function with return", () => {
        const parsedNameWithoutParens = nameof<Parent>(p => {
            return p.child.childProp;
        });
        const parsedNameWithParens = nameof<Parent>((p) => {
            return p.child.childProp;
        });

        expect(parsedNameWithoutParens)
            .toBe("child.childProp");
        expect(parsedNameWithParens)
            .toBe("child.childProp");
    });

    it("parses arrow function with return and not null assertion operator", () => {
        const parsedName = nameof<Parent>(p => {
            return p.child!.childProp;
        });

        expect(parsedName)
            .toBe("child.childProp");
    });

    it("parses arrow function with return and lastProp option", () => {
        const parsedName = nameof<Parent>(p => {
            return p.child.grandchild.grandchildProp;
        }, { lastProp: true });

        expect(parsedName)
            .toBe("grandchildProp");
    });

    it("parses arrow function with return and optional chaining operators", () => {
        const parsedNameOne = nameof<Parent>(p => {
            return p.child?.grandchild.grandchildProp;
        });
        const parsedNameTwo = nameof<Parent>(p => {
            return p.child.grandchild?.grandchildProp;
        });
        const parsedNameThree = nameof<Parent>(p => {
            return p.child?.grandchild?.grandchildProp;
        });

        expect(parsedNameOne)
            .toBe("child.grandchild.grandchildProp");
        expect(parsedNameTwo)
            .toBe("child.grandchild.grandchildProp");
        expect(parsedNameThree)
            .toBe("child.grandchild.grandchildProp");
    });

    it("parses arrow function with return and optional chaining operators and lastProp option", () => {
        const parsedNameOne = nameof<Parent>(p => {
            return p.child?.grandchild.grandchildProp;
        }, { lastProp: true });
        const parsedNameTwo = nameof<Parent>(p => {
            return p.child.grandchild?.grandchildProp;
        }, { lastProp: true });
        const parsedNameThree = nameof<Parent>(p => {
            return p.child?.grandchild?.grandchildProp;
        }, { lastProp: true });

        expect(parsedNameOne)
            .toBe("grandchildProp");
        expect(parsedNameTwo)
            .toBe("grandchildProp");
        expect(parsedNameThree)
            .toBe("grandchildProp");
    });
});
