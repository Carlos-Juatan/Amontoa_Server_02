// src/utils/Observable.js
class Observable {
  constructor() {
    this.observers = [];
  }

  // Adiciona um observador (função de callback)
  subscribe(callback) {
    this.observers.push(callback);
  }

  // Remove um observador
  unsubscribe(callback) {
    this.observers = this.observers.filter(observer => observer !== callback);
  }

  // Notifica todos os observadores com os dados fornecidos
  notify(data) {
    this.observers.forEach(observer => observer(data));
  }
}

export const screenChangeObservable = new Observable();