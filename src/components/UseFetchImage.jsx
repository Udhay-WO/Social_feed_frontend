import { useEffect, useState } from "react";
import { useGetImagePostQuery } from "../../Store/Slice/apiSlice";

const useFetchImage = (postId) => {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data, isError } = useGetImagePostQuery(postId);

  useEffect(() => {
    if (data) {
      setImageData(data);
      setIsLoading(false);
    }
    if (isError) {
      setError("Failed to fetch image");
      setIsLoading(false);
    }
  }, [data, isError]);

  return { imageData, isLoading, error };
};

export default useFetchImage;
