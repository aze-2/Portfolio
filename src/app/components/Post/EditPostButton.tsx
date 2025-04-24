
import { useRouter } from "next/navigation";
import { MenuItem, Spinner } from "@chakra-ui/react";
import { useState } from "react";

interface EditPostButtonProps {
  postId: string;
}

const EditPostButton = ({ postId }: EditPostButtonProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setLoading(true);
    router.push(`/post/${postId}/edit`);
  };

    return (
      <MenuItem onClick={handleEdit} isDisabled={loading} fontSize='xs'>
        {loading ? <Spinner size="sm" mr={2} /> : "編集"}
      </MenuItem>
    );

};

export default EditPostButton;
