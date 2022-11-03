import React, { useState } from 'react';
import { Button, CardContent, Card, CssBaseline, Grid, TextField, Typography } from '@mui/material';
import { saveProduct } from '../Services/productsServices';
import {
  CREATED_STATUS,
  ERROR_STATUS_CODE,
  INVALID_REQUEST_STATUS,
} from '../Constants/httpCode';

const Form = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formError, setFormError] = useState({
    name: '',
    type: '',
    size: '',
  })

  const getFormValues = ({ name, size, type }) => {
    return {
      name: name.value,
      size: size.value,
      type: type.value,
    }
  }
  const handleFetchErrors = async error => {
    if (error.status === ERROR_STATUS_CODE) {
      setErrorMessage('Unexpected error, please try again')
      return
    }
    if (error.status === INVALID_REQUEST_STATUS) {
      const data = await error.json()
      setErrorMessage(data.message)
      return
    }
    setErrorMessage('Connection error, please try later');
  }
  const validateField = ({ name, value }) => {
    setFormError(prevState => ({
      ...prevState,
      [name]: value.length ? '' : `The ${name} is required`,
    }))
  }
  const validateForm = ({ name, type, size }) => {
    validateField({ name: 'name', value: name })
    validateField({ name: 'size', value: size })
    validateField({ name: 'type', value: type })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSaving(true)
    const { name, size, type } = e.target.elements
    validateForm(getFormValues({ name, size, type }))

    try {
      const response = await saveProduct(getFormValues({ name, size, type }))
      if (!response.ok) {
        throw response
      }
      if (response.status === CREATED_STATUS) {
        e.target.reset()
        setIsSuccess(true)
      }
    } catch (error) {
      handleFetchErrors(error)
    }

    setIsSaving(false)
  }
  const handleBlur = e => {
    const { name, value } = e.target
    validateField({ name, value })
  }
  return (
    <Card>
      <CardContent>
        
        <Typography variant='h6' component='h2' align='center'>
          Create product
        </Typography>
        {isSuccess && <Typography component='h6' variant='p'> Product Stored</Typography>}
        <Typography component='h6' variant='p'>
          {errorMessage}
        </Typography>
      </CardContent >
      <CardContent>
        <CssBaseline />
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                id="name"
                helperText={formError.name}
                onBlur={handleBlur}
                error={!!formError.name.length}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Size"
                id="size"
                name="size"
                helperText={formError.size}
                onBlur={handleBlur}
                error={!!formError.size.length}
              />
            </Grid>
            <Grid item xs={12} >
              <TextField
                fullWidth
                label="Type"
                id="type"
                name="type"
                helperText={formError.type}
                onBlur={handleBlur}
                error={!!formError.type.length}
              />
            </Grid>



            {/* <InputLabel id="type">Type</InputLabel>
         <Select labelId="type" id="type" name="type" label="type">
          <option value="electronic">electronic</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
        </Select> */}
            <Grid item xs={12} >
              <Button type="submit" disabled={isSaving}>
                Submit
              </Button>
            </Grid>

          </Grid>

        </form>
      </CardContent>
    </Card>
  )
}

export default Form
