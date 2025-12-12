import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [displayTodo, setDisplayTodos] = useState([]);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [toEdit, setToEdit] = useState(null);
  const [editInput, setEditInput] = useState(null);
  const [updateError, setUpdateError] = useState("");
  const [draggableItem, setDraggableItem] = useState("");
  const [dragOver, setDragOver] = useState(null);

  function setInputTodo() {
    setError("");
  }

  const onTodoFormSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const inputValue = formdata.get("todoInput");
    if (inputValue.length > 0) {
      setTodos((prev) => [...prev, { id: new Date().getTime(), name: inputValue }]);
      e.target.reset();
    } else {
      setError("Todo cannot be empty!!");
    }
  };

  function onDeleteTodoClick(id) {
    setToDelete(id);
    setError("");
    setToEdit(null);
    setEditInput("");
  }

  const handleDeleteConfirm = () => {
    setTodos((prev) => prev.filter((todo) => todo.id !== toDelete));
    setToDelete(null);
  };

  const handleDeleteCancel = () => {
    setToDelete(null);
  };

  function onEditTodoClick(id) {
    setToEdit(id);
    setEditInput(todos.filter((todo) => todo.id === id)?.[0]?.name);
    setError("");
    setToDelete(null);
  }

  function handleEditInputTodo(e) {
    setEditInput(e.target.value);
    setUpdateError("");
  }

  function handleUpdateTodo() {
    if (editInput?.length > 0) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === toEdit
            ? {
                ...todo,
                name: editInput,
              }
            : todo
        )
      );
      setEditInput("");
      setToEdit(null);
    } else {
      setUpdateError("Todo cannot be empty!!");
    }
  }

  function handleUpdateCancel() {
    setEditInput("");
    setToEdit(null);
    setUpdateError("");
  }

  function handleSearch(e) {
    setDisplayTodos(() => todos.filter((todo) => todo.name.includes(e.target.value)));
  }

  useEffect(() => {
    setDisplayTodos(todos);
  }, [todos]);

  function handleDragStart(e, item) {
    setDraggableItem(item);
    e.dataTransfer.setData("text/plain", "");
  }
  function handleDragEnd() {
    setDraggableItem(null);
    setDragOver(null);
  }
  function handleDragOver(e, todoId) {
    e.preventDefault();
    setDragOver(todoId);
  }
  function handleDrop(e, todo) {
    const draggableIndex = todos.indexOf(draggableItem);
    const ondropIndex = todos.indexOf(todo);
    if (draggableIndex > -1 && ondropIndex > -1) {
      setTodos((prevTodos) => {
        const newTodo = [...prevTodos];
        newTodo.splice(draggableIndex, 1);
        newTodo.splice(ondropIndex, 0, draggableItem);
        return newTodo;
      });
    }
  }

  return (
    <div className="App">
      <form onSubmit={onTodoFormSubmit}>
        <div className="inputContainer">
          <input type="text" id="todoInput" placeholder="Enter todo" name="todoInput" onChange={setInputTodo} />
          <button type="submit">Add</button>
        </div>
        <div className="error">{error}</div>
      </form>
      {todos.length > 1 && (
        <div className="searchContainer">
          <input type="text" placeholder="Search todo" name="todoSearch" onChange={handleSearch} />
        </div>
      )}
      <div className="todos">
        {todos && todos.length > 0 ? (
          displayTodo.map((todo) => {
            return (
              <div
                className={`todoItem ${draggableItem?.id === todo.id ? "draggable" : ""} ${dragOver === todo.id ? "dragover" : ""}`}
                key={todo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, todo)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, todo.id)}
                onDrop={(e) => handleDrop(e, todo)}
              >
                <div className="todo">{todo.name}</div>
                <button className="deleteTodo" onClick={() => onDeleteTodoClick(todo.id)}>
                  Delete
                </button>
                <button className="editTodo" onClick={() => onEditTodoClick(todo.id)}>
                  Edit
                </button>
              </div>
            );
          })
        ) : (
          <div>No todos added yet</div>
        )}
      </div>
      {toDelete && (
        <div className="deleteForm">
          <div className="formTitle">Are you sure to delete?</div>
          <div>Todo : {todos.filter((todo) => todo.id === toDelete)?.[0]?.name}</div>
          <div className="btnContainer">
            <button className="delete" onClick={handleDeleteConfirm}>
              Delete
            </button>
            <button className="cancel" onClick={handleDeleteCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {toEdit && (
        <div className="editForm">
          <div className="formTitle">Update Todo</div>
          <input type="text" placeholder="Enter todo" name="todoEdit" onChange={handleEditInputTodo} value={editInput} />
          <div className="error">{updateError}</div>
          <div className="btnContainer">
            <button className="update" onClick={handleUpdateTodo}>
              Update
            </button>
            <button className="cancel" onClick={handleUpdateCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
