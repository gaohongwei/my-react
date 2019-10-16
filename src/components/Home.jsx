/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { Form, Field } from 'react-final-form'
import {WRadios,WCheckboxes, WDropdown} from './tools/widgets'
import 'bootstrap/dist/css/bootstrap.min.css';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
  await sleep(300)
  window.alert(JSON.stringify(values, 0, 2))
}

const checkboxes = ['checkbox1', "checkbox2"];
const radios = ['radio1', 'radio2', 'radio3'];
const colors = [
  {value: '#ff0000', label: '❤️ Red'},
  {value: '#00ff00', label: '💚 Green'},
  {value: '#0000ff', label: '💙 Blue'}
];


const Home = () => (
  <div>
    <h1>React Final Form - Simple Example</h1>
    <Form
      onSubmit={onSubmit}
      initialValues={{ vradio: 'radio1', vcheckbox: ['checkbox1','checkbox2'], employed: true }}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <Field
              name="firstName"
              component="input"
              type="text"
              placeholder="First Name"
            />
          </div>
          <div>
            <label>Last Name</label>
            <Field
              name="lastName"
              component="input"
              type="text"
              placeholder="Last Name"
            />
          </div>
          <div>
            <label>Employed</label>
            <Field name="employed" component="input" type="checkbox" />
          </div>


           <WDropdown label='My Checkboxes' options = {colors} />

          <WRadios label='My Checkboxes' radios = {checkboxes} />
          <WRadios label='My Radios' radios = {radios} />
          <div>
            <label>Notes</label>
            <Field name="notes" component="textarea" placeholder="Notes" />
          </div>
          <div className="buttons">
            <button
              type="submit"
              disabled={submitting || pristine}
              className='btn btn-success'
            >
              Submit</button>
            <button
              type="button"
              onClick={form.reset}
              disabled={submitting || pristine}
              className='btn btn-primary'
            >
              Reset</button>
          </div>
          <pre>{JSON.stringify(values, 0, 2)}</pre>
        </form>
      )}
    />
  </div>
)
export default Home;
