import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState("true");

  const decodeToken = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const decodedToken = decodeToken(token);
      if (decodedToken.roles && decodedToken.roles.includes("ADMIN")) {
        fetchEmployees();
      } else {
        navigate("/login");
      }
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/employees", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);

        console.log(data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching employees : ", error.message);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/employee/${employeeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        setEmployees((preEmployees) =>
          preEmployees.filter((employee) => employee.id !== employeeId)
        );
        console.log(`Employee with ID ${employeeId} deleted successfully`);
      } else {
        console.error("Delete unsuccessfully", response.statusText);
      }
    } catch (error) {
      console.error("Delete unsuccessfully", error.message);
    }
  };

  const handleUpdate = (employeeId) => {
    navigate(`/employee/${employeeId}`);
  };



  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col>
            <h1 className="text-center">Employees</h1>
            <Table striped border hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.department}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleUpdate(employee.id)}
                      >
                        Update
                      </Button>{" "}
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
