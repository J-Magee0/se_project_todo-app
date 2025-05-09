import { v4 as uuidv4 } from "https://jspm.dev/uuid";

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../utils/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoButton = document.querySelector(".button_action_add");
const todosList = document.querySelector(".todos__list");
const addTodoForm = document.forms["add-todo-form"];
const todoCounter = new TodoCounter(initialTodos, ".counter__text");

const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (evt, inputValues) => {
    const name = inputValues.name;
    const dateInput = inputValues.date;

    // Create a date object and adjust for timezone
    const date = new Date(dateInput);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    const id = uuidv4();
    const values = { name, date, id };
    const todoElement = generateTodo(values);
    section.addItem(todoElement);
    addTodoPopup.close();
    todoCounter.updateTotal(true);

    newTodoValidator.resetValidation();
  },
});

addTodoPopup.setEventListeners();

const handleCheck = (completed) => {
  todoCounter.updateCompleted(completed);
};

const handleDelete = (completed) => {
  if (completed) {
    todoCounter.updateCompleted();
  }
};

const handleTotal = () => {
  todoCounter.updateTotal(false);
};

const generateTodo = (data) => {
  const todo = new Todo(
    data,
    "#todo-template",
    handleCheck,
    handleDelete,
    handleTotal
  );
  const todoElement = todo.getView();
  return todoElement;
};

addTodoButton.addEventListener("click", () => {
  addTodoPopup.open();
});

const section = new Section({
  items: initialTodos,
  renderer: (items) => {
    const todo = generateTodo(items);
    todosList.append(todo);
  },
  containerSelector: ".todos__list",
});

section.renderItems();

const newTodoValidator = new FormValidator(validationConfig, addTodoForm);

newTodoValidator.enableValidation();
