import React from 'react'
import axios from 'axios'
import Form from './Form'

const URL = 'http://localhost:9000/api/todos'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      error: '',
      todoNameInput: '',
      displayCompleteds: true
    }


  }

  resetForm = () => this.setState({ ...this.state, todoNameInput: '' });

  setAxiosResponseError = (err) => this.setState({ ...this.state, error: err.response.data.message })

  fetchAllTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({ ...this.state, todos: res.data.data })
      })
      .catch(this.setAxiosResponseError)
  }

  postNewTodo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
      .then(res => {
        this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data) })
        this.resetForm();
      })
      .catch(this.setAxiosResponseError)
  }

  componentDidMount() {
    this.fetchAllTodos();
  }

  inputChange = evt => {
    const { value } = evt.target
    this.setState({ ...this.state, todoNameInput: value })
  }

  toggleCompleted = id => () => {
    axios.patch(`${URL}/${id}`)
      .then(res => {
        this.setState({
          ...this.state, todos: this.state.todos.map(td => {
            if (td.id != id) return td
            return res.data.data
          })
        })
      })
      .catch(this.setAxiosResponseError)
  }

  onTodoFormSubmit = evt => {
    evt.preventDefault();
    this.postNewTodo();
  }

  toggleDisplayCompleteds = () => {
    this.setState({ ...this.state, displayCompleteds: !this.state.displayCompleteds })
  }

  render() {
    return (
      <div>
        <div id='error'>Error: {this.state.error}</div>
        <div id='todos'>
          <h2>Todos:</h2>
          {
            this.state.todos.reduce((acc, td) => {
              if (this.state.displayCompleteds || !td.completed) return acc.concat(
                <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? ' ☑️' : ''}</div>
              );
              return acc;
            }, [])
            // return <div onClick={this.toggleCompleted(td.id)} key={td.id}>{td.name} {td.completed ? ' ☑️' : ''}</div>

          }
        </div>
        <Form
          onTodoFormSubmit={this.onTodoFormSubmit}
          todoNameInput={this.state.todoNameInput}
          inputChange={this.inputChange}
          toggleDisplayCompleteds={this.toggleDisplayCompleteds}
          displayCompleteds={this.state.displayCompleteds}
        />
      </div>
    )
  }
}

export default App;