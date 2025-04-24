import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';

export async function DELETE(req: NextRequest) {
    const supabase = await createClient();

    try {
        const { postId, userId, imageUrl } = await req.json();

        if (!postId || !userId || !imageUrl) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // 指定された投稿を削除
        const { error: deleteError } = await supabase.from('posts').delete().eq('id', postId).eq('user_id', userId);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        // 画像の削除
        const fileName = imageUrl.split('/').slice(-1)[0];
        const { error: storageError } = await supabase.storage.from('posts').remove([`${userId}/${fileName}`]);

        if (storageError) {
            return NextResponse.json({ error: storageError.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
