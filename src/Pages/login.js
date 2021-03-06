import React, { Component } from "react";
import {
	Box,
	Button,
	CircularProgress,
	Container,
	TextField,
	Typography,
} from "@material-ui/core";
import logo from "../media/logo_blue.png";
import { firebaseAuth, firestore } from "../firebase";

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			show_progress: false,
		};
		this.handleChange = this.handleChange.bind();
		this.login = this.login.bind();
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	login = () => {
		let valid_data = true;
		this.state.email_error = null;
		this.state.password_error = null;

		if (this.state.email === "") {
			this.state.email_error = "Required!";
			valid_data = false;
		}
		if (this.state.password === "") {
			this.state.password_error = "Required!";
			valid_data = false;
		}
		if (valid_data) {
			this.state.show_progress = true;
		}

		this.setState({
			update: true,
		});

		if (valid_data) {
			firestore
				.collection("USERS")
				.where("email", "==", this.state.email)
				.where("IsAdmin", "==", true)
				.get()
				.then((querySnapshot) => {
					if (!querySnapshot.empty) {
						firebaseAuth
							.signInWithEmailAndPassword(this.state.email, this.state.password)
							.then((res) => {
								this.props.history.replace("/");
							})
							.catch((err) => {
								if (err.code === "auth/wrong-password") {
									this.state.password_error = "Incorrect Password!";
								}
								this.setState({
									show_progress: false,
								});
							});
					} else {
						this.state.email_error = "Not Allowed!";
						this.setState({
							show_progress: false,
						});
					}
				});
		}
	};

	render() {
		return (
			<Container maxWidth="xs">
				<Box
					bgcolor="white"
					boxShadow="2"
					borderRadius="15px"
					textAlign="center"
					p="24px"
					mt="50px"
				>
					<img src={logo} height="150px" />
					<Typography variant="h5" color="textSecondary">
						ADMIN PANEL
					</Typography>
					<TextField
						label="Email"
						id="outlined-size-small"
						variant="outlined"
						fullWidth
						name="email"
						error={this.state.email_error != null}
						helperText={this.state.email_error}
						onChange={this.handleChange}
						margin="normal"
						color="secondary"
						size="small"
					/>
					<TextField
						label="Password"
						type="password"
						id="outlined-size-small"
						variant="outlined"
						color="secondary"
						fullWidth
						name="password"
						error={this.state.password_error != null}
						helperText={this.state.password_error}
						onChange={this.handleChange}
						margin="normal"
						size="small"
					/>
					<br />
					<br />
					{this.state.show_progress ? (
						<CircularProgress size={30} thickness={6} color="secondary" />
					) : null}
					<br />
					<br />
					<Button
						disableElevation
						variant="contained"
						onClick={this.login}
						color="primary"
						fullWidth
					>
						LOGIN
					</Button>
				</Box>
			</Container>
		);
	}
}

export default Login;

