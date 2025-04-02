'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeletePostButtonProps = {
    postId: string;
    userId: string;
    imageUrl: string;
};

const DeletePostButton = ({ postId, userId, imageUrl }: DeletePostButtonProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const deletePost = async () => {
        setLoading(true);

        try {
            const res = await fetch('/api/deletePost', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId, imageUrl }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.error || '削除に失敗しました');
                setLoading(false);
                return;
            }

            router.push('/user');
            router.refresh();
        } catch (error) {
            alert('エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='text-center mb-5'>
            {loading ? (
                <p>少々お待ちください・・・</p>
            ) : (
                <div className='w-full text-white bg-yellow-500 hover:brightness-110 rounded py-1 px-8 cursor-pointer' onClick={deletePost}>
                    削除
                </div>
            )}
        </div>
    );
};

export default DeletePostButton;
