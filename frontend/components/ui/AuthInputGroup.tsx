"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./input";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const AuthInputGroup = () => {
  const router = useRouter();
  const [inputs, setInputs] = useState([
    { input: "ID", value: "", type: "text" },
    { input: "Password", value: "", type: "password" },
  ]);
  const [role, setRole] = useState("student");

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newInputs = [...inputs];
    newInputs[index].value = e.target.value;
    setInputs(newInputs);
  };

  const handleSubmission = async () => {
    const payload = {
      identifier: inputs.find((i) => i.input === "ID")?.value,
      password: inputs.find((i) => i.input === "Password")?.value,
      role: role,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.role);

        switch (data.role.toLowerCase()) {
          case "student":
            router.push("/student/dashboard");
            break;
          case "instructor":
            router.push("/instructor/dashboard");
            break;
          case "admin":
            router.push("/admin/dashboard");
            break;
          default:
            router.push("/");
            break;
        }
      } else {
        console.error("Login failed:", data);
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-16">
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="lg:w-[400px] py-6">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="instructor">Instructor</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-6">
        {inputs.map(({ input, value, type }, index) => (
          <Input
            className="lg:w-[400px] py-6"
            type={type}
            value={value}
            placeholder={input}
            key={input}
            onChange={(e) => handleChange(index, e)}
          />
        ))}
      </div>
      <Button
        className="cursor-pointer min-w-[150px] py-6 mt-4"
        disabled={!!inputs.find((input) => input.value === "")}
        onClick={handleSubmission}
      >
        Login
      </Button>
    </div>
  );
};

export default AuthInputGroup;
