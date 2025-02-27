/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Cookies from "js-cookie";
import { useCreatePostMutation } from "../../Store/Slice/apiSlice";
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Content is required"),
  isPrivate: Yup.boolean().nullable(),
});

const Modal = ({ onClose, label }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      isPrivate: false,
    },
  });

  const [createPost] = useCreatePostMutation();
  const onSubmit = async (data) => {
    try {
      const token = Cookies.get("accessToken");
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("isPrivate", data.isPrivate);
      if (data.filePath && data.filePath[0]) {
        formData.append("image", data.filePath[0]);
      }
      const response = await createPost({ data: formData, token });
      console.log(response.data.status);
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="h2" fontWeight="bold">
            Create New Post
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("title")}
              label="Title"
              fullWidth
              variant="outlined"
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              {...register("description")}
              label="Content"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ mb: 2 }}
            />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Post Image
              </Typography>
              <TextField
                {...register("filePath")}
                type="file"
                accept="image/*"
                fullWidth
                variant="outlined"
              />
            </Box>
            {watch("filePath") ? (
              <Box>
                <Button>Remove Image</Button>
              </Box>
            ) : (
              ""
            )}
            <FormControlLabel
              control={
                <Checkbox
                  {...register("isPrivate")}
                  checked={watch("isPrivate")}
                  color="primary"
                />
              }
              label={`Make ${label || "Profile"} Private`}
              sx={{ mb: 3 }}
            />

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                onClick={onClose}
                variant="outlined"
                color="secondary"
                sx={{
                  px: 3,
                  borderRadius: 1,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  px: 3,
                  borderRadius: 1,
                  textTransform: "none",
                }}
              >
                Create Post
              </Button>
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
