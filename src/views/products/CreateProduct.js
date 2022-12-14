import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from './../../services/Api'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CRow,
  CFormSelect,
  CAlert,
} from '@coreui/react'

const CreateProduct = () => {
  const navigate = useNavigate()
  const [params, setParams] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: '',
  })
  const [categories, setCategories] = useState([])
  const [validated, setValidated] = useState(false)
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState([])

  const handleSubmit = async (event) => {
    const form = document.getElementById('create-form')
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
      setValidated(true)
      return
    }

    try {
      await Api.post('/products', params)
      navigate('/products')
    } catch (error) {
      setError(true)
      if (error.response.status === 422) {
        let errorMessage = []
        errorMessage = error.response.data.error.map((value) => {
          return value.loc[1] + ': ' + value.msg
        })
        setErrorMsg(errorMessage)
      } else {
        setErrorMsg((current) => [...current, error.response.data.error])
      }
    }
  }

  const handleChange = (e) => {
    setParams((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  useEffect(() => {
    getCategory()
  }, [])

  const getCategory = async () => {
    try {
      const response = await Api.get('/categories')
      if (response.status === 200) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create Product</strong>
          </CCardHeader>
          <CCardBody>
            {error === true ? (
              <CAlert color="danger">
                {errorMsg.map((value, index) => {
                  return <p key={index}>{value}</p>
                })}
              </CAlert>
            ) : (
              ''
            )}
            <CForm
              id="create-form"
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
            >
              <CCol md={6}>
                <CFormLabel htmlFor="validationCustomName">Name</CFormLabel>
                <CFormInput
                  name="name"
                  type="text"
                  id="validationCustomName"
                  defaultValue=""
                  aria-describedby="inputGroupPrepend"
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="validationCustomPrice">Price</CFormLabel>
                <CFormInput
                  name="price"
                  type="number"
                  step="0.01"
                  id="validationCustomPrice"
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="validationCustomStock">Stock</CFormLabel>
                <CFormInput
                  name="stock"
                  type="number"
                  id="validationCustomStock"
                  onChange={handleChange}
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="validationCustomCategory">Category</CFormLabel>
                <CFormSelect
                  id="validationCustomCategory"
                  name="category_id"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((value, index) => {
                    return (
                      <option key={index} value={value.id}>
                        {value.name}
                      </option>
                    )
                  })}
                </CFormSelect>
                <CFormFeedback invalid>Please select a category.</CFormFeedback>
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" onClick={handleSubmit}>
                  Submit form
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateProduct
