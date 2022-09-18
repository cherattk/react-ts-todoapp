/**
 * @author : karim Cheratt
 * @licence : MIT
 */

import React from 'react';
import LocalDataStore from '../service/localdatastore';
import {TagRegex} from './util';

/**
 * Karim Cheratt
 * 
 * - TaskList : Composant UI pour afficher la liste des Taches
 * 
 */
export default class TaskList extends React.Component {

  state = {
    taskList: LocalDataStore.getList('task'),
    tagValue: "tous" // default value
  };

  componentDidMount() {
    var self = this;
    // - l'evenement est declancher par LocalDataStore.setItem()
    // - il sert a notifier les composant que la datastore a ete mis a jour
    document.addEventListener('update-datastore', function (e) {
      let list = LocalDataStore.getList('task');
      self.setState({ taskList: list });
    });

    // update task list when user select a tag tab
    document.addEventListener('selected-tag', function (e: CustomEvent) {
      self.setState({tagValue : e.detail.tagValue});
    } as EventListener);
  }

  setCompleted(itemID: string, completed: number) {
    let max = this.state.taskList.length;
    for (let i = 0; i < max; i++) {
      let item = this.state.taskList[i];
      if (item.id === itemID) {
        item.completed = completed;
        LocalDataStore.setItem('task', item);
        i = max; // sortir de la loop
      }
    }

  }

  filderTaskByTag() {
    let list = LocalDataStore.getList('task');
    var result = list;
    /** 
     * si le tag est different du tag par defaut qui est "tous" alors 
     * on filtre la liste des taches
    */
    if (this.state.tagValue !== 'tous') {
      result = list.filter((task) => {
        return task.tag.includes(this.state.tagValue);
      });
    }
    return result;
  }

  /**
   * Filtrer la liste des tache selon le status "completed"
   * les valeur de possibles de "completed" sont 1 pour "terminer" ou 0 pour "a faire" 
   * 
   * @returns { tood : Task[] , completed : Task[]}
   */
  filterTaskByStatus(taskList : any[]) {
    var listTodo: any[] = [];
    var listCompleted: any[] = [];
    taskList.forEach((item, idx) => {
      let _tagBadge = item.tag.map((t : string , idx : number ) => {
      return <span key={'b-' + item.id + idx} className='font-normal bg-slate-100 rounded-full px-3 py-1 text-sm'>{t}</span>
    });
    let _taskContent = item.content.replace(TagRegex , "");
      let _key = 'task-' + idx;
      if (item.completed === 0) {
        listTodo.push(<li key={_key} className="p-3 border-b flex justify-between items-center">
          <span className='py-1 flex w-full mr-7 justify-between items-center'>
            {_taskContent} <span>{_tagBadge}</span>
          </span>
          <button className='w-5 h-5 rounded-full border bg-white border-blue-500 hover:bg-blue-300'
            onClick={this.setCompleted.bind(this, item.id, 1)}></button>
        </li>);
      }
      // completed task
      else if (item.completed === 1) {
        listCompleted.push(<li key={_key} className="p-3 border-b flex justify-between">
          <span className='py-1 flex w-full mr-7 justify-between items-center'>
            <span className='line-through text-gray-400 '>{_taskContent}</span>
            <span>{_tagBadge}</span>
          </span>
          <button className='w-5 h-5 border-0 text-blue-500 hover:text-blue-700 hover:font-bold'
            onClick={this.setCompleted.bind(this, item.id, 0)}>&#10004;</button>
        </li>);
      }
    }, this);

    return {
      todo: listTodo,
      completed: listCompleted
    };
  }

  renderEmptyState() {
    return (<li className="p-3 text-center">La Liste Des T&acirc;ches est Vide</li>);
  }

  render() {
    var taskByTag = this.filderTaskByTag();
    var list = this.filterTaskByStatus(taskByTag);
    return (
      <div className="my-3 text-left">
        <h3 className='py-4 border-b font-bold text-sky-500 flex justify-between'>
          <span>&Agrave; faire</span>
        </h3>

        <ul>
          {list.todo.length > 0 ? list.todo : <li className="p-3 border-b">aucune t&acirc;che &agrave; faire</li>}
        </ul>

        <details>
          <summary className='p-4 hover:bg-slate-100 hover:cursor-pointer border-b marker:text-sky-500 font-bold text-sky-500'>
            <span className='pl-3'>Termin&eacute;es</span>
          </summary>
          <ul>
            {list.completed.length > 0 ? list.completed : <li className="p-3 border-b">aucune t&acirc;che termin&eacute;e</li>}
          </ul>
        </details>
      </div>
    );
  }
}