/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
} from "@mui/material";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required."),
  description: Yup.string().required("Content is required."),
  isPrivate: Yup.boolean().nullable(),
});
const Modal = ({ open, onClose, label }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("accessToken");
      console.log(data);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("isPrivate", data.isPrivate || false);

      if (data.filePath && data.filePath[0]) {
        formData.append("image", data.filePath[0]); 
      }
      await axios.post("http://localhost:5000/posts/create-post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="modal">
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Create New Post</Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <TextField
            {...register("title")}
            label="Title"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
            margin="normal"
          />
          <TextField
            {...register("description")}
            label="description"
            fullWidth
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description?.message}
            margin="normal"
          />
          <FormControl>
            <FormLabel>Post Image</FormLabel>
            <TextField {...register("filePath")} type="file" />
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
            label={`Private ${label ? label : "Profile"}`}
          />
          <Box>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
};

export default Modal;
