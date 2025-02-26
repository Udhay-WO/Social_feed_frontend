import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  TextField,
  FormLabel,
  CircularProgress,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Button } from "@mui/material";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";

const validationSchema = Yup.object({
  firstname: Yup.string().required("First Name is required."),
  lastname: Yup.string().required("Last Name is required."),
  username: Yup.string().required("UserName is required."),
  isPrivate: Yup.boolean(),
});
const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get(
          "http://localhost:5000/users/get-user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setValue("firstname", response.data.data.firstname);
        setValue("lastname", response.data.data.lastname);
        setValue("username", response.data.data.username);
        setValue("isPrivate", response.data.data.isPrivate);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("accessToken");
      await axios
        .put("http://localhost:5000/users/update-user", data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);
        });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Navbar />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : (
        <>
          <h1>Profile</h1>

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl>
              <FormLabel htmlFor="name">First name</FormLabel>
              <TextField
                {...register("firstname")}
                autoComplete="firstname"
                fullWidth
                placeholder="Enter first name"
                error={!!errors.name}
                helperText={errors.name?.message}
                color={errors.name ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">Last name</FormLabel>
              <TextField
                {...register("lastname")}
                autoComplete="lastname"
                fullWidth
                placeholder="Enter last name"
                error={!!errors.lastname}
                helperText={errors.lastname?.message}
                color={errors.lastname ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                {...register("username")}
                required
                fullWidth
                placeholder="Enter username"
                variant="outlined"
                error={!!errors.username}
                helperText={errors.username?.message}
                color={errors.username ? "error" : "primary"}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  {...register("isPrivate")}
                  checked={watch("isPrivate")}
                  color="primary"
                  name="isPrivate"
                />
              }
              label="Private Profile"
            />
            <Button type="submit" fullWidth variant="contained">
              Update Profile
            </Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default Profile;
