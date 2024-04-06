const { Client } = require("pg");
const prompt = require("prompt-sync")();

//Config to connect to database
//Please update them to your configuration
const client = new Client({
  host: "localhost",
  user: "postgres",
  database: "a3",
  password: "rootUser",
  port: 5432,
});

//Connect to DB
client.connect();

// Function to retrieve all students
async function getAllStudents() {
  try {
    const res = await client.query("SELECT * FROM students");
    for (let row of res.rows) {
      console.log(
        `${row.student_id}\t${row.first_name}\t${row.last_name}\t\t${row.email}\t\t${row.enrollment_date}`
      );
    }
  } catch (e) {
    console.log(e);
  }
}

//testing

//testing 2
//Function to add a new student to the database
async function addStudent(first_name, last_name, email, enrollment_date) {
  try {
    await client.query(
      "INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, email, enrollment_date]
    );

    console.log(`${first_name} ${last_name} has been added!`);
  } catch (e) {
    console.log(e);
  }
}

//Update a student email based on studentId
async function updateStudentEmail(studentId, newEmail) {
  try {
    await client.query("UPDATE students SET email = $1 WHERE student_id = $2", [
      newEmail,
      studentId,
    ]);

    console.log(`Student with id ${studentId} has their email updated!`);
  } catch (e) {
    console.log(e);
  }
}

//Delete a student based on studentId
async function deleteStudent(studentId) {
  try {
    await client.query("DELETE FROM students WHERE student_id = $1", [
      studentId,
    ]);

    console.log(`Student with id ${studentId} has been deleted!`);
  } catch (e) {
    console.log(e);
  }
}

//Calls the all other functions
async function main() {
  console.log("===Get All Students===");
  await getAllStudents();

  console.log("\n\n===Adding a new student===");

  //Get student info to add a new student
  let first_name = prompt("Please enter student first name: ");
  let last_name = prompt("Please enter student last name: ");
  let email = prompt("Please enter student email: ");
  let enrollment_date = prompt("Please enter student enrollment date: ");

  await addStudent(first_name, last_name, email, enrollment_date);

  console.log("\n\n===Updating a student");

  //Get info to update student info
  let studentId = prompt("Please enter student ID: ");
  let newEmail = prompt("Please enter new email: ");

  await updateStudentEmail(studentId, newEmail);

  console.log("\n\n===Removing a student===");

  //Get studentId to delete a student
  studentId = prompt("Please enter student ID: ");

  await deleteStudent(studentId);

  //close the connection
  client.end();
}

main();
