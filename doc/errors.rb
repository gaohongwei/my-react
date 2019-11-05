#####   Uncaught TypeError: x.map is not a function  #####
  x is not an array
  Check how the props are passed into child component, use {}
#####  A new Component is created after clicking a button  #####
    event.preventDefault();
#####   Uncaught ReferenceError: props is not defined  #####
Use this.props

#####   Objects are not valid as a React child  #####
fetch(url)
  .then((response) => {
    return response.json()})
  .then((response) => {
    this.setState(response);
  })
  .catch(error => {
    this.setState(error);
  })
