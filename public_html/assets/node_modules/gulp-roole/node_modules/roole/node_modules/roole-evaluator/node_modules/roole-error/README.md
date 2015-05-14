# roole-error

Roole error objects

## Installation

	npm install roole-error;

## Example

```javascript
var RooleError = require('roole-error');
throw new RooleError('message', node);
```

The created error object will contain a `loc` property which comes from `node.loc`.

## API

### var err = new RooleError(msg, [node])

* `msg` - A string of error message.
* `node` - Optional. The node causing the error. If passed, the returned error object will contain the location info.
* `err` - the created error object