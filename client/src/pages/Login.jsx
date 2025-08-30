import { useState } from "react";
import { useNavigate } from 'react-router-dom'; // 👈 make sure you're using react-router
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from 'primereact/dropdown';
        




export default function Login() {

	const navigate = useNavigate();

	const [data, setData] = useState({
		email: "",
		password: "",
		
	});

	const [showPassword, setShowPassword] = useState(false); // 👈 ADD THIS

	function handleChange(event) {
		const { name, value } = event.target;
		setData({
			...data,
			[name]: value,
		});
	}

		const roleOptions = [
		{ label: 'Student', value: 'student' },
		{ label: 'Teacher', value: 'teacher' }
	];



	const handleSubmit = async (e) => {
	e.preventDefault();

	try {
		const response = await fetch("http://localhost:5000/auth/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (response.ok) {
			const result = await response.json();
			alert("Login successful!");
			// Optionally store token in localStorage or cookie
			localStorage.setItem("token", result.token);
			navigate("/dashboard"); // 👈 redirect after login
		} else {
			alert("Login failed. Please check your credentials.");
		}
	} catch (error) {
		console.error("Login error:", error);
		alert("Something went wrong. Please try again.");
	}
};
	return (
		<div className="bg-[linear-gradient(106.37deg,_#ffe1bc_29.63%,_#ffcfd1_51.55%,_#f3c6f1_90.85%)] h-screen flex justify-center items-center  "
		>
			<div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
				<h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
					Welcome Back!
				</h2> 
				<form onSubmit={handleSubmit} className="space-y-4">

					{/* <div className="space-y-2">
						
						<Dropdown
							id="role"
							name="role"
							value={data?.role||""}
							options={roleOptions}
							onChange={handleChange}
							placeholder="Select Role"
							className="w-full"
						/>
					</div> */}
					<div className="p-inputgroup flex-1">
						<span className="p-inputgroup-addon">
							<i className="pi pi-envelope"></i>
						</span>
						<InputText
							id="email"
							name="email"
							value={data.email || ""}
							onChange={handleChange}
							placeholder="Email"
							required
							className="w-full focus:outline-none focus:ring-0 focus:border-transparent"

						/>
					</div>

					{/* Password */}
					<div className="space-y-2">
						<div className="p-inputgroup">
							<span className="p-inputgroup-addon">
								<i className="pi pi-lock" />
							</span>
							<InputText
								id="password"
								name="password"
								value={data.password}
								onChange={handleChange}
								placeholder="Password"
								// feedback={false}
								// inputStyle={{ width: "100%" }}
								// inputClassName="w-full border-none focus:ring-0"
								type={showPassword ? "text" : "password"}
								className="w-full"
								
								// 👇 This dynamically controls visibility via showPassword checkbox
								// inputProps={{
								// 	type: showPassword ? "text" : "password",
								// }}
							/>
						</div>

						{/* Show Password Checkbox */}
						<div className="flex items-center space-x-2 ml-1">
							<Checkbox
								inputId="showPass"
								checked={showPassword}
								onChange={(e) => setShowPassword(e.checked)}
							/>
							<label htmlFor="showPass" className="text-sm text-gray-700">
								Show password
							</label>

							<div className="ml-15 text-center">
							<a
								href="/reset-password"
								className="text-sm text-indigo-600 hover:underline"
							>
								Forgot Password?
							</a>
				</div>
						</div>
					</div>
					
					
					<button
						type="submit"
						className="w-full py-2 m-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium"
					>
						Login
					</button>
				</form>
				
				<div className="mt-2 text-center">
					<div className="text-sm text-gray-600 flex justify-center items-center space-x-2">
						<span>New User?</span>
						<a href="/register" className="text-indigo-600 hover:underline">
						Sign Up
						</a>
					</div>
				</div>

			</div>
		</div>
	);
}
