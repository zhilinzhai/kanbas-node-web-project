import ClickEvent from './ClickEvent';
import PassingDataOnEvent from './PassingDataOnEvent';
import PassingFunctions from './PassingFunctions';
import EventObject from './EventObject';
import Counter from './Counter';
import BooleanStateVariables from './BooleanStateVariables';
import StringStateVariables from './StringStateVariables';
import DateStateVariables from './DateStateVariables';
import ObjectStateVariables from './ObjectStateVariables';
import ArrayStateVariables from './ArrayStateVariables';
import ParentStateComponent from './ParentStateComponent';
import ReduxExamples from "./ReduxExamples";
import TodoList from './ReduxExamples/todos/TodoList';


    export default function Lab4() {
        function sayHello() {
          alert("Hello");
        }
      
  return (
    <div id="wd-lab4" className="container-fluid">
      <h3>Lab 4</h3>
      <ClickEvent />
      <PassingDataOnEvent/>
      <PassingFunctions theFunction={sayHello} />
      <EventObject/>
      <Counter/>
      <BooleanStateVariables/>
      <StringStateVariables/>
      <DateStateVariables/>
      <ObjectStateVariables/>
      <ArrayStateVariables/>
      <ParentStateComponent/>
      <ReduxExamples/>
      <TodoList />
     
    </div>
  );
}



