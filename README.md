# ts-simple-nameof
Parses a class name or a dot-separated property name from a lambda expression and provides some level of type safety using type parameters.

## Simple Property Parsing
ts-simple-nameof is very simple. It's not smart. It simply stringifies the supplied lambda expression and parses the property or properties following the first dot after the lambda's argument.

```ts
// Returns "posts".
nameof<Comment>(c => c.user); // returns "user"
// Returns "user.posts".
nameof<Comment>(c => c.user.posts);
```

## Assertion operators
With strict null checking, sometimes properties that may be null will throw errors when passing a lambda to this method unless the non-null assertion operator (`!`) is used. Therefore, this method strips out `!` and `?` operators from the parsed property name.

```ts
class Parent {
    public child?: Child;
}

// Throws error "Object may be 'null'." with strict null checking enabled.
nameof<Parent>(p => p.child.prop);
// Mitigates error and returns "child.prop".
nameof<Parent>(p => p.child!.prop);
```

## Class Names
ts-simple-nameof now also returns the name of a class.

```ts
// Returns "User".
nameof(User);
```

## Installation
To add ts-simple-nameof to your project using NPM:

```
npm install --save ts-simple-nameof
```