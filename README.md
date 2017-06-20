# ts-simple-nameof
Parses a dot-separated property name from a lambda expression and provides some level of type safety using type parameters.

## Simple Property Parsing
ts-simple-nameof is very simple. It's not smart. It simply stringifies the supplied lambda expression and parses the property or properties following the first dot after the lambda's argument.

```typescript
import { nameof } from "ts-simple-nameof";

nameof<IUser>(u => u.posts); // returns "posts"
nameof<IUser>(u => u.posts.comments); // returns "posts.comments"
```

## Installation
To add ts-simple-nameof to your project using NPM:

```
npm install --save ts-simple-nameof
```