/**
 * Handler class that checks whether an intent can handle a request.
 *
 * Create an instance of the class, chain the necessary checks, then call
 * canHandle() to perform validation.
 */
class Handler {
  constructor(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const {
      supportedInterfaces
    } = handlerInput.requestEnvelope.context.System.device;

    this.request = request;
    this.attributes = attributes;
    this.supportedInterfaces = supportedInterfaces;

    // Default to true, if at any point the handler fails, set to false.
    this.valid = [true];
    this.branch = 0;
  }

  setValid(valid) {
    if (!valid) {
      this.valid[this.branch] = false;
    }

    return this;
  }

  or() {
    this.branch++;

    // Default to true for new or branch.
    this.valid[this.branch] = true;

    return this;
  }

  canHandle() {
    return this.valid.includes(true);
  }

  /**
   * Checks where the request is of a certain type.
   *
   * E.g. 'IntentRequest'
   */
  isType(type) {
    const valid = this.request.type === type;

    return this.setValid(valid);
  }

  /**
   * Check whether a request contains a certain intent.
   *
   * Passed intent can be a single intent, or an array.
   * If the intent matches any in the array, it passes validation.
   */
  isIntent(intents) {
    if (!intents.constructor === Array) {
      intents = [intents];
    }

    const valid =
      this.request.type === "IntentRequest" &&
      intents.includes(this.request.intent.name);

    return this.setValid(valid);
  }

  /**
   * Checks if the request is of type 'Display.ElementSelected',
   * and the passed token matches that of the request.
   *
   * Tokens take the format of tokenName-usersChoice
   */
  isListSelect(token) {
    const valid =
      this.request.type === "Display.ElementSelected" &&
      this.request.token &&
      this.request.token.split("-")[0] === token;

    return this.setValid(valid);
  }

  /**
   * Checks whether the request contains all of the
   * given attributes.
   */
  hasAttributes(attributes) {
    for (let attribute of attributes) {
      if (!this.attributes.hasOwnProperty(attribute)) {
        return this.setValid(false);
      }
    }

    return this;
  }

  /**
   * Checks whether the request has the given slots, and all
   * slots have a value.
   */
  hasSlots(slots) {
    const { intent } = this.request;

    if (!intent || !intent.slots) {
      return this.setValid(false);
    }

    for (let slot of slots) {
      if (!intent.slots[slot]) {
        return this.setValid(false);
      } else if (!intent.slots[slot].value) {
        return this.setValid(false);
      }
    }

    return this;
  }

  /**
   * Checks whether the alexa device being used, supports the given display(s).
   *
   * The display interfaces can be Display, AudioPlayer or VideoApp.
   */
  doesSupport(displayInterfaces) {
    if (displayInterfaces.constructor !== Array) {
      displayInterfaces = [displayInterfaces];
    }

    for (let displayInterface of displayInterfaces) {
      if (!(displayInterface in this.supportedInterfaces)) {
        return this.setValid(false);
      }
    }

    return this;
  }

  /**
   * Checks whether the alexa device being used, does not support the given display(s).
   *
   * The display interfaces can be Display, AudioPlayer or VideoApp.
   */
  doesNotSupport(displayInterfaces) {
    if (displayInterfaces.constructor !== Array) {
      displayInterfaces = [displayInterfaces];
    }

    for (let displayInterface of displayInterfaces) {
      if (displayInterface in this.supportedInterfaces) {
        return this.setValid(false);
      }
    }

    return this;
  }
}

module.exports = Handler;
