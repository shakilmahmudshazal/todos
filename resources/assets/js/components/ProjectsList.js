import axios from 'axios'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import NewProject from './NewProject'

import { Button, Checkbox, Input } from 'antd';

import 'antd/dist/antd.css';

const options = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

class ProjectsList extends Component {
  constructor() {
    super()

    this.state = {
      projects: [],
      name: '',
      description: '',
      errors: [],
      show: 1,
      filter: 1,
    }
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleCreateNewProject = this.handleCreateNewProject.bind(this)
    this.hasErrorFor = this.hasErrorFor.bind(this)
    this.renderErrorFor = this.renderErrorFor.bind(this)
    this.showCompleted = this.showCompleted.bind(this)
    this.showActive = this.showActive.bind(this)
    this.showAll = this.showAll.bind(this)
    this.clearCompleted = this.clearCompleted.bind(this)
  }

  componentDidMount() {
    this.reload();
  }

  reload() {

    axios.get('/api/projects').then(response => {
      this.setState({
        projects: response.data
      })
    })
  }

  handleFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleCreateNewProject(event) {
    event.preventDefault()

    const { history } = this.props

    const project = {
      name: this.state.name,
    }

    axios
      .post('/api/projects', project)
      .then(response => {
        // redirect to the homepage
        history.push('/')
      })
      .catch(error => {
        this.setState({
          errors: error.response.data.errors
        })
      })
      this.setState({name:""});
    this.reload();
  }

  hasErrorFor(field) {
    return !!this.state.errors[field]
  }

  renderErrorFor(field) {
    if (this.hasErrorFor(field)) {
      return (
        <span className='invalid-feedback'>
          <strong>{this.state.errors[field][0]}</strong>
        </span>
      )
    }
  }

  onChange(e, project) {

    //
    const { history } = this.props;
    if (e.target.checked) {
      project.is_completed = 1;
    }
    else {
      project.is_completed = 0;
    }

    axios
      .put(`/api/projects/${project.id}`, project, options)
      .then(response => history.push('/'))
  }
  onInputChange(e, project) {

    const { history } = this.props;

    project.name = e.target.value;


    axios
      .put(`/api/projects/${project.id}`, project, options)
      .then(response => history.push('/'))
  }

  showActive() {
    axios.get('/api/projects/active').then(response => {
      this.setState({
        filter: 2,
        projects: response.data
      })
    })
  }

  showCompleted() {
    axios.get('/api/projects/completed').then(response => {
      this.setState({
        projects: response.data,
        filter: 3,
      })
    })

  }

  showAll() {
    axios.get('/api/projects').then(response => {
      this.setState({
        filter: 1,
        projects: response.data,
      })
    })
  }

  clearCompleted() {
    const { filter } = this.state;
    axios.get(`/api/projects/clearCompeleted/${filter}`).then(response => {
      this.setState({
        projects: response.data
      })
    })
  }
  render() {
    const { projects } = this.state;
    return (
      <div>
        <div className='container py-4'>
          <div className='row justify-content-center'>
            <div className='col-md-8'>
              <div className='card'>
                <div className='card-header'>All Items</div>

                <div className='card-body'>
                  <form onSubmit={this.handleCreateNewProject}>
                    <div className='form-group'>
                      <label htmlFor='name'>Item name</label>
                      <input
                        id='name'
                        type='text'
                        className={`form-control ${this.hasErrorFor('name') ? 'is-invalid' : ''}`}
                        name='name'
                        value={this.state.name}
                        placeholder={'Enter your todos'}
                        onChange={this.handleFieldChange}
                      />
                      {this.renderErrorFor('name')}
                    </div>

                    <button className='btn btn-primary'>Create</button>
                  </form>

                  <ul className='list-group list-group-flush'>
                    {projects.map(project => (
                      <div
                        className='list-group-item list-group-item-action d-flex align-items-center'
                        key={project.id}
                      >
                        <Checkbox checked={project.is_completed} onChange={(e) => this.onChange(e, project)}> {' '}</Checkbox>
                        <Input defaultValue={project.name} onBlur={(e) => this.onInputChange(e, project)} />
                      </div>
                    ))}
                  </ul>
                </div>
                <div className='card-footer' style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Total Items : {projects.length} </span>
                  <Button type="link" onClick={this.showAll}> All</Button>
                  <Button type="link" onClick={this.showActive}> Active</Button>
                  <Button type="link" onClick={this.showCompleted}> Completed</Button>
                  <Button type="link" onClick={this.clearCompleted}> Clear Completed</Button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectsList
