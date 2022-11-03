import React from 'react'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import Form from './form'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {CREATED_STATUS, ERROR_STATUS_CODE, INVALID_REQUEST_STATUS} from '../Constants/httpCode'

//use it or test.only when you running a test
const server = setupServer(
  rest.post('/products', (req, res, ctx) => {
    const {name, type, size} = req.body
    if (name && type && size) {
      return res(ctx.status(CREATED_STATUS))
    }
    return res(ctx.status(ERROR_STATUS_CODE))
  }),
)

beforeAll(() => server.listen())

afterAll(() => server.close())

beforeEach(() => render(<Form />))

afterEach(() => server.resetHandlers())

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
    fireEvent.blur(screen.getByLabelText(/size/i), {
      target: {name: 'type', value: ''},
    })
    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument()
    expect(screen.queryByText(/the type is required/i)).toBeInTheDocument()
  })
})
describe('When the user submits the form', () => {
  it('Should the submit button be disabled until the request is done', async () => {
    const caseButton = screen.getByRole('button', {name: /submit/i})

    expect(caseButton).not.toBeDisabled()

    fireEvent.click(caseButton)

    expect(caseButton).toBeDisabled()

    await waitFor(() => expect(caseButton).not.toBeDisabled())
  })

  it('The page must display success message and clean the field values', async () => {
    const caseName = screen.getByLabelText(/name/i)
    const caseSize = screen.getByLabelText(/size/i)
    const caseType = screen.getByLabelText(/type/i)

    fireEvent.change(caseName, {target: {name: 'name', value: 'My product'}})
    fireEvent.change(caseSize, {target: {name: 'size', value: '10'}})
    fireEvent.change(caseType, {target: {name: 'type', value: 'electronic'}})

    fireEvent.click(screen.getByRole('button', {name: /submit/i}))

    await waitFor(() =>
      expect(screen.getByText(/product stored/i)).toBeInTheDocument(),
    )
  })
})
describe('When the user submits the form and the server returns an unexpected error', () => {
  it("The form page must display the error message 'Unexpected error, please try again'", async () => {
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))
    await waitFor(() =>
      expect(
        screen.getByText(/Unexpected error, please try again/i),
      ).toBeInTheDocument(),
    )
  })
})
describe('When the user submits the form and the server returns an invalid request errors', () => {
  it("The form page must display the error message 'The form is invalid, the fields are required' ", async () => {
    server.use(
      rest.post('/products', (req, res, ctx) => {
        return res(
          ctx.status(INVALID_REQUEST_STATUS),
          ctx.json({
            message:
              'The form is invalid, the fields name, size, type are required',
          }),
        )
      }),
    )
    //use server to mock request of services
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))
    await waitFor(() =>
      expect(
        screen.getByText(
          /The form is invalid, the fields name, size, type are required/i,
        ),
      ).toBeInTheDocument(),
    )
  })
})

describe('When the user submits the form and the server returns an invalid request errors', () => {
  it("The form page must display the error message 'connection error, please try later' ", async () => {
    server.use(
      rest.post('/products', (req, res, ctx) => res.networkError('Failed to connect')),
    )
    //use server to mock request of services
    fireEvent.click(screen.getByRole('button', {name: /submit/i}))
    await waitFor(() =>
      expect(
        screen.getByText(
          /connection error, please try later/i,
        ),
      ).toBeInTheDocument(),
    )
  })
})
