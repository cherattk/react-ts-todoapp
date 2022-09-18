/**
 * @author : karim Cheratt
 * @licence : MIT
 */

import React, { useState } from 'react';
import LocalDataStore from '../service/localdatastore';
import { TagRegex } from './util';

type tagType = { id: string, tagValue: string }

/**
 *  Karim Cheratt
 * 
 * - TaskForm : Composant UI pour Ajouter une tache a la liste des taches
 * 
 */

export default function TaskForm() {

  const _emptyTask = { id: '', content: '', completed: 0 };
  const [task, setTask] = useState(_emptyTask);

  function taskContentValue(event: React.FormEvent<HTMLInputElement>): void {
    setTask({ id: "", content: event.currentTarget.value, completed: 0 });
  }

  /**
   * Verifier les doublons et/ou ajouter les nouveaux tags
   * 
   */
  function groupTagList(list: string[]): tagType[] {
    let _savedList = LocalDataStore.getList('tag');
    var tagValueList: string[] = [];
    var result: tagType[] = [];
    _savedList.forEach((tag) => {
      // recuperer les valeur des tag
      tagValueList.push(tag.tagValue);
    });
    // une boucle pour verifier si les nouveaux tag exist dans les tag dejas enregsitres
    // si le nouveau tag n'existe pas dans la liste
    // on ajoute le nouveau tag dans la liste
    list.forEach((tagValue, idx) => {
      if (!tagValueList.includes(tagValue)) {
        let _id = new Date().getTime().toString() + idx;
        result.push({ id: _id, tagValue: tagValue }); // on ajoute le nouveau tag dans la liste
      }
    });

    return _savedList.concat(result);
  }

  function getTagList(chaine: string): string[] | null {
    // Regex pour recuprer les tags qui commencent avec le symbole '#'
    let rgx = TagRegex;
    let tag = chaine.match(rgx);
    if (tag) {
      tag.forEach((v, i, arr) => {
        // supprimer le symbole '#' et les espaces blancs a la fin du tag
        arr[i] = v.substring(1).trim().toLowerCase();
      });
    }
    return tag;
  }

  function saveTask(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (task.content.trim() !== "") {
      let _taskTagList = getTagList(task.content);
      if (_taskTagList) {
        let tagList = groupTagList(_taskTagList);
        // let tagList = _taskTagList;
        tagList?.forEach((tag, idx) => {
          if (!tag.id) {
            tag.id = (new Date()).getTime().toString() + idx;
          }
          LocalDataStore.setItem('tag', tag);
        });
      }
      let _id = new Date().getTime().toString();
      LocalDataStore.setItem('task', {
        id: _id,
        content: task.content,
        completed: 0,
        tag: _taskTagList
      });
      setTask(_emptyTask);
    }
  }

  return (
    <div className="mt-3 mb-5">
      <form onSubmit={(e) => saveTask(e)}>
        <div className='md:flex'>
          <input type="text" value={task.content} onChange={e => taskContentValue(e)}
            placeholder='tache a faire...'
            className="block w-full px-3 py-1.5 text-base font-normal
            bg-white
            border border-solid border-gray-300
            rounded
            m-0 mr-3
            focus:border-blue-600 focus:outline-none"/>
          <input type="submit" value="OK"
            className='active:bg-blue-400 bg-blue-500 hover:cursor-pointer 
          focus:bg-blue-700 font-medium hover:bg-blue-700 px-5 py-2 
          rounded text-white text-xs uppercase' />
        </div>
        <p className='text-xs text-gray-500 my-3 pl-3'>
          Pour ajouter un tag, il suffit d'ecrire
          <em className='font-bold'> #nom-tag </em>avant la tache.
          &nbsp;
          ex : <em className='font-bold'>#maison </em>acheter le lait. 
        </p>
        
      </form>
    </div>
  );
}