const Course = ({ course }) => {
  console.log('course props', course);
  const totalExercises = course.parts.reduce(
    (summ, part) => summ + part.exercises,
    0
  );
  return (
    <div>
      <h1>{course.name}</h1>
      <div>
        {course.parts.map(part => (
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>
        ))}
        <p>
          <b>total of {totalExercises} exercises</b>
        </p>
      </div>
    </div>
  );
};
export default Course;
