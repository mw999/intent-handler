# intent-handler

A wrapper for the [Node ASK SDK](https://ask-sdk-for-nodejs.readthedocs.io/en/latest/) that provides readable intent flow.

## Installation

1. Install dependency `npm install intent-handler --save`
2. Import the intent handler `const Handler = require('intent-handler')`

## Usage

Out of the box, the Node ASK SDK lets us choose which handler is executed for a given request. This is done with the following:

```javascript
canHandle(handlerInput) {
  return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
},
```

With the `intent-handler` module you can now make `canHandle()` methods much more readable in your Alexa skills.

```javascript
const Handler = require('intent-handler')

canHandle(handlerInput) {
  const handler = Handler(handlerInput);

  return handler.isIntent('HelloWorldIntent').canHandle();
},
```

Create an instance of the class, chain the necessary checks, then call `canHandle()` to perform validation.

## Display Templates

Display Templates can be used to present information on an echo devices screen. Using these in an intent handler will causes devices that do not support Display interfaces to fail.

This can be solved by using the `doesSupport()` method to create two separate handlers for display devices, and non display devices.

Scope on Display for an intent:

```javascript
canHandle(handlerInput) {
  return Handler(handlerInput)
    .isIntent('MyIntent')
    .doesSupport('Display') // User has a Echo Show or Echo Spot.
    .canHandle();
},
handler {
  // Use features only supported on Display devices.
}
```

And create a handler for non Display devices:

```javascript
canHandle(handlerInput) {
  return Handler(handlerInput)
    .isIntent('MyIntent')
    .doesNotSupport('Display') // User has a standard audio only Echo device.
    .canHandle();
},
handler {
  // Use features supported on every device.
}
```

## Handling Multiple Intents

Sometimes you want the same handler to handle multiple intents, with optional requirements. This can be done by chaining the `or()` method onto the handler.

```javascript
Handler(handlerInput)
  .isIntent("MyIntent")
  .hasAttributes(["name"])
  .or()
  .isIntent("MyOtherIntent")
  .canHandle();
```

## API

### `isType(type)`

Check if a request is a certain type.

```javascript
Handler(handlerInput)
  .isType("IntentRequest")
  .canHandle();
```

### `isIntent(intentName)`

Check if a request is any of the given intents.

```javascript
Handler(handlerInput)
  .isIntent("TestIntent")
  .canHandle();
```

### `hasSlots(slots)`

Check if a request has all of the given slots filled.

Returns true if request has every slot value filled.

```javascript
Handler(handlerInput)
  .hasSlots(["name"]) // User has given name so we can store it as an attribute.
  .canHandle();
```

### `hasAttributes(attributes)`

Check if a request contains one or many attributes.

Returns true if request has every attribute.

```javascript
Handler(handlerInput)
  .hasAttributes(["name"]) // User has given name so we can reply using their name.
  .canHandle();
```

### `doesSupport(displayInterfaces)`

Check if the device that sent the request supports the given interface.

Lets us show information on an Echo device that has a screen for example.

```javascript
Handler(handlerInput)
  .doesSupport("Display") // User has a Echo Show or Echo Spot.
  .canHandle();
```

### `doesNotSupport(displayInterfaces)`

Check if the device that sent the request does not support the given interface.

Lets us prevent a Display specific handler from handling an intent on an audio only device.

```javascript
Handler(handlerInput)
  .doesNotSupport("Display") // User isn't using a Echo Show or Echo Spot.
  .canHandle();
```
