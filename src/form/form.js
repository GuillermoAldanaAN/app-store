import {Button, InputLabel, Select, TextField} from '@mui/material'
import React, {useState} from 'react'

const Form = () => {
  const [formError, setFormError] = useState({name: '', type: '', size: ''})
  const handleSubmit = e => {
    e.preventDefault()
    const {name, size, type} = e.target.elements

    if (!name.value) {
      setFormError(prevState => ({...prevState, name: 'The name is required'}))
    }
    if (!size.value) {
      setFormError(prevState => ({...prevState, size: 'The size is required'}))
    }
    if (!type) {
      setFormError(prevState => ({...prevState, type: 'The type is required'}))
    }
  }
  const handleBlur = e => {
    const {name, value} = e.target
    setFormError({
      ...formError,
      [name]: value.length ? '' : `The ${name} is required`,
    })
  }
  return (
    <React.Fragment>
      <h2>Create product</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="name"
          name="name"
          id="name"
          helperText={formError.name}
          onBlur={handleBlur}
        />
        <TextField
          label="size"
          id="size"
          name="size"
          helperText={formError.size}
          onBlur={handleBlur}
        />
        <InputLabel id="type">Type</InputLabel>
        <Select labelId="type" id="type" value="" label="type">
          <option value="electronic">electronic</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
        </Select>
        {formError.type.length && <p>{formError.type}</p>}
        <Button type="submit">Submit</Button>
      </form>
    </React.Fragment>
  )
}

export default Form
