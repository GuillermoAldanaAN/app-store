import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import Form from './form';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

//use it or test.only when you running a test
const server = setupServer(
  rest.post('/products', (req, res, ctx) => {
    return res(ctx.status(201))}
    )
)

beforeAll(() => server.listen())

afterEach(() => server.resetHandlers())

afterAll(() => server.close())

beforeEach(() => render(<Form />))

describe('When the form is mounted ', () => {
  

  test('there must be a create product form page', () => {
    const caseTitle = screen.getByRole('heading', {name: /create product/i})

    expect(caseTitle).toBeInTheDocument()
  })
  test('should exists the fields: name, type, size (electronic, furniture,clothing )', () => {
    const caseName = screen.getByLabelText(/name/i)
    const caseSize = screen.getByLabelText(/size/i)
    const caseType = screen.getByLabelText(/type/i)

    expect(caseName).toBeInTheDocument()
    expect(caseSize).toBeInTheDocument()
    expect(caseType).toBeInTheDocument()

    //const caseValueOne = screen.queryByText(/electronic/i);
    //const caseValueTwo = screen.queryByText(/furniture/i);
    //const caseValueThree = screen.queryByText(/clothing/i);

    //expect(caseValueOne).toBeInTheDocument();
    //expect(caseValueTwo).toBeInTheDocument();
    //expect(caseValueThree).toBeInTheDocument();
  })
  test('Should exists the submit button, ', () => {
    expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument()
  })
})
describe('When the user submit without values', () => {
  it('should display validation messages', () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).not.toBeInTheDocument()

    const buttonEvent = screen.getByRole('button', {name: /submit/i})
    fireEvent.click(buttonEvent)

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()
  })
})
describe('When the user blurs an empty field', () => {
  it('Should display validation message', () => {
    fireEvent.blur(
      screen.getByLabelText(/name/i, {target: {name: 'name', value: ''}}),
    )
    fireEvent.blur(screen.getByLabelText(/size/i), {
      target: {name: 'size', value: ''},
    })

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
  })
})
describe('When the user submits the form', () => {
  it('Should the submit button be disabled until the request is done', async () => {
    const caseButton = screen.getByRole('button',{name: /submit/i})
    
    expect(caseButton).not.toBeDisabled()

    fireEvent.click(caseButton)

    expect(caseButton).toBeDisabled()

    await waitFor(() => 
      expect(caseButton).not.toBeDisabled()
    )
  })
})