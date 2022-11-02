export const saveProduct = () => {
    return fetch(`/products`,{
        method: 'POST',
        body: JSON.stringify({})
      })
}
