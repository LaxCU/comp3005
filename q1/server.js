const { Client } = require("pg");
const prompt = require("prompt-sync")();

//COnfig to connect to database

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

async function updateStudentEmail(studentId, newEmail) {
  try {
    await client.query(
      "UPDATE students SET email = $1 WHERE student_id = $2 RETURNING *",
      [newEmail, studentId]
    );

    console.log(`Student with id ${studentId} has their email updated!`);
  } catch (e) {
    console.log(e);
  }
}

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

// addStudent("Demo", "Student", "demo.student@example.com", "2023-09-02");

async function main() {
  await getAllStudents();

  console.log("===Adding a new student===");

  //Get student info
  let first_name = prompt("Please enter student first name: ");
  let last_name = prompt("Please enter student last name: ");
  let email = prompt("Please enter student email: ");
  let enrollment_date = prompt("Please enter student enrollment date: ");

  await addStudent(first_name, last_name, email, enrollment_date);

  console.log("===Updating a student");

  let studentId = prompt("Please enter student ID: ");
  let newEmail = prompt("Please enter new email: ");

  await updateStudentEmail(studentId, newEmail);

  console.log("Removing a student");

  studentId = prompt("Please enter student ID: ");

  await deleteStudent(studentId);

  //disconnect connection
  client.end();
}

main();
