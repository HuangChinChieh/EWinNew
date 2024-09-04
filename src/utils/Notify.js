export class Notify extends EventTarget {
    on(eventName, callback) {
      this.addEventListener(eventName, callback);
    }
  
    off(eventName, callback) {
      this.removeEventListener(eventName, callback);
    }
  
    notify(eventName, data) {    
      const event = new CustomEvent(eventName, {detail:data});
      this.dispatchEvent(event);
    }
  };
