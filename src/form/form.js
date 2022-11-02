import {Button, InputLabel, Select, TextField} from '@mui/material'
import React, {useState} from 'react'
import { saveProduct } from '../Services/productsServices';
const Form = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState({name: '', type: '', size: ''})
  const validateField = ({name, value}) => {
    setFormError(prevState => ({...prevState, [name]: value.length ? '' : `The ${name} is required`}))
  }
  const validateForm  = ({name, type, size}) => {
    validateField({name: 'name', value: name });
    validateField({name: 'size', value: size });
    validateField({name: 'type', value: type });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    const {name, size, type} = e.target.elements
    validateForm({name: name.value, size: size.value, type: type});
    await saveProduct();
    setIsSaving(false);
  }
  const handleBlur = e => {
    const {name, value} = e.target
   validateField({name, value})
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
        <Select labelId="type" id="type" value="" name='type' label="type">
          <option value="electronic">electronic</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
        </Select>
        {formError.type.length && <p>{formError.type}</p>}
        <Button type="submit" disabled={isSaving}>Submit</Button>
      </form>
    </React.Fragment>
  )
}

export default Form
