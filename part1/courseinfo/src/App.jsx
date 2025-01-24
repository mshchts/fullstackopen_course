// exercises 1.1 - 1.2 - 1.3 - 1.4 were done and overwritten with
// exercise 1.5
const Header = props => {
  return <h1>{props.course}</h1>;
};

const Part = props => {
  return (
    <p>
      {props.part} {props.exercise}
    </p>
  );
};

const Content = props => {
  // console.log('Content part1', props.parts[0]);
  return (
    <>
      <Part
        part={props.parts[0].name}
        exercise={props.parts[0].exercises}
      ></Part>
      <Part
        part={props.parts[1].name}
        exercise={props.parts[1].exercises}
      ></Part>
      <Part
        part={props.parts[2].name}
        exercise={props.parts[2].exercises}
      ></Part>
    </>
  );
};
const Total = props => {
  return (
    <p>
      Number of exercises{' '}
      {props.parts[0].exercises +
        props.parts[1].exercises +
        props.parts[2].exercises}
    </p>
  );
};
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name}></Header>
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default App;
