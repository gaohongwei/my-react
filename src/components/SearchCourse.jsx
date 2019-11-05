import React, {Fragment} from 'react';

// This is fake database
function fakeDatabase(){
  const courses = [
    {name: 'c++', id: '001'},
    {name: 'java', id: '002'},
    {name: 'react', id: '003'},
  ]
  return courses;
}


function fetchData(pattern){
  return fakeDatabase().filter(x => x.name.includes(pattern))
}

function CourseList({courses}){
  let len = courses.length;
  if (len < 1) {
    return (<div>No courese</div>);
  } else {
    return (
      <ul>
        { courses.map( (course, index) =>
          <li key = {index} > {course.name} {course.id} </li>
         ) }
      </ul>
      );
  }
}

export default class SearchCourse extends React.Component {
  constructor(){
    super();
    this.state = {
      courses: [],
      query: ''
    }
  }

  queryChange = (event) => {
    let query = event.target.value;
    this.setState(
      {query: query}
      )
  }

  doSearch = (event) => {
    event.preventDefault();
    let query = this.state.query;
    let selecteddata = fetchData(query)
    this.setState(
      {courses: selecteddata}
      )
  }

  render(){
    return (
      <Fragment>
        <form>
          <input
             type="text"
             value={this.state.query}
             id="search-input"
             placeholder="Search..."
             onChange={this.queryChange}
          />

          <button onClick={this.doSearch} > Submit </button>
        </form>
        <CourseList courses={this.state.courses} />
      </Fragment>
      )
  }
}
