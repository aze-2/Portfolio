import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import { v4 as uuidv4 } from 'uuid';

export async function Edit(req: NextRequest) {
    const supabase = await createClient();

    const { data } = await supabase.auth.getUser()
    console.log(data)

    try {
        // const { postId, userId, imageUrl } = await req.json();

        // if (!postId || !userId || !imageUrl) {
        const { title, address, image, content, imageUrl, userId } = await req.json();
        // const formData = await req.formData();

        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });
        
        // const title = formData.get('title') as string;
        // const address = formData.get('address') as string;
        // const content = formData.get('content') as string;
        // const userId = formData.get('userId') as string;
        // const image = formData.get('image') as File;

        if (!title || !address || !content || !userId || !image) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
        
        // 画像アップロード
        const { data: storageData } = await supabase.storage
            .from('posts')
            .upload(`${userId}/${uuidv4()}`, image);
        
        //ファイル名取得
        const fileName = imageUrl.split('/').slice(-1)[0];

        //古い画像削除
        await supabase.storage.from('posts').remove([`${userId}/${fileName}`])

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
            .eq('id', userId)

            if (updateError) {
                alert(updateError.message)
                return NextResponse.json({ message: updateError.message }, { status: 500 });
            }

        return NextResponse.json({ message: 'Post edit successfully' }, { status: 200 });

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
