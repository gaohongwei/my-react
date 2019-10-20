import React from 'react'
import { Form, Field } from 'react-final-form'

export function WRadios({label,radios}){
  return(
    <div>
      <label>{label}</label>
      { radios.map(x=>(
        <label>
          <Field
            name="vradio"
            component="input"
            type="radio"
            value={x}
          />{'  '} {x}
        </label>

        ))}
    </div>

    )
}

export function WCheckboxes({label,checkboxes}){
  return (
    <div>
      <label>{label}</label>
      <div>
        {checkboxes.map(x=>(
          <label>
            <Field
              name="vcheckbox"
              component="input"
              type="checkbox"
              value={x}
            />{'  '} {x}
          </label>
        ))}
      </div>
    </div>
    )
}

export function WDropdown({label,options}){
  return (
    <div>
      <label>{label}</label>
      <Field name="favoriteColor" component="select">
        <option />
        {
          options.map(x=>(
            <option key={x.value} value={x.value}>{x.label}</option>
          ))
        }

      </Field>
    </div>

    )

}
