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
  Paper,
  Grid,
  Avatar,
} from "@mui/material";
import { Button } from "@mui/material";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Cookies from "js-cookie";
import {
  useUpdateUserMutation,
  useGetUserQuery,
} from "../../Store/Slice/apiSlice";

const validationSchema = Yup.object({
  firstname: Yup.string()
    .required("First Name is required")
    .min(3, "First name must have atleast 3 characters"),
  lastname: Yup.string()
    .required("Last Name is required")
    .min(3, "Last name must have atleast 3 characters"),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must have atleast 4 characters"),
  isPrivate: Yup.boolean(),
});
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [updateUser] = useUpdateUserMutation();
  let { data: userData } = useGetUserQuery();
  const [updateMessage, setUpdateMessage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      username: "",
      isPrivate: false,
    },
  });
  useEffect(() => {
    if (userData?.data) {
      setValue("firstname", userData.data.firstname || "");
      setValue("lastname", userData.data.lastname || "");
      setValue("username", userData.data.username || "");
      setValue("isPrivate", userData.data.isPrivate || false);
    }
  }, [userData, setValue]);
  const onSubmit = async (data) => {
    try {
      setError(null);
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No authentication token found");
      const response = await updateUser({ data, token }).unwrap();
      if (response.status === "success") {
        console.log("Profile updated successfully");
        setIsEditing(false);
      }
      if (response.status === "error") {
        console.log(response.message);
      }
    } catch (err) {
      setError(err.data?.message || "Failed to update profile");
    }
  };
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateMessage(null);
  };

  return (
    <Box sx={{ minHeight: "95vh", bgcolor: "#f5f5f5" }}>
      <Navbar />
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        {error ? (
          <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
            {error}
          </Typography>
        ) : !userData ? (
          <CircularProgress />
        ) : (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "#1976d2",
                    fontSize: 48,
                    fontWeight: "bold",
                  }}
                >
                  {`${watch("firstname")?.charAt(0)?.toUpperCase() || ""}${
                    watch("lastname")?.charAt(0)?.toUpperCase() || ""
                  }`}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" gutterBottom>
                  {watch("firstname")} {watch("lastname")}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  @{watch("username")}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={handleEditToggle}
                  sx={{ textTransform: "none" }}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: "flex", gap: 4 }}>
              <Typography variant="body1">
                <strong>Followers: 0</strong>
              </Typography>
              <Typography variant="body1">
                <strong>Following: 0</strong>
              </Typography>
              <Typography variant="body1">
                <strong>Posts: 0</strong>
              </Typography>
            </Box>
            <Box sx={{ mt: 4 }}>
              {isEditing ? (
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <TextField
                      {...register("firstname")}
                      autoComplete="given-name"
                      fullWidth
                      placeholder="Enter first name"
                      error={!!errors.firstname}
                      helperText={errors.firstname?.message}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <TextField
                      {...register("lastname")}
                      autoComplete="family-name"
                      fullWidth
                      placeholder="Enter last name"
                      error={!!errors.lastname}
                      helperText={errors.lastname?.message}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <TextField
                      {...register("username")}
                      fullWidth
                      placeholder="Enter username"
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register("isPrivate")}
                        checked={watch("isPrivate") || false}
                        color="primary"
                        name="isPrivate"
                        disabled={!isEditing}
                      />
                    }
                    label="Private Profile"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!isEditing}
                    sx={{ mt: 2 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="body1">
                    <strong>First Name:</strong> {userData.data.firstname}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Last Name:</strong> {userData.data.lastname}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Username:</strong> @{userData.data.username}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Profile Privacy:</strong>
                    {userData.data.isPrivate ? "Private" : "Public"}
                  </Typography>
                </Box>
              )}
            </Box>
            {updateMessage && (
              <Typography
                color="success.main"
                sx={{ mt: 2, textAlign: "center" }}
              >
                {updateMessage}
              </Typography>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
