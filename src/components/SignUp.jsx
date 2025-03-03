import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
} from "@mui/material";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSignUpMutation } from "../../Store/Slice/apiSlice";
import SnackBar from "./SnackBar";

const validationSchema = Yup.object({
  firstname: Yup.string()
    .required("First name is required")
    .min(2, "First name must have at least 2 characters"),
  lastname: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must have at least 2 characters"),
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  isPrivate: Yup.bool(),
});
const SignUp = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signUp] = useSignUpMutation();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      isPrivate: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await signUp(data);
      if (response.data?.message) {
        setOpen(true);
        setMessage(response.data.message);
        reset();
      }
      if (response.error?.data?.message) {
        setOpen(true);
        setMessage(response.error?.data?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <SnackBar open={open} message={message} set={handleClose} />
      <Box
        sx={{
          maxWidth: 400,
          margin: "auto",
          padding: "16px 36px",
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          User Registration
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="firstname"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                margin="normal"
                error={!!errors.firstname}
                helperText={errors.firstname?.message}
              />
            )}
          />
          <Controller
            name="lastname"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                margin="normal"
                error={!!errors.lastname}
                helperText={errors.lastname?.message}
              />
            )}
          />
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                margin="normal"
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Controller
            name="isPrivate"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox {...field} checked={field.value} color="primary" />
                }
                label="Private Profile"
              />
            )}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 1 }}
          >
            Sign Up
          </Button>
        </form>
        <Box sx={{ display: "flex", flexDirection: "column", paddingTop: 1 }}>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <NavLink to="/" style={{ color: "blue", textDecoration: "none" }}>
              Sign in
            </NavLink>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default SignUp;
