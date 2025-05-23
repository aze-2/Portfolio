// app/api/createPost/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '../../../../utils/supabase/server';


export async function POST(req: NextRequest) {
    console.log('API endpoint hit');  // デバッグ用ログ

    const supabase = await createClient();

    const { data } = await supabase.auth.getUser()
      console.log(data)

    try {
        const formData = await req.formData();

        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        
        const title = formData.get('title') as string;
        const address = formData.get('address') as string;
        const content = formData.get('content') as string;
        const userId = formData.get('userId') as string;
        const image = formData.get('image') as File;
        const lat = formData.get('lat') as string;
        const lng = formData.get('lng') as string;

        if (!title || !content || !userId || !image) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // 画像アップロード
        const { data: storageData, error: storageError } = await supabase.storage
            .from('posts')
            .upload(`${userId}/${uuidv4()}`, image);

        if (storageError) {
            console.error('Storage Error:', storageError.message); // エラーログの追加
            return NextResponse.json({ message: storageError.message }, { status: 500 });
        }

        // 画像URL取得
        const { data: urlData } = await supabase.storage
            .from('posts')
            .getPublicUrl(storageData.path);

        if (!urlData.publicUrl) {
            console.error('URL Error:'); // エラーログの追加
            return NextResponse.json({ message: 'URL Error:' }, { status: 500 });
        }

        // ポストデータを挿入
        const { error: insertError } = await supabase
            .from('posts')
            .insert({
                title,
                address,
                content,
                image_url: urlData.publicUrl,
                user_id: userId,
                lat,
                lng,
            });

        if (insertError) {
            console.error('Insert Error:', insertError.message); // エラーログの追加
            return NextResponse.json({ message: insertError.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Post created successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error in POST request:', error);
        return new Response('Something went wrong', { status: 500 });
    }
}
