import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import { v4 as uuidv4 } from 'uuid';

export async function PUT(req: NextRequest) {
    const supabase = await createClient();

    const { data } = await supabase.auth.getUser()
    console.log(data)

    try {
        // const { postId, userId, imageUrl } = await req.json();

        // if (!postId || !userId || !imageUrl) {
        // const { title, address, image, content, imageUrl, userId } = await req.json();
        const formData = await req.formData();

        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });
        
        const title = formData.get('title') as string;
        const address = formData.get('address') as string;
        const content = formData.get('content') as string;
        const userId = formData.get('userId') as string;
        const image = formData.get('image') as File | null;
        const imageUrl = formData.get('imageUrl') as string;
        const postId = formData.get('postId') as string;

        if (!title || !address || !content || !userId ) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
        
        if (image && image.size > 0) {
        // 画像アップロード
        const { data: storageData, error: uploadError } = await supabase.storage
            .from('posts')
            .upload(`${userId}/${uuidv4()}`, image);
        
        if (uploadError || !storageData) {
            console.error("Upload error:", uploadError);
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
        }

        //古い画像削除
        if (imageUrl) {
        //ファイル名取得
        const fileName = imageUrl.split('/').slice(-1)[0];
        await supabase.storage.from('posts').remove([`${userId}/${fileName}`])
        }

        //画像のURLを取得
        const { data: urlData } = supabase.storage.from('posts').getPublicUrl(storageData.path)
                
        // imageUrl = urlData.publicUrl

        //ブログをアップデート
        const { error: updateError } = await supabase
            .from('posts')
            .update({
               title,
               address,
               content,
               image_url: urlData.publicUrl,
               user_id: userId,
            })
            .eq('id', postId)

            if (updateError) {
                alert(updateError.message)
                return NextResponse.json({ message: updateError.message }, { status: 500 });
            }

        return NextResponse.json({ message: 'Post edit successfully' }, { status: 200 });
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
