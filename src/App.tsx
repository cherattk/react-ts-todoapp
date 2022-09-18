/**
 * @author : karim Cheratt
 * @licence : MIT
 */

import TaskForm from "./ui/task-form";
import TaskList from "./ui/task-list";
import TaskTag from "./ui/task-tag";

function App() {

  return (
    <div className="py-10 bg-slate-100 min-h-screen">
      <div className="w-1/2 mx-auto p-10 bg-white shadow-lg rounded">
        <h1 className="text-2xl font-bold mb-10 text-blue-700">React-TS TODO App</h1>
        <TaskForm />
        <TaskTag/>
        <TaskList />
      </div>
    </div>
  );
}

export default App;
