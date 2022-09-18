/**
 * @author : karim Cheratt
 * @licence : MIT
 */

import React, { useState } from 'react';
import LocalDataStore from '../service/localdatastore';

/**
 * Karim Cheratt
 * 
 * - TaskTag : Composant UI pour Afficher la listes des tags sous form d'onglets
 * 
 */

export default function TaskTag() {

  const defaultTag = { id: "1", tagValue: "tous" };

  var savedTagList = LocalDataStore.getList('tag');
  const [tagList, setTagList] = useState([defaultTag].concat(savedTagList));
  const [selectedTag, setSelectedTag] = useState("1");

  document.addEventListener('update-datastore', function (e) {
    let savedTagList = LocalDataStore.getList('tag');
    setTagList([defaultTag].concat(savedTagList));
  });

  function selectTag(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedTag(e.currentTarget.value);
    document.dispatchEvent(new CustomEvent('selected-tag', {
      detail: { tagValue: e.currentTarget.value }
    }));
  }

  return (
    <ul className="border-b flex my-3">
      {
        tagList.map((tag, idx) => {
          let _key = 'tag-' + idx;
          let checked = (tag.id === selectedTag);
          return (<li key={_key}>
            <label>
              <input type="radio" value={tag.tagValue} name="selectTag" className="peer hidden"
                onChange={selectTag} defaultChecked={checked} />
              <span className='block border border-b-0 mr-2 rounded-t bg-white px-4 py-2 
                relative peer-checked:top-[1px] peer-checked:text-blue-700 
                capitalize text-gray-500 hover:cursor-pointer hover:text-blue-700'>
                {tag.tagValue}
              </span>
            </label>
          </li>);
        })
      }
    </ul>
  );

}