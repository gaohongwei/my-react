let options = {
  data: {},
  headers: {
    'Accept': 'application/json'
  }
}
axios.get(url)
axios.post(url)
axios.delete(url)


axios.post(url, options)
  .then(res => {
    console.log(res);
    console.log(res.data);
  })
  .catch(error => {
    dispatch(fetchDesignFail(error));
  });


handleSubmit = async event => {
  event.preventDefault();

  // Promise is resolved and value is inside of the response const.
  const response = await API.delete(`users/${this.state.id}`);

  console.log(response);
  console.log(response.data);
};






