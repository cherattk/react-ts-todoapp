/**
 * @author : karim Cheratt
 * @licence : MIT
 */

/**
 * - Karim Cheratt
 * 
 * - interface DataStore
 * 
 * - Interface utiliser pour definir uniquement la signature 
 *    des methodes pour acceder au system de persistence des donnees (DataStore)
 * - Elle doit etre implementer par une class pour etre utilisee
 * 
 * 
 */
export default interface DataStore{

  setItem (store : string , item : any) : any;

  getItem (store : string , itemID : string) : any;

  getList(store : string) : any[] ; 

}