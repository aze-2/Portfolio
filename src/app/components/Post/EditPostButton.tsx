// import React, { useState } from 'react'
// import { useRouter } from 'next/navigation';

// const EditPostButton = ({ postId }: { postId: string }) => {
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleEdit = () => {
//         setLoading(true)
//         router.push(`/post/${postId}/edit`)
//     }

//     return (
//     <div>
//     <div className='text-center mb-5'>
//         {loading ? (
//             <p>少々お待ちください・・・</p>
//         ) : (
//             <button
//                 className='w-full text-white bg-yellow-500 hover:brightness-110 rounded py-1 px-8'
//                 onClick={handleEdit}
//             >
//             編集       
//             </button>
//         )}
//     </div>
//     </div>
//   )
// }

// export default EditPostButton

import { useRouter } from "next/navigation";
import { MenuItem, Button, Spinner } from "@chakra-ui/react";
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
