/**
 * @author : karim Cheratt
 * @licence : MIT
 */

import DataStore from './datastore';

/**
 *    Karim Cheratt
 * 
 * - Implementation de l'interface DataStore
 * - Cette classe utilise le "window.localStorage" pour stocker les donnees
 * 
 */
class LocalDataStore implements DataStore {

  private _InMemoryDataStore = {
    "task": new Map(),
    "tag": new Map()
  };

  private storeName: string[] = ['task', 'tag'];

  private getStore(storeName: string): Map<any, any> {
    // cette ligne c'est pour pouvoir acceder au proprietes
    // de l'objet dynamiquement avec une variable
    type ObjectKey = keyof typeof this._InMemoryDataStore;
    var _store = this._InMemoryDataStore[storeName as ObjectKey];
    return _store;
  }

  constructor() {
    // chargement de la liste des tache en memoire
    this.storeName.forEach((_storeName: string) => {
      var _localStore = window.localStorage.getItem(_storeName);
      var _dataStore: any[] = [];
      if (_localStore) {
        _dataStore = JSON.parse(_localStore);
        let store = this.getStore(_storeName);
        _dataStore.forEach((item) => {
          store.set(item.id, item);
        }, this);
      }
      window.localStorage.setItem(_storeName, JSON.stringify(_dataStore));
    })
  }


  /**
   * Sauvegarder la liste des taches dans window.localStorage
   */
  saveStore(storeName: string) {
    var data: any[] = [];
    let store = this.getStore(storeName);
    store.forEach(function (item: any) {
      data.push(item);
    });
    window.localStorage.setItem(storeName, JSON.stringify(data));
    document.dispatchEvent(new CustomEvent('update-datastore'));
  }

  setItem(storeName: string, item: any): any {
    let store = this.getStore(storeName);
    store.set(item.id, item);
    this.saveStore(storeName);
  }

  getItem(storeName: string, itemID: string): any {
    let store = this.getStore(storeName);
    let item = store.get(itemID);
    return item;
  }

  getList(storeName: string): any[] {
    let store = this.getStore(storeName);
    // recuprer un iterateur des valeurs
    let valueIterator = store.values();
    // construire un tableau a partir de l'iterateur
    let anyList: any[] = Array.from(valueIterator);
    return anyList;
  }


}

export default new LocalDataStore();